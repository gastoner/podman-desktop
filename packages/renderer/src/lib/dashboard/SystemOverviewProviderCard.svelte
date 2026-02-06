<script lang="ts">
import SystemOverviewProviderCardDetailed from '/@/lib/dashboard/SystemOverviewProviderCardDetailed.svelte';
import SystemOverviewProviderCardMinimal from '/@/lib/dashboard/SystemOverviewProviderCardMinimal.svelte';
import {
  convertProviderStatusToSystemOverviewStatus,
  type Status,
} from '/@/stores/dashboard/system-overview.svelte';
import type { ProviderConnectionInfo, ProviderInfo } from '/@api/provider-info';

interface Props {
  connection: ProviderConnectionInfo;
  provider: ProviderInfo;
}

let { connection, provider }: Props = $props();

let connectionStatus: Status | undefined = $derived(convertProviderStatusToSystemOverviewStatus(connection.status));
</script>

{#if connectionStatus?.id === 'healthy' && provider.id !== 'podman'}
    <SystemOverviewProviderCardMinimal connection={connection} provider={provider} />
{:else}
    <SystemOverviewProviderCardDetailed connection={connection} provider={provider} />
{/if}
