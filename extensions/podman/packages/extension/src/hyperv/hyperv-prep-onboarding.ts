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

import type { Disposable, TelemetryLogger } from '@podman-desktop/api';
import { commands, context, env } from '@podman-desktop/api';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';

import {
  HYPERV_PREP_AVAILABLE_ONBOARDING_KEY,
  HYPERV_PREP_ONBOARDING_CHECK_COMMAND,
  HYPERV_PREP_ONBOARDING_COMMAND,
  HYPERV_PREP_ONBOARDING_SKIP_COMMAND,
  HYPERV_PREP_OUTCOME_ONBOARDING_KEY,
  HYPERV_PREP_SUMMARY_ONBOARDING_KEY,
} from '/@/constants';
import { HyperVPrep } from '/@/hyperv/hyperv-prep';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';
import { WinPlatform } from '/@/platforms/win-platform';

@injectable()
export class HyperVPrepOnboarding {
  #disposables: Disposable[] = [];

  constructor(
    @inject(HyperVPrep) private readonly hyperVPrep: HyperVPrep,
    @inject(WinPlatform) private readonly winPlatform: WinPlatform,
    @inject(TelemetryLoggerSymbol) private readonly telemetryLogger: TelemetryLogger,
  ) {}

  @postConstruct()
  init(): void {
    this.#disposables.push(
      commands.registerCommand(HYPERV_PREP_ONBOARDING_CHECK_COMMAND, this.checkHyperVPrep.bind(this)),
      commands.registerCommand(HYPERV_PREP_ONBOARDING_COMMAND, this.runOnboardingHyperVPrep.bind(this)),
      commands.registerCommand(HYPERV_PREP_ONBOARDING_SKIP_COMMAND, this.skipOnboardingHyperVPrep.bind(this)),
    );
  }

  @preDestroy()
  dispose(): void {
    this.#disposables.forEach(disposable => {
      disposable.dispose();
    });
    this.#disposables = [];
  }

  async checkHyperVPrep(): Promise<void> {
    this.setOnboardingStatus(false, '', 'pending');
    if (!env.isWindows) {
      return;
    }

    try {
      const supported = await this.hyperVPrep.isSupported();
      if (!supported) {
        // Refresh the global keys because Podman may have been installed during onboarding.
        await this.hyperVPrep.refreshContext();
        return;
      }

      if (!(await this.winPlatform.isHyperVInstalledAndRunning())) {
        return;
      }

      const status = await this.hyperVPrep.refreshContext();
      this.setOnboardingStatus(
        true,
        status?.summary ?? 'Hyper-V preparation status could not be confirmed.',
        'pending',
      );
    } catch (error) {
      this.telemetryLogger.logError('hypervPrepOnboardingStatusCheckFailed', { error });
    }
  }

  async runOnboardingHyperVPrep(): Promise<void> {
    const status = await this.hyperVPrep.prepare(HYPERV_PREP_ONBOARDING_COMMAND, { showCompletionMessage: false });
    if (status?.status === 'applied') {
      context.setValue(HYPERV_PREP_OUTCOME_ONBOARDING_KEY, 'prepared', 'onboarding');
      return;
    }

    await this.checkHyperVPrep();
  }

  skipOnboardingHyperVPrep(): void {
    context.setValue(HYPERV_PREP_OUTCOME_ONBOARDING_KEY, 'skipped', 'onboarding');
    this.telemetryLogger.logUsage(HYPERV_PREP_ONBOARDING_SKIP_COMMAND, {});
  }

  private setOnboardingStatus(available: boolean, summary: string, outcome: 'pending' | 'prepared' | 'skipped'): void {
    context.setValue(HYPERV_PREP_AVAILABLE_ONBOARDING_KEY, available, 'onboarding');
    context.setValue(HYPERV_PREP_SUMMARY_ONBOARDING_KEY, summary, 'onboarding');
    context.setValue(HYPERV_PREP_OUTCOME_ONBOARDING_KEY, outcome, 'onboarding');
  }
}
