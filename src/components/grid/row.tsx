/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export enum RowSelectionPattern {
  None = 'none',
  Checkbox = 'checkbox',
  Aria = 'aria'
}

export interface RowOptions {
  cells: string[];
  index: number;
  selection?: RowSelectionPattern;
  isSelected?: boolean;
  isActiveRow?: boolean;
  setFocusRef?: (elem: HTMLElement) => void;
  renderCell: (rowIndex: number, cellIndex: number, content: string) => JSX.Element;
  onSelectionChange: (row: string[], selected: boolean) => void;
  onRowKeyDown?: (event: KeyboardEvent) => void;
}

export function renderRow(options: RowOptions): JSX.Element {
  const { selection = RowSelectionPattern.None } = options;
  switch(selection) {
    case RowSelectionPattern.Aria:
      return renderAriaSelectionRow(options);
    case RowSelectionPattern.Checkbox:
      return renderCheckboxSelectionRow(options);
    default:
      return renderDefaultRow(options);
  }
}

function renderAriaSelectionRow(options: RowOptions) {
  const { cells = [], index, renderCell, isSelected = false, isActiveRow = false, onSelectionChange, onRowKeyDown } = options;
  return <tr
    role="row"
    class={{'row': true, 'selected-row': isSelected}}
    aria-selected={isSelected ? 'true' : 'false'}
    ref={isActiveRow ? (el) => { options.setFocusRef(el); } : null}
    tabIndex={isActiveRow ? 0 : -1}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        onSelectionChange(cells, !isSelected);
        event.stopPropagation();
        event.preventDefault();
      }
      else {
        onRowKeyDown && onRowKeyDown(event);
      }
    }}
  >
    <div role="presentation" class="aria-selection-cell" onClick={() => { onSelectionChange(cells, !isSelected); }}>
      <span class="selection-indicator"></span>
    </div>
    {cells.map((cell, cellIndex) => renderCell(index, cellIndex, cell))}
  </tr>;
}

function renderCheckboxSelectionRow(options: RowOptions) {
  const { cells = [], index, renderCell, isSelected = false, onSelectionChange } = options;
  return <tr role="row" class={{'row': true, 'selected-row': isSelected}}>
    <td role="gridcell" class="checkbox-cell">
      <input type="checkbox" checked={isSelected} onChange={(event) => onSelectionChange(cells, (event.target as HTMLInputElement).checked)} />
      <span class="selection-indicator"></span>
    </td>
    {cells.map((cell, cellIndex) => renderCell(index, cellIndex, cell))}
  </tr>;
}

function renderDefaultRow(options: RowOptions) {
  const { cells = [], index, renderCell } = options;
  return <tr role="row" class="row">
    {cells.map((cell, cellIndex) => renderCell(index, cellIndex, cell))}
  </tr>;
}