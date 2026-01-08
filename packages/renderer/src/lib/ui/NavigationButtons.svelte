<script lang="ts">
import { faArrowLeft, faArrowRight, faBackward, faForward } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { onMount } from 'svelte';

import HistoryDropdown from '/@/lib/ui/HistoryDropdown.svelte';
import {
  BACK,
  type Direction,
  FORWARD,
  getBackEntries,
  getForwardEntries,
  goBack,
  goForward,
  goToHistoryIndex,
  navigationHistory,
} from '/@/stores/navigation-history.svelte';

const LONG_PRESS_DELAY = 500; // ms

let longPressTimer: NodeJS.Timeout | undefined = $state(undefined);
let showDropdown: Direction | undefined = $state(undefined);
let dropdownEntries: { index: number; name: string }[] = $state([]);
let hoveredEntryIndex: number | undefined = $state(undefined);
let isLongPressing = $state(false);
let canGoBack = $derived(navigationHistory.index > 0);
let canGoForward = $derived(navigationHistory.index < navigationHistory.stack.length - 1);
let isMac = $state(false);

function handleGlobalMouseUp(event: MouseEvent): void {
  // Handle mouse buttons 3/4 for back/forward
  if (event.button === 3) {
    event.preventDefault();
    goBack();
    return;
  } else if (event.button === 4) {
    event.preventDefault();
    goForward();
    return;
  }

  // Handle left button release for long-press dropdown selection
  if (event.button === 0 && isLongPressing) {
    if (showDropdown && hoveredEntryIndex !== undefined) {
      selectEntry(hoveredEntryIndex);
    }
    isLongPressing = false;
  }
}

function handleMouseDown(event: MouseEvent, direction: Direction): void {
  if (event.button !== 0) return;

  isLongPressing = true;

  longPressTimer = setTimeout(() => {
    const entries = direction === BACK ? getBackEntries() : getForwardEntries();
    if (entries.length > 0) {
      dropdownEntries = entries;
      showDropdown = direction;
    }
  }, LONG_PRESS_DELAY);
}

function handleClick(direction: Direction): void {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = undefined;
  }

  // Only navigate if dropdown isn't showing (short click)
  if (!showDropdown) {
    if (direction === BACK) {
      goBack();
    } else {
      goForward();
    }
  }

  isLongPressing = false;
}

function handleMouseLeave(): void {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = undefined;
  }
  if (!showDropdown) {
    isLongPressing = false;
  }
}

function selectEntry(index: number): void {
  window.telemetryTrack('navigation.historySelect', { direction: showDropdown }).catch(console.error);
  showDropdown = undefined;
  dropdownEntries = [];
  hoveredEntryIndex = undefined;
  goToHistoryIndex(index);
}

function closeDropdown(): void {
  showDropdown = undefined;
  dropdownEntries = [];
  hoveredEntryIndex = undefined;
}

function handleClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.history-dropdown')) {
    closeDropdown();
  }
}

// Keyboard shortcuts for navigation
// macOS: Cmd+[ or Cmd+Left (back), Cmd+] or Cmd+Right (forward)
// Windows/Linux: Alt+Left (back), Alt+Right (forward)
function handleKeyDown(e: KeyboardEvent): void {
  // Don't intercept shortcuts when typing in input fields
  const target = e.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return;
  }

  if (isMac) {
    // macOS: Cmd+[ or Cmd+Left (back), Cmd+] or Cmd+Right (forward)
    if (e.metaKey) {
      if (e.key === '[' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      } else if (e.key === ']' || e.key === 'ArrowRight') {
        e.preventDefault();
        goForward();
      }
    }
  } else {
    // Windows/Linux: Alt+Left and Alt+Right
    if (e.altKey) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goForward();
      }
    }
  }
}

onMount(async () => {
  const platform = await window.getOsPlatform();
  isMac = platform === 'darwin';
});

onMount(() => {
  window.addEventListener('mouseup', handleGlobalMouseUp);
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('keydown', handleKeyDown);

  return (): void => {
    window.removeEventListener('mouseup', handleGlobalMouseUp);
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('keydown', handleKeyDown);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };
});

function setHoveredEntryIndex(index: number | undefined): void {
  hoveredEntryIndex = index;
}
</script>

<div
  class="flex items-center gap-1 text-[color:var(--pd-global-nav-icon)]"
  style="-webkit-app-region: none;">
  <div class="relative">
    <button
      class="h-[25px] w-[25px] flex place-items-center justify-center hover:rounded hover:bg-[var(--pd-titlebar-hover-bg)] disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
      title="Back (hold for history)"
      onmousedown={(e: MouseEvent): void => handleMouseDown(e, BACK)}
      onclick={(): void => handleClick(BACK)}
      onmouseleave={handleMouseLeave}
      disabled={!canGoBack}>
      <Icon icon={faArrowLeft} />
    </button>
    <HistoryDropdown
      show={showDropdown === BACK}
      entries={dropdownEntries}
      icon={faBackward}
      {hoveredEntryIndex}
      {isLongPressing}
      onSelectEntry={selectEntry}
      onSetHoveredIndex={setHoveredEntryIndex} />
  </div>
  <div class="relative">
    <button
      class="h-[25px] w-[25px] flex place-items-center justify-center hover:rounded hover:bg-[var(--pd-titlebar-hover-bg)] disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
      title="Forward (hold for history)"
      onmousedown={(e: MouseEvent): void => handleMouseDown(e, FORWARD)}
      onclick={(): void => handleClick(FORWARD)}
      onmouseleave={handleMouseLeave}
      disabled={!canGoForward}>
      <Icon icon={faArrowRight} />
    </button>
    <HistoryDropdown
      show={showDropdown === FORWARD}
      entries={dropdownEntries}
      icon={faForward}
      {hoveredEntryIndex}
      {isLongPressing}
      onSelectEntry={selectEntry}
      onSetHoveredIndex={setHoveredEntryIndex} />
  </div>
</div>
