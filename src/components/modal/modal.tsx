/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, Watch } from '@stencil/core';
import { uniqueId } from '../../shared/utils';

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

  /**
   * Optional id to use as descriptive text for the dialog
   */
  @Prop() describedBy: string;

  /**
   * Properties for Usability test case behaviors:
   */
  @Prop() focusTarget: 'close' | 'wrapper' | 'custom';
  @Prop() customFocusId: string;


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

  // save a unique id
  private dialogId = uniqueId();

  @Watch('open')
  watchOpen(newValue: boolean) {
    if (newValue) {
      this.callFocus = true;
    }
  }

  componentDidUpdate() {
    if (this.callFocus === true) {
      let focusTarget = this.focusRef;
      if (this.focusTarget === 'custom' && this.customFocusId) {
        focusTarget = document.getElementById(this.customFocusId);
      }

      focusTarget && focusTarget.focus();
      this.callFocus = false;
    }
  }

  render() {
    const { open, heading, describedBy, dialogId, focusTarget = 'close' } = this;

    return (
      <div class={{'dialog-wrapper': true, 'open': open}}>
        <div class="dialog-bg" onClick={this.onCloseClick.bind(this)}></div>
        <div
          aria-labelledby={heading ? dialogId : null}
          aria-describedby={describedBy}
          aria-modal="true"
          class="dialog-body"
          ref={(el) => focusTarget === 'wrapper' ? this.focusRef = el : null}
          role="dialog"
          tabIndex={focusTarget === 'wrapper' ? -1 : null}
          onKeyDown={this.onPopupKeyDown.bind(this)}
        >
          <div class="dialog-header">
            {heading ?
              <div class="dialog-title" id={dialogId}>{heading}</div>
            :null}
            <button class="dialog-close" ref={(el) => focusTarget === 'close' ? this.focusRef = el : null} onClick={this.onCloseClick.bind(this)}>
              <span class="visuallyHidden">close</span>
            </button>
          </div>
          <div class="dialog-content">
            <slot />
          </div>
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