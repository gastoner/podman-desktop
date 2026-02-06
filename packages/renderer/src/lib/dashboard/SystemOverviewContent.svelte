<script lang="ts">
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import SystemOverviewProviderCard from '/@/lib/dashboard/SystemOverviewProviderCard.svelte';
import SystemOverviewProviderCardMinimal from '/@/lib/dashboard/SystemOverviewProviderCardMinimal.svelte';
import SystemOverviewResourceUsage from '/@/lib/dashboard/SystemOverviewResourceUsage.svelte';
import { providerInfos } from '/@/stores/providers';
import type { ProviderConnectionInfo, ProviderInfo } from '/@api/provider-info';

import {
  convertProviderStatusToSystemOverviewStatus,
  getSystemOverviewState,
  type Status,
} from '../../stores/dashboard/system-overview.svelte';

let providers = $derived($providerInfos);

let status: Status = $derived(getSystemOverviewState(providers));

// Get all connections from all providers with their provider info
let allConnectionsWithProvider = $derived(
  providers.flatMap(provider => {
    const connections: Array<{ connection: ProviderConnectionInfo; provider: ProviderInfo }> = [];

    // Add container connections
    provider.containerConnections.forEach(conn => {
      connections.push({ connection: conn, provider });
    });

    // Add kubernetes connections
    provider.kubernetesConnections.forEach(conn => {
      connections.push({ connection: conn, provider });
    });

    // Add vm connections
    provider.vmConnections.forEach(conn => {
      connections.push({ connection: conn, provider });
    });

    return connections;
  }),
);

// Separate minimal (healthy non-podman) and detailed connections
let minimalConnections = $derived(
  allConnectionsWithProvider.filter(({ connection, provider }) => {
    const status = convertProviderStatusToSystemOverviewStatus(connection.status);
    return status?.id === 'healthy' && provider.id !== 'podman';
  }),
);

let detailedConnections = $derived(
  allConnectionsWithProvider.filter(({ connection, provider }) => {
    const status = convertProviderStatusToSystemOverviewStatus(connection.status);
    return !(status?.id === 'healthy' && provider.id !== 'podman');
  }),
);

// Get providers without connections that should still be shown
let providersWithoutConnections = $derived(
  providers.filter(
    provider =>
      provider.containerConnections.length === 0 &&
      provider.kubernetesConnections.length === 0 &&
      provider.vmConnections.length === 0 &&
      (provider.status === 'started' || provider.status === 'ready'),
  ),
);

function navigateToResources(): void {
  router.goto('/preferences/resources');
}

function getStatusBackgroundClass(status: Status): string {
  switch (status.id) {
    case 'healthy':
      return 'bg-[var(--pd-system-overview-healthy-bg)]';
    case 'stable':
      return 'bg-[var(--pd-system-overview-stable-bg)]';
    case 'critical':
      return 'bg-[var(--pd-system-overview-critical-bg)]';
    case 'progressing':
      return 'bg-[var(--pd-system-overview-progressing-bg)]';
    default:
      return 'bg-[var(--pd-system-overview-stable-bg)]';
  }
}

function getStatusTextClass(status: Status): string {
  switch (status.id) {
    case 'healthy':
      return 'text-[var(--pd-system-overview-healthy-text)]';
    case 'stable':
      return 'text-[var(--pd-system-overview-stable-text)]';
    case 'critical':
      return 'text-[var(--pd-system-overview-critical-text)]';
    case 'progressing':
      return 'text-[var(--pd-system-overview-progressing-text)]';
    default:
      return 'text-[var(--pd-system-overview-stable-text)]';
  }
}
</script>

<button
    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-colors border border-transparent"
    class:text-[var(--pd-system-overview-healthy-text)]={status.id === 'healthy'}
    class:text-[var(--pd-system-overview-stable-text)]={status.id === 'stable'}
    class:text-[var(--pd-system-overview-critical-text)]={status.id === 'critical'}
    class:text-[var(--pd-system-overview-progressing-text)]={status.id === 'progressing'}
    class:bg-[var(--pd-system-overview-healthy-bg)]={status.id === 'healthy'}
    class:bg-[var(--pd-system-overview-stable-bg)]={status.id === 'stable'}
    class:bg-[var(--pd-system-overview-critical-bg)]={status.id === 'critical'}
    class:bg-[var(--pd-system-overview-progressing-bg)]={status.id === 'progressing'}
    aria-label="System Overview - Navigate to resources"
    onclick={navigateToResources}>
    <Icon icon={status.icon} />
    <span class="text-sm">{status.text}</span>
    <Icon icon={faChevronRight} />
</button>

<div class="flex flex-col gap-2 pt-2">
    <!-- Detailed connections (vertical stack) -->
    {#each detailedConnections as { connection, provider }, index}
        <SystemOverviewProviderCard connection={connection} provider={provider} />
    {/each}
    
    <!-- Minimal connections (horizontal wrap) -->
    {#if minimalConnections.length > 0}
        <div class="flex flex-wrap gap-2">
            {#each minimalConnections as { connection, provider }, index}
                <SystemOverviewProviderCardMinimal {connection} {provider} />
            {/each}
        </div>
    {/if}

    <!-- Show providers without connections that are running -->
    {#if providersWithoutConnections.length > 0}
        <div class="flex flex-wrap gap-2">
            {#each providersWithoutConnections as provider, index}
                {@const providerStatus = convertProviderStatusToSystemOverviewStatus(provider.status)}
                
                <div class="inline-flex items-center gap-2 px-3 py-2 bg-[var(--pd-content-card-carousel-card-bg)] rounded-lg hover:bg-[var(--pd-content-card-carousel-card-hover-bg)] transition-colors">
                    <!-- Provider Logo -->
                    {#if provider.images?.icon}
                        {#if typeof provider.images.icon === 'string'}
                            <img src={provider.images.icon} alt={provider.name} class="w-5 h-5" />
                        {:else if provider.images.icon.light}
                            <img src={provider.images.icon.light} alt={provider.name} class="w-5 h-5 dark:hidden" />
                            <img src={provider.images.icon.dark ?? provider.images.icon.light} alt={provider.name} class="w-5 h-5 hidden dark:block" />
                        {/if}
                    {:else}
                        <div class="w-5 h-5 bg-[var(--pd-content-card-bg)] rounded-full flex items-center justify-center">
                            <span class="text-xs font-bold text-[var(--pd-content-card-text)]">{provider.name[0].toUpperCase()}</span>
                        </div>
                    {/if}

                    <!-- Provider Name and Status -->
                    <span class="text-sm text-[var(--pd-content-card-text)]">{provider.name}</span>
                    {#if providerStatus}
                        <Icon icon={providerStatus.icon} size={14} class={getStatusTextClass(providerStatus)} />
                    {/if}
                </div>
            {/each}
        </div>
    {/if}

    <!-- Show message if no connections and no providers -->
    {#if allConnectionsWithProvider.length === 0 && providersWithoutConnections.length === 0}
        <div class="p-8 text-center bg-[var(--pd-content-card-carousel-card-bg)] rounded-lg">
            <p class="text-[var(--pd-content-text-sub)]">No connections available</p>
            <div class="mt-4">
                <Button type="primary" onclick={navigateToResources}>
                    Set up connections
                </Button>
            </div>
        </div>
    {/if}

    <!-- Podman Resource Usage -->
    <SystemOverviewResourceUsage {providers} />

</div>