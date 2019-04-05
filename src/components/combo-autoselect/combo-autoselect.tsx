import { Component, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { SelectOption } from '../../shared/interfaces';
import { getActionFromKey, getUpdatedIndex, isScrollable, maintainScrollVisibility, MenuActions, uniqueId, filterOptions } from '../../shared/utils';

@Component({
  tag: 'combo-autoselect',
  styleUrl: '../../shared/combo-base.css',
  shadow: false
})
export class ComboAutoselect {
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

  // input value
  @State() value: string;

  // save reference to active option
  private activeOptionRef: HTMLElement;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // Prevent menu closing before click completed
  private ignoreBlur = false;

  // save reference to input element
  private inputRef: HTMLInputElement;

  // save reference to listbox
  private listboxRef: HTMLElement;

  // save the last selected value
  private selectedValue = '';

  @Watch('options')
  watchOptions(newValue: SelectOption[]) {
    this.filteredOptions = filterOptions(newValue, this.value);
  }

  componentDidLoad() {
    const {
      options = [],
      value = ''
    } = this;
    this.filteredOptions = filterOptions(options, value);
    this.value = typeof this.value === 'string' ? value : this.filteredOptions.length > 0 ? this.filteredOptions[0].name : '';
  }

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
      filteredOptions = [],
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

        <div class="combo-menu" role="listbox" ref={(el) => this.listboxRef = el} id={`${htmlId}-listbox`}>
          {filteredOptions.map((option, i) => {
            return (
              <div
                class={{ 'option-current': this.activeIndex === i, 'combo-option': true }}
                id={`${this.htmlId}-${i}`}
                aria-selected={this.activeIndex === i ? 'true' : false}
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
    const curValue = this.inputRef.value;
    this.filteredOptions = [...filterOptions(this.options, curValue)];

    if (this.value !== curValue) {
      this.value = curValue;
      this.activeIndex = 0;
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
        this.selectOption(this.activeIndex);
        return this.updateMenuState(false);
      case MenuActions.Close:
        this.activeIndex = 0;
        this.value = this.selectedValue;
        this.filteredOptions = this.options;
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

    if (this.open) {
      this.selectOption(this.activeIndex);
      this.updateMenuState(false, false);
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
    const selected = this.filteredOptions[index];
    this.value = selected.name;
    this.selectedValue = selected.name;
    this.filteredOptions = filterOptions(this.options, this.value);
    this.activeIndex = 0;
    this.selectEvent.emit(selected);
  }

  private updateMenuState(open: boolean, callFocus = true) {
    this.open = open;
    callFocus && this.inputRef.focus();
  }
}