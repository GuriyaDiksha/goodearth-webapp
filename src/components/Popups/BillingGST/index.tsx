import React, { useContext, useEffect, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const desc = {
  GSTIN:
    "Goods and Services Tax Identification Number (GSTIN) is a tax registration number. Every taxpayers is assigned a state-wise PAN-based 15 digit GSTIN.",
  UID:
    "Unique Identificatin Number (UIN) is a special class of GST registration for foreign diplomatic missions and embassies."
};
const title = {
  GSTIN: "Goods and Services Tax Identification Number (GSTIN)",
  UID: "Unique Identificatin Number (UIN)"
};

type PopupProps = {
  onSubmit: (address: null, gstType: string, gstText: string) => any;
  setGst: (data: boolean) => any;
  gstNum: string;
  parentError: string;
  isActive: boolean;
  setGstNum: (data: string) => any;
  sameAsShipping: boolean;
};

const BillingGST: React.FC<PopupProps> = ({
  onSubmit,
  setGst,
  gstNum,
  parentError,
  isActive,
  setGstNum,
  sameAsShipping
}) => {
  const { closeModal } = useContext(Context);
  const [gstText, setGstText] = useState("");
  const [gstType, setGstType] = useState("GSTIN");
  const [error, setError] = useState("");
  const { addressList, shippingAddressId, billingAddressId } = useSelector(
    (state: AppState) => state.address
  );
  const address: any =
    addressList?.find((val: any) =>
      shippingAddressId !== 0
        ? sameAsShipping
          ? val?.id === shippingAddressId
          : val?.id === billingAddressId
        : val?.isDefaultForShipping === true
    ) || undefined;

  useEffect(() => {
    setGstText(gstNum);
  }, [gstNum]);

  useEffect(() => {
    setError(parentError);
    if (parentError === "" && !isActive) {
      setError("");
      closeModal();
    }
  }, [parentError, isActive]);

  const onChangeGst = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGstType(e.target.value);
    setError("");
    setGstText("");
  };
  const onCouponChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGstText(event.target.value);
    setError("");
  };

  const gstValidation = () => {
    if (gstText.length > 0) {
      if (gstText.length != 15 && gstType == "GSTIN") {
        setError("Please enter a valid GST Number");
        return false;
      } else if (gstText.length != 15 && gstType == "UID") {
        setError("Please enter a valid UIN Number");
        return false;
      } else {
        setError("");
        return true;
      }
    } else {
      const text = gstType == "GSTIN" ? "GST" : "UIN";

      setError("Please enter a " + text + " number");
      return false;
    }
  };

  const RadioButton = (props: { gstType: string }) => {
    return (
      <label className={styles.container}>
        <input
          type="radio"
          name="editList"
          defaultChecked={gstType == props.gstType}
          value={props.gstType}
          onChange={onChangeGst}
        />
        <span className={styles.checkmark}> </span>{" "}
        <span className={styles.txtGst}>
          {props.gstType == "UID" ? "UIN" : props.gstType}
        </span>
      </label>
    );
  };

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
          <div className={styles.deliveryHead}>Billing Address</div>
          <div
            className={cs(styles.cross, styles.deliveryIcon)}
            onClick={() => {
              setGst(false);
              setGstNum("");
              closeModal();
            }}
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
        <div className={cs(globalStyles.paddT0, styles.gcTnc)}>
          <div className={styles.radioList}>
            <RadioButton key="GSTIN" gstType="GSTIN" />
            <RadioButton key="UID" gstType="UID" />
          </div>

          <div className={cs(globalStyles.textLeft, globalStyles.marginLR40)}>
            <div className={cs(styles.gstTitle)}>{title[gstType]}</div>
            <div className={cs(styles.gstDesc)}>{desc[gstType]}</div>
          </div>

          <div className={styles.form}>
            <div
              className={cs(
                styles.flex,
                styles.vCenter,
                globalStyles.voffset3,
                styles.payment
              )}
            >
              <input
                type="text"
                className={cs(styles.input, styles.marginR10)}
                onChange={e => onCouponChange(e)}
                value={gstText}
                aria-label="billing-gst"
              />
            </div>
            <label className={styles.formLabel}>
              {gstType == "GSTIN" ? "GST No.*" : "UIN No.*"}
            </label>
            {error ? (
              <span
                className={cs(
                  globalStyles.errorMsg,
                  globalStyles.wordCap,
                  globalStyles.textLeft,
                  globalStyles.flex,
                  styles?.errorGst
                )}
              >
                {error}
              </span>
            ) : (
              ""
            )}
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
              if (gstValidation()) {
                onSubmit(address, gstText, gstType);
              }
            }}
          >
            SAVE & PROCEED
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default BillingGST;
