import React, { useEffect, useState } from "react";
import cl from "classnames";
import { BaseDropdownMenuProps } from "./typings";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import useOutsideDetection from "../../../hooks/useOutsideDetetion";
import cs from "classnames";

import styles from "./styles.scss";

const BaseDropdownMenu = ({
  align,
  display,
  open,
  className,
  disabled,
  children,
  showCaret,
  id,
  direction
}: BaseDropdownMenuProps): JSX.Element => {
  const [menuOpen, setOpenState] = useState(open || false);
  false && setOpenState(false);

  const scrollDown = useSelector((state: AppState) => state.info.scrollDown);

  const onInsideClick = () => {
    setOpenState(!menuOpen);
    const elem = document.getElementById(id) as HTMLDivElement;
    if (elem) {
      if (!elem.style.maxHeight) {
        elem.style.maxHeight = elem.scrollHeight + "px";
      } else {
        elem.style.removeProperty("max-height");
      }
    }
  };

  const onOutsideClick = (event: MouseEvent) => {
    setOpenState(false);
    const elem = document.getElementById(id) as HTMLDivElement;
    if (elem) {
      elem.style.removeProperty("max-height");
    }
  };

  const { ref } = useOutsideDetection<HTMLDivElement>(onOutsideClick);

  useEffect(() => {
    if (scrollDown) {
      setOpenState(false);
      const elem = document.getElementById(id) as HTMLDivElement;
      if (elem) {
        elem.style.removeProperty("max-height");
      }
    }
  }, [scrollDown]);

  return (
    <div
      className={cl(
        { [styles.open]: menuOpen },
        className,
        styles.dropdownMenuContainer,
        { [styles.dropdownDisabled]: disabled }
      )}
      onClick={!disabled ? onInsideClick : () => null}
      ref={ref}
    >
      <div
        className={cs(
          styles.label,
          { [styles.disabled]: disabled },
          { [styles.goldColor]: id == "currency-dropdown-sidemenu" }
        )}
      >
        {display}
        {showCaret ? (
          <span
            className={cs(
              menuOpen ? styles.caret : styles.caretUp,
              { [styles.disabled]: disabled },
              { [styles.goldColor]: id == "currency-dropdown-sidemenu" },
              {
                [styles.carretVerticalMidAlign]:
                  id == "currency-dropdown-sidemenu"
              }
            )}
          ></span>
        ) : (
          ""
        )}
      </div>
      <div
        id={id}
        className={cl(
          styles.menu,
          { [styles.checkout]: id == "currency-dropdown-checkout" },
          styles[align],
          { [styles.openUp]: direction == "up" }
        )}
      >
        <ul>{children}</ul>
      </div>
    </div>
  );
};

export default BaseDropdownMenu;
