# Sonder UI
> a collection of tested, accessible components and component pattern documentation.

The purpose of this project is to run usability tests on experimental UI patterns, and showcase the component patterns that have been thoroughly tested for accessibility. Each component's readme will include a description of how it was tested, bugs found, expected functionality, and design considerations for extension or authoring similar patterns.

Each pattern is authored as a web component, and can be dropped directly into a project. However, since this is primarily intended as accessibility documentation + reference implementation, they may not be as fully featured and are not guaranteed to be stable or consistently maintained (translation: don't use this directly in production, but try it out and borrow the patterns you find useful).

Suggestions for additional components to include are very welcome; please file an issue.

## Components
- [Combobox (optionally filterable)](src/components/combobox)
- [Disclosure](src/components/disclosure)
- [Modal](src/components/modal)
- [Multiselect](src/components/multiselect)
- [Select](src/components/select)
- [Tooltip (WIP)](src/components/tooltip)

## Repository Structure

- `src/assets`: Shared assets and sample data.
- `src/components`: Tested, polished components are in here, and each component has its own readme and documentation.
- `src/draft-components`: Experimental patterns live here. There are often multiple variations of the same UI pattern that co-exist for testing.
- `src/shared`: Shared utils used by components in `src/components`.
- `src/studies`: Environments and sample pages used for running usability tests.

## Try it out

To try out the components and usability study environments in this repository, clone it and run the following:

```
npm install
```

then:

```
npm start
```

You should then be able to access the main index at `localhost:3333`, and the usability studies at `localhost:3333/studies`.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
