import { BaseDropdownMenuProps } from "../baseDropdownMenu/typings";
import { DropdownItem } from "../baseDropdownMenu/typings";

export type SelectableDropdownMenuProps = BaseDropdownMenuProps & {
  items: DropdownItem[];
  value?: string;
  onChange?: (value?: string) => void;
};
