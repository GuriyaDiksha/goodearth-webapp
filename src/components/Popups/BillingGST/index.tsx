import React, { useContext, useState } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { GA_CALLS } from "constants/cookieConsent";
import CookieService from "services/cookie";
import AddressService from "services/address";
import Button from "components/Button";

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
  setGst: (data: boolean) => any;
  setGstDetails: (data: { gstText: string; gstType: string }) => any;
  setSameAsShipping: (data: boolean) => any;
  isBridal: boolean;
  isGoodearthShipping: boolean;
};

const BillingGST: React.FC<PopupProps> = ({
  setGst,
  setGstDetails,
  setSameAsShipping
}) => {
  const { closeModal } = useContext(Context);
  const [gstText, setGstText] = useState("");
  const [gstType, setGstType] = useState("GSTIN");
  const [error, setError] = useState("");
  const { billingAddressId } = useSelector((state: AppState) => state.address);
  const { currency, user } = useSelector((state: AppState) => state);
  const { mobile } = useSelector((state: AppState) => state.device);
  const dispatch = useDispatch();

  const msg = [
    "To be able to create a GST invoice, your billing address state must match the state registered with your GST no.",
    "GST can not apply for non Indian billing address.",
    "Please select billing address"
  ];

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

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (msg.includes(error)) {
      setGst(false);
      setGstDetails({ gstText: "", gstType: "" });
      closeModal();
      dispatch(setSameAsShipping(false));
    } else {
      if (billingAddressId === 0) {
        setError("Please select billing address");
        return false;
      }
      if (gstValidation()) {
        const userConsent = CookieService.getCookie("consent").split(",");

        if (userConsent.includes(GA_CALLS)) {
          dataLayer.push({
            event: "gst_invoice_popup",
            click_type: gstType
          });
        }
        AddressService.validateGST(dispatch, {
          billingAddressId: billingAddressId,
          gstNo: gstText,
          gstType
        })
          .then(res => {
            if (res?.is_validated) {
              setGstDetails({ gstText, gstType });
              setGst(true);
              closeModal();
            }
          })
          .catch(err => {
            if (!err.response.data.status) {
              setError(err.response.data?.message?.msg);
            }
          });
      }
    }
  };

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          globalStyles.textCenter,
          {
            [styles.centerpageDesktopFsWidth]: mobile,
            [styles.centerpageDesktopFs]: !mobile
          }
        )}
      >
        <div className={styles.headWrp}>
          <div className={styles.deliveryHead}>Billing Address</div>
          <div
            className={cs(styles.cross, styles.deliveryIcon)}
            onClick={() => {
              setGst(false);
              setGstDetails({ gstText: "", gstType: "" });
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
                className={cs(styles.input, styles.gstInput, styles.marginR10, {
                  [styles.formGstError]: error
                })}
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
        {user.customerGroup == "loyalty_cerise_club" ||
        user.customerGroup == "loyalty_cerise_sitara" ? (
          <div className={cs(styles.ceriseGstDisclaimer)}>
            Note: You will not be earning any cerise loyalty points on GST
            billing
          </div>
        ) : (
          ""
        )}
        <div className={cs(globalStyles.paddBottom20)}>
          <Button
            variant="mediumMedCharcoalCta366"
            onClick={e => handleSubmit(e)}
            label={
              msg.includes(error) ? "EDIT BILLING ADDRESS" : "SAVE & PROCEED"
            }
            className={cs({ [globalStyles.btnFullWidthForPopup]: mobile })}
          />
        </div>
      </div>
    </div>
  );
};

export default BillingGST;
