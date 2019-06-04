# Readonly Select

A test of a `<select>` alternative that uses `role="combobox"` with a `<input readonly>` child. This approach aligns more closely to the way JAWS, NVDA, and Narrator interpret a `<select>` element, but has some significant drawbacks over the native `<select>`.

## Why this component?

Custom dropdown selection widgets have historically been difficult to implement in an accessible way. The [ARIA combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox) altered quite a bit from ARIA 1.0 to ARIA 1.1, and browser and assistive tech support is still imperfect.

Another element of confusion comes from the ambiguity of needing to choose between a button/listbox implementation and a combobox implementation. The native `<select>` maps to the former on both macOS and iOS, and to the latter on Windows machines.

The native `<select>` is still a much better choice than any custom element.

- The main complaint with a native `<select>` is that the options menu is not styleable
- Custom selection components remain some of the hardest to get right. There was significant change in the pattern between aria 1.0 and aria 1.1
- macOS and Windows interpret the roles of the native `<select>` differently, which makes it hard to choose which semantic avenue to follow. The aria spec comes down on the macOS side, but more screen reader users are on Windows.
- There are widely varying implementations found in the wild, even from accessibility professionals. There does not seem to be a single easy consensus about how to write this, and we still get frequent questions and issues raised about this pattern

## Testing

During the development of this component, it was consistently tested and re-tested with NVDA and JAWS on Firefox and Chrome, Narrator with Edge, VoiceOver and Safari on macOS and iOS, keyboard commands, and high contrast mode to try to weed out any obvious errors.

We then conducted a user study that included this select implementation along with several others with minor differences. The variations we tested included:

- A native `<select>` element
- A button that triggered a listbox popup
- A combobox similar to this one, but with no input instead of a readonly input

### Test setup

(Add more information on usability tests, including link to scenarios and list of ATs included in the study)

### Results

(Pending study completion)

## Design Guidelines

All the usual requirements for form fields apply: label, visible focus state, percievable control boundaries, etc.

### Keyboard Interaction

This component can exist in two basic states: open and closed. There are slightly different keyboard commands available in each.

#### Closed:

- `Down Arrow` opens the options menu and highlights the first option
- `Type Character` opens the options menu and highlights the first option starting with the character

#### Open:

- `Down Arrow` highlights the next option, stopping at the last option
- `Up Arrow` highlights the previous option, stopping at the first option
- `Home` highlights the first option
- `End` highlights the last option
- `Enter` selects the current option and closes the menu
- `Escape` closes the menu without changing the selection

### Focus Management

The entire combobox widget should be a single tab stop. This means that any supplementary buttons (e.g. a separate "open menu" button or clear button) should be removed from the tab order with `tabindex="-1"`. The combobox should also only show up once when navigating by form shortcuts, so supplementary buttons should also be removed from the accessibility tree with `aria-hidden="true"`.

This version of the combobox keeps focus in the input, and communicates the highlighted option with `aria-activedescendant`. The component never actively moves focus.

### Going Beyond

- How can you extend this component? what are the pitfalls?


## Using the Readonly Select component
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
