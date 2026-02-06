<script lang="ts">
import type { ContainerProviderConnection } from '@podman-desktop/api';
import { filesize } from 'filesize';

import ResourceProgressBar from '/@/lib/dashboard/ResourceProgressBar.svelte';
import type { ProviderInfo, ProviderContainerConnectionInfo } from '/@api/provider-info';
  import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
  import { Icon } from '@podman-desktop/ui-svelte/icons';

interface Props {
  providers: ProviderInfo[];
}

let { providers }: Props = $props();

type RawUsage = {
  cpuUsage: number;
  cpuTotal: number;
  memoryUsage: number;
  memoryTotal: number;
  diskUsage: number;
  diskTotal: number;
};

type ResourceUsage = {
  cpu: { value: string; percent: number; used: string; total: string };
  memory: { value: string; percent: number; used: string; total: string };
  disk: { value: string; percent: number; used: string; total: string };
};

function buildResourceUsage(r: RawUsage): ResourceUsage {
  const cpuUsed = r.cpuUsage > 0 && r.cpuTotal > 0 ? ((r.cpuUsage / 100) * r.cpuTotal).toFixed(1) : '0.0';
  const memoryUsed = r.memoryUsage > 0 && r.memoryTotal > 0 ? (r.memoryUsage / 100) * r.memoryTotal : 0;
  const diskUsed = r.diskUsage > 0 && r.diskTotal > 0 ? (r.diskUsage / 100) * r.diskTotal : 0;
  return {
    cpu: {
      value: `${cpuUsed}/${r.cpuTotal} cores`,
      percent: r.cpuUsage,
      used: cpuUsed,
      total: String(r.cpuTotal),
    },
    memory: {
      value: `${filesize(memoryUsed)}/${filesize(r.memoryTotal)}`,
      percent: r.memoryUsage,
      used: filesize(memoryUsed),
      total: filesize(r.memoryTotal),
    },
    disk: {
      value: `${filesize(diskUsed)} / ${filesize(r.diskTotal)}`,
      percent: r.diskUsage,
      used: filesize(diskUsed),
      total: filesize(r.diskTotal),
    },
  };
}

// All podman container connections (all machines)
let podmanConnections = $derived.by(() => {
  const podmanProvider = providers.find(p => p.id === 'podman');
  if (!podmanProvider || podmanProvider.containerConnections.length === 0) {
    return [];
  }
  return podmanProvider.containerConnections;
});

// Carousel items: [Overall, ...per-connection]
type CarouselItem = { id: string; name: string; resourceUsage: ResourceUsage };

async function loadResourceData(
  conns: ProviderContainerConnectionInfo[],
): Promise<CarouselItem[]> {
  if (conns.length === 0) return [];
  const scope = (c: ProviderContainerConnectionInfo) => c as unknown as ContainerProviderConnection;
  const connectionUsages = await Promise.all(
    conns.map(async connection => {
      const [cpuUsage = 0, cpuTotal = 0, memoryUsage = 0, memoryTotal = 0, diskUsage = 0, diskTotal = 0] = await Promise.all([
        window.getConfigurationValue<number>('podman.machine.cpusUsage', scope(connection)),
        window.getConfigurationValue<number>('podman.machine.cpus', scope(connection)),
        window.getConfigurationValue<number>('podman.machine.memoryUsage', scope(connection)),
        window.getConfigurationValue<number>('podman.machine.memory', scope(connection)),
        window.getConfigurationValue<number>('podman.machine.diskSizeUsage', scope(connection)),
        window.getConfigurationValue<number>('podman.machine.diskSize', scope(connection)),
      ]);
      return { connection, raw: { cpuUsage, cpuTotal, memoryUsage, memoryTotal, diskUsage, diskTotal } };
    }),
  );
  let cpuUsageSum = 0;
  let cpuTotalSum = 0;
  let memoryUsedSum = 0;
  let memoryTotalSum = 0;
  let diskUsedSum = 0;
  let diskTotalSum = 0;
  for (const { raw } of connectionUsages) {
    if (raw.cpuUsage > 0 && raw.cpuTotal > 0) {
      cpuUsageSum += (raw.cpuUsage / 100) * raw.cpuTotal;
      cpuTotalSum += raw.cpuTotal;
    }
    if (raw.memoryUsage > 0 && raw.memoryTotal > 0) {
      memoryUsedSum += (raw.memoryUsage / 100) * raw.memoryTotal;
      memoryTotalSum += raw.memoryTotal;
    }
    if (raw.diskUsage > 0 && raw.diskTotal > 0) {
      diskUsedSum += (raw.diskUsage / 100) * raw.diskTotal;
      diskTotalSum += raw.diskTotal;
    }
  }
  const items: CarouselItem[] = [];
  if (connectionUsages.length > 1) {
    const overallRaw = buildResourceUsage({
      cpuUsage: cpuTotalSum > 0 ? (100 * cpuUsageSum) / cpuTotalSum : 0,
      cpuTotal: cpuTotalSum,
      memoryUsage: memoryTotalSum > 0 ? (100 * memoryUsedSum) / memoryTotalSum : 0,
      memoryTotal: memoryTotalSum,
      diskUsage: diskTotalSum > 0 ? (100 * diskUsedSum) / diskTotalSum : 0,
      diskTotal: diskTotalSum,
    });
    items.push({ id: 'overall', name: 'Overall', resourceUsage: overallRaw });
  }
  for (const { connection, raw } of connectionUsages) {
    items.push({
      id: connection.name,
      name: connection.name,
      resourceUsage: buildResourceUsage(raw),
    });
  }
  return items;
}

// Async derived: recomputes when podmanConnections changes
let resourceData = $derived(await loadResourceData(podmanConnections));

let selectedIndex = $state(0);

function goPrev(length: number) {
  if (length <= 1) return;
  selectedIndex = selectedIndex <= 0 ? length - 1 : selectedIndex - 1;
}

function goNext(length: number) {
  if (length <= 1) return;
  selectedIndex = selectedIndex >= length - 1 ? 0 : selectedIndex + 1;
}
</script>

{#if resourceData.length > 0}
  {@const currentIndex = Math.min(selectedIndex, resourceData.length - 1)}
  {@const currentItem = resourceData[currentIndex]}
  {@const resourceUsage = currentItem.resourceUsage}
  <div class="p-4 bg-[var(--pd-content-card-carousel-card-bg)] rounded-lg">
    <div class="flex flex-row flex-nowrap items-center gap-2 mb-2 min-w-0">
      <h3 class="text-xs font-normal text-[var(--pd-content-text-sub)] uppercase tracking-wider truncate min-w-0 flex-1">{currentItem.name} Resources</h3>
      {#if resourceData.length > 1}
        <div class="flex flex-row items-center gap-0.5 flex-shrink-0" role="group" aria-label="Switch resource view">
          <button type="button" class="flex items-center justify-center size-6 rounded text-[var(--pd-content-text-sub)] hover:bg-[var(--pd-button-secondary-hover-bg)] hover:text-[var(--pd-content-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pd-focus-ring)]" onclick={() => goPrev(resourceData.length)} aria-label="Previous"><Icon icon={faChevronLeft} class="size-3.5" /></button>
          <span class="text-[10px] text-[var(--pd-content-text-sub)] min-w-[3ch] text-center tabular-nums" aria-live="polite">{currentIndex + 1}/{resourceData.length}</span>
          <button type="button" class="flex items-center justify-center size-6 rounded text-[var(--pd-content-text-sub)] hover:bg-[var(--pd-button-secondary-hover-bg)] hover:text-[var(--pd-content-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pd-focus-ring)]" onclick={() => goNext(resourceData.length)} aria-label="Next"><Icon icon={faChevronRight} class="size-3.5" /></button>
        </div>
      {/if}
    </div>

    <div class="grid grid-cols-3 gap-6">
      {#if resourceUsage.cpu}
        <ResourceProgressBar 
          label="CPU"
          percent={resourceUsage.cpu.percent}
          value={resourceUsage.cpu.value}
        />
      {/if}

      {#if resourceUsage.memory}
        <ResourceProgressBar 
          label="Memory"
          percent={resourceUsage.memory.percent}
          value={resourceUsage.memory.value}
        />
      {/if}

      {#if resourceUsage.disk}
        <ResourceProgressBar 
          label="Disk"
          percent={resourceUsage.disk.percent}
          value={resourceUsage.disk.value}
        />
      {/if}
    </div>
  </div>
{/if}
