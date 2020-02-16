import React, { memo } from "react";
import cs from "classnames";

import styles from "./styles.scss";

type Props = {
  className?: string;
  open: boolean;
};

const Body: React.FC<Props> = memo(({ className, open, children }) => {
  return (
    <div
      className={cs(className, styles.accordionBody, {
        [styles.open]: open
      })}
    >
      {children}
    </div>
  );
});

export default Body;
