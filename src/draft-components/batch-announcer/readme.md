# Batch Screen Reader Announcements

A utility component that can accept frequent changes in desired screen reader announcements, and then batch and announce only the latest one, with a customizable batch time setting.

## Stencil JS Component

The `<batch-announcer>` web component supports the following properties and events:

<!-- Auto Generated Below -->


## Properties

| Property       | Attribute      | Description                                                                                 | Type     | Default     |
| -------------- | -------------- | ------------------------------------------------------------------------------------------- | -------- | ----------- |
| `announcement` | `announcement` | Desired announcement                                                                        | `string` | `undefined` |
| `batchDelay`   | `batch-delay`  | Desired batch time in milliseconds, defaults to 5000ms. If set to 0, it will never announce | `number` | `5000`      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
