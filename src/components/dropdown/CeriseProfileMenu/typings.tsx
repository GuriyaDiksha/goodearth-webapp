import { BaseDropdownMenuProps } from "../baseDropdownMenu/typings";
import { DropdownItem } from "../baseDropdownMenu/typings";

export type CeriseProfileMenuProps = BaseDropdownMenuProps & {
  items: DropdownItem[];
  display: JSX.Element | string;
  onDropDownMenuClick?: (clickType: string) => void;
  id: string;
};
