type MenuItemType = "link" | "button";

export type DropdownMenuItemProps = {
  className?: string;
  children?: JSX.Element | JSX.Element[];
  label?: string;
  onClick?: (event: React.MouseEvent) => void;
  href?: string;
  value?: string;
  selected?: boolean;
  type: MenuItemType;
};

export type DropdownItem = {
  label: string;
  onClick?: (event: React.MouseEvent) => void;
  type?: MenuItemType;
  href?: string;
  value?: string;
};

export type BaseDropdownMenuProps = {
  className?: string;
  children?: JSX.Element | JSX.Element[];
  display?: JSX.Element | string;
  align: "left" | "right";
  open?: boolean;
  hideSelected?: boolean;
  icon?: string;
  showCaret?: boolean;
  disabled?: boolean;
  id: string;
};

export type DropdownMenuState = {
  open: boolean;
};
