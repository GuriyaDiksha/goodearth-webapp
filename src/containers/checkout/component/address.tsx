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
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";

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
  const [pancardText, setPancardText] = useState(user.panPassport || "");
  const [pancardCheck, setPancardCheck] = useState(false);
  const [panError, setPanError] = useState("");
  const [panCheck, setPanCheck] = useState("");
  const [isTermChecked, setIsTermChecked] = useState(false);

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
            styles.selectedStvalue,
            {
              [styles.checkoutSelectedValue]:
                currentCallBackComponent == "checkout-shipping"
            }
          )}
        >
          {currentCallBackComponent == "checkout-shipping" ? (
            <>
              <div
                className={cs(globalStyles.flex, globalStyles.gutterBetween)}
              >
                <span className={cs(globalStyles.marginR10, styles.name)}>
                  {address.firstName} {address.lastName}
                </span>
                <span
                  className={cs(
                    globalStyles.colorPrimary,
                    globalStyles.pointer,
                    styles.editAddress
                  )}
                  onClick={handleStepEdit}
                >
                  Edit
                </span>
              </div>
              <div className={styles.addressMain}>
                <div className={styles.text}>{address.line1},</div>
                <div className={styles.text}>{address.line2},</div>
                <div className={styles.text}>
                  {address.city},{address.state}, {address.postCode},
                </div>
                <div className={styles.text}>{address.countryName}</div>
              </div>
              <p className={styles.phone}>
                {address.phoneCountryCode} {address.phoneNumber}
              </p>
              <p className={styles.contactMsg}>
                Note:
                {`${address.phoneCountryCode} ${address.phoneNumber} will be used for sending OTP during delivery. Please ensure it is a mobile number.`}
              </p>
            </>
          ) : (
            <>
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
                  className={cs(
                    globalStyles.colorPrimary,
                    globalStyles.pointer
                  )}
                  onClick={handleStepEdit}
                >
                  Edit
                </span>
              </div>
            </>
          )}
        </div>
      );
    } else if (props.addresses.length == 0) {
      // props.openAddressForm();
    }
  };
  // const onChangeGst = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setGstType(e.target.value);
  //   setPanError("");
  //   setError("");
  //   setGstText("");
  // };

  const onPanKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  // const onCouponChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("test ====", event.target.value);
  //   setGstText(event.target.value);
  //   setError("");
  // };

  const onPanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPancardText(event.target.value);
  };

  const togglepancard = () => {
    setPancardCheck(!pancardCheck);
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

  const removeErrorMessages = () => {
    // setError("");
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

  const onSubmit = (
    address?: AddressData,
    gstText?: string,
    gstType?: string
  ) => {
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
    // if (gst && props.activeStep == Steps.STEP_BILLING) {
    //   if (!gstValidation()) {
    //     validate = false;
    //   }
    // }
    if (validate) {
      removeErrorMessages();
      props.finalizeAddress(addr, props.activeStep, numberObj);
      return validate;
    } else {
      showErrorMsg();
      return validate;
    }
  };

  const toggleGstInvoice = () => {
    setGst(true);
    dispatch(
      updateComponent(
        POPUP.BILLINGGST,
        {
          onSubmit: onSubmit,
          setGst: setGst
        },
        true
      )
    );
    dispatch(updateModal(true));
  };

  const openTermsPopup = () => {
    dispatch(updateComponent(POPUP.SHIPPINGTERMS, null, true));
    dispatch(updateModal(true));
  };

  // const onKeyPress = (event: React.KeyboardEvent) => {
  //   if (event.key === "Enter") {
  //     onSubmit();
  //     event.preventDefault();
  //   }
  // };

  const handleSaveAndReview = () => {
    onSubmit();
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
              <label className={cs(styles.flex, globalStyles.voffset3)}>
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
                  I need a GST invoice
                </div>
              </label>
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
    panCheck,
    pancardCheck,
    panError,
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
          <label className={cs(styles.flex)}>
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
                ? cs(styles.card, styles.cardOpen, styles.marginT5)
                : cs(styles.card, styles.cardClosed, styles.marginT5)
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
                    ? "SHIPPING ADDRESS"
                    : "BILLING ADDRESS"}
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
                ? cs(styles.card, styles.cardOpen, styles.marginT5)
                : cs(styles.card, styles.cardClosed, styles.marginT5)
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
                    ? "SHIPPING ADDRESS"
                    : "BILLING ADDRESS"}
                </span>
              </div>
              {renderActions(false)}
              {renderSavedAddress()}
            </div>
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
                        !sameAsShipping)) && (
                      <>
                        <div>{children}</div>
                        {addressList.length > 1 && mode == "list" && (
                          <>
                            <div></div>
                            <div
                              className={cs(
                                globalStyles.flex,
                                globalStyles.gutterBetween,
                                styles.checkoutAddressFooter
                              )}
                            >
                              <div>
                                <label className={cs(styles.flex)}>
                                  <div className={globalStyles.marginR10}>
                                    <span className={styles.checkbox}>
                                      <input
                                        type="checkbox"
                                        onClick={() =>
                                          setIsTermChecked(!isTermChecked)
                                        }
                                      />
                                      <span
                                        className={cs(styles.indicator, {
                                          [styles.checked]: isTermChecked
                                        })}
                                      ></span>
                                    </span>
                                  </div>
                                  <div
                                    className={cs(
                                      styles.formSubheading,
                                      styles.checkBoxHeading
                                    )}
                                  >
                                    I agree to pay the additional applicable
                                    duties and taxes directly to the shipping
                                    agency at the time of the delivery. To know
                                    more, referre to our{" "}
                                    <span
                                      onClick={() => openTermsPopup()}
                                      className={globalStyles.linkTextUnderline}
                                    >
                                      Shipping & Payment terms.
                                    </span>
                                  </div>
                                </label>
                                <div
                                  onClick={() =>
                                    onSelectAddress(
                                      addressList?.find(
                                        val =>
                                          val?.isDefaultForShipping === true
                                      )
                                    )
                                  }
                                  className={styles.sendToAddress}
                                >
                                  SHIP TO THIS ADDRESS
                                </div>
                              </div>

                              {addressList.length > 1 &&
                                mode == "list" &&
                                (props.activeStep == Steps.STEP_SHIPPING ||
                                  (props.activeStep == Steps.STEP_BILLING &&
                                    !props.hidesameShipping)) &&
                                renderActions(false)}
                            </div>
                          </>
                        )}
                      </>
                    )}

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
