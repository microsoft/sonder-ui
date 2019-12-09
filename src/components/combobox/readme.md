# Combobox component

An editable combobox component, with optional filtering. The semantic structure follows the ARIA 1.2 combobox pattern, with an `<input role="combobox">` that controls a `listbox`:

```
<input type="text" role="combobox" aria-haspopup="listbox" aria-controls="listbox-id" (...)>
<div role="listbox" id="listbox-id"></div>
```


- When the listbox popup is displayed, it contains suggested values that complete or logically correspond to the characters typed in the textbox. In - this implementation, the values in the listbox have names that start with the characters typed in the textbox.
- The first suggestion is automatically highlighted as selected.
- The automatically selected suggestion becomes the value of the textbox when the combobox loses focus unless the user chooses a different suggestion or changes the character string in the textbox.

## Purpose

Custom dropdown selection widgets have historically been difficult to implement in an accessible way. The [ARIA combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) altered quite a bit from ARIA 1.0 to ARIA 1.1 to ARIA 1.2, and browser and assistive tech support is still imperfect.

Another element of confusion comes from the ambiguity of needing to choose between a popup button implementation and a combobox implementation. The native `<select>` maps to the former on both macOS and iOS, and to the latter on Windows machines.

The native `<select>` still has much better accessibility than any custom element.

- The main complaint with a native `<select>` is that the options menu is not easily styled.
- There are widely varying implementations found in the wild, even from accessibility professionals. There does not seem to be a single easy consensus about how to write this, and we still get frequent questions and issues raised about this pattern

## Design Guidelines

All the usual requirements for form fields apply: label, visible focus state, perceivable control boundaries, etc.

### Keyboard Interaction

<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                                | Type             | Default     |
| --------- | --------- | -------------------------------------------------------------------------- | ---------------- | ----------- |
| `filter`  | `filter`  | Whether the combobox should filter based on user input. Defaults to false. | `boolean`        | `undefined` |
| `label`   | `label`   | String label                                                               | `string`         | `undefined` |
| `options` | --        | Array of name/value options                                                | `SelectOption[]` | `undefined` |


## Events

| Event    | Description                                | Type                |
| -------- | ------------------------------------------ | ------------------- |
| `select` | Emit a custom select event on value change | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
