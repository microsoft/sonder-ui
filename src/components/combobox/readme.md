# Editable Combobox

An editable combobox that uses the [ARIA 1.2 pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox). Supports autoselect and optional filtering (both off by default).

## Purpose

Custom dropdown selection widgets have historically been difficult to implement in an accessible way. The [ARIA combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) altered quite a bit from ARIA 1.0 to ARIA 1.1 to ARIA 1.2, and browser and assistive tech support is still imperfect.

Another element of confusion comes from the ambiguity of needing to choose between a button/listbox implementation and a combobox implementation. The native `<select>` maps to the former on both macOS and iOS, and to the latter on Windows machines. The semantics and behavior in this custom implementation were chosen based on the results of a user study where multiple implementations were tested against each other. The tested components are in the `draft-components` directory, and the test setup and results were written up in a [two-part article in 24a11y](https://www.24a11y.com/2019/select-your-poison/).

## Visual Design Guidelines

All the usual requirements for form fields apply: a persistent label, visible focus state, perceivable control boundaries, and adequate text contrast. The following Web Content Accessibility Guidelines provide more information:

- [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)
- [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [1.4.3 Contrast (minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## Interaction Guidelines

### Keyboard Interaction

**When collapsed**

`Enter`, `Space`, `Up Arrow` or `Down Arrow` will all expand the dropdown, and focus will be on the first option, or the most recently highlighted option. Printable characters will also expand the dropdown, update the value, and move focus to the first matching option.

**When expanded**
- `Enter` selects the current option and closes the dropdown
- `Up Arrow` moves focus to the previous option, if one exists. If focus is already on the first option, it will not move.
- `Down Arrow` moves focus to the next option, if one exists. If focus is already on the last option, it will not move.
- `Home`/`End` moves focus to the first or last option.
- `Escape` closes the dropdown and reverts selection to the previously selected option.
- `Tab` selects the current option, closes the dropdown, and focus moves to the next focusable item after the combobox.
- `Alt` + `Up Arrow` selects the current option and closes the dropdown.
- Printable characters will alter the input value and move focus to the first option that starts with the full value string, if one exists.

### Autocomplete and filtering

In running the study, we found that a surprising number of people were confused by the filtering behavior when it was present. This was particularly notable when spelling mistakes were made that returned no results, and after an option was selected, when all other results would be filtered out.

Because of this, the current recommendation is to avoid filtering unless there is a particular reason for it, such as a very large set of possible options. For more limited option sets, consider not filtering and only moving focus to the closest matching option.

## Semantics

The recommended semantic structure is the one detailed in the [ARIA 1.2 combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox). A reduced example of the minimum code required to make a combobox is below (demonstrating a combobox that is currently expanded, with the first option selected):

```html
<label for="combo-id">Make a choice</label>
<input type="text" id="combo-id" role="combobox" aria-controls="listbox-id" aria-expanded="true" aria-haspopup="listbox" aria-activedescendant="option-a-id" aria-autocomplete="none">
<div id="listbox-id" role="listbox">
  <div id="option-a-id" role="option" aria-selected="true">Choice A</div>
  <div id="option-b-id" role="option">Choice B</div>
  <div id="option-c-id" role="option">etc.</div>
</div>
```


## Component API

If you wish to use the combobox component directly, its properties and events are documented below.

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
