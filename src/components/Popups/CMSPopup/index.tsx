import React, { useContext, useEffect } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { PopupData } from "typings/api";
import ReactHtmlParser from "react-html-parser";
import CookieService from "services/cookie";

const CMSPopup: React.FC<PopupData> = ({
  heading,
  icon,
  content,
  pageUrl,
  ctaLabel,
  ctaColor,
  session
}) => {
  const { closeModal } = useContext(Context);

  useEffect(() => {
    const btn = document.getElementById("info-popup-accept-button");
    btn?.focus();
  }, []);
  const close = () => {
    if (session) {
      CookieService.setCookie(pageUrl.replaceAll("/", "_"), "show", 0);
    }
    closeModal();
  };
  const elem = new DOMParser().parseFromString(content, "text/html").body;
  const target = elem.querySelector('[data-f-id="pbf"]');
  target?.remove();
  const finalContent = elem.innerHTML.toString();
  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktop,
          styles.centerpageMobile,
          globalStyles.textCenter
        )}
      >
        <div className={styles.cross} onClick={close}>
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
            style={{ marginTop: icon ? "0" : "40px" }}
          >
            {heading}
          </div>
          <div className={cs(globalStyles.c10LR, styles.content)}>
            {ReactHtmlParser(finalContent)}
          </div>
          <div
            className={cs(
              globalStyles.ceriseBtn,
              styles.ceriseBtn30,
              globalStyles.marginT20
            )}
            style={{ color: `${ctaColor} !important` }}
          >
            <a id="info-popup-accept-button" tabIndex={-1} onClick={close}>
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSPopup;
