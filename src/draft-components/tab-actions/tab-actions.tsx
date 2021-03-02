/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { getActionFromKey, getUpdatedIndex, MenuActions, uniqueId } from '../../shared/utils';

@Component({
  tag: 'tab-actions',
  styleUrl: './tab-actions.css',
  shadow: false
})
export class TabWithActions {
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
   * Prop for support testing only: whether the tabs should be closeable + location of close button
   */
  @Prop() closeButton: 'inside' | 'outside' | undefined;

  /**
   * Emit a custom open event when the popup opens
   */
  @Event({
    eventName: 'tabChange'
  }) changeEvent: EventEmitter;

  // which tab is currently displayed
  @State() currentIndex: number;

  // save index of tab to focus
  @State() focusIndex = 0;

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
    const { tabs, currentIndex, focusIndex, htmlId, closeButton } = this;

    return (
      <div class="tab-container">
        <div class="tabs" role="tablist">
          {tabs.map((tab, i) => {
            return(
              <div class="tab-wrapper" role="presentation">
                <div
                  aria-selected={`${currentIndex === i}`}
                  aria-controls={htmlId}
                  aria-label={tab}
                  class={{"tab-button": true, 'closeable': !!closeButton }}
                  ref={(el) => {if (focusIndex === i) this.focusRef = el; }}
                  role="tab"
                  tabindex={focusIndex === i ? 0 : -1}
                  onClick={() => this.onTabClick(i)}
                  onKeyDown={this.onTabKeyDown.bind(this)}
                >
                  {tab}
                  {closeButton === 'inside' ? 
                  <button
                    class="close-tab"
                    aria-label={`close ${tab}`}
                    tabIndex={focusIndex === i ? 0 : -1}
                    onClick={(event) => this.onCloseClick(event, i)}
                  >x</button>
                  : null}
                </div>
                {closeButton === 'outside' ? 
                <button
                  class="close-tab"
                  aria-label={`close ${tab}`}
                  tabIndex={focusIndex === i ? 0 : -1}
                  onClick={(event) => this.onCloseClick(event, i)}
                  onKeyDown={this.onButtonKeyDown.bind(this)}
                >x</button>
                : null}
              </div>
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

  private onButtonKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.stopPropagation();
    }
    else {
      this.onTabKeyDown(event);
    }
  }

  private onCloseClick(event, index) {
    event.stopPropagation();
    alert(`close button clicked for ${this.tabs[index]}`);
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
      this.focusIndex = getUpdatedIndex(this.focusIndex, max, action);
      this.callFocus = true;
    }
    else if (
      action === MenuActions.CloseSelect
      || action === MenuActions.Space
    ) {
      this.onTabClick(this.focusIndex);
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