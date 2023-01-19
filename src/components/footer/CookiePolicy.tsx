import React, { useEffect, useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import ToggleSwitch from "components/Switch";
import { Link } from "react-router-dom";
import CookieService from "services/cookie";
import { AppState } from "reducers/typings";
import { useSelector, useStore } from "react-redux";
import WidgetService from "services/widget";
import { Consent } from "services/widget/typings";
import { clone } from "lodash";
import globalStyles from "../../styles/global.scss";
import fontStyles from "styles/iconFonts.scss";

type Props = {
  hideCookies: any;
  acceptCookies: any;
  setConsent: any;
  showCookiePref: boolean;
  showCookiePrefs: any;
};

const CookiePolicy: React.FC<Props> = ({
  setConsent,
  acceptCookies,
  hideCookies,
  showCookiePref,
  showCookiePrefs
}) => {
  const [isPrefOpen, setIsPrefOpen] = useState(false);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [regionName, setRegion] = useState<string>("");
  const { widgetDetail, ip, country } = useSelector(
    (state: AppState) => state.widget
  );
  const { email } = useSelector((state: AppState) => state.user);
  const store = useStore();

  useEffect(() => {
    document.body.classList.add(globalStyles.noScroll);
    return () => {
      document.body.classList.remove(globalStyles.noScroll);
    };
  }, []);

  useEffect(() => {
    setIsPrefOpen(showCookiePref);
  }, [showCookiePref]);

  useEffect(() => {
    //setRegion("India");
    //Hardcoded region
    // WidgetService.getWidgetDetail(store.dispatch, "GLOBAL");
    setRegion(country === "" ? CookieService.getCookie("country") : country);
    WidgetService.getWidgetDetail(
      store.dispatch,
      (country === "" ? CookieService.getCookie("country") : country) ===
        "India"
        ? "INDIA"
        : "ROTW"
    );
  }, [country]);

  useEffect(() => {
    const consent = widgetDetail?.consents || [];
    if (CookieService.getCookie("consent") !== "") {
      consent.map(e => {
        if (CookieService.getCookie("consent")?.includes(e?.functionalities)) {
          e.value = true;
        } else {
          e.value = false;
        }
      });
    }

    setConsents(consent || []);
  }, [widgetDetail]);

  const changeValue = (checked: boolean, id: string) => {
    const cloneConsent = clone(consents);
    cloneConsent.map((e, i) => {
      if (`${e.id}${i}` === id) {
        e.value = checked;
      }
    });
    setConsents(cloneConsent);
  };

  const saveConsent = (consents: any) => {
    // const selectedConsent: any = consents
    //   .filter((e: any) => e.value === true)
    //   .map((e: any) => e.functionalities)
    //   .join(",");

    CookieService.setCookie(
      "consent",
      consents
        .filter((e: any) => e.value === true)
        .map((e: any) => e?.functionalities)
        .join(","),
      365
    );
    showCookiePrefs();
    WidgetService.postConsentDetail(store.dispatch, {
      ip: ip || CookieService.getCookie("ip"),
      consents: consents
        .filter((e: any) => e.value === true)
        .map((e: any) => e.functionalities)
        .join(","),
      country: country || CookieService.getCookie("country"),
      widget_name: regionName === "India" ? "INDIA" : "ROTW",
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

  const acceptAndContinue = () => {
    saveConsent(consents);
    acceptCookies();
  };

  const hideCookie = () => {
    setConsent(true);
    hideCookies();
    showCookiePrefs();
  };

  return (
    <>
      {regionName ? (
        <div className={cs(styles.container)}>
          <div
            className={cs(
              styles.cookieclass,
              isPrefOpen ? styles.eucookieclass : styles.noneu,
              // styles.eucookieclass,
              isPrefOpen ? styles.euPref : ""
            )}
          >
            {isPrefOpen ? (
              <div className={styles.euWrapper}>
                <div className={styles.euInnerWrapper}>
                  <p className={styles.heading}>YOUR COOKIE PREFERENCES</p>
                  {regionName === "India" && (
                    <span
                      className={cs(
                        styles.closePopup,
                        fontStyles.icon,
                        fontStyles.iconCross,
                        styles.prefPopup
                      )}
                      onClick={() => {
                        hideCookie();
                      }}
                    ></span>
                  )}
                  <hr />
                  <p className={styles.question}>What is a cookie?</p>
                  <p className={styles.answer}>
                    Goodearth uses cookies, including third-party cookies, for
                    functional reasons, for statistical analysis, to personalise
                    your experience, offer you content that targets your
                    particular interests and analyse the performance of our
                    advertising campaigns.
                  </p>
                  <p className={styles.prefhead}>Manage Cookie Preferences</p>
                  <div className={styles.prefWrp}>
                    {consents?.map((ele, i) => (
                      <div className={styles.prefBlock} key={ele?.id}>
                        <div className={styles.prefSubBlock}>
                          <p className={styles.prefQue}>{ele?.name}</p>
                          <p className={styles.prefAns}>{ele?.description}</p>
                        </div>
                        <div className={styles.prefToggleWrp}>
                          <ToggleSwitch
                            id={`${ele?.id}${i}`}
                            checked={ele?.value}
                            changeValue={changeValue}
                            small={true}
                            disabled={!ele?.is_editable}
                          />
                          {!ele?.is_editable ? (
                            <p className={styles.prefActive}>Always Active</p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.btnWrp}>
                  <button
                    className={styles.savebtn}
                    onClick={() => {
                      setIsPrefOpen(false), savePref();
                    }}
                  >
                    save preferences
                  </button>
                  <button
                    className={styles.acceptbtn}
                    onClick={() => acceptAll()}
                  >
                    accept all
                  </button>
                </div>
              </div>
            ) : (
              <>
                {regionName === "India" && (
                  <span
                    className={cs(
                      styles.closePopup,
                      fontStyles.icon,
                      fontStyles.iconCross
                    )}
                    onClick={() => {
                      hideCookie();
                    }}
                  ></span>
                )}
                <h3>COOKIES & PRIVACY</h3>
                <p style={{ textAlign: "center" }}>
                  This website uses cookies to ensure you get the best
                  experience on our website. Please read our&nbsp;
                  <Link to={"/customer-assistance/cookie-policy"}>
                    Cookie Policy
                  </Link>
                  &nbsp; and{" "}
                  <Link to={"/customer-assistance/privacy-policy"}>
                    Privacy Policy.
                  </Link>
                </p>
                {/* {regionName !== "Europe" ? ( */}
                <p
                  className={styles.preferencesLink}
                  onClick={() => setIsPrefOpen(true)}
                >
                  set my cookie preferences
                </p>
                {/* ) : null} */}
                <span
                  className={cs(styles.okBtn, isPrefOpen ? styles.euBtn : "")}
                  onClick={() => acceptAndContinue()}
                >
                  ACCEPT & CONTINUE
                </span>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CookiePolicy;
