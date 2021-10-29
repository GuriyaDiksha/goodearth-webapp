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
  onChangeCurrency,
  disabled,
  showCaret,
  id
}: SelectableDropdownMenuProps): JSX.Element => {
  const [currentValue, setCurrentValue] = useState(value);
  const mounted = useRef(false);
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const onChangeValue = (
    val: string | undefined,
    label: string | undefined
  ) => {
    onChange ? onChange(val, label) : "";
    if (onChangeCurrency) {
      onChangeCurrency(val)
        ?.then(() => {
          setCurrentValue(val);
        })
        .catch(() => {
          setCurrentValue(value);
        });
    } else {
      setCurrentValue(val);
    }
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
          onChangeValue(item.value, item.label);
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
    disabled,
    id
  };
  return (
    <BaseDropdownMenu {...menuProps}>
      <div>{getMenuItems()}</div>
    </BaseDropdownMenu>
  );
};

export default DropdownMenu;
