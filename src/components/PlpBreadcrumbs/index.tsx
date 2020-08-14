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
        const href = url ? url : "";
        breadcrumbs.push(
          <Fragment key={name}>
            <Link to={href}>{name}</Link>
            <span className={styles.separator} key={`separator-${index}`}>
              {separator}
            </span>
          </Fragment>
        );
      } else {
        if (isViewAll) {
          breadcrumbs.push(
            <Fragment key={name}>
              <span>{" View all"}</span>
            </Fragment>
          );
        } else {
          breadcrumbs.push(
            <Fragment key={name}>
              <span>{name.length > 50 ? name.slice(0, 50) + "..." : name}</span>
            </Fragment>
          );
        }
      }
    });
    return (
      <div className={cs(styles.breadcrumbsContainer, className)}>
        {breadcrumbs}
      </div>
    );
  }
);

export default Breadcrumbs;
