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

  /**
   * Custom width style, as a string including units
   */
  @Prop() width: string;

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
    const { tooltipId, content = '', open, position = 'bottom', width } = this;
    const textWidth = width ? width : `${8 * content.length}px`; // calculated width is a bit hacky for the moment
    const windowWidth = document.body.clientWidth;

    return (
      <div class="tooltip-wrapper" role="presentation" onKeyUp={this.onTooltipKeyUp.bind(this)} onMouseEnter={this.openTooltip.bind(this)} onMouseLeave={this.closeTooltip.bind(this)}>
        <slot />
        <div class={{'tooltip': true, 'open': open, 'top': position === 'top'}} id={tooltipId ? tooltipId : null}>
          <div style={{'width': textWidth, 'max-width': `${windowWidth * 0.8}px`}}>{content}</div>
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
      this.closeTooltip(false)
    }
    this.lastKey = null;
  }

  private onTooltipKeyUp(event: KeyboardEvent) {
    if (this.lastKey === 'Control' && event.key === 'Control') {
      this.open ? this.closeTooltip(false) : this.openTooltip();
      event.stopPropagation();
    }
    this.lastKey = null;
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