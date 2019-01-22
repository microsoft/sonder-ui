import { Component, Event, EventEmitter, Prop } from '@stencil/core';
import { SelectOption } from '../../utils/interfaces';
// import { format } from '../../utils/utils';

let idIndex = 0;

@Component({
  tag: 'combo-native',
  styleUrl: 'combo-native.css',
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
   * Emit a custom select event on value change
   */
  @Event({
    eventName: 'select'
  }) selectEvent: EventEmitter;

  /**
   * Unique ID that should really use a UUID library instead
   */
  private htmlId = `combo-native-${++idIndex}`;

  private selectHandler(value: string) {
    const selectedOption = this.options.filter((option) => option.value === value);
    selectedOption.length > 0 && this.selectEvent.emit(selectedOption[0]);
  }

  render() {
    const {
      htmlId,
      label = '',
      options = []
    } = this;

    return ([
      <label htmlFor={htmlId}>{label}</label>,
      <select id={htmlId} onChange={(event: Event) => this.selectHandler((event.target as HTMLSelectElement).value)}>
        {options.map((option) => <option value={option.value}>{option.name}</option>)}
      </select>
    ]);
  }
}