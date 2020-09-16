/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';


import {
  SelectOption,
} from './shared/interfaces';
import {
  SelectOption as SelectOption2,
} from './draft-components/shared/interfaces';
import {
  Column,
} from './draft-components/grid/grid-helpers';
import {
  RowSelectionPattern,
} from './draft-components/grid/row';
import {
  Column as Column2,
} from './draft-components/gridv2/grid-helpers';
import {
  RowSelectionPattern as RowSelectionPattern2,
} from './draft-components/gridv2/row';


export namespace Components {

  interface SuiCombobox {
    /**
    * Whether the combobox should filter based on user input. Defaults to false.
    */
    'filter': boolean;
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface SuiComboboxAttributes extends StencilHTMLAttributes {
    /**
    * Whether the combobox should filter based on user input. Defaults to false.
    */
    'filter'?: boolean;
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface SuiDisclosure {
    /**
    * Optional override to the button's accessible name (using aria-label)
    */
    'buttonLabel': string;
    /**
    * Optionally set the popup region's accessible name using aria-label (recommended)
    */
    'popupLabel': string;
    /**
    * Set the position of the disclosure, defaults to left
    */
    'position': 'left' | 'right';
  }
  interface SuiDisclosureAttributes extends StencilHTMLAttributes {
    /**
    * Optional override to the button's accessible name (using aria-label)
    */
    'buttonLabel'?: string;
    /**
    * Emit a custom close event when the popup closes
    */
    'onClose'?: (event: CustomEvent) => void;
    /**
    * Emit a custom open event when the popup opens
    */
    'onOpen'?: (event: CustomEvent) => void;
    /**
    * Optionally set the popup region's accessible name using aria-label (recommended)
    */
    'popupLabel'?: string;
    /**
    * Set the position of the disclosure, defaults to left
    */
    'position'?: 'left' | 'right';
  }

  interface SuiModal {
    'customFocusId': string;
    /**
    * Optional id to use as descriptive text for the dialog
    */
    'describedBy': string;
    /**
    * Properties for Usability test case behaviors:
    */
    'focusTarget': 'close' | 'wrapper' | 'custom';
    /**
    * Optionally give the modal a header, also used as the accessible name
    */
    'heading': string;
    /**
    * Whether the modal is open or closed
    */
    'open': boolean;
  }
  interface SuiModalAttributes extends StencilHTMLAttributes {
    'customFocusId'?: string;
    /**
    * Optional id to use as descriptive text for the dialog
    */
    'describedBy'?: string;
    /**
    * Properties for Usability test case behaviors:
    */
    'focusTarget'?: 'close' | 'wrapper' | 'custom';
    /**
    * Optionally give the modal a header, also used as the accessible name
    */
    'heading'?: string;
    /**
    * Emit a custom close event when the modal closes
    */
    'onClose'?: (event: CustomEvent) => void;
    /**
    * Whether the modal is open or closed
    */
    'open'?: boolean;
  }

  interface SuiMultiselect {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface SuiMultiselectAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface SuiSelect {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface SuiSelectAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface SuiTooltip {
    /**
    * Text to show within the tooltip
    */
    'content': string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position': 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference from elsewhere
    */
    'tooltipId': string;
  }
  interface SuiTooltipAttributes extends StencilHTMLAttributes {
    /**
    * Text to show within the tooltip
    */
    'content'?: string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position'?: 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference from elsewhere
    */
    'tooltipId'?: string;
  }

  interface ComboAutocomplete {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ComboAutocompleteAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface ComboAutoselect {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ComboAutoselectAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface ComboEleven {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ComboElevenAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface ComboFilter {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ComboFilterAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface ComboNative {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
    /**
    * boolean required
    */
    'required': boolean;
  }
  interface ComboNativeAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
    /**
    * boolean required
    */
    'required'?: boolean;
  }

  interface ComboNofilter {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ComboNofilterAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface ComboNoinput {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ComboNoinputAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface ComboReadonly {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ComboReadonlyAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface ComboTwelve {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ComboTwelveAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface ModalDisclosure {
    /**
    * Optional override to the button's accessible name (using aria-label)
    */
    'buttonLabel': string;
    /**
    * Optionally set the popup region's accessible name using aria-label (recommended)
    */
    'popupLabel': string;
    /**
    * Set the position of the disclosure, defaults to left
    */
    'position': 'left' | 'right';
  }
  interface ModalDisclosureAttributes extends StencilHTMLAttributes {
    /**
    * Optional override to the button's accessible name (using aria-label)
    */
    'buttonLabel'?: string;
    /**
    * Emit a custom close event when the popup closes
    */
    'onClose'?: (event: CustomEvent) => void;
    /**
    * Emit a custom open event when the popup opens
    */
    'onOpen'?: (event: CustomEvent) => void;
    /**
    * Optionally set the popup region's accessible name using aria-label (recommended)
    */
    'popupLabel'?: string;
    /**
    * Set the position of the disclosure, defaults to left
    */
    'position'?: 'left' | 'right';
  }

  interface SuiGrid {
    /**
    * Grid data
    */
    'cells': string[][];
    /**
    * Column definitions
    */
    'columns': Column[];
    /**
    * Caption/description for the grid
    */
    'description': string;
    'editOnClick': boolean;
    /**
    * Properties for Usability test case behaviors: *
    */
    'editable': boolean;
    /**
    * Grid type: grids have controlled focus and fancy behavior, tables are simple static content
    */
    'gridType': 'grid' | 'table';
    'headerActionsMenu': boolean;
    /**
    * String ID of labelling element
    */
    'labelledBy': string;
    /**
    * Number of rows in one "page": used to compute pageUp/pageDown key behavior, and when paging is used
    */
    'pageLength': number;
    /**
    * Custom function to control the render of cell content
    */
    'renderCustomCell': (content: string, colIndex: number, rowIndex: number) => string | HTMLElement;
    'rowSelection': RowSelectionPattern;
    'simpleEditable': boolean;
    /**
    * Index of the column that best labels a row
    */
    'titleColumn': number;
    'useApplicationRole': boolean;
  }
  interface SuiGridAttributes extends StencilHTMLAttributes {
    /**
    * Grid data
    */
    'cells'?: string[][];
    /**
    * Column definitions
    */
    'columns'?: Column[];
    /**
    * Caption/description for the grid
    */
    'description'?: string;
    'editOnClick'?: boolean;
    /**
    * Properties for Usability test case behaviors: *
    */
    'editable'?: boolean;
    /**
    * Grid type: grids have controlled focus and fancy behavior, tables are simple static content
    */
    'gridType'?: 'grid' | 'table';
    'headerActionsMenu'?: boolean;
    /**
    * String ID of labelling element
    */
    'labelledBy'?: string;
    /**
    * Emit a custom edit event when cell content change is submitted
    */
    'onEditCell'?: (event: CustomEvent<{value: string; column: number; row: number;}>) => void;
    /**
    * Emit a custom filter event
    */
    'onFilter'?: (event: CustomEvent) => void;
    /**
    * Emit a custom row selection event
    */
    'onRowSelect'?: (event: CustomEvent) => void;
    /**
    * Number of rows in one "page": used to compute pageUp/pageDown key behavior, and when paging is used
    */
    'pageLength'?: number;
    /**
    * Custom function to control the render of cell content
    */
    'renderCustomCell'?: (content: string, colIndex: number, rowIndex: number) => string | HTMLElement;
    'rowSelection'?: RowSelectionPattern;
    'simpleEditable'?: boolean;
    /**
    * Index of the column that best labels a row
    */
    'titleColumn'?: number;
    'useApplicationRole'?: boolean;
  }

  interface SuiGridNew {
    /**
    * Grid data
    */
    'cells': string[][];
    /**
    * Column definitions
    */
    'columns': Column[];
    /**
    * Caption/description for the grid
    */
    'description': string;
    /**
    * Properties for Usability test case behaviors: *
    */
    'editable': boolean;
    /**
    * Grid type: grids have controlled focus and fancy behavior, tables are simple static content
    */
    'gridType': 'grid' | 'table';
    'headerActionsMenu': boolean;
    /**
    * String ID of labelling element
    */
    'labelledBy': string;
    'modalCell': boolean;
    /**
    * Number of rows in one "page": used to compute pageUp/pageDown key behavior, and when paging is used
    */
    'pageLength': number;
    /**
    * Custom function to control the render of cell content
    */
    'renderCustomCell': (content: string, colIndex: number, rowIndex: number) => string | HTMLElement;
    'rowSelection': RowSelectionPattern;
    /**
    * Index of the column that best labels a row
    */
    'titleColumn': number;
  }
  interface SuiGridNewAttributes extends StencilHTMLAttributes {
    /**
    * Grid data
    */
    'cells'?: string[][];
    /**
    * Column definitions
    */
    'columns'?: Column[];
    /**
    * Caption/description for the grid
    */
    'description'?: string;
    /**
    * Properties for Usability test case behaviors: *
    */
    'editable'?: boolean;
    /**
    * Grid type: grids have controlled focus and fancy behavior, tables are simple static content
    */
    'gridType'?: 'grid' | 'table';
    'headerActionsMenu'?: boolean;
    /**
    * String ID of labelling element
    */
    'labelledBy'?: string;
    'modalCell'?: boolean;
    /**
    * Emit a custom edit event when cell content change is submitted
    */
    'onEditCell'?: (event: CustomEvent<{value: string; column: number; row: number;}>) => void;
    /**
    * Emit a custom filter event
    */
    'onFilter'?: (event: CustomEvent) => void;
    /**
    * Emit a custom row selection event
    */
    'onRowSelect'?: (event: CustomEvent) => void;
    /**
    * Emit a custom stepper value change event
    */
    'onStepperChange'?: (event: CustomEvent<{row: number; value: number}>) => void;
    /**
    * Number of rows in one "page": used to compute pageUp/pageDown key behavior, and when paging is used
    */
    'pageLength'?: number;
    /**
    * Custom function to control the render of cell content
    */
    'renderCustomCell'?: (content: string, colIndex: number, rowIndex: number) => string | HTMLElement;
    'rowSelection'?: RowSelectionPattern;
    /**
    * Index of the column that best labels a row
    */
    'titleColumn'?: number;
  }

  interface ListboxButton {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ListboxButtonAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface ListboxExpand {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface ListboxExpandAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface MultiselectButtons {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface MultiselectButtonsAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface MultiselectCsv {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface MultiselectCsvAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface MultiselectInline {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
  }
  interface MultiselectInlineAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
  }

  interface MultiselectNative {
    /**
    * String label
    */
    'label': string;
    /**
    * Array of name/value options
    */
    'options': SelectOption[];
    /**
    * boolean required
    */
    'required': boolean;
  }
  interface MultiselectNativeAttributes extends StencilHTMLAttributes {
    /**
    * String label
    */
    'label'?: string;
    /**
    * Emit a custom select event on value change
    */
    'onSelect'?: (event: CustomEvent) => void;
    /**
    * Array of name/value options
    */
    'options'?: SelectOption[];
    /**
    * boolean required
    */
    'required'?: boolean;
  }

  interface SplitButton {
    /**
    * (Optional) pass a string to be the primary button id
    */
    'buttonId': string;
    /**
    * Optionally override the component's tabindex
    */
    'customTabIndex': 0 | 1;
    /**
    * Set to true if the button is within a compound widget like a toolbar or menu (changes arrow key behavior)
    */
    'inCompoundGroup': boolean;
    /**
    * Set the keyboard behavior of the splitbutton to be one tab/arrow stop or two (defaults to 2)
    */
    'isCompoundButton': boolean;
    /**
    * Set the accessible name for the button that opens the menu (recommended)
    */
    'menuButtonLabel': string;
    /**
    * Array of menu actions
    */
    'menuItems': any[];
    /**
    * (Optional) set pressed to make the primary button into a toggle button
    */
    'pressed': boolean;
    /**
    * Optional custom render function for menu items (defaults to the menuItem string)
    */
    'renderMenuItem': (menItem: any) => string;
  }
  interface SplitButtonAttributes extends StencilHTMLAttributes {
    /**
    * (Optional) pass a string to be the primary button id
    */
    'buttonId'?: string;
    /**
    * Optionally override the component's tabindex
    */
    'customTabIndex'?: 0 | 1;
    /**
    * Set to true if the button is within a compound widget like a toolbar or menu (changes arrow key behavior)
    */
    'inCompoundGroup'?: boolean;
    /**
    * Set the keyboard behavior of the splitbutton to be one tab/arrow stop or two (defaults to 2)
    */
    'isCompoundButton'?: boolean;
    /**
    * Set the accessible name for the button that opens the menu (recommended)
    */
    'menuButtonLabel'?: string;
    /**
    * Array of menu actions
    */
    'menuItems'?: any[];
    /**
    * Emit a custom event when a menu item is clicked
    */
    'onMenuAction'?: (event: CustomEvent) => void;
    /**
    * Emit a custom event when a menu item is clicked
    */
    'onPrimaryAction'?: (event: CustomEvent) => void;
    /**
    * (Optional) set pressed to make the primary button into a toggle button
    */
    'pressed'?: boolean;
    /**
    * Optional custom render function for menu items (defaults to the menuItem string)
    */
    'renderMenuItem'?: (menItem: any) => string;
  }

  interface SuiToolbar {
    /**
    * Array of CSS selectors for toolbar actions
    */
    'menuItems': string[];
    /**
    * Set the accessible name for the button that opens the menu (recommended)
    */
    'toolbarLabel': string;
  }
  interface SuiToolbarAttributes extends StencilHTMLAttributes {
    /**
    * Array of CSS selectors for toolbar actions
    */
    'menuItems'?: string[];
    /**
    * Set the accessible name for the button that opens the menu (recommended)
    */
    'toolbarLabel'?: string;
  }

  interface SuiTooltipArrow {
    /**
    * Text to show within the tooltip
    */
    'content': string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position': 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference elsewhere
    */
    'tooltipId': string;
    /**
    * Custom width style, as a string including units
    */
    'width': string;
  }
  interface SuiTooltipArrowAttributes extends StencilHTMLAttributes {
    /**
    * Text to show within the tooltip
    */
    'content'?: string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position'?: 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference elsewhere
    */
    'tooltipId'?: string;
    /**
    * Custom width style, as a string including units
    */
    'width'?: string;
  }

  interface SuiTooltipControl {
    /**
    * Text to show within the tooltip
    */
    'content': string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position': 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference elsewhere
    */
    'tooltipId': string;
    /**
    * Custom width style, as a string including units
    */
    'width': string;
  }
  interface SuiTooltipControlAttributes extends StencilHTMLAttributes {
    /**
    * Text to show within the tooltip
    */
    'content'?: string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position'?: 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference elsewhere
    */
    'tooltipId'?: string;
    /**
    * Custom width style, as a string including units
    */
    'width'?: string;
  }

  interface SuiTooltipCorner {
    /**
    * Text to show within the tooltip
    */
    'content': string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position': 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference elsewhere
    */
    'tooltipId': string;
    /**
    * Custom width style, as a string including units
    */
    'width': string;
  }
  interface SuiTooltipCornerAttributes extends StencilHTMLAttributes {
    /**
    * Text to show within the tooltip
    */
    'content'?: string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position'?: 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference elsewhere
    */
    'tooltipId'?: string;
    /**
    * Custom width style, as a string including units
    */
    'width'?: string;
  }

  interface SuiTooltipEscape {
    /**
    * Optional selector to attach parent key events. Defaults to document
    */
    'containerSelector': string;
    /**
    * Text to show within the tooltip
    */
    'content': string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position': 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference elsewhere
    */
    'tooltipId': string;
    /**
    * Custom width style, as a string including units
    */
    'width': string;
  }
  interface SuiTooltipEscapeAttributes extends StencilHTMLAttributes {
    /**
    * Optional selector to attach parent key events. Defaults to document
    */
    'containerSelector'?: string;
    /**
    * Text to show within the tooltip
    */
    'content'?: string;
    /**
    * Optionally define tooltip position, defaults to "bottom"
    */
    'position'?: 'top' | 'bottom';
    /**
    * Give the tooltip an id to reference elsewhere
    */
    'tooltipId'?: string;
    /**
    * Custom width style, as a string including units
    */
    'width'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'SuiCombobox': Components.SuiCombobox;
    'SuiDisclosure': Components.SuiDisclosure;
    'SuiModal': Components.SuiModal;
    'SuiMultiselect': Components.SuiMultiselect;
    'SuiSelect': Components.SuiSelect;
    'SuiTooltip': Components.SuiTooltip;
    'ComboAutocomplete': Components.ComboAutocomplete;
    'ComboAutoselect': Components.ComboAutoselect;
    'ComboEleven': Components.ComboEleven;
    'ComboFilter': Components.ComboFilter;
    'ComboNative': Components.ComboNative;
    'ComboNofilter': Components.ComboNofilter;
    'ComboNoinput': Components.ComboNoinput;
    'ComboReadonly': Components.ComboReadonly;
    'ComboTwelve': Components.ComboTwelve;
    'ModalDisclosure': Components.ModalDisclosure;
    'SuiGrid': Components.SuiGrid;
    'SuiGridNew': Components.SuiGridNew;
    'ListboxButton': Components.ListboxButton;
    'ListboxExpand': Components.ListboxExpand;
    'MultiselectButtons': Components.MultiselectButtons;
    'MultiselectCsv': Components.MultiselectCsv;
    'MultiselectInline': Components.MultiselectInline;
    'MultiselectNative': Components.MultiselectNative;
    'SplitButton': Components.SplitButton;
    'SuiToolbar': Components.SuiToolbar;
    'SuiTooltipArrow': Components.SuiTooltipArrow;
    'SuiTooltipControl': Components.SuiTooltipControl;
    'SuiTooltipCorner': Components.SuiTooltipCorner;
    'SuiTooltipEscape': Components.SuiTooltipEscape;
  }

  interface StencilIntrinsicElements {
    'sui-combobox': Components.SuiComboboxAttributes;
    'sui-disclosure': Components.SuiDisclosureAttributes;
    'sui-modal': Components.SuiModalAttributes;
    'sui-multiselect': Components.SuiMultiselectAttributes;
    'sui-select': Components.SuiSelectAttributes;
    'sui-tooltip': Components.SuiTooltipAttributes;
    'combo-autocomplete': Components.ComboAutocompleteAttributes;
    'combo-autoselect': Components.ComboAutoselectAttributes;
    'combo-eleven': Components.ComboElevenAttributes;
    'combo-filter': Components.ComboFilterAttributes;
    'combo-native': Components.ComboNativeAttributes;
    'combo-nofilter': Components.ComboNofilterAttributes;
    'combo-noinput': Components.ComboNoinputAttributes;
    'combo-readonly': Components.ComboReadonlyAttributes;
    'combo-twelve': Components.ComboTwelveAttributes;
    'modal-disclosure': Components.ModalDisclosureAttributes;
    'sui-grid': Components.SuiGridAttributes;
    'sui-grid-new': Components.SuiGridNewAttributes;
    'listbox-button': Components.ListboxButtonAttributes;
    'listbox-expand': Components.ListboxExpandAttributes;
    'multiselect-buttons': Components.MultiselectButtonsAttributes;
    'multiselect-csv': Components.MultiselectCsvAttributes;
    'multiselect-inline': Components.MultiselectInlineAttributes;
    'multiselect-native': Components.MultiselectNativeAttributes;
    'split-button': Components.SplitButtonAttributes;
    'sui-toolbar': Components.SuiToolbarAttributes;
    'sui-tooltip-arrow': Components.SuiTooltipArrowAttributes;
    'sui-tooltip-control': Components.SuiTooltipControlAttributes;
    'sui-tooltip-corner': Components.SuiTooltipCornerAttributes;
    'sui-tooltip-escape': Components.SuiTooltipEscapeAttributes;
  }


  interface HTMLSuiComboboxElement extends Components.SuiCombobox, HTMLStencilElement {}
  var HTMLSuiComboboxElement: {
    prototype: HTMLSuiComboboxElement;
    new (): HTMLSuiComboboxElement;
  };

  interface HTMLSuiDisclosureElement extends Components.SuiDisclosure, HTMLStencilElement {}
  var HTMLSuiDisclosureElement: {
    prototype: HTMLSuiDisclosureElement;
    new (): HTMLSuiDisclosureElement;
  };

  interface HTMLSuiModalElement extends Components.SuiModal, HTMLStencilElement {}
  var HTMLSuiModalElement: {
    prototype: HTMLSuiModalElement;
    new (): HTMLSuiModalElement;
  };

  interface HTMLSuiMultiselectElement extends Components.SuiMultiselect, HTMLStencilElement {}
  var HTMLSuiMultiselectElement: {
    prototype: HTMLSuiMultiselectElement;
    new (): HTMLSuiMultiselectElement;
  };

  interface HTMLSuiSelectElement extends Components.SuiSelect, HTMLStencilElement {}
  var HTMLSuiSelectElement: {
    prototype: HTMLSuiSelectElement;
    new (): HTMLSuiSelectElement;
  };

  interface HTMLSuiTooltipElement extends Components.SuiTooltip, HTMLStencilElement {}
  var HTMLSuiTooltipElement: {
    prototype: HTMLSuiTooltipElement;
    new (): HTMLSuiTooltipElement;
  };

  interface HTMLComboAutocompleteElement extends Components.ComboAutocomplete, HTMLStencilElement {}
  var HTMLComboAutocompleteElement: {
    prototype: HTMLComboAutocompleteElement;
    new (): HTMLComboAutocompleteElement;
  };

  interface HTMLComboAutoselectElement extends Components.ComboAutoselect, HTMLStencilElement {}
  var HTMLComboAutoselectElement: {
    prototype: HTMLComboAutoselectElement;
    new (): HTMLComboAutoselectElement;
  };

  interface HTMLComboElevenElement extends Components.ComboEleven, HTMLStencilElement {}
  var HTMLComboElevenElement: {
    prototype: HTMLComboElevenElement;
    new (): HTMLComboElevenElement;
  };

  interface HTMLComboFilterElement extends Components.ComboFilter, HTMLStencilElement {}
  var HTMLComboFilterElement: {
    prototype: HTMLComboFilterElement;
    new (): HTMLComboFilterElement;
  };

  interface HTMLComboNativeElement extends Components.ComboNative, HTMLStencilElement {}
  var HTMLComboNativeElement: {
    prototype: HTMLComboNativeElement;
    new (): HTMLComboNativeElement;
  };

  interface HTMLComboNofilterElement extends Components.ComboNofilter, HTMLStencilElement {}
  var HTMLComboNofilterElement: {
    prototype: HTMLComboNofilterElement;
    new (): HTMLComboNofilterElement;
  };

  interface HTMLComboNoinputElement extends Components.ComboNoinput, HTMLStencilElement {}
  var HTMLComboNoinputElement: {
    prototype: HTMLComboNoinputElement;
    new (): HTMLComboNoinputElement;
  };

  interface HTMLComboReadonlyElement extends Components.ComboReadonly, HTMLStencilElement {}
  var HTMLComboReadonlyElement: {
    prototype: HTMLComboReadonlyElement;
    new (): HTMLComboReadonlyElement;
  };

  interface HTMLComboTwelveElement extends Components.ComboTwelve, HTMLStencilElement {}
  var HTMLComboTwelveElement: {
    prototype: HTMLComboTwelveElement;
    new (): HTMLComboTwelveElement;
  };

  interface HTMLModalDisclosureElement extends Components.ModalDisclosure, HTMLStencilElement {}
  var HTMLModalDisclosureElement: {
    prototype: HTMLModalDisclosureElement;
    new (): HTMLModalDisclosureElement;
  };

  interface HTMLSuiGridElement extends Components.SuiGrid, HTMLStencilElement {}
  var HTMLSuiGridElement: {
    prototype: HTMLSuiGridElement;
    new (): HTMLSuiGridElement;
  };

  interface HTMLSuiGridNewElement extends Components.SuiGridNew, HTMLStencilElement {}
  var HTMLSuiGridNewElement: {
    prototype: HTMLSuiGridNewElement;
    new (): HTMLSuiGridNewElement;
  };

  interface HTMLListboxButtonElement extends Components.ListboxButton, HTMLStencilElement {}
  var HTMLListboxButtonElement: {
    prototype: HTMLListboxButtonElement;
    new (): HTMLListboxButtonElement;
  };

  interface HTMLListboxExpandElement extends Components.ListboxExpand, HTMLStencilElement {}
  var HTMLListboxExpandElement: {
    prototype: HTMLListboxExpandElement;
    new (): HTMLListboxExpandElement;
  };

  interface HTMLMultiselectButtonsElement extends Components.MultiselectButtons, HTMLStencilElement {}
  var HTMLMultiselectButtonsElement: {
    prototype: HTMLMultiselectButtonsElement;
    new (): HTMLMultiselectButtonsElement;
  };

  interface HTMLMultiselectCsvElement extends Components.MultiselectCsv, HTMLStencilElement {}
  var HTMLMultiselectCsvElement: {
    prototype: HTMLMultiselectCsvElement;
    new (): HTMLMultiselectCsvElement;
  };

  interface HTMLMultiselectInlineElement extends Components.MultiselectInline, HTMLStencilElement {}
  var HTMLMultiselectInlineElement: {
    prototype: HTMLMultiselectInlineElement;
    new (): HTMLMultiselectInlineElement;
  };

  interface HTMLMultiselectNativeElement extends Components.MultiselectNative, HTMLStencilElement {}
  var HTMLMultiselectNativeElement: {
    prototype: HTMLMultiselectNativeElement;
    new (): HTMLMultiselectNativeElement;
  };

  interface HTMLSplitButtonElement extends Components.SplitButton, HTMLStencilElement {}
  var HTMLSplitButtonElement: {
    prototype: HTMLSplitButtonElement;
    new (): HTMLSplitButtonElement;
  };

  interface HTMLSuiToolbarElement extends Components.SuiToolbar, HTMLStencilElement {}
  var HTMLSuiToolbarElement: {
    prototype: HTMLSuiToolbarElement;
    new (): HTMLSuiToolbarElement;
  };

  interface HTMLSuiTooltipArrowElement extends Components.SuiTooltipArrow, HTMLStencilElement {}
  var HTMLSuiTooltipArrowElement: {
    prototype: HTMLSuiTooltipArrowElement;
    new (): HTMLSuiTooltipArrowElement;
  };

  interface HTMLSuiTooltipControlElement extends Components.SuiTooltipControl, HTMLStencilElement {}
  var HTMLSuiTooltipControlElement: {
    prototype: HTMLSuiTooltipControlElement;
    new (): HTMLSuiTooltipControlElement;
  };

  interface HTMLSuiTooltipCornerElement extends Components.SuiTooltipCorner, HTMLStencilElement {}
  var HTMLSuiTooltipCornerElement: {
    prototype: HTMLSuiTooltipCornerElement;
    new (): HTMLSuiTooltipCornerElement;
  };

  interface HTMLSuiTooltipEscapeElement extends Components.SuiTooltipEscape, HTMLStencilElement {}
  var HTMLSuiTooltipEscapeElement: {
    prototype: HTMLSuiTooltipEscapeElement;
    new (): HTMLSuiTooltipEscapeElement;
  };

  interface HTMLElementTagNameMap {
    'sui-combobox': HTMLSuiComboboxElement
    'sui-disclosure': HTMLSuiDisclosureElement
    'sui-modal': HTMLSuiModalElement
    'sui-multiselect': HTMLSuiMultiselectElement
    'sui-select': HTMLSuiSelectElement
    'sui-tooltip': HTMLSuiTooltipElement
    'combo-autocomplete': HTMLComboAutocompleteElement
    'combo-autoselect': HTMLComboAutoselectElement
    'combo-eleven': HTMLComboElevenElement
    'combo-filter': HTMLComboFilterElement
    'combo-native': HTMLComboNativeElement
    'combo-nofilter': HTMLComboNofilterElement
    'combo-noinput': HTMLComboNoinputElement
    'combo-readonly': HTMLComboReadonlyElement
    'combo-twelve': HTMLComboTwelveElement
    'modal-disclosure': HTMLModalDisclosureElement
    'sui-grid': HTMLSuiGridElement
    'sui-grid-new': HTMLSuiGridNewElement
    'listbox-button': HTMLListboxButtonElement
    'listbox-expand': HTMLListboxExpandElement
    'multiselect-buttons': HTMLMultiselectButtonsElement
    'multiselect-csv': HTMLMultiselectCsvElement
    'multiselect-inline': HTMLMultiselectInlineElement
    'multiselect-native': HTMLMultiselectNativeElement
    'split-button': HTMLSplitButtonElement
    'sui-toolbar': HTMLSuiToolbarElement
    'sui-tooltip-arrow': HTMLSuiTooltipArrowElement
    'sui-tooltip-control': HTMLSuiTooltipControlElement
    'sui-tooltip-corner': HTMLSuiTooltipCornerElement
    'sui-tooltip-escape': HTMLSuiTooltipEscapeElement
  }

  interface ElementTagNameMap {
    'sui-combobox': HTMLSuiComboboxElement;
    'sui-disclosure': HTMLSuiDisclosureElement;
    'sui-modal': HTMLSuiModalElement;
    'sui-multiselect': HTMLSuiMultiselectElement;
    'sui-select': HTMLSuiSelectElement;
    'sui-tooltip': HTMLSuiTooltipElement;
    'combo-autocomplete': HTMLComboAutocompleteElement;
    'combo-autoselect': HTMLComboAutoselectElement;
    'combo-eleven': HTMLComboElevenElement;
    'combo-filter': HTMLComboFilterElement;
    'combo-native': HTMLComboNativeElement;
    'combo-nofilter': HTMLComboNofilterElement;
    'combo-noinput': HTMLComboNoinputElement;
    'combo-readonly': HTMLComboReadonlyElement;
    'combo-twelve': HTMLComboTwelveElement;
    'modal-disclosure': HTMLModalDisclosureElement;
    'sui-grid': HTMLSuiGridElement;
    'sui-grid-new': HTMLSuiGridNewElement;
    'listbox-button': HTMLListboxButtonElement;
    'listbox-expand': HTMLListboxExpandElement;
    'multiselect-buttons': HTMLMultiselectButtonsElement;
    'multiselect-csv': HTMLMultiselectCsvElement;
    'multiselect-inline': HTMLMultiselectInlineElement;
    'multiselect-native': HTMLMultiselectNativeElement;
    'split-button': HTMLSplitButtonElement;
    'sui-toolbar': HTMLSuiToolbarElement;
    'sui-tooltip-arrow': HTMLSuiTooltipArrowElement;
    'sui-tooltip-control': HTMLSuiTooltipControlElement;
    'sui-tooltip-corner': HTMLSuiTooltipCornerElement;
    'sui-tooltip-escape': HTMLSuiTooltipEscapeElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
