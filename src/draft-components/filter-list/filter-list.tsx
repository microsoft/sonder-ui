/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { uniqueId } from '../shared/utils';

@Component({
  tag: 'filter-list',
  styleUrl: './filter-list.css',
  shadow: false
})
export class SuiFilterList {
  /**
   * Label for the filter input
   */
  @Prop() label: string;

  /**
   * Data for the filterable items
   */
  @Prop() items: string[] = [];

  /**
   * Optional heading for list of items
   */
  @Prop() listTitle: string;

  /**
   * Custom render function for 
   */
  @Prop() renderItem: (item: string) => JSX.Element;

  /**
   * Control frequency of live region announcements
   */
  @Prop() verbosity: 'high' | 'medium' | 'low' = 'medium';

  /**
   * String that will be announced to screen readers whenever it changes
   */
  @State() liveAnnouncement: string;

  /**
   * Array of filtered items
   */
  @State() filteredItems: string[] = [];

  /**
   * Emit a custom event when the list updates
   */
  @Event({
    eventName: 'update'
  }) updateEvent: EventEmitter;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // save reference to input element
  private inputRef: HTMLInputElement;

  // Timeout after each input
  private liveTimeout: number | null;

  @Watch('items')
  watchOptions(newValue: string[]) {
    const filterString = this.inputRef.value;
    this.filteredItems = this.filterItems(newValue, filterString);;
  }

  componentDidLoad() {
    this.filteredItems = this.items;
  }

  render() {
    const {
      label,
      htmlId,
      filteredItems,
      listTitle,
      renderItem,
      liveAnnouncement
    } = this;

    return (
      <div class="filter-container">
        <div class="filter-control">
          <label htmlFor={htmlId}>{label}</label>
          <input
            id={htmlId}
            type="text"
            class="filter-input"
            ref={(el) => this.inputRef = el}
            onInput={this.onInput.bind(this)}
          />
          <div class="sr-announcer" aria-live="assertive" aria-atomic="true">{liveAnnouncement}</div>
        </div>
        {listTitle ?
          <h2>{listTitle}</h2>
        : null}
        <ul class="filter-list">
          {filteredItems.map((item) => {
            return (
              <li class="filter-item">
                {renderItem ? renderItem(item) : `${item}`}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  private onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const updatedItems = this.filterItems(this.items, value);



    // do not update if the number of filtered items has not changed
    if(updatedItems.length === this.filteredItems.length) {
      return;
    }

    this.filteredItems = updatedItems;
    this.updateTimeout();
  }

  private filterItems(items: string[] = [], filter: string): string[] {
    return items.filter((item) => {
      const matches = item.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      return matches;
    });
  }

  private updateTimeout() {
    // do not update the live region if the verbosity is set to low
    if (this.verbosity === 'low') {
      return;
    }

    // if timeout for updating the live region exists, clear it
    if (typeof this.liveTimeout === 'number') {
      window.clearTimeout(this.liveTimeout);
    }

    const timeoutLength = this.verbosity === 'high' ? 500 : 1000;

    // set timeout for updating live region, and save it so it can be cleared by typing
    this.liveTimeout = window.setTimeout(() => {
      this.liveAnnouncement = `${this.filteredItems.length} items found`;
    }, timeoutLength);
  }
}