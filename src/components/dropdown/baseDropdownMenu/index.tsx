import React, { useState } from "react";
import cl from "classnames";

import { BaseDropdownMenuProps } from "./typings";

import styles from "./styles.scss";
import useOutsideDetection from "../../../hooks/useOutsideDetetion";

const BaseDropdownMenu = ({
  align,
  display,
  open,
  className,
  children
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
        styles.dropdownMenuContainer
      )}
      onClick={onInsideClick}
      ref={ref}
    >
      <div className={styles.label}>{display}</div>
      <div className={cl(styles.menu, styles[align])}>{children}</div>
    </div>
  );
};

export default BaseDropdownMenu;
