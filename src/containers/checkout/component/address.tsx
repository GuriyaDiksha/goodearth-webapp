import React, {
  useEffect,
  ReactElement,
  useContext,
  useState,
  useMemo,
  useRef,
  useLayoutEffect
} from "react";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { AddressProps } from "./typings";
import {
  updateAddressList,
  updateBillingAddressId,
  updateShippingAddressId,
  updateSameAsShipping,
  updateCustomDuties,
  isFormModuleOpen
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
import checkmarkCircle from "./../../../images/checkmarkCircle.svg";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { displayPriceWithCommas } from "utils/utility";
import CheckboxWithLabel from "components/CheckboxWithLabel";
import Button from "components/Button";
import ReactHtmlParser from "react-html-parser";
import { countryCurrencyCode } from "constants/currency";
import ModalStyles from "components/Modal/styles.scss";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
// import bridalRing from "../../../images/bridal/rings.svg";
import bridalGiftIcon from "../../../images/registery/addedReg.svg";
import { useLocation } from "react-router";

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
    next,
    errorNotification,
    currentStep,
    error,
    isGcCheckout
  } = props;
  const { isLoggedIn } = useContext(UserContext);
  const {
    openAddressForm,
    closeAddressForm,
    isAddressValid,
    currentCallBackComponent,
    setMode
  } = useContext(AddressContext);
  const { currency, user } = useSelector((state: AppState) => state);
  const {
    basket,
    info: { isSale, deliveryText }
  } = useSelector((state: AppState) => state);
  const { mobile } = useSelector((state: AppState) => state.device);
  const {
    addressList,
    shippingAddressId,
    billingAddressId,
    customDuties,
    sameAsShipping
  } = useSelector((state: AppState) => state.address);
  // const { showPromo } = useSelector((state: AppState) => state.info);
  // const sameShipping =
  //   (props.activeStep == STEP_BILLING ? true : false) &&
  //   props.hidesameShipping &&
  //   !isGoodearthShipping &&
  //   !props.isBridal;

  const amountPrice = {
    INR: 200000,
    USD: 2500,
    GBP: 1800,
    AED: 9300,
    SGD: 3500
  };

  const [gst, setGst] = useState(false);
  const [pancardText, setPancardText] = useState(user.panPassport || "");
  const [pancardCheck, setPancardCheck] = useState(false);
  const [panError, setPanError] = useState("");
  const [panCheck, setPanCheck] = useState("");
  const [isTermChecked, setIsTermChecked] = useState(true);
  const [termsErr, setTermsErr] = useState("");
  const [gstDetails, setGstDetails] = useState({ gstText: "", gstType: "" });
  const [billingError, setBillingError] = useState("");
  const [shippingError, setShippingError] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();

  const { mode } = useSelector((state: AppState) => state.address);

  const canUseDOM = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

  const [checkoutMobileOrderSummary, setCheckoutMobileOrderSummary] = useState(
    false
  );

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  // Begin: Intersection Observer (Mobile)

  const orderSummaryRef = useRef(null);
  const orderSummaryRef2 = useRef(null);
  let observer: any;

  const handleScroll = () => {
    const interSectionCallBack = (enteries: any) => {
      setCheckoutMobileOrderSummary(
        enteries[enteries?.length - 1].isIntersecting
      );
    };
    observer = new IntersectionObserver(interSectionCallBack);
    orderSummaryRef?.current && observer.observe(orderSummaryRef?.current);
    orderSummaryRef2?.current && observer.observe(orderSummaryRef2?.current);
  };

  useIsomorphicLayoutEffect(() => {
    document.addEventListener("scroll", handleScroll, true);

    return () => {
      orderSummaryRef?.current && observer?.unobserve(orderSummaryRef?.current);
      orderSummaryRef2?.current &&
        observer?.unobserve(orderSummaryRef2?.current);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, []);
  // End: Intersection Observer (Mobile)

  useEffect(() => {
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const boId = urlParams.get("bo_id") || undefined;
    if (
      isLoggedIn &&
      (currentCallBackComponent == "checkout-shipping" ||
        (isGcCheckout && currentCallBackComponent == "checkout-billing"))
    ) {
      AddressService.fetchAddressList(dispatch, boId, isGcCheckout).then(
        addressList => {
          dispatch(updateAddressList(addressList));
        }
      );
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setBillingError("");
    setShippingError("");
    setGstDetails({ gstText: "", gstType: "" });
  }, [shippingAddressId, billingAddressId]);

  useEffect(() => {
    setIsTermChecked(customDuties?.visible || true);
    setTermsErr("");
  }, [customDuties]);

  useEffect(() => {
    if (
      activeStep == STEP_BILLING &&
      (!isBridal || !isGoodearthShipping) &&
      props.selectedAddress &&
      isActive
    ) {
      dispatch(updateBillingAddressId(props.selectedAddress?.id || 0));

      if (
        sameAsShipping &&
        props.selectedAddress
        // props.selectedAddress?.isDefaultForShipping]
      ) {
        dispatch(updateShippingAddressId(props.selectedAddress?.id || 0));
      }
    }

    // Always keep billing address as 0 initially for bridal and goodearth shipping
    if (
      (isBridal || isGoodearthShipping || isGcCheckout) &&
      activeStep == STEP_BILLING &&
      isActive
    ) {
      dispatch(updateBillingAddressId(0));
    }

    if (activeStep === STEP_SHIPPING && isActive) {
      dispatch(updateShippingAddressId(props.selectedAddress?.id || 0));
      dispatch(updateCustomDuties({ visible: false, message: "" }));

      if (props.selectedAddress && props.selectedAddress?.id) {
        AddressService.fetchCustomDuties(
          dispatch,
          countryCurrencyCode?.[props.selectedAddress?.country || "IN"]
        );
      }
    }
  }, [
    props.selectedAddress,
    activeStep,
    currency,
    isActive,
    isBridal,
    isGoodearthShipping
  ]);

  const openNewAddressForm = () => {
    if (currentCallBackComponent === "checkout-billing") {
      dispatch(updateSameAsShipping(false));
    }
    openAddressForm();
    dispatch(isFormModuleOpen(true));
  };

  const backToAddressList = () => {
    closeAddressForm();
  };

  useEffect(() => {
    setPancardText(user.panPassport || "");
  }, [user.panPassport]);

  useEffect(() => {
    setPanError("");
    setPanCheck("");
    if (currency != "INR") {
      setGst(false);
    }
  }, [currency]);

  const renderActions = function(
    isBottom?: boolean,
    isBillingDisable?: boolean
  ) {
    if (((isActive && isLoggedIn) || isBillingDisable) && addressList?.length) {
      const clickAction =
        mode == "list" ? openNewAddressForm : backToAddressList;
      const fullText = isBillingDisable ? "" : "[+] ADD NEW ADDRESS"; //if billing is disabled then do not show anything here
      const mobileText = isBillingDisable ? " " : "[+] ADD NEW ADDRESS";
      if (isBridal && activeStep == STEP_SHIPPING) return "";
      if (isBillingDisable) return null;
      if (mode == "new" || mode == "edit") return null;
      if (
        activeStep == STEP_BILLING &&
        (isBridal || isGoodearthShipping) &&
        addressList.length <= 1
      )
        return null;
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
            className={cs({
              [styles.closed]: isBillingDisable
            })}
          >
            {mobile ? (
              <span
                className={cs(styles.addNewAddress, {
                  [globalStyles.pointer]: !isBillingDisable
                })}
                onClick={clickAction}
              >
                {mobileText}
              </span>
            ) : (
              <span
                className={cs(styles.addNewAddress, {
                  [styles.lightClosed]: isBillingDisable,
                  [globalStyles.pointer]: !isBillingDisable
                })}
                onClick={clickAction}
              >
                {fullText}
              </span>
            )}
          </div>
        </div>
      );
    }
  };

  const handleStepEdit = () => {
    activeStep == STEP_SHIPPING ? next(STEP_SHIPPING) : next(STEP_BILLING);
    setMode("list");
  };

  // const selectedAddress = addressList?.find(val =>
  //   shippingAddressId !== 0
  //     ? val?.id === shippingAddressId
  //     : val?.isDefaultForShipping === true ||
  //       (isBridal && basket.bridalAddressId === val?.id)
  // );
  // const renderSavedAddress = function() {

  const renderSavedAddress = () => {
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
          <div className={styles.bridalAddressTitleRing}>
            <span
              className={cs(
                globalStyles.marginR10,
                globalStyles.textCapitalize
              )}
            >
              {address.registrantName && !address.coRegistrantName && (
                <span>
                  {address.registrantName}&#39;s&nbsp;
                  {address.occasion}&nbsp;Registry
                </span>
              )}
              {address.registrantName && address.coRegistrantName && (
                <span>
                  {address.registrantName}&nbsp;&&nbsp;
                  {address.coRegistrantName}&#39;s&nbsp;
                  {address.occasion}&nbsp;Registry
                </span>
              )}
            </span>
            <div className={cs(styles.defaultAddressDiv, styles.bridalAddress)}>
              {/* <svg
                viewBox="0 5 40 40"
                width="35"
                height="35"
                preserveAspectRatio="xMidYMid meet"
                x="0"
                y="0"
                className={styles.ceriseBridalRings}
              >
                <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
              </svg> */}
              <img
                className={styles.ceriseBridalRings}
                src={bridalGiftIcon}
                width="25"
                alt="gift_reg_icon"
              />
            </div>
          </div>

          <div className={styles.addressMain}>
            <div className={styles.text}>
              {address.line1}
              {address.line2 && ","}
              {address.line2},
            </div>

            <div className={styles.text}>
              {address.city},{address.state} - {address.postCode},
            </div>
            <div className={styles.text}>{address.countryName}</div>
          </div>
          <p className={styles.phone}>
            {address.phoneCountryCode} {address.phoneNumber}
          </p>
        </div>
      );
    } else if (!isActive && address && STEP_ORDER[activeStep] < currentStep) {
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
                <span
                  className={cs(
                    globalStyles.marginR10,
                    styles.name,
                    styles.addressType
                  )}
                >
                  {address.firstName} {address.lastName}{" "}
                  {address?.addressType && `(${address?.addressType})`}
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
                <div className={styles.text}>
                  {address.line1}
                  {address.line2 && ","}
                  {address.line2},
                </div>

                <div className={styles.text}>
                  {address.city},{address.state} - {address.postCode},
                </div>
                <div className={styles.text}>{address.countryName}</div>
              </div>
              <p className={styles.phone}>
                {address.phoneCountryCode} {address.phoneNumber}
              </p>
              {currency === "INR" && !isGoodearthShipping && (
                <p className={styles.contactMsg}>
                  Note:
                  {`${address.phoneCountryCode} ${address.phoneNumber} will be used for sending OTP during delivery. Please ensure it is a mobile number.`}
                </p>
              )}
            </>
          ) : currentCallBackComponent == "checkout-billing" ? (
            <>
              <div
                className={cs(globalStyles.flex, globalStyles.gutterBetween)}
              >
                <span
                  className={cs(
                    globalStyles.marginR10,
                    styles.name,
                    styles.addressType
                  )}
                >
                  {address.firstName} {address.lastName}{" "}
                  {address?.addressType && `(${address?.addressType})`}
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
                <div className={styles.text}>
                  {address.line1}
                  {address.line2 && ","}
                  {address.line2},
                </div>

                <div className={styles.text}>
                  {address.city},{address.state} - {address.postCode},
                </div>
                <div className={styles.text}>{address.countryName}</div>
              </div>
              <p className={styles.phone}>
                {address.phoneCountryCode} {address.phoneNumber}
              </p>
              {gstDetails?.gstText && (
                <p className={styles.gstNo}>
                  {gstDetails?.gstType}: {gstDetails?.gstText}
                </p>
              )}
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

  const onPanKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const onPanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPancardText(event.target.value);
  };

  const togglepancard = () => {
    setPancardCheck(!pancardCheck);
  };

  const toggleSameAsShipping = () => {
    dispatch(updateSameAsShipping(!sameAsShipping));

    if (!sameAsShipping) {
      dispatch(updateBillingAddressId(shippingAddressId));
    }
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
      setPanCheck(
        "Please confirm that the information you have provided is correct"
      );
      useEffect(() => {
        const errorElement = document.getElementById("pancardCheckError");
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, [panCheck]);

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
  const onSubmit: any = (address?: AddressData | undefined) => {
    let validate = true;
    const addr = address || null;
    let numberObj: { gstNo?: string; gstType?: string; panPassportNo: string };
    const amountPriceCheck = amountPrice[currency] <= basket.total;
    // setGstNum(gstText || gstNum);

    // if (gstText) {
    //   setGstDetails({ gstText: gstText, gstType: gstType || "" });
    // }
    if (
      billingAddressId === 0 &&
      currentCallBackComponent === "checkout-billing"
    ) {
      setBillingError("Please select a Billing Address");
      return false;
    }

    if (gstDetails?.gstText) {
      numberObj = Object.assign(
        {},
        {
          gstNo: gstDetails?.gstText,
          gstType: gstDetails?.gstType,
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
      } else {
        const userConsent = CookieService.getCookie("consent").split(",");
        if (userConsent.includes(GA_CALLS)) {
          dataLayer.push({
            event: "verify_userid_type",
            click_type: currency === "INR" ? "Pancard" : "Passport"
          });
        }
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

  const addGAForShipping = (address: any) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    const items = basket.lineItems.map((line, ind) => {
      const index = line?.product.categories
        ? line?.product.categories.length - 1
        : 0;
      const category =
        line?.product.categories && line?.product.categories[index]
          ? line?.product.categories[index].replace(/\s/g, "")
          : "";

      const cat1 = line?.product.categories?.[0]?.split(">");
      const cat2 = line?.product.categories?.[1]?.split(">");

      const L1 = cat1?.[0]?.trim();

      const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

      const L3 = cat2?.[2]
        ? cat2?.[2]?.trim()
        : line?.product.categories?.[2]?.split(">")?.[2]?.trim();

      const clickType = localStorage.getItem("clickType");
      const search = CookieService.getCookie("search") || "";

      return {
        item_id: line?.product?.id, //Pass the product id
        item_name: line?.product?.title, // Pass the product name
        affiliation: line?.product?.title, // Pass the product name
        coupon: "NA", // Pass the coupon if available
        currency: currency, // Pass the currency code
        discount:
          isSale && line.product.discountedPriceRecords
            ? line?.product?.badgeType == "B_flat"
            : line?.product?.discountedPriceRecords[currency]
            ? line?.product?.priceRecords[currency] -
              line?.product.childAttributes[0]?.discountedPriceRecords[currency]
            : "NA",
        index: ind,
        item_brand: "Goodearth",
        item_category: L1,
        item_category2: L2,
        item_category3: L3,
        item_category4: "NA",
        item_category5: line.product.is3d ? "3d" : "non3d",
        item_list_id: "NA",
        item_list_name: search ? `${clickType}-${search}` : "NA",
        item_variant: line.product?.childAttributes[0]?.size,
        // item_category5: line?.product?.collection,
        price: line?.product?.priceRecords[currency],
        quantity: line?.quantity,
        collection_category: line?.product?.collections?.join("|"),
        country_custom: CookieService.getCookie("country"),
        price_range: "NA"
      };
    });

    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "add_shipping_info",
        previous_page_url: CookieService.getCookie("prevUrl"),
        shipping_address: shippingAddressId,
        gst_invoice: "NA",
        delivery_instruction: deliveryText ? "Yes" : "No", //Pass NA if not applicable the moment
        ecommerce: {
          currency: currency, // Pass the currency code
          value: basket?.total,
          coupon: "NA",
          items: items
        }
      });
    }
  };

  const onSelectAddress = (address?: AddressData) => {
    if (activeStep === STEP_SHIPPING) {
      if (!isBridal && customDuties?.visible && !isTermChecked) {
        setTermsErr("Please confirm to terms and conditions");
        if (window.innerWidth < 768) {
          const customErrorEle = document.querySelector("#termsAndCondition");
          customErrorEle?.scrollIntoView({
            block: "center",
            behavior: "smooth"
          });
        }
        return false;
      }

      if (shippingAddressId === 0) {
        setShippingError("Please select shipping address");
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
      addGAForShipping(address);
      if (!isBridal || !isGoodearthShipping) {
        dispatch(updateSameAsShipping(true));
      }
      // next(STEP_BILLING);
    }
    return true;
  };

  const handleSaveAndReview = (address?: AddressData) => {
    onSubmit(address);
  };

  const toggleGstInvoice = () => {
    setGst(!gst);
    if (!gst) {
      dispatch(
        updateComponent(
          POPUP.BILLINGGST,
          {
            setGst: setGst,
            setGstDetails: setGstDetails,
            setSameAsShipping: updateSameAsShipping,
            isGoodearthShipping: isGoodearthShipping,
            isBridal: isBridal
          },
          mobile ? false : true,
          mobile ? ModalStyles.bottomAlignSlideUp : "",
          mobile ? "slide-up-bottom-align" : ""
        )
      );
      dispatch(updateModal(true));
    } else {
      setGstDetails({ gstText: "", gstType: "" });
    }
  };

  const gstSection = useMemo(() => {
    return (
      currency == "INR" && (
        <div>
          <CheckboxWithLabel
            id="gst"
            onChange={() => {
              toggleGstInvoice();
            }}
            checked={gst && gstDetails?.gstText !== ""}
            label={[
              <label
                key="gst"
                htmlFor="gst"
                // className={cs(styles.indicator, {
                //   [styles.checked]: gst && gstDetails?.gstText
                // })}
                className={cs(
                  styles.formSubheading,
                  styles.checkBoxHeading,
                  styles.lineHeightLable
                )}
              >
                I need a GST invoice
                {gstDetails?.gstText && (
                  <label className={styles.gstInvoiseNo}>
                    {gstDetails?.gstType}: {gstDetails?.gstText}
                  </label>
                )}
              </label>
            ]}
          />

          {user.customerGroup == "loyalty_cerise_club" ||
          user.customerGroup == "loyalty_cerise_sitara" ? (
            <div className={cs(styles.ceriseGstDisclaimer)}>
              Note: You will not be earning any cerise loyalty points on GST
              billing
            </div>
          ) : (
            ""
          )}
        </div>
      )
    );
  }, [currency, gstDetails, gst]);

  const renderPancard = useMemo(() => {
    const pass =
      currency == "INR"
        ? `As per RBI government regulations, PAN details are mandatory for transaction above ${displayPriceWithCommas(
            amountPrice[currency],
            currency
          )}.`
        : `AS PER RBI GOVERNMENT REGULATIONS, PASSPORT DETAILS ARE MANDATORY FOR TRANSACTIONS ABOVE ${displayPriceWithCommas(
            amountPrice[currency],
            currency
          )}.`;
    const panText =
      currency == "INR" ? "PAN Card Number*" : " Passport Number*";

    return (
      amountPrice[currency] <= basket.total && (
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
          {/* <label className={cs(styles.flex, globalStyles.voffset4)}> */}
          <div className={cs(globalStyles.marginT30, globalStyles.marginB20)}>
            {/* <span className={styles.checkbox}>  */}
            <CheckboxWithLabel
              id="pancard"
              onChange={togglepancard}
              checked={pancardCheck}
              label={[
                <label
                  key="pancard"
                  htmlFor="pancard"
                  // className={cs(styles.indicator, {
                  //   [styles.checked]: pancardCheck
                  // })}
                  className={cs(
                    styles.formSubheading,
                    globalStyles.marginB0,
                    globalStyles.marginT0,
                    styles.checkBoxHeading,
                    styles.lineHeightLable
                  )}
                >
                  I CONFIRM THAT THE DATA I HAVE SHARED IS CORRECT
                </label>
              ]}
            />
          </div>

          {panCheck ? (
            <span id="pancardCheckError" className={globalStyles.errorMsg}>
              {panCheck}
            </span>
          ) : (
            ""
          )}
        </div>
      )
    );
  }, [currency, basket?.total, panCheck, panError, pancardCheck, pancardText]);

  const renderBillingCheckbox = function() {
    const show =
      !props.isGoodearthShipping && mode == "list" && !props.isBridal;
    // !props.isBridal && !props.isGoodearthShipping && mode == "list";

    return (
      show && (
        <div
          className={cs(
            styles.payment,
            globalStyles.voffset4,
            globalStyles.marginB20
          )}
        >
          {!mobile && <hr className={globalStyles.marginy24} />}
          {/* <label
            className={cs(
              styles.flex,
              styles.crossCenter,
              styles.widthFitContent
            )}
          > */}
          {/* <div className={globalStyles.marginR10}> */}
          {/* <span className={styles.checkbox}> */}
          <CheckboxWithLabel
            id="sameAsShip"
            onChange={toggleSameAsShipping}
            checked={sameAsShipping}
            label={[
              <label
                key="sameAsShip"
                htmlFor="sameAsShip"
                // className={cs(styles.indicator, {
                //   [styles.checked]: sameAsShipping
                // })}
                className={cs(styles.formSubheading, styles.lineHeightLable)}
              >
                Same as Shipping Address
              </label>
            ]}
          />

          {/* </span> */}
          {/* </div> */}
          {/* <div className={cs(styles.formSubheading)}>
              Same as Shipping Address
            </div> */}
          {/* </label> */}
        </div>
      )
    );
  };

  //CTA text of shipping and billing section
  let ctaText = "";

  if (addressList.length) {
    if (activeStep == STEP_SHIPPING) {
      if (shippingAddressId) {
        ctaText = "SHIP TO THIS ADDRESS";
      } else {
        ctaText = "SELECT AN ADDRESS";
      }
    } else {
      if (
        ((isBridal &&
          addressList.filter(e => e?.isTulsi)?.length == 1 &&
          addressList.length - 2 > 0) ||
          (isBridal &&
            addressList.filter(e => e?.isTulsi)?.length == 0 &&
            addressList.length - 1 > 0) ||
          (!isBridal && isGoodearthShipping && addressList.length - 1 > 0) ||
          (!isBridal && !isGoodearthShipping && addressList.length > 0)) &&
        !(
          isGcCheckout &&
          addressList.length > 0 &&
          (addressList[0].isTulsi || (isBridal && addressList[0].isBridal))
        )
      ) {
        if (billingAddressId) {
          ctaText = "PROCEED TO PAYMENT";
        } else {
          ctaText = "SELECT AN ADDRESS";
        }
      } else {
        ctaText = "ADD A NEW ADDRESS";
      }
    }
  } else {
    ctaText = "ADD A NEW ADDRESS";
  }

  const renderCheckoutAddress = () => {
    let html: ReactElement | null = null;

    if (isBridal && activeStep == STEP_SHIPPING) {
      html = (
        <div className={globalStyles.marginT5}>
          <div
            className={
              isActive
                ? cs(styles.card, styles.cardOpen, styles.marginT5)
                : cs(styles.card, styles.cardClosed, styles.marginT5, {
                    [styles.bgWhite]: STEP_ORDER[activeStep] > currentStep
                  })
            }
          >
            <div className={bootstrapStyles.row}>
              <div
                className={cs(
                  bootstrapStyles.col6,
                  bootstrapStyles.colMd6,
                  globalStyles.flex,
                  styles.title,
                  styles.titleMobile
                )}
              >
                {STEP_ORDER[activeStep] < currentStep ? (
                  <img
                    height={"15px"}
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
              {ctaText != "ADD A NEW ADDRESS" && renderActions(false)}
              {renderSavedAddress()}
            </div>
            {isActive && (
              <>
                <div>
                  {children}
                  {shippingError && (
                    <div
                      className={cs(globalStyles.errorMsg, globalStyles.padd10)}
                    >
                      {shippingError}
                    </div>
                  )}
                  {
                    <div
                      className={cs(
                        bootstrapStyles.row,
                        globalStyles.gutterBetween,
                        styles.checkoutAddressFooter,
                        globalStyles.paddT0
                      )}
                    >
                      <Button
                        variant="mediumMedCharcoalCta366"
                        onClick={() => {
                          onSelectAddress(
                            addressList?.find(val =>
                              shippingAddressId !== 0
                                ? val?.id === shippingAddressId
                                : val?.isDefaultForShipping === true ||
                                  (isBridal &&
                                    basket.bridalAddressId === val?.id)
                            )
                          );
                        }}
                        className={cs(
                          styles.sendToAddress,
                          styles.footerSendToAddress
                        )}
                        label={ctaText}
                      />
                    </div>
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
                  {error && (
                    <div
                      className={cs(
                        globalStyles.errorMsg,
                        globalStyles.marginT20
                      )}
                    >
                      {error}
                    </div>
                  )}
                </div>
                {addressList.length > 1 &&
                  mode == "list" &&
                  ctaText != "ADD A NEW ADDRESS" &&
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
                : //: !(STEP_ORDER[activeStep] < currentStep)
                  // styles.hidden
                  cs(styles.card, styles.cardClosed, styles.marginT5, {
                    [styles.bgWhite]: STEP_ORDER[activeStep] > currentStep
                  })
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
                      height={"15px"}
                      className={globalStyles.marginR10}
                      src={checkmarkCircle}
                      alt="checkmarkdone"
                    />
                  ) : null}
                  <span
                    className={cs(
                      {
                        [styles.iscompleted]:
                          STEP_ORDER[activeStep] < currentStep
                      },
                      isActive ? "" : styles.closed
                    )}
                  >
                    {activeStep == STEP_SHIPPING
                      ? mode == "edit" && isActive
                        ? "EDIT ADDRESS"
                        : "SHIPPING ADDRESS"
                      : activeStep == STEP_BILLING
                      ? mode == "edit" && isActive
                        ? "EDIT ADDRESS"
                        : "BILLING ADDRESS"
                      : "BILLING ADDRESS"}
                  </span>
                </div>
                {/* {mobile &&
                  ctaText != "ADD A NEW ADDRESS" &&
                  renderActions(
                    false,
                    activeStep == STEP_BILLING && !isActive && !billingAddressId
                  )} */}
              </div>
              {// !mobile &&
              ctaText != "ADD A NEW ADDRESS" &&
                renderActions(
                  false,
                  activeStep == STEP_BILLING && !isActive && !billingAddressId
                )}
              {isGcCheckout &&
                props.currentStep == STEP_ORDER[STEP_BILLING] && (
                  <p
                    className={cs(
                      globalStyles.errorMsg,
                      styles.marginT20,
                      styles.customError
                    )}
                  >
                    Please select or add an address that matches the currency of
                    your Gift Card.
                  </p>
                )}
              {renderSavedAddress()}
            </div>
            {isActive && (
              <>
                <div>
                  {/* <div>{renderPancard}</div> */}
                  {props.activeStep == STEP_BILLING && (
                    <>
                      {!props.isGcCheckout && (
                        <div>{renderBillingCheckbox()}</div>
                      )}
                      {!sameAsShipping &&
                        isLoggedIn &&
                        !props.isBridal &&
                        !props.isGoodearthShipping &&
                        !props.isGcCheckout &&
                        mode == "list" && (
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
                        (!sameAsShipping ||
                          isBridal ||
                          isGoodearthShipping ||
                          props.isGcCheckout))) && (
                      <>
                        <div>{children}</div>
                        {props.activeStep == STEP_SHIPPING &&
                          addressList.length === 0 &&
                          mode == "list" && (
                            <div
                              className={cs(
                                bootstrapStyles.row,
                                globalStyles.gutterBetween,
                                styles.checkoutAddressFooter,
                                globalStyles.paddT10
                              )}
                            >
                              <Button
                                onClick={() => openAddressForm()}
                                className={cs(
                                  styles.sendToAddress,
                                  styles.footerSendToAddress
                                )}
                                label={ctaText}
                                variant="mediumMedCharcoalCta366"
                              />
                            </div>
                          )}
                        {addressList.length && mode == "list" ? (
                          <>
                            <div></div>
                            <div
                              className={cs(
                                bootstrapStyles.row,
                                globalStyles.gutterBetween,
                                styles.checkoutAddressFooter
                              )}
                            >
                              {props.activeStep == STEP_SHIPPING &&
                                mobile &&
                                !checkoutMobileOrderSummary && (
                                  <Button
                                    onClick={() => {
                                      onSelectAddress(
                                        addressList?.find(val =>
                                          shippingAddressId !== 0
                                            ? val?.id === shippingAddressId
                                            : val?.isDefaultForShipping ===
                                                true ||
                                              (isBridal &&
                                                basket.bridalAddressId ===
                                                  val?.id)
                                        )
                                      );
                                    }}
                                    className={cs(styles.sendToAddress)}
                                    label={ctaText}
                                    variant="mediumMedCharcoalCta366"
                                  />
                                )}
                              {props.activeStep == STEP_SHIPPING && (
                                <div
                                  className={cs({
                                    [bootstrapStyles.col12]: mobile,
                                    [bootstrapStyles.colMd12]: mobile,
                                    [bootstrapStyles.col6]: !mobile,
                                    [bootstrapStyles.colMd6]: !mobile
                                  })}
                                  ref={orderSummaryRef}
                                >
                                  {customDuties?.visible && (
                                    <div
                                      className={globalStyles.marginB20}
                                      id="termsAndCondition"
                                    >
                                      <CheckboxWithLabel
                                        id="terms"
                                        onChange={() => {
                                          setIsTermChecked(!isTermChecked);
                                          setTermsErr("");
                                        }}
                                        checked={isTermChecked}
                                        label={[
                                          <label
                                            key="terms"
                                            htmlFor="terms"
                                            className={cs(
                                              styles.formSubheading,
                                              styles.checkBoxHeading
                                            )}
                                          >
                                            {" "}
                                            {ReactHtmlParser(
                                              customDuties?.message
                                            )}
                                          </label>
                                        ]}
                                      />
                                    </div>
                                  )}
                                  {termsErr && customDuties?.visible && (
                                    <div
                                      className={cs(
                                        globalStyles.errorMsg,
                                        globalStyles.marginL30,
                                        globalStyles.marginB15
                                      )}
                                    >
                                      {termsErr}
                                    </div>
                                  )}
                                  {shippingError && (
                                    <div
                                      className={cs(
                                        globalStyles.errorMsg,
                                        globalStyles.marginB15
                                      )}
                                    >
                                      {shippingError}
                                    </div>
                                  )}
                                  {/* ref for handling fixed button */}
                                  {/* <div ref={orderSummaryRef}>&nbsp;</div> */}
                                  {((checkoutMobileOrderSummary && mobile) ||
                                    !mobile) && (
                                    <Button
                                      onClick={() => {
                                        onSelectAddress(
                                          addressList?.find(val =>
                                            shippingAddressId !== 0
                                              ? val?.id === shippingAddressId
                                              : val?.isDefaultForShipping ===
                                                  true ||
                                                (isBridal &&
                                                  basket.bridalAddressId ===
                                                    val?.id)
                                          )
                                        );
                                      }}
                                      className={cs(
                                        styles.sendToAddress,
                                        styles.footerSendToAddress
                                      )}
                                      label={ctaText}
                                      variant="mediumMedCharcoalCta366"
                                    />
                                  )}
                                </div>
                              )}
                              {!mobile &&
                                addressList.length > 1 &&
                                mode == "list" &&
                                (props.activeStep == STEP_SHIPPING ||
                                  (props.activeStep == STEP_BILLING &&
                                    false)) &&
                                renderActions(false)}
                            </div>
                          </>
                        ) : null}
                        {!mobile &&
                          addressList.length > 1 &&
                          mode == "list" &&
                          props.activeStep == STEP_BILLING &&
                          !sameAsShipping &&
                          ctaText != "ADD A NEW ADDRESS" &&
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

                  {props.activeStep == STEP_BILLING && isActive && (
                    <div>
                      {gstSection}
                      {renderPancard}
                    </div>
                  )}
                  {props.activeStep == STEP_BILLING &&
                    (error || billingError) &&
                    !["edit", "new"].includes(mode) && (
                      <div
                        className={cs(
                          globalStyles.errorMsg,
                          globalStyles.marginB15
                        )}
                      >
                        {error || billingError}
                      </div>
                    )}
                  {props.activeStep == STEP_BILLING &&
                    mode == "list" &&
                    !sameAsShipping && <div ref={orderSummaryRef2}></div>}
                  {/* from-billing */}
                  {props.activeStep == STEP_BILLING && mode == "list" && (
                    <div className={bootstrapStyles.row}>
                      <div
                        className={cs(
                          bootstrapStyles.col12,
                          bootstrapStyles.colLg7
                        )}
                      >
                        <Button
                          className={cs(
                            globalStyles.marginT20
                            // styles.sendToPayment,
                          )}
                          onClick={() => {
                            if (ctaText === "ADD A NEW ADDRESS") {
                              openAddressForm();
                            } else {
                              handleSaveAndReview(
                                !props.isGcCheckout
                                  ? addressList?.find(val =>
                                      shippingAddressId !== 0
                                        ? sameAsShipping &&
                                          !isBridal &&
                                          !isGoodearthShipping
                                          ? val?.id === shippingAddressId
                                          : val?.id === billingAddressId
                                        : val?.id === billingAddressId
                                    )
                                  : addressList?.find(
                                      val => val?.id === billingAddressId
                                    )
                              );
                            }
                          }}
                          label={ctaText}
                          variant="mediumMedCharcoalCta366"
                        />
                      </div>
                    </div>
                  )}

                  <div
                    className={cs(
                      bootstrapStyles.row,
                      globalStyles.gutterBetween,
                      styles.checkoutAddressFooter
                    )}
                  >
                    {props.activeStep == STEP_BILLING &&
                      mode == "list" &&
                      !sameAsShipping &&
                      mobile &&
                      !checkoutMobileOrderSummary && (
                        <Button
                          onClick={() => {
                            if (ctaText === "ADD A NEW ADDRESS") {
                              openAddressForm();
                            } else {
                              handleSaveAndReview(
                                addressList?.find(val =>
                                  shippingAddressId !== 0
                                    ? sameAsShipping
                                      ? val?.id === shippingAddressId
                                      : val?.id === billingAddressId
                                    : val?.isDefaultForShipping === true
                                )
                              );
                            }
                          }}
                          className={cs(styles.sendToAddress)}
                          label={ctaText}
                          variant="mediumMedCharcoalCta366"
                        />
                      )}
                  </div>
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
