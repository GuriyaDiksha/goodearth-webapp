import React from "react";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import cs from "classnames";

const MyAddress = (props: { mode: string; children: React.ReactNode }) => {
  const { mode, children } = props;
  return (
    <div className={bootstrapStyles.row}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          { [bootstrapStyles.colMd8]: mode != "list" },
          { [bootstrapStyles.offsetMd2]: mode != "list" },
          { [bootstrapStyles.colMd10]: mode == "list" },
          { [bootstrapStyles.offsetMd1]: mode == "list" }
        )}
      >
        <div className={styles.formHeading}>Manage Your Addresses</div>
        <div className={styles.formSubheading}>
          Add multiple billing and shipping addresses.
        </div>
        {children}
      </div>
    </div>
  );
};

export default MyAddress;
