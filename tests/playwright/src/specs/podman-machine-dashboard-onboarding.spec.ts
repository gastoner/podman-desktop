/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import * as os from 'node:os';

import type { Page } from '@playwright/test';
import { expect as playExpect, test } from '@playwright/test';

import { WelcomePage } from '../model/pages/welcome-page';
import { NavigationBar } from '../model/workbench/navigation';
import { PodmanDesktopRunner } from '../runner/podman-desktop-runner';
import { deletePodmanMachine } from '../utility/operations';

let pdRunner: PodmanDesktopRunner;
let page: Page;
const PODMAN_MACHINE_NAME = 'Podman Machine';

test.skip(
  os.platform() === 'linux' || process.env.TEST_PODMAN_MACHINE !== 'true',
  'Tests suite should not run on Linux platform',
);

test.beforeAll(async () => {
  pdRunner = new PodmanDesktopRunner();
  page = await pdRunner.start();
  pdRunner.setVideoAndTraceName('podman-machine-dashboard');

  await new WelcomePage(page).handleWelcomePage(true);

  if (
    (process.env.TEST_PODMAN_MACHINE !== undefined && process.env.TEST_PODMAN_MACHINE === 'true') ||
    (process.env.MACHINE_CLEANUP !== undefined && process.env.MACHINE_CLEANUP === 'true')
  ) {
    await deletePodmanMachine(page, PODMAN_MACHINE_NAME);
  }
});

test.afterAll(async () => {
  await pdRunner.close();
});

test.describe.serial(`Podman machine onboarding from Dashboard`, () => {
  test('Create Podman machine from Dashboard', async () => {
    test.setTimeout(320000);

    console.log('Starting PD dashboard test');
    const navigationBar = new NavigationBar(page);
    const dashboardPage = await navigationBar.openDashboard();
    await playExpect(dashboardPage.podmanInitilizeAndStartButton).toBeEnabled({ timeout: 60000 });
    await dashboardPage.podmanInitilizeAndStartButton.click();
    await playExpect(dashboardPage.podmanStatusLabel).toHaveText('RUNNING', { timeout: 300000 });
  });

  test('Clean Up Podman Machine', async () => {
    test.skip(process.env.MACHINE_CLEANUP !== 'true', 'Machine cleanup is disabled');
    await deletePodmanMachine(page, PODMAN_MACHINE_NAME);
  });
});