/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { Component, Event, EventEmitter, Prop, State, Watch } from '@stencil/core';
import { Column } from './grid-helpers';
import { renderRow, RowOptions, RowSelectionPattern } from './row';
import { renderHeaderCell, Sort } from './header-cell';

@Component({
  tag: 'sui-grid-new',
  styleUrl: './grid.css'
})
export class SuiGridv2 {
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
  @Prop() pageLength = 30;

  /**
   * Custom function to control the render of cell content
   */
  @Prop() renderCustomCell: (content: string, colIndex: number, rowIndex: number) => string | HTMLElement;

  /**
   * Index of the column that best labels a row
   */
  @Prop() titleColumn = 0;

  /** Properties for Usability test case behaviors: **/
  @Prop() editable: boolean = true;
  @Prop() editOnClick: boolean;
  @Prop() headerActionsMenu: boolean;
  @Prop() rowSelection: RowSelectionPattern;
  @Prop() useApplicationRole = false;

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
   * Emit a custom edit event when cell content change is submitted
   */
  @Event({
    eventName: 'editCell'
  }) editCellEvent: EventEmitter<{value: string; column: number; row: number;}>;

  /**
   * Emit a custom stepper value change event
   */
  @Event({
    eventName: 'stepperChange'
  }) stepperChangeEvent: EventEmitter<{row: number; value: number}>;

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
  private preventSave = false; // prevent saves on escape
  private mouseDown = false; // handle focus/click behavior

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
    this.callFocus && console.log('calling focus on', this.focusRef);
    // handle focus
    this.callFocus && this.focusRef && this.focusRef.focus();
    this.callFocus = false;

    // handle input text selection
    this.callInputSelection && this.focusRef && (this.focusRef as HTMLInputElement).select();
    this.callInputSelection = false;
  }

  render() {
    const {
      columns = [],
      description,
      editable,
      gridType = 'table',
      headerActionsMenu,
      rowSelection,
      selectedRows,
      sortedCells = [],
      sortedColumn,
      sortState,
      useApplicationRole
    } = this;
    const rowSelectionState = this.getSelectionState();
    const tableRole = useApplicationRole ? 'application' : gridType;

    return <table role={tableRole} aria-roledescription={useApplicationRole ? 'editable data grid' : null} class="grid" aria-labelledby={this.labelledBy} aria-readonly={editable ? null : 'true'} onKeyDown={this.onCellKeydown.bind(this)}>
      {description ? <caption>{description}</caption> : null}
      <thead role="rowgroup" class="grid-header">
        <tr role="row" class="row">
          {rowSelection !== RowSelectionPattern.None ?
            <th
              role="columnheader"
              aria-labelledby="select-all-header"
              class={{'checkbox-cell': true, 'indeterminate': rowSelectionState === 'indeterminate'}}
            >
              <span class="visuallyHidden" id="select-all-header">select row</span>
              <input
                type="checkbox"
                aria-label="select all rows"
                checked={!!rowSelectionState}
                tabIndex={this.gridType === 'grid' ? this.activeCell.join('-') === '0-0' ? 0 : -1 : null}
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
              actionsMenu: headerActionsMenu,
              isActiveCell: this.activeCell.join('-') === `${index}-0`,
              isSortedColumn: sortedColumn === index,
              setFocusRef: (el) => this.focusRef = el,
              sortDirection: sortState,
              onSort: this.onSortColumn.bind(this),
              onFilter: this.onFilterInput.bind(this)
            });
          })}
        </tr>
      </thead>
      <tbody role="rowgroup" class="grid-body">
        {sortedCells.map((cells = [], index) => {
          const isSelected = !!selectedRows.get(cells);
          let rowOptions: RowOptions = {
            cells,
            index: index + 1,
            isSelected,
            selection: rowSelection,
            renderCell: this.renderCell.bind(this),
            renderCheckboxCell: this.renderCheckboxCell.bind(this),
            onSelectionChange: this.onRowSelect.bind(this)
          };

          if (this.rowSelection === RowSelectionPattern.Aria) {
            const isActiveRow = this.activeCell[1] === index + 1;
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
    const previousCell = this.activeCell;
    this.activeCell = [column, row];
    const isActiveCellClick = previousCell[0] === column && previousCell[1] === row;

    // exit editing if not clicking on active cell
    if (!isActiveCellClick && !this.editOnClick && this.isEditing) {
      this.saveCell(previousCell[0], previousCell[1], (this.focusRef as HTMLInputElement).value);
      this.updateEditing(false, false);
    }
  }

  private onCellDoubleClick(column) {
    if (!this.editOnClick && !this.columns[column].actionsColumn) {
      console.log('double click, editing')
      this.updateEditing(true, true);
      event.preventDefault();
    }
  }

  private onCellFocus(row, column) {
    if (this.mouseDown) {
      this.mouseDown = false;
      return;
    }

    this.activeCell = [column, row];
  }

  private onCellKeydown(event: KeyboardEvent) {
    const { pageLength } = this;
    const maxCellIndex = this.rowSelection === RowSelectionPattern.Checkbox ? this.columns.length : this.columns.length - 1;
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
        colIndex = Math.min(maxCellIndex, colIndex + 1);
        break;
      case 'Home':
        colIndex = 0;
        break;
      case 'End':
        colIndex = maxCellIndex;
        break;
      case 'Enter':
      case ' ':
        if (this.columns[colIndex].actionsColumn) return;
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

  private onEditButtonClick(event: MouseEvent, row: number, column: number, edit: boolean, save = false) {
    event.stopPropagation();
    this.activeCell = [column, row];
    this.updateEditing(edit, true);
    if (save) {
      this.saveCell(column, row, (this.focusRef as HTMLInputElement).value);
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

    if (key === 'Escape') {
      this.preventSave = true;
    }

    // switch out of edit mode on enter or escape
    if (key === 'Escape' || key === 'Enter') {
      this.updateEditing(false, true);
    }

    // save value on enter
    if (key === 'Enter') {
      const cellIndex = this.rowSelection === RowSelectionPattern.Checkbox ? this.activeCell[0] - 1 : this.activeCell[0];
      this.saveCell(cellIndex, this.activeCell[1], (event.target as HTMLInputElement).value);
    }

    // allow tab and shift+tab to move through cells in a row for edit on click grid
    else if (key === 'Tab' && this.editOnClick) {
      const maxCellIndex = this.rowSelection === RowSelectionPattern.Checkbox ? this.columns.length : this.columns.length - 1;
      if (shiftKey && this.activeCell[0] > 0) {
        this.saveCell(this.activeCell[0], this.activeCell[1], (event.target as HTMLInputElement).value);
        this.updateActiveCell(this.activeCell[0] - 1, this.activeCell[1]);
        this.preventSave = true;
        event.preventDefault();
      }
      else if (!shiftKey && this.activeCell[0] < maxCellIndex) {
        this.saveCell(this.activeCell[0], this.activeCell[1], (event.target as HTMLInputElement).value);
        this.updateActiveCell(this.activeCell[0] + 1, this.activeCell[1]);
        this.preventSave = true;
        event.preventDefault();
      }
    }
  }

  private onRowKeyDown(event: KeyboardEvent) {
    const { pageLength } = this;
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
    const currentCellKey = `${cellIndex}-${rowIndex}`;
    const cellColumn = this.rowSelection === RowSelectionPattern.Checkbox ? this.columns[cellIndex - 1] : this.columns[cellIndex];
    const isActiveCell = activeCellId === currentCellKey;
    const isActionsColumn = this.columns[cellIndex] && this.columns[cellIndex].actionsColumn;
    const isGrid = this.gridType === 'grid';
    return <td
      role={isGrid ? 'gridcell' : 'cell'}
      id={`cell-${rowIndex}-${cellIndex}`}
      class={{'cell': true, 'editing': this.isEditing && isActiveCell }}
      aria-label={this.useApplicationRole ? `${cellColumn.name} ${content}` : null}
      aria-readonly={!this.editable || cellColumn.actionsColumn ? 'true' : null}
      tabIndex={isGrid && this.rowSelection !== RowSelectionPattern.Aria ? isActiveCell ? 0 : -1 : null}
      ref={isActiveCell && !this.isEditing && this.rowSelection !== RowSelectionPattern.Aria ? (el) => { this.focusRef = el; } : null}
      onFocus={() => { this.onCellFocus(rowIndex, cellIndex)}}
      onClick={this.editable ? () => { this.onCellClick(rowIndex, cellIndex); } : null}
      onDblClick={this.editable ? () => { this.onCellDoubleClick(cellIndex); } : null}
      onMouseDown={() => { this.mouseDown = true; }}
    >
      {this.isEditing && isActiveCell && !isActionsColumn
        ? <input type="text" value={content} class="cell-edit" onKeyDown={this.onInputKeyDown.bind(this)} ref={(el) => this.focusRef = el} />
        : <span class="cell-content">{this.renderCellContent(content, cellIndex, rowIndex)}</span>
      }
      {!cellColumn.actionsColumn ?
        this.isEditing && isActiveCell ?
          [
            <button class="confirm-button" key={`${currentCellKey}-save`} type="button" onClick={(event) => { this.onEditButtonClick(event, rowIndex, cellIndex, false, true) }}>
              <svg role="img" aria-label="Save" width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>
              </svg>
            </button>,
            <button class="confirm-button" key={`${currentCellKey}-cancel`} type="button" onClick={(event) => { this.onEditButtonClick(event, rowIndex, cellIndex, false) }}>
              <svg role="img" aria-label="Cancel" width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
              </svg>
            </button>
          ]
          : <button
              class="edit-button"
              key={`${currentCellKey}-edit`}
              type="button"
              tabIndex={isActiveCell ? null : -1}
              // ref={isActiveCell ? (el) => { this.focusRef = el; } : null}
              onClick={(event) => { this.onEditButtonClick(event, rowIndex, cellIndex, true) }}>
                <svg role="img" aria-label="Edit" width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                </svg>
              </button>
        : null
      }
    </td>;
  }

  private renderCellContent(content: string, colIndex: number, rowIndex: number) {
    const { renderCustomCell = (content) => content } = this;
    const isActionsColumn = this.columns[colIndex] && this.columns[colIndex].actionsColumn;
    // spoofing different types of custom content for testing
    if (isActionsColumn) {
      const actionsType = content.split(', ').shift();
      switch(actionsType) {
        case 'button':
          return this.renderCellContentButtons(content, colIndex, rowIndex);
        case 'radio':
          return this.renderCellContentRadios(content, colIndex, rowIndex);
        case 'stepper':
          return this.renderCellContentStepper(content, colIndex, rowIndex);
      }
    }
    else {
      return renderCustomCell(content, colIndex, rowIndex);
    }
  }

  private renderCellContentButtons(content: string, colIndex: number, rowIndex: number) {
    const isActiveCell = this.activeCell.join('-') === `${colIndex}-${rowIndex}`;
    const buttons = content.split(', ');
    buttons.shift();

    return buttons.map((button) => (
      <button
        class="test-actions grid-button"
        id={`action-${rowIndex}-${colIndex}`}
        aria-labelledby={`action-${rowIndex}-${colIndex} cell-${rowIndex}-${this.titleColumn}`}
        tabIndex={this.gridType === 'grid' ? isActiveCell ? 0 : -1 : null}
        onClick={(() => alert(`This is just a test, you successfully activated the ${button} button`))}
      >{button}</button>
    ));
  }

  private renderCellContentStepper(content: string, colIndex: number, rowIndex: number) {
    const isActiveCell = this.activeCell.join('-') === `${colIndex}-${rowIndex}`;
    const data = content.split(', ');
    const label = data[1];
    const value = Number(data[2]);

    const add = () => { this.stepperChangeEvent.emit({row: rowIndex, value: value + 1}); };
    const subtract = () => { this.stepperChangeEvent.emit({row: rowIndex, value: value - 1}); };

    return ([
      <input type="tel" class="test-actions grid-stepper" aria-label={label} value={value || 0} tabIndex={isActiveCell ? null : -1} onChange={(event) => this.stepperChangeEvent.emit({row: rowIndex, value: Number((event.target as HTMLInputElement).value) })} />,
      <button type="button" aria-label="add" class="test-actions grid-button" tabIndex={isActiveCell ? null : -1} onClick={add}>+</button>,
      <button type="button" aria-label="subtract" class="test-actions grid-button" tabIndex={isActiveCell ? null : -1} onClick={subtract}>-</button>
    ])
  }

  private renderCellContentRadios(content: string, colIndex: number, rowIndex: number) {
    const isActiveCell = this.activeCell.join('-') === `${colIndex}-${rowIndex}`;
    const radios = content.split(', ');
    const name = `radio-${colIndex}-${rowIndex}`;
    radios.shift();

    return radios.map((radio) => (
      <label
        class="test-actions grid-radio"
        id={`action-${rowIndex}-${colIndex}`}
      >
        <input
          type="radio"
          name={name} 
          tabIndex={this.gridType === 'grid' ? isActiveCell ? 0 : -1 : null}
          onKeyDown={(event) => { (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') && event.stopPropagation(); }}
          />
        {radio}
      </label>
    ));
  }

  private renderCheckboxCell(rowIndex: number, selected: boolean) {
    const activeCellId = this.activeCell.join('-');
    return <td role="gridcell" class="checkbox-cell">
      <input
        type="checkbox"
        checked={selected}
        aria-labelledby={`cell-${rowIndex}-${this.titleColumn + 1}`}
        tabIndex={activeCellId === `0-${rowIndex}` ? 0 : -1}
        ref={activeCellId === `0-${rowIndex}` ? (el) => { this.focusRef = el; } : null}
        onChange={(event) => this.onRowSelect(this.sortedCells[rowIndex], (event.target as HTMLInputElement).checked)}
        onKeyDown={(event) => { (event.key === ' ' || event.key === 'Enter') && event.stopPropagation(); }}
      />
      <span class="selection-indicator"></span>
    </td>;
  }

  private saveCell(column: number, row: number, value: string) {
    if (this.preventSave) {
      this.preventSave = false;
      return;
    }

    this.editCellEvent.emit({ column, row, value });
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
