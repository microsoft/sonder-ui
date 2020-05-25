# Select

A custom alternative to `<select>` that uses a `div` with `role="combobox"` as an interface along with a `div` with `role="listbox"` for options. Supports autoselect but not filtering.

## Purpose

Custom dropdown selection widgets have historically been difficult to implement in an accessible way. The [ARIA combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) altered quite a bit from ARIA 1.0 to ARIA 1.1 to ARIA 1.2, and browser and assistive tech support is still imperfect.

Another element of confusion comes from the ambiguity of needing to choose between a button/listbox implementation and a combobox implementation. The native `<select>` maps to a button that expands a listbox on both macOS and iOS, and to a combobox on Windows machines. The only way to create a native experience across multiple platforms is to use the `<select>` element itself.

For the custom component, the semantics and behavior were chosen based on the results of a user study where multiple implementations were testing against each other, including the button/listbox, ARIA 1.1 combobox, and ARIA 1.2 combobox. The tested components are in the `draft-components` directory, and links to the test setup and results are below.

The native `<select>` is still a much better choice than any custom element. Unless there is a compelling need for functionality that is not covered by the native element, just use `<select>`.

## Visual Design Guidelines

All the usual requirements for form fields apply: a persistent label, visible focus state, perceivable control boundaries, and adequate text contrast. The following Web Content Accessibility Guidelines provide more information:

- [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)
- [2.4.7 Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html)
- [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [1.4.3 Contrast (minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## Keyboard Interaction

**When collapsed**

- `Enter`, `Space`, `Up Arrow` or `Down Arrow` will all expand the dropdown, and visual focus will be on the first option, or the most recently highlighted option.
- Printable characters will also expand the dropdown and move visual focus to the first matching option.

**When expanded**
- `Enter` or `Space` selects the current option and closes the dropdown
- `Up Arrow` moves focus to the previous option, if one exists. If focus is already on the first option, it will not move. Selection does not change.
- `Down Arrow` moves focus to the next option, if one exists. If focus is already on the last option, it will not move. Selection does not change.
- `Home`/`End` moves focus to the first or last option. Selection does not change.
- `Escape` closes the dropdown and reverts selection to the previously selected option.
- `Tab` selects the current option, closes the dropdown, and focus moves to the next focusable item after the combobox.
- `Alt` + `Up Arrow` selects the current option and closes the dropdown.
- Typing a single printable character moves focus to and selects the first option beginning with that character.
- Typing a string of printable characters in quick succession moves focus to and selects the first option that starts with the full string, if one exists.
- Typing the same printable character repeatedly will cycle through all options that begin with that character.

### Keyboard Notes

Some notes on why these specific keyboard behaviors were chosen:

- `Space` is used to select an option and close the dropdown, even though this is not true for the native `<select>` element. This is because in usability studies, users would often attempt to use the spacebar to select and close and be confused when it did not work. This may be learned behavior from desktop patterns, and implementing it improves usability with no real downside.
- `Tab` on an open dropdown will also select the current option and close the dropdown. This is a feature of the native `<select>` element, and is also useful as keyboard users avoided using `Enter` to select. Even though `Enter` does not trigger form submission in an open native `<select>` element, that behavior on other form elements is likely the reason most people tried other means like `Space`, `Tab`, and `Alt` + `Up Arrow`.
- `Escape` reverts selection when it closes the dropdown. This is the default behavior on macOS, but not on Windows. The ability to revert selection is common on desktop comboboxes, however, and appeared to be expected by users.
- Selection does not follow focus: when arrowing through the options, `aria-activedescendant` and visual focus will update, but not `aria-selected` or the combobox value. This enables the `Escape` behavior detailed above, and is reflected in the behavior of macOS select components, and newer native Windows select-only comboboxes (e.g. in the Settings app).
- Arrow keys and printable characters open the dropdown: While the native `<select>` element enables changing the value without opening the dropdown, forcing the dropdown to open has multiple benefits. The user is always able to cancel selection with `Escape`, the number of options and index of the current option is available, and there are fewer support issues with screen readers reading the updated option.

## Semantics

The recommended semantic structure is the one detailed in the [ARIA 1.2 combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox), but using a static element from the combobox rather than an `<input>` element. A reduced example of the minimum code required to make a select-only combobox is below (demonstrating a combobox that is currently expanded, with the first option selected):

```html
<label id="label-id">Make a choice</label>
<div type="text" role="combobox" aria-labelledby="label-id" aria-controls="listbox-id" aria-expanded="true" aria-haspopup="listbox" aria-activedescendant="option-a-id" aria-autocomplete="none">Choice A</div>
<div id="listbox-id" role="listbox" tabindex="-1">
  <div id="option-a-id" role="option" aria-selected="true">Choice A</div>
  <div id="option-b-id" role="option">Choice B</div>
  <div id="option-c-id" role="option">etc.</div>
</div>
```

### Notes on Semantics

- `<div>` and not `<input readonly>`: some select component implementations have used a readonly input element to allow selection but not freeform typing. This breaks the user expectation that a read-only form input will not accept any form of user input. The resulting confusion was observed in the usability study, and the `<input readonly role="combobox">` implementation did not perform well.
- `role="combobox"` over a button/listbox: the usability of a button/listbox pattern likely suffered because more screen reader users are on Windows than on macOS, both in the study and [in the real world](https://webaim.org/projects/screenreadersurvey8/#primary). There are other practical issues with using a button to accept user input: it has no mechanism to expose both a label and a value, and it [cannot be set to required or invalid](https://github.com/w3c/aria-practices/issues/657).
- `tabindex="-1"` on the listbox: in some browsers, any scrollable region is surfaced in the tab order by default. This means that if the listbox is scrollable, tabbing away from an open combobox will move focus to the listbox, and then focus is lost immediately afterward when the listbox collapses. Adding `tabindex="-1"` prevents the listbox from ever being individually in the tab order.

## Resources
- [`<select>` your poison part 1](https://www.24a11y.com/2019/select-your-poison/)
- [`<select>` your poison part 2](https://www.24a11y.com/2019/select-your-poison-part-2/)
- [ARIA 1.2 combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox)

## Stencil JS Component

The `<sui-select>` web component supports the following properties and events:

<!-- Auto Generated Below -->

### Properties

| Property  | Attribute | Description                 | Type             | Default     |
| --------- | --------- | --------------------------- | ---------------- | ----------- |
| `label`   | `label`   | String label                | `string`         | `undefined` |
| `options` | --        | Array of name/value options | `SelectOption[]` | `undefined` |


### Events

| Event    | Description                                | Type                |
| -------- | ------------------------------------------ | ------------------- |
| `select` | Emit a custom select event on value change | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
