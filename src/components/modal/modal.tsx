/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import 'wicg-inert';

@Component({
  tag: 'sui-modal',
  styleUrl: './modal.css',
  shadow: false
})
export class SuiModal {
  /**
   * Whether the modal is open or closed
   */
  @Prop() open = false;

  /**
   * Optionally give the modal a header, also used as the accessible name
   */
  @Prop() heading: string;

  /** Properties for Usability test case behaviors: **/
  @Prop() focusTarget: 'close' | 'wrapper';


  /**
   * Emit a custom close event when the modal closes
   */
  @Event({
    eventName: 'close'
  }) closeEvent: EventEmitter;

  // Flag to set focus on next render completion
  private callFocus = false;

  // save reference to element that should receive focus
  private focusRef: HTMLElement;

  @Watch('open')
  watchOpen(newValue: boolean) {
    if (newValue) {
      this.callFocus = true;
    }
  }

  componentDidUpdate() {
    if (this.callFocus === true && this.focusRef) {
      this.focusRef.focus();
      this.callFocus = false;
    }
  }

  render() {
    const { open, heading, focusTarget = 'close' } = this;

    return (
      <div class={{'dialog-wrapper': true, 'open': open}}>
        <div class="dialog-bg" onClick={this.onCloseClick.bind(this)}></div>
        <div
          aria-labelledby={heading ? 'dialog-title' : null}
          aria-modal="true"
          class="dialog-body"
          ref={(el) => focusTarget === 'wrapper' ? this.focusRef = el : null}
          role="dialog"
          onKeyDown={this.onPopupKeyDown.bind(this)}
        >
          <div class="dialog-header">
            {heading ?
              <div class="dialog-title" id="dialog-title">{heading}</div>
            :null}
            <button class="dialog-close" ref={(el) => focusTarget === 'close' ? this.focusRef = el : null} onClick={this.onCloseClick.bind(this)}>
              <span class="visuallyHidden">close</span>
            </button>
          </div>
          <slot />
        </div>
      </div>
    );
  }

  private onCloseClick() {
    this.closeEvent.emit();
  }

  private onPopupKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeEvent.emit();
      event.stopPropagation();
    }
  }
}