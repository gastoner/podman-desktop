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

import type { PinnedExtensionLink, WebviewInfo } from '@desktop-framework/api';
import type { IConfigurationRegistry } from '@desktop-framework/api/configuration';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { IpcMainInvokeEvent, KeyboardEvent, MenuItem, MenuItemConstructorOptions } from 'electron';
import { BrowserWindow, Menu } from 'electron';
import { beforeEach, expect, test, vi } from 'vitest';

import type { IPCHandle } from '/@/plugin/api.js';

import { PinnedExtensionLinks } from './pinned-extension-links.js';
import type { WebviewRegistry } from './webview-registry.js';

vi.mock(import('electron'), async () => {
  return {
    Menu: {
      buildFromTemplate: vi.fn(() => ({ popup: vi.fn() })),
    } as unknown as typeof Menu,
    BrowserWindow: {
      fromWebContents: vi.fn((): BrowserWindow | null => null),
    } as unknown as typeof BrowserWindow,
  };
});

const ipcHandle: IPCHandle = vi.fn();

// serialized FontAwesome icon definition, as sent by the webview
const bookIcon: IconDefinition = {
  prefix: 'fas',
  iconName: 'book',
  icon: [448, 512, [], 'f02d', 'M0 0h448v512H0z'],
};

const webview: WebviewInfo = {
  id: '1',
  extensionId: 'ext1',
  viewType: 'ai-lab',
  sourcePath: 'path',
  icon: './icon.svg',
  name: 'AI Lab',
  html: '<html></html>',
  uuid: 'uuid-1',
  state: {},
};

const webviewRegistry = { listWebviews: vi.fn() } as unknown as WebviewRegistry;

// in-memory configuration values, updated by the mocked updateConfigurationValue
const configurationValues = new Map<string, unknown>();
const configurationRegistry = {
  getConfiguration: vi.fn(),
  updateConfigurationValue: vi.fn(),
} as unknown as IConfigurationRegistry;

let pinnedExtensionLinks: PinnedExtensionLinks;

const hostWebContentsMock = {};
const eventMock = {
  sender: { hostWebContents: hostWebContentsMock },
} as unknown as IpcMainInvokeEvent;

let showMenuListener: (event: IpcMainInvokeEvent, webviewId: string, item: unknown) => Promise<void>;

async function clickMenuItem(menuItem: MenuItemConstructorOptions): Promise<void> {
  menuItem.click?.({} as MenuItem, {} as unknown as BrowserWindow, {} as unknown as KeyboardEvent);
  // the click handler updates the configuration asynchronously, wait for it to settle
  await new Promise(resolve => setTimeout(resolve, 0));
}

function getMenuTemplate(): MenuItemConstructorOptions {
  const template = vi.mocked(Menu.buildFromTemplate).mock.calls[0]?.[0];
  expect(template).toBeDefined();
  return template?.[0] as MenuItemConstructorOptions;
}

function expectedRecord(): PinnedExtensionLink {
  return {
    extensionId: 'ext1',
    viewType: 'ai-lab',
    webviewName: 'AI Lab',
    path: '/recipes',
    title: 'Recipes',
    icon: bookIcon,
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  configurationValues.clear();

  vi.mocked(webviewRegistry.listWebviews).mockReturnValue([webview]);
  // the navbar configuration section scopes the keys: get('itemOrder') reads navbar.itemOrder
  vi.mocked(configurationRegistry.getConfiguration).mockReturnValue({
    get: (key: string, defaultValue?: unknown): unknown => configurationValues.get(`navbar.${key}`) ?? defaultValue,
  } as unknown as ReturnType<IConfigurationRegistry['getConfiguration']>);
  vi.mocked(configurationRegistry.updateConfigurationValue).mockImplementation(
    (key: string, value: unknown): Promise<void> => {
      configurationValues.set(key, value);
      return Promise.resolve();
    },
  );
  vi.mocked(Menu.buildFromTemplate).mockReturnValue({ popup: vi.fn() } as unknown as Menu);
  vi.mocked(BrowserWindow.fromWebContents).mockReturnValue(null);
  vi.spyOn(console, 'warn').mockImplementation(() => {});

  pinnedExtensionLinks = new PinnedExtensionLinks(ipcHandle, webviewRegistry, configurationRegistry);
  pinnedExtensionLinks.init();

  const listener = vi.mocked(ipcHandle).mock.calls[0]?.[1];
  if (!listener) {
    throw new Error('the showNavigationItemMenu IPC handler should be registered');
  }
  showMenuListener = listener;
});

test('init registers the showNavigationItemMenu IPC channel', async () => {
  expect(ipcHandle).toHaveBeenCalledWith('webviewRegistry:showNavigationItemMenu', expect.any(Function));
});

test('shows no menu for an invalid item', async () => {
  await showMenuListener(eventMock, '1', undefined);
  await showMenuListener(eventMock, '1', { title: '', href: '/recipes' });
  await showMenuListener(eventMock, '1', { title: 'Recipes', href: '' });
  await showMenuListener(eventMock, '1', 'not-an-object');

  expect(Menu.buildFromTemplate).not.toHaveBeenCalled();
});

test('shows no menu for an unknown webview', async () => {
  await showMenuListener(eventMock, 'unknown', { title: 'Recipes', href: '/recipes' });

  expect(Menu.buildFromTemplate).not.toHaveBeenCalled();
});

test('pins an item and shows the menu on the host window', async () => {
  await showMenuListener(eventMock, '1', { title: 'Recipes', href: '/recipes', icon: bookIcon });

  // the menu pops up on the window hosting the webview
  expect(BrowserWindow.fromWebContents).toHaveBeenCalledWith(hostWebContentsMock);

  const menuItem = getMenuTemplate();
  expect(menuItem.label).toBe('Pin Recipes to Navigation');

  // clicking the menu item pins the navigation item
  await clickMenuItem(menuItem);

  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.pinnedLinks',
    [expectedRecord()],
    'DEFAULT',
  );
  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.itemOrder',
    ['AI Lab > Recipes'],
    'DEFAULT',
  );
});

test('escapes every ampersand in the menu label', async () => {
  await showMenuListener(eventMock, '1', { title: 'Tom & Jerry & Spike', href: '/recipes' });

  expect(getMenuTemplate().label).toBe('Pin Tom && Jerry && Spike to Navigation');
});

test('unpins an already pinned item', async () => {
  configurationValues.set('navbar.itemOrder', ['AI Lab > Recipes', 'Containers']);
  configurationValues.set('navbar.pinnedLinks', [expectedRecord()]);

  await showMenuListener(eventMock, '1', { title: 'Recipes', href: '/recipes' });

  const menuItem = getMenuTemplate();
  expect(menuItem.label).toBe('Unpin Recipes');

  await clickMenuItem(menuItem);

  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith('navbar.pinnedLinks', [], 'DEFAULT');
  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.itemOrder',
    ['Containers'],
    'DEFAULT',
  );
});

test('re-pinning replaces the existing record for the same item', async () => {
  configurationValues.set('navbar.pinnedLinks', [{ ...expectedRecord(), title: 'Old title', icon: undefined }]);
  configurationValues.set('navbar.itemOrder', ['AI Lab > Old title']);

  await showMenuListener(eventMock, '1', { title: 'Recipes', href: '/recipes', icon: bookIcon });

  await clickMenuItem(getMenuTemplate());

  // the record is replaced and both order keys are kept (the stale one is inert)
  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.pinnedLinks',
    [expectedRecord()],
    'DEFAULT',
  );
  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.itemOrder',
    ['AI Lab > Recipes', 'AI Lab > Old title'],
    'DEFAULT',
  );
});

test('drops a malformed icon value from the pinned record', async () => {
  // a malformed icon does not block the menu, it is dropped from the record
  await showMenuListener(eventMock, '1', { title: 'Recipes', href: '/recipes', icon: 42 });
  await clickMenuItem(getMenuTemplate());

  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.pinnedLinks',
    [{ ...expectedRecord(), icon: undefined }],
    'DEFAULT',
  );
});

test('drops an icon object missing the FontAwesome definition', async () => {
  await showMenuListener(eventMock, '1', {
    title: 'Recipes',
    href: '/recipes',
    icon: { prefix: 'fas', iconName: 'book' },
  });
  await clickMenuItem(getMenuTemplate());

  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.pinnedLinks',
    [{ ...expectedRecord(), icon: undefined }],
    'DEFAULT',
  );
});

test('keeps an image path as the pinned record icon', async () => {
  await showMenuListener(eventMock, '1', { title: 'Recipes', href: '/recipes', icon: './recipes.svg' });
  await clickMenuItem(getMenuTemplate());

  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.pinnedLinks',
    [{ ...expectedRecord(), icon: './recipes.svg' }],
    'DEFAULT',
  );
});

test('makes a relative href absolute', async () => {
  await showMenuListener(eventMock, '1', { title: 'Recipes', href: 'recipes', icon: bookIcon });
  await clickMenuItem(getMenuTemplate());

  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.pinnedLinks',
    [expectedRecord()],
    'DEFAULT',
  );
});

test('offers to pin an item sharing the order key of another pinned item', async () => {
  const other = { ...expectedRecord(), path: '/other' };
  configurationValues.set('navbar.pinnedLinks', [other]);
  configurationValues.set('navbar.itemOrder', ['AI Lab > Recipes']);

  await showMenuListener(eventMock, '1', { title: 'Recipes', href: '/recipes' });

  expect(getMenuTemplate().label).toBe('Pin Recipes to Navigation');
});

test('unpinning keeps the order key still used by another pinned item', async () => {
  const other = { ...expectedRecord(), path: '/other' };
  configurationValues.set('navbar.pinnedLinks', [expectedRecord(), other]);
  configurationValues.set('navbar.itemOrder', ['AI Lab > Recipes']);

  await showMenuListener(eventMock, '1', { title: 'Recipes', href: '/recipes' });
  await clickMenuItem(getMenuTemplate());

  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith('navbar.pinnedLinks', [other], 'DEFAULT');
  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.itemOrder',
    ['AI Lab > Recipes'],
    'DEFAULT',
  );
});

test('removeExtensionLinks removes the pinned items of an uninstalled extension', async () => {
  const kept = { ...expectedRecord(), extensionId: 'ext2', webviewName: 'Dashboard', title: 'Nodes' };
  configurationValues.set('navbar.pinnedLinks', [expectedRecord(), kept]);
  configurationValues.set('navbar.itemOrder', ['AI Lab > Recipes', 'Dashboard > Nodes', 'Containers']);

  await pinnedExtensionLinks.removeExtensionLinks('ext1');

  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith('navbar.pinnedLinks', [kept], 'DEFAULT');
  expect(configurationRegistry.updateConfigurationValue).toHaveBeenCalledWith(
    'navbar.itemOrder',
    ['Dashboard > Nodes', 'Containers'],
    'DEFAULT',
  );
});

test('removeExtensionLinks leaves the configuration untouched without pinned items', async () => {
  await pinnedExtensionLinks.removeExtensionLinks('ext1');

  expect(configurationRegistry.updateConfigurationValue).not.toHaveBeenCalled();
});
