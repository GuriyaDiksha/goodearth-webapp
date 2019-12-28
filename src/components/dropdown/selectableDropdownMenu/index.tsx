import React, { useState, useLayoutEffect, useRef } from "react";

import { SelectableDropdownMenuProps } from "./typings";

import DropdownMenuItem from "../baseDropdownMenu/components/dropdownMenuItem";
import BaseDropdownMenu from "../baseDropdownMenu";
import {
  DropdownMenuItemProps,
  DropdownItem
} from "../baseDropdownMenu/typings";

const DropdownMenu = ({
  align,
  open,
  className,
  value,
  items,
  onChange
}: SelectableDropdownMenuProps): JSX.Element => {
  const [currentValue, setCurrentValue] = useState(value);

  const mounted = useRef(false);
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else if (onChange) {
      onChange(currentValue);
    }
  }, [currentValue]);
  const getMenuItems = (): JSX.Element[] => {
    return items.map((item: DropdownItem) => {
      const itemProps: DropdownMenuItemProps = {
        label: item.label,
        onClick: () => {
          setCurrentValue(item.value);
        },
        selected: item.value == currentValue,
        type: item.type || "button"
      };
      return (
        <DropdownMenuItem key={item.value} {...itemProps}></DropdownMenuItem>
      );
    });
  };

  const display = <span>{currentValue}</span>;
  const menuProps = {
    align,
    display,
    open,
    className
  };
  return <BaseDropdownMenu {...menuProps}>{getMenuItems()}</BaseDropdownMenu>;
};

export default DropdownMenu;
