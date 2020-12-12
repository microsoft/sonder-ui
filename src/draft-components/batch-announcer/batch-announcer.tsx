/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'batch-announcer',
  styleUrl: './batch-announcer.css',
  shadow: false
})
export class SuiBatchAnnouncer {
  /**
   * Desired announcement
   */
  @Prop() announcement: string;

  /**
   * Desired batch time in milliseconds, defaults to 5000ms. If set to 0, it will never announce
   */
  @Prop() batchDelay = 5000;

  /**
   * Batched update text
   */
  @State() batchedAnnouncement: string;

  // Interval ID, saved for cleanup
  private intervalId: number | null;

  @Watch('batchDelay')
  watchOptions(newValue: number) {
    this.updateInterval(newValue);
  }

  componentDidLoad() {
    this.updateInterval(this.batchDelay);
  }

  disconnectedCallback() {
    if (typeof this.intervalId === 'number') {
      window.clearInterval(this.intervalId);
    }
  }

  render() {
    return (
      <div class="sr-announcer" aria-live="assertive" aria-atomic="true">{this.batchedAnnouncement}</div>
    );
  }

  private announce() {
    if (this.announcement && this.announcement !== this.batchedAnnouncement) {
      this.batchedAnnouncement = this.announcement;
    }
  }

  private updateInterval(newInterval: number) {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }

    if (newInterval !== 0) {
      this.intervalId = window.setInterval(() => {
        this.announce();
      }, newInterval);
    }
  }
}