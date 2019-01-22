import { Component, Event, EventEmitter, Prop } from '@stencil/core';
import { SelectOption } from '../../utils/interfaces';
// import { format } from '../../utils/utils';

let idIndex = 0;

@Component({
  tag: 'combo-readonly',
  styleUrl: 'combo-readonly.css',
  shadow: false
})
export class ComboReadonly {
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
  private htmlId = `combo-readonly-${++idIndex}`;

  render() {
    const {
      htmlId,
      label = '',
      options = []
    } = this;

    return ([
      <label id={htmlId}>{label}</label>,
      <div role="combobox">
        {options.map((option) => {
          return <div role="option">{option.name}</div>;
        })}
      </div>
    ]);
  }
}