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

import type { PinnableNavigationItem, PinnedExtensionLink } from '@desktop-framework/api';
import { CONFIGURATION_DEFAULT_SCOPE, IConfigurationRegistry } from '@desktop-framework/api/configuration';
import type { Configuration } from '@desktop-framework/extension-api';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { IpcMainInvokeEvent, MenuItemConstructorOptions } from 'electron';
import { BrowserWindow, Menu } from 'electron';
import { inject, injectable } from 'inversify';

import { IPCHandle } from '/@/plugin/api.js';
import { WebviewRegistry } from '/@/plugin/webview/webview-registry.js';

// separator used to compose navigation order keys, e.g. "AI Lab > Recipe Catalog"
const NAVIGATION_NAME_SEPARATOR = ' > ';

/**
 * Handles the pinning of extension webview navigation items to the main navigation bar.
 *
 * The webview frontend triggers a native Pin/Unpin context menu through the
 * `webviewRegistry:showNavigationItemMenu` IPC channel. The pinned state is persisted
 * in two hidden configuration keys, reusing the navbar pinning mechanism:
 * - `navbar.pinnedLinks`: metadata of every pinned item (identity, label, icon);
 * - `navbar.itemOrder`: the order key of the item, so ordering / unpin / drag reuse
 *   the regular navigation items machinery.
 */
@injectable()
export class PinnedExtensionLinks {
  constructor(
    @inject(IPCHandle)
    private readonly ipcHandle: IPCHandle,
    @inject(WebviewRegistry)
    private readonly webviewRegistry: WebviewRegistry,
    @inject(IConfigurationRegistry)
    private readonly configurationRegistry: IConfigurationRegistry,
  ) {}

  init(): void {
    this.ipcHandle('webviewRegistry:showNavigationItemMenu', async (event, webviewId, item) => {
      await this.showNavigationItemMenu(event, webviewId, item);
    });
  }

  protected async showNavigationItemMenu(event: IpcMainInvokeEvent, webviewId: string, item: unknown): Promise<void> {
    const navigationItem = this.validateNavigationItem(item);
    if (!navigationItem) {
      console.warn(`ignoring the navigation item menu request of webview ${webviewId}: invalid item`, item);
      return;
    }

    // the menu is only available for an existing webview
    const webview = this.webviewRegistry.listWebviews().find(webview => webview.id === webviewId);
    if (!webview) {
      console.warn(`ignoring the navigation item menu request of unknown webview ${webviewId}`);
      return;
    }

    const record: PinnedExtensionLink = {
      extensionId: webview.extensionId,
      viewType: webview.viewType,
      webviewName: webview.name,
      path: navigationItem.href,
      title: navigationItem.title,
      icon: navigationItem.icon,
    };
    const orderKey = this.getOrderKey(record);
    // pinned: this item has a record and is part of the navbar order (unpinning from the main navigation drops the key)
    const pinned =
      this.getPinnedLinks().some(link => this.isSameLink(link, record)) && this.getItemOrder().includes(orderKey);

    const menu = Menu.buildFromTemplate([this.buildPinMenuItem(record, orderKey, pinned)]);

    // the IPC call may come from a webview embedded in the main window
    const hostWebContents = event.sender.hostWebContents ?? event.sender;
    menu.popup({ window: BrowserWindow.fromWebContents(hostWebContents) ?? undefined });
  }

  protected buildPinMenuItem(
    record: PinnedExtensionLink,
    orderKey: string,
    pinned: boolean,
  ): MenuItemConstructorOptions {
    const itemDisplayName = this.escapeLabel(record.title);
    return {
      label: pinned ? `Unpin ${itemDisplayName}` : `Pin ${itemDisplayName} to Navigation`,
      visible: true,
      click: (): void => {
        const action = pinned ? this.unpinLink(record) : this.pinLink(record, orderKey);
        action.catch((e: unknown) => console.error('error updating pinned navigation item', e));
      },
    };
  }

  protected async pinLink(record: PinnedExtensionLink, orderKey: string): Promise<void> {
    // replace any existing record for the same item (refresh label, icon and webview name)
    const links = this.getPinnedLinks().filter(link => !this.isSameLink(link, record));
    links.push(record);
    await this.setPinnedLinks(links);

    // prepend the item to the navigation order, keeping the other keys
    await this.setItemOrder([orderKey, ...this.getItemOrder().filter(key => key !== orderKey)]);
  }

  protected async unpinLink(record: PinnedExtensionLink): Promise<void> {
    await this.removeLinks(link => this.isSameLink(link, record));
  }

  /** Remove the pinned items of an extension, called when the user uninstalls it. */
  async removeExtensionLinks(extensionId: string): Promise<void> {
    await this.removeLinks(link => link.extensionId === extensionId);
  }

  // remove the matching records and their order keys, keeping a key still used by a remaining record
  protected async removeLinks(isRemoved: (link: PinnedExtensionLink) => boolean): Promise<void> {
    const links = this.getPinnedLinks();
    const kept = links.filter(link => !isRemoved(link));
    if (kept.length === links.length) {
      return;
    }
    await this.setPinnedLinks(kept);
    const keptKeys = new Set(kept.map(link => this.getOrderKey(link)));
    const removedKeys = new Set(links.filter(isRemoved).map(link => this.getOrderKey(link)));
    await this.setItemOrder(this.getItemOrder().filter(key => !removedKeys.has(key) || keptKeys.has(key)));
  }

  protected validateNavigationItem(item: unknown): PinnableNavigationItem | undefined {
    if (typeof item !== 'object' || item === null) {
      return undefined;
    }
    const candidate = item as { title?: unknown; href?: unknown; icon?: unknown };
    if (typeof candidate.title !== 'string' || candidate.title.length === 0) {
      return undefined;
    }
    if (typeof candidate.href !== 'string' || candidate.href.length === 0) {
      return undefined;
    }
    return {
      title: candidate.title,
      // the href is appended to the webview route (/webviews/<id><href>): make it absolute
      href: candidate.href.startsWith('/') ? candidate.href : `/${candidate.href}`,
      icon: this.validateIcon(candidate.icon),
    };
  }

  // accept an image path or a serializable FontAwesome icon definition; anything else is dropped
  protected validateIcon(icon: unknown): string | IconDefinition | undefined {
    if (icon === undefined || icon === null) {
      return undefined;
    }
    if (typeof icon === 'string') {
      return icon.length > 0 ? icon : undefined;
    }
    if (typeof icon === 'object') {
      const candidate = icon as { prefix?: unknown; iconName?: unknown; icon?: unknown };
      if (
        typeof candidate.prefix === 'string' &&
        typeof candidate.iconName === 'string' &&
        Array.isArray(candidate.icon)
      ) {
        return icon as IconDefinition;
      }
    }
    return undefined;
  }

  /** Identity of a pinned link: same extension, same panel type, same path. */
  protected isSameLink(link: PinnedExtensionLink, other: PinnedExtensionLink): boolean {
    return link.extensionId === other.extensionId && link.viewType === other.viewType && link.path === other.path;
  }

  protected getOrderKey(link: PinnedExtensionLink): string {
    return `${link.webviewName}${NAVIGATION_NAME_SEPARATOR}${link.title}`;
  }

  protected escapeLabel(label: string): string {
    return label.replaceAll('&', '&&');
  }

  protected getNavbarConfiguration(): Configuration {
    return this.configurationRegistry.getConfiguration('navbar');
  }

  protected getItemOrder(): string[] {
    return this.getNavbarConfiguration().get<string[]>('itemOrder', []);
  }

  protected async setItemOrder(order: string[]): Promise<void> {
    await this.configurationRegistry.updateConfigurationValue('navbar.itemOrder', order, CONFIGURATION_DEFAULT_SCOPE);
  }

  protected getPinnedLinks(): PinnedExtensionLink[] {
    return this.getNavbarConfiguration().get<PinnedExtensionLink[]>('pinnedLinks', []);
  }

  protected async setPinnedLinks(links: PinnedExtensionLink[]): Promise<void> {
    await this.configurationRegistry.updateConfigurationValue('navbar.pinnedLinks', links, CONFIGURATION_DEFAULT_SCOPE);
  }
}
