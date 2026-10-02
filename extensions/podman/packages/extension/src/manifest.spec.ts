/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { expect, test } from 'vitest';

import manifest from '../package.json';

test('binary path has an explicit label without changing its configuration contract', () => {
  expect(manifest.contributes.configuration.properties['podman.binary.path']).toEqual({
    displayName: 'Path to Podman Binary',
    type: 'string',
    format: 'file',
    default: '',
    description: 'Custom path to Podman binary (Default is blank)',
  });
});

test('Hyper-V preparation onboarding is offered before machine creation and can be skipped', () => {
  const steps = manifest.contributes.onboarding.steps;
  const checkIndex = steps.findIndex(step => step.id === 'checkHyperVPrepCommand');
  const prepIndex = steps.findIndex(step => step.id === 'hypervPrepView');
  const createMachineIndex = steps.findIndex(step => step.id === 'createPodmanMachineCommand');

  expect(checkIndex).toBeGreaterThan(-1);
  expect(prepIndex).toBeGreaterThan(checkIndex);
  expect(createMachineIndex).toBeGreaterThan(prepIndex);
  expect(steps[checkIndex]).toMatchObject({
    command: 'podman.onboarding.checkHyperVPrep',
    completionEvents: ['onCommand:podman.onboarding.checkHyperVPrep'],
  });
  expect(steps[prepIndex]).toMatchObject({
    when: expect.stringContaining('onboardingContext:hypervPrepAvailable'),
  });
  expect(steps[prepIndex]?.completionEvents).toBeUndefined();
  const prepContent = steps[prepIndex]?.content?.flatMap(row => row);
  const pendingContent = prepContent?.find(item => item.when === 'onboardingContext:hypervPrepOutcome == pending');
  expect(pendingContent?.value).toContain('${onboardingContext:hypervPrepSummary}');
  expect(pendingContent?.value).toContain('command=podman.onboarding.hypervPrep');
  expect(pendingContent?.value).toContain('command=podman.onboarding.skipHyperVPrep');
  expect(pendingContent?.value?.indexOf('${onboardingContext:hypervPrepSummary}')).toBeLessThan(
    pendingContent?.value?.indexOf('command=podman.onboarding.hypervPrep') ?? -1,
  );
  expect(prepContent).toHaveLength(3);
  expect(prepContent).toHaveLength(3);
  expect(pendingContent?.value?.indexOf('${onboardingContext:hypervPrepSummary}')).toBeLessThan(
    pendingContent?.value?.indexOf('command=podman.onboarding.hypervPrep') ?? -1,
  );
  expect(prepContent).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ value: expect.stringContaining('command=podman.onboarding.hypervPrep') }),
      expect.objectContaining({ value: expect.stringContaining('command=podman.onboarding.skipHyperVPrep') }),
      expect.objectContaining({
        value: expect.stringContaining('Sign out of Windows'),
        when: 'onboardingContext:hypervPrepOutcome == prepared',
      }),
    ]),
  );
});
