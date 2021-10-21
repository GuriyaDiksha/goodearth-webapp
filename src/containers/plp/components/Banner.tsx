import React from "react";
import { PlpTemplate } from "services/plp/typings";
import cs from "classnames";
import bootstrap from "../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import itemStyles from "components/plpResultItem/styles.scss";

type Props = {
  data: PlpTemplate;
  mobile: boolean;
};
const Banner: React.FC<Props> = ({ data, mobile }) => {
  return (
    <>
      <div
        className={cs(
          bootstrap.colMd8,
          bootstrap.col12,
          styles.setWidth,
          { [styles.templatePadding]: !mobile },
          { [styles.templatePaddingUpperMobile]: mobile }
        )}
      >
        {data.mediaType == "image" ? (
          <img
            className={itemStyles.imageResultnew}
            src={mobile ? data.mobileMediaUrl : data.desktopMediaUrl}
          />
        ) : (
          <video
            className={itemStyles.imageResultnew}
            src={mobile ? data.mobileMediaUrl : data.desktopMediaUrl}
            autoPlay
            loop
            preload="auto"
          />
        )}
      </div>
      <div
        className={cs(
          bootstrap.colMd4,
          bootstrap.col12,
          styles.setWidth,
          styles.btContent,
          styles.templatePadding
        )}
      >
        {data.heading && <div className={styles.btHeading}>{data.heading}</div>}
        {data.body && <div className={styles.btBody}>{data.body}</div>}
      </div>
    </>
  );
};

export default Banner;
