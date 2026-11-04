<script lang="ts">
import type { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import type { Component } from 'svelte';

import ChevronExpander from '../icons/ChevronExpander.svelte';
import Icon from '../icons/Icon.svelte';
import { KeyboardUtils } from '../utils/keyboard-utils';

interface Props {
  title: string;
  href: string;
  section?: boolean;
  expanded?: boolean;
  child?: boolean;
  selected?: boolean;
  pinnable?: boolean;
  icon?: IconDefinition | Component | string;
  iconRight?: IconDefinition | Component | string;
  iconRightAlign?: 'inline' | 'end';
  onClick?: () => void;
  ariaKeyShortcuts?: string;
  onKeyDown?: (event: KeyboardEvent) => void;
}

let {
  title,
  href,
  section = false,
  expanded = $bindable(),
  child = false,
  selected = false,
  pinnable = false,
  icon = undefined,
  iconRight = undefined,
  iconRightAlign = 'end',
  onClick = (): void => {},
  ariaKeyShortcuts,
  onKeyDown,
}: Props = $props();

const keyboardUtils = new KeyboardUtils();

let sanitizedKeyShortcuts = $derived(keyboardUtils.sanitizeAriaKeyShortcuts(ariaKeyShortcuts));

function click(): void {
  expanded = !expanded;
  onClick();
}

interface PodmanDesktopWebviewApi {
  showNavigationItemMenu?: (item: { title: string; href: string; icon?: string | IconDefinition }) => Promise<void>;
}

// Svelte components cannot be serialized: only strings and FontAwesome definitions are sent
function serializeNavigationIcon(): string | IconDefinition | undefined {
  return typeof icon === 'string' || typeof icon === 'object' ? icon : undefined;
}

// right-click on a pinnable item shows the Podman Desktop Pin/Unpin menu; inert outside of a webview
function onContextMenu(event: MouseEvent): void {
  if (!pinnable) {
    return;
  }
  const podmanDesktopApi = (
    window as { acquirePodmanDesktopApi?: () => PodmanDesktopWebviewApi }
  ).acquirePodmanDesktopApi?.();
  if (!podmanDesktopApi?.showNavigationItemMenu) {
    return;
  }
  event.preventDefault();
  podmanDesktopApi
    .showNavigationItemMenu({ title, href, icon: serializeNavigationIcon() })
    .catch((error: unknown) => console.error('Error while showing the navigation item menu', error));
}
</script>

<a
  class="no-underline block w-full"
  href={href}
  aria-label={title}
  title={title}
  aria-keyshortcuts={sanitizedKeyShortcuts}
  onclick={click}
  onkeydown={onKeyDown}
  oncontextmenu={onContextMenu}>
  <div
    data-settings-nav-row
    class="flex box-border w-full py-2 items-center cursor-pointer border-l-[4px]"
    class:pl-3={!child}
    class:pl-[34px]={child}
    class:pr-3={!child}
    class:pr-2={child}
    class:leading-none={child}
    class:text-md={!child}
    class:font-medium={!child}
    class:bg-[var(--pd-secondary-nav-selected-bg)]={selected}
    class:border-[var(--pd-secondary-nav-bg)]={!selected}
    class:border-[var(--pd-secondary-nav-selected-highlight)]={selected}
    class:text-[color:var(--pd-secondary-nav-text-selected)]={selected}
    class:text-[color:var(--pd-secondary-nav-text)]={!selected}
    class:hover:text-[color:var(--pd-secondary-nav-text-hover)]={!selected}
    class:hover:bg-[var(--pd-secondary-nav-text-hover-bg)]={!selected}
    class:hover:border-[var(--pd-secondary-nav-text-hover-bg)]={!selected}>
    <span class="flex flex-row gap-x-2 items-center min-w-0 grow" class:capitalize={!child} class:items-start={child}>
      {#if icon}
        <span class="w-4 shrink-0 flex justify-center">
          <Icon icon={icon}/>
        </span>
      {/if}
      <span
        data-settings-nav-title
        class="block"
        class:truncate={!child}
        class:whitespace-normal={child}
        class:break-words={child}>{title}</span>
      {#if iconRight && iconRightAlign === 'inline'}
        <Icon icon={iconRight}/>
      {/if}
    </span>
    <div class="w-3 shrink-0 flex items-center justify-end">
      {#if section}
        <span class="text-[color:var(--pd-secondary-nav-expander)] pointer-events-none">
          <ChevronExpander expanded={expanded} />
        </span>
      {:else if iconRight && iconRightAlign === 'end'}
        <Icon icon={iconRight}/>
      {/if}
    </div>
  </div>
</a>
