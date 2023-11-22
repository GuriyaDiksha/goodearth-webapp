import React, { useState, useContext, useEffect } from "react";
import BridalContext from "./context";
import styles from "./styles.scss";
import myAccountStyles from "../styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import glasses from "../../../../images/bridal/glasses.svg";
import bridalRing from "../../../../images/bridal/rings.svg";
import { confirmPopup } from "utils/validate";
import { pageViewGTM } from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import Button from "components/Button";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

const CreateRegistry: React.FC = () => {
  const { setCurrentModule, setCurrentModuleData, data } = useContext(
    BridalContext
  );
  const [selectId, setSelectId] = useState(data.occasion ? data.occasion : "");
  const { mobile } = useSelector((state: AppState) => state.device);

  const setRegistry = (data: string) => {
    setSelectId(data);
  };

  const moveTonext = () => {
    setCurrentModule("date");
    setCurrentModuleData("create", { occasion: selectId });
  };

  useEffect(() => {
    window.addEventListener("beforeunload", confirmPopup);
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      pageViewGTM("MyAccount");
      dataLayer.push({
        event: "registry",
        "Event Category": "Registry",
        "Event Action": "Registry page"
      });
    }
  }, []);

  return (
    <>
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd10,
            bootstrapStyles.offsetMd1
          )}
        >
          <div
            className={cs(myAccountStyles.formHeading, globalStyles.voffset6)}
          >
            Good Earth Registry
          </div>
          <div className={cs(myAccountStyles.loginForm, styles.loginForm)}>
            <p>We are delighted that you have chosen to register with us.</p>
            <p>
              Please note: Our Good Earth Registry is country specific. Before
              creating your Good Earth Registry, please select country where you
              would like your gifts to be shipped.
            </p>
            <p>
              To change your country please click on the change country button
              on the header.
            </p>
            <p>
              Your guests will view the registry in the prices & currency
              associated with the country selected as the shipping destination.
            </p>
          </div>
        </div>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2,
            styles.bridalIcons
          )}
        >
          <div className={styles.heading}>1. Create a registry</div>
          <ul className={cs(styles.icons, styles.bridaliconPdp)}>
            <li
              onClick={e => {
                setRegistry("wedding");
              }}
              data-value="WeddingSpecial"
              className={cs({ [styles.active]: selectId == "wedding" })}
            >
              <svg
                viewBox="-3 -3 46 46"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid meet"
                x="0"
                y="0"
                className={styles.bridalRing}
              >
                <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
              </svg>
            </li>
            <li
              onClick={e => {
                setRegistry("special occasion");
              }}
              data-value="special occasion"
              className={cs({
                [styles.active]: selectId == "special occasion"
              })}
            >
              <svg
                viewBox="-3 -3 46 46"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid meet"
                x="0"
                y="0"
                className={styles.bridalRing}
              >
                <use xlinkHref={`${glasses}#bridal-glasses`}></use>
              </svg>
            </li>
          </ul>
          <ul className={styles.txt}>
            <li>wedding</li>
            <li>special occasion</li>
          </ul>
        </div>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2
          )}
        >
          <Button
            type="button"
            label="PROCEED TO SET THE DATE"
            disabled={!selectId}
            onClick={moveTonext}
            variant="mediumMedCharcoalCta366"
            className={cs({ [globalStyles.btnFullWidth]: mobile })}
          />
        </div>
      </div>
      <div
        className={cs(
          bootstrapStyles.row,
          globalStyles.textCenter,
          globalStyles.voffset4
        )}
      >
        <div className={bootstrapStyles.col12}>
          {selectId ? (
            <i
              className={cs(styles.arrowDown, globalStyles.pointer)}
              onClick={moveTonext}
            ></i>
          ) : (
            <i className={styles.arrowDown}></i>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateRegistry;
