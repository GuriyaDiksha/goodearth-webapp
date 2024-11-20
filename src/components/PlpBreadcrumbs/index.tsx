import React, { memo, ReactNode, Fragment } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.scss";
import { Props } from "./typings";
import cs from "classnames";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const Breadcrumbs: React.FC<Props> = memo(
  ({ levels = [], separator = " > ", className, isViewAll }) => {
    const breadcrumbs: ReactNode[] = [];

    // Add GA event on click of l1,l2,l3 breadcrumb
    const handleClick = (name: string) => {
      // Initialize empty values for L1, L2, and L
      const levelMapping = {
        L1: "",
        L2: "",
        L3: ""
      };
      // Loop through the level array and map name to L1, L2, L3 based on depth
      levels.forEach(item => {
        if (item.depth === 1 && !levelMapping.L1) {
          levelMapping.L1 = item.name; // Assign name to L1
        } else if (item.depth === 2 && !levelMapping.L2) {
          levelMapping.L2 = item.name; // Assign name to L2
        } else if (item.depth === 3 && !levelMapping.L3) {
          levelMapping.L3 = item.name; // Assign name to L3
        }
      });

      let menu_navigation: string;
      if (name == levelMapping.L1) {
        menu_navigation = "menu_navigation_L1";
      } else if (name == levelMapping.L2) {
        menu_navigation = "menu_navigation_L2";
      } else {
        menu_navigation = "menu_navigation_L3";
      }

      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: menu_navigation,
          click_type: "Category",
          L1: levelMapping.L1 ? levelMapping.L1 : "NA",
          L2: levelMapping.L2 ? levelMapping.L2 : "NA",
          L3: levelMapping.L3 ? levelMapping.L3 : "NA"
        });
      }
    };

    levels.map(({ name, url }, index) => {
      const href = url ? url : "#";
      if (index !== levels.length - 1) {
        name &&
          breadcrumbs.push(
            <Fragment key={name}>
              <Link to={href} onClick={() => handleClick(name)}>
                {name}
              </Link>
              <span className={styles.separator} key={`separator-${index}`}>
                {separator}
              </span>
            </Fragment>
          );
      } else {
        breadcrumbs.push(
          <Fragment key={name}>
            <Link to={href} onClick={() => handleClick(name)}>
              {name}
            </Link>
          </Fragment>
        );
      }

      // else {
      //   if (isViewAll) {
      //     if (levels.length == 3) {
      //       const href = url ? url : "#";
      //       breadcrumbs.push(
      //         <Fragment key={name}>
      //           <Link to={href}>{name.split(":")[0]}</Link>
      //           <span className={styles.separator} key={`separator-${index}`}>
      //             {separator}
      //           </span>
      //         </Fragment>
      //       );
      //     }
      //     breadcrumbs.push(
      //       <Fragment key={name}>
      //         <span>{" View all"}</span>
      //       </Fragment>
      //     );
      //   } else {
      //     breadcrumbs.push(
      //       <Fragment key={name}>
      //         <span>{name.length > 50 ? name.slice(0, 50) + "..." : name}</span>
      //       </Fragment>
      //     );
      //   }
      // }
    });

    return (
      <div className={cs(styles.breadcrumbsContainer, className)}>
        {breadcrumbs}
      </div>
    );
  }
);

export default Breadcrumbs;
