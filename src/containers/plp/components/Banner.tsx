import React from "react";
import { PlpTemplate } from "services/plp/typings";
import cs from "classnames";
import bootstrap from "../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import itemStyles from "components/plpResultItem/styles.scss";
import { useState, useEffect } from "react";

type Props = {
  data: PlpTemplate;
  mobile: boolean;
  tablet: boolean;
  colbanner: boolean;
};
const Banner: React.FC<Props> = ({ data, mobile, tablet }) => {
  const [colbanner, setColbanner] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setColbanner(true);
    }, 600);
  }, []);
  return (
    <>
      {colbanner ? (
        <div className={styles.colBanner}>
          <div
            className={cs(
              bootstrap.colLg8,
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
              { [bootstrap.colMd4]: !tablet },
              bootstrap.col12,
              styles.setWidth,
              styles.btContent,
              styles.templatePadding
            )}
          >
            {data.heading && (
              <div className={styles.btHeading}>{data.heading}</div>
            )}
            {data.body && <div className={styles.btBody}>{data.body}</div>}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Banner;
