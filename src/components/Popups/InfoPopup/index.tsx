import React, { useContext, useEffect } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
// import { PopupProps } from "./typings";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";

type PopupProps = {
  //   remainingAmount: number;
  // closeModal: (data?: any) => any;
  acceptCondition: (data?: any) => any;
};

const FreeShipping: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useContext(Context);
  // const currency = useSelector((state: AppState) => state.currency);

  useEffect(() => {
    const btn = document.getElementById("info-popup-accept-button");
    btn?.focus();
  }, []);

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
        <div className={styles.gcTnc}>
          <div className={globalStyles.c22AI}>Please Note</div>
          <div className={globalStyles.c10LR}>
            {/* <p>
              Your safety is our priority. All standard WHO guidelines and
              relevant precautionary measures are in place, to ensure a safe and
              secure shopping experience for you.
            </p>
            {currency == "INR" ? (
              <p>
                We are currently experiencing a hold-up in our delivery
                operations due to sealed borders, in and around Delhi. The
                developing situation is being closely monitored and we will get
                your orders to you as soon as possible. For further assistance,
                do reach out to us at{" "}
                <b className={globalStyles.cerise}>customercare@goodearth.in</b>
              </p>
            ) : (
              <p>
                For any further assistance reach out to us at{" "}
                <b className={globalStyles.cerise}>customercare@goodearth.in</b>
              </p>
            )} */}
            <p>
              Due to Covid-19 and the evolving restrictions on movement, there
              may be an impact on delivery timelines.
            </p>
            <p>
              We thank you for your understanding and will do our best to
              deliver to you at the earliest.
            </p>
          </div>
          <div
            className={cs(
              globalStyles.ceriseBtn,
              styles.ceriseBtn30,
              globalStyles.marginT20
            )}
          >
            <a
              id="info-popup-accept-button"
              tabIndex={-1}
              onClick={() => {
                props.acceptCondition();
                closeModal();
              }}
            >
              OK
            </a>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default FreeShipping;
