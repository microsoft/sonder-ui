/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State } from '@stencil/core';
import { uniqueId } from '../shared/utils';

@Component({
  tag: 'textarea-charcount',
  styleUrl: './textarea-charcount.css',
  shadow: false
})
export class SuiTextareaCharcount {
  /**
   * Label for the textarea
   */
  @Prop() label: string;

  /**
   * Max number of characters
   */
  @Prop() maxLength: number;

  /**
   * Verbosity setting for screen reader behavior, defaults to medium
   */
  @Prop() verbosity: 'high' | 'medium' | 'low' = 'medium';

  /**
   * String that will be announced to screen readers whenever it changes
   */
  @State() liveAnnouncement: string;

  /**
   * Save the current number of characters
   */
  @State() curLength = 0;

  /**
   * Emit a custom event when textarea's value exceeds the max length
   */
  @Event({
    eventName: 'error'
  }) errorEvent: EventEmitter;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // Timeout after each input
  private liveTimeout: number | null;

  render() {
    const {
      label,
      htmlId,
      maxLength,
      curLength,
      liveAnnouncement
    } = this;

    const isInvalid = curLength > maxLength;

    return (
      <div class="textarea-container">
        <label htmlFor={htmlId}>{label}</label>
        <textarea id={htmlId} class="textarea" aria-invalid={isInvalid} aria-describedby={`${htmlId}-desc`} rows={3} onInput={this.onInput.bind(this)}>
          <slot />
        </textarea>
        <span class="char-count">{curLength} {maxLength ? `/ ${maxLength}` : null}</span>
        <span id={`${htmlId}-desc`} class="visuallyHidden">Maximum {maxLength} characters</span>
        <div class="sr-announcer" aria-live="assertive" aria-atomic="true">{liveAnnouncement}</div>
      </div>
    );
  }

  private onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    // do not update if the character count has not changed
    if(value.length === this.curLength) {
      return;
    }

    this.curLength = value.length;
    this.updateTimeout();
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

    const timeoutLength = this.verbosity === 'high' ? 800 : 2000;
    const {curLength, maxLength} = this;

    // set timeout for updating live region, and save it so it can be cleared by typing
    this.liveTimeout = window.setTimeout(() => {
      const message = curLength > maxLength ? 'Over character limit' : `${this.maxLength - this.curLength} characters remaining`;
      this.liveAnnouncement = message;
    }, timeoutLength);
  }
}