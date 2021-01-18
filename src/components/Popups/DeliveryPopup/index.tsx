import React, { useContext, useState } from "react";
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
import { NavLink } from "react-router-dom";

type PopupProps = {
  saveInstruction: (data: string) => any;
  // closeModal: (data?: any) => any;
  // acceptCondition: (data?: any) => any;
};

const Delivery: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useContext(Context);
  //   const currency = useSelector((state: AppState) => state.currency);
  const [textarea, setTextarea] = useState("");

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktopFs,
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
        <div className={cs(styles.gcTnc)}>
          <div className={globalStyles.c22AI}>Delivery Instructions</div>
          {/* <div className={globalStyles.c10LR}> */}
          <div>
            <div className={styles.deliverSubheading}>
              Please Provide specific deliver instruction for this order.
              {/* You’re a step away from{" "}
              <span className={styles.linkTextUnderline}>free shipping!</span> */}
            </div>
            <div
              className={cs(globalStyles.voffset3, styles.deliverSubheading)}
            >
              <div>
                <textarea
                  rows={5}
                  cols={45}
                  className={styles.deliverMessage}
                  value={textarea}
                  maxLength={250}
                  placeholder={
                    "Type here.For Example,Leave my parcel with the Gaurd"
                  }
                  autoComplete="new-password"
                  onChange={(e: any) => {
                    setTextarea(e.target.value);
                  }}
                />
                <div
                  className={cs(
                    globalStyles.textLeft,
                    styles.font14,
                    styles.freeDelivery
                  )}
                >
                  Character Limit: {250 - textarea.length}
                </div>
              </div>
            </div>
            <div className={cs(globalStyles.voffset3, styles.freeShipping)}>
              {" "}
              Your instructions help us provide you with a seamless online
              shopping experience.Kindly note, our deliver teams reserve the
              right to refuse certain instructions under special circumstance.
              Read T&C to know more.
            </div>
          </div>
        </div>
        <div
          className={cs(
            globalStyles.ceriseBtn,
            styles.ceriseBtnWidth,
            styles.marginBottom
          )}
        >
          <NavLink
            to="/"
            onClick={e => {
              e.preventDefault();
              props.saveInstruction(textarea);
              closeModal();
            }}
          >
            SAVE & PROCEED
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
