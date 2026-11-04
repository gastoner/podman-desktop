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

import type { ColorInfo, ThemeInfo, WebviewInfo } from '@desktop-framework/api';
import type { WebviewApi } from '@podman-desktop/webview-api';
import type { ContextBridge, IpcMain, IpcRenderer, IpcRendererEvent } from 'electron';
import { contextBridge, ipcRenderer } from 'electron';
import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { WebviewPreload } from './webview-preload.js';

let webviewPreload: TestWebwiewPreload;

class TestWebwiewPreload extends WebviewPreload {
  async getWebviews(): Promise<WebviewInfo[]> {
    return super.getWebviews();
  }
  buildApi(): WebviewApi {
    return super.buildApi();
  }
  ipcRendererOn(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): void {
    super.ipcRendererOn(channel, listener);
  }
  async ipcInvoke(channel: string, ...args: unknown[]): Promise<unknown> {
    return super.ipcInvoke(channel, ...args);
  }
  changeContent(): void {
    super.changeContent();
  }
  postWebviewMessage(message: unknown): void {
    super.postWebviewMessage(message);
  }
  async getTheme(): Promise<string> {
    return super.getTheme();
  }
  async getColors(themeId: string): Promise<ColorInfo[]> {
    return super.getColors(themeId);
  }
  async getThemeInfo(theme: string): Promise<ThemeInfo> {
    return super.getThemeInfo(theme);
  }
}

const webviewInfo: WebviewInfo = {
  id: '123',
  extensionId: 'testExtension',
  viewType: 'test',
  sourcePath: 'testPath',
  icon: 'testIcon',
  name: 'test',
  html: '<html>hello world</html>',
  uuid: '12-12-12-12',
  state: { foo: 'bar' },
};

vi.mock(import('electron'), async () => {
  return {
    contextBridge: {
      exposeInMainWorld: vi.fn(),
    } as unknown as ContextBridge,
    ipcRenderer: {
      on: vi.fn(),
      emit: vi.fn(),
      handle: vi.fn(),
      invoke: vi.fn(),
    } as unknown as IpcRenderer,
    ipcMain: {
      on: vi.fn(),
      emit: vi.fn(),
      handle: vi.fn(),
    } as unknown as IpcMain,
  };
});

let spyIpcRendererOn: MockInstance<
  (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => void
>;
let spyBuildApi: MockInstance<() => WebviewApi>;
beforeEach(() => {
  vi.resetAllMocks();
  webviewPreload = new TestWebwiewPreload('123');

  // mock the window object
  Object.defineProperty(global, 'window', {
    value: {
      addEventListener: vi.fn(),
      matchMedia: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    },
  });

  // override the getWebviews method
  const spyGetWebviews = vi.spyOn(webviewPreload, 'getWebviews');
  spyGetWebviews.mockResolvedValue([webviewInfo]);

  // override buildApi method
  spyBuildApi = vi.spyOn(webviewPreload, 'buildApi');
  spyBuildApi.mockReturnValue({} as WebviewApi);

  // override ipcRendererOn
  spyIpcRendererOn = vi.spyOn(webviewPreload, 'ipcRendererOn');
  spyIpcRendererOn.mockImplementation(() => {});
});

test('check init method', async () => {
  await webviewPreload.init();

  // check it adds addEventListener to the window object
  expect(window.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

  // check exposure of the function to javascript
  expect(vi.mocked(contextBridge.exposeInMainWorld)).toHaveBeenCalledWith(
    'acquirePodmanDesktopApi',
    expect.any(Function),
  );

  // check we register 3 event listener on ipcRenderer
  expect(spyIpcRendererOn).toHaveBeenCalledWith('webview-post-message', expect.any(Function));
  expect(spyIpcRendererOn).toHaveBeenCalledWith('webview-update-html', expect.any(Function));
  expect(spyIpcRendererOn).toHaveBeenCalledWith('webview-navigate-to', expect.any(Function));
});

describe('ipcInvoke', () => {
  test('check custom ipcInvoke method', async () => {
    // override the ipcRenderer.invoke method
    const spyIpcRendererInvoke = vi.spyOn(ipcRenderer, 'invoke');

    const fakeResult = 'foo';
    // fake remote implementation sending no error and foo as result
    spyIpcRendererInvoke.mockResolvedValue({ result: fakeResult, error: undefined });

    const result = await webviewPreload.ipcInvoke('test', 'arg1');

    expect(result).toStrictEqual(fakeResult);
    expect(spyIpcRendererInvoke).toHaveBeenCalledWith('test', 'arg1');
  });

  test('check custom ipcInvoke method with error', async () => {
    // override the ipcRenderer.invoke method
    const spyIpcRendererInvoke = vi.spyOn(ipcRenderer, 'invoke');

    const fakeError = new Error('dummy error');
    // fake remote implementation sending no error and foo as result
    spyIpcRendererInvoke.mockResolvedValue({ result: undefined, error: fakeError });

    await expect(webviewPreload.ipcInvoke('test', 'arg1')).rejects.toThrow('dummy error');

    expect(spyIpcRendererInvoke).toHaveBeenCalledWith('test', 'arg1');
  });
});

describe('changeContent', () => {
  beforeEach(() => {
    vi.stubGlobal('document', document.implementation.createHTMLDocument(''));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('check with light theme', async () => {
    // spy document.write method
    const spyDocumentWrite = vi.spyOn(document, 'write');

    // spy getTheme method
    const spyGetTheme = vi.spyOn(webviewPreload, 'getTheme');
    spyGetTheme.mockResolvedValue('light');

    // spy getColors method
    const spyGetColors = vi.spyOn(webviewPreload, 'getColors');
    spyGetColors.mockResolvedValue([{ id: 'my-color', value: 'test', cssVar: '--pd-my-color' }]);

    const spyGetThemeInfo = vi.spyOn(webviewPreload, 'getThemeInfo');
    spyGetThemeInfo.mockResolvedValue({ isDark: false, isHighContrast: false });

    // override window.addEventListener to keep the callback
    const spyAddEventListener = vi.spyOn(window, 'addEventListener');

    // call changeContent it should not do anything as we're missing all conditions
    webviewPreload.changeContent();

    // check document.write method has not been called
    expect(spyDocumentWrite).not.toHaveBeenCalled();

    // call init to set the webviewInfo
    await webviewPreload.init();

    const callback: EventListener = spyAddEventListener.mock.calls[0][1] as EventListener;

    // call the callback that should call changeContent as we'll have two mandatory fields
    callback?.({} as Event);

    // wait timeout execute
    await new Promise(resolve => setTimeout(resolve, 100));

    // check the document.write method has been called
    expect(spyDocumentWrite).toHaveBeenCalledWith(`<!DOCTYPE html>
<html><head></head><body>hello world</body></html>`);

    // check getTheme has been called
    expect(spyGetTheme).toHaveBeenCalled();

    // check getColors has been called
    expect(spyGetColors).toHaveBeenCalledWith('light');

    // check the createCssForColors method has been called and contains the expected css
    expect(document.head.innerHTML).toContain('<style type="text/css"');
    expect(document.head.textContent).toContain('--pd-my-color: test;');
    expect(document.head.textContent).toContain('color-scheme: light;');
  });

  test('check with dark theme', async () => {
    // spy document.write method
    const spyDocumentWrite = vi.spyOn(document, 'write');

    // spy getTheme method
    const spyGetTheme = vi.spyOn(webviewPreload, 'getTheme');
    spyGetTheme.mockResolvedValue('dark');

    // spy getColors method
    const spyGetColors = vi.spyOn(webviewPreload, 'getColors');
    spyGetColors.mockResolvedValue([{ id: 'my-color', value: 'test', cssVar: '--pd-my-color' }]);

    const spyGetThemeInfo = vi.spyOn(webviewPreload, 'getThemeInfo');
    spyGetThemeInfo.mockResolvedValue({ isDark: true, isHighContrast: false });

    // override window.addEventListener to keep the callback
    const spyAddEventListener = vi.spyOn(window, 'addEventListener');

    // call changeContent it should not do anything as we're missing all conditions
    webviewPreload.changeContent();

    // check document.write method has not been called
    expect(spyDocumentWrite).not.toHaveBeenCalled();

    // call init to set the webviewInfo
    await webviewPreload.init();

    const callback: EventListener = spyAddEventListener.mock.calls[0][1] as EventListener;

    // call the callback that should call changeContent as we'll have two mandatory fields
    callback({} as Event);

    // wait timeout execute
    await new Promise(resolve => setTimeout(resolve, 100));

    // check the document.write method has been called
    expect(spyDocumentWrite).toHaveBeenCalledWith(`<!DOCTYPE html>
<html><head></head><body>hello world</body></html>`);

    // check getTheme has been called
    expect(spyGetTheme).toHaveBeenCalled();

    // check getColors has been called
    expect(spyGetColors).toHaveBeenCalledWith('dark');

    // check the createCssForColors method has been called and contains the expected css
    expect(document.head.innerHTML).toContain('<style type="text/css"');
    expect(document.head.textContent).toContain('--pd-my-color: test;');
    expect(document.head.textContent).toContain('color-scheme: dark;');
  });
});

test('check buildApi', async () => {
  // spy postWebviewMessage
  const spyPostWebviewMessage = vi.spyOn(webviewPreload, 'postWebviewMessage');

  // spy ipcInvoke
  const spyIpcInvoke = vi.spyOn(webviewPreload, 'ipcInvoke');
  spyIpcInvoke.mockResolvedValue({ result: undefined, error: undefined });

  // remove spy on buildApi
  spyBuildApi.mockRestore();

  // mock the contextBridge to grab the api object
  let webviewApi: WebviewApi | undefined = undefined;
  vi.mocked(contextBridge.exposeInMainWorld).mockImplementation((name: string, api: () => WebviewApi) => {
    webviewApi = api();
  });

  // init to set the webviewInfo
  await webviewPreload.init();

  if (!webviewApi) {
    throw new Error('webviewApi should be defined');
  }
  const podmanDesktopWebwievApi: WebviewApi = webviewApi;

  // check exposeInMainWorld has been called
  expect(vi.mocked(contextBridge.exposeInMainWorld)).toHaveBeenCalledWith(
    'acquirePodmanDesktopApi',
    expect.any(Function),
  );

  expect(podmanDesktopWebwievApi).toBeDefined();

  // check the podmanDesktopApi object is returned
  //get state that should be the one from the webviewInfo
  expect(podmanDesktopWebwievApi.getState()).toStrictEqual(webviewInfo.state);

  //post message
  podmanDesktopWebwievApi.postMessage('test');

  expect(spyPostWebviewMessage).toHaveBeenCalledWith({ command: 'onmessage', data: 'test' });

  // clear calls on spyIpcInvoke
  spyIpcInvoke.mockClear();

  //set state
  const newFakeState = { updated: 'state' };
  await podmanDesktopWebwievApi.setState(newFakeState);

  // check ipcInvoke has been called
  expect(spyIpcInvoke).toHaveBeenCalledWith('webviewRegistry:update-state', webviewInfo.id, newFakeState);
});

test('check showNavigationItemMenu', async () => {
  // spy ipcInvoke
  const spyIpcInvoke = vi.spyOn(webviewPreload, 'ipcInvoke');
  spyIpcInvoke.mockResolvedValue(undefined);

  // remove spy on buildApi
  spyBuildApi.mockRestore();

  // mock the contextBridge to grab the api object
  let webviewApi: WebviewApi | undefined = undefined;
  vi.mocked(contextBridge.exposeInMainWorld).mockImplementation((name: string, api: () => WebviewApi) => {
    webviewApi = api();
  });

  // init to set the webviewInfo
  await webviewPreload.init();

  if (!webviewApi) {
    throw new Error('webviewApi should be defined');
  }
  const podmanDesktopWebviewApi: WebviewApi = webviewApi;

  await podmanDesktopWebviewApi.showNavigationItemMenu({ title: 'Recipes', href: '/recipes' });

  // the menu request is forwarded to the main process with the webview id
  expect(spyIpcInvoke).toHaveBeenCalledWith('webviewRegistry:showNavigationItemMenu', '123', {
    title: 'Recipes',
    href: '/recipes',
  });
});

test('check onDidNavigateToPinnedItem dispatches and replays the pending path', async () => {
  // use the real ipcRendererOn so the listeners are registered on the mocked ipcRenderer
  spyIpcRendererOn.mockRestore();

  // remove spy on buildApi
  spyBuildApi.mockRestore();

  // mock the contextBridge to grab the api object
  let webviewApi: WebviewApi | undefined = undefined;
  vi.mocked(contextBridge.exposeInMainWorld).mockImplementation((name: string, api: () => WebviewApi) => {
    webviewApi = api();
  });

  // init to set the webviewInfo
  await webviewPreload.init();

  if (!webviewApi) {
    throw new Error('webviewApi should be defined');
  }
  const podmanDesktopWebviewApi: WebviewApi = webviewApi;

  // grab the webview-navigate-to listener registered by init
  const navigateCall = vi.mocked(ipcRenderer.on).mock.calls.find(([channel]) => channel === 'webview-navigate-to');
  const navigateListener = navigateCall?.[1] as (event: IpcRendererEvent, path: string) => void;

  // a path received before any listener registers is held
  navigateListener({} as IpcRendererEvent, '/recipes');

  const receivedPaths: string[] = [];
  const disposable = podmanDesktopWebviewApi.onDidNavigateToPinnedItem(path => receivedPaths.push(path));

  // the pending path is replayed when the first listener registers
  expect(receivedPaths).toStrictEqual(['/recipes']);

  // a failing listener does not prevent the other listeners from being notified
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  const failingDisposable = podmanDesktopWebviewApi.onDidNavigateToPinnedItem(() => {
    throw new Error('listener failure');
  });
  const lastDisposable = podmanDesktopWebviewApi.onDidNavigateToPinnedItem(path => receivedPaths.push(`last:${path}`));

  // subsequent paths are dispatched directly
  navigateListener({} as IpcRendererEvent, '/models');
  expect(receivedPaths).toStrictEqual(['/recipes', '/models', 'last:/models']);
  expect(consoleErrorSpy).toHaveBeenCalledWith('Error in a pinned navigation item listener', expect.any(Error));
  failingDisposable.dispose();
  lastDisposable.dispose();

  // after disposal the listener is no longer notified
  disposable.dispose();
  navigateListener({} as IpcRendererEvent, '/catalog');
  expect(receivedPaths).toStrictEqual(['/recipes', '/models', 'last:/models']);
});
