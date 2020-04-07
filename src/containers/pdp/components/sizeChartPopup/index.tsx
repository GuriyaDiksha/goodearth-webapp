import React from "react";
import cs from "classnames";

import CloseButton from "components/Modal/components/CloseButton";

import styles from "./styles.scss";

type Props = {
  html: string;
  changeModalState?: any;
};

const SizeChartPopup: React.FC<Props> = ({ html, changeModalState }) => {
  return (
    <div className={cs(styles.sizeChartApparel, styles.sizeGuideModal)}>
      <CloseButton
        className={styles.closeButton}
        changeModalState={changeModalState}
      />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default SizeChartPopup;
