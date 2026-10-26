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

import type { DropSlotRect } from '@desktop-framework/api';
import { describe, expect, test } from 'vitest';

import { NavigationDropSlot } from './navigation-drop-slot';

function rect(top: number, height = 40): DropSlotRect {
  return { top, height, bottom: top + height };
}

const navigationDropSlot = new NavigationDropSlot();

describe('NavigationDropSlot.getDropSlot', () => {
  const rects = [rect(100), rect(150), rect(200)];
  const containerTop = 100;

  test('returns insert-before index and indicator at item top when pointer is above midpoint', () => {
    expect(navigationDropSlot.getDropSlot(110, rects, containerTop)).toEqual({ index: 0, indicatorY: 0 });
    expect(navigationDropSlot.getDropSlot(160, rects, containerTop)).toEqual({ index: 1, indicatorY: 50 });
  });

  test('returns next slot when pointer is at or past an item midpoint', () => {
    expect(navigationDropSlot.getDropSlot(120, rects, containerTop)).toEqual({ index: 1, indicatorY: 50 });
    expect(navigationDropSlot.getDropSlot(170, rects, containerTop)).toEqual({ index: 2, indicatorY: 100 });
  });

  test('returns after-last slot with indicator at last bottom', () => {
    expect(navigationDropSlot.getDropSlot(300, rects, containerTop)).toEqual({ index: 3, indicatorY: 140 });
  });

  test('returns slot 0 when there are no items', () => {
    expect(navigationDropSlot.getDropSlot(50, [], 0)).toEqual({ index: 0, indicatorY: 0 });
  });
});

describe('NavigationDropSlot.keepsItemInPlace', () => {
  test('returns true for either adjacent slot that leaves the item in place', () => {
    expect(navigationDropSlot.keepsItemInPlace(2, 2)).toBe(true);
    expect(navigationDropSlot.keepsItemInPlace(2, 3)).toBe(true);
    expect(navigationDropSlot.keepsItemInPlace(2, 1)).toBe(false);
    expect(navigationDropSlot.keepsItemInPlace(2, 4)).toBe(false);
  });
});

describe('NavigationDropSlot.insertOrMoveAtSlot', () => {
  test('moves existing items up and down within the list', () => {
    expect(navigationDropSlot.insertOrMoveAtSlot(['A', 'B', 'C'], 'C', 0)).toEqual(['C', 'A', 'B']);
    expect(navigationDropSlot.insertOrMoveAtSlot(['A', 'B', 'C'], 'A', 3)).toEqual(['B', 'C', 'A']);
  });

  test('leaves an existing item in place when inserted at either adjacent slot', () => {
    expect(navigationDropSlot.insertOrMoveAtSlot(['A', 'B', 'C'], 'B', 1)).toEqual(['A', 'B', 'C']);
    expect(navigationDropSlot.insertOrMoveAtSlot(['A', 'B', 'C'], 'B', 2)).toEqual(['A', 'B', 'C']);
  });

  test('inserts a new item at a clamped slot without duplicating existing items', () => {
    expect(navigationDropSlot.insertOrMoveAtSlot(['A', 'B', 'C'], 'X', 1)).toEqual(['A', 'X', 'B', 'C']);
    expect(navigationDropSlot.insertOrMoveAtSlot(['A', 'B'], 'X', 99)).toEqual(['A', 'B', 'X']);
    expect(navigationDropSlot.insertOrMoveAtSlot([], 'X', 5)).toEqual(['X']);
  });

  test('moves an already-visible item to a lower slot without an off-by-one shift', () => {
    expect(navigationDropSlot.insertOrMoveAtSlot(['A', 'B', 'C', 'D'], 'B', 2)).toEqual(['A', 'B', 'C', 'D']);
    expect(navigationDropSlot.insertOrMoveAtSlot(['A', 'B', 'C', 'D'], 'B', 3)).toEqual(['A', 'C', 'B', 'D']);
    expect(navigationDropSlot.insertOrMoveAtSlot(['A', 'B', 'C', 'D'], 'B', 4)).toEqual(['A', 'C', 'D', 'B']);
  });
});
