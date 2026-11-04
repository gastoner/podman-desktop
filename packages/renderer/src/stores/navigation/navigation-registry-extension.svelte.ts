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

import {
  type ContributionInfo,
  type GoToInfo,
  NavigationPage,
  type PinnedExtensionLink,
  type WebviewInfo,
} from '@desktop-framework/api';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';

import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import { configurationProperties } from '/@/stores/configurationProperties';
import { contributions } from '/@/stores/contribs';
import { webviews } from '/@/stores/webviews';

import type { NavigationRegistryEntry } from './navigation-registry';
import { NavigationUtils } from './navigation-utils';

const navigationUtils = new NavigationUtils();

export function createNavigationExtensionEntry(): NavigationRegistryEntry {
  const registry: NavigationRegistryEntry = {
    name: 'Extensions',
    icon: { iconComponent: ExtensionIcon },
    link: '/extensions',
    tooltip: 'Extensions',
    type: 'entry',
    destinations: [],
    get counter() {
      return 0;
    },
  };
  return registry;
}

let extensionNavigationGroupItems: NavigationRegistryEntry[] = $state([]);

let webviewDestinations = $state<GoToInfo[]>([]);
let contribDestinations = $state<GoToInfo[]>([]);

// pinned extension navigation items, from the navbar.pinnedLinks configuration
let pinnedLinks: PinnedExtensionLink[] = [];
// current navbar configuration, used to compute the visibility of the pinned items
let navbarItemOrder: string[] = [];
let navbarDisabledItems: string[] = [];

export function createNavigationExtensionGroup(): NavigationRegistryEntry {
  const mainGroupEntry: NavigationRegistryEntry = {
    name: 'Extensions',
    icon: { iconComponent: ExtensionIcon },
    link: `/extensions`,
    tooltip: 'Extensions',
    type: 'group',
    get destinations() {
      return [...webviewDestinations, ...contribDestinations];
    },
    get counter() {
      return 0;
    },
    get items() {
      return extensionNavigationGroupItems;
    },
  };

  let allContribs: ContributionInfo[] = [];
  let allWebviews: WebviewInfo[] = [];

  const refresh = (): void => {
    const newItems: NavigationRegistryEntry[] = [];

    // append an entry for each pinned extension navigation item
    for (const link of pinnedLinks) {
      newItems.push(createPinnedLinkEntry(link, allWebviews));
    }

    contribDestinations = allContribs.map(contrib => {
      const registry: NavigationRegistryEntry = {
        name: contrib.name,
        icon: {
          iconImage: contrib.icon,
        },
        link: `/contribs/${contrib.name}`,
        type: 'entry',
        tooltip: contrib.name,
        destinations: [],
        get counter() {
          return 0;
        },
      };
      newItems.push(registry);
      return {
        page: NavigationPage.CONTRIBUTION,
        parameters: { name: contrib.name },
        icon: { iconImage: contrib.icon },
        name: `Extensions: ${contrib.name}`,
      };
    });

    webviewDestinations = allWebviews.map(webview => {
      const icon = webview.icon ? { iconImage: webview.icon } : { faIconImage: faPuzzlePiece, size: '1.5x' };
      const registry: NavigationRegistryEntry = {
        name: webview.name,
        icon,
        link: `/webviews/${webview.id}`,
        tooltip: webview.name,
        type: 'entry',
        destinations: [],
        get counter() {
          return 0;
        },
      };
      newItems.push(registry);
      return {
        page: NavigationPage.WEBVIEW,
        parameters: { id: webview.id },
        icon,
        name: `Extensions: ${webview.name}`,
      };
    });

    extensionNavigationGroupItems = newItems;
  };

  contributions.subscribe(contribs => {
    allContribs = [...contribs];
    refresh();
  });

  webviews.subscribe(webviews => {
    allWebviews = [...webviews];
    refresh();
  });

  // re-read the pinned links and the navbar configuration on each configuration change
  configurationProperties.subscribe(() => {
    if (!window.getConfigurationValue) {
      return;
    }
    Promise.all([
      window.getConfigurationValue<PinnedExtensionLink[]>('navbar.pinnedLinks'),
      window.getConfigurationValue<string[]>('navbar.itemOrder'),
      window.getConfigurationValue<string[]>('navbar.disabledItems'),
    ])
      .then(([links, itemOrder, disabledItems]) => {
        pinnedLinks = links ?? [];
        navbarItemOrder = itemOrder ?? [];
        navbarDisabledItems = disabledItems ?? [];
        refresh();
      })
      .catch((err: unknown) => console.error('Error getting the pinned navigation links configuration', err));
  });

  return mainGroupEntry;
}

// create a main navigation entry for a pinned extension item: it is a child of its webview
// entry, so it is only visible when its order key is part of the navbar order
function createPinnedLinkEntry(link: PinnedExtensionLink, allWebviews: WebviewInfo[]): NavigationRegistryEntry {
  const webview = allWebviews.find(
    webview => webview.extensionId === link.extensionId && webview.viewType === link.viewType,
  );
  const parentName = webview?.name ?? link.webviewName;
  const orderKey = navigationUtils.formatNavigationName(link.title, parentName);
  const orderIndex = navbarItemOrder.indexOf(orderKey);
  const index = orderIndex === -1 ? undefined : orderIndex;

  return {
    name: link.title,
    parentName,
    icon: createPinnedLinkIcon(link.icon, webview),
    // without webview, open the extension details; the query keeps the link unique as the navigation is keyed by link
    link: webview
      ? `/webviews/${webview.id}${link.path}`
      : `/extensions/details/${link.extensionId}?pinned=${encodeURIComponent(link.path)}`,
    tooltip: link.title,
    type: 'entry',
    destinations: [],
    counter: 0,
    index,
    hidden: navbarDisabledItems.includes(orderKey) || index === undefined,
  };
}

function createPinnedLinkIcon(
  icon: PinnedExtensionLink['icon'],
  webview: WebviewInfo | undefined,
): NavigationRegistryEntry['icon'] {
  if (typeof icon === 'string') {
    return { iconImage: icon };
  }
  if (icon) {
    return { faIcon: { definition: icon, size: 'lg' } };
  }
  if (webview?.icon) {
    return { iconImage: webview.icon };
  }
  return { faIcon: { definition: faPuzzlePiece, size: 'lg' } };
}
