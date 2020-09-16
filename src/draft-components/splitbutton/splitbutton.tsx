/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { getActionFromKey, getUpdatedIndex, Keys, MenuActions } from '../shared/utils';

@Component({
  tag: 'split-button',
  styleUrl: './splitbutton.css',
  shadow: false
})
export class SuiSplitbutton {
  /**
   * (Optional) pass a string to be the primary button id
   */
  @Prop() buttonId: string;

  /**
   * Set the accessible name for the button that opens the menu (recommended)
   */
  @Prop() menuButtonLabel = 'More options';

  /**
   * Set the keyboard behavior of the splitbutton to be one tab/arrow stop or two (defaults to 2)
   */
  @Prop() isCompoundButton = false;

  /**
   * Set to true if the button is within a compound widget like a toolbar or menu (changes arrow key behavior)
   */
  @Prop() inCompoundGroup = false;

  /**
   * Array of menu actions
   */
  @Prop() menuItems: any[] = [];

  /**
   * (Optional) set pressed to make the primary button into a toggle button
   */
  @Prop() pressed: boolean;

  /**
   * Optionally override the component's tabindex
   */
  @Prop() customTabIndex: 0 | 1 = 0;

  /**
   * Optional custom render function for menu items (defaults to the menuItem string)
   */
  @Prop() renderMenuItem: (menItem: any) => string;

  /**
   * Emit a custom event when a menu item is clicked
   */
  @Event({
    eventName: 'primaryAction'
  }) primaryActionEvent: EventEmitter;

  /**
   * Emit a custom event when a menu item is clicked
   */
  @Event({
    eventName: 'menuAction'
  }) menuActionEvent: EventEmitter;

  // whether the menu is open or closed
  @State() open = false;

  // menu index
  @State() activeMenuItem = 0;

  @State() focusKey: 'menu' | 'menuButton' | 'primary' = 'primary';

  // Flag to set focus to a specific element on next render completion
  private callFocus: boolean;

  // save reference to element that should receive focus
  private focusRef: HTMLElement;

  // save reference to popup menu for blur event
  private parentRef: HTMLElement;

  // id base
  // private htmlId = uniqueId();


  componentDidUpdate() {
    if (this.callFocus === true && this.focusRef) {
      this.focusRef.focus();
      this.callFocus = false;
    }
  }

  @Listen('focusout')
  onBlur(event: FocusEvent) {
    const focusWithin = this.parentRef.contains(event.relatedTarget as HTMLElement);
    if (!focusWithin) {
      this.focusKey = 'primary';
      this.open = false;
    }
  }

  public focus() {
    this.focusKey = 'primary';
    this.callFocus = true;
  }

  render() {
    const {
      buttonId,
      focusKey,
      isCompoundButton,
      inCompoundGroup,
      menuButtonLabel,
      menuItems,
      open,
      pressed,
      customTabIndex
    } = this;

    return (
      <div class={{'splitbutton': true, 'open': open, 'compound': isCompoundButton, 'in-group': inCompoundGroup}} ref={(el) => this.parentRef = el}>
        <button
          class="primary"
          type="button"
          id={buttonId || null}
          aria-pressed={typeof pressed === 'boolean' ? `${pressed}` : null}
          aria-haspopup={isCompoundButton ? 'menu' : null}
          ref={(el) => focusKey === 'primary' ? this.focusRef = el : null}
          tabIndex={(isCompoundButton && focusKey !== 'primary') ? -1 : customTabIndex}
          onKeyDown={(event) => this.onButtonKeyDown(event, 0)}
          onClick={(event) => this.primaryActionEvent.emit(event)}
        >
          <slot />
        </button>
        <button
          aria-expanded={`${open}`}
          aria-haspopup="menu"
          aria-label={menuButtonLabel}
          class="menuTrigger"
          ref={(el) => focusKey === 'menuButton' ? this.focusRef = el : null}
          tabIndex={(isCompoundButton && focusKey === 'primary') ? -1 : customTabIndex}
          type="button"
          onClick={this.onMenuButtonClick.bind(this)}
          onKeyDown={(event) => this.onButtonKeyDown(event, 1)}
  
        > </button>
        <div
          class="menu"
          role="menu"
          onKeyDown={this.onMenuKeyDown.bind(this)}
        >
          {menuItems.map((menuItem, i) => {
            return this.renderItem(menuItem, i);
          })}
        </div>
      </div>
    );
  }

  private closeMenu() {
    this.open = false;
    this.callFocus = true;
    this.focusKey = 'menuButton';
  }

  private onButtonKeyDown(event: KeyboardEvent, index: number) {
    const { isCompoundButton, inCompoundGroup } = this;

    // handle alt + down
    if (event.altKey && event.key === Keys.Down) {
      this.open = true;
      this.callFocus = true;
      this.focusKey = 'menu';
      event.stopPropagation();
      return;
    }

    // handle arrow keys if compoundButton is true and not in group
    // or if it is in a group and is not a compoundButton
    if ((isCompoundButton && !inCompoundGroup) || (!isCompoundButton && inCompoundGroup)) {
      const action = getActionFromKey(event.key, true);

      if (action === MenuActions.Next && index === 0) {
        this.focusKey = 'menuButton';
        this.callFocus = true;
        event.preventDefault();
        event.stopPropagation();
      }
      else if (action === MenuActions.Previous && index === 1) {
        this.focusKey = 'primary';
        this.callFocus = true;
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  private onItemChange(index: number) {
    this.activeMenuItem = index;
    this.focusKey = 'menu';
    this.callFocus = true;
  }

  private onItemClick(item: any) {
    this.closeMenu();
    this.menuActionEvent.emit(item);
  }

  private onMenuButtonClick() {
    const wasOpen = this.open;
    this.open = !wasOpen;

    // send focus into the popup on open
    if (!wasOpen) {
      this.focusKey = 'menu';
      this.callFocus = true;
    }
  }

  private onMenuKeyDown(event: KeyboardEvent) {
    const max = this.menuItems.length - 1;
    const action = getActionFromKey(event.key, this.open);

    // handle alt + up
    if (event.altKey && event.key === Keys.Up) {
      this.closeMenu();
      event.stopPropagation();
      return;
    }

    switch(action) {
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        event.stopPropagation();
        return this.onItemChange(getUpdatedIndex(this.activeMenuItem, max, action));
      case MenuActions.Close:
        this.closeMenu();
        event.stopPropagation();
    }
  }

  private renderItem(menuItem: any, index: number) {
    const { activeMenuItem, focusKey, renderMenuItem } = this;
    const isFocusRef = focusKey === 'menu' && activeMenuItem === index;
    return (
      <button
        role="menuitem"
        class="menuitem"
        tabIndex={-1}
        ref={(el) => isFocusRef ? this.focusRef = el : null}
        onClick={() => this.onItemClick(menuItem)}
      >
        {renderMenuItem ? renderMenuItem(menuItem) : `${menuItem}`}
      </button>
    );
  }
}