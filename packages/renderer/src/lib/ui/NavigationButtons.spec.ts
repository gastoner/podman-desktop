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

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  getBackEntries,
  getForwardEntries,
  goBack,
  goForward,
  goToHistoryIndex,
  navigationHistory,
} from '/@/stores/navigation-history.svelte';

import NavigationButtons from './NavigationButtons.svelte';

const goBackMock = vi.fn();
const goForwardMock = vi.fn();
const goToHistoryIndexMock = vi.fn();
const getBackEntriesMock = vi.fn().mockReturnValue([]);
const getForwardEntriesMock = vi.fn().mockReturnValue([]);

vi.mock(import('/@/stores/navigation-history.svelte'));

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });

  vi.mocked(window.telemetryTrack).mockResolvedValue(undefined);

  // Reset navigation history state
  vi.mocked(navigationHistory).stack = [];
  vi.mocked(navigationHistory).index = -1;
  vi.mocked(getBackEntries).mockImplementation(getBackEntriesMock);
  vi.mocked(getForwardEntries).mockImplementation(getForwardEntriesMock);
  vi.mocked(goBack).mockImplementation(goBackMock);
  vi.mocked(goForward).mockImplementation(goForwardMock);
  vi.mocked(goToHistoryIndex).mockImplementation(goToHistoryIndexMock);
});

describe('button states', () => {
  test('back button should be disabled when no history', async () => {
    render(NavigationButtons);

    const backButton = screen.getByTitle('Back (hold for history)');
    expect(backButton).toBeDisabled();
  });

  test('forward button should be disabled when no history', async () => {
    render(NavigationButtons);

    const forwardButton = screen.getByTitle('Forward (hold for history)');
    expect(forwardButton).toBeDisabled();
  });

  test('back button should be enabled when can go back', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    render(NavigationButtons);

    const backButton = screen.getByTitle('Back (hold for history)');
    expect(backButton).toBeEnabled();
  });

  test('forward button should be enabled when can go forward', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 0;

    render(NavigationButtons);

    const forwardButton = screen.getByTitle('Forward (hold for history)');
    expect(forwardButton).toBeEnabled();
  });
});

describe('click navigation', () => {
  test('clicking back button should call goBack', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    render(NavigationButtons);

    const backButton = screen.getByTitle('Back (hold for history)');

    // Simulate mousedown then mouseup (short click)
    await fireEvent.mouseDown(backButton, { button: 0 });
    await fireEvent.mouseUp(backButton);

    expect(goBackMock).toHaveBeenCalled();
  });

  test('clicking forward button should call goForward', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 0;

    render(NavigationButtons);

    const forwardButton = screen.getByTitle('Forward (hold for history)');

    // Simulate mousedown then mouseup (short click)
    await fireEvent.mouseDown(forwardButton, { button: 0 });
    await fireEvent.mouseUp(forwardButton);

    expect(goForwardMock).toHaveBeenCalled();
  });
});

describe('long press dropdown', () => {
  test('long press on back button should show dropdown', async () => {
    navigationHistory.stack = ['/containers', '/images', '/pods'];
    navigationHistory.index = 2;

    getBackEntriesMock.mockReturnValue([
      { index: 1, name: 'Images' },
      { index: 0, name: 'Containers' },
    ]);

    render(NavigationButtons);

    const backButton = screen.getByTitle('Back (hold for history)');

    // Start long press
    await fireEvent.mouseDown(backButton, { button: 0 });

    // Advance timer past long press delay (500ms)
    vi.advanceTimersByTime(600);
    await tick();

    // Dropdown should be visible
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Containers')).toBeInTheDocument();
  });

  test('long press on forward button should show dropdown', async () => {
    navigationHistory.stack = ['/containers', '/images', '/pods'];
    navigationHistory.index = 0;

    getForwardEntriesMock.mockReturnValue([
      { index: 1, name: 'Images' },
      { index: 2, name: 'Pods' },
    ]);

    render(NavigationButtons);

    const forwardButton = screen.getByTitle('Forward (hold for history)');

    // Start long press
    await fireEvent.mouseDown(forwardButton, { button: 0 });

    // Advance timer past long press delay (500ms)
    vi.advanceTimersByTime(600);
    await tick();

    // Dropdown should be visible
    expect(screen.getByText('Images')).toBeInTheDocument();
    expect(screen.getByText('Pods')).toBeInTheDocument();
  });

  test('short click should not show dropdown', async () => {
    navigationHistory.stack = ['/containers', '/images'];
    navigationHistory.index = 1;

    getBackEntriesMock.mockReturnValue([{ index: 0, name: 'Containers' }]);

    render(NavigationButtons);

    const backButton = screen.getByTitle('Back (hold for history)');

    // Short click (mousedown then mouseup before timer)
    await fireEvent.mouseDown(backButton, { button: 0 });
    vi.advanceTimersByTime(100); // Less than 500ms
    await fireEvent.mouseUp(backButton);
    await tick();

    // Dropdown should not be visible
    expect(screen.queryByText('Containers')).not.toBeInTheDocument();
  });
});

describe('dropdown item selection', () => {
  test('clicking dropdown item should navigate to that index', async () => {
    navigationHistory.stack = ['/containers', '/images', '/pods'];
    navigationHistory.index = 2;

    getBackEntriesMock.mockReturnValue([
      { index: 1, name: 'Images' },
      { index: 0, name: 'Containers' },
    ]);

    render(NavigationButtons);

    const backButton = screen.getByTitle('Back (hold for history)');

    // Long press to show dropdown
    await fireEvent.mouseDown(backButton, { button: 0 });
    vi.advanceTimersByTime(600);
    await tick();

    // Click on dropdown item
    const containersItem = screen.getByText('Containers');
    await fireEvent.click(containersItem);

    expect(goToHistoryIndexMock).toHaveBeenCalledWith(0);
    expect(window.telemetryTrack).toHaveBeenCalledWith('navigation.historySelect', { direction: 'back' });
  });
});

describe('mouse button navigation', () => {
  test('mouse button 3 should trigger goBack', async () => {
    render(NavigationButtons);

    // Simulate mouse button 3 (back)
    const mouseUpEvent = new MouseEvent('mouseup', { button: 3 });
    window.dispatchEvent(mouseUpEvent);

    expect(goBackMock).toHaveBeenCalled();
  });

  test('mouse button 4 should trigger goForward', async () => {
    render(NavigationButtons);

    // Simulate mouse button 4 (forward)
    const mouseUpEvent = new MouseEvent('mouseup', { button: 4 });
    window.dispatchEvent(mouseUpEvent);

    expect(goForwardMock).toHaveBeenCalled();
  });
});
