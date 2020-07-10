import React from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
// import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { AddressProps } from "./typings";

const AddressSection: React.FC<AddressProps> = props => {
  const { isActive } = props;

  return (
    <div
      className={
        isActive
          ? cs(styles.card, styles.cardOpen, styles.marginT20)
          : cs(styles.card, styles.cardClosed, styles.marginT20)
      }
    >
      <div className={bootstrapStyles.row}></div>
    </div>
  );
};

export default AddressSection;
