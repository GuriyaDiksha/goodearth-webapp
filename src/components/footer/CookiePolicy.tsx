import React, { useEffect, useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import ToggleSwitch from "components/Switch";
import { Link } from "react-router-dom";
import fontStyles from "styles/iconFonts.scss";
import CookieService from "services/cookie";
import { AppState } from "reducers/typings";
import { useSelector, useStore } from "react-redux";
import WidgetService from "services/widget";
import { Consent } from "services/widget/typings";
import { clone } from "lodash";

type Props = {
  hideCookies: any;
  acceptCookies: any;
};

const CookiePolicy: React.FC<Props> = ({ hideCookies, acceptCookies }) => {
  const [isPrefOpen, setIsPrefOpen] = useState(false);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [regionName, setRegion] = useState<string>("");
  const { region, widgetDetail, country, ip } = useSelector(
    (state: AppState) => state.widget
  );
  const { email } = useSelector((state: AppState) => state.user);
  const store = useStore();

  useEffect(() => {
    setRegion(region === "" ? CookieService.getCookie("region") : region);
    WidgetService.getWidgetDetail(
      store.dispatch,
      (region === "" ? CookieService.getCookie("region") : region) === "Europe"
        ? "EUROPE"
        : "GLOBAL"
    );
  }, [region]);

  useEffect(() => {
    setConsents(widgetDetail?.consents || []);
  }, [widgetDetail]);

  const changeValue = (checked: boolean, id: number) => {
    const cloneConsent = clone(consents);
    cloneConsent.map(e => {
      if (Number(e.id) === id) {
        e.value = checked;
      }
    });
    setConsents(cloneConsent);
  };

  const saveConsent = (consents: any) => {
    const selectedConsent = consents
      .filter((e: any) => e.value === true)
      .map((e: any) => e.functionalities)
      .join(",");

    CookieService.setCookie("consent", selectedConsent, 365);

    WidgetService.postConsentDetail(store.dispatch, {
      ip: ip || CookieService.getCookie("ip"),
      consents: consents
        .filter((e: any) => e.value === true)
        .map((e: any) => e.name)
        .join(","),
      country: country || CookieService.getCookie("country"),
      widget_name: regionName === "Europe" ? "EUROPE" : "GLOBAL",
      email: email || ""
    });
  };

  const acceptAll = () => {
    const cloneConsent = clone(consents);
    cloneConsent.map(e => {
      e.value = true;
    });
    setConsents(cloneConsent);
    saveConsent(cloneConsent);
    setTimeout(() => {
      acceptCookies();
    }, 2000);
  };

  const savePref = () => {
    saveConsent(consents);
    setIsPrefOpen(false);
  };

  return (
    <div
      className={cs(
        styles.cookieclass,
        regionName !== "Europe" ? styles.eucookieclass : "",
        isPrefOpen ? styles.euPref : ""
      )}
    >
      {isPrefOpen ? (
        <>
          <p className={styles.heading}>YOUR COOKIE PREFERENCES</p>
          <hr />
          <p className={styles.question}>What is a cookie?</p>
          <p className={styles.answer}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation veritatis
          </p>
          <p className={styles.prefhead}>Manage Cookie Preferences</p>
          <div className={styles.prefWrp}>
            {consents?.map((ele, i) => (
              <div className={styles.prefBlock} key={i}>
                <div className={styles.prefSubBlock}>
                  <p className={styles.prefQue}>{ele?.name}</p>
                  <p className={styles.prefAns}>{ele?.description}</p>
                </div>
                <div className={styles.prefToggleWrp}>
                  <ToggleSwitch
                    id={ele?.id}
                    checked={ele?.value}
                    changeValue={changeValue}
                    small={true}
                    disabled={ele?.is_editable}
                  />
                  {!ele?.is_editable ? (
                    <p className={styles.prefActive}>Always Active</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.btnWrp}>
            <button className={styles.savebtn} onClick={() => savePref()}>
              save preferences
            </button>
            <button className={styles.acceptbtn} onClick={() => acceptAll()}>
              accept all
            </button>
          </div>
        </>
      ) : (
        <>
          <span
            className={cs(
              styles.closePopup,
              fontStyles.icon,
              fontStyles.iconCross
            )}
            onClick={() => {
              hideCookies();
            }}
          ></span>
          <h3>COOKIES & PRIVACY</h3>
          <p>
            This website uses cookies to ensure you get the best experience on
            our website. Please read our &nbsp;
            <Link to={"/customer-assistance/cookie-policy"}>Cookie Policy</Link>
            &nbsp; and{" "}
            <Link to={"/customer-assistance/privacy-policy"}>
              Privacy Policy.
            </Link>
          </p>
          {regionName !== "Europe" ? (
            <p
              className={styles.preferencesLink}
              onClick={() => setIsPrefOpen(true)}
            >
              set my cookie preferences
            </p>
          ) : null}
          <span className={styles.okBtn} onClick={acceptCookies}>
            ACCEPT & CONTINUE
          </span>
        </>
      )}
    </div>
  );
};

export default CookiePolicy;
