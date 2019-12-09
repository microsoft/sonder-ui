/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'sui-tooltip-escape',
  styleUrl: './tooltip-escape.css',
  shadow: false
})
export class SuiTooltipEscape {
  /**
   * Text to show within the tooltip
   */
  @Prop() content: string;

  /**
   * Optional selector to attach parent key events. Defaults to document
   */
  @Prop() containerSelector: string;

  /**
   * Give the tooltip an id to reference elsewhere
   */
  @Prop() tooltipId: string;

  /**
   * Custom width style, as a string including units
   */
  @Prop() width: string;

  /**
   * Optionally define tooltip position, defaults to "bottom"
   */
  @Prop() position: 'top' | 'bottom';

  // whether the tooltip is open or closed
  @State() open = false;

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

  componentWillLoad() {
    // attach keyboard listeners to the root
    const rootNode = this.containerSelector ? document.querySelector(this.containerSelector) : document;
    rootNode.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  componentDidUnload() {
    // remove keyboard listeners to the root
    const rootNode = this.containerSelector ? document.querySelector(this.containerSelector) : document;
    rootNode.removeEventListener('keydown', this.onKeyDown);
  }

  render() {
    const { tooltipId, content = '', open, position = 'bottom', width } = this;
    const textWidth = width ? width : `${8 * content.length}px`; // calculated width is a bit hacky for the moment

    return (
      <div class="tooltip-wrapper" onMouseEnter={this.openTooltip.bind(this)} onMouseLeave={this.closeTooltip.bind(this)}>
        <slot />
        <div class={{'tooltip': true, 'open': open, 'top': position === 'top'}} role="tooltip" id={tooltipId ? tooltipId : null}>
          <div style={{'width': textWidth}}>{content}</div>
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
    if (this.open && event.key === 'Escape') {
      this.closeTooltip(false);
      event.stopPropagation();
    }
  }

  private openTooltip() {
    // if tooltip is empty, do not display
    if (this.content.trim() === '') {
      return;
    }

    // clear close timeout, if exists
    if (this.timeout) {
      window.clearTimeout(this.timeout);
    }

    this.open = true;
  }
}