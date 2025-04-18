import React from "react";

import { DropdownMenuProps } from "./typings";
// import styles from "./styles.scss"

import DropdownMenuItem from "../baseDropdownMenu/components/dropdownMenuItem";
import BaseDropdownMenu from "../baseDropdownMenu";
import { DropdownMenuItemProps } from "../baseDropdownMenu/typings";

const DropdownMenu = ({
  align,
  display,
  open,
  className,
  children,
  items,
  disabled,
  id,
  onDropDownMenuClick
}: DropdownMenuProps): JSX.Element => {
  const getMenuItems = (): JSX.Element[] => {
    return items.map(item => {
      const itemProps: DropdownMenuItemProps = {
        href: item.href,
        label: item.label,
        onClick: (e: React.MouseEvent<Element, MouseEvent>) => {
          onDropDownMenuClick?.("Profile Item");
          item.onClick?.(e);
        },
        type: item.type || "link"
      };
      return (
        <DropdownMenuItem
          id={id}
          key={item.value || item.href}
          {...itemProps}
        ></DropdownMenuItem>
      );
    });
  };

  const menuProps = {
    align,
    display,
    open,
    className,
    disabled,
    id
  };
  return <BaseDropdownMenu {...menuProps}>{getMenuItems()}</BaseDropdownMenu>;
};

export default DropdownMenu;
