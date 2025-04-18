import React from "react";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import ReactHtmlParser from "react-html-parser";
import { PopupData } from "typings/api";
import iconStyles from "styles/iconFonts.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

type Props = {
  finalContent: string;
  close: (link?: string) => void;
} & PopupData;
const TwoCTA: React.FC<Props> = ({
  finalContent,
  heading,
  icon,
  ctaLabel,
  ctaColor,
  ctaLink,
  bgImage,
  bgImageMobile,
  bgColor,
  ctaLink2,
  ctaLabel2,
  ctaColor2,
  disclaimer,
  close
}) => {
  const { mobile, tablet } = useSelector((state: AppState) => state.device);
  let bgStyle: React.CSSProperties = bgImage
    ? {
        backgroundImage: `url(${mobile ? bgImageMobile || bgImage : bgImage})`,
        backgroundSize: "cover"
      }
    : {};

  if (bgColor) {
    bgStyle = { ...bgStyle, backgroundColor: bgColor };
  }
  return (
    <>
      <div style={bgStyle}>
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
        <div className={cs(styles.gcTnc, styles.twoCta)}>
          {icon && <img src={icon} className={styles.icon} />}
          <div
            className={cs(globalStyles.c22AI, styles.heading)}
            style={{
              marginTop: icon ? "0" : "20px",
              marginBottom: icon ? "0" : "20px"
            }}
          >
            {ReactHtmlParser(heading)}
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
            className={cs(styles.twoButton, {
              [styles.twoButtonMobile]: mobile || tablet
            })}
          >
            <div
              className={cs(
                // globalStyles.ceriseBtn,
                styles.button1
              )}
              // style={{ backgroundColor: ctaColor || "#ab1e56" }}
            >
              <a
                id="info-popup-accept-button"
                tabIndex={-1}
                onClick={() => close(ctaLink)}
              >
                {ReactHtmlParser(ctaLabel)}
              </a>
            </div>
            <div className={cs(styles.button2, globalStyles.marginT20)}>
              <a
                id="info-popup-accept-button2"
                // style={{ color: ctaColor2 ? ctaColor2 : "#ab1e56" }}
                tabIndex={-1}
                onClick={() => close(ctaLink2)}
              >
                {ReactHtmlParser(ctaLabel2)}
              </a>
            </div>
          </div>
          {disclaimer && (
            <div className={styles.disclaimer}>
              {ReactHtmlParser(disclaimer)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default TwoCTA;
