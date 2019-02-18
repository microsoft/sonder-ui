import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { SelectOption } from '../../shared/interfaces';
import { getActionFromKey, getUpdatedIndex, MenuActions, uniqueId } from '../../shared/utils';

@Component({
  tag: 'combo-noinput',
  styleUrl: '../../shared/combo-base.css',
  shadow: false
})
export class ComboNoInput {
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

  // save reference to input element
  private inputRef: HTMLElement;

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
      <div
        role="combobox"
        aria-activedescendant={activeId}
        aria-autocomplete="none"
        aria-haspopup="listbox"
        aria-expanded={`${open}`}
        aria-labelledby={`${htmlId} ${htmlId}-value`}
        class={{ combo: true, open }}
        ref={(el) => this.inputRef = el}
        tabindex="0"
        onBlur={this.onComboBlur.bind(this)}
        onClick={() => this.updateMenuState(true)}
        onKeyDown={this.onInputKeyDown.bind(this)}
      >
        <div id={`${htmlId}-value`} class="combo-input">{value}</div>

        <div class="combo-menu" role="listbox">
          {options.map((option, i) => {
            return (
              <div
                class={{ 'option-selected': this.activeIndex === i, 'combo-option': true }}
                id={`${this.htmlId}-${i}`}
                aria-selected={this.selectedIndex === i ? 'true' : false}
                role="option"
                onClick={(event) => {
                  event.stopPropagation();
                  this.onOptionClick(i);
                }}
              >{option.name}</div>
            );
          })}
        </div>
      </div>
    ]);
  }

  private onInputKeyDown(event: KeyboardEvent) {
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
        return this.updateMenuState(false);
      case MenuActions.Type:
      case MenuActions.Open:
        return this.updateMenuState(true);
    }
  }

  private onComboBlur() {
    this.updateMenuState(false, false);
  }

  private onOptionChange(index: number) {
    this.activeIndex = index;
  }

  private onOptionClick(index: number) {
    this.onOptionChange(index);
    this.selectOption(index);
    this.updateMenuState(false);
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