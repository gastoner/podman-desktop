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

import type { TelemetryLogger } from '@podman-desktop/api';
import * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
  HYPERV_PREP_ONBOARDING_CHECK_COMMAND,
  HYPERV_PREP_ONBOARDING_COMMAND,
  HYPERV_PREP_ONBOARDING_SKIP_COMMAND,
  HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
  HYPERV_PREP_SUMMARY_ONBOARDING_KEY,
} from '/@/constants';
import type { HyperVPrep } from '/@/hyperv/hyperv-prep';
import { HyperVPrepOnboarding } from '/@/hyperv/hyperv-prep-onboarding';
import type { WinPlatform } from '/@/platforms/win-platform';

vi.mock(import('@podman-desktop/api'));

const prep = {
  isSupported: vi.fn(),
  refreshContext: vi.fn(),
  prepare: vi.fn(),
} as unknown as HyperVPrep;

const winPlatform = {
  isHyperVInstalledAndRunning: vi.fn(),
} as unknown as WinPlatform;

const telemetryLogger = {
  logError: vi.fn(),
  logUsage: vi.fn(),
} as unknown as TelemetryLogger;

function createService(): HyperVPrepOnboarding {
  return new HyperVPrepOnboarding(prep, winPlatform, telemetryLogger);
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(extensionApi.env).isWindows = true;
  vi.mocked(prep.isSupported).mockResolvedValue(true);
  vi.mocked(prep.refreshContext).mockResolvedValue({
    status: 'notApplied',
    isGroupMember: false,
    hasRegistryEntries: false,
    summary: 'Not prepared',
  });
  vi.mocked(winPlatform.isHyperVInstalledAndRunning).mockResolvedValue(true);
  vi.mocked(extensionApi.commands.registerCommand).mockReturnValue({ dispose: vi.fn() });
});

describe('HyperVPrepOnboarding', () => {
  test('registers and disposes onboarding commands', () => {
    const disposable = { dispose: vi.fn() };
    vi.mocked(extensionApi.commands.registerCommand).mockReturnValue(disposable);
    const service = createService();
    service.init();

    expect(extensionApi.commands.registerCommand).toHaveBeenCalledWith(
      HYPERV_PREP_ONBOARDING_CHECK_COMMAND,
      expect.any(Function),
    );
    expect(extensionApi.commands.registerCommand).toHaveBeenCalledWith(
      HYPERV_PREP_ONBOARDING_COMMAND,
      expect.any(Function),
    );
    expect(extensionApi.commands.registerCommand).toHaveBeenCalledWith(
      HYPERV_PREP_ONBOARDING_SKIP_COMMAND,
      expect.any(Function),
    );

    service.dispose();
    expect(disposable.dispose).toHaveBeenCalledTimes(3);
  });

  test('does not perform Windows checks on other platforms', async () => {
    vi.mocked(extensionApi.env).isWindows = false;
    const service = createService();

    await service.checkHyperVPrep();

    expect(prep.isSupported).not.toHaveBeenCalled();
    expect(winPlatform.isHyperVInstalledAndRunning).not.toHaveBeenCalled();
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      false,
      'onboarding',
    );
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
      'pending',
      'onboarding',
    );
  });

  test('does not offer preparation when Hyper-V is unavailable', async () => {
    vi.mocked(winPlatform.isHyperVInstalledAndRunning).mockResolvedValue(false);
    const service = createService();

    await service.checkHyperVPrep();

    expect(prep.refreshContext).not.toHaveBeenCalled();
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      false,
      'onboarding',
    );
  });

  test('publishes the availability state and summary for unapplied preparation', async () => {
    const service = createService();

    await service.checkHyperVPrep();

    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      true,
      'onboarding',
    );
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_SUMMARY_ONBOARDING_KEY,
      'Not prepared',
      'onboarding',
    );
  });

  test('does not offer preparation when status is already applied', async () => {
    vi.mocked(prep.refreshContext).mockResolvedValue({
      status: 'applied',
      isGroupMember: true,
      hasRegistryEntries: true,
      summary: 'Prepared',
    });
    const service = createService();

    await service.checkHyperVPrep();

    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      true,
      'onboarding',
    );
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_SUMMARY_ONBOARDING_KEY,
      'Prepared',
      'onboarding',
    );
  });

  test('keeps the onboarding action available after a status failure', async () => {
    vi.mocked(prep.refreshContext).mockResolvedValue(undefined);
    const service = createService();

    await service.checkHyperVPrep();

    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
      true,
      'onboarding',
    );
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_SUMMARY_ONBOARDING_KEY,
      'Hyper-V preparation status could not be confirmed.',
      'onboarding',
    );
  });

  test('sets the prepared outcome only after confirmed preparation', async () => {
    vi.mocked(prep.prepare).mockResolvedValue({
      status: 'applied',
      isGroupMember: true,
      hasRegistryEntries: true,
      summary: 'Prepared',
    });
    const service = createService();

    await service.runOnboardingHyperVPrep();

    expect(prep.prepare).toHaveBeenCalledWith(HYPERV_PREP_ONBOARDING_COMMAND, { showCompletionMessage: false });
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
      'prepared',
      'onboarding',
    );
    expect(prep.refreshContext).not.toHaveBeenCalled();
  });

  test('leaves outcome pending after cancelled or unconfirmed preparation', async () => {
    vi.mocked(prep.prepare).mockResolvedValue(undefined);
    const service = createService();

    await service.runOnboardingHyperVPrep();

    expect(prep.refreshContext).toHaveBeenCalledOnce();
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
      'pending',
      'onboarding',
    );
  });

  test('skip completes onboarding without invoking preparation', () => {
    const service = createService();

    service.skipOnboardingHyperVPrep();

    expect(prep.prepare).not.toHaveBeenCalled();
    expect(extensionApi.context.setValue).toHaveBeenCalledWith(
      HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
      'skipped',
      'onboarding',
    );
  });
});
