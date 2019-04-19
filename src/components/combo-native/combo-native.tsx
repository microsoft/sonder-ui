/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop } from '@stencil/core';
import { SelectOption } from '../../shared/interfaces';
import { uniqueId } from '../../shared/utils';

@Component({
  tag: 'combo-native',
  styleUrl: '../../shared/combo-base.css',
  shadow: false
})
export class ComboNative {
  /**
   * Array of name/value options
   */
  @Prop() options: SelectOption[];

  /**
   * String label
   */
  @Prop() label: string;

  /**
   * boolean required
   */
  @Prop() required: boolean;

  /**
   * Emit a custom select event on value change
   */
  @Event({
    eventName: 'select'
  }) selectEvent: EventEmitter;

  /**
   * Unique ID that should really use a UUID library instead
   */
  private htmlId = uniqueId();

  private selectHandler(value: string) {
    const selectedOption = this.options.filter((option) => option.value === value);
    selectedOption.length > 0 && this.selectEvent.emit(selectedOption[0]);
  }

  render() {
    const {
      htmlId,
      label = '',
      options = [],
      required
    } = this;

    return ([
      <label htmlFor={htmlId} class="combo-label">{label}</label>,
      <select
        id={htmlId}
        class="combo combo-input"
        required={required ? true: null }
        onChange={(event: Event) => this.selectHandler((event.target as HTMLSelectElement).value)}
      >
        {options.map((option) => <option value={option.value}>{option.name}</option>)}
      </select>
    ]);
  }
}