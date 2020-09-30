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
  showCaret
}: BaseDropdownMenuProps): JSX.Element => {
  const [menuOpen, setOpenState] = useState(open || false);
  false && setOpenState(false);

  const onInsideClick = () => {
    setOpenState(!menuOpen);
  };

  const onOutsideClick = (event: MouseEvent) => {
    setOpenState(false);
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
      <div className={cl(styles.menu, styles[align])}>
        <ul>{children}</ul>
      </div>
    </div>
  );
};

export default BaseDropdownMenu;
