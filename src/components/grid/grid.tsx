/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Listen, Prop, State, Watch } from '@stencil/core';
import { Column } from './grid-helpers';
import { renderRow, RowOptions, RowSelectionPattern } from './row';
import { renderHeaderCell, Sort } from './header-cell';

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
   * Grid type: grids have controlled focus and fancy behavior, tables are simple static content
   */
  @Prop() gridType: 'grid' | 'table';

  /**
   * String ID of labelling element
   */
  @Prop() labelledBy: string;

  /**
   * Number of rows in one "page": used to compute pageUp/pageDown key behavior, and when paging is used
   */
  @Prop() pageLength: number;

  /**
   * Custom function to control the render of cell content
   */
  @Prop() renderCustomCell: (content: string, colIndex: number, rowIndex: number) => string | HTMLElement;

  /** Properties for Usability test case behaviors: **/
  @Prop() actionsColumn: boolean;
  @Prop() editable: boolean = true;
  @Prop() editOnClick: boolean;
  @Prop() rowSelection: RowSelectionPattern;

  /**
   * Emit a custom filter event
   */
  @Event({
    eventName: 'filter'
  }) filterEvent: EventEmitter;

  /**
   * Emit a custom row selection event
   */
  @Event({
    eventName: 'rowSelect'
  }) rowSelectionEvent: EventEmitter;

  /**
   * Save number of selected rows
   */
  @State() selectedRowCount = 0;

  /**
   * Save column sort state
   */
  @State() sortedColumn: number;
  @State() sortState: Sort;

  // save cell focus and edit states
  // active cell refers to the [column, row] indices of the cell
  @State() activeCell: [number, number] = [0, 0];
  @State() isEditing = false;

  /**
   * Save current filter strings
   */
  private filters: WeakMap<Column, string> = new WeakMap();

  /**
   * Save selection state by row
   */
  private selectedRows: WeakMap<string[], boolean> = new WeakMap();

  /**
   * Save current sorted cell array
   * Will likely need to be moved out of component to allow on-demand and paged grids
   */
  private sortedCells: string[][];

  /*
   * DOM Refs:
   */
  // Save a reference to whatever element should receive focus
  private focusRef: HTMLElement;

  /*
   * Private properties used to trigger DOM methods in the correct lifecycle callback
   */
  private callFocus = false;
  private callInputSelection = false;

  @Watch('cells')
  watchOptions(newValue: string[][]) {
    this.sortedCells = this.getSortedCells(newValue);

    // reset selectedRowCount
    let selectedRowCount = 0;
    newValue.forEach((row: string[]) => {
      this.selectedRows.has(row) && selectedRowCount++;
    });
    this.selectedRowCount = selectedRowCount;
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
      gridType = 'table',
      rowSelection,
      selectedRows,
      sortedCells = [],
      sortedColumn,
      sortState
    } = this;
    const rowSelectionState = this.getSelectionState();

    return <table role={gridType} class="grid" aria-labelledby={this.labelledBy}>
      {description ? <caption>{description}</caption> : null}
      <thead role="rowgroup" class="grid-header">
        <tr role="row" class="row">
          {rowSelection !== RowSelectionPattern.None ?
            <th role="columnheader" class={{'checkbox-cell': true, 'indeterminate': rowSelectionState === 'indeterminate'}}>
              <span class="visuallyHidden">select row</span>
              <input
                type="checkbox"
                aria-label={rowSelectionState ? 'deselect all rows' : 'select all rows'}
                checked={!!rowSelectionState}
                ref={(el) => {
                  if (rowSelectionState === 'indeterminate') {
                    el.indeterminate = true;
                  }
                }}
                onChange={(event) => this.onSelectAll((event.target as HTMLInputElement).checked)} />
              <span class="selection-indicator"></span>
            </th>
          : null}
          {columns.map((column, index) => {
            return renderHeaderCell({
              column,
              colIndex: index,
              isSortedColumn: sortedColumn === index,
              sortDirection: sortState,
              onSort: this.onSortColumn.bind(this),
              onFilter: this.onFilterInput.bind(this)
            });
            // <th role="columnheader" class="cell heading-cell" aria-sort={column.sortable ? sortedColumn === index ? sortState : 'none' : null}>
            //   <span class="column-title">{column.name}</span>
            //   {column.sortable
            //     ? <button
            //         class={{ 'filter-button': true, 'grid-button': true, [sortState]: sortedColumn === index }}
            //         onClick={() => this.onSortColumn(index)}
            //       >
            //         <span class="visuallyHidden">{sortedColumn === index ? sortState : 'sort'}</span>
            //         <img alt="" role="img" src={`/assets/sort-${sortedColumn === index ? sortState : 'none'}.svg`} />
            //       </button>
            //     : null
            //   }
            //   {column.filterable
            //     ? <input type="text" class="filter-input" onInput={(event) => this.onFilterInput(event, column)} />
            //     : null
            //   }
            // </th>
          })}
        </tr>
      </thead>
      <tbody role="rowgroup" class="grid-body" onKeyDown={this.onCellKeydown.bind(this)}>
        {sortedCells.map((cells = [], index) => {
          const isSelected = !!selectedRows.get(cells);
          let rowOptions: RowOptions = {
            cells,
            index,
            isSelected,
            selection: rowSelection,
            renderCell: this.renderCell.bind(this),
            onSelectionChange: this.onRowSelect.bind(this)
          };

          if (this.rowSelection === RowSelectionPattern.Aria) {
            const isActiveRow = this.activeCell[1] === index;
            rowOptions = {
              ...rowOptions,
              isActiveRow,
              setFocusRef: (el) => this.focusRef = el,
              onRowKeyDown: this.onRowKeyDown.bind(this)
            }
          }
          return renderRow(rowOptions);
        })}
      </tbody>
    </table>;
  }

  private getSelectionState(): boolean | 'indeterminate' {
    return this.selectedRowCount === 0 ? false : this.selectedRowCount === this.cells.length ? true : 'indeterminate';
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
    // always edit on click if clicking the active cell
    if (this.editOnClick || (this.activeCell[0] === column && this.activeCell[1] === row)) {
      this.updateEditing(true, true);
    }
    this.activeCell = [column, row];
  }

  private onCellDoubleClick(event) {
    if (!this.editOnClick) {
      this.updateEditing(true, true);
      event.preventDefault();
    }
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

  private onFilterInput(value: string, column: Column) {
    this.filters.set(column, value);

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

  private onRowKeyDown(event: KeyboardEvent) {
    const { pageLength = 0 } = this;
    let [colIndex, rowIndex] = this.activeCell;
    switch(event.key) {
      case 'ArrowUp':
        rowIndex = Math.max(0, rowIndex - 1);
        break;
      case 'ArrowDown':
        rowIndex = Math.min(this.cells.length - 1, rowIndex + 1);
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
      event.stopPropagation();
    }
  }

  private onRowSelect(row: string[], selected: boolean) {
    this.selectedRows.set(row, selected);
    this.selectedRowCount = this.selectedRowCount + (selected ? 1 : -1);
  }

  private onSelectAll(selected: boolean) {
    this.cells.forEach((row) => {
      this.selectedRows.set(row, selected);
    });
    this.selectedRowCount = selected ? this.cells.length : 0;
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

  private renderCell(rowIndex: number, cellIndex: number, content: string) {
    const activeCellId = this.activeCell.join('-');
    const isActiveCell = activeCellId === `${cellIndex}-${rowIndex}` && !(this.actionsColumn && content === 'actions');
    const isGrid = this.gridType === 'grid';
    return <td
      role={isGrid ? 'gridcell' : 'cell'}
      class={{'cell': true, 'editing': this.isEditing && isActiveCell }}
      tabIndex={isGrid ? isActiveCell ? 0 : -1 : null}
      ref={isActiveCell && !this.isEditing && this.rowSelection !== RowSelectionPattern.Aria ? (el) => { this.focusRef = el; } : null}
      onClick={() => { this.onCellClick(rowIndex, cellIndex); }}
      onDblClick={this.onCellDoubleClick.bind(this)}
    >
      {this.isEditing && isActiveCell
        ? <input value={content} class="cell-edit" onKeyDown={this.onInputKeyDown.bind(this)} ref={(el) => this.focusRef = el} />
        : <span class="cell-content">{this.renderCellContent(content, cellIndex, rowIndex)}</span>
      }
    </td>;
  }

  private renderCellContent(content: string, colIndex: number, rowIndex: number) {
    const { actionsColumn = false, gridType, renderCustomCell = (content) => content } = this;
    if (actionsColumn && content === 'actions') {
      const isActiveCell = this.activeCell.join('-') === `${colIndex}-${rowIndex}`;
      // spoof an action button
      return <button
        class="test-actions grid-button"
        tabIndex={gridType === 'grid' ? isActiveCell ? 0 : -1 : null}
        ref={isActiveCell && this.rowSelection !== RowSelectionPattern.Aria ? (el) => { this.focusRef = el; } : null}
        onClick={(() => alert('This is just a test, there is no more content'))}
        >
          View
        </button>;
    }
    else {
      return renderCustomCell(content, colIndex, rowIndex);
    }
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
    if (!this.editable) {
      return
    };

    this.isEditing = editing;
    this.callFocus = callFocus;
    this.callInputSelection = editing && callFocus;
  }
}
