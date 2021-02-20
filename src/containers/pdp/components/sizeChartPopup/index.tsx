import React from "react";
import cs from "classnames";
import ReactHtmlParser from "react-html-parser";
import CloseButton from "components/Modal/components/CloseButton";

import styles from "./styles.scss";

type Props = {
  html: string;
};

const SizeChartPopup: React.FC<Props> = ({ html }) => {
  return (
    <div className={cs(styles.sizeChartApparel, styles.sizeGuideModal)}>
      <CloseButton className={styles.closeButton} />
      <div>{ReactHtmlParser(html)}</div>
    </div>
  );
};

export default SizeChartPopup;
