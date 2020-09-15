/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Prop, State } from '@stencil/core';
import { getActionFromKey, getUpdatedIndex, MenuActions } from '../shared/utils';

@Component({
  tag: 'sui-toolbar',
  styleUrl: './toolbar.css',
  shadow: false
})
export class SuiToolbar {
  /**
   * Set the accessible name for the button that opens the menu (recommended)
   */
  @Prop() toolbarLabel: string;

  /**
   * Array of CSS selectors for toolbar actions
   */
  @Prop() menuItems: string[] = [];

  // current active index, controls focusable item
  @State() currentIndex = 0;

  // Flag to set focus to a specific element on next render completion
  @State() callFocus = false;


  componentDidUpdate() {
    if (this.callFocus = true) {
      const focusSelector = this.menuItems[this.currentIndex];
      const focusTarget: HTMLElement = focusSelector && document.querySelector(focusSelector);
      if (focusTarget) {
        this.resetTabIndex();
        focusTarget.tabIndex = 0;
        focusTarget.focus();
      }
    }
  }

  render() {
    return (
      <div
        class="toolbar"
        role="toolbar"
        aria-label={this.toolbarLabel || null}
        onKeyDown={this.onToolbarKeyDown.bind(this)}
      >
        <slot />
      </div>
    );
  }

  private resetTabIndex() {
    this.menuItems.forEach((item) => {
      const el = document.querySelector(item) as HTMLElement;
      if (el) {
        el.tabIndex = -1;
      }
    });
  }

  private onToolbarKeyDown(event: KeyboardEvent) {
    const max = this.menuItems.length - 1;
    const action = getActionFromKey(event.key, true);

    switch(action) {
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        this.currentIndex = getUpdatedIndex(this.currentIndex, max, action);
        this.callFocus = true;
    }
  }
}