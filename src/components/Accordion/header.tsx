import React, { memo } from "react";
import cs from "classnames";

import styles from "./styles.scss";
import fontStyles from "styles/iconFonts.scss";

type Props = {
  id: string;
  className?: string;
  headerClosedClassName?: string;
  headerOpenClassName?: string;
  open: boolean;
  openIconClass: string;
  closedIconClass: string;
  onClick: (id: string) => void;
  setHideScroll?: any;
};

const Header: React.FC<Props> = memo(
  ({
    id,
    className,
    open,
    children,
    openIconClass = styles.iconOpen,
    closedIconClass = styles.iconClosed,
    headerClosedClassName = "",
    headerOpenClassName = "",
    onClick,
    setHideScroll
  }) => {
    const onHeaderClick = () => {
      onClick(id);
      if (open) {
        setHideScroll?.(true);
      } else {
        setHideScroll?.(false);
      }
    };
    return (
      <div
        className={cs(className, styles.accordionHeader, {
          [headerClosedClassName]: !open,
          [headerOpenClassName]: open
        })}
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
