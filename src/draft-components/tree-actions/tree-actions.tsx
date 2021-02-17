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

  renderTreeItem(item: TreeItem, index: number, parentID: string) {
    const itemID = `${parentID}${index}`;
    const active = itemID === this.activeID;
    const expanded = this.expandedItems.get(item);
    const {name, children } = item;

    return (
      <div
        class={{
          'item-current': active,
          'tree-item': true,
          'tree-parent': !!(children && children.length)
        }}
        id={`${this.htmlId}-${itemID}`}
        ref={(el) => {if (active) this.activeItemRef = el; }}
        role="treeitem"
        aria-expanded={children && children.length ? `${!!expanded}` : null}
        tabindex={active ? 0 : -1}
        onClick={(event) => {
          event.stopPropagation();
          this.onItemClick(item, itemID);
        }}
        onKeyDown={(event) => {
          this.onItemKeyDown(event, item, itemID);
        }}
      >
        <span class="tree-item-name">{name}</span>
        {children && children.length > 0 ?
          <div role="group" class={{ 'open': !!expanded, 'tree-group': true }}>
            {children.map((item, i) => this.renderTreeItem(item, i, itemID))}
          </div>
        : null}
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