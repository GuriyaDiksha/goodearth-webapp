import { BaseDropdownMenuProps } from "../baseDropdownMenu/typings";
import { DropdownItem } from "../baseDropdownMenu/typings";

export type DropdownMenuProps = BaseDropdownMenuProps & {
  items: DropdownItem[];
  display: JSX.Element | string;
};
