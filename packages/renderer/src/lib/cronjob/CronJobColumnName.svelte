<script lang="ts">
import type { CronJobUI } from './CronJobUI';

interface Props {
  object: CronJobUI;
}
let { object }: Props = $props();
</script>

<!-- Add the summary in the future, keep hover:cursor-pointer so we do not forget! -->
<button class="hover:cursor-pointer flex flex-col max-w-full">
  <div class="text-[var(--pd-table-body-text-highlight)] max-w-full overflow-hidden text-ellipsis">
    {object.name}
  </div>
  <div class="flex flex-row text-sm gap-1">
    {#if object.namespace}
      <div class="font-extra-light text-[var(--pd-table-body-text)]">{object.namespace}</div>
    {/if}
  </div>
</button>
