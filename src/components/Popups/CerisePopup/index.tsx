import React, { useContext, useEffect } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
// import { PopupProps } from "./typings";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import banner from "../../../images/ceriseRewards/banner.gif";
import bannerMobile from "../../../images/ceriseRewards/bannerMobile.gif";
import logo from "../../../images/ceriseRewards/logo.svg";
import baloonPink from "../../../images/ceriseRewards/baloonPink.png";
import baloonYellow from "../../../images/ceriseRewards/baloonYellow.png";
import cerisestar from "../../../images/cerisestar.png";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
// import { useHistory } from "react-router";

type PopupProps = {
  acceptCondition: (data?: any) => any;
};

const CerisePopup: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useContext(Context);
  const { mobile } = useSelector((state: AppState) => state.device);
  // const history = useHistory();
  useEffect(() => {
    const btn = document.getElementById("info-popup-accept-button");
    btn?.focus();
  }, []);

  return (
    <div>
      <div
        className={cs(
          { [styles.cerisepop]: !mobile },
          { [styles.cerisemobile]: mobile },
          globalStyles.textCenter,
          { [bootstrapStyles.row]: !mobile }
        )}
      >
        <div
          className={cs(
            bootstrapStyles.colLg6,
            { [styles.leftImg]: !mobile },
            { [styles.imgpadding]: mobile },
            bootstrapStyles.colSm12
          )}
        >
          {mobile && (
            <div className={styles.cross} onClick={closeModal}>
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconCrossNarrowBig,
                  styles.icon,
                  styles.iconCross
                )}
              ></i>
            </div>
          )}
          <img
            src={mobile ? bannerMobile : banner}
            className={styles.desktopimage}
          />
          <img src={logo} className={styles.logo} />
        </div>
        <div
          className={cs(
            bootstrapStyles.colLg6,
            bootstrapStyles.colSm12,
            styles.overflow
          )}
        >
          {!mobile && (
            <div className={styles.cross} onClick={closeModal}>
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconCrossNarrowBig,
                  styles.icon,
                  styles.iconCross
                )}
              ></i>
            </div>
          )}
          <img src={baloonYellow} className={styles.baloon1} />
          <img src={baloonPink} className={styles.baloon2} />
          <div className={mobile ? styles.contentmobile : styles.ceriseContent}>
            <p className={styles.heading}>
              The Treat <br />
              <span>is on us!</span>
            </p>
            <p className={styles.subheading}>
              It&apos;s Good Earth&apos;s
              <br />
              birthday weekend
            </p>
            <p className={styles.subheading1}>
              Earn Double Reward Points
              <br />
              on this special occasion
              <br />
              for extra cheer
            </p>
            <p>
              <img src={cerisestar} className={styles.star} />
            </p>
            <p className={styles.date}>
              {" "}
              20<sup>th</sup> - 23<sup>rd</sup> January
            </p>
            <button
              onClick={() => {
                // history.push("/cerise");
                closeModal();
              }}
              className={cs(styles.button)}
            >
              EARN NOW
            </button>

            <p className={styles.bottom}>
              On this special occasion, we&apos;re offering our Cerise Members
              an exclusive opportunity to earn Double Reward Points on all
              purchases made online or in-store. T&C Apply*
            </p>
            <p className={cs(styles.bottom, styles.bottom2)}>
              *1 point = 1 INR | *Promo ends on 23<sup>rd</sup> January
            </p>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default CerisePopup;
