import React, { useState } from "react";
import cl from "classnames";
import { BaseDropdownMenuProps } from "./typings";
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
  id
}: BaseDropdownMenuProps): JSX.Element => {
  const [menuOpen, setOpenState] = useState(open || false);
  false && setOpenState(false);

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
      <div className={cs(styles.label, { [styles.disabled]: disabled })}>
        {display}
        {showCaret ? (
          <span
            className={cs(menuOpen ? styles.caretUp : styles.caret, {
              [styles.disabled]: disabled
            })}
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
          styles[align]
        )}
      >
        <ul>{children}</ul>
      </div>
    </div>
  );
};

export default BaseDropdownMenu;
