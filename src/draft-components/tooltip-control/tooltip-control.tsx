/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'sui-tooltip-control',
  styleUrl: './tooltip-control.css',
  shadow: false
})
export class SuiTooltipControl {
  /**
   * Give the tooltip an id to reference elsewhere
   */
  @Prop() tooltipId: string;

  /**
   * Text to show within the tooltip
   */
  @Prop() content: string;

  /**
   * Optionally define tooltip position, defaults to "bottom"
   */
  @Prop() position: 'top' | 'bottom';

  // whether the tooltip is open or closed
  @State() open = false;

  // save a reference to the dismiss timeout
  private timeout: number;

  // save last pressed key, to prevent Control + Key combos closing the tooltip
  private lastKey: string;

  @Listen('focusin')
  onFocus() {
    this.openTooltip();
  }

  @Listen('focusout')
  onBlur() {
    this.closeTooltip(false);
  }

  componentWillLoad() {
    // attach keyboard listeners to the document
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  componentDidUnload() {
    // remove keyboard listeners to the document
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  render() {
    const { tooltipId, content = '', open, position = 'bottom' } = this;

    return (
      <div class="tooltip-wrapper" onMouseEnter={this.openTooltip.bind(this)} onMouseLeave={this.closeTooltip.bind(this)}>
        <slot />
        <div class={{'tooltip': true, 'open': open, 'top': position === 'top'}} id={tooltipId ? tooltipId : null}>
          {content}
        </div>
      </div>
    );
  }

  private closeTooltip(delay = true) {
    if (delay) {
      // hide the tooltip after 500ms
      this.timeout = window.setTimeout(() => {
        this.open = false;
      }, 500);
    }
    else {
      this.open = false;
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    this.lastKey = event.key;
  }

  private onKeyUp(event: KeyboardEvent) {
    if (this.lastKey === 'Control' && event.key === 'Control') {
      this.closeTooltip(false);
    }
  }

  private openTooltip() {
    // clear close timeout, if exists
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.open = true;
  }
}