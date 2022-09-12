import React from "react";
import { CeriseProfileMenuProps } from "./typings";
import styles from "./styles.scss";
import CeriseCard from "components/CeriseCard";
import { NavLink } from "react-router-dom";
import BaseDropdownMenu from "../baseDropdownMenu";

const CeriseProfileMenu = ({
  align,
  display,
  open,
  className,
  children,
  items,
  disabled,
  id,
  onDropDownMenuClick
}: CeriseProfileMenuProps) => {
  const menuProps = {
    align,
    display,
    open,
    className,
    disabled,
    id
  };

  const getMenuItems = (): JSX.Element => {
    return (
      <div className={styles.ceriseCardMenuWrp}>
        <NavLink to={"/account/cerise"}>
          <CeriseCard />
        </NavLink>
        <div className={styles.ceriseCardMenu}>
          <ul>
            {items.map((item, ind) => {
              const props: any = {};

              if (item?.onClick) {
                props.onClick = item?.onClick;
              }
              const { type = "button" } = item;

              let innerHTML = <>{item?.label}</>;
              if (type === "button" && id === "profile-dropdown") {
                innerHTML = <span>{item?.label}</span>;
              }
              if (type === "link") {
                innerHTML = (
                  <NavLink to={item?.href as string}>{item?.label}</NavLink>
                );
              }

              return (
                <li key={ind} {...props}>
                  {innerHTML}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };

  return <BaseDropdownMenu {...menuProps}>{getMenuItems()}</BaseDropdownMenu>;
};

export default CeriseProfileMenu;
