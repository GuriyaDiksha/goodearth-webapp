import React from "react";
import cs from "classnames";

import styles from "./styles.scss";
import fontStyles from "styles/iconFonts.scss";

type Props = {
  className?: string;
  changeModalState?: any;
};

const CloseButton: React.FC<Props> = ({
  className,
  children,
  changeModalState
}) => {
  return (
    <button
      className={cs(styles.closeButton, className)}
      onClick={changeModalState(false)}
    >
      {children || (
        <span className={cs(fontStyles.icon, fontStyles.iconCross)} />
      )}
    </button>
  );
};

export default CloseButton;
