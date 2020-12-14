# Filter List

This consists of an input that filters a list of items. The live region verbosity and feedback of the filter is being tested in the usability study.

## Stencil JS Component

The `<sui-filter-list>` web component supports the following properties and events:

<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                    | Type                          | Default     |
| ------------ | ------------ | ---------------------------------------------- | ----------------------------- | ----------- |
| `items`      | --           | Data for the filterable items                  | `string[]`                    | `[]`        |
| `label`      | `label`      | Label for the filter input                     | `string`                      | `undefined` |
| `listTitle`  | `list-title` | Optional heading for list of items             | `string`                      | `undefined` |
| `renderItem` | --           | Custom render function for                     | `(item: string) => any`       | `undefined` |
| `verbosity`  | `verbosity`  | Control frequency of live region announcements | `"high" \| "low" \| "medium"` | `'medium'`  |


## Events

| Event    | Description                               | Type                |
| -------- | ----------------------------------------- | ------------------- |
| `update` | Emit a custom event when the list updates | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
