# Combobox nofilter

A test of an alternative to the native `<select>` using `role="combobox"` with a `<input readonly>` child.

- Typing a letter selects the first matching option (if it exists)
- Typing a letter does not filter options (by design)

## Purpose

Custom dropdown selection widgets have historically been difficult to implement in an accessible way. The [ARIA combobox pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox) altered quite a bit from ARIA 1.0 to ARIA 1.1, and browser and assistive tech support is still imperfect.

Another element of confusion comes from the ambiguity of needing to choose between a button/listbox implementation and a combobox implementation. The native `<select>` maps to the former on both macOS and iOS, and to the latter on Windows machines.

The native `<select>` is still a much better choice than any custom element.

- The main complaint with a native `<select>` is that the options menu is not easily styled.
- Custom selection components remain some of the hardest to get right. There was significant change in the pattern between ARIA 1.0 and ARIA 1.1
- macOS and Windows interpret the roles of the native `<select>` differently, which makes it hard to choose which semantic avenue to follow. The ARIA spec comes down on the macOS side, but more screen reader users are on Windows.
- There are widely varying implementations found in the wild, even from accessibility professionals. There does not seem to be a single easy consensus about how to write this, and we still get frequent questions and issues raised about this pattern

## Testing

### Test setup

(Add more information on usability tests, including link to scenarios and list of ATs included in the study)

### Results

(Pending study completion)

## Design Guidelines

All the usual requirements for form fields apply: label, visible focus state, perceivable control boundaries, etc.

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
