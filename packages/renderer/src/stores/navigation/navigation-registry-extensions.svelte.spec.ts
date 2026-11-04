/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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

import type { ContributionInfo, PinnedExtensionLink, WebviewInfo } from '@desktop-framework/api';
import { faBook, faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { beforeEach, expect, test, vi } from 'vitest';

import { contributions } from '/@/stores/contribs';
import { webviews } from '/@/stores/webviews';

import { createNavigationExtensionEntry, createNavigationExtensionGroup } from './navigation-registry-extension.svelte';

beforeEach(() => {
  vi.resetAllMocks();
});

test('createNavigationExtensionEntry', async () => {
  const entry = createNavigationExtensionEntry();

  expect(entry).toBeDefined();
  expect(entry.name).toBe('Extensions');
  expect(entry.link).toBe('/extensions');
  expect(entry.tooltip).toBe('Extensions');
  expect(entry.counter).toBe(0);
});

test('createNavigationExtensionGroup uses extensions prefix for all destinations', async () => {
  const group = createNavigationExtensionGroup();

  contributions.set([
    {
      name: 'Compose',
      icon: './compose.svg',
    } as ContributionInfo,
  ]);

  webviews.set([
    {
      id: 'dashboard',
      name: 'Dashboard',
      extensionId: 'compose',
      icon: './dashboard.svg',
    } as unknown as WebviewInfo,
  ]);

  await vi.waitFor(() => {
    expect(group.destinations).toHaveLength(2);
  });

  expect(group.destinations[0]?.name).toBe('Extensions: Dashboard');
  expect(group.destinations[1]?.name).toBe('Extensions: Compose');
});

function pinnedLink(): PinnedExtensionLink {
  return {
    extensionId: 'ext1',
    viewType: 'ai-lab',
    webviewName: 'AI Lab',
    path: '/recipes',
    title: 'Recipes',
  };
}

function mockConfigurationValues(configurationValues: Record<string, unknown>): void {
  vi.mocked(window.getConfigurationValue).mockImplementation(
    <T>(key: string): Promise<T | undefined> => Promise.resolve(configurationValues[key] as T | undefined),
  );
}

test('createNavigationExtensionGroup shows pinned extension navigation items', async () => {
  mockConfigurationValues({
    'navbar.pinnedLinks': [{ ...pinnedLink(), icon: faBook }],
    'navbar.itemOrder': ['AI Lab > Recipes'],
    'navbar.disabledItems': [],
  });

  const group = createNavigationExtensionGroup();

  webviews.set([
    {
      id: 'webviewId1',
      name: 'AI Lab',
      extensionId: 'ext1',
      viewType: 'ai-lab',
      icon: './ai-lab.svg',
    } as unknown as WebviewInfo,
  ]);

  await vi.waitFor(() => {
    expect(group.items?.some(item => item.name === 'Recipes')).toBe(true);
  });

  const item = group.items?.find(item => item.name === 'Recipes');
  // the pinned item points to the webview path and is visible in the main navigation
  expect(item?.parentName).toBe('AI Lab');
  expect(item?.link).toBe('/webviews/webviewId1/recipes');
  expect(item?.icon).toEqual({ faIcon: { definition: faBook, size: 'lg' } });
  expect(item?.index).toBe(0);
  expect(item?.hidden).toBe(false);
});

test('createNavigationExtensionGroup hides pinned items missing from the navbar order', async () => {
  mockConfigurationValues({
    'navbar.pinnedLinks': [{ ...pinnedLink(), icon: './recipes.svg' }],
    'navbar.itemOrder': [],
    'navbar.disabledItems': [],
  });

  const group = createNavigationExtensionGroup();
  webviews.set([]);

  await vi.waitFor(() => {
    expect(group.items?.some(item => item.name === 'Recipes')).toBe(true);
  });

  const item = group.items?.find(item => item.name === 'Recipes');
  expect(item?.icon).toEqual({ iconImage: './recipes.svg' });
  // without an order key the item stays hidden from the main navigation
  expect(item?.index).toBeUndefined();
  expect(item?.hidden).toBe(true);
});

test('createNavigationExtensionGroup links orphaned pinned items to the extension details page', async () => {
  mockConfigurationValues({
    'navbar.pinnedLinks': [pinnedLink(), { ...pinnedLink(), path: '/models', title: 'Models' }],
    'navbar.itemOrder': ['AI Lab > Recipes', 'AI Lab > Models'],
    'navbar.disabledItems': [],
  });

  const group = createNavigationExtensionGroup();
  webviews.set([]);

  await vi.waitFor(() => {
    expect(group.items?.some(item => item.name === 'Models')).toBe(true);
  });

  const item = group.items?.find(item => item.name === 'Recipes');
  // the extension webview is gone: fall back to the recorded name, the details page and the default icon
  expect(item?.parentName).toBe('AI Lab');
  expect(item?.link).toBe('/extensions/details/ext1?pinned=%2Frecipes');
  expect(item?.icon).toEqual({ faIcon: { definition: faPuzzlePiece, size: 'lg' } });
  // the main navigation is keyed by link: every orphaned item of the extension keeps a unique link
  expect(group.items?.find(item => item.name === 'Models')?.link).toBe('/extensions/details/ext1?pinned=%2Fmodels');
});

test('createNavigationExtensionGroup hides disabled pinned items', async () => {
  mockConfigurationValues({
    'navbar.pinnedLinks': [pinnedLink()],
    'navbar.itemOrder': ['AI Lab > Recipes'],
    'navbar.disabledItems': ['AI Lab > Recipes'],
  });

  const group = createNavigationExtensionGroup();
  webviews.set([]);

  await vi.waitFor(() => {
    expect(group.items?.some(item => item.name === 'Recipes')).toBe(true);
  });

  const item = group.items?.find(item => item.name === 'Recipes');
  expect(item?.index).toBe(0);
  expect(item?.hidden).toBe(true);
});
