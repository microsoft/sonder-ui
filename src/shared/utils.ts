/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT license. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { SelectOption } from './interfaces';

export enum Keys {
  Backspace = 'Backspace',
  Clear = 'Clear',
  Down = 'ArrowDown',
  End = 'End',
  Enter = 'Enter',
  Escape = 'Escape',
  Home = 'Home',
  Left = 'ArrowLeft',
  PageDown = 'PageDown',
  PageUp = 'PageUp',
  Right = 'ArrowRight',
  Space = ' ',
  Tab = 'Tab',
  Up = 'ArrowUp'
}

export enum MenuActions {
  Close,
  CloseSelect,
  First,
  Last,
  Next,
  Open,
  PageDown,
  PageUp,
  Previous,
  Select,
  Space,
  Type
}

// filter an array of options against an input string
// returns an array of options that begin with the filter string, case-independent
export function filterOptions(options: SelectOption[] = [], filter: string, exclude: SelectOption[] = []): SelectOption[] {
  let filterString = filter.toLowerCase().trim();
  return options.filter((option) => {
    const matches = option.name.toLowerCase().indexOf(filterString) === 0;
    return matches && exclude.indexOf(option) < 0;
  });
}

// return an array of exact option name matches from a comma-separated string
export function findMatches(options: SelectOption[], search: string): SelectOption[] {
  const names = search.split(',');
  return names.map((name) => {
    const match = options.filter((option) => name.trim().toLowerCase() === option.name.toLowerCase());
    return match.length > 0 ? match[0] : null;
  })
  .filter((option) => option !== null);
}

// return combobox action from key press
export function getActionFromKey(event: KeyboardEvent, menuOpen: boolean): MenuActions {
  const { key, altKey, ctrlKey, metaKey } = event;
  const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Home', 'End']; // all keys that will open the combo

  // handle opening when closed
  if (!menuOpen && openKeys.includes(key)) {
    return MenuActions.Open;
  }

  // handle typing characters when open or closed
  if (key === Keys.Backspace || key === Keys.Clear || (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)) {
    return MenuActions.Type;
  }

  // handle keys when open
  if (menuOpen) {
    if (key === Keys.Down && !altKey || key === Keys.Right) {
      return MenuActions.Next;
    }
    else if (key === Keys.Up && altKey) {
      return MenuActions.CloseSelect;
    }
    else if (key === Keys.Up || key === Keys.Left) {
      return MenuActions.Previous;
    }
    else if (key === Keys.Home) {
      return MenuActions.First;
    }
    else if (key === Keys.End) {
      return MenuActions.Last;
    }
    else if (key === Keys.PageUp) {
      return MenuActions.PageUp;
    }
    else if (key === Keys.PageDown) {
      return MenuActions.PageDown;
    }
    else if (key === Keys.Escape) {
      return MenuActions.Close;
    }
    else if (key === Keys.Enter) {
      return MenuActions.CloseSelect;
    }
    else if (key === Keys.Space) {
      return MenuActions.Space;
    }
  }
}

// return the index of an option from an array of options, based on a search string
// if the filter is multiple iterations of the same letter (e.g "aaa"), then cycle through first-letter matches
export function getIndexByLetter(options: SelectOption[], filter: string, startIndex = 0): number {
  const orderedOptions = [...options.slice(startIndex), ...options.slice(0, startIndex)];
  const firstMatch = filterOptions(orderedOptions, filter)[0];
  const allSameLetter = (array) => array.every((letter) => letter === array[0]);
  
  // first check if there is an exact match for the typed string
  if (firstMatch) {
    return options.indexOf(firstMatch);
  }

  // if the same letter is being repeated, cycle through first-letter matches
  else if (allSameLetter(filter.split(''))) {
    const matches = filterOptions(orderedOptions, filter[0]);
    return options.indexOf(matches[0]);
  }

  // if no matches, return -1
  else {
    return -1;
  }
}

// get updated option index
export function getUpdatedIndex(current: number, max: number, action: MenuActions): number {
  switch(action) {
    case MenuActions.First:
      return 0;
    case MenuActions.Last:
      return max;
    case MenuActions.Previous:
      return Math.max(0, current - 1);
    case MenuActions.Next:
      return Math.min(max, current + 1);
    default:
      return current;
  }
}

// check if an element is currently scrollable
export function isScrollable(element: HTMLElement): boolean {
  return element && element.clientHeight < element.scrollHeight;
}

// ensure given child element is within the parent's visible scroll area
export function maintainScrollVisibility(activeElement: HTMLElement, scrollParent: HTMLElement) {
  const { offsetHeight, offsetTop } = activeElement;
  const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

  const isAbove = offsetTop < scrollTop;
  const isBelow = (offsetTop + offsetHeight) > (scrollTop + parentOffsetHeight);

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop);
  }
  else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
  }
}

// generate unique ID, the quick 'n dirty way
let idIndex = 0;
export function uniqueId() {
  return `sui-${++idIndex}`;
}