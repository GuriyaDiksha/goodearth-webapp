import React from "react";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import ReactHtmlParser from "react-html-parser";
import { PopupData } from "typings/api";
import iconStyles from "styles/iconFonts.scss";

type Props = {
  finalContent: string;
  close: (link?: string) => void;
} & PopupData;
const TopImage: React.FC<Props> = ({
  finalContent,
  heading,
  icon,
  ctaLabel,
  ctaColor,
  ctaLink,
  image,
  bgImage,
  disclaimer,
  close
}) => {
  return (
    <>
      <div
        style={
          bgImage
            ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }
            : {}
        }
      >
        <div
          className={cs(styles.cross, styles.leftImageCross)}
          onClick={() => close()}
        >
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.icon,
              styles.iconCross
            )}
          ></i>
        </div>
        <div>
          <div>
            <img className={styles.leftImage} src={image} />
          </div>
          <div className={cs(styles.gcTnc)}>
            {/* {icon && <img src={icon} className={styles.icon} />} */}
            <div className={bootstrapStyles.row}>
              <div className={bootstrapStyles.col6}>
                <div
                  className={cs(globalStyles.popupHeading, styles.heading)}
                  style={{ marginTop: icon ? "0" : "30px" }}
                >
                  {heading}
                </div>
                <div
                  className={cs(
                    globalStyles.ceriseBtn,
                    styles.ceriseBtn30,
                    styles.ceriseBtn80,
                    globalStyles.marginT20
                  )}
                  style={{ backgroundColor: ctaColor }}
                >
                  <a
                    id="info-popup-accept-button"
                    tabIndex={-1}
                    onClick={() => close(ctaLink)}
                  >
                    {ctaLabel}
                  </a>
                </div>
              </div>
              <div className={bootstrapStyles.col6}>
                <div
                  className={cs(
                    globalStyles.c10LR,
                    styles.content,
                    styles.cmsContent,
                    styles.leftImageContent
                  )}
                >
                  {ReactHtmlParser(finalContent)}
                </div>
              </div>
            </div>
            {disclaimer && (
              <div className={styles.disclaimer}>{disclaimer}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default TopImage;
