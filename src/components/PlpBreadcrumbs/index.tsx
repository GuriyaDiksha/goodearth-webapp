import React, { memo, ReactNode, Fragment } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.scss";
import { Props } from "./typings";
import cs from "classnames";

const Breadcrumbs: React.FC<Props> = memo(
  ({ levels = [], separator = " > ", className, isViewAll }) => {
    const breadcrumbs: ReactNode[] = [];

    levels.map(({ name, url }, index) => {
      if (index !== levels.length - 1) {
        const href = url ? url : "#";
        breadcrumbs.push(
          <Fragment key={name}>
            <Link to={href}>{name}</Link>
            {index != 0 ? (
              <span className={styles.separator} key={`separator-${index}`}>
                {separator}
              </span>
            ) : (
              ""
            )}
          </Fragment>
        );
      } else {
        const href = url ? url : "#";
        breadcrumbs.push(
          <Fragment key={name}>
            <Link to={href}>{name}</Link>
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
