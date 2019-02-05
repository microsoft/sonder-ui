import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { SelectOption } from '../../shared/interfaces';
import { getActionFromKey, getUpdatedIndex, MenuActions, uniqueId } from '../../shared/utils';

@Component({
  tag: 'combo-focus',
  styleUrl: '../../shared/combo-base.css',
  shadow: false
})
export class ComboFocus {
  /**
   * Array of name/value options
   */
  @Prop() options: SelectOption[];

  /**
   * String label
   */
  @Prop() label: string;

  /*
   * Boolean to move aria-activedescendant to listbox; For testing purposes only.
  */
  @Prop() useListboxPattern: boolean = false;

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

  // input value
  @State() value = '';

  // flag to call focus after next render
  private callFocus = false;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // save reference to input element
  private inputRef: HTMLInputElement;

  // save reference to menu element
  private menuRef: HTMLElement;

  componentDidUpdate() {
    if (this.callFocus) {
      this.callFocus = false;
      const focusEl = this.open ? this.menuRef : this.inputRef;
      focusEl.focus();
    }
  }

  render() {
    const {
      activeIndex,
      htmlId,
      label = '',
      open = false,
      options = [],
      useListboxPattern,
      value
    } = this;

    const activeId = open ? `${htmlId}-${activeIndex}` : '';

    return ([
      <label id={htmlId} class="combo-label">{label}</label>,
      <div role="combobox" aria-haspopup="listbox" aria-expanded={`${open}`} class={{ combo: true, open }}>
        <input
          aria-activedescendant={useListboxPattern ? false : activeId}
          aria-labelledby={htmlId}
          class="combo-input"
          readonly
          ref={(el) => this.inputRef = el}
          type="text"
          value={value}
          onClick={() => this.updateMenuState(true)}
          onKeyDown={this.onInputKeyDown.bind(this)}
        />

        <div
          aria-activedescendant={useListboxPattern ? activeId : false}
          class="combo-menu"
          ref={(el) => this.menuRef = el}
          role="listbox"
          tabindex="-1"
          onBlur={this.onMenuBlur.bind(this)}
          onKeyDown={this.onMenuKeyDown.bind(this)}
        >
          {options.map((option, i) => {
            return (
              <div
                class="combo-option"
                id={`${this.htmlId}-${i}`} aria-selected={this.activeIndex === i ? 'true' : false}
                role="option"
                onClick={() => { this.onOptionClick(i); }}
              >{option.name}</div>
            );
          })}
        </div>
      </div>
    ]);
  }

  private onMenuBlur() {
    this.updateMenuState(false, false);
  }

  private onInputKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const action = getActionFromKey(key, this.open);

    switch(action) {
      case MenuActions.Close:
        return this.updateMenuState(false);
      case MenuActions.Type:
      case MenuActions.Open:
        return this.updateMenuState(true);
    }
  }

  private onMenuKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const max = this.options.length - 1;

    const action = getActionFromKey(key, true);

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

  private selectOption(index: number) {
    const selected = this.options[index];
    this.value = selected.name;
    this.selectEvent.emit(selected);
  }

  private updateMenuState(open: boolean, callFocus = true) {
    this.open = open;
    this.callFocus = callFocus;
  }
}