/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Prop, State, Watch } from '@stencil/core';
import { TreeItem } from '../../shared/interfaces';
import { Keys, TreeActions, uniqueId } from '../../shared/utils';

// return combobox action from key press
function getTreeActionFromKey(event: KeyboardEvent, item: TreeItem, expanded: boolean, level: number): TreeActions {
  const { key } = event;

  switch(key) {
    case Keys.Down:
      event.preventDefault();
      event.stopPropagation();
      return TreeActions.Next;
    case Keys.Up:
      event.preventDefault();
      event.stopPropagation();
      return TreeActions.Previous;
    case Keys.Right:
      event.preventDefault();
      event.stopPropagation();
      if (item.children) {
        return expanded ? TreeActions.Next : TreeActions.Open;
      }
      break;
    case Keys.Left:
      event.preventDefault();
      event.stopPropagation();
      if (expanded) {
        return TreeActions.Close;
      }
      else if (level > 1) {
        return TreeActions.UpLevel;
      }
      break;
    case Keys.Home:
      event.preventDefault();
      event.stopPropagation();
      return TreeActions.First;
    case Keys.End:
      event.preventDefault();
      event.stopPropagation();
      return TreeActions.Last;
    case Keys.Enter:
    case Keys.Space:
      event.stopPropagation();
      return TreeActions.Select;
  }
}

@Component({
  tag: 'tree-actions',
  styleUrl: './tree-actions.css',
  shadow: false
})
export class TreeWithActions {
  /**
   * Array of name/value options
   */
  @Prop() items: TreeItem[] = [];

  /**
   * Accessible name for tree
   */
  @Prop() label: string;

  /**
   * Include secondary actions inside or outside the treeitem
   * For support testing only
   */
  @Prop() secondaryActions: 'inside' | 'outside' | undefined;

  // Active item identifier
  // format is a string of indices of ancestors + current index
  @State() activeID = '0';

  // save expand/collapse state of tree items
  @State() expandedItems = new WeakMap();

  // keep a flat list of visible tree items
  @State() flatItemList: string[] = [];

  // Flag to set focus on next render completion
  private callFocus = false;

  // Unique ID that should really use a UUID library instead
  private htmlId = uniqueId();

  // save reference to active item
  private activeItemRef: HTMLElement;

  @Watch('items')
  watchOptions(newValue: TreeItem[]) {
    this.flatItemList = newValue.map((item, i) => {
      console.log('item updated', item);
      return `${i}`;
    });
    this.expandedItems = new WeakMap();
  }

  componentDidLoad() {
    this.flatItemList = this.items.map((item, i) => {
      console.log('item updated', item);
      return `${i}`;
    });
  }

  componentDidUpdate() {
    if (this.callFocus === true) {
      this.activeItemRef.focus();
      this.callFocus = false;
    }
  }

  render() {
    const {
      label,
      items = []
    } = this;

    return ([
      <div class="tree" role="tree" aria-label={label}>
        {items.map((item, i) => this.renderTreeItem(item, i, ''))}
      </div>
    ]);
  }

  renderSecondaryActions(item: TreeItem, currentItem: boolean) {
    return [
      <button class="tree-action" aria-label={`Edit ${item.name}`} tabIndex={currentItem ? 0 : -1} onClick={() => this.onActionClick('edit', item.name)}>
        <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
          <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path></svg>
      </button>,
      <button class="tree-action" aria-label={`Delete ${item.name}`} tabIndex={currentItem ? 0 : -1} onClick={() => this.onActionClick('delete', item.name)}>
        <svg aria-hidden="true" width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
        <path d="M8 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM12 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM16 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path>
        </svg>
      </button>
    ];
  }

  renderTreeItem(item: TreeItem, index: number, parentID: string) {
    const itemID = `${parentID}${index}`;
    const active = itemID === this.activeID;
    const expanded = this.expandedItems.get(item);
    const {name, children } = item;
    const isParentNode = !!(children && children.length);

    return (
      <div class="tree-item-wrapper" role="presentation">
        <div
          class={{
            'item-current': active,
            'tree-item': true,
            'tree-parent': isParentNode,
            'open': expanded
          }}
          id={`${this.htmlId}-${itemID}`}
          ref={(el) => {if (active) this.activeItemRef = el; }}
          role="treeitem"
          aria-expanded={isParentNode ? `${!!expanded}` : null}
          tabindex={active ? 0 : -1}
          onClick={(event) => {
            event.stopPropagation();
            this.onItemClick(item, itemID);
          }}
          onKeyDown={(event) => {
            this.onItemKeyDown(event, item, itemID);
          }}
        >
          <div class="tree-item-inner">
            <span class="tree-item-name">{name}</span>
            {!isParentNode && this.secondaryActions === 'inside'
              ? this.renderSecondaryActions(item, active)
              : null }
          </div>
          {isParentNode ?
            <div role="group" class={{ 'open': !!expanded, 'tree-group': true }}>
              {children.map((item, i) => this.renderTreeItem(item, i, itemID))}
            </div>
          : null}
        </div>
        {!isParentNode && this.secondaryActions === 'outside'
          ? this.renderSecondaryActions(item, active)
          : null }
      </div>
    )
  }

  private getFlatChildIDs(item: TreeItem, itemID: string) {
    if (!item.children) {
      return [];
    }

    const idList = [];
    item.children.forEach((child, i) => {
      const childID = `${itemID}${i}`;
      idList.push(childID);
      if (child.children && this.expandedItems.get(child)) {
        idList.push([ ...this.getFlatChildIDs(child, childID) ]);
      }
    });

    return idList;
  }

  private collapseChildren(item: TreeItem, itemID: string) {
    // update expanded state
    this.expandedItems.set(item, false);

    // update flat item list
    const childIDs = this.getFlatChildIDs(item, itemID);
    const startIndex = this.flatItemList.indexOf(itemID);
    this.flatItemList.splice(startIndex + 1, childIDs.length);
    this.flatItemList = [ ...this.flatItemList ];
  }

  private expandChildren(item: TreeItem, itemID: string) {
    // update expanded state
    this.expandedItems.set(item, true);

    // update flat item list
    const childIDs = this.getFlatChildIDs(item, itemID);
    const startIndex = this.flatItemList.indexOf(itemID);
    this.flatItemList.splice(startIndex + 1, 0, ...childIDs);
    this.flatItemList = [ ...this.flatItemList ];
  }

  private getUpdatedID(itemID: string, action: TreeActions): string | undefined {
    let flatIndex;

    switch(action) {
      case TreeActions.First:
        return '0';
      case TreeActions.Last:
        return this.flatItemList[this.flatItemList.length - 1]; // need to update this
      case TreeActions.Previous:
        flatIndex = this.flatItemList.indexOf(itemID);
        if (flatIndex > 0) {
          return this.flatItemList[flatIndex - 1];
        }
        break;
      case TreeActions.Next:
        flatIndex = this.flatItemList.indexOf(itemID);
        if (flatIndex < this.flatItemList.length - 1) {
          return this.flatItemList[flatIndex + 1];
        }
        break;
      case TreeActions.UpLevel:
        if (itemID.length > 1) {
          return itemID.slice(0, itemID.length - 1);
        }
        break;
    }
  }

  private onActionClick(action: string, itemName: string) {
    alert(`${action} ${itemName} clicked`);
  }

  private onItemChange(itemID: string) {
    this.activeID = itemID;
  }

  private onItemClick(item: TreeItem, itemID: string) {
    // open/close subtrees
    if (item.children && item.children.length) {
      const expanded = this.expandedItems.get(item);
      expanded ? this.collapseChildren(item, itemID) : this.expandChildren(item, itemID);
    }

    this.onItemChange(itemID);
    item.onClick && item.onClick(item);
  }

  private onItemKeyDown(event: KeyboardEvent, item: TreeItem, itemID: string) {
    const isExpanded = this.expandedItems.get(item);
    const action = getTreeActionFromKey(event, item, isExpanded, itemID.length);

    switch (action) {
      case TreeActions.First:
      case TreeActions.Last:
      case TreeActions.Next:
      case TreeActions.Previous:
      case TreeActions.UpLevel:
        const newID = this.getUpdatedID(itemID, action);
        if (typeof newID === 'string') {
          this.onItemChange(newID);
          this.callFocus = true;
        }
        break;
      case TreeActions.Close:
        this.collapseChildren(item, itemID);
        break;
      case TreeActions.Open:
        this.expandChildren(item, itemID);
        break;
      case TreeActions.Select:
        item.onClick && item.onClick(item);
        break;
    }
  }
}