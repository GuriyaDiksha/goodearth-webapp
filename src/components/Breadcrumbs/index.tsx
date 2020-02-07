import React, { memo, ReactNode } from "react";
import styles from "./styles.scss";
import { Props } from "./typings";
import cs from "classnames";

const Breadcrumbs: React.FC<Props> = memo(
  ({ levels = [], separator = " > ", className }) => {
    const breadcrumbs: ReactNode[] = [];

    levels.map(({ name, url }, index) => {
      if (index !== levels.length - 1) {
        const href = url ? url : "";
        breadcrumbs.push(
          <>
            <a href={href}>{name}</a>
            <span className={styles.separator}>{separator}</span>
          </>
        );
      } else {
        breadcrumbs.push(
          <>
            <span>{name}</span>
          </>
        );
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
