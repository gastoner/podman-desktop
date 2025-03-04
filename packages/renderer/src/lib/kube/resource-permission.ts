/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { kubernetesContextsPermissions } from '/@/stores/kubernetes-context-permission';
import { kubernetesContexts } from '/@/stores/kubernetes-contexts';
import type { IDisposable } from '/@api/disposable';
import type { ContextPermission } from '/@api/kubernetes-contexts-permissions';
import type { ResourceName } from '/@api/kubernetes-contexts-states';

export async function listenResourcePermitted(
  resourceName: ResourceName,
  callback: (permitted: boolean) => void,
): Promise<IDisposable> {
  const experimental = (await window.getConfigurationValue<boolean>('kubernetes.statesExperimental')) ?? false;
  let contextName = '';
  let permissions: ContextPermission[] = [];

  const computePermission = (): void => {
    const permission = permissions.find(
      permission => permission.contextName === contextName && permission.resourceName === resourceName,
    );

    if (!permission) {
      callback(true);
      return;
    }
    callback(permission.permitted);
  };

  if (!experimental) {
    callback(true);
    return { dispose: (): void => {} };
  }

  const unsubscribeContexts = kubernetesContexts.subscribe(value => {
    contextName = value.find(c => c.currentContext)?.name ?? '';
    computePermission();
  });

  const unsubscribePermissions = kubernetesContextsPermissions.subscribe(newPermissions => {
    permissions = newPermissions;
    computePermission();
  });

  return {
    dispose: (): void => {
      unsubscribeContexts();
      unsubscribePermissions();
    },
  };
}
