import React from "react";
import { CeriseProfileMenuProps } from "./typings";
import styles from "./styles.scss";
import CeriseCard from "components/CeriseCard";
import { NavLink } from "react-router-dom";
import BaseDropdownMenu from "../baseDropdownMenu";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

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
  const {
    currency,
    user: { slab, isLoggedIn }
  } = useSelector((state: AppState) => state);

  const bridalGACall = (item: any) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (
      userConsent.includes(GA_CALLS) &&
      item?.value === "Good Earth Registry"
    ) {
      dataLayer.push({
        event: "ge_create_my_registry_click",
        user_status: isLoggedIn ? "Logged in" : "Guest",
        click_url: `${window?.location?.origin}${item?.url}`
      });
    }
  };

  const getMenuItems = (): JSX.Element => {
    return (
      <div className={styles.ceriseCardMenuWrp}>
        {(currency === "INR" ||
          slab.toLowerCase() === "cerise" ||
          slab.toLowerCase() === "cerise sitara" ||
          slab.toLowerCase() === "cerise club") && (
          <div
          // onClick={e => {
          //   if ((e.target as HTMLInputElement)?.id === "dashboard") {
          //     history.push("/account/cerise");
          //   } else {
          //     history.push("/cerise");
          //   }
          // }}
          >
            <CeriseCard />
          </div>
        )}
        <div className={styles.ceriseCardMenu} id={id}>
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
                  <NavLink
                    to={item?.href as string}
                    onClick={() => bridalGACall(item)}
                  >
                    {item?.label}
                  </NavLink>
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
