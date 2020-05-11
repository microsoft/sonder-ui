# Select

A custom alternative to `<select>` that uses a `div` with `role="combobox"` as an interface along with a `div` with `role="listbox"` for options. Supports autoselect but not filtering.

## Purpose

Custom dropdown selection widgets have historically been difficult to implement in an accessible way. The [ARIA combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) altered quite a bit from ARIA 1.0 to ARIA 1.1 to ARIA 1.2, and browser and assistive tech support is still imperfect.

Another element of confusion comes from the ambiguity of needing to choose between a button/listbox implementation and a combobox implementation. The native `<select>` maps to the former on both macOS and iOS, and to the latter on Windows machines. The semantics and behavior in this custom implementation were chosen based on the results of a user study where multiple implementations were testing against eachother. The tested components are in the `draft-components` directory, and links to the test setup and results will be added soon.

The native `<select>` is still a much better choice than any custom element. Unless there is a compelling need for functionality that is not covered by the native element, just use `<select>`.

## Visual Design Guidelines

All the usual requirements for form fields apply: a persistent label, visible focus state, perceivable control boundaries, and adequate text contrast. The following Web Content Accessibility Guidelines provide more information:

- [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)
- [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [1.4.3 Contrast (minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## Keyboard Interaction

**When collapsed**

`Enter`, `Space`, `Up Arrow` or `Down Arrow` will all expand the dropdown, and focus will be on the first option, or the most recently highlighted option. Printable characters will also expand the dropdown, update the value, and move focus to the first matching option.

**When expanded**
- `Enter` or `Space` selects the current option and closes the dropdown
- `Up Arrow` moves focus to the previous option, if one exists. If focus is already on the first option, it will not move.
- `Down Arrow` moves focus to the next option, if one exists. If focus is already on the last option, it will not move.
- `Home`/`End` moves focus to the first or last option.
- `Escape` closes the dropdown and reverts selection to the previously selected option.
- `Tab` selects the current option, closes the dropdown, and focus moves to the next focusable item after the combobox.
- `Alt` + `Up Arrow` selects the current option and closes the dropdown.
- Typing a single printable character moves focus to and selects the first option beginning with that character.
- Typing a string of printable characters in quick succession moves focus to and selects the first option that starts with the full string, if one exists.
- Typing the same printable character repeatedly will cycle through all options that begin with that character.

## Semantics

The recommended semantic structure is the one detailed in the [ARIA 1.2 combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox), but using a static element from the combobox rather than an `<input>` element. A reduced example of the minimum code required to make a select-only combobox is below (demonstrating a combobox that is currently expanded, with the first option selected):

```html
<label id="label-id">Make a choice</label>
<div type="text" role="combobox" aria-labelledby="label-id" aria-controls="listbox-id" aria-expanded="true" aria-haspopup="listbox" aria-activedescendant="option-a-id" aria-autocomplete="none">Choice A</div>
<div id="listbox-id" role="listbox">
  <div id="option-a-id" role="option" aria-selected="true">Choice A</div>
  <div id="option-b-id" role="option">Choice B</div>
  <div id="option-c-id" role="option">etc.</div>
</div>
```

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
