import React, { useState, useLayoutEffect, useRef, useEffect } from "react";

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
  onChange,
  disabled,
  showCaret
}: SelectableDropdownMenuProps): JSX.Element => {
  const [currentValue, setCurrentValue] = useState(value);
  const mounted = useRef(false);
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const onChangeValue = (val: string | undefined) => {
    setCurrentValue(val);
    onChange ? onChange(val) : "";
  };
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
  }, [currentValue]);
  const getMenuItems = (): JSX.Element[] => {
    return items.map((item: DropdownItem) => {
      const itemProps: DropdownMenuItemProps = {
        label: item.label,
        onClick: () => {
          onChangeValue(item.value);
        },
        selected: item.value == currentValue,
        type: item.type || "button"
      };
      return (
        <DropdownMenuItem key={item.value} {...itemProps}></DropdownMenuItem>
      );
    });
  };

  let display = <span>{currentValue}</span>;
  items.map((item: DropdownItem) => {
    if (item.value == currentValue) {
      display = <span>{item.label}</span>;
    }
  });

  const menuProps = {
    align,
    display,
    open,
    className,
    showCaret,
    disabled
  };
  return (
    <BaseDropdownMenu {...menuProps}>
      <div>{getMenuItems()}</div>
    </BaseDropdownMenu>
  );
};

export default DropdownMenu;
