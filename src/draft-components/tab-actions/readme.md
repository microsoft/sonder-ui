# Tabs

A [tab widget](https://w3c.github.io/aria-practices/#tabpanel) is a series of tab buttons with managed focus that control the display of a content panel.

This component has not been through a usability study, it was created as a utility for other unrelated usability studies.

## Stencil JS Component

The `<sui-tabs>` web component supports the following properties and events:

<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                    | Type                    | Default     |
| ------------- | -------------- | ---------------------------------------------------------------------------------------------- | ----------------------- | ----------- |
| `closeButton` | `close-button` | Prop for support testing only: whether the tabs should be closeable + location of close button | `"inside" \| "outside"` | `undefined` |
| `contentIds`  | --             | Array of ids that point to tab content. These should correspond to the array of tabs.          | `string[]`              | `undefined` |
| `initialTab`  | `initial-tab`  | Optionally control which tab should be displayed on load (defaults to the first tab)           | `number`                | `undefined` |
| `tabs`        | --             | Array of tabs                                                                                  | `string[]`              | `undefined` |


## Events

| Event       | Description                                   | Type                |
| ----------- | --------------------------------------------- | ------------------- |
| `tabChange` | Emit a custom open event when the popup opens | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
