#!/usr/bin/env tsx
/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import { Octokit } from '@octokit/rest';
import { components } from '@octokit/openapi-types';
import * as fs from 'fs';
import mustache from 'mustache';

type Issue = components['schemas']['issue'];
type Milestone = components['schemas']['milestone'];

interface HighlitedPR {
  title: string;
  shortDesc: string;
  longDesc: string;
}

interface Author {
  username: string;
  link: string;
}

interface PRInfo {
  title: string;
  author: Author;
  number: number;
  link: string;
  created_at?: string;
}

interface PRCategory {
  category: string;
  prs: PRInfo[];
}

class ReleaseNotesPreparator {
  private octokit;
  constructor(
    private token: string,
    private organization: string,
    private repo: string,
    private milestone: string,
    private username: string,
    private model: string | undefined,
  ) {
    this.octokit = new Octokit({ auth: token });
  }

  private async generateMD(
    changelog: PRCategory[],
    firstTimeContributors: PRInfo[],
    highlighted: HighlitedPR[],
  ): Promise<void> {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const version = this.milestone.slice(0, -2);
    const releaseNotesTemplate = fs.readFileSync('./scripts/release-notes/release-notes.mustache', 'utf8');
    const renderedMarkdown = mustache.render(releaseNotesTemplate, {
      firstTimeContributors: firstTimeContributors,
      changelog: changelog,
      highlighted: highlighted,
      version: version,
      username: this.username,
    });
    const filename = `website/blog/${formattedDate}-release-${version}.md`;
    await fs.promises.writeFile(filename, renderedMarkdown, {
      flag: 'w+',
    });
    console.log(`${filename} was created!`);
  }

  // Count all PRs in given milestone for each user
  private async getMilestonePRs(prs: Issue[]): Promise<{ [key: string]: number }> {
    const result: { [key: string]: number } = {};
    for (const issue of prs) {
      if (issue.pull_request) {
        const author = issue.user?.login;
        if (author) {
          if (!result[author]) result[author] = 0;
          result[author]++;
        }
      }
    }
    return result;
  }

  private async isNewContributor(username: string, contributorsMap, milestoneCommits): Promise<boolean> {
    const totalCommits = contributorsMap[username] || 0;
    const milestoneCount = milestoneCommits[username] || 0;
    return totalCommits === milestoneCount && totalCommits > 0;
  }

  private async getFirstTimeContributors(prs: Issue[]): Promise<PRInfo[]> {
    const firstTimeContributorsMap: { [username: string]: PRInfo } = {};
    // Get all contibutors in repo
    const contributors = await this.octokit.rest.repos.listContributors({
      owner: this.organization,
      repo: this.repo,
      per_page: 100,
    });

    const contributorsMap = contributors.data.reduce((acc: { [key: string]: number }, contributor) => {
      if (contributor.login) {
        acc[contributor.login] = contributor.contributions;
      }
      return acc;
    }, {});

    const usersMilestonePRs = await this.getMilestonePRs(prs);

    for (const pr of prs) {
      if (!pr.user) continue;
      const username = pr.user.login;

      const isNewContributor = await this.isNewContributor(username, contributorsMap, usersMilestonePRs);
      if (!isNewContributor) continue;

      const newPRInfo: PRInfo = {
        title: pr.title,
        author: {
          username: username,
          link: pr.user.html_url,
        },
        number: pr.number,
        link: pr.html_url,
        created_at: pr.created_at,
      };

      if (firstTimeContributorsMap[username]) {
        // Get only the oldest one
        if (new Date(newPRInfo.created_at) > new Date(firstTimeContributorsMap[username].created_at)) {
          firstTimeContributorsMap[username] = newPRInfo;
        }
      } else {
        firstTimeContributorsMap[username] = newPRInfo;
      }
    }

    // Vrátíme pole PRInfo z naší mapy
    return Object.values(firstTimeContributorsMap);
  }

  private async getPRsByMilestone(owner: string, repo: string, milestoneTitle: string): Promise<Issue[]> {
    // Get all Milestones
    const { data: milestones } = await this.octokit.rest.issues.listMilestones({
      owner,
      repo,
    });

    const milestone: Milestone = milestones.find(m => m.title === milestoneTitle);
    if (!milestone) {
      throw new Error(
        `Milestone '${milestoneTitle}' was not found in: [${milestones.map(milestone => milestone.title)}]`,
      );
    }

    let page = 1;
    let prs: Issue[] = [];
    while (true) {
      const { data: issues } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        milestone: milestone.number.toString(),
        state: 'closed',
        per_page: 100,
        page: page,
      });

      if (issues.length === 0) break;
      prs.push(...issues);
      page++;
    }

    // Filter our only PRs and PRs created by an user
    prs = prs.filter(
      issue =>
        issue.pull_request &&
        issue.user &&
        issue.user.type !== 'Bot' &&
        issue.user.login !== 'podman-desktop-bot' &&
        issue.user.login !== 'step-security-bot',
    );

    return prs;
  }

  public async generate(): Promise<void> {
    let prs: Issue[] = await this.getPRsByMilestone(this.organization, this.repo, this.milestone);
    const firstTimeContributorPRs = await this.getFirstTimeContributors(prs);
    const categorizedPRsMap: Record<string, PRCategory> = {};

    for (const pr of prs) {
      const match = pr.title.match(/^\s*(chore|feat|docs|fix|refactor|test|ci)/i);
      if (!match) {
        // Skip others
        continue;
      }

      if (!pr.user) {
        continue;
      }

      let category = match[1].toLowerCase();

      // e.g. chore(test): or feat(tests):
      const matchTest = pr.title.match(/\(test/i);
      if (matchTest) {
        category = 'test';
      }

      const prInfo: PRInfo = {
        title: pr.title,
        author: {
          username: pr.user.login,
          link: pr.user.html_url,
        },
        number: pr.number,
        link: pr.html_url,
      };

      if (!categorizedPRsMap[category]) {
        categorizedPRsMap[category] = {
          category: category,
          prs: [],
        };
      }

      categorizedPRsMap[category].prs.push(prInfo);
    }

    const changelog: PRCategory[] = Object.values(categorizedPRsMap);

    if (!this.model) {
      // skip generating higlited PRs
      return await this.generateMD(changelog, firstTimeContributorPRs, []);
    }

    // Generating highlited features
    prs = prs.map(pr => ({ ...pr, body: pr.body ? pr.body.replace(/### Screenshot \/ video of UI[\s\S]*/, '') : '' }));
    const features = prs.filter(
      issue => issue.pull_request && issue.title.startsWith('feat') && issue.title.startsWith('chore'),
    );
    const content = features.map((pr, index) => `PR${index + 1}: ${pr.title} - ${pr.body}\n}`).join('');

    const body = {
      model: this.model,
      stream: false,
      prompt: `Instruction: Identify the 4 most interesting PRs from the list provided. For each of them, generate the following: An original title (do not use prefix like "prefix:" or just copy the original PR title) - example: "Experimental dashboard for Kubernetes containers". A short description of exactly 1-2 sentences. A long description of exactly 2 to 4 sentences. Be creative dont just copy text from PRs, and dont use word PR in the longDesc and shortDesc. DATA: ${content}`,
      format: {
        type: 'object',
        properties: {
          prs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                shortDesc: { type: 'string' },
                longDesc: { type: 'string' },
              },
              required: ['title', 'shortDesc', 'longDesc'],
            },
          },
        },
        required: ['prs'],
      },
    };

    await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(async response => {
        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
          return [];
        }

        try {
          const prs = JSON.parse((await response.json()).response).prs;
          return prs;
        } catch (e: unknown) {
          // We didn't get data from correct JSON format
          console.error(
            `Got error ${e}.\nGenerated data from AI was not valid JSON format, generating release notes without highlights.`,
          );
          return [];
        }
      })
      .then(async result => {
        // Generate the output with highlited features
        await this.generateMD(changelog, firstTimeContributorPRs, result as HighlitedPR[]);
      })
      .catch(async (error: unknown) => {
        // Generate the output without highlited features
        console.error(`Fetch error: ${error}\nGenerating release notes without highlights.`);
        await this.generateMD(changelog, firstTimeContributorPRs, []);
      });
  }
}

async function run(): Promise<void> {
  let token = process.env.GITHUB_TOKEN;
  token ??= process.env.GH_TOKEN;
  const args = process.argv.slice(2);
  let organization = 'podman-desktop';
  let repo = 'podman-desktop';
  let model: string | undefined = undefined;
  let api_key = process.env.API_KEY ?? '';
  let milestone: string = '';
  let username = process.env.GITHUB_USERNAME;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--token') {
      token = args[++i];
    } else if (args[i] === '--org') {
      organization = args[++i];
    } else if (args[i] === '--skip_highlited') {
      api_key = args[++i];
    } else if (args[i] === '--repo') {
      repo = args[++i];
    } else if (args[i] === '--username') {
      username = args[++i];
    } else if (args[i] === '--milestone') {
      milestone = args[++i];
    } else if (args[i] === '--model') {
      model = args[++i];
    }
  }
  if (token && username) {
    if (!model) {
      console.log('Generating release notes without highlited PRs');
    }
    await new ReleaseNotesPreparator(token, organization, repo, milestone, username, model).generate();
  } else {
    console.log('No token or username found. Use either GITHUB_TOKEN, GITHUB_USERNAME or pass it as an argument');
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
