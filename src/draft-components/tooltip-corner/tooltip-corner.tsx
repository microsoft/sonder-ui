/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'sui-tooltip-corner',
  styleUrl: './tooltip-corner.css',
  shadow: false
})
export class SuiTooltipCorner {
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

  // If the user dismisses the tooltip, save that setting
  private dismissed = false;

  // save a reference to the dismiss timeout
  private timeout: number;

  @Listen('focusin')
  onFocus() {
    this.openTooltip();
  }

  @Listen('focusout')
  onBlur() {
    this.closeTooltip(false);
  }

  render() {
    const { tooltipId, content = '', open, position = 'bottom' } = this;

    return (
      <div class="tooltip-corner-wrapper" onKeyDown={this.onKeyDown.bind(this)} onMouseEnter={this.openTooltip.bind(this)} onMouseLeave={this.closeTooltip.bind(this)}>
        <slot />
        <div class={{'tooltip-corner': true, 'open': open, 'top': position === 'top'}} role="tooltip" id={tooltipId ? tooltipId : null}>
          {content}
          <button class="tooltip-corner-close" onClick={this.onCloseClick.bind(this)} tabindex="-1" type="button" aria-hidden="true">
            <span class="visuallyHidden">close tooltip</span>
          </button>
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

  private onCloseClick() {
    this.dismissed = true;
    this.closeTooltip(false);
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.dismissed = true;
      this.closeTooltip(false);
    }
  }

  private openTooltip() {
    // once a tooltip is manually dismissed, do not open again
    if (this.dismissed) {
      return;
    }

    // clear close timeout, if exists
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.open = true;
  }
}