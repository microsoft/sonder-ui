# Tooltip

While we have run a usability study focused on tooltips, but the limited scope of what was tested compared to the wide array of tooltip-like hover and focus content means that more testing is needed. For now, consider this a set of suggestions, and a reasonable pattern if used for a basic, short amount of supplemental text associated with a control. Also, strongly consider using a mechanism other than a tooltip, such as a [disclosure](../disclosure) or static text. More information on the accessibility of tooltips is here: https://sarahmhigley.com/writing/tooltips-in-wcag-21/.


## Purpose

There is a longer history of the accessibility problems with this pattern in the [tooltip article linked above](https://sarahmhigley.com/writing/tooltips-in-wcag-21/), but a short list of problems with tooltips follows:

- The browser's `title` tooltip does not respect zoom, text size, high contrast, or other user style changes.
- People who use a pointer that does not support hover (touch, eye control, switch mouse grid) cannot access most tooltips.
- In practice, the use of a tooltip for name vs. description is often misused, causing issues for screen reader users.
- When using high magnification, a larger tooltip or hover card can obscure a large part of the working viewport, sometimes with no option to dismiss it.
- When using high magnification, the user may need to carefully navigate their pointer over the tooltip without accidentally dismissing it in order to read it.
- The browser's `title` tooltip and some custom tooltips disappear after a timeout, causing problems for anyone who needs longer to perceive and read the text within the tooltip.
- Unlike other overlays like dialogs, menus, and combobox dropdowns, tooltips are not separately surfaced to assistive tech. There is also no well-defined method of interacting with them. This causes problems if the user needs to move focus into them, or dismiss them.

## Semantics

There is one primary question to answer when creating a tooltip: is it functioning as the accessible name of a control (as in the case of an icon button), or a description? That will decide whether you associate it with the attached control via `aria-labelledby` or `aria-describedby`.

Tooltips should always be associated with the control that they name or describe. If they are triggered separately, e.g. through the use of an information icon adjacent to the control, then a [disclosure pattern](../disclosure) would be more appropriate.

Here is sample markup for a tooltip that is used to describe an input:

```html
<!-- input and label code, not part of the tooltip: -->
<label for="input">Name</label>
<input type="text" id="input" aria-describedby="tooltip">

<!-- tooltip markup: -->
<div id="tooltip">
  Tooltip text content
  <button class="tooltip-close" tabindex="-1" type="button" aria-hidden="true">
    <span class="visually-hidden">close tooltip</span>
  </button>
</div>
```

The tooltip contains a close button that is not in the tab order or surfaced to screen readers, since it functions purely as a means for pointer users to dismiss the tooltip. Keyboard focus should never enter the tooltip, and the close button should not be included in the calculated text for the tooltip, or surfaced as part of the input's description.

There is no `role="tooltip"` included on the tooltip, since the role has little to no support, and does not convey anything particularly meaningful. The important semantic information is handled through the use of `aria-describedby` or `aria-labelledby`.

## Interaction

[WCAG 2.1's Content on Hover or Focus](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html) lays out some strict requirements for tooltip interactions:
1. They must be persistent, and not disappear after a timeout.
2. They must be hoverable, meaning a user must be able to move their pointer over the tooltip without it disappearing.
3. They must be dismissable without needing to move the pointer or keyboard focus.

The first two are straightforward, and the `<sui-tooltip>` component fulfills both (as should all content appearing on hover or focus). For dismissable, we found that in usability studies pointer users preferred to use a close button over a keyboard dismissal key, even when both were available. As a result, this tooltip provides a close button as a means to dismiss it for pointer users.

For keyboard users, WCAG recommends using the `Escape` key. However, both conversations with multiple blind screen reader users and the usability study highlighted the problems with using `Escape`. Because tooltips and other hover/focus overlays are not presented to screen reader users as overlays, there is no consistent way to communicate the expectation that `Escape` will perform a different action than usual when a tooltip is present. Additionally, when testing tooltips within modal dialogs, we found that sighted keyboard users and screen reader users explicitly informed about tooltips were unwilling to even try to use the `Escape` key for fear of dismissing the dialog (in the example, `Escape` would not dismiss the dialog if a tooltip was present).

The `Control` key was also tested in the same study as an alternative to `Escape`, and we found it was preferred. The `<sui-tooltip>` example therefore implements the `Control` key to both dismiss and re-show the tooltip. It is still possible there are other keyboard methods that would perform better but were not tested.

## Stencil JS Component

The `<sui-tooltip>` web component accepts the following properties:

<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                              | Type                | Default     |
| ----------- | ------------ | -------------------------------------------------------- | ------------------- | ----------- |
| `content`   | `content`    | Text to show within the tooltip                          | `string`            | `undefined` |
| `position`  | `position`   | Optionally define tooltip position, defaults to "bottom" | `"bottom" \| "top"` | `"bottom"` |
| `tooltipId` | `tooltip-id` | Give the tooltip an id to reference elsewhere            | `string`            | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
