<script lang="ts">
import {
  faBalanceScale,
  faNetworkWired,
  faPlug,
  faQuestionCircle,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Fa } from 'svelte-fa';

import Label from '../../ui/Label.svelte';
import type { Props } from './props';

let { object }: Props = $props();

// Determine both the icon and color based on the service type
function getTypeAttributes(type: string): { color: string; icon: IconDefinition } {
  switch (type) {
    case 'ClusterIP':
      // faNetworkWired: Represents internal network connections, suitable for ClusterIP
      return { color: 'text-[var(--pd-badge-sky)]', icon: faNetworkWired };
    case 'LoadBalancer':
      // faBalanceScale: Symbolizes distribution, fitting for LoadBalancer that distributes traffic
      return { color: 'text-[var(--pd-badge-purple)]', icon: faBalanceScale };
    case 'NodePort':
      // faPlug: Indicates a connection point, appropriate for NodePort which exposes services on each Node's IP
      return { color: 'text-[var(--pd-badge-fuschia)]', icon: faPlug };
    default:
      // faQuestionCircle: Used for unknown or unspecified types
      return { color: 'text-[var(--pd-badge-gray)]', icon: faQuestionCircle };
  }
}
</script>

<Label name={object.type}>
  <Fa size="1x" icon={getTypeAttributes(object.type).icon} class={getTypeAttributes(object.type).color} />
</Label>
