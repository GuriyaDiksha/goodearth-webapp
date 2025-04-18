import React from "react";
import { PlpTemplate } from "services/plp/typings";
import cs from "classnames";
import bootstrap from "../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import itemStyles from "components/plpResultItem/styles.scss";

type Props = {
  data: PlpTemplate;
  mobile: boolean;
  view: "list" | "grid";
};
const Product: React.FC<Props> = ({ data, view, mobile }) => {
  return (
    <div
      className={cs(
        bootstrap.colLg4,
        {
          [bootstrap.col12]: view == "list",
          [bootstrap.col6]: view == "grid"
        },
        styles.setWidth,
        {
          [styles.templatePadding]: !mobile,
          [styles.templatePaddingMobile]: mobile,
          [styles.templatePaddingList]: view == "list"
        }
      )}
    >
      {data?.mediaType == "image" ? (
        <img className={itemStyles.imageBoxnew} src={data?.mediaUrl} />
      ) : (
        <video
          className={itemStyles.imageBoxnew}
          src={data?.mediaUrl}
          autoPlay
          loop
          controls
          muted
          preload="auto"
          playsInline
        />
      )}
    </div>
  );
};

export default Product;
