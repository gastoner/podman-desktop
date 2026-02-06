/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { faCheckCircle,faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { faInfoCircle, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { ProviderStatus } from '@podman-desktop/api';
import { Spinner } from '@podman-desktop/ui-svelte';
import type { Component } from 'svelte';

import type { ProviderConnectionInfo, ProviderInfo } from '/@api/provider-info';

export interface Status {
  id: string;
  text: string;
  icon: IconDefinition | Component | string;
  priority: number; // Higher number = worse status
}

// Priority levels: critical (3) > stable (2) > progressing (1) > healthy (0)
export const statusMap = new Map<string, Status>([
  // (Started, Ready)
  ['healthy', { id: 'healthy', text: 'All systems operational', icon: faCheckCircle, priority: 0 }],
  // (Starting, Configuring, Stopping)
  ['progressing', { id: 'progressing', text: 'Starting up...', icon: Spinner, priority: 1 }],
  // (not-installed, installed, stopped, update-available)
  ['stable', { id: 'stable', text: 'Some systems are stopped', icon: faInfoCircle, priority: 2 }],
  // (Error, Unknown)
  ['critical', { id: 'critical', text: 'Start', icon: faXmarkCircle, priority: 3 }],
]);

export function convertProviderStatusToSystemOverviewStatus(status: ProviderStatus): Status | undefined {
  switch (status) {
    case 'started':
    case 'ready':
      return statusMap.get('healthy');
    case 'not-installed':
    case 'installed':
    case 'stopped':
      return statusMap.get('stable');
    case 'error':
    case 'unknown':
      return statusMap.get('critical');
    case 'starting':
    case 'configuring':
    case 'stopping':
      return statusMap.get('progressing');
    default:
      // The connection is not created yet, so we don't know the status
      return undefined;
  }
}

/**
 * Evaluates all provider connections and returns the worst status based on priority.
 * Priority order: critical > stopped > progressing > healthy
 */
export function getSystemOverviewState(providers: ProviderInfo[]): Status {
  // If no providers exist, return healthy status
  if (!providers || providers.length === 0) {
    return statusMap.get('healthy')!;
  }

  // Collect all connections from all providers
  const allConnections: ProviderConnectionInfo[] = providers.flatMap(provider => [
    ...provider.containerConnections,
    ...provider.kubernetesConnections,
    ...provider.vmConnections,
  ]);

  // If no connections exist, return healthy status
  if (allConnections.length === 0) {
    return statusMap.get('healthy')!;
  }

  // Convert all connection statuses to system overview statuses
  const statuses = allConnections
    .map(connection => convertProviderStatusToSystemOverviewStatus(connection.status))
    .filter((status): status is Status => status !== undefined);

  // If no valid statuses found, return critical
  if (statuses.length === 0) {
    return statusMap.get('critical')!;
  }

  // Find and return the worst status (highest priority number)
  const worstStatus = statuses.reduce((worst, current) => {
    return current.priority > worst.priority ? current : worst;
  });

  return worstStatus;
}
