import React, { useContext } from "react";
import cs from "classnames";
// context
import { Context } from "components/Modal/context";

import styles from "./styles.scss";
import fontStyles from "styles/iconFonts.scss";

type Props = {
  className?: string;
};

const CloseButton: React.FC<Props> = ({ className, children }) => {
  const { closeModal } = useContext(Context);

  return (
    <button className={cs(styles.closeButton, className)} onClick={closeModal}>
      {children || (
        <span className={cs(fontStyles.icon, fontStyles.iconCross)} />
      )}
    </button>
  );
};

export default CloseButton;
