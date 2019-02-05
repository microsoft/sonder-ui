# Combobox with menu focus

A test of a native `<select>` alternative that uses `role="combobox"` with a `<input readonly>` child. When opened, focus moves into the `role="listbox"` menu. The `aria-activedescendant` attribute remains on the input, not the listbox to follow the currently implemented pattern in Ibiza. Basic functionality only, no autocomplete or filtering.

<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                 | Type             | Default     |
| --------- | --------- | --------------------------- | ---------------- | ----------- |
| `label`   | `label`   | String label                | `string`         | `undefined` |
| `options` | --        | Array of name/value options | `SelectOption[]` | `undefined` |


## Events

| Event    | Description                                | Type                |
| -------- | ------------------------------------------ | ------------------- |
| `select` | Emit a custom select event on value change | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
