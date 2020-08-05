import React, { useEffect, ReactElement, useContext, useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
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
    next
  } = props;
  const { isLoggedIn } = useContext(UserContext);
  const { openAddressForm, closeAddressForm, isAddressValid } = useContext(
    AddressContext
  );
  const { currency, user } = useSelector((state: AppState) => state);
  const { basket } = useSelector((state: AppState) => state);
  const { mobile } = useSelector((state: AppState) => state.device);

  const sameShipping =
    (props.activeStep == Steps.STEP_BILLING ? true : false) &&
    props.hidesameShipping &&
    (props.activeStep == Steps.STEP_BILLING || props.isBridal);
  // state = {
  // address: "",
  // showAddressForm: isLoggedIn ? false : props.activeStep == Steps.STEP_BILLING ? (props.isBridal ? true : false) : true,

  const amountPrice = {
    INR: 200000,
    USD: 2500,
    GBP: 1800
  };
  // editMode: false,
  // newAddressMode: false,
  // showAddresses: true,

  // data: ""
  // }
  const [sameAsShipping, setSameAsShipping] = useState(sameShipping);
  const [gst, setGst] = useState(false);
  const [gstText, setGstText] = useState("");
  const [pancardText, setPancardText] = useState(user.panPassport || "");
  const [pancardCheck, setPancardCheck] = useState(false);
  const [panError, setPanError] = useState("");
  const [panCheck, setPanCheck] = useState("");
  const [gstPan, setGstPan] = useState(user.panPassport || "");
  const [gstPanError, setGstPanError] = useState("");
  // const [shippingErrorMsg, setShippingErrorMsg] = useState("");
  // const [billingErrorMsg, setBillingErrorMsg] = useState("");
  const [gstType, setGstType] = useState("GSTIN");
  // const [addressIdError, setAddressIdError] = useState("");
  const [error, setError] = useState("");

  // console.log(shippingErrorMsg, billingErrorMsg, addressIdError); // temp code

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedIn) {
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

  const renderActions = function() {
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
            bootstrapStyles.col6,
            bootstrapStyles.colMd6,
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
              {address.registrantName} & {address.coRegistrantName}&#39;s
              Wedding Registry
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
        </div>
      );
    } else if (props.addresses.length == 0) {
      // props.openAddressForm();
    }
    // else if((props.addresses.length == 0 && showAddressForm == false) // in case of no address
    //         || (!(Object.keys(props.addresses).length === 0 && props.addresses.constructor === Object) && (!bridal_user.user_id && props.addresses.filter(data => (!data.is_bridal && !data.is_edit)).length == 0) && props.activeStep == Steps.STEP_BILLING && showAddressForm == false)) {
    //     // console.log('true');
    //     setState({
    //         showAddressForm: true,
    //         newAddressMode: true,
    //         editMode: false,
    //     })
    // }
    // else if((props.addresses.length > 0 && showAddressForm && showAddresses && newAddressMode && props.activeStep === Steps.STEP_SHIPPING)
    //         || (!(Object.keys(props.addresses).length === 0 && props.addresses.constructor === Object) && (bridal_user.user_id || props.addresses.filter(data => (!data.is_bridal && !data.is_edit)).length > 0) && showAddressForm && showAddresses && newAddressMode && props.activeStep === Steps.STEP_BILLING)) {
    //     setState({
    //         showAddressForm: false,
    //         newAddressMode: false
    //     })
    // }
  };
  const onChangeGst = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGstType(e.target.value);
    setGstPanError("");
    setPanError("");
    setError("");
  };

  // const onSelectAddress = (address: AddressData) => {
  //   onSubmit(address);
  // }

  // const onDeleteAddress = (id: number) => {
  // let data = new FormData();
  // data.append("id", id.toString());
  // data.append("action_type", 'delete');
  // CustomerAddressApi.touchAddress(data, props.dispatch).then(res => {
  //     if (!res.data.Status) {
  //         const errorMessage = res.data.error_message;
  //         const addressIdError = Number(res.data.id);
  //         const errrorInStep = props.addressType == "SHIPPING" ? "shippingErrorMsg" : "billingErrorMsg";
  //         setState({
  //             [errrorInStep]: errorMessage,
  //             addressIdError: addressIdError
  //         })
  //     }

  // });
  // }

  // const onSubmitAddress = (data: AddressData) => {
  // if (isLoggedIn)
  //     setAddressModes({
  //         editMode: editMode,
  //         newAddressMode: newAddressMode,
  //         showAddresses: showAddresses
  //     })
  // else {
  //     setAddressModes({editMode: false, newAddressMode: false, showAddresses: false})
  //     setState({address: data});
  //     onSelectAddress(data);
  // }
  // }

  const onPanKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const onCouponChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGstText(event.target.value);
    setError("");
  };

  const onGstPanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGstPan(event.target.value);
    setPancardText(event.target.value);
    setGstPanError("");
    setPanError("");
  };

  const onPanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPancardText(event.target.value);
    setGstPan(event.target.value);
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
          value="GSTIN"
          onChange={onChangeGst}
        />
        <span className={styles.checkmark}> </span>{" "}
        <span className={styles.txtGst}>{props.gstType}</span>
      </label>
    );
  };

  const toggleGstInvoice = () => {
    setGst(!gst);
  };

  // const setAddressModes = (modes: any) => {
  // this.setState(modes);
  // if (this.props.error || this.shippingErrorMsg || this.billingErrorMsg) {
  //     this.removeErrorMessages();
  // }
  // }

  const toggleSameAsShipping = () => {
    setSameAsShipping(!sameAsShipping);
    // }, () => {

    //     if (!sameAsShipping && props.activeStep == "BILLING" && !isLoggedIn) {
    //         setAddressModes({
    //             newAddressMode: true,
    //             editMode: false,
    //             showAddresses: false
    //         })
    //         toggleAddressForm();
    //     }
    //     if (sameAsShipping && props.activeStep == "BILLING" && !isLoggedIn) {
    //         setAddressModes({
    //             newAddressMode: false,
    //             editMode: false,
    //             showAddresses: false
    //         })
    //         toggleAddressForm();
    //     }
    // })
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
      setPanError("Please enter number");
      setPanCheck("");
      validate = false;
    } else {
      setPanError("Please enter correct number");
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
        setError("Please enter correct GST ");
        return false;
      } else if (gstText.length != 15 && gstType == "UID") {
        setError("Please enter correct UID");
        return false;
      } else if (gstText.length != 15 && gstType == "GID") {
        setError("Please enter correct GID");
        return false;
      } else {
        setError("");
        return true;
      }
    } else {
      const text =
        gstType == "GSTIN" ? "GST" : gstType == "UID" ? "UID" : "GID";

      setError("Please enter " + text + " number");
      return false;
    }
  };

  const gstPanValidation = () => {
    if (gstPan.length == 10) {
      setGstPanError("");
      setPanError("");
      return true;
    } else if (valid.checkBlank(gstPan)) {
      setGstPanError("Please enter number");
      return false;
    } else {
      setGstPanError("Please enter correct number");
      return false;
    }
  };

  const removeErrorMessages = () => {
    // setShippingErrorMsg("");
    // setBillingErrorMsg("");
    // setAddressIdError("");
    setGstPanError("");
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
      if ((gstType == "GSTIN" || amountPriceCheck) && !gstPanValidation()) {
        validate = false;
      }
    }
    if (validate) {
      removeErrorMessages();
      props.finalizeAddress(addr, props.activeStep, numberObj);
      setError("");
      setPanError("");
      setPanCheck("");
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
    // let products = valid.productForGa(basket, currency);
    // dataLayer.push({
    //     'event': 'checkout',
    //     'ecommerce': {
    //         'currencyCode': currency,
    //         'checkout': {
    //             'actionField': {'step': 3},
    //             'products': products
    //         }
    //     }
    // })
    onSubmit();
  };

  const renderPancard = function() {
    if (props.activeStep == Steps.STEP_BILLING) {
      const pass =
        currency == "INR"
          ? "WE WOULD NEED YOUR PERMANANT ACCOUNT NUMBER (PAN) SINCE YOUR ORDER IS ABOVE 2 LAKHS. PLEASE CONFIRM THE SAME BELOW"
          : "WE WOULD NEED YOUR PASSPORT NUMBER  SINCE YOUR ORDER IS ABOVE " +
            amountPrice[currency] +
            ". PLEASE CONFIRM THE SAME BELOW";
      const panText =
        currency == "INR" ? "PAN Card Number" : " Passport Number";
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
                    <RadioButton key="GID" gstType="GID" />
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
                      {gstType == "GSTIN" ? "GST NO." : gstType + " NO."}
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
                        onChange={onGstPanChange}
                        value={gstPan}
                      />
                    </div>
                    <label className={styles.formLabel}>PAN Number</label>
                    {gstPanError ? (
                      <span
                        className={cs(
                          globalStyles.errorMsg,
                          globalStyles.wordCap
                        )}
                      >
                        {gstPanError}
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
                        { [styles.disabledInput]: gst },
                        styles.input,
                        styles.marginR10
                      )}
                      onChange={onPanChange}
                      disabled={gst}
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
  };

  const renderBillingCheckbox = function() {
    // const show = (showAddressForm && isLoggedIn ? false : true) && !props.isBridal && !props.is_goodearth_Shipping;
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
              SAME AS SHIPPING ADDRESS
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
      const isValid =
        address.country == "IN"
          ? isAddressValid(address.postCode, address.state)
          : true;
      if (isValid) {
        // this.props.onSelectAddress(address);
        onSubmit(address);
      } else {
        // this.manageAddressPostcode("edit", address);
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
                  styles.title
                )}
              >
                <span className={cs({ [styles.closed]: !isActive })}>
                  {activeStep == Steps.STEP_SHIPPING
                    ? "SHIPPING DETAILS"
                    : "BILLING DETAILS"}
                </span>
              </div>
              {renderActions()}
              {renderSavedAddress()}
            </div>
            {isActive && (
              <div>
                {/* <AddressMainComponent addresses={props.addresses} activeStep={props.activeStep}
                                        items={props.items} isLoggedIn={isLoggedIn}
                                        sameAsShipping={sameAsShipping}
                                        addressIdError={addressIdError}
                                        removeErrorMessages={removeErrorMessages}
                                        isBridal={props.isBridal} editMode={editMode}
                                        newAddressMode={newAddressMode}
                                        bridal_id={props.bridal_id}
                                        showAllAddresses={showAddresses}
                                        shippingErrorMsg={shippingErrorMsg}
                                        billingErrorMsg={billingErrorMsg}
                                        onEditAddress={onEditAddress} onSelectAddress={onSelectAddress}
                                        toggleAddressForm={toggleAddressForm}
                                        onDeleteAddress={onDeleteAddress} currentCallBackComponent="checkout"
                                        selectedAddress={props.selectedAddress}/> */}
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
            )}
          </div>
        </div>
      );
    } else {
      // let selectAddress = (props.activeStep == Steps.STEP_BILLING && !isLoggedIn && props.isBridal) ? '' : selectedAddress;
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
                  styles.title
                )}
              >
                <span className={cs({ [styles.closed]: !isActive })}>
                  {activeStep == Steps.STEP_SHIPPING
                    ? "SHIPPING DETAILS"
                    : "BILLING DETAILS"}
                </span>
              </div>
              {renderActions()}
              {renderSavedAddress()}
            </div>
            {isActive && (
              <div>
                <div>{renderPancard()}</div>
                {props.activeStep == Steps.STEP_BILLING &&
                  props.hidesameShipping && (
                    <div>{renderBillingCheckbox()}</div>
                  )}
                {(isLoggedIn ? (
                  false
                ) : props.activeStep == Steps.STEP_BILLING ? (
                  props.isBridal ? (
                    true
                  ) : (
                    false
                  )
                ) : (
                  true
                )) ? (
                  <div>{children}</div>
                ) : // <AddressMainComponent dispatch={props.dispatch} onSuccess={onSubmitAddress}
                //                       addressIdError={addressIdError}
                //                       address={selectAddress} activeStep={props.activeStep}
                //                       isBridal={props.isBridal}
                //                       removeErrorMessages={removeErrorMessages}
                //                       totalAddress={props.addresses}
                //                       showAddressForm={showAddressForm}
                //                       shippingErrorMsg={shippingErrorMsg}
                //                       billingErrorMsg={billingErrorMsg}
                //                       items={props.items} currentCallBackComponent="checkout"
                //                       toggleAddressForm={toggleAddressForm}
                //                       isLoggedIn={isLoggedIn}
                //                       onDeleteAddress={onDeleteAddress} data={data}
                //                       editMode={editMode}
                //                       newAddressMode={newAddressMode}
                //                       showAllAddresses={showAddresses}
                //                       setAddressModes={setAddressModes}
                //                       setAddressAvailable={setAddressAvailable}
                //                       sameAsShipping={sameAsShipping}
                //                       user={props.user}
                //                       selectedAddress={props.selectedAddress}/>
                !props.hidesameShipping ? (
                  <div>{children}</div>
                ) : (
                  // <AddressMainComponent dispatch={props.dispatch} onSuccess={onSubmitAddress}
                  //                       showAddressForm={showAddressForm}
                  //                       addressIdError={addressIdError}
                  //                       address={selectAddress} activeStep={props.activeStep}
                  //                       data={props.addresses} isBridal={props.isBridal}
                  //                       editMode={editMode}
                  //                       newAddressMode={newAddressMode}
                  //                       sameAsShipping={sameAsShipping}
                  //                       items={props.items} currentCallBackComponent="checkout"
                  //                       data={data} toggleAddressForm={toggleAddressForm}
                  //                       isLoggedIn={isLoggedIn}
                  //                       onDeleteAddress={onDeleteAddress}
                  //                       showAllAddresses={showAddresses}
                  //                       setAddressModes={setAddressModes}
                  //                       setAddressAvailable={setAddressAvailable}
                  //                       shippingErrorMsg={shippingErrorMsg}
                  //                       billingErrorMsg={billingErrorMsg}
                  //                       user={props.user} selectedAddress={props.selectedAddress}
                  //                       removeErrorMessages={removeErrorMessages}/>
                  ""
                )}

                {props.isBridal
                  ? isLoggedIn && (
                      // !showAddressForm &&
                      <div>{children}</div>
                    )
                  : // <AddressMainComponent dispatch={props.dispatch} activeStep={props.activeStep}
                    //                       data={props.addresses} addressIdError={addressIdError}
                    //                       items={props.items} setAddressModes={setAddressModes}
                    //                       showAddressForm={showAddressForm}
                    //                       bridal_id={props.bridal_id} editMode={editMode}
                    //                       newAddressMode={newAddressMode}
                    //                       currentCallBackComponent="checkout" onSuccess={onSubmitAddress}
                    //                       sameAsShipping={sameAsShipping}
                    //                       isBridal={props.isbridal} showAllAddresses={showAddresses}
                    //                       shippingErrorMsg={shippingErrorMsg}
                    //                       billingErrorMsg={billingErrorMsg}
                    //                       onEditAddress={onEditAddress} onSelectAddress={onSelectAddress}
                    //                       toggleAddressForm={toggleAddressForm}
                    //                       setAddressAvailable={setAddressAvailable}
                    //                       isLoggedIn={isLoggedIn}
                    //                       removeErrorMessages={removeErrorMessages}
                    //                       onDeleteAddress={onDeleteAddress}
                    //                       selectedAddress={props.selectedAddress} addressesAvailable={true}
                    //                       currentCallBackComponent="checkout"/>
                    isLoggedIn &&
                    // !showAddressForm &&
                    !sameAsShipping && <div>{children}</div>
                // <AddressMainComponent dispatch={props.dispatch} data={props.addresses}
                //                       activeStep={props.activeStep}
                //                       items={props.items} sameAsShipping={sameAsShipping}
                //                       addressIdError={addressIdError}
                //                       isBridal={props.isbridal} setAddressModes={setAddressModes}
                //                       showAddressForm={showAddressForm}
                //                       showAllAddresses={showAddresses}
                //                       editMode={editMode}
                //                       newAddressMode={newAddressMode}
                //                       bridal_id={props.bridal_id}
                //                       toggleAddressForm={toggleAddressForm}
                //                       selectedAddress={props.selectedAddress}
                //                       shippingErrorMsg={shippingErrorMsg}
                //                       billingErrorMsg={billingErrorMsg}
                //                       currentCallBackComponent="checkout" onSuccess={onSubmitAddress}
                //                       removeErrorMessages={removeErrorMessages}
                //                       setAddressAvailable={setAddressAvailable}
                //                       isLoggedIn={isLoggedIn}
                //                       onEditAddress={onEditAddress}
                //                       onSelectAddress={onSelectAddress}
                //                       onDeleteAddress={onDeleteAddress} addressesAvailable={true}
                //                       currentCallBackComponent="checkout"/>
                }
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
            )}
          </div>
          {/* {(user.gender == "None" || user.gender == '') ? checkForGenderUpdate() : ""} */}
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
