# Multiselect Combobox

An editable combobox with multiple selection that uses the [ARIA 1.2 pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox). Supports autoselect and filtering. Selected options show up as a list of buttons above the input, and clicking or activating any of the buttons de-selects that option.

## Purpose

Custom dropdown selection widgets have historically been difficult to implement in an accessible way. The [ARIA combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) altered quite a bit from ARIA 1.0 to ARIA 1.1 to ARIA 1.2, and browser and assistive tech support is still imperfect.

Another element of confusion comes from the ambiguity of needing to choose between a button/listbox implementation and a combobox implementation. The native `<select>` maps to the former on both macOS and iOS, and to the latter on Windows machines. The semantics and behavior in this custom implementation were chosen based on the results of a user study where multiple implementations were testing against eachother. The tested components are in the `draft-components` directory, and links to the test setup and results will be added soon.

## Design Guidelines

All the usual requirements for form fields apply: a persistent label, visible focus state, perceivable control boundaries, and adequate text contrast. The following Web Content Accessibility Guidelines provide more information:

- [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)
- [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [1.4.3 Contrast (minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

The buttons for each selected option should be immediately adjacent to the combobox, but not within the input itself. When the buttons were displayed within the input, the overlapping pointer targets and reduced target size of the input caused problems. The buttons themselves should also have adequate text contrast and boundary contrast.

### Keyboard Interaction
**When collapsed**

`Enter`, `Space`, `Up Arrow` or `Down Arrow` will all expand the dropdown, and focus will be on the first option, or the most recently highlighted option. Printable characters will also expand the dropdown, update the value, and move focus to the first matching option.

**When expanded**
- `Enter` selects the current option, clears the input, and creates a button for that option
- `Up Arrow` moves focus to the previous option, if one exists. If focus is already on the first option, it will not move.
- `Down Arrow` moves focus to the next option, if one exists. If focus is already on the last option, it will not move.
- `Home`/`End` moves focus to the first or last option.
- `Escape` closes the dropdown without modifying the selected options.
- `Tab` closes the dropdown, and focus moves to the next focusable item after the combobox.
- `Alt` + `Up Arrow` closes the dropdown without altering selection.
- Printable characters will alter the input value and move focus to the first option that starts with the full value string, if one exists

Each button for a selected option is in the tab order, and activating one will de-select that option.



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                 | Type             | Default     |
| --------- | --------- | --------------------------- | ---------------- | ----------- |
| `label`   | `label`   | String label                | `string`         | `undefined` |
| `options` | --        | Array of name/value options | `SelectOption[]` | `[]`        |


## Events

| Event    | Description                                | Type                |
| -------- | ------------------------------------------ | ------------------- |
| `select` | Emit a custom select event on value change | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
