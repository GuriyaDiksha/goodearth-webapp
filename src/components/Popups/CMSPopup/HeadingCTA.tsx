import React from "react";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import ReactHtmlParser from "react-html-parser";
import { PopupData } from "typings/api";
import iconStyles from "styles/iconFonts.scss";

type Props = {
  finalContent: string;
  close: (link?: string) => void;
} & PopupData;
const HeadingCTA: React.FC<Props> = ({
  finalContent,
  heading,
  icon,
  ctaLabel,
  ctaColor,
  ctaLink,
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
        <div className={styles.cross} onClick={() => close()}>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.icon,
              styles.iconCross
            )}
          ></i>
        </div>
        <div className={styles.gcTnc}>
          {icon && <img src={icon} className={styles.icon} />}
          <div
            className={cs(globalStyles.c22AI, styles.heading)}
            style={{ marginTop: icon ? "0" : "30px" }}
          >
            {heading}
          </div>
          <div
            className={cs(
              globalStyles.c10LR,
              styles.content,
              styles.cmsContent
            )}
          >
            {ReactHtmlParser(finalContent)}
          </div>
          <div
            className={cs(
              globalStyles.ceriseBtn,
              styles.ceriseBtn30,
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
          {disclaimer && <div className={styles.disclaimer}>{disclaimer}</div>}
        </div>
      </div>
    </>
  );
};
export default HeadingCTA;
