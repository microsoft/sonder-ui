/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { SelectOption } from '../../shared/interfaces';
import { getActionFromKey, getIndexByLetter, getUpdatedIndex, isScrollable, maintainScrollVisibility, MenuActions, uniqueId } from '../../shared/utils';

@Component({
  tag: 'sui-select',
  styleUrl: './select.css',
  shadow: false
})
export class SuiSelect {
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

  // Current accumulated search string
  @State() searchString: string;

  // Timeout after each typed character
  @State() searchTimeout: number | null;

  // Selected option index
  @State() selectedIndex: number;

  // input value
  @State() value = '';

  // save reference to active option
  private activeOptionRef: HTMLElement;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // Prevent menu closing before click completed
  private ignoreBlur = false;

  // save reference to combobox element
  private inputRef: HTMLElement;

  // save reference to listbox
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
          role="combobox"
          aria-activedescendant={activeId}
          aria-autocomplete="none"
          aria-haspopup="listbox"
          aria-expanded={`${open}`}
          aria-labelledby={`${htmlId} ${htmlId}-value`}
          aria-controls={`${htmlId}-listbox`}
          class="combo-input"
          id={`${htmlId}-value`}
          ref={(el) => this.inputRef = el}
          tabindex="0"
          onBlur={this.onComboBlur.bind(this)}
          onClick={() => this.updateMenuState(true)}
          onKeyDown={this.onComboKeyDown.bind(this)}
        >
          {value}
        </div>
        <div class="combo-menu" role="listbox" ref={(el) => this.listboxRef = el} id={`${htmlId}-listbox`}>
          {options.map((option, i) => {
            return (
              <div
                class={{ 'option-current': this.activeIndex === i, 'combo-option': true }}
                id={`${this.htmlId}-${i}`}
                aria-selected={this.activeIndex === i ? 'true' : false}
                ref={(el) => {if (this.activeIndex === i) this.activeOptionRef = el; }}
                role="option"
                onClick={(event) => {
                  event.stopPropagation();
                  this.onOptionClick(i);
                }}
                onMouseDown={this.onOptionMouseDown.bind(this)}
              >{option.name}</div>
            );
          })}
        </div>
      </div>
    ]);
  }

  private getSearchString(char: string) {
    // reset typing timeout and start new timeout
    // this allows us to make multiple-letter matches, like a native select
    if (typeof this.searchTimeout === 'number') {
      window.clearTimeout(this.searchTimeout);
    }
  
    this.searchTimeout = window.setTimeout(() => {
      this.searchString = '';
    }, 500);
    
    // add most recent letter to saved search string
    this.searchString += char;
    return this.searchString;
  }

  private onComboKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const max = this.options.length - 1;

    const action = getActionFromKey(event, this.open);

    switch(action) {
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        return this.onOptionChange(getUpdatedIndex(this.activeIndex, max, action));
      case MenuActions.CloseSelect:
      case MenuActions.Space:
        event.preventDefault();
        this.selectOption(this.activeIndex);
      case MenuActions.Close:
        event.preventDefault();
        return this.updateMenuState(false);
      case MenuActions.Type:
        // this.activeIndex = Math.max(0, getIndexByLetter(this.options, key));
        this.onComboType(key);
      case MenuActions.Open:
        event.preventDefault();
        return this.updateMenuState(true);
    }
  }

  private onComboBlur() {
    if (this.ignoreBlur) {
      this.ignoreBlur = false;
      return;
    }

    if (this.open) {
      this.selectOption(this.activeIndex);
      this.updateMenuState(false, false);
    }
  }

  private onComboType(letter: string) {
    // open the listbox if it is closed
    this.updateMenuState(true);
  
    // find the index of the first matching option
    const searchString = this.getSearchString(letter);
    const searchIndex = getIndexByLetter(this.options, searchString, this.activeIndex + 1);
  
    // if a match was found, go to it
    if (searchIndex >= 0) {
      this.onOptionChange(searchIndex);
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
    callFocus && this.inputRef.focus();
  }
}