<svelte:options runes={true} />

<script lang="ts">
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { Tooltip } from '@podman-desktop/ui-svelte';
import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';
import { onDestroy, onMount } from 'svelte';
import type { Unsubscriber } from 'svelte/store';
import Fa from 'svelte-fa';
import { onMount } from 'svelte';
import type { TinroRouteMeta } from 'tinro';

import AuthActions from './lib/authentication/AuthActions.svelte';
import { CommandRegistry } from './lib/CommandRegistry';
import NewContentOnDashboardBadge from './lib/dashboard/NewContentOnDashboardBadge.svelte';
import AccountIcon from './lib/images/AccountIcon.svelte';
import DashboardIcon from './lib/images/DashboardIcon.svelte';
import SettingsIcon from './lib/images/SettingsIcon.svelte';
import NavItem from './lib/ui/NavItem.svelte';
import NavRegistryEntry from './lib/ui/NavRegistryEntry.svelte';
import NavSection from './lib/ui/NavSection.svelte';
import { combinedInstalledExtensions } from './stores/all-installed-extensions';
import { containersInfos } from './stores/containers';
import { contributions } from './stores/contribs';
import { imagesInfos } from './stores/images';
import { kubernetesContexts } from './stores/kubernetes-contexts';
import {
  kubernetesCurrentContextConfigMaps,
  kubernetesCurrentContextDeployments,
  kubernetesCurrentContextIngresses,
  kubernetesCurrentContextNodes,
  kubernetesCurrentContextPersistentVolumeClaims,
  kubernetesCurrentContextRoutes,
  kubernetesCurrentContextSecrets,
  kubernetesCurrentContextServices,
} from './stores/kubernetes-contexts-state';
import { podsInfos } from './stores/pods';
import { volumeListInfos } from './stores/volumes';

let podInfoSubscribe: Unsubscriber;
let containerInfoSubscribe: Unsubscriber;
let imageInfoSubscribe: Unsubscriber;
let volumeInfoSubscribe: Unsubscriber;
let contextsSubscribe: Unsubscriber;
let nodesSubscribe: Unsubscriber;
let deploymentsSubscribe: Unsubscriber;
let persistentVolumeClaimsSubscribe: Unsubscriber;
let servicesSubscribe: Unsubscriber;
let ingressesSubscribe: Unsubscriber;
let routesSubscribe: Unsubscriber;
let configmapsSubscribe: Unsubscriber;
let secretsSubscribe: Unsubscriber;
let combinedInstalledExtensionsSubscribe: Unsubscriber;

let podCount = '';
let containerCount = '';
let imageCount = '';
let volumeCount = '';
let configmapsCount = 0;
let secretsCount = 0;
let configmapSecretsCount = '';
let persistentVolumeClaimsCount = '';
let contextCount = 0;
let deploymentCount = '';
let nodeCount = '';
let serviceCount = '';
let ingressesCount = 0;
let routesCount = 0;
let ingressesRoutesCount = '';
let extensionCount = '';
let authActions: AuthActions;
let outsideWindow: HTMLDivElement;

const imageUtils = new ImageUtils();
export let exitSettingsCallback: () => void;
import { navigationRegistry } from './stores/navigation/navigation-registry';

let { exitSettingsCallback, meta = $bindable() }: { exitSettingsCallback: () => void; meta: TinroRouteMeta } = $props();

const iconSize = '22';

onMount(async () => {
  const commandRegistry = new CommandRegistry();
  commandRegistry.init();
});

function clickSettings(b: boolean) {
  if (b) {
    exitSettingsCallback();
  } else {
    window.location.href = '#/preferences/resources';
  }
}
</script>

<svelte:window />
<nav
  class="group w-leftnavbar min-w-leftnavbar flex flex-col hover:overflow-y-none bg-[var(--pd-global-nav-bg)] border-[var(--pd-global-nav-bg-border)] border-r-[1px]"
  aria-label="AppNavigation">
  <NavItem href="/" tooltip="Dashboard" bind:meta={meta}>
    <div class="relative w-full">
      <div class="flex items-center w-full h-full">
        <DashboardIcon size={iconSize} />
      </div>
      <NewContentOnDashboardBadge />
    </div>
  </NavItem>
  {#each $navigationRegistry as navigationRegistryItem}
    <!-- This is a section -->
    {#if navigationRegistryItem.type === 'section' && navigationRegistryItem.enabled}
      {@const allItemsHidden = (navigationRegistryItem.items ?? []).every(item => item.hidden)}
      {#if !allItemsHidden}
        <NavSection tooltip={navigationRegistryItem.name}>
          <svelte:component this={navigationRegistryItem.icon.iconComponent} size={iconSize} slot="icon" />

          {#if navigationRegistryItem.items}
            {#each navigationRegistryItem.items as item}
              <NavRegistryEntry entry={item} bind:meta={meta} />
            {/each}
          {/if}
        </NavSection>
      {/if}
    {:else if navigationRegistryItem.items && navigationRegistryItem.type === 'group'}
      <!-- This is a group, list all items from the entry -->
      {#each navigationRegistryItem.items as item}
        <NavRegistryEntry entry={item} bind:meta={meta} />
      {/each}
    {:else if navigationRegistryItem.type === 'entry'}
      <NavRegistryEntry entry={navigationRegistryItem} bind:meta={meta} />
    {/if}
  {/each}

  <div class="grow"></div>

  <div bind:this={outsideWindow}>
    <NavItem href="/accounts" tooltip="" bind:meta={meta} onClick={event => authActions.onButtonClick(event)}>
      <Tooltip bottomRight tip="Accounts">
        <AccountIcon size={iconSize} />
      </Tooltip>
      <AuthActions bind:this={authActions} outsideWindow={outsideWindow} />
    </NavItem>
  </div>

  <NavItem
    href="/preferences"
    tooltip="Settings"
    bind:meta={meta}
    onClick={() => clickSettings(meta.url.startsWith('/preferences'))}>
    <SettingsIcon size={iconSize} />
  </NavItem>
</nav>
