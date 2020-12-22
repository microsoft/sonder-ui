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
  @Prop() headerActionsMenu: boolean;
  @Prop() rowSelection: RowSelectionPattern;
  @Prop() modalCell: boolean = false;

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

  // Save a reference to whatever the current cell is
  private activeCellRef: HTMLElement;

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
    if (!this.focusRef) return;
    
    // handle focus
    this.callFocus && this.focusRef.focus();
    this.callFocus = false;

    // handle input text selection
    this.callInputSelection && (this.focusRef as HTMLInputElement).select && (this.focusRef as HTMLInputElement).select();
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
      sortState
    } = this;
    const rowSelectionState = this.getSelectionState();
    const activeCellId = this.activeCell.join('-');
    const colOffset = rowSelection === RowSelectionPattern.Checkbox ? 1 : 0;

    return <table role={gridType} class="grid" aria-labelledby={this.labelledBy} aria-readonly={editable ? null : 'true'} onKeyDown={this.onCellKeydown.bind(this)}>
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
                tabIndex={this.gridType === 'grid' ? activeCellId === '0-0' ? 0 : -1 : null}
                ref={(el) => {
                  if (rowSelectionState === 'indeterminate') {
                    el.indeterminate = true;
                  }
                  if (activeCellId === '0-0') {
                    this.focusRef = el;
                  }
                }}
                onChange={(event) => this.onSelectAll((event.target as HTMLInputElement).checked)} />
              <span class="selection-indicator"></span>
            </th>
          : null}
          {columns.map((column, index) => {
            const headerIndex = index + colOffset;
            return renderHeaderCell({
              column,
              colIndex: headerIndex,
              actionsMenu: headerActionsMenu,
              isActiveCell: activeCellId === `${headerIndex}-0`,
              isSortedColumn: sortedColumn === headerIndex,
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

  // dedicated function, because internal index can be off by one depending on whether there's a checkbox column
  private getColumnData(colIndex) {
    const cellColumn = this.rowSelection === RowSelectionPattern.Checkbox ? colIndex - 1 : colIndex;
    return this.columns[cellColumn];
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
    if (!isActiveCellClick && this.isEditing) {
      this.saveCell(previousCell[0], previousCell[1], (this.focusRef as HTMLInputElement).value);
      this.updateEditing(false, false);
    }
  }

  private onCellDoubleClick(column) {
    if (!this.getColumnData(column).actionsColumn) {
      console.log('double click, editing')
      this.updateEditing(true, true);
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
    const { isEditing, pageLength } = this;
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
      case ' ':
        // space never enters into actions column
        if (this.getColumnData(colIndex).actionsColumn) return;
      case 'Enter':
        // enter also doesn't enter into actions column unless the keyboard modal variant is true
        if (this.getColumnData(colIndex).actionsColumn && !this.modalCell) return;
        console.log('go into editing mode', this.modalCell, 'is action col?', this.getColumnData(colIndex));
        event.preventDefault();
        this.updateEditing(true, true);
        break;
      case 'Escape':
        this.updateEditing(false, true);
        event.stopPropagation();
        break;
      case 'PageUp':
        rowIndex = Math.max(0, rowIndex - pageLength);
        break;
      case 'PageDown':
        rowIndex = Math.min(this.cells.length - 1, rowIndex + pageLength);
        break;
      case 'Tab':
        // prevent tabbing outside cell if modal
        this.modalCell && this.isEditing && this.trapCellFocus(event);
    }

    if (!isEditing && this.updateActiveCell(colIndex, rowIndex)) {
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

    const { key } = event;

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

    // trap focus on tab
    if (this.modalCell && key === 'Tab') {
      this.trapCellFocus(event);
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
    const isActiveCell = activeCellId === currentCellKey;
    const columnData = this.getColumnData(cellIndex);
    const isGrid = this.gridType === 'grid';
    return <td
      role={isGrid ? 'gridcell' : 'cell'}
      id={`cell-${rowIndex}-${cellIndex}`}
      class={{'cell': true, 'editing': this.isEditing && isActiveCell, 'hover-icon': this.modalCell }}
      aria-readonly={!this.editable || columnData.actionsColumn ? 'true' : null}
      aria-labelledby={!this.isEditing ? `cell-${rowIndex}-${cellIndex}-content` : null}
      tabIndex={isGrid && this.rowSelection !== RowSelectionPattern.Aria ? isActiveCell && (!this.isEditing || !this.modalCell) ? 0 : -1 : null}
      ref={isActiveCell ? (el) => {
        this.activeCellRef = el;
        if (!this.isEditing && this.rowSelection !== RowSelectionPattern.Aria) this.focusRef = el;
      } : null}
      onFocus={() => { this.onCellFocus(rowIndex, cellIndex)}}
      onClick={this.editable ? () => { this.onCellClick(rowIndex, cellIndex); } : null}
      onDblClick={this.editable ? () => { this.onCellDoubleClick(cellIndex); } : null}
      onMouseDown={() => { this.mouseDown = true; }}
    >
      {this.isEditing && isActiveCell && !columnData.actionsColumn
        ? <input type="text" value={content} class="cell-edit" onKeyDown={this.onInputKeyDown.bind(this)} ref={(el) => this.focusRef = el} />
        : <span class="cell-content" id={`cell-${rowIndex}-${cellIndex}-content`}>{this.renderCellContent(content, cellIndex, rowIndex)}</span>
      }
      {!columnData.actionsColumn ?
        this.isEditing && isActiveCell ?
          [
            <button class="confirm-button" key={`${currentCellKey}-save`} type="button" onClick={(event) => { this.onEditButtonClick(event, rowIndex, cellIndex, false, true) }} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && event.stopPropagation()}>
              <svg role="img" aria-label="Save" width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>
              </svg>
            </button>,
            <button class="confirm-button" key={`${currentCellKey}-cancel`} type="button" onClick={(event) => { this.onEditButtonClick(event, rowIndex, cellIndex, false) }} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && event.stopPropagation()}>
              <svg role="img" aria-label="Cancel" width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
              </svg>
            </button>
          ]
          : <button
              class="edit-button"
              key={`${currentCellKey}-edit`}
              type="button"
              tabIndex={isActiveCell && !this.modalCell ? null : -1}
              onFocus={() => { this.onCellFocus(rowIndex, cellIndex)}}
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
    const columnData = this.getColumnData(colIndex);
    // spoofing different types of custom content for testing
    if (columnData && columnData.actionsColumn) {
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

    return buttons.map((button, i) => (
      <button
        class="test-actions grid-button"
        id={`action-${rowIndex}-${colIndex}`}
        ref={isActiveCell && this.isEditing && i === 0 ? (el) => { this.focusRef = el; } : null}
        tabIndex={this.gridType === 'grid' ? isActiveCell && (this.isEditing || !this.modalCell) ? 0 : -1 : null}
        onClick={(() => alert(`This is just a test, you successfully activated the ${button} button`))}
        onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && event.stopPropagation()}
        onFocus={() => { this.onCellFocus(rowIndex, colIndex)}}
      >{button}</button>
    ));
  }

  private renderCellContentStepper(content: string, colIndex: number, rowIndex: number) {
    const isActiveCell = this.activeCell.join('-') === `${colIndex}-${rowIndex}`;
    const data = content.split(', ');
    const label = data[1];
    const value = Number(data[2]);

    const add = () => { this.stepperChangeEvent.emit({row: rowIndex - 1, value: value + 1}); };
    const subtract = () => { this.stepperChangeEvent.emit({row: rowIndex - 1, value: value - 1}); };

    return ([
      <input
        type="tel"
        class="test-actions grid-stepper"
        aria-label={label}
        value={value || 0}
        ref={isActiveCell && this.isEditing ? (el) => { this.focusRef = el; } : null}
        tabIndex={isActiveCell && (this.isEditing || !this.modalCell) ? null : -1}
        onChange={(event) => this.stepperChangeEvent.emit({row: rowIndex-1, value: Number((event.target as HTMLInputElement).value) })}
        onFocus={() => { this.onCellFocus(rowIndex, colIndex)}}
        onKeyDown={this.onInputKeyDown.bind(this)} />,
      <button type="button" aria-label="add" class="test-actions grid-button" tabIndex={isActiveCell && (this.isEditing || !this.modalCell) ? null : -1} onClick={add} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && event.stopPropagation()}>+</button>,
      <button type="button" aria-label="subtract" class="test-actions grid-button" tabIndex={isActiveCell && (this.isEditing || !this.modalCell) ? null : -1} onClick={subtract} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && event.stopPropagation()}>-</button>
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
          ref={isActiveCell && this.isEditing ? (el) => { this.focusRef = el; } : null}
          tabIndex={this.gridType === 'grid' ? isActiveCell && (this.isEditing || !this.modalCell) ? 0 : -1 : null}
          onKeyDown={(event) => { (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') && event.stopPropagation(); }}
          onFocus={() => { this.onCellFocus(rowIndex, colIndex)}}
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
        onChange={(event) => this.onRowSelect(this.sortedCells[rowIndex - 1], (event.target as HTMLInputElement).checked)}
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

    if (this.getColumnData(column).actionsColumn) {
      return;
    }

    this.editCellEvent.emit({ column, row: row - 1, value });
  }

  private trapCellFocus(event: KeyboardEvent) {
    const cell = this.activeCellRef;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]';
    const focusables = cell.querySelectorAll(focusableSelector) as NodeListOf<HTMLElement>;
    if (!event.shiftKey && event.target === focusables[focusables.length - 1]) {
      event.preventDefault();
      focusables[0].focus();
    }
    else if (event.shiftKey && event.target === focusables[0]) {
      event.preventDefault();
      focusables[focusables.length - 1].focus();
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
