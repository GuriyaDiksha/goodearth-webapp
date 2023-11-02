import React from "react";
import { PlpTemplate } from "services/plp/typings";
import cs from "classnames";
import bootstrap from "../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import itemStyles from "components/plpResultItem/styles.scss";

type Props = {
  data: PlpTemplate;
  mobile: boolean;
  view?: "list" | "grid";
};
const ProductBanner: React.FC<Props> = ({ data, mobile, view }) => {
  return (
    <div
      className={cs(bootstrap.colLg8, bootstrap.col12, styles.setWidth, {
        [styles.templatePadding]: !mobile,
        [styles.templatePaddingMobile]: mobile,
        [styles.templatePaddingList]: view && view == "list"
      })}
    >
      {data?.mediaType == "image" ? (
        <img className={itemStyles.imageBoxnew} src={data?.mediaUrl} />
      ) : (
        <video
          className={itemStyles.imageBoxnew}
          src={data?.mediaUrl}
          autoPlay
          loop
          preload="auto"
        />
      )}
    </div>
  );
};

export default ProductBanner;
