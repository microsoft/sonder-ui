# Modal



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description                                                          | Type                               | Default     |
| --------------- | ----------------- | -------------------------------------------------------------------- | ---------------------------------- | ----------- |
| `customFocusId` | `custom-focus-id` |                                                                      | `string`                           | `undefined` |
| `describedBy`   | `described-by`    | Optional id to use as descriptive text for the dialog                | `string`                           | `undefined` |
| `focusTarget`   | `focus-target`    | Properties for Usability test case behaviors:                        | `"close" \| "custom" \| "wrapper"` | `undefined` |
| `heading`       | `heading`         | Optionally give the modal a header, also used as the accessible name | `string`                           | `undefined` |
| `open`          | `open`            | Whether the modal is open or closed                                  | `boolean`                          | `false`     |


## Events

| Event   | Description                                     | Type                |
| ------- | ----------------------------------------------- | ------------------- |
| `close` | Emit a custom close event when the modal closes | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
