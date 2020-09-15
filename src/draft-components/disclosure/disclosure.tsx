/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'modal-disclosure',
  styleUrl: './disclosure.css',
  shadow: false
})
export class SuiModalDisclosure {
  /**
   * Optional override to the button's accessible name (using aria-label)
   */
  @Prop() buttonLabel: string;

  /**
   * Optionally set the popup region's accessible name using aria-label (recommended)
   */
  @Prop() popupLabel: string;

  /**
   * Set the position of the disclosure, defaults to left
   */
  @Prop() position: 'left' | 'right';

  /**
   * Emit a custom open event when the popup opens
   */
  @Event({
    eventName: 'open'
  }) openEvent: EventEmitter;

  /**
   * Emit a custom close event when the popup closes
   */
  @Event({
    eventName: 'close'
  }) closeEvent: EventEmitter;

  // whether the popup is open or closed
  @State() open = false;

  // Flag to set focus on next render completion
  private callFocus = false;

  // save reference to element that should receive focus
  private focusRef: HTMLElement;

  // save reference to wrapper
  private parentRef: HTMLElement;


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
      this.open = false;
    }
  }

  render() {
    const { buttonLabel, open, popupLabel, position = 'left' } = this;

    return (
      <div class={{'disclosure': true, 'open': open}} ref={(el) => this.parentRef = el}>
        <button
          aria-expanded={`${open}`}
          aria-label={buttonLabel !== undefined ? buttonLabel : null}
          class="trigger"
          ref={(el) => open ? null : this.focusRef = el}
          type="button"
          onClick={this.onButtonClick.bind(this)}
        >
          <slot name="button" />
        </button>
        <div
          aria-label={popupLabel || null}
          class={{'popup': true, 'right': position === 'right' }}
          role="dialog"
          aria-modal="true"
          onKeyDown={this.onPopupKeyDown.bind(this)}
        >
          <button class="close" ref={(el) => open ? this.focusRef = el : null} type="button" onClick={this.onCloseClick.bind(this)}>
            <span class="visuallyHidden">close</span>
          </button>
          <slot name="popup" />
        </div>
      </div>
    );
  }

  private onButtonClick() {
    const wasOpen = this.open;
    this.open = !wasOpen;

    // send focus into the popup on open
    if (!wasOpen) {
      this.callFocus = true;
    }
  }

  private onCloseClick() {
    this.open = false;
    this.callFocus = true;
  }

  private onPopupKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.open = false;
      this.callFocus = true;
      event.stopPropagation();
    }
  }
}