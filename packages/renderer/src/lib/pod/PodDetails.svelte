<script lang="ts">
import { ErrorMessage, StatusIcon, Tab } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import type { PodInfo } from '/@api/pod-info';

import Route from '../../Route.svelte';
import { podsInfos } from '../../stores/pods';
import PodIcon from '../images/PodIcon.svelte';
import DetailsPage from '../ui/DetailsPage.svelte';
import StateChange from '../ui/StateChange.svelte';
import { getTabUrl, isTabSelected } from '../ui/Util';
import { PodUtils } from './pod-utils';
import PodActions from './PodActions.svelte';
import PodDetailsInspect from './PodDetailsInspect.svelte';
import PodDetailsKube from './PodDetailsKube.svelte';
import PodDetailsLogs from './PodDetailsLogs.svelte';
import type { PodInfoUI } from './PodInfoUI';
import PodmanPodDetailsSummary from './PodmanPodDetailsSummary.svelte';

interface Props {
  podName: string;
  engineId: string;
}
let { podName, engineId }: Props = $props();

const podUtils = new PodUtils();
let detailsPage: DetailsPage | undefined = $state();

// update current route scheme
let currentRouterPath: string = $derived($router.path);
let podInfo: PodInfo | undefined = $derived(
  $podsInfos.find(podInPods => podInPods.Name === podName && podInPods.engineId === engineId),
);
let podInfoUI: PodInfoUI | undefined = $derived(podInfo ? podUtils.getPodInfoUI(podInfo) : undefined);

$effect(() => {
  if (podInfoUI && currentRouterPath.endsWith('/')) {
    router.goto(`${currentRouterPath}logs`);
  }

  if (!podInfoUI) detailsPage?.close();
});
</script>

{#if podInfoUI}
  <DetailsPage title={podInfoUI.name} subtitle={podInfoUI.shortId} bind:this={detailsPage}>
    {#snippet iconSnippet()}
      <StatusIcon icon={PodIcon} size={24} status={podInfoUI.status} />
    {/snippet}
    {#snippet actionsSnippet()}
      <div class="flex items-center w-5">
        {#if podInfoUI.actionError}
          <ErrorMessage error={podInfoUI.actionError} icon wrapMessage />
        {:else}
          <div>&nbsp;</div>
        {/if}
      </div>
      <PodActions pod={podInfoUI} detailed={true} />
    {/snippet}
    {#snippet detailSnippet()}
      <div class="flex py-2 w-full justify-end text-sm text-[var(--pd-content-text)]">
        <StateChange state={podInfoUI.status} />
      </div>
    {/snippet}
    {#snippet tabsSnippet()}
      <Tab title="Summary" selected={isTabSelected($router.path, 'summary')} url={getTabUrl($router.path, 'summary')} />
      <Tab title="Logs" selected={isTabSelected($router.path, 'logs')} url={getTabUrl($router.path, 'logs')} />
      <Tab title="Inspect" selected={isTabSelected($router.path, 'inspect')} url={getTabUrl($router.path, 'inspect')} />
      <Tab title="Kube" selected={isTabSelected($router.path, 'kube')} url={getTabUrl($router.path, 'kube')} />
    {/snippet}
    {#snippet contentSnippet()}
      <Route path="/summary" breadcrumb="Summary" navigationHint="tab">
        <PodmanPodDetailsSummary pod={podInfoUI} />
      </Route>
      <Route path="/logs" breadcrumb="Logs" navigationHint="tab">
        <PodDetailsLogs pod={podInfoUI} />
      </Route>
      <Route path="/inspect" breadcrumb="Inspect" navigationHint="tab">
        <PodDetailsInspect pod={podInfoUI} />
      </Route>
      <Route path="/kube" breadcrumb="Kube" navigationHint="tab">
        <PodDetailsKube pod={podInfoUI} />
      </Route>
    {/snippet}
  </DetailsPage>
{/if}
