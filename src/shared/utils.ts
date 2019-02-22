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
  Up = 'ArrowLeft'
}

export enum MenuActions {
  Close,
  CloseSelect,
  First,
  Last,
  Next,
  Open,
  Previous,
  Select,
  Type
}

// filter an array of options against an input string
// returns an array of options that begin with the filter string, case-independent
export function filterOptions(options: SelectOption[], filter: string, exclude: SelectOption[] = []): SelectOption[] {
  return options.filter((option) => {
    const matches = option.name.toLowerCase().indexOf(filter.toLowerCase()) === 0;
    return matches && exclude.indexOf(option) < 0;
  });
}

// return an array of exact option name matches from a comma-separated string
export function findMatches(options: SelectOption[], search: string): SelectOption[] {
  const names = search.split(',');
  return options
    .map((option) => {
      const match = names.filter((name) => name.trim().toLowerCase() === option.name.toLowerCase());
      return match.length > 0 ? option : null;
    })
    .filter((option) => option !== null);
}

// return combobox action from key press
export function getActionFromKey(key: string, menuOpen: boolean): MenuActions {
  // handle opening when closed
  if (!menuOpen && key === Keys.Down) {
    return MenuActions.Open;
  }

  // handle keys when open
  if (key === 'ArrowDown') {
    return MenuActions.Next;
  }
  else if (key === 'ArrowUp') {
    return MenuActions.Previous;
  }
  else if (key === 'Home') {
    return MenuActions.First;
  }
  else if (key === 'End') {
    return MenuActions.Last;
  }
  else if (key === Keys.Escape) {
    return MenuActions.Close;
  }
  else if (key === Keys.Enter ) {
    return MenuActions.CloseSelect;
  }
  else if (key === Keys.Backspace || key === Keys.Clear || key.length === 1) {
    return MenuActions.Type;
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

// generate unique ID, the quick 'n dirty way
let idIndex = 0;
export function uniqueId() {
  return `combo-${++idIndex}`;
}