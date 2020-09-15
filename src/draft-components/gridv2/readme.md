# sui-grid



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description                                                                                         | Type                                                                                   | Default     |
| -------------------- | ---------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------- |
| `cells`              | --                     | Grid data                                                                                           | `string[][]`                                                                           | `undefined` |
| `columns`            | --                     | Column definitions                                                                                  | `Column[]`                                                                             | `undefined` |
| `description`        | `description`          | Caption/description for the grid                                                                    | `string`                                                                               | `undefined` |
| `editOnClick`        | `edit-on-click`        |                                                                                                     | `boolean`                                                                              | `undefined` |
| `editable`           | `editable`             | Properties for Usability test case behaviors: *                                                     | `boolean`                                                                              | `true`      |
| `gridType`           | `grid-type`            | Grid type: grids have controlled focus and fancy behavior, tables are simple static content         | `"grid" \| "table"`                                                                    | `undefined` |
| `headerActionsMenu`  | `header-actions-menu`  |                                                                                                     | `boolean`                                                                              | `undefined` |
| `labelledBy`         | `labelled-by`          | String ID of labelling element                                                                      | `string`                                                                               | `undefined` |
| `pageLength`         | `page-length`          | Number of rows in one "page": used to compute pageUp/pageDown key behavior, and when paging is used | `number`                                                                               | `30`        |
| `renderCustomCell`   | --                     | Custom function to control the render of cell content                                               | `(content: string, colIndex: number, rowIndex: number) => string \| HTMLElement`       | `undefined` |
| `rowSelection`       | `row-selection`        |                                                                                                     | `RowSelectionPattern.Aria \| RowSelectionPattern.Checkbox \| RowSelectionPattern.None` | `undefined` |
| `simpleEditable`     | `simple-editable`      |                                                                                                     | `boolean`                                                                              | `false`     |
| `titleColumn`        | `title-column`         | Index of the column that best labels a row                                                          | `number`                                                                               | `0`         |
| `useApplicationRole` | `use-application-role` |                                                                                                     | `boolean`                                                                              | `false`     |


## Events

| Event           | Description                                                    | Type                                                         |
| --------------- | -------------------------------------------------------------- | ------------------------------------------------------------ |
| `editCell`      | Emit a custom edit event when cell content change is submitted | `CustomEvent<{value: string; column: number; row: number;}>` |
| `filter`        | Emit a custom filter event                                     | `CustomEvent<void>`                                          |
| `rowSelect`     | Emit a custom row selection event                              | `CustomEvent<void>`                                          |
| `stepperChange` | Emit a custom stepper value change event                       | `CustomEvent<{row: number; value: number}>`                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
