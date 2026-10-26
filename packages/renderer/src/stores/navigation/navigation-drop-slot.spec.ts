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

import { describe, expect, test } from 'vitest';

import { NavigationDropSlot } from './navigation-drop-slot';

const navigationDropSlot = new NavigationDropSlot();

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
