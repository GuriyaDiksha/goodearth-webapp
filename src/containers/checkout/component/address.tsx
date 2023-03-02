import React, {
  useEffect,
  ReactElement,
  useContext,
  useState,
  useMemo
} from "react";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { AddressProps } from "./typings";
import { updateAddressList } from "actions/address";
import AddressService from "services/address";
import { useDispatch, useSelector } from "react-redux";
import * as Steps from "../constants";
import UserContext from "contexts/user";
import { AddressContext } from "components/Address/AddressMain/context";
import { AppState } from "reducers/typings";
import { AddressData } from "components/Address/typings";
import * as valid from "utils/validate";
import { CheckoutAddressContext } from "./context";
import { Currency, currencyCode } from "typings/currency";
import checkmarkCircle from "./../../../images/checkmarkCircle.svg";

const AddressSection: React.FC<AddressProps & {
  mode: string;
  children: React.ReactNode;
}> = props => {
  const {
    mode,
    children,
    activeStep,
    isActive,
    isBridal,
    selectedAddress,
    isGoodearthShipping,
    hidesameShipping,
    next,
    errorNotification
  } = props;
  const { isLoggedIn } = useContext(UserContext);
  const {
    openAddressForm,
    closeAddressForm,
    isAddressValid,
    currentCallBackComponent
  } = useContext(AddressContext);
  const { currency, user } = useSelector((state: AppState) => state);
  const { basket } = useSelector((state: AppState) => state);
  const { mobile } = useSelector((state: AppState) => state.device);
  const { addressList } = useSelector((state: AppState) => state.address);
  const sameShipping =
    (props.activeStep == Steps.STEP_BILLING ? true : false) &&
    props.hidesameShipping &&
    !isGoodearthShipping &&
    !props.isBridal;

  const amountPrice = {
    INR: 200000,
    USD: 2500,
    GBP: 1800,
    AED: 9300,
    SGD: 3500
  };

  const code = currencyCode[currency as Currency];

  const [sameAsShipping, setSameAsShipping] = useState(sameShipping);
  const [gst, setGst] = useState(false);
  const [gstText, setGstText] = useState("");
  const [pancardText, setPancardText] = useState(user.panPassport || "");
  const [pancardCheck, setPancardCheck] = useState(false);
  const [panError, setPanError] = useState("");
  const [panCheck, setPanCheck] = useState("");
  const [gstType, setGstType] = useState("GSTIN");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedIn && currentCallBackComponent == "checkout-shipping") {
      AddressService.fetchAddressList(dispatch).then(addressList => {
        dispatch(updateAddressList(addressList));
      });
    }
  }, [isLoggedIn]);
  const openNewAddressForm = () => {
    setSameAsShipping(false);
    openAddressForm();
  };

  const backToAddressList = () => {
    closeAddressForm();
  };

  useEffect(() => {
    setPancardText(user.panPassport || "");
  }, [user.panPassport]);

  useEffect(() => {
    setSameAsShipping(!isGoodearthShipping && hidesameShipping && !isBridal);
  }, [isGoodearthShipping, hidesameShipping, isBridal]);

  useEffect(() => {
    setPanError("");
    setPanCheck("");
    if (currency != "INR") {
      setGst(false);
    }
  }, [currency]);
  const renderActions = function(isBottom?: boolean) {
    if (isActive && isLoggedIn) {
      const clickAction =
        mode == "list" ? openNewAddressForm : backToAddressList;
      const fullText =
        mode == "new" || mode == "edit"
          ? "< BACK TO SAVED ADDRESSES"
          : "[+] ADD NEW ADDRESS";
      const mobileText =
        mode == "new" || mode == "edit" ? "< BACK" : "[+] ADD ADDRESS";
      if (isBridal && activeStep == Steps.STEP_SHIPPING) return "";
      return (
        <div
          className={cs(
            {
              [bootstrapStyles.col6]: !isBottom,
              [bootstrapStyles.colMd6]: !isBottom,
              [bootstrapStyles.col12]: isBottom,
              [bootstrapStyles.colMd12]: isBottom,
              [globalStyles.paddTop20]: isBottom
            },
            styles.small,
            globalStyles.textRight
          )}
        >
          <div
            className={cs(styles.formSubheading, globalStyles.pointer)}
            onClick={clickAction}
          >
            {mobile ? <span>{mobileText}</span> : <span>{fullText}</span>}
          </div>
        </div>
      );
    }
  };

  const handleStepEdit = () => {
    activeStep == Steps.STEP_SHIPPING
      ? next(Steps.STEP_SHIPPING)
      : next(Steps.STEP_BILLING);
  };

  const renderSavedAddress = function() {
    const address = selectedAddress;

    if (!isActive && address && isBridal && activeStep == Steps.STEP_SHIPPING) {
      // saved address for bridal
      return (
        <div
          className={cs(
            bootstrapStyles.col12,
            bootstrapStyles.colMd6,
            styles.small,
            styles.selectedStvalue
          )}
        >
          <div>
            <span className={globalStyles.marginR10}>
              {address.registrantName} & {address.coRegistrantName}&#39;s &nbsp;
              {address.occasion} Registry
            </span>
          </div>
          <div>
            <span className={globalStyles.marginR10}>(Address predefined)</span>
          </div>
        </div>
      );
    } else if (!isActive && address) {
      // saved address for not bridal
      return (
        <div
          className={cs(
            bootstrapStyles.col12,
            bootstrapStyles.colMd6,
            styles.small,
            styles.selectedStvalue
          )}
        >
          <div>
            <span className={globalStyles.marginR10}>
              {address.firstName} {address.lastName}
            </span>
            <span>Contact No. {address.phoneNumber}</span>
          </div>
          <div>
            {address.line1}, {address.line2}
          </div>
          <div>
            <span className={globalStyles.marginR10}>
              {address.city} {address.postCode}, {address.state},{" "}
              {address.countryName}
            </span>
            <span
              className={cs(globalStyles.colorPrimary, globalStyles.pointer)}
              onClick={handleStepEdit}
            >
              Edit
            </span>
          </div>
          {currentCallBackComponent == "checkout-shipping" && (
            <>
              <hr />
              <p className={styles.contactMsg}>
                <b>Note: </b>
                {`${address.phoneCountryCode} ${address.phoneNumber} will be used for sending OTP during delivery.`}
                <br /> Please ensure it is a mobile number.
              </p>
            </>
          )}
        </div>
      );
    } else if (props.addresses.length == 0) {
      // props.openAddressForm();
    }
  };
  const onChangeGst = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGstType(e.target.value);
    setPanError("");
    setError("");
    setGstText("");
  };

  const onPanKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const onCouponChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGstText(event.target.value);
    setError("");
  };

  const onPanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPancardText(event.target.value);
  };

  const togglepancard = () => {
    setPancardCheck(!pancardCheck);
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

  const toggleGstInvoice = () => {
    setGst(!gst);
  };

  const toggleSameAsShipping = () => {
    setSameAsShipping(!sameAsShipping);
  };

  const checkPancardValidation = () => {
    let validate = false;
    if (
      pancardText.length == 10 ||
      (currency != "INR" && !valid.checkBlank(pancardText))
    ) {
      setPanError("");
      setPanCheck("");
      validate = true;
    } else if (valid.checkBlank(pancardText)) {
      setPanError(
        currency == "INR"
          ? "Please enter your PAN Number"
          : "Please enter your Passport Number"
      );
      setPanCheck("");
      validate = false;
    } else {
      setPanError(
        currency == "INR"
          ? "Please enter a valid PAN Number"
          : "Please enter a valid Passport Number"
      );
      setPanCheck("");
      validate = false;
    }
    if (!pancardCheck) {
      setPanCheck("Please confirm that the data you have provided is correct");
      validate = false;
    }
    return validate;
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

  const removeErrorMessages = () => {
    setError("");
    setPanError("");
    setPanCheck("");
  };

  const showErrorMsg = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorMsg
      )[0] as HTMLInputElement;

      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 500);
  };

  const onSubmit = (address?: AddressData) => {
    let validate = true;
    const addr = address || null;
    let numberObj: { gstNo?: string; gstType?: string; panPassportNo: string };
    const amountPriceCheck = amountPrice[currency] <= basket.total;

    if (gst) {
      numberObj = Object.assign(
        {},
        { gstNo: gstText, gstType: gstType, panPassportNo: pancardText }
      );
    } else {
      numberObj = Object.assign(
        {},
        { panPassportNo: amountPriceCheck ? pancardText : "" }
      );
    }

    if (amountPriceCheck && props.activeStep == Steps.STEP_BILLING) {
      if (!checkPancardValidation()) {
        validate = false;
      }
    }
    if (gst && props.activeStep == Steps.STEP_BILLING) {
      if (!gstValidation()) {
        validate = false;
      }
    }
    if (validate) {
      removeErrorMessages();
      props.finalizeAddress(addr, props.activeStep, numberObj);
      return validate;
    } else {
      showErrorMsg();
      return validate;
    }
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onSubmit();
      event.preventDefault();
    }
  };

  const handleSaveAndReview = () => {
    onSubmit();
  };

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
  const renderPancard = useMemo(() => {
    if (props.activeStep == Steps.STEP_BILLING) {
      const pass =
        currency == "INR"
          ? `AS PER RBI GOVERNMENT REGULATIONS, PAN DETAILS ARE MANDATORY FOR TRANSACTIONS ABOVE ${String.fromCharCode(
              ...code
            )} ${amountPrice[currency]}.`
          : `AS PER RBI GOVERNMENT REGULATIONS, PASSPORT DETAILS ARE MANDATORY FOR TRANSACTIONS ABOVE ${String.fromCharCode(
              ...code
            )} ${amountPrice[currency]}.`;
      const panText =
        currency == "INR" ? "PAN Card Number*" : " Passport Number*";
      return (
        <div>
          {currency == "INR" ? (
            <div>
              <label
                className={cs(
                  styles.flex,
                  styles.crossCenter,
                  globalStyles.voffset3
                )}
              >
                <div className={globalStyles.marginR10}>
                  <span className={styles.checkbox}>
                    <input
                      type="checkbox"
                      onChange={toggleGstInvoice}
                      checked={gst}
                    />
                    <span className={styles.indicator}></span>
                  </span>
                </div>
                <div className={styles.formSubheading}>
                  THIS IS A GST INVOICE
                </div>
              </label>
              {gst && (
                <div
                  className={cs(
                    styles.input2,
                    styles.formSubheading,
                    globalStyles.voffset3
                  )}
                >
                  <div className={styles.radioList}>
                    <RadioButton key="GSTIN" gstType="GSTIN" />
                    <RadioButton key="UID" gstType="UID" />
                  </div>
                  <div className={bootstrapStyles.row}>
                    <div
                      className={cs(
                        styles.gstTitle,
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd7
                      )}
                    >
                      {title[gstType]}
                    </div>
                    <div
                      className={cs(
                        styles.gstDesc,
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd7
                      )}
                    >
                      {desc[gstType]}
                    </div>
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
                        onChange={onCouponChange}
                        onKeyPress={onKeyPress}
                        value={gstText}
                      />
                    </div>
                    <label className={styles.formLabel}>
                      {gstType == "GSTIN" ? "GST No.*" : "UIN No.*"}
                    </label>
                    {error ? (
                      <span
                        className={cs(
                          globalStyles.errorMsg,
                          globalStyles.wordCap
                        )}
                      >
                        {error}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
          {amountPrice[currency] <= basket.total ? (
            <div
              className={cs(
                styles.input2,
                styles.formSubheading,
                globalStyles.voffset5
              )}
            >
              {pass}
              <div>
                <div className={styles.form}>
                  <div
                    className={cs(
                      styles.flex,
                      styles.vCenter,
                      globalStyles.voffset4,
                      styles.payment
                    )}
                  >
                    <input
                      type="text"
                      className={cs(
                        { [styles.disabledInput]: !!user.panPassport },
                        styles.input,
                        styles.marginR10,
                        { [styles.panError]: panError }
                      )}
                      onChange={onPanChange}
                      disabled={!!user.panPassport}
                      onKeyPress={onPanKeyPress}
                      value={pancardText}
                    />
                  </div>
                  <label className={styles.formLabel}>{panText}</label>
                  {panError ? (
                    <span className={globalStyles.errorMsg}>{panError}</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <label
                className={cs(
                  styles.flex,
                  styles.crossCenter,
                  globalStyles.voffset3
                )}
              >
                <div className={globalStyles.marginR10}>
                  <span className={styles.checkbox}>
                    <input
                      type="checkbox"
                      onChange={togglepancard}
                      checked={pancardCheck}
                    />
                    <span className={styles.indicator}></span>
                  </span>
                </div>
                <div className={styles.formSubheading}>
                  I CONFIRM THAT THE DATA I HAVE SHARED IS CORRECT
                </div>
              </label>
              {panCheck ? (
                <span className={globalStyles.errorMsg}>{panCheck}</span>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          <hr className={globalStyles.voffset4} />
        </div>
      );
    }
  }, [
    gst,
    gstText,
    panCheck,
    pancardCheck,
    panError,
    error,
    gstType,
    props.activeStep,
    basket.total,
    pancardText,
    currency
  ]);

  const renderBillingCheckbox = function() {
    const show =
      !props.isBridal && !props.isGoodearthShipping && mode == "list";

    return (
      show && (
        <div className={cs(styles.payment, globalStyles.voffset4)}>
          <label className={cs(styles.flex, styles.crossCenter)}>
            <div className={globalStyles.marginR10}>
              <span className={styles.checkbox}>
                <input
                  type="checkbox"
                  onChange={toggleSameAsShipping}
                  checked={sameAsShipping}
                />
                <span className={styles.indicator}></span>
              </span>
            </div>
            <div className={styles.formSubheading}>
              BILLING ADDRESS IS SAME AS SHIPPING ADDRESS
            </div>
          </label>
          {sameAsShipping && (
            <div className={bootstrapStyles.row}>
              <div
                className={cs(
                  bootstrapStyles.col12,
                  bootstrapStyles.colMd7,
                  globalStyles.voffset4
                )}
              >
                <button
                  className={cs(globalStyles.ceriseBtn, globalStyles.marginT20)}
                  type="submit"
                  onClick={handleSaveAndReview}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}
          {!sameAsShipping && isLoggedIn && (
            <div>
              <div className={cs(styles.sameText, styles.formSubheading)}>
                OR SELECT AN ADDRESS BELOW
              </div>
            </div>
          )}
        </div>
      )
    );
  };

  const onSelectAddress = (address?: AddressData) => {
    if (address) {
      const isValid = isAddressValid(address);
      if (isValid) {
        onSubmit(address);
      } else {
        openAddressForm(address);
      }
    }
  };
  const renderCheckoutAddress = () => {
    let html: ReactElement | null = null;

    if (isBridal && activeStep == Steps.STEP_SHIPPING) {
      html = (
        <div className={globalStyles.marginT20}>
          <div
            className={
              isActive
                ? cs(styles.card, styles.cardOpen, styles.marginT20)
                : cs(styles.card, styles.cardClosed, styles.marginT20)
            }
          >
            <div className={bootstrapStyles.row}>
              <div
                className={cs(
                  bootstrapStyles.col6,
                  bootstrapStyles.colMd6,
                  globalStyles.flex,
                  styles.title
                )}
              >
                <img
                  height={"18px"}
                  className={globalStyles.marginR10}
                  src={checkmarkCircle}
                  alt="checkmarkdone"
                />

                <span className={cs({ [styles.closed]: !isActive })}>
                  {activeStep == Steps.STEP_SHIPPING
                    ? "SHIPPING DETAILS"
                    : "BILLING DETAILS"}
                </span>
              </div>
              {renderActions(false)}
              {renderSavedAddress()}
            </div>
            {isActive && (
              <>
                <div>
                  {children}
                  {props.error ? (
                    <div
                      className={cs(
                        globalStyles.errorMsg,
                        globalStyles.marginT20
                      )}
                    >
                      {props.error}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {addressList.length > 1 &&
                  mode == "list" &&
                  renderActions(true)}
              </>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className={globalStyles.marginT20}>
          <div
            className={
              isActive
                ? cs(styles.card, styles.cardOpen, styles.marginT20)
                : cs(styles.card, styles.cardClosed, styles.marginT20)
            }
          >
            <div className={bootstrapStyles.row}>
              <div
                className={cs(
                  bootstrapStyles.col6,
                  bootstrapStyles.colMd6,
                  globalStyles.flex,
                  styles.title
                )}
              >
                <img
                  height={"18px"}
                  className={globalStyles.marginR10}
                  src={checkmarkCircle}
                  alt="checkmarkdone"
                />
                <span className={cs({ [styles.closed]: !isActive })}>
                  {activeStep == Steps.STEP_SHIPPING
                    ? "SHIPPING DETAILS"
                    : "BILLING DETAILS"}
                </span>
              </div>
              {renderActions(false)}
              {renderSavedAddress()}
            </div>
            {console.log("check===", children)}
            {isActive && (
              <>
                <div>
                  <div>{renderPancard}</div>
                  {props.activeStep == Steps.STEP_BILLING &&
                    props.hidesameShipping && (
                      <div>{renderBillingCheckbox()}</div>
                    )}

                  {// logged in Shipping & billing
                  isLoggedIn &&
                    (props.activeStep == Steps.STEP_SHIPPING ||
                      (props.activeStep == Steps.STEP_BILLING &&
                        !sameAsShipping)) && <div>{children}</div>}

                  {props.error ? (
                    <div
                      className={cs(
                        globalStyles.errorMsg,
                        globalStyles.marginT20
                      )}
                    >
                      {props.error}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {addressList.length > 1 &&
                  mode == "list" &&
                  (props.activeStep == Steps.STEP_SHIPPING ||
                    (props.activeStep == Steps.STEP_BILLING &&
                      !props.hidesameShipping)) &&
                  renderActions(true)}
              </>
            )}
            {props.activeStep == Steps.STEP_SHIPPING && !isActive && (
              <div
                className={cs(
                  { [globalStyles.errorMsg]: errorNotification },
                  globalStyles.marginT20,
                  {
                    [styles.margin50]: !mobile
                  }
                )}
              >
                <span>{errorNotification}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return html;
  };
  return (
    <CheckoutAddressContext.Provider
      value={{
        onSelectAddress: onSelectAddress
      }}
    >
      {renderCheckoutAddress()}
    </CheckoutAddressContext.Provider>
  );
};

export default AddressSection;
