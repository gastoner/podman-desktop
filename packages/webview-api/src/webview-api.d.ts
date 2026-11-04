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

/**
 * The Podman Desktop Webview API provides a way to interact with Podman Desktop from webviews
 *
 * @example
 * ```typescript
 * import * as webviewApi from '@podman-desktop/webview-api';
 *
 * ```
 *
 * @module @podman-desktop/webview-api
 **/

declare module '@podman-desktop/webview-api' {
  /** An object that can be disposed to release resources. */
  export interface Disposable {
    dispose(): void;
  }

  /**
   * Dependency-free structural type of a FontAwesome icon definition, including its glyph data.
   * `IconDefinition` from `@fortawesome/fontawesome-common-types` satisfies it.
   */
  export interface PinnableNavigationIcon {
    readonly prefix: string;
    readonly iconName: string;
    readonly icon: readonly unknown[];
  }

  /** A navigation item contributed by an extension webview that can be pinned to the main navigation. */
  export interface PinnableNavigationItem {
    /** Displayed title of the item, e.g. "Recipe Catalog". */
    title: string;
    /** Internal href of the item inside the webview, e.g. "/recipes". */
    href: string;
    /** Optional icon: an image path or a FontAwesome icon definition. */
    icon?: string | PinnableNavigationIcon;
  }

  export interface WebviewApi {
    getState(): unknown;
    postMessage(msg: unknown): void;
    setState(newState: unknown): Promise<void>;
    /**
     * Show the Podman Desktop Pin/Unpin context menu for a navigation item of the extension.
     * Inert when called outside of a Podman Desktop webview.
     */
    showNavigationItemMenu(item: PinnableNavigationItem): Promise<void>;
    /**
     * Register a listener invoked when the shell navigates this webview to a pinned
     * navigation item. The listener receives the internal path (the item's href) to route to.
     */
    onDidNavigateToPinnedItem(listener: (path: string) => void): Disposable;
  }
}
