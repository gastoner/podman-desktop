<script lang="ts">
import { Button, Page } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import { lastPage } from '../../stores/breadcrumb';
import Fa from 'svelte-fa';
import { faChevronDown, faCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import TaskManagerEmptyScreen from './TaskManagerEmptyScreen.svelte';
import TaskManagerGroup from './TaskManagerGroup.svelte';
import { tasksInfo, clearNotifications } from '/@/stores/tasks';

export function goToPreviousPage(): void {
  router.goto($lastPage.path);
}

$: runningTasks = $tasksInfo.filter(task => task.state === 'running');
$: completedTasks = $tasksInfo.filter(task => task.state !== 'running');

</script>


<Page title="Tasks" on:close={goToPreviousPage}>
  <i slot="icon" class="fa fa-bars-progress fa-2x" aria-hidden="true"> </i>
  <div class="flex w-full h-full overflow-auto" slot="content">
    <div class="flex flex-col w-full m-4 space-y-4">

        {#if runningTasks.length > 0}
            <div class="flex flex-col w-full bg-[var(--pd-content-card-bg)] p-4 rounded-lg">
                <div class="flex flex-row w-full pb-2 items-center">
                <Fa size="1.5x" class="pr-2" icon={faCircle} />
                <div class="text-xl" aria-label="Running tasks">Running tasks ({runningTasks.length})</div>
                </div>
            </div>
        {/if}

        {#if completedTasks.length > 0}
            <div class="flex flex-col w-full bg-[var(--pd-content-card-bg)] p-4 rounded-lg">
                <div class="flex flex-row w-full pb-2 items-center">
                <Fa size="1.5x" class="pr-2" icon={faCheck} />
                <div class="text-xl" aria-label="Completed">Completed ({completedTasks.length})</div>
                </div>
            </div>
        {/if}

        {#if $tasksInfo.length === 0}
            <TaskManagerEmptyScreen />
        {/if}

        

        {#if $tasksInfo.length > 0}
        <div class="flex flex-col grow h-[100px] overflow-y-auto">
          <!-- running tasks-->
          {#if runningTasks.length > 0}
            <div class="flex bg-[var(--pd-content-bg)] px-4">
              <TaskManagerGroup
                lineColor="bg-[var(--pd-invert-content-card-bg)]"
                icon={faCircle}
                tasks={runningTasks}
                title="running tasks" />
            </div>
          {/if}

          <!-- completed tasks-->
          {#if completedTasks.length > 0}
            <div class="flex bg-[var(--pd-invert-content-card-bg)] pt-1 px-4">
              <TaskManagerGroup
                lineColor="bg-[var(--pd-invert-content-bg)]"
                icon={faCheck}
                tasks={completedTasks}
                title="completed" />
            </div>
          {/if}
        </div>
      {/if}

      <!-- footer of the task manager -->
      <!-- only if there are tasks-->
      {#if completedTasks.length > 0}
        <div class="flex flex-row w-full">
          <div class="p-2 flex flex-row space-x-2 w-full">
            <Button on:click={() => clearNotifications()}>Clear</Button>
            <!--<Button>View task history</Button>-->
          </div>
        </div>
      {/if}    

    </div>
  </div>
</Page>
