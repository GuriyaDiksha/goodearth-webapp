import { BaseDropdownMenuProps } from "../baseDropdownMenu/typings";
import { DropdownItem } from "../baseDropdownMenu/typings";

export type SelectableDropdownMenuProps = BaseDropdownMenuProps & {
  items: DropdownItem[];
  value?: string;
  icon?: string;
  showCaret?: boolean;
  onChange?: (value?: string, label?: string) => void;
  onChangeCurrency?: (value?: string) => Promise<void> | undefined;
  direction?: "up" | "down" | undefined;
  id: string;
};
