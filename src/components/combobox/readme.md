# Editable Combobox

An editable combobox that uses the [ARIA 1.2 pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox). Supports autoselect and optional filtering (off by default).

## Purpose

Custom dropdown selection widgets have historically been difficult to implement in an accessible way. The [ARIA combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) altered quite a bit from ARIA 1.0 to ARIA 1.1 to ARIA 1.2, and browser and assistive tech support is still imperfect.

Another element of confusion comes from the ambiguity of needing to choose between a button/listbox implementation and a combobox implementation. The native `<select>` maps to the former on both macOS and iOS, and to the latter on Windows machines. The semantics and behavior in this custom implementation were chosen based on the results of a user study where multiple implementations were testing against eachother. The tested components are in the `draft-components` directory, and links to the test setup and results will be added soon.

## Design Guidelines

All the usual requirements for form fields apply: label, visible focus state, perceivable control boundaries, etc.

### Keyboard Interaction
- Enter expands the dropdown when closed, and selects the current option and closes the dropdown when open
- Up/Down arrows expand the dropdown and move the selected option up or down
- Home/End selects the first or last option when open
- Escape closes the dropdown and reverts to the previously selected option
- Printable characters change the value of the input, open the dropdown (if closed), and select the first matching option

<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                                | Type             | Default     |
| --------- | --------- | -------------------------------------------------------------------------- | ---------------- | ----------- |
| `filter`  | `filter`  | Whether the combobox should filter based on user input. Defaults to false. | `boolean`        | `false`     |
| `label`   | `label`   | String label                                                               | `string`         | `undefined` |
| `options` | --        | Array of name/value options                                                | `SelectOption[]` | `undefined` |


## Events

| Event    | Description                                | Type                |
| -------- | ------------------------------------------ | ------------------- |
| `select` | Emit a custom select event on value change | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
