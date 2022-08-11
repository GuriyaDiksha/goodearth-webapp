import React from "react";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import ReactHtmlParser from "react-html-parser";
import { PopupData } from "typings/api";
import iconStyles from "styles/iconFonts.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import TopImage from "./TopImage";

type Props = {
  finalContent: string;
  close: (link?: string) => void;
} & PopupData;
const LeftImage: React.FC<Props> = ({
  finalContent,
  heading,
  icon,
  ctaLabel,
  ctaColor,
  ctaLink,
  image,
  imageMobile,
  bgImage,
  bgImageMobile,
  bgColor,
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
  return mobile || tablet ? (
    <TopImage
      {...{
        finalContent,
        heading,
        icon,
        ctaLabel,
        ctaColor,
        ctaLink,
        image,
        imageMobile,
        bgImage,
        bgImageMobile,
        bgColor,
        disclaimer,
        close
      }}
    />
  ) : (
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
        <div className={bootstrapStyles.row}>
          <div className={bootstrapStyles.col6}>
            <img className={cs(styles.leftImage)} src={image} />
          </div>
          <div className={cs(styles.gcTnc, bootstrapStyles.col6)}>
            {/* {icon && <img src={icon} className={styles.icon} />} */}
            <div className={cs(globalStyles.popupHeading, styles.heading)}>
              {ReactHtmlParser(heading)}
            </div>
            <div
              className={cs(
                // globalStyles.c10LR,
                styles.content,
                styles.cmsContent,
                styles.leftImageContent
              )}
            >
              {ReactHtmlParser(finalContent)}
            </div>
            <div
              className={cs(
                // globalStyles.ceriseBtn,
                styles.ceriseBtn30,
                styles.ceriseBtn80,
                globalStyles.marginT20,
                styles.leftImageCta
              )}
              // style={{ backgroundColor: ctaColor }}
            >
              <a
                id="info-popup-accept-button"
                tabIndex={-1}
                onClick={() => close(ctaLink)}
              >
                {ReactHtmlParser(ctaLabel)}
              </a>
            </div>
            {disclaimer && (
              <div className={styles.disclaimer}>
                {ReactHtmlParser(disclaimer)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default LeftImage;
