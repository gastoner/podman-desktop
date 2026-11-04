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

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface DisplayItem {
  name: string;
  visible: boolean;
  /**
   * Position in the main nav (0-based). Contiguous among items present in the nav.
   * Undefined when the item is pinnable but not currently in the main nav.
   */
  index?: number;
}

export interface DragPayload {
  /** Prefixed display name, e.g. "Settings > Resources" or "Kubernetes > Nodes". */
  name: string;
  link: string;
}

/** A navigation item contributed by an extension webview that can be pinned to the main navigation. */
export interface PinnableNavigationItem {
  /** Displayed title of the item, e.g. "Recipe Catalog". */
  title: string;
  /** Internal href of the item inside the webview, e.g. "/recipes". */
  href: string;
  /** Optional icon: an image path or a FontAwesome icon definition. */
  icon?: string | IconDefinition;
}

/** Persisted metadata of an extension navigation item pinned to the main navigation. */
export interface PinnedExtensionLink {
  extensionId: string;
  /** Webview view type the item belongs to. */
  viewType: string;
  /** Webview name when the item was pinned; used to derive the navigation order key. */
  webviewName: string;
  /** Internal href of the item inside the webview, e.g. "/recipes". */
  path: string;
  /** Displayed title of the item, e.g. "Recipe Catalog". */
  title: string;
  /** Optional icon: an image path or a FontAwesome icon definition, captured at pin time. */
  icon?: string | IconDefinition;
}
