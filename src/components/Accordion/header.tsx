import React, { memo } from "react";
import cs from "classnames";

import styles from "./styles.scss";
import fontStyles from "styles/iconFonts.scss";

type Props = {
  id: string;
  className?: string;
  open: boolean;
  openIconClass: string;
  closedIconClass: string;
  onClick: (id: string) => void;
};

const Header: React.FC<Props> = memo(
  ({
    id,
    className,
    open,
    children,
    openIconClass = styles.iconOpen,
    closedIconClass = styles.iconClosed,
    onClick
  }) => {
    const onHeaderClick = () => {
      onClick(id);
    };
    return (
      <div
        className={cs(className, styles.accordionHeader)}
        onClick={onHeaderClick}
      >
        {children}
        <span
          className={cs(fontStyles.icon, {
            [openIconClass]: open,
            [closedIconClass]: !open
          })}
        ></span>
      </div>
    );
  }
);

export default Header;
