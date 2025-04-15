/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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
import type { IconDefinition } from '/@api/icon-info.js';

import type { ApiSenderType } from './api.js';
import { Deferred } from './util/deferred.js';

type DialogType = 'none' | 'info' | 'error' | 'question' | 'warning';

export type RemindOption = 'Remind me tomorrow' | 'Remind me in 2 days' | `Don't show again`;

export interface DropdownType {
  heading: string;
  buttons: string[];
}

export interface IconButtonType {
  label: string;
  icon: IconDefinition;
}

export type ButtonsType = string | DropdownType | IconButtonType;

/**
 * Options to configure the behavior of the message box UI.
 */
export interface MessageBoxOptions {
  /**
   * The title of the message box.
   */
  title: string;
  /**
   * The primary message.
   */
  message: string;
  /**
   * An additional (optional) detailed message.
   */
  detail?: string;
  /**
   * Text for buttons.
   */
  buttons?: ButtonsType[];
  /**
   * The (optional) type, one of 'none' | 'info' | 'error' | 'question' | 'warning'.
   */
  type?: string;
  /**
   * The (optional) index of the default button.
   */
  defaultId?: number;
  /**
   * The (optional) index of the button to be used to cancel the dialog.
   */
  cancelId?: number;
  /**
   * An additional (optional) markdown description
   */
  footerMarkdownDescription?: string;
}

export interface MessageBoxReturnValue {
  response: number | undefined;
  option: number | undefined;
}

export class MessageBox {
  private callbackId = 0;

  private callbacksMessageBox = new Map<number, Deferred<MessageBoxReturnValue>>();

  constructor(private apiSender: ApiSenderType) {}

  async showMessageBox(options: MessageBoxOptions): Promise<MessageBoxReturnValue> {
    // keep track of this request
    this.callbackId++;

    // create a promise that will be resolved when the frontend sends the result
    const deferred = new Deferred<MessageBoxReturnValue>();

    // store the callback that will resolve the promise
    this.callbacksMessageBox.set(this.callbackId, deferred);

    const data = {
      id: this.callbackId,
      title: options.title,
      message: options.message,
      detail: options.detail,
      buttons: options.buttons,
      type: options.type,
      defaultId: options.defaultId,
      cancelId: options.cancelId,
      footerMarkdownDescription: options.footerMarkdownDescription,
    };

    // need to send the options to the frontend
    this.apiSender.send('showMessageBox:open', data);

    // return the promise
    return deferred.promise;
  }

  isDropdownType(response: ButtonsType | undefined): response is DropdownType {
    return (
      typeof response === 'object' &&
      response !== null &&
      'heading' in response &&
      'buttons' in response &&
      Array.isArray((response as DropdownType).buttons)
    );
  }

  async showDialog(
    type: DialogType,
    title: string,
    message: string,
    items: ButtonsType[],
  ): Promise<string | undefined> {
    const result = await this.showMessageBox({
      title: title,
      message: message,
      buttons: items,
      type: type,
    });

    if (result.response !== undefined && result.response >= 0) {
      const response = items[result.response];
      if (result.option !== undefined && result.option >= 0) {
        if (this.isDropdownType(response)) return response.buttons[result.option];
      }
      if (typeof response === 'string') return response;
    }

    return undefined;
  }

  // this method is called by the frontend when the user selected a button
  async onDidSelectButton(
    id: number,
    selectedIndex: number | undefined,
    selectedOption: number | undefined,
  ): Promise<void> {
    // get the callback
    const callback = this.callbacksMessageBox.get(id);

    // if there is a callback
    if (callback) {
      // grab item
      const val: MessageBoxReturnValue = {
        response: selectedIndex,
        option: selectedOption,
      };
      // resolve the promise
      callback.resolve(val);
    }

    // remove the callback
    this.callbacksMessageBox.delete(id);
  }
}
