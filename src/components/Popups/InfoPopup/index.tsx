import React, { useContext } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
// import { PopupProps } from "./typings";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context.ts";
// import { currencyCodes } from "constants/currency";
// import { useSelector } from "react-redux";
// import { AppState } from "reducers/typings";

type PopupProps = {
  //   remainingAmount: number;
  // closeModal: (data?: any) => any;
  acceptCondition: (data?: any) => any;
};

const FreeShipping: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useContext(Context);
  //   const currency = useSelector((state: AppState) => state.currency);

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
            <p>
              Your safety is our priority. All standard WHO guidelines and
              relevant precautionary measures are in place, to ensure a safe and
              secure shopping experience for you.
            </p>
            <p>
              Please use our Pincode Detector to check if your area (within
              India) is currently serviceable.
            </p>
            <p>
              Good Earth invites you to discover{" "}
              <b className={globalStyles.cerise}>Styles that Sustain</b>, the
              Good Earth Annual Apparel Sale, featuring handpicked sustainable
              styles.
            </p>
            <p>
              For any further assistance reach out to us at{" "}
              <b className={globalStyles.cerise}>customercare@goodearth.in</b>
            </p>
          </div>
          <div className={cs(globalStyles.ceriseBtn, styles.ceriseBtn30)}>
            <a
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
