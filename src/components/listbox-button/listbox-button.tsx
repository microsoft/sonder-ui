/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { SelectOption } from '../../shared/interfaces';
import { getActionFromKey, getIndexByLetter, getUpdatedIndex, isScrollable, maintainScrollVisibility, MenuActions, uniqueId } from '../../shared/utils';

@Component({
  tag: 'listbox-button',
  styleUrl: '../../shared/combo-base.css',
  shadow: false
})
export class ListboxButton {
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

  // Flag to set focus on next render completion
  private callFocus = false;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // Prevent menu closing before click completed
  private ignoreBlur = false;

  // save reference to active option
  private activeOptionRef: HTMLElement;

  // save reference to button element
  private buttonRef: HTMLButtonElement;

  // save reference to listbox element
  private listboxRef: HTMLElement;

  componentDidUpdate() {
    if (this.callFocus === true) {
      const focusEl = this.open ? this.listboxRef : this.buttonRef;
      focusEl.focus();
      this.callFocus = false;
    }

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
        <button
          aria-expanded={`${open}`}
          aria-haspopup="listbox"
          aria-labelledby={`${htmlId} ${htmlId}-button`}
          class="combo-input"
          id={`${htmlId}-button`}
          ref={(el) => this.buttonRef = el}
          type="button"
          onBlur={this.onComboBlur.bind(this)}
          onClick={() => this.updateMenuState(true)}
          onKeyDown={this.onButtonKeyDown.bind(this)}
        >{value}</button>

        <div
          aria-activedescendant={activeId}
          class="combo-menu"
          ref={(el) => this.listboxRef = el}
          role="listbox"
          tabindex="-1"
          onBlur={this.onComboBlur.bind(this)}
          onKeyDown={this.onListboxKeyDown.bind(this)}
        >
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
    ]);
  }

  private onButtonKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const action = getActionFromKey(key, this.open);

    switch(action) {
      case MenuActions.Close:
        event.preventDefault();
        return this.updateMenuState(false);
      case MenuActions.Type:
        this.activeIndex = Math.max(0, getIndexByLetter(this.options, key));
      case MenuActions.Open:
        return this.updateMenuState(true);
    }
  }

  private onComboBlur() {
    if (this.ignoreBlur) {
      this.ignoreBlur = false;
      return;
    }

    this.updateMenuState(false, false);
  }

  private onListboxKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const max = this.options.length - 1;
    const action = getActionFromKey(key, this.open);

    switch(action) {
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

  private updateMenuState(open: boolean, callFocus = true) {
    this.open = open;
    this.callFocus = callFocus;
    this.ignoreBlur = callFocus;
  }
}