/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { SelectOption } from '../../shared/interfaces';
import { getActionFromKey, getIndexByLetter, getUpdatedIndex, MenuActions, uniqueId } from '../../shared/utils';

const TEST_OPTIONS = [
  { name: 'pineapple', value: 'pineapple' },
  { name: 'mango', value: 'mango' }
];

@Component({
  tag: 'listbox-actions',
  styleUrl: './listbox-actions.css',
  shadow: false
})
export class ListboxActions {
  /**
   * Array of name/value options
   */
  @Prop() options: SelectOption[];

  /**
   * String label
   */
  @Prop() label: string;

  /**
   * Testing prop: whether or not the "recent searches" items should have secondary actions
   */
  @Prop() removeButton: 'inside' | 'outside' | undefined;

  /**
   * Emit a custom select event on value change
   */
  @Event({
    eventName: 'select'
  }) selectEvent: EventEmitter;

  // Active option index
  @State() activeIndex = 0;

  // Current accumulated search string
  @State() searchString: string;

  // Timeout after each typed character
  @State() searchTimeout: number | null;

  // Selected option index
  @State() selectedIndex: number;

  // Flag to set focus on next render completion
  private callFocus = false;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // save reference to the listbox element for focus reset from close buttons
  private listboxRef: HTMLElement;

  componentDidUpdate() {
    if (this.callFocus === true && this.listboxRef) {
      this.listboxRef.focus();
      this.callFocus = false;
    }
  }

  render() {
    const {
      activeIndex,
      htmlId,
      label = '',
      options = [],
      removeButton
    } = this;

    const activeId = `${htmlId}-${activeIndex}`;

    return ([
      <label id={htmlId} class="combo-label">{label}</label>,
      <div
        class="listbox"
        role="listbox"
        aria-activedescendant={activeId}
        aria-labelledby={`${htmlId} ${htmlId}-value`}
        id={`${htmlId}-listbox`}
        ref={(el) => this.listboxRef = el}
        onKeyDown={this.onComboKeyDown.bind(this)}
        tabindex="0"
      >
        <div class="option-group" role="group" aria-labelledby={`${htmlId}-group1`}>
          <div class="group-name" role="presentation" id={`${htmlId}-group1`}>Recent Searches</div>
          {TEST_OPTIONS.map((option, i) => this.renderOption(option, i, removeButton))}
        </div>
        <div class="option-group" role="group" aria-labelledby={`${htmlId}-group2`}>
          <div class="group-name" role="presentation" id={`${htmlId}-group2`}>Results</div>
          {options.map((option, index) => {
            const adjustedIndex = index + TEST_OPTIONS.length;
            return this.renderOption(option, adjustedIndex);
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

  private onButtonKeyDown(event) {
    const action = getActionFromKey(event, true);
    if (
      action === MenuActions.Next ||
      action === MenuActions.Last ||
      action === MenuActions.First ||
      action === MenuActions.Previous
    ) {
      this.callFocus = true;
    }
    if (
      action === MenuActions.CloseSelect ||
      action === MenuActions.Space
    ) {
      event.stopPropagation();
    }
  }

  private onComboKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const max = this.options.length + TEST_OPTIONS.length - 1;

    const action = getActionFromKey(event, true);

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
        break;
      case MenuActions.Type:
        this.onComboType(key);
    }
  }

  private onComboType(letter: string) {
    // find the index of the first matching option
    const searchString = this.getSearchString(letter);
    const searchIndex = getIndexByLetter([...TEST_OPTIONS, ...this.options], searchString, this.activeIndex + 1);
  
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
  }

  private onRemoveClick(event: MouseEvent, index: number) {
    event.stopPropagation();
    alert(`Clicked remove on ${TEST_OPTIONS[index].name}`);
  }

  private renderOption(option, index, removeButton?) {
    return (
      <div class="option-wrapper" role="presentation">
        <div
          class={{
            'option-current': this.activeIndex === index,
            'option-selected': this.selectedIndex === index,
            'combo-option': true
          }}
          id={`${this.htmlId}-${index}`}
          aria-label={option.name}
          aria-selected={this.selectedIndex === index ? 'true' : 'false'}
          role="option"
          onClick={(event) => {
            event.stopPropagation();
            this.onOptionClick(index);
          }}
        >
          <span class="option-name">{option.name}</span>
          {removeButton === 'inside' ? 
            <button
              class="remove-option"
              aria-label={`remove ${option.name}`}
              tabIndex={this.activeIndex === index ? 0 : -1}
              onClick={(event) => this.onRemoveClick(event, index)}
              onKeyDown={this.onButtonKeyDown.bind(this)}
            >x</button>
          : null}
        </div>
        {removeButton === 'outside' ? 
          <button
            class="remove-option"
            aria-label={`remove ${option.name}`}
            tabIndex={this.activeIndex === index ? 0 : -1}
            onClick={(event) => this.onRemoveClick(event, index)}
            onKeyDown={this.onButtonKeyDown.bind(this)}
          >x</button>
        : null}
      </div>
    )
  }

  private selectOption(index: number) {
    const selected = this.options[index];
    this.selectedIndex = index;
    this.selectEvent.emit(selected);
  }
}