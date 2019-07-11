/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
import { Column } from './grid-helpers';

export enum Sort {
  Ascending = 'ascending',
  Descending = 'descending',
  None = 'none'
}

export interface HeaderOptions {
  actionsMenu?: boolean;
  column: Column;
  colIndex: number;
  isSortedColumn: boolean;
  sortDirection: Sort;
  onSort: (index: number) => void;
  onFilter: (value: string, column: Column) => void;
}

export function renderHeaderCell(options: HeaderOptions): JSX.Element {
  const { actionsMenu = false, column, isSortedColumn = false, sortDirection } = options;
  return <th role="columnheader" class="cell heading-cell" aria-sort={column.sortable ? isSortedColumn ? sortDirection : 'none' : null}>
    <span class="column-title">{column.name}</span>
    {actionsMenu ? renderActionsMenu(options) : renderStaticActions(options)}
  </th>
}

function renderStaticActions(options: HeaderOptions) {
  const {column, colIndex: index, isSortedColumn = false, sortDirection, onSort, onFilter } = options;
  const controls = [];
  if (column.sortable) {
    controls.push(<button
      class={{ 'filter-button': true, 'grid-button': true, [sortDirection]: isSortedColumn }}
      onClick={() => onSort(index)}
    >
      <img alt={isSortedColumn ? sortDirection : 'sort'} role="img" src={`/assets/sort-${isSortedColumn ? sortDirection : 'none'}.svg`} />
    </button>);
  }
  if (column.filterable) {
    controls.push(<input type="text" class="filter-input" onInput={(event) => onFilter((event.target as HTMLInputElement).value, column)} />);
  }
  return controls;
}

function renderActionsMenu(options: HeaderOptions) {
  console.log(options);
  return <div class="actions-menu">
    <button aria-expanded="false" class="actions-trigger"><span class="visuallyHidden">column actions</span></button>
  </div>;
}
