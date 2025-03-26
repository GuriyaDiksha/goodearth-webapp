import React, { useState, useRef, useEffect } from "react";

import { SelectableDropdownMenuProps } from "./typings";

import DropdownMenuItem from "../baseDropdownMenu/components/dropdownMenuItem";
import BaseDropdownMenu from "../baseDropdownMenu";
import {
  DropdownMenuItemProps,
  DropdownItem
} from "../baseDropdownMenu/typings";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { useHistory, useLocation } from "react-router-dom";
import { isAEDDisabled } from "typings/currency";
import { countryCurrencyCode } from "constants/currency";
import CookieService from "services/cookie";

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
  id,
  direction
}: SelectableDropdownMenuProps): JSX.Element => {
  const { isLoading } = useSelector((state: AppState) => state.info);
  const [currentValue, setCurrentValue] = useState(value);
  const mounted = useRef(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    const curCountryCode = CookieService.getCookie("countryCode");
    setTimeout(() => {
      if (isAEDDisabled && curCountryCode != "AE" && value == "AED") {
        setCurrentValue(countryCurrencyCode?.[curCountryCode || "IN"]);
      }
    }, 1000);
  }, []);

  const onChangeValue = (
    val: string | undefined,
    label: string | undefined
  ) => {
    if (isLoading) {
      return false;
    }
    onChange ? onChange(val, label) : "";
    if (onChangeCurrency) {
      onChangeCurrency(val)
        ?.then(() => {
          // setTimeout(() => {
          //   //**** on currency change remove filter querystring from search url ***
          //   const currentPath = location?.pathname;
          //   if (currentPath?.includes("/search")) {
          //     // Split the query string by '&'
          //     const searchParams = location.search.split("&");
          //     // Get the first parameter (the search query)
          //     const cleanedQuery = searchParams[0];
          //     // Construct the cleaned URL
          //     const cleanedUrl = `${currentPath}${cleanedQuery}`;
          //     history.push(cleanedUrl);
          //   }
          //   //**** End *****
          // }, 200);
          setCurrentValue(val);
        })
        .catch(() => {
          setCurrentValue(value);
        });
    } else {
      setCurrentValue(val);
    }
  };
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    }
  }, [currentValue]);

  const getMenuItems = (): JSX.Element[] => {
    return items.map((item: DropdownItem) => {
      const itemProps: DropdownMenuItemProps = {
        label: item.label,
        onClick: e => {
          onChangeValue(item.value, item.label);
        },
        selected: item.value == currentValue,
        type: item.type || "button"
      };
      return (
        <DropdownMenuItem
          id={id}
          key={item.value}
          {...itemProps}
        ></DropdownMenuItem>
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
    id,
    direction
  };
  return (
    <BaseDropdownMenu {...menuProps}>
      <div>{getMenuItems()}</div>
    </BaseDropdownMenu>
  );
};

export default DropdownMenu;
