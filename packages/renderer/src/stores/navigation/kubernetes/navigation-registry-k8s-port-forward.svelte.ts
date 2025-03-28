/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

import NodeIcon from '/@/lib/images/KeyIcon.svelte';

import { kubernetesCurrentContextPortForwards } from '../../kubernetes-contexts-state';
import type { NavigationRegistryEntry } from '../navigation-registry';

let count = $state(0);

export function createNavigationKubernetesPortForwardEntry(): NavigationRegistryEntry {
  kubernetesCurrentContextPortForwards.subscribe(nodes => {
    count = nodes.length;
  });
  return {
    name: 'Port Forwarding',
    icon: { iconComponent: NodeIcon },
    link: '/kubernetes/portForward',
    tooltip: 'Port Forwarding',
    type: 'entry',
    get counter(): number {
      return count;
    },
  };
}
