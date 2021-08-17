import React, { useContext, useEffect } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
// import { PopupProps } from "./typings";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import cerisereward from "../../../images/cerisereward.png";
import ceriserewardmobile from "../../../images/ceriserewardMobile.png";
import cerisestar from "../../../images/cerisestar.png";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { useHistory } from "react-router";

type PopupProps = {
  acceptCondition: (data?: any) => any;
};

const CerisePopup: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useContext(Context);
  const { mobile } = useSelector((state: AppState) => state.device);
  const history = useHistory();
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
            bootstrapStyles.colMd6,
            { [styles.leftImg]: !mobile },
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
            src={mobile ? ceriserewardmobile : cerisereward}
            className={globalStyles.imgResponsive}
          />
        </div>
        <div className={cs(bootstrapStyles.colMd6, bootstrapStyles.colSm12)}>
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
          <div className={mobile ? styles.contentmobile : styles.content}>
            <p className={styles.heading}>
              when <br />
              <span>STARS</span> align
            </p>
            <p className={styles.subheading}>
              It&apos;s the Cerise Anniversary Weekend.
            </p>
            <p className={styles.subheading1}>
              Celebrate with us by earning Double Rewards Points.
            </p>
            <p>
              <img src={cerisestar} className={styles.star} />
            </p>
            <p className={styles.date}>
              {" "}
              19<sup>th</sup> - 22<sup>nd</sup> August
            </p>
            <button
              onClick={() => {
                history.push("/cerise");
                closeModal();
              }}
              className={cs(styles.button)}
            >
              EARN NOW
            </button>

            <p className={styles.bottom}>
              On this special occasion, we’re offering our Cerise Members an
              exclusive opportunity to earn Double Reward Points on all
              purchases made online or in-store.
            </p>
            <p className={styles.bottom}>
              *1 point = 1 INR | *Promo ends at 4 pm 22nd August.
            </p>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default CerisePopup;
