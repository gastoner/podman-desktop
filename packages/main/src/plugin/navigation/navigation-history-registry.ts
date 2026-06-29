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

import type { NavigationHistoryEntry, NavigationHistoryPosition, NavigationHistoryProvider } from '@podman-desktop/api';
import type { NavigationHistoryPositionInfo } from '@podman-desktop/core-api';
import { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';

import { IPCHandle } from '/@/plugin/api.js';
import { Emitter } from '/@/plugin/events/emitter.js';

interface NavigationHistoryProviderEntry {
  extensionId: string;
  emitter: Emitter<NavigationHistoryEntry>;
  positionEmitter: Emitter<NavigationHistoryPosition>;
}

@injectable()
export class NavigationHistoryRegistry {
  #providers = new Map<string, NavigationHistoryProviderEntry>();

  constructor(
    @inject(ApiSenderType)
    private apiSender: ApiSenderType,
    @inject(IPCHandle)
    private readonly ipcHandle: IPCHandle,
  ) {}

  @postConstruct()
  init(): void {
    this.ipcHandle(
      'navigation-history:navigateToEntry',
      async (_listener: unknown, extensionId: string, route: string): Promise<void> => {
        this.navigateToEntry(extensionId, route);
      },
    );

    this.ipcHandle(
      'navigation-history:updatePosition',
      async (_listener: unknown, positionInfo: NavigationHistoryPositionInfo): Promise<void> => {
        this.updatePosition(positionInfo);
      },
    );
  }

  @preDestroy()
  dispose(): void {
    for (const [, entry] of this.#providers) {
      entry.emitter.dispose();
      entry.positionEmitter.dispose();
    }
    this.#providers.clear();
  }

  registerProvider(extensionId: string): NavigationHistoryProvider {
    if (this.#providers.has(extensionId)) {
      throw new Error(`Navigation history provider already registered for extension ${extensionId}`);
    }

    const emitter = new Emitter<NavigationHistoryEntry>();
    const positionEmitter = new Emitter<NavigationHistoryPosition>();
    const providerEntry: NavigationHistoryProviderEntry = {
      extensionId,
      emitter,
      positionEmitter,
    };
    this.#providers.set(extensionId, providerEntry);

    return {
      pushEntry: (entry: NavigationHistoryEntry): void => {
        this.apiSender.send('navigation-history-push', {
          extensionId,
          name: entry.name,
          route: entry.route,
          icon: entry.icon,
        });
      },
      onDidRequestNavigation: emitter.event,
      onDidChangePosition: positionEmitter.event,
      dispose: (): void => {
        this.#providers.delete(extensionId);
        emitter.dispose();
        positionEmitter.dispose();
        this.apiSender.send('navigation-history-remove-extension', extensionId);
      },
    };
  }

  navigateToEntry(extensionId: string, route: string): void {
    const providerEntry = this.#providers.get(extensionId);
    if (!providerEntry) {
      throw new Error(`No navigation history provider registered for extension ${extensionId}`);
    }

    const entry: NavigationHistoryEntry = {
      name: '',
      route,
    };
    providerEntry.emitter.fire(entry);
  }

  updatePosition(positionInfo: NavigationHistoryPositionInfo): void {
    const providerEntry = this.#providers.get(positionInfo.extensionId);
    if (!providerEntry) {
      return;
    }

    providerEntry.positionEmitter.fire({
      currentIndex: positionInfo.currentIndex,
    });
  }

  hasProvider(extensionId: string): boolean {
    return this.#providers.has(extensionId);
  }
}
