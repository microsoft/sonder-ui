/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { SelectOption } from '../shared/interfaces';
import { getActionFromKey, getIndexByLetter, getUpdatedIndex, isScrollable, maintainScrollVisibility, MenuActions, uniqueId } from '../shared/utils';

@Component({
  tag: 'listbox-expand',
  styleUrl: '../../shared/combo-base.css',
  shadow: false
})
export class ListboxExpand {
  /**
   * Array of name/value options
   */
  @Prop() options: SelectOption[];

  /**
   * String label
   */
  @Prop() label: string;

  /**
   * Emit a custom select event on value change
   */
  @Event({
    eventName: 'select'
  }) selectEvent: EventEmitter;

  // Active option index
  @State() activeIndex = 0;

  // Menu state
  @State() open = false;

  // Selected option index
  @State() selectedIndex: number;

  // input value
  @State() value = '';

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // Prevent menu closing before click completed
  private ignoreBlur = false;

  // save reference to active option
  private activeOptionRef: HTMLElement;

  // save reference to listbox element
  private listboxRef: HTMLElement;

  componentDidUpdate() {
    if (this.open && isScrollable(this.listboxRef)) {
      maintainScrollVisibility(this.activeOptionRef, this.listboxRef);
    }
  }

  render() {
    const {
      activeIndex,
      htmlId,
      label = '',
      open = false,
      options = [],
      value
    } = this;

    const activeId = open ? `${htmlId}-${activeIndex}` : '';

    return ([
      <label id={htmlId} class="combo-label">{label}</label>,
      <div class={{ combo: true, open }}>
        <div
          aria-activedescendant={activeId}
          aria-describedby={`${htmlId}-current`}
          aria-expanded={`${open}`}
          aria-labelledby={htmlId}
          class="input-wrapper"
          ref={(el) => this.listboxRef = el}
          role="listbox"
          tabindex="0"
          onBlur={this.onComboBlur.bind(this)}
          onKeyDown={this.onListboxKeyDown.bind(this)}
        >
          <div class="combo-input" role="presentation" id={`${htmlId}-current`} onClick={() => this.updateMenuState(true)}>{value}</div>
          <div class="combo-menu" role="presentation">
            {options.map((option, i) => {
              return (
                <div
                  class={{ 'option-current': this.activeIndex === i, 'combo-option': true }}
                  id={`${this.htmlId}-${i}`}
                  aria-selected={this.selectedIndex === i ? 'true' : false}
                  ref={(el) => {if (this.activeIndex === i) this.activeOptionRef = el; }}
                  role="option"
                  onClick={() => { this.onOptionClick(i); }}
                  onMouseDown={this.onOptionMouseDown.bind(this)}
                >{option.name}</div>
              );
            })}
          </div>
        </div>
      </div>
    ]);
  }

  private onComboBlur() {
    if (this.ignoreBlur) {
      this.ignoreBlur = false;
      return;
    }

    this.updateMenuState(false);
  }

  private onListboxKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const max = this.options.length - 1;
    const action = getActionFromKey(key, this.open);

    switch(action) {
      case MenuActions.Open:
        return this.updateMenuState(true);
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        return this.onOptionChange(getUpdatedIndex(this.activeIndex, max, action));
      case MenuActions.CloseSelect:
        this.selectOption(this.activeIndex);
      case MenuActions.Close:
        event.preventDefault();
        return this.updateMenuState(false);
      case MenuActions.Type:
        this.activeIndex = Math.max(0, getIndexByLetter(this.options, key));
        break;
    }
  }

  private onOptionChange(index: number) {
    this.activeIndex = index;
  }

  private onOptionClick(index: number) {
    this.onOptionChange(index);
    this.selectOption(index);
    this.updateMenuState(false);
  }

  private onOptionMouseDown() {
    this.ignoreBlur = true;
  }

  private selectOption(index: number) {
    const selected = this.options[index];
    this.value = selected.name;
    this.selectedIndex = index;
    this.selectEvent.emit(selected);
  }

  private updateMenuState(open: boolean) {
    this.open = open;
  }
}