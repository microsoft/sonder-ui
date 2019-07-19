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
  const { actionsMenu = false, colIndex, column, isSortedColumn = false, sortDirection } = options;
  const idBase = `col-${colIndex}`;
  return <th role="columnheader" class="cell heading-cell" aria-sort={column.sortable ? isSortedColumn ? sortDirection : 'none' : null}>
    <span id={idBase} class="column-title">{column.name}</span>
    {actionsMenu ? renderActionsMenu(options, idBase) : renderStaticActions(options, idBase)}
  </th>
}

function renderStaticActions(options: HeaderOptions, idBase: string) {
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
    controls.push(
      <label id={`${idBase}-filter`} class="visuallyHidden">Filter</label>,
      <input type="text" aria-labelledby={`${idBase}-filter ${idBase}`} class="filter-input" onInput={(event) => onFilter((event.target as HTMLInputElement).value, column)} />
    );
  }
  return controls;
}

function renderActionsMenu(options: HeaderOptions, idBase: string) {
  const {column, colIndex: index, isSortedColumn = false, sortDirection, onSort, onFilter } = options;

  if (!column.filterable && !column.sortable) {
    return null;
  }

  return <sui-disclosure class="actions-menu" buttonLabel="column actions">
    <span slot="button">
      <img alt="menu" role="img" src="/assets/menu.svg" />
    </span>
    <div slot="popup">
    {column.filterable ? [
      <label id={`${idBase}-filter`}>Filter</label>,
      <input
        type="text"
        aria-labelledby={`${idBase}-filter ${idBase}`}
        class="filter-input"
        onInput={(event) => {
          onFilter((event.target as HTMLInputElement).value, column);
          }
        }
      />
      ] : null}
      {column.sortable ?
      <button
        class={{ 'filter-button': true, 'grid-button': true, [sortDirection]: isSortedColumn }}
        onClick={() => onSort(index)}
      >
        <img alt={isSortedColumn ? sortDirection : 'sort'} role="img" src={`/assets/sort-${isSortedColumn ? sortDirection : 'none'}.svg`} />
      </button>
      : null}
    </div>
  </sui-disclosure>;
}
