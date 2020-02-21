import React, { useContext } from "react";
import cs from "classnames";

import { Context } from "../../context";
import styles from "./styles.scss";
import fontStyles from "styles/iconFonts.scss";

type Props = {
  className?: string;
};

const CloseButton: React.FC<Props> = ({ className, children }) => {
  const context = useContext(Context);

  return (
    <button
      className={cs(styles.closeButton, className)}
      onClick={context.closeModal}
    >
      {children || (
        <span className={cs(fontStyles.icon, fontStyles.iconCross)} />
      )}
    </button>
  );
};

export default CloseButton;
