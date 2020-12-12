# Filter List

This consists of an input that filters a list of items. The live region verbosity and feedback of the filter is being tested in the usability study.

## Stencil JS Component

The `<sui-filter-list>` web component supports the following properties and events:

<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                      | Type                          | Default     |
| ----------- | ------------ | ---------------------------------------------------------------- | ----------------------------- | ----------- |
| `label`     | `label`      | Label for the textarea                                           | `string`                      | `undefined` |
| `maxLength` | `max-length` | Max number of characters                                         | `number`                      | `undefined` |
| `verbosity` | `verbosity`  | Verbosity setting for screen reader behavior, defaults to medium | `"high" \| "low" \| "medium"` | `'medium'`  |


## Events

| Event   | Description                                                      | Type                |
| ------- | ---------------------------------------------------------------- | ------------------- |
| `error` | Emit a custom event when textarea's value exceeds the max length | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
