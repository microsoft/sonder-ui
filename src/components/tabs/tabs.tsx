/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { getActionFromKey, getUpdatedIndex, MenuActions, uniqueId } from '../../shared/utils';

@Component({
  tag: 'sui-tabs',
  styleUrl: './tabs.css',
  shadow: false
})
export class SuiTabs {
  /**
   * Array of tabs
   */
  @Prop() tabs: string[];

  /**
   * Array of ids that point to tab content. These should correspond to the array of tabs.
   */
  @Prop() contentIds: string[];

  /**
   * Optionally control which tab should be displayed on load (defaults to the first tab)
   */
  @Prop() initialTab: number;

  /**
   * Emit a custom open event when the popup opens
   */
  @Event({
    eventName: 'tabChange'
  }) changeEvent: EventEmitter;

  // which tab is currently displayed
  @State() currentIndex: number;

  // save index of tab to focus
  @State() focusIndex: number;

  // Flag to set focus on next render completion
  private callFocus = false;

  // save reference to the tab button that should receive focus
  private focusRef: HTMLElement;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  componentDidLoad() {
    const firstIndex = this.initialTab || 0;
    this.updateSelectedTab(firstIndex);
  }


  componentDidUpdate() {
    if (this.callFocus === true && this.focusRef) {
      this.focusRef.focus();
      this.callFocus = false;
    }
  }

  render() {
    const { tabs, currentIndex, focusIndex, htmlId } = this;

    return (
      <div class="tab-container">
        <div class="tabs" role="tablist">
          {tabs.map((tab, i) => {
            return(
              <button
                aria-selected={`${currentIndex === i}`}
                aria-controls={htmlId}
                class="tab-button"
                ref={(el) => {if (focusIndex === i) this.focusRef = el; }}
                role="tab"
                tabindex={currentIndex === i ? 0 : -1}
                type="button"
                onClick={() => this.onTabClick(i)}
                onKeyDown={this.onTabKeyDown.bind(this)}
              >
                {tab}
              </button>
            );
          })}
        </div>
        <div
          aria-label={tabs[currentIndex]}
          class="tab-content"
          role="tabpanel"
          id={htmlId}
        >
          <slot />
        </div>
      </div>
    );
  }

  private onTabClick(index) {
    this.updateSelectedTab(index);
  }

  private onTabKeyDown(event: KeyboardEvent) {
    const max = this.tabs.length - 1;

    const action = getActionFromKey(event, true);

    if (
      action == MenuActions.Next
      || action === MenuActions.Previous
      || action === MenuActions.First
      || action === MenuActions.Last
    ) {
      event.preventDefault();
      this.focusIndex = getUpdatedIndex(this.currentIndex, max, action);
      this.callFocus = true;
    }
  }

  private updateSelectedTab(index) {
    if (index === this.currentIndex) {
      return;
    }

    this.currentIndex = index;
    this.contentIds.forEach((id, i) => {
      const panelEl = document.getElementById(id);
      panelEl.style.display = i === index ? 'block' : 'none';
    });
    this.changeEvent.emit(index);
  }
}