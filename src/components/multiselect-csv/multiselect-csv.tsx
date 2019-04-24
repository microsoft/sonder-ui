/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { SelectOption } from '../../shared/interfaces';
import { getActionFromKey, getUpdatedIndex, isScrollable, maintainScrollVisibility, MenuActions, uniqueId, filterOptions, findMatches } from '../../shared/utils';

@Component({
  tag: 'multiselect-csv',
  styleUrl: '../../shared/combo-base.css',
  shadow: false
})
export class MultiselectCSV {
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

  // Filtered options
  @State() filteredOptions: SelectOption[] = [];

  // Menu state 
  @State() open = false;

  // Selected option index
  @State() selectedOptions: SelectOption[] = [];

  // input value
  @State() value = '';

  // Flag to set focus on next render completion
  private callFocus = false;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // Prevent menu closing before click completed
  private ignoreBlur = false;

  // save reference to input element
  private inputRef: HTMLInputElement;

  // save reference to listbox
  private listboxRef: HTMLElement;

  // save reference to active option
  private activeOptionRef: HTMLElement;

  @Watch('options')
  watchOptions(newValue: SelectOption[]) {
    this.filteredOptions = filterOptions(newValue, this.value);
  }

  componentDidLoad() {
    this.filteredOptions = filterOptions(this.options, this.value);
  }

  componentDidUpdate() {
    if (this.callFocus === true) {
      this.inputRef.focus();
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
      filteredOptions,
      selectedOptions,
      value
    } = this;

    const activeId = open ? `${htmlId}-${activeIndex}` : '';

    return ([
      <label id={htmlId} class="combo-label">{label}</label>,
      <div class={{ combo: true, open }}>
        <div role="combobox" aria-haspopup="listbox" aria-expanded={`${open}`} aria-owns={`${htmlId}-listbox`} class="input-wrapper">
          <input
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-labelledby={htmlId}
            class="combo-input"
            ref={(el) => this.inputRef = el}
            type="text"
            value={value}
            onBlur={this.onInputBlur.bind(this)}
            onClick={() => this.updateMenuState(true)}
            onInput={this.onInput.bind(this)}
            onKeyDown={this.onInputKeyDown.bind(this)}
          />
        </div>

        <div class="combo-menu" role="listbox" ref={(el) => this.listboxRef = el} aria-multiselectable="true" id={`${htmlId}-listbox`}>
          {filteredOptions.map((option, i) => {
            return (
              <div
                class={{
                  'option-current': this.activeIndex === i,
                  'option-selected': selectedOptions.indexOf(option) > -1,
                  'combo-option': true
                }}
                id={`${this.htmlId}-${i}`}
                aria-selected={selectedOptions.indexOf(option) > -1 ? 'true' : false}
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

  private onInput() {
    const inputValue = this.inputRef.value;
    const currentSearch = inputValue.split(',').pop().replace(/^\s+/, '');

    this.selectedOptions = findMatches(this.options, inputValue);
    this.filteredOptions = [...filterOptions(this.options, currentSearch, this.selectedOptions)];
    this.activeIndex = 0;
    this.value = inputValue;

    const menuState = this.filteredOptions.length > 0;
    if (this.open !== menuState) {
      this.updateMenuState(menuState, false);
    }
  }

  private onInputKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const max = this.filteredOptions.length - 1;

    const action = getActionFromKey(key, this.open);

    switch(action) {
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        return this.onOptionChange(getUpdatedIndex(this.activeIndex, max, action));
      case MenuActions.CloseSelect:
        event.preventDefault();
        return this.updateOption(this.activeIndex);
      case MenuActions.Close:
        event.preventDefault();
        return this.updateMenuState(false);
      case MenuActions.Open:
        return this.updateMenuState(true);
    }
  }

  private onInputBlur() {
    if (this.ignoreBlur) {
      this.ignoreBlur = false;
      return;
    }

    this.processInputString(this.inputRef.value);
    this.updateMenuState(false, false);
  }

  private onOptionChange(index: number) {
    this.activeIndex = index;
  }

  private onOptionClick(index: number) {
    this.onOptionChange(index);
    this.updateOption(index);
  }

  private onOptionMouseDown() {
    this.ignoreBlur = true;
    this.callFocus = true;
  }

  private processInputString(inputString: string) {
    const options = findMatches(this.options, inputString);
    this.updateSelectedOptions(options);
  }

  private updateOption(index: number) {
    const option = this.filteredOptions[index];
    const optionIndex = this.selectedOptions.indexOf(option);
    const isSelected = optionIndex > -1;

    if (isSelected) {
      this.selectedOptions.splice(optionIndex, 1);
      this.updateSelectedOptions(this.selectedOptions);
    }

    else {
      this.updateSelectedOptions([...this.selectedOptions, option]);
      this.filteredOptions = this.options;
      this.activeIndex = this.filteredOptions.indexOf(option);
      this.selectEvent.emit(option);
    }
  }

  private updateMenuState(open: boolean, callFocus = true) {
    this.open = open;
    this.callFocus = callFocus;
  }

  private updateSelectedOptions(options: SelectOption[]) {
    this.selectedOptions = options;
    this.value = this.selectedOptions.map((option) => option.name).join(', ');
    this.filteredOptions = this.options;
  }
}