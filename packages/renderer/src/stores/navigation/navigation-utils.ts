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

import type { DragPayload } from '@desktop-framework/api';
import { get, type Readable } from 'svelte/store';

import { navigationDragState } from './navigation-drag-state.svelte';
import type { NavigationRegistryEntry } from './navigation-registry';

interface NavigationPinContext {
  navigationRegistry: Readable<NavigationRegistryEntry[]>;
  pinToNavbar: (payload: DragPayload) => number | undefined;
}

export class NavigationUtils {
  static readonly KEY_SHORTCUTS = 'Control+ArrowLeft Meta+ArrowLeft';

  constructor(private readonly pinContext?: NavigationPinContext) {}

  formatNavigationName(name: string, parentName?: string): string {
    return parentName ? `${parentName} > ${name}` : name;
  }

  flattenNavigationEntries(entries: NavigationRegistryEntry[], parentName?: string): NavigationRegistryEntry[] {
    const flat: NavigationRegistryEntry[] = [];
    for (const entry of entries) {
      const resolvedParentName = parentName ?? entry.parentName;
      if (entry.type === 'group') {
        flat.push(...this.flattenNavigationEntries(entry.items ?? [], resolvedParentName));
        continue;
      }

      flat.push(resolvedParentName === entry.parentName ? entry : { ...entry, parentName: resolvedParentName });
      if (entry.type === 'submenu') {
        flat.push(
          ...this.flattenNavigationEntries(
            entry.items ?? [],
            this.formatNavigationName(entry.name, resolvedParentName),
          ),
        );
      }
    }
    return flat;
  }

  findNavigationEntryByLink(
    entries: NavigationRegistryEntry[],
    link: string,
    parentName?: string,
  ): NavigationRegistryEntry | undefined {
    for (const entry of entries) {
      const resolvedParentName = parentName ?? entry.parentName;
      if (entry.type !== 'group' && entry.link === link) {
        return resolvedParentName === entry.parentName ? entry : { ...entry, parentName: resolvedParentName };
      }
      const childParentName =
        entry.type === 'submenu' ? this.formatNavigationName(entry.name, resolvedParentName) : resolvedParentName;
      const child = this.findNavigationEntryByLink(entry.items ?? [], link, childParentName);
      if (child) {
        return child;
      }
    }
    return undefined;
  }

  getVisibleOrderedEntries(entries: NavigationRegistryEntry[]): NavigationRegistryEntry[] {
    return this.flattenNavigationEntries(entries)
      .filter(entry => !entry.hidden && entry.index !== undefined)
      .toSorted((a, b) => (a.index ?? 0) - (b.index ?? 0));
  }

  onPinKeyDown = (payload: DragPayload, event: KeyboardEvent): void => {
    if (event.key !== 'ArrowLeft' || (!event.ctrlKey && !event.metaKey)) {
      return;
    }
    const pinContext = this.pinContext;
    if (!pinContext) {
      return;
    }
    event.preventDefault();
    const entry = this.findNavigationEntryByLink(get(pinContext.navigationRegistry), payload.link);
    if (!entry) {
      return;
    }
    const result = pinContext.pinToNavbar(payload);
    if (result === undefined) {
      return;
    }
    const name = this.formatNavigationName(entry.name, entry.parentName);
    navigationDragState.announcement = `Pinned ${name} to main navigation at position ${result}`;
  };
}
