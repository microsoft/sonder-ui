import { Component, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { SelectOption } from '../../shared/interfaces';
import { getActionFromKey, getUpdatedIndex, MenuActions, uniqueId, filterOptions, findMatches } from '../../shared/utils';

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
  @State() filteredOptions: SelectOption[];

  // Menu state 
  @State() open = false;

  // Selected option index
  @State() selectedOptions: SelectOption[];

  // input value
  @State() value = '';

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // Prevent menu closing before click completed
  private ignoreBlur = false;

  // save reference to input element
  private inputRef: HTMLInputElement;

  // save current string of selected options
  private optionString: string;

  @Watch('options')
  watchOptions(newValue: SelectOption[]) {
    this.filteredOptions = filterOptions(newValue, this.value);
  }

  render() {
    const {
      activeIndex,
      htmlId,
      label = '',
      open = false,
      filteredOptions = [],
      value
    } = this;

    const activeId = open ? `${htmlId}-${activeIndex}` : '';

    return ([
      <label id={htmlId} class="combo-label">{label}</label>,
      <div role="combobox" aria-haspopup="listbox" aria-expanded={`${open}`} class={{ combo: true, open }}>
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

        <div class="combo-menu" role="listbox" aria-multiselectable="true">
          {filteredOptions.map((option, i) => {
            return (
              <div
                class={{ 'option-selected': this.activeIndex === i, 'combo-option': true }}
                id={`${this.htmlId}-${i}`}
                aria-selected={this.selectedOptions.indexOf(option) > -1 ? 'true' : false}
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

  private updateSelectedOptions(options: SelectOption[], searchString?: string) {
    this.selectedOptions = options;
    const optionNames = this.selectedOptions.map((option) => option.name);
    this.optionString = optionNames.join(', ');
    this.value = searchString ? [...optionNames, searchString].join(', ') : this.optionString;
  }

  private onInput() {
    const inputValue = this.inputRef.value;
    const optionValues = inputValue.split(',');
    const currentSearch = optionValues.pop().replace(/^\s+/, '');
    const optionString = optionValues.map((name) => name.trim()).join(', ');

    this.filteredOptions = [...filterOptions(this.options, currentSearch.trim(), this.selectedOptions)];
    this.activeIndex = 0;

    if (optionString !== this.optionString) {
      this.updateSelectedOptions(findMatches(this.options, optionString), currentSearch);
    }
    else {
      this.value = inputValue;
    }

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
        return this.updateOption(this.activeIndex);
      case MenuActions.Close:
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

    this.updateMenuState(false, false);
  }

  private onOptionChange(index: number) {
    this.activeIndex = index;
  }

  private onOptionClick(index: number) {
    this.onOptionChange(index);
    this.updateOption(index);
    this.updateMenuState(false);
  }

  private onOptionMouseDown() {
    this.ignoreBlur = true;
  }

  private updateOption(index: number) {
    const option = this.filteredOptions[index];
    const optionIndex = this.selectedOptions.indexOf(option);
    const isSelected = optionIndex > -1;

    if (isSelected) {
      this.updateSelectedOptions(this.selectedOptions.splice(optionIndex, 1));
    }

    else {
      this.updateSelectedOptions([...this.selectedOptions, option]);
      this.filteredOptions = this.options;
      this.activeIndex = 0;
      this.selectEvent.emit(option);
    }
  }

  private updateMenuState(open: boolean, callFocus = true) {
    this.open = open;
    callFocus && this.inputRef.focus();
  }
}