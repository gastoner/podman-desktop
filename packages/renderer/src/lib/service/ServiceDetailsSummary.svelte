<script lang="ts">
import type { V1Service } from '@kubernetes/client-node';
import { ErrorMessage } from '@podman-desktop/ui-svelte';

import Table from '/@/lib/details/DetailsTable.svelte';

import type { EventUI } from '../events/EventUI';
import KubeEventsArtifact from '../kube/details/KubeEventsArtifact.svelte';
import KubeObjectMetaArtifact from '../kube/details/KubeObjectMetaArtifact.svelte';
import KubeServiceArtifact from '../kube/details/KubeServiceArtifact.svelte';
import KubeServiceStatusArtifact from '../kube/details/KubeServiceStatusArtifact.svelte';

export let service: V1Service | undefined;
export let kubeError: string | undefined = undefined;
export let events: EventUI[];
</script>

<!-- Show the kube error if we're unable to retrieve the data correctly, but we still want to show the
basic information -->
{#if kubeError}
  <ErrorMessage error={kubeError} />
{/if}

<Table>
  {#if service}
    <KubeObjectMetaArtifact artifact={service.metadata} />
    <KubeServiceStatusArtifact artifact={service.status} />
    <KubeServiceArtifact serviceName={service.metadata?.name} namespace={service.metadata?.namespace} artifact={service.spec} />
    <KubeEventsArtifact events={events} />
  {:else}
    <p class="text-[var(--pd-state-info)] font-medium">Loading ...</p>
  {/if}
</Table>
