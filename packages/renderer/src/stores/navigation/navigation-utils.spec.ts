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

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { navigationDragState } from './navigation-drag-state.svelte';
import { navigationRegistry, type NavigationRegistryEntry, pinToNavbar } from './navigation-registry';
import { NavigationUtils } from './navigation-utils';

vi.mock(import('./navigation-registry'), async () => {
  const { writable } = await import('svelte/store');
  function entry(name: string, link: string, parentName?: string): NavigationRegistryEntry {
    return { name, link, parentName, tooltip: name, icon: {}, counter: 0, destinations: [], type: 'entry' };
  }
  return {
    pinToNavbar: vi.fn(),
    navigationRegistry: writable([
      { ...entry('Kubernetes', '/kubernetes'), type: 'submenu', items: [entry('Nodes', '/kubernetes/nodes')] },
      { ...entry('Tools', '/tools'), type: 'submenu', items: [entry('Nodes', '/tools/nodes')] },
      entry('Resources', '/preferences/resources', 'Settings'),
      entry('X', '/x', 'Settings'),
    ] satisfies NavigationRegistryEntry[]),
  };
});

const navigationUtils = new NavigationUtils();
const pinningContext = { navigationRegistry, pinToNavbar };
let pinningUtils = new NavigationUtils(pinningContext);

beforeEach(() => {
  vi.resetAllMocks();
  navigationDragState.announcement = '';
  pinningUtils = new NavigationUtils(pinningContext);
  vi.mocked(pinToNavbar).mockReturnValue(1);
});

function makeEntry(
  name: string,
  link: string,
  overrides: Partial<NavigationRegistryEntry> = {},
): NavigationRegistryEntry {
  return {
    name,
    icon: {},
    tooltip: name,
    link,
    counter: 0,
    destinations: [],
    type: 'entry',
    ...overrides,
  };
}

describe('formatNavigationName', () => {
  test('returns the name alone or prefixed with its parent name', () => {
    expect(navigationUtils.formatNavigationName('Pods')).toBe('Pods');
    expect(navigationUtils.formatNavigationName('Pods', 'Kubernetes')).toBe('Kubernetes > Pods');
  });
});

describe('flattenNavigationEntries', () => {
  test('flattens groups and qualifies both pinned and unpinned submenu children', () => {
    const entries: NavigationRegistryEntry[] = [
      makeEntry('Pods', '/pods', { index: 0 }),
      makeEntry('Extensions', '/extensions', {
        type: 'group',
        items: [makeEntry('Images', '/images', { index: 1 })],
      }),
      makeEntry('Kubernetes', '/kubernetes', {
        type: 'submenu',
        index: 2,
        items: [makeEntry('Pods', '/kubernetes/pods', { index: 3 }), makeEntry('Services', '/kubernetes/services')],
      }),
    ];

    const flattened = navigationUtils.flattenNavigationEntries(entries);

    expect(flattened.map(entry => entry.name)).toEqual(['Pods', 'Images', 'Kubernetes', 'Pods', 'Services']);
    expect(flattened[3]).toMatchObject({
      link: '/kubernetes/pods',
      name: 'Pods',
      parentName: 'Kubernetes',
      tooltip: 'Pods',
    });
  });

  test('derives a complete parent path through nested submenus and transparent groups', () => {
    const nodes = makeEntry('Nodes', '/tools/cluster/nodes', { index: 0 });
    const entries = [
      makeEntry('Tools', '/tools', {
        type: 'submenu',
        items: [
          makeEntry('Resources', '/resources', {
            type: 'group',
            items: [makeEntry('Cluster', '/tools/cluster', { type: 'submenu', items: [nodes] })],
          }),
        ],
      }),
    ];

    expect(navigationUtils.getVisibleOrderedEntries(entries)).toEqual([
      expect.objectContaining({ name: 'Nodes', parentName: 'Tools > Cluster', index: 0 }),
    ]);
    expect(nodes.parentName).toBeUndefined();
  });
});

describe('findNavigationEntryByLink', () => {
  test('finds nested entries and returns undefined for an unknown link', () => {
    const pods = makeEntry('Pods', '/kubernetes/pods');
    const entries = [
      makeEntry('Kubernetes', '/kubernetes', {
        type: 'submenu',
        items: [pods],
      }),
    ];

    expect(navigationUtils.findNavigationEntryByLink(entries, '/kubernetes/pods')).toEqual({
      ...pods,
      parentName: 'Kubernetes',
    });
    expect(navigationUtils.findNavigationEntryByLink(entries, '/unknown')).toBeUndefined();
  });
});

describe('pinning without a registry context', () => {
  test('pin methods are inert when no pin context is provided', () => {
    const utility = new NavigationUtils();
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true, cancelable: true });

    utility.onPinKeyDown({ name: 'Nodes', link: '/kubernetes/nodes' }, event);

    expect(event.defaultPrevented).toBe(false);
    expect(pinToNavbar).not.toHaveBeenCalled();
  });
});

describe('onPinKeyDown', () => {
  test('announces the registered destination and ignores unsuccessful pins', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', metaKey: true });
    pinningUtils.onPinKeyDown({ name: 'Other label', link: '/tools/nodes' }, event);
    expect(navigationDragState.announcement).toBe('Pinned Tools > Nodes to main navigation at position 1');

    navigationDragState.announcement = '';
    vi.mocked(pinToNavbar).mockReturnValue(undefined);
    pinningUtils.onPinKeyDown({ name: 'Nodes', link: '/tools/nodes' }, event);
    expect(navigationDragState.announcement).toBe('');
    pinningUtils.onPinKeyDown({ name: 'Unknown', link: '/unknown' }, event);
    expect(pinToNavbar).toHaveBeenCalledTimes(2);
  });

  test('pins with Ctrl+ArrowLeft and announces the result', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true, cancelable: true });

    pinningUtils.onPinKeyDown({ name: 'Settings > Resources', link: '/preferences/resources' }, event);

    expect(event.defaultPrevented).toBe(true);
    expect(navigationDragState.announcement).toContain('Settings > Resources');
  });

  test('ignores ArrowLeft without a modifier', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });

    pinningUtils.onPinKeyDown({ name: 'Settings > Resources', link: '/preferences/resources' }, event);

    expect(event.defaultPrevented).toBe(false);
  });
});
