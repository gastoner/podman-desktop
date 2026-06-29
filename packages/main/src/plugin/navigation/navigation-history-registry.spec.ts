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

import type { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { IPCHandle } from '/@/plugin/api.js';

import { NavigationHistoryRegistry } from './navigation-history-registry.js';

let registry: NavigationHistoryRegistry;

const apiSender: ApiSenderType = {
  send: vi.fn(),
  receive: vi.fn(),
};

const ipcHandle: IPCHandle = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  registry = new NavigationHistoryRegistry(apiSender, ipcHandle);
  registry.init();
});

describe('registerProvider', () => {
  test('should register a provider and return a NavigationHistoryProvider', () => {
    const provider = registry.registerProvider('my.extension');

    expect(provider).toBeDefined();
    expect(provider.pushEntry).toBeDefined();
    expect(provider.onDidRequestNavigation).toBeDefined();
    expect(provider.dispose).toBeDefined();
  });

  test('should throw if provider is already registered for the same extension', () => {
    registry.registerProvider('my.extension');

    expect(() => registry.registerProvider('my.extension')).toThrow(
      'Navigation history provider already registered for extension my.extension',
    );
  });

  test('hasProvider should return true after registration', () => {
    expect(registry.hasProvider('my.extension')).toBe(false);

    registry.registerProvider('my.extension');

    expect(registry.hasProvider('my.extension')).toBe(true);
  });
});

describe('pushEntry', () => {
  test('should send navigation-history-push via apiSender with entry info', () => {
    const provider = registry.registerProvider('my.extension');

    provider.pushEntry({ name: 'Page One', route: '/page-one' });

    expect(apiSender.send).toHaveBeenCalledWith('navigation-history-push', {
      extensionId: 'my.extension',
      name: 'Page One',
      route: '/page-one',
      icon: undefined,
    });
  });

  test('should include custom icon when provided', () => {
    const provider = registry.registerProvider('my.extension');

    provider.pushEntry({ name: 'Detail', route: '/detail', icon: 'custom-icon.svg' });

    expect(apiSender.send).toHaveBeenCalledWith('navigation-history-push', {
      extensionId: 'my.extension',
      name: 'Detail',
      route: '/detail',
      icon: 'custom-icon.svg',
    });
  });

  test('should support theme-aware icons', () => {
    const provider = registry.registerProvider('my.extension');

    provider.pushEntry({ name: 'Page', route: '/page' });

    expect(apiSender.send).toHaveBeenCalledWith('navigation-history-push', {
      extensionId: 'my.extension',
      name: 'Page',
      route: '/page',
      icon: undefined,
    });
  });
});

describe('navigateToEntry', () => {
  test('should fire the onDidRequestNavigation event on the correct provider', () => {
    const provider = registry.registerProvider('my.extension');
    const listener = vi.fn();
    provider.onDidRequestNavigation(listener);

    registry.navigateToEntry('my.extension', '/some-route');

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        route: '/some-route',
      }),
    );
  });

  test('should throw if no provider is registered for the extension', () => {
    expect(() => registry.navigateToEntry('unknown.extension', '/route')).toThrow(
      'No navigation history provider registered for extension unknown.extension',
    );
  });
});

describe('updatePosition', () => {
  test('should fire onDidChangePosition on the correct provider', () => {
    const provider = registry.registerProvider('my.extension');
    const listener = vi.fn();
    provider.onDidChangePosition(listener);

    registry.updatePosition({
      extensionId: 'my.extension',
      currentIndex: 1,
    });

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith({
      currentIndex: 1,
    });
  });

  test('should not throw if provider does not exist', () => {
    expect(() =>
      registry.updatePosition({
        extensionId: 'unknown.extension',
        currentIndex: -1,
      }),
    ).not.toThrow();
  });
});

describe('dispose', () => {
  test('should remove provider on dispose', () => {
    const provider = registry.registerProvider('my.extension');

    expect(registry.hasProvider('my.extension')).toBe(true);

    provider.dispose();

    expect(registry.hasProvider('my.extension')).toBe(false);
  });

  test('should send navigation-history-remove-extension on dispose', () => {
    const provider = registry.registerProvider('my.extension');

    provider.dispose();

    expect(apiSender.send).toHaveBeenCalledWith('navigation-history-remove-extension', 'my.extension');
  });

  test('should allow re-registration after dispose', () => {
    const provider = registry.registerProvider('my.extension');
    provider.dispose();

    const newProvider = registry.registerProvider('my.extension');
    expect(newProvider).toBeDefined();
    expect(registry.hasProvider('my.extension')).toBe(true);
  });

  test('navigateToEntry should throw after provider is disposed', () => {
    const provider = registry.registerProvider('my.extension');
    provider.dispose();

    expect(() => registry.navigateToEntry('my.extension', '/route')).toThrow();
  });
});
