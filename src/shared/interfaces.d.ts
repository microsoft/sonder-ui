export interface SelectOption {
  name: string;
  value: string;
}

export interface TreeItem {
  name: string;
  onClick: any,
  children: TreeItem[];
}
