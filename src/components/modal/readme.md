# Modal

A modal dialog is an overlay that obscures all other page content while it is open. Visually, this is often done with an opaque or semi-transparent backdrop. Programmatically, keyboard focus needs to be prevented from entering background content, and background content must be hidden from the accessibility tree and assistive tech.

## Semantics

On a basic level, a modal must have `role="dialog"` and `aria-modal="true"` set. In order to make the background page content unavailable, there are a couple options: the `inert` attribute or `aria-hidden`. One of those should be on the ancestor of all elements that are not part of the modal itself. The `aria-modal` attribute is supposed to accomplish this on its own, but support is still incomplete.

Here is example markup for a modal dialog (not including background page content):

```html
<div aria-labelledby="dialog-heading" role="dialog" tabIndex="-1">
  <h2 id="dialog-heading">Dialog Title</h2>
  <button type="button">
    <span class="visuallyHidden">close</span>
  </button>
  <div class="dialog-content">
    Dialog content goes here.
  </div>
</div>
```

The dialog is named with `aria-labelledby`, which is necessary here since it is the focus target when opened. Even if the dialog itself were not receiving focus, it should still be given a name.


## Stencil JS Component

The `<sui-modal>` web component accepts the following properties:
<!-- Auto Generated Below -->


### Properties

| Property        | Attribute         | Description                                                          | Type                               | Default     |
| --------------- | ----------------- | -------------------------------------------------------------------- | ---------------------------------- | ----------- |
| `customFocusId` | `custom-focus-id` |                                                                      | `string`                           | `undefined` |
| `describedBy`   | `described-by`    | Optional id to use as descriptive text for the dialog                | `string`                           | `undefined` |
| `focusTarget`   | `focus-target`    | Properties for Usability test case behaviors:                        | `"close" \| "custom" \| "wrapper"` | `undefined` |
| `heading`       | `heading`         | Optionally give the modal a header, also used as the accessible name | `string`                           | `undefined` |
| `open`          | `open`            | Whether the modal is open or closed                                  | `boolean`                          | `false`     |


### Events

| Event   | Description                                     | Type                |
| ------- | ----------------------------------------------- | ------------------- |
| `close` | Emit a custom close event when the modal closes | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
