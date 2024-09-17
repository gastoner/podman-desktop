<script lang="ts">
import type { StatusBarEntry } from '../../../../main/src/plugin/statusbar/statusbar-registry';
import { iconClass } from './StatusBarItem';
import { tasksInfo } from '/@/stores/tasks';

$: runningTasks = $tasksInfo.filter(task => task.state === 'running');
$: failedTasks = $tasksInfo.filter(task => task.status === 'failure');
$: notificationTasks = $tasksInfo.length - runningTasks.length - failedTasks.length;

export let entry: StatusBarEntry;

function tooltipText(entry: StatusBarEntry): string {
  return entry.tooltip ?? '';
}

function opacity(entry: StatusBarEntry): string {
  return entry.enabled ? 'opacity-100' : 'opacity-25';
}

function hoverBackground(entry: StatusBarEntry): string {
  return entry.enabled && typeof entry.command === 'string' ? 'hover:bg-[var(--pd-statusbar-hover-bg)]' : '';
}

function hoverCursor(entry: StatusBarEntry): string {
  return entry.enabled && typeof entry.command === 'string' ? 'hover:cursor-pointer' : '';
}

async function executeCommand(entry: StatusBarEntry) {
  if (typeof entry.command === 'undefined') {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await window.executeStatusBarEntryCommand(entry.command, entry.commandArgs);
}
</script>

<button
  on:click={() => {
    executeCommand(entry);
  }}
  class="{opacity(entry)} px-1 py-px flex h-full items-center {hoverBackground(entry)} {hoverCursor(
    entry,
  )} relative inline-block"
  title={tooltipText(entry)}>
  {#if iconClass(entry)}
    {#if tooltipText(entry) === 'Tasks'}
      <span class="fa fa-circle-exclamation {failedTasks.length ? 'text-red-600' : ''}" aria-hidden="true"></span>
      <span class="px-1">{failedTasks.length}</span>
      <span class="fa fa-bell {notificationTasks ? 'text-yellow' : ''}" aria-hidden="true"></span>
      <span class="px-1">{notificationTasks}</span>
      <span class="fa fa-person-running {runningTasks.length ? 'text-sky-600' : ''}" aria-hidden="true"></span>
      <span class="px-1">{runningTasks.length}</span>
    {:else}
      <span class={iconClass(entry)} aria-hidden="true"></span>
    {/if}
  {/if}
  {#if entry.text}
    <span class="ml-1">{entry.text}</span>
  {/if}
  <!-- {#if entry.highlight}
    <span role="status" class="absolute bg-[var(--pd-notification-dot)] rounded-full p-1 top-[1px] right-[-1px]"></span>
  {/if} -->
</button>
