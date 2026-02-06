<script lang="ts">
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import type { ProviderConnectionStatus } from '@podman-desktop/api';
import { Button, type ButtonType } from '@podman-desktop/ui-svelte';
import { Icon } from '@podman-desktop/ui-svelte/icons';
import { router } from 'tinro';

import KubernetesIcon from '/@/lib/images/KubernetesIcon.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import StatusDotGlow from '/@/lib/ui/StatusDotGlow.svelte';
import {
  eventCollect,
  registerConnectionCallback,
} from '/@/lib/preferences/preferences-connection-rendering-task';
import {
  convertProviderStatusToSystemOverviewStatus,
  type Status,
  statusMap,
} from '/@/stores/dashboard/system-overview.svelte';
import type { ProviderConnectionInfo, ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info';

interface Props {
  connection: ProviderConnectionInfo;
  provider: ProviderInfo;
}

let { connection, provider }: Props = $props();

let connectionStatus = $derived(getConnectionStatus(connection.status));
let vmType = $derived(getVmTypeName(connection));
let providerVersion = $derived(provider.version);
let displayName = $derived(connection.connectionType === 'container' ? connection.displayName : connection.name);

function getConnectionStatus(connectionStatus: ProviderConnectionStatus): Status | undefined {
  return convertProviderStatusToSystemOverviewStatus(connectionStatus);
}

function getVmTypeName(connection: ProviderConnectionInfo): string | undefined {
  if (connection.connectionType === 'container') {
    const containerConn = connection as ProviderContainerConnectionInfo;
    return containerConn.vmType?.name;
  }
  return undefined;
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

function getConnectionButtonType(connectionStatus: ProviderConnectionStatus, connectionType: string): ButtonType {
  switch (connectionStatus) {
    case 'started':
      return 'primary';
    case 'stopped':
      return 'secondary';
    case 'unknown':
      return 'danger';
    case 'starting':
      return 'secondary';
    case 'stopping':
      return 'secondary';
  }
}

function getConnectionButtonText(connectionStatus: ProviderConnectionStatus, connectionType: string): string {
  switch (connectionStatus) {
    case 'started':
      return 'View';
    case 'stopped':
      return connectionType === 'container' ? 'Start Machine' : 'Start';
    case 'unknown':
      return 'See Details in Resources';
    case 'starting':
    case 'stopping':
      return 'View';
    default:
      return 'See Details in Resources';
  }
}

function getLoggerHandler(_provider: ProviderInfo, _connectionInfo: ProviderConnectionInfo) {
  return {
    log: (_args: string[]): void => {},
    warn: (_args: string[]): void => {},
    error: (_args: string[]): void => {},
    onEnd: (): void => {},
  };
}

async function handleActionButtonClick(connection: ProviderConnectionInfo): Promise<void> {
  if (connection.status === 'stopped') {
    const loggerHandlerKey = registerConnectionCallback(getLoggerHandler(provider, connection));
    await window.startProviderConnectionLifecycle(
      provider.internalId,
      $state.snapshot(connection),
      loggerHandlerKey,
      eventCollect,
    );
  } else {
    router.goto(`/preferences/resources?focus=${provider.internalId}`);
  }
}
</script>

<div class="flex items-center gap-3 py-2 bg-[var(--pd-content-card-carousel-card-bg)] rounded-lg p-4">
    <!-- Provider Logo -->
    <div class="flex-shrink-0 rounded-md bg-[var(--pd-content-card-bg)] p-2">
        <Icon icon={connection.connectionType === 'container' ? PodIcon : KubernetesIcon } size={24} />
    </div>

    <!-- Connection Info -->
    <div class="flex-1 min-w-0">
        <!-- Connection Name with VM Type and Version -->
        <div class="flex items-center gap-2 text-[var(--pd-content-card-text)]">
            <span class="font-medium">{displayName}</span>
            {#if vmType ?? providerVersion}
                <span class="text-sm text-[var(--pd-content-text-sub)] bg-[var(--pd-content-card-bg)] rounded-md p-1">
                    {#if vmType}{vmType}{/if}
                    {#if vmType && providerVersion} - {/if}
                    {#if providerVersion}v{providerVersion}{/if}
                </span>
            {/if}
        </div>
        
        <!-- Status Line with Icon and Text -->
        <div class="flex items-center gap-1.5 mt-0.5">
            {#if connectionStatus}
                <Icon icon={connectionStatus.icon} size={12} class={getStatusTextClass(connectionStatus)} />
            {/if}
            
            {#if connection.status === 'started'}
                <span class="text-sm {getStatusTextClass(connectionStatus || statusMap.get('healthy')!)}">
                    <StatusDotGlow status={connection.status} showText={true} />
                </span>
            {:else if connection.status === 'stopped'}
                <span class="text-sm {getStatusTextClass(connectionStatus || statusMap.get('stable')!)}">
                    Stopped — {connection.connectionType === 'container' ? 'Required to run containers and pods' : 
                                connection.connectionType === 'kubernetes' ? 'Start to deploy Kubernetes workloads locally' : 
                                'Not running'}
                </span>
            {:else if connection.status === 'starting'}
                <span class="text-sm {getStatusTextClass(connectionStatus || statusMap.get('progressing')!)}">
                    Starting
                </span>
            {:else if connection.status === 'stopping'}
                <span class="text-sm {getStatusTextClass(connectionStatus || statusMap.get('progressing')!)}">
                    Stopping
                </span>
            {:else if connection.status === 'unknown'}
                <span class="text-sm {getStatusTextClass(connectionStatus || statusMap.get('critical')!)}">
                    Connection failed — Check connection status
                </span>
            {/if}
        </div>

        <!-- Error/Warning Messages -->
        {#if provider.warnings && provider.warnings.length > 0}
            <div class="flex items-center gap-1.5 mt-0.5">
                <Icon icon={faXmarkCircle} size={12} class="text-[var(--pd-status-terminated)]" />
                <span class="text-sm text-[var(--pd-status-terminated)]">
                    {#each provider.warnings as warning}
                        {warning.details ?? warning.name}
                    {/each}
                </span>
            </div>
        {/if}
    </div>

    <!-- Action Button -->
    <Button 
        type={getConnectionButtonType(connection.status, connection.connectionType)} 
        onclick={async () => await handleActionButtonClick(connection)}
    >
        {getConnectionButtonText(connection.status, connection.connectionType)}
    </Button>
    </div>