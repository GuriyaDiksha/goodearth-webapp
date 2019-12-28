import React from "react";
import cl from "classnames";

import { DropdownMenuItemProps } from "../typings";
import { NavLink } from "react-router-dom";
import styles from "../styles.scss";

const DropdownMenuItem = ({
  className,
  href,
  label,
  onClick,
  type = "button"
}: DropdownMenuItemProps) => {
  const props: any = {};
  if (onClick) {
    props.onClick = onClick;
  }
  let innerHTML = <>{label}</>;
  if (type == "link") {
    innerHTML = <NavLink to={href as string}>{label}</NavLink>;
  }
  return (
    <li className={cl(styles.menuItem, className)} {...props}>
      {innerHTML}
    </li>
  );
};

export default DropdownMenuItem;
