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
import {
  updateAddressList,
  updateBillingAddressId,
  updateCustomDuties,
  updateShippingAddressId
} from "actions/address";
import AddressService from "services/address";
import { useDispatch, useSelector } from "react-redux";
import { STEP_BILLING, STEP_ORDER, STEP_SHIPPING } from "../constants";
import UserContext from "contexts/user";
import { AddressContext } from "components/Address/AddressMain/context";
import { AppState } from "reducers/typings";
import { AddressData } from "components/Address/typings";
import { checkBlank } from "utils/validate";
import { CheckoutAddressContext } from "./context";
import { Currency, currencyCode } from "typings/currency";
import checkmarkCircle from "./../../../images/checkmarkCircle.svg";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { displayPriceWithCommas } from "utils/utility";
import ReactHtmlParser from "react-html-parser";

const AddressSection: React.FC<AddressProps & {
  mode: string;
  children: React.ReactNode;
}> = props => {
  const {
    children,
    activeStep,
    isActive,
    isBridal,
    selectedAddress,
    isGoodearthShipping,
    hidesameShipping,
    next,
    errorNotification,
    currentStep
  } = props;
  const { isLoggedIn } = useContext(UserContext);
  const {
    openAddressForm,
    closeAddressForm,
    isAddressValid,
    currentCallBackComponent
  } = useContext(AddressContext);
  const { currency, user } = useSelector((state: AppState) => state);
  const {
    basket,
    modal: { openModal }
  } = useSelector((state: AppState) => state);
  const { mobile } = useSelector((state: AppState) => state.device);
  const {
    addressList,
    shippingAddressId,
    billingAddressId,
    customDuties
  } = useSelector((state: AppState) => state.address);
  // const { showPromo } = useSelector((state: AppState) => state.info);
  const sameShipping =
    (props.activeStep == STEP_BILLING ? true : false) &&
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
  const [gstNum, setGstNum] = useState("");
  // let gstNum: any;
  const [pancardText, setPancardText] = useState(user.panPassport || "");
  const [pancardCheck, setPancardCheck] = useState(false);
  const [panError, setPanError] = useState("");
  const [panCheck, setPanCheck] = useState("");
  const [isTermChecked, setIsTermChecked] = useState(false);
  const [termsErr, setTermsErr] = useState("");
  const [gstDetails, setGstDetails] = useState({ gstText: "", gstType: "" });

  const dispatch = useDispatch();

  const { mode } = useSelector((state: AppState) => state.address);

  useEffect(() => {
    if (isLoggedIn && currentCallBackComponent == "checkout-shipping") {
      AddressService.fetchAddressList(dispatch).then(addressList => {
        dispatch(updateAddressList(addressList));
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentCallBackComponent === "checkout-shipping") {
      dispatch(
        updateShippingAddressId(
          props.selectedAddress?.id ||
            addressList?.find(val => val?.isDefaultForShipping)?.id ||
            0
        )
      );
      if (sameAsShipping) {
        dispatch(
          updateBillingAddressId(
            props.selectedAddress?.id ||
              addressList?.find(val => val?.isDefaultForShipping)?.id ||
              0
          )
        );
      }
    }
    if (currentCallBackComponent === "checkout-billing") {
      dispatch(
        updateBillingAddressId(
          props.selectedAddress?.id ||
            addressList?.find(val => val?.isDefaultForShipping)?.id ||
            0
        )
      );
    }
  }, [props.selectedAddress, addressList]);
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
    AddressService.fetchCustomDuties(dispatch, currency).then(res => {
      dispatch(updateCustomDuties(res));
    });
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
        mode == "new" || mode == "edit" ? "< BACK" : "[+] ADD NEW ADDRESS";
      if (isBridal && activeStep == STEP_SHIPPING) return "";
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
          <div className={cs(globalStyles.pointer)} onClick={clickAction}>
            {mobile ? (
              <span className={cs(styles.addNewAddress)}>{mobileText}</span>
            ) : (
              <span className={cs(styles.addNewAddress)}>{fullText}</span>
            )}
          </div>
        </div>
      );
    }
  };

  const handleStepEdit = () => {
    activeStep == STEP_SHIPPING ? next(STEP_SHIPPING) : next(STEP_BILLING);
  };

  const renderSavedAddress = function() {
    const address = selectedAddress;

    if (!isActive && address && isBridal && activeStep == STEP_SHIPPING) {
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
            bootstrapStyles.colLg6,
            styles.small,
            styles.selectedStvalue,
            {
              [styles.checkoutSelectedValue]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
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
          ) : currentCallBackComponent == "checkout-billing" ? (
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
                M: {address.phoneCountryCode} {address.phoneNumber}
              </p>
              {gstNum && <p className={styles.gstNo}>GSTIN: {gstNum}</p>}
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
      (currency != "INR" && !checkBlank(pancardText))
    ) {
      setPanError("");
      setPanCheck("");
      validate = true;
    } else if (checkBlank(pancardText)) {
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

  const onSubmit: any = (
    address?: AddressData | undefined,
    gstText?: string,
    gstType?: string
  ) => {
    let validate = true;
    const addr = address || null;
    let numberObj: { gstNo?: string; gstType?: string; panPassportNo: string };
    const amountPriceCheck = amountPrice[currency] <= basket.total;
    setGstNum(gstText || gstNum);

    if (gstText) {
      setGstDetails({ gstText: gstText, gstType: gstType || "" });
    }
    if (gstText || gstNum) {
      numberObj = Object.assign(
        {},
        {
          gstNo: gstText || gstDetails?.gstText,
          gstType: gstType || gstDetails?.gstType,
          panPassportNo: pancardText
        }
      );
    } else {
      numberObj = Object.assign(
        {},
        { panPassportNo: amountPriceCheck ? pancardText : "" }
      );
    }

    if (amountPriceCheck && props.activeStep == STEP_BILLING) {
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
      // if (activeStep === STEP_BILLING) {
      //   next(showPromo ? STEP_PROMO : STEP_PAYMENT);
      // }
      return validate;
    } else {
      showErrorMsg();
      return validate;
    }
  };
  const onSelectAddress = (address?: AddressData) => {
    if (activeStep === STEP_SHIPPING) {
      if (!isBridal && !isTermChecked) {
        setTermsErr("Please confirm to terms and conditions");
        return false;
      }
    }
    setTermsErr("");
    if (address) {
      const isValid = isAddressValid(address);
      if (isValid) {
        onSubmit(address);
      } else {
        openAddressForm(address);
      }
    }
    if (activeStep === STEP_SHIPPING) {
      next(STEP_BILLING);
    }
    return true;
  };
  const handleSaveAndReview = (address?: AddressData) => {
    onSubmit(address);
  };

  useEffect(() => {
    if (openModal && gst) {
      dispatch(
        updateComponent(
          POPUP.BILLINGGST,
          {
            onSubmit: onSubmit,
            setGst: setGst,
            gstNum: gstNum,
            parentError: props.error,
            isActive: isActive,
            setGstNum: setGstNum
          },
          true
        )
      );
    }
  }, [props.error, isActive]);
  const toggleGstInvoice = () => {
    setGst(!gst);
    if (!gst) {
      dispatch(
        updateComponent(
          POPUP.BILLINGGST,
          {
            onSubmit: onSubmit,
            setGst: setGst,
            gstNum: gstNum,
            parentError: "",
            isActive: isActive,
            setGstNum: setGstNum
          },
          true
        )
      );
      dispatch(updateModal(true));
    } else {
      setGstNum("");
    }
  };

  const openTermsPopup = () => {
    dispatch(updateComponent(POPUP.SHIPPINGTERMS, { customDuties }, true));
    dispatch(updateModal(true));
  };

  // const onKeyPress = (event: React.KeyboardEvent) => {
  //   if (event.key === "Enter") {
  //     onSubmit();
  //     event.preventDefault();
  //   }
  // };

  const renderPancard = useMemo(() => {
    if (props.activeStep == STEP_BILLING) {
      const pass =
        currency == "INR"
          ? `As per RBI government regulations, PAN details are mandatory for transaction above ${String.fromCharCode(
              ...code
            )} ${displayPriceWithCommas(amountPrice[currency], currency)}.`
          : `AS PER RBI GOVERNMENT REGULATIONS, PASSPORT DETAILS ARE MANDATORY FOR TRANSACTIONS ABOVE ${String.fromCharCode(
              ...code
            )} ${displayPriceWithCommas(amountPrice[currency], currency)}.`;
      const panText =
        currency == "INR" ? "PAN Card Number*" : " Passport Number*";

      return (
        <div>
          {currency == "INR" ? (
            <div>
              <hr className={globalStyles.marginy24} />
              <label className={cs(styles.flex, globalStyles.voffset3)}>
                <div className={globalStyles.marginR10}>
                  <span className={styles.checkbox}>
                    <input
                      type="checkbox"
                      onChange={() => {
                        toggleGstInvoice();
                      }}
                    />
                    <span
                      className={cs(styles.indicator, {
                        [styles.checked]: gst && gstNum
                      })}
                    ></span>
                  </span>
                </div>
                <div
                  className={cs(styles.formSubheading, styles.checkBoxHeading)}
                >
                  I need a GST invoice
                  {gstNum && (
                    <label className={styles.gstInvoiseNo}>
                      GSTIN: {gstNum}
                    </label>
                  )}
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
                globalStyles.voffset4
              )}
            >
              <hr className={globalStyles.marginy24} />
              {pass}
              <div>
                <div className={styles.form}>
                  <div
                    className={cs(
                      styles.flex,
                      globalStyles.voffset3,
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
                      aria-label="Pancard"
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
              <label className={cs(styles.flex, globalStyles.voffset4)}>
                <div className={globalStyles.marginR10}>
                  <span className={styles.checkbox}>
                    <input type="checkbox" onChange={togglepancard} />
                    <span
                      className={cs(styles.indicator, {
                        [styles.checked]: pancardCheck
                      })}
                    ></span>
                  </span>
                </div>
                <div
                  className={cs(styles.formSubheading, styles.checkBoxHeading)}
                >
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
    currency,
    gstNum
  ]);

  const renderBillingCheckbox = function() {
    const show =
      !props.isBridal && !props.isGoodearthShipping && mode == "list";

    return (
      show && (
        <div className={cs(styles.payment, globalStyles.voffset4)}>
          {!mobile && <hr className={globalStyles.marginy24} />}
          <label className={cs(styles.flex)}>
            <div className={globalStyles.marginR10}>
              <span className={styles.checkbox}>
                <input type="checkbox" onChange={toggleSameAsShipping} />
                <span
                  className={cs(styles.indicator, {
                    [styles.checked]: sameAsShipping
                  })}
                ></span>
              </span>
            </div>
            <div className={cs(styles.formSubheading)}>
              Same as Shipping Address
            </div>
          </label>
        </div>
      )
    );
  };

  const renderCheckoutAddress = () => {
    let html: ReactElement | null = null;

    if (isBridal && activeStep == STEP_SHIPPING) {
      html = (
        <div className={globalStyles.marginT5}>
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
                {STEP_ORDER[activeStep] < currentStep ? (
                  <img
                    height={"18px"}
                    className={globalStyles.marginR10}
                    src={checkmarkCircle}
                    alt="checkmarkdone"
                  />
                ) : null}

                <span
                  className={cs({
                    [styles.iscompleted]: STEP_ORDER[activeStep] < currentStep
                  })}
                >
                  {activeStep == STEP_SHIPPING
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
        <div className={globalStyles.marginT5}>
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
                  globalStyles.gutterBetween,
                  styles.title
                )}
              >
                <div>
                  {STEP_ORDER[activeStep] < currentStep ? (
                    <img
                      height={"18px"}
                      className={globalStyles.marginR10}
                      src={checkmarkCircle}
                      alt="checkmarkdone"
                    />
                  ) : null}
                  <span
                    className={cs({
                      [styles.iscompleted]: STEP_ORDER[activeStep] < currentStep
                    })}
                  >
                    {activeStep == STEP_SHIPPING
                      ? "SHIPPING ADDRESS"
                      : "BILLING ADDRESS"}
                  </span>
                </div>
                {mobile && renderActions(false)}
              </div>
              {!mobile && renderActions(false)}
              {renderSavedAddress()}
            </div>
            {isActive && (
              <>
                <div>
                  {/* <div>{renderPancard}</div> */}
                  {props.activeStep == STEP_BILLING && props.hidesameShipping && (
                    <>
                      <div>{renderBillingCheckbox()}</div>
                      {!sameAsShipping && isLoggedIn && mode == "list" && (
                        <div>
                          <div
                            className={cs(
                              styles.sameText,
                              styles.formSubheading
                            )}
                          >
                            OR SELECT AN ADDRESS BELOW
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {// logged in Shipping & billing
                  isLoggedIn &&
                    (props.activeStep == STEP_SHIPPING ||
                      (props.activeStep == STEP_BILLING &&
                        !sameAsShipping)) && (
                      <>
                        <div>{children}</div>
                        {addressList.length && mode == "list" && (
                          <>
                            <div></div>
                            <div
                              className={cs(
                                globalStyles.flex,
                                globalStyles.gutterBetween,
                                styles.checkoutAddressFooter
                              )}
                            >
                              {props.activeStep == STEP_SHIPPING && (
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
                                      {ReactHtmlParser(customDuties?.message)}
                                      {customDuties?.popup_content && (
                                        <span
                                          onClick={() => openTermsPopup()}
                                          className={
                                            globalStyles.linkTextUnderline
                                          }
                                        >
                                          Shipping & Payment terms.
                                        </span>
                                      )}
                                    </div>
                                  </label>
                                  {termsErr && (
                                    <div
                                      className={cs(
                                        globalStyles.errorMsg,
                                        globalStyles.marginL30
                                      )}
                                    >
                                      {termsErr}
                                    </div>
                                  )}
                                  <div
                                    onClick={() => {
                                      onSelectAddress(
                                        addressList?.find(val =>
                                          shippingAddressId !== 0
                                            ? val?.id === shippingAddressId
                                            : val?.isDefaultForShipping === true
                                        )
                                      );
                                    }}
                                    className={styles.sendToAddress}
                                  >
                                    {props.activeStep == STEP_SHIPPING
                                      ? "SHIP TO THIS ADDRESS"
                                      : props.activeStep == STEP_BILLING
                                      ? "PROCEED TO PAYMENT"
                                      : "SHIP TO THIS ADDRESS"}
                                  </div>
                                </div>
                              )}
                              {!mobile &&
                                addressList.length > 1 &&
                                mode == "list" &&
                                (props.activeStep == STEP_SHIPPING ||
                                  (props.activeStep == STEP_BILLING &&
                                    !props.hidesameShipping)) &&
                                renderActions(false)}
                            </div>
                          </>
                        )}
                        {!mobile &&
                          addressList.length > 1 &&
                          mode == "list" &&
                          props.activeStep == STEP_BILLING &&
                          !sameAsShipping &&
                          renderActions(true)}
                      </>
                    )}
                  {/* { (props.activeStep == STEP_SHIPPING ||
                      (props.activeStep == STEP_BILLING &&
                        !sameAsShipping)) && <div>{children}</div>} */}

                  {props.error && props.activeStep !== STEP_BILLING ? (
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
                  <div>{renderPancard}</div>
                  {props.activeStep == STEP_BILLING && (
                    <div className={bootstrapStyles.row}>
                      <div
                        className={cs(
                          bootstrapStyles.col12,
                          bootstrapStyles.colLg7
                        )}
                      >
                        <div
                          className={cs(
                            globalStyles.marginT20,
                            styles.sendToPayment
                          )}
                          onClick={() => {
                            handleSaveAndReview(
                              addressList?.find(val =>
                                shippingAddressId !== 0
                                  ? sameAsShipping
                                    ? val?.id === shippingAddressId
                                    : val?.id === billingAddressId
                                  : val?.isDefaultForShipping === true
                              )
                            );
                          }}
                        >
                          {mobile
                            ? "SELECT & PROCEED TO PAYMENT"
                            : "PROCEED TO PAYMENT"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* {addressList.length > 1 &&
                  mode == "list" &&
                  (props.activeStep == STEP_SHIPPING ||
                    (props.activeStep == STEP_BILLING &&
                      !props.hidesameShipping)) &&
                  renderActions(true)} */}
              </>
            )}
            {props.activeStep == STEP_SHIPPING && !isActive && (
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
