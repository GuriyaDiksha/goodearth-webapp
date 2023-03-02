import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { NavLink } from "react-router-dom";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

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
  onSubmit: () => any;
  onCouponChange: (e: ChangeEvent<HTMLInputElement>) => any;
  onChangeGst: (e: ChangeEvent<HTMLInputElement>) => any;
  gstType: string;
  gstText: string;
  error: string;
};

const BillingGST: React.FC<PopupProps> = ({
  onSubmit,
  onCouponChange,
  onChangeGst,
  gstType,
  gstText,
  error
}) => {
  const { closeModal } = useContext(Context);

  console.log("test 22===", gstText, gstType, error);

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

  const onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onSubmit();
      event.preventDefault();
    }
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
                onKeyPress={e => onKeyPress(e)}
                value={gstText}
              />
            </div>
            <label className={styles.formLabel}>
              {gstType == "GSTIN" ? "GST No.*" : "UIN No.*"}
            </label>
            {error ? (
              <span className={cs(globalStyles.errorMsg, globalStyles.wordCap)}>
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
              onSubmit();
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

export default BillingGST;
