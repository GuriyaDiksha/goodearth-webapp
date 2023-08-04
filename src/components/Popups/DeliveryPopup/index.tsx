import React, { useContext, useEffect, useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
// import { PopupProps } from "./typings";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { NavLink } from "react-router-dom";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

type PopupProps = {
  saveInstruction: (data: string) => any;
  // closeModal: (data?: any) => any;
  // acceptCondition: (data?: any) => any;
};

const Delivery: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useContext(Context);
  const [textarea, setTextarea] = useState("");
  const { deliveryText } = useSelector((state: AppState) => state.info);

  useEffect(() => {
    setTextarea(deliveryText);
  }, []);

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
        <div className={styles.headWrp}>
          <div className={styles.deliveryHead}>Delivery Instructions</div>
          <div
            className={cs(styles.cross, styles.deliveryIcon)}
            onClick={closeModal}
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
        </div>
        <div className={cs(globalStyles.paddT20, styles.gcTnc)}>
          {/* <div className={globalStyles.c10LR}> */}
          <div>
            <div className={styles.deliverSubheading}>
              Please provide specific delivery instructions for this order.
              {/* You’re a step away from{" "}
              <span className={styles.linkTextUnderline}>free shipping!</span> */}
            </div>
            <div
              className={cs(
                globalStyles.voffset3,
                globalStyles.marginLR24,
                globalStyles.marginLR35
              )}
            >
              <div>
                <textarea
                  rows={5}
                  cols={100}
                  className={styles.deliverMessage}
                  value={textarea}
                  maxLength={250}
                  placeholder={
                    "Type here. For example,\n Leave my parcel with the Gaurd"
                  }
                  autoComplete="new-password"
                  onChange={(e: any) => {
                    setTextarea(e.target.value);
                  }}
                />
                <div className={cs(styles.freeDelivery, globalStyles.textLeft)}>
                  Char Limit: {250 - textarea.length} / 250
                </div>
              </div>
            </div>
            <div className={cs(globalStyles.voffset3, styles.freeInstruction)}>
              {" "}
              Your instructions help us provide you with a seamless online
              shopping experience. Kindly note, our delivery teams reserve the
              right to refuse certain instructions under special circumstances.
              {/* <a
                href={"/customer-assistance/terms-conditions "}
                className={styles.terms}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Read T&C{" "}
              </a>
              to know more. */}
            </div>
          </div>
        </div>
        <div
          className={cs(
            globalStyles.checkoutBtn,
            styles.deliveryBtnWidth,
            styles.freeshipBtnWidth,
            styles.marginBottom
          )}
        >
          <NavLink
            to="/"
            onClick={e => {
              e.preventDefault();
              props.saveInstruction(textarea.trim());
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
