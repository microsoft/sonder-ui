/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Listen, Prop, State, Watch } from '@stencil/core';
import { Column } from './grid-helpers';

enum Sort {
  Ascending = 'ascending',
  Descending = 'descending',
  None = 'none'
}

@Component({
  tag: 'sui-grid',
  styleUrl: './grid.css'
})
export class SuiGrid {
  /**
   * Grid data
   */
  @Prop() cells: string[][];

  /**
   * Column definitions
   */
  @Prop() columns: Column[];

  /**
   * Caption/description for the grid
   */
  @Prop() description: string;

  /**
   * Whether rows can be selected
   */
  @Prop() isSelectable: boolean;

  /**
   * String ID of labelling element
   */
  @Prop() labelledBy: string;

  /**
   * Number of rows in one "page": used to compute pageUp/pageDown key behavior, and when paging is used
   */
  @Prop() pageLength: number;

  /** Properties for Usability test case behaviors: **/
  @Prop() editOnFocus: boolean;

  /**
   * Emit a custom filter event
   */
  @Event({
    eventName: 'filter'
  }) filterEvent: EventEmitter;

  /**
   * Save column sort state
   */
  @State() sortedColumn: number;
  @State() sortState: Sort;

  // save cell focus and edit states
  @State() activeCell: [number, number] = [0, 0];
  @State() isEditing = false;

  /**
   * Save current filter strings
   */
  private filters: WeakMap<Column, string> = new WeakMap();

  /**
   * Save current sorted cell array
   * Will likely need to be moved out of component to allow on-demand and paged grids
   */
  private sortedCells: string[][];

  /*
   * Save a reference to whatever element should receive focus
   */
  private focusRef: HTMLElement;

  /*
   * Private properties used to trigger DOM methods in the correct lifecycle callback
   */
  private callFocus = false;
  private callInputSelection = false;

  @Watch('cells')
  watchOptions(newValue: string[][]) {
    console.log('cells updated');
    this.sortedCells = this.getSortedCells(newValue);
  }

  componentWillLoad() {
    this.sortedCells = this.cells;
  }

  componentDidUpdate() {
    // handle focus
    this.callFocus && this.focusRef && this.focusRef.focus();
    this.callFocus = false;

    // handle input text selection
    this.callInputSelection && this.focusRef && (this.focusRef as HTMLInputElement).select();
    this.callInputSelection = false;
  }

  @Listen('focusout')
  onBlur(event: FocusEvent) {
    if (event.relatedTarget !== this.focusRef) {
      this.updateEditing(false, false);
    }
  }

  render() {
    const {
      columns = [],
      description,
      isEditing,
      sortedCells = [],
      sortedColumn,
      sortState
    } = this;

    const activeCellId = this.activeCell.join('-');
    let isActiveCell: boolean;

    return <table role="grid" class="grid" aria-labelledby={this.labelledBy}>
      {description ? <caption>{description}</caption> : null}
      <thead role="rowgroup" class="grid-header">
        <tr role="row" class="row">
          {columns.map((column, index) => (
            <th role="columnheader" class="cell heading-cell" aria-sort={column.sortable ? sortedColumn === index ? sortState : 'none' : null}>
              <span class="column-title">{column.name}</span>
              {column.sortable
                ? <button
                    class={{ 'filter-button': true, [sortState]: sortedColumn === index }}
                    onClick={() => this.onSortColumn(index)}
                  >
                    <span class="visuallyHidden">{sortedColumn === index ? sortState : 'sort'}</span>
                    <img alt="" role="img" src={`/assets/sort-${sortedColumn === index ? sortState : 'none'}.svg`} />
                  </button>
                : null
              }
              {column.filterable
                ? <input type="text" class="filter-input" onInput={(event) => this.onFilterInput(event, column)} />
                : null
              }
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup" class="grid-body" onKeyDown={this.onCellKeydown.bind(this)}>
        {sortedCells.map((row = [], rowIndex) => (
          <tr role="row" class="row">
            {row.map((cell, cellIndex) => {
              isActiveCell = activeCellId === `${cellIndex}-${rowIndex}`;
              return <td
                role="gridcell"
                class={{'cell': true, 'editing': isEditing && isActiveCell }}
                tabIndex={isActiveCell ? 0 : -1}
                ref={isActiveCell && !isEditing ? (el) => { this.focusRef = el; } : null}
                onClick={() => { this.onCellClick(rowIndex, cellIndex); }}
              >
                {this.renderEditCell(cell, isEditing && isActiveCell)}
              </td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>;
  }

  private getSortedCells(cells: string[][]) {
    if (this.sortedColumn !== undefined && this.sortState !== Sort.None) {
      return [ ...cells ].sort(this.getSortFunction(this.sortedColumn, this.sortState));
    }

    return cells;
  }

  private getSortFunction(columnIndex: number, order: Sort) {
    return function(row1, row2) {
      const a = row1[columnIndex].toLowerCase();
      const b = row2[columnIndex].toLowerCase();
      if (a < b) {
        return order === Sort.Ascending ? -1 : 1;
      }
      else if (a > b) {
        return order === Sort.Ascending ? 1 : -1;
      }
      else {
        return 0;
      }
    }
  }

  private onCellClick(row, column) {
    this.activeCell = [column, row];
    this.updateEditing(true, true);
  }

  private onCellKeydown(event: KeyboardEvent) {
    const { pageLength = 0 } = this;
    let [colIndex, rowIndex] = this.activeCell;
    switch(event.key) {
      case 'ArrowUp':
        rowIndex = Math.max(0, rowIndex - 1);
        break;
      case 'ArrowDown':
        rowIndex = Math.min(this.cells.length - 1, rowIndex + 1);
        break;
      case 'ArrowLeft':
        colIndex = Math.max(0, colIndex - 1);
        break;
      case 'ArrowRight':
        colIndex = Math.min(this.columns.length - 1, colIndex + 1);
        break;
      case 'Home':
        colIndex = 0;
        break;
      case 'End':
        colIndex = this.columns.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.updateEditing(true, true);
        break;
      case 'PageUp':
        rowIndex = Math.max(0, rowIndex - pageLength);
        break;
      case 'PageDown':
        rowIndex = Math.min(this.cells.length - 1, rowIndex + pageLength);
        break;
    }

    if (this.updateActiveCell(colIndex, rowIndex)) {
      event.preventDefault();
    }
  }

  private onFilterInput(event: Event, column: Column) {
    this.filters.set(column, (event.target as HTMLInputElement).value);

    const filters = {};
    this.columns.forEach((column, index) => {
      if (column.filterable && this.filters.has(column)) {
        const filterString = this.filters.get(column);
        if (filterString.trim() !== '') {
          filters[index] = filterString;
        }
      }
    });

    this.filterEvent.emit(filters);
  }

  private onInputKeyDown(event: KeyboardEvent) {
    // allow input to handle its own keystrokes
    event.stopPropagation();

    const { key, shiftKey } = event;

    // switch out of edit mode on enter or escape
    if (key === 'Escape' || key === 'Enter') {
      this.updateEditing(false, true);
    }

    // allow tab and shift+tab to move through cells in a row
    else if (key === 'Tab') {
      if (shiftKey && this.activeCell[0] > 0) {
        this.updateActiveCell(this.activeCell[0] - 1, this.activeCell[1]);
        event.preventDefault();
      }
      else if (!shiftKey && this.activeCell[0] < this.columns.length - 1) {
        this.updateActiveCell(this.activeCell[0] + 1, this.activeCell[1]);
        event.preventDefault();
      }
    }
  }

  private onSortColumn(columnIndex: number) {
    if (columnIndex === this.sortedColumn) {
      this.sortState = this.sortState === Sort.Descending ? Sort.Ascending : Sort.Descending;
    }
    else {
      this.sortedColumn = columnIndex;
      this.sortState = Sort.Ascending;
    }

    this.sortedCells = this.getSortedCells(this.cells);
  }

  private renderEditCell(value: string, editMode: boolean) {
    return editMode ?
      <input value={value} class="cell-edit" onKeyDown={this.onInputKeyDown.bind(this)} ref={(el) => this.focusRef = el} /> :
      <span class="cell-content">{value}</span>
  }

  private updateActiveCell(colIndex, rowIndex): boolean {
    if (colIndex !== this.activeCell[0] || rowIndex !== this.activeCell[1]) {
      this.callFocus = true;
      this.activeCell = [colIndex, rowIndex];
      return true;
    }

    return false;
  }

  private updateEditing(editing: boolean, callFocus: boolean) {
    this.isEditing = editing;
    this.callFocus = callFocus;
    this.callInputSelection = editing && callFocus;
  }
}
