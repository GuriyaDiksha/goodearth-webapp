import React, { useContext, useState } from "react";
import { AddressData } from "../typings";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import AddressService from "services/address";
import { STEP_SHIPPING } from "containers/checkout/constants";
import { useDispatch, useSelector } from "react-redux";
import { AddressContext } from "components/Address/AddressMain/context";
import { CheckoutAddressContext } from "containers/checkout/component/context";
import BridalContext from "containers/myAccount/components/Bridal/context";
import { AppState } from "reducers/typings";
import bridalRing from "../../../images/bridal/rings.svg";
import addedReg from "../../../images/registery/addedReg.svg";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import moment from "moment";
import Button from "components/Button";

type Props = {
  addressData: AddressData;
  title?: string;
  index: number;
  isOnlyAddress: boolean;
  // addressType?: string;
  currentCallBackComponent?: string;
  showAddressInBridalUse?: boolean;
  shippingErrorMsg?: string;
  billingErrorMsg?: string;
  addressDataIdError?: number;
  userAddress?: any;
  defaultAddress?: string;
  setDefaultAddress?: (x: string) => void;
  isGcCheckout?: boolean;
};

const AddressItem: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const {
    openAddressForm,
    markAsDefault,
    setIsLoading,
    currentCallBackComponent,
    activeStep,
    isAddressValid
  } = useContext(AddressContext);
  const { onSelectAddress } = useContext(CheckoutAddressContext);
  const { bridalProfile } = useContext(BridalContext);
  const {
    currency,
    basket,
    address: { shippingAddressId, billingAddressId }
  } = useSelector((state: AppState) => state);

  // const isDefaultAddress = () => {
  //     return props.addressData.isDefaultForShipping;
  // }
  const currentDate = moment().format("DD/MM/YYYY");
  const {
    step,
    changeBridalAddress,
    setCurrentModule,
    setCurrentModuleData,
    data: { userAddress }
  } = useContext(BridalContext);
  const [deleteError, setDeleteError] = useState("");
  // const [isSlected, setIsSlected] = useState(false);
  const address = props.addressData;
  // const [selectId, setSelectId ] = useState(data.userAddress?.id || '');
  const deleteAddress = (event: any) => {
    event.stopPropagation();
    setIsLoading(true);
    const maindiv = document.getElementById(`address-item-${address.id}`);
    AddressService.deleteAddress(dispatch, address.id)
      .catch(err => {
        const error = err.response.data;

        if (typeof error == "string") {
          maindiv.getElementsByTagName("div")[0].style =
            "border : 1px solid #ab1e56";
          setDeleteError(error);
        }
      })
      .finally(() => setIsLoading(false));
    if (deleteError) {
      maindiv.getElementsByTagName("div")[0].style =
        "border : 1px solid #ab1e56";
    }
  };

  // deleteAddress(id) {
  //     props.setLoadingStatus(true);
  //     if(currentCallBackComponent == "checkout") {
  //         props.onDeleteAddress(id);
  //     } else {
  //         let formData = new FormData();
  //         formData.append("action_type", "delete");
  //         formData.append("id", id);
  //         axios.post(Config.hostname + 'myapi/saveaddressdetails/', formData
  //         ).then((response) => {
  //             if (response.data.Status) {
  //                 props.showEditForm({showAddresses: true, editMode: false, newAddressMode: false})
  //                 if (props.setAddressModeProfile) {
  //                     props.setAddressModeProfile({showAddresses: true, editMode: false, newAddressMode: false})
  //                 }
  //                 props.setUpdatedDefaultAddress(response);
  //                 props.setLoadingStatus(false);
  //             } else {
  //                 props.setLoadingStatus(false);
  //             }
  //         }).catch((err) => {
  //             console.error('Axios Error: ', err);
  //             props.setLoadingStatus(false);
  //         })
  //     }
  // }

  const handleSelect = (address: AddressData) => {
    switch (currentCallBackComponent) {
      case "bridal":
        if (step == "manage") {
          changeBridalAddress(address.id);
        } else {
          setCurrentModuleData("address", {
            userAddress: address
          });
          // setCurrentModule("created");
          // setCurrentModule("address");
        }
        break;
      case "bridal-edit":
        if (step == "create") {
          changeBridalAddress(address.id);
        } else {
          setCurrentModuleData("address", {
            userAddress: address
          });
          // setSelectId(address.id);
          setCurrentModule("created");
        }
        break;
      // case "checkout":
      //     let products = valid.productForGa(props.items);
      //     if(props.addressType == 'SHIPPING') {
      //         dataLayer.push({
      //             'event': 'checkout',
      //             'ecommerce': {
      //                 'currencyCode': window.currency,
      //                 'checkout': {
      //                     'actionField': {'step': 2},
      //                     'products': products
      //                 }
      //             }
      //         })
      //     } else {
      //         dataLayer.push({
      //             'event': 'checkout',
      //             'ecommerce': {
      //                 'currencyCode': window.currency,
      //                 'checkout': {
      //                     'actionField': {'step': 3},
      //                     'products': products
      //                 }
      //             }
      //         })
      //     }
      //     props.onSelectAddress(props.address);
      // break;
    }
  };

  const onSelectBridalAddress = (address: AddressData) => {
    if (address) {
      const isValid = isAddressValid(address);
      if (isValid) {
        // this.props.onSelectAddress(address);
        handleSelect(address);
        // setIsSlected(true);
      } else {
        // this.manageAddressPostcode("edit", address);
        openAddressForm(address);
      }
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
      // const arr = category.split(">");

      return {
        item_id: line?.product?.id, //Pass the product id
        item_name: line?.product?.title, // Pass the product name
        affiliation: line?.product?.title, // Pass the product name
        coupon: "NA", // Pass the coupon if available
        currency: currency, // Pass the currency code
        discount: "NA", // Pass the discount amount
        index: ind,
        item_brand: "Goodearth",
        item_category: category?.split(">")?.join("/"),
        item_category2: line.product?.childAttributes[0]?.size,
        item_category3: line.product.is3d ? "3d" : "non3d",
        item_category4: line.product.is3d ? "YES" : "NO",
        item_list_id: "NA",
        item_list_name: "NA",
        item_variant: "NA",
        // item_category5: line?.product?.collection,
        price: line?.product?.priceRecords[currency],
        quantity: line?.quantity,
        collection_category: line?.product?.collections?.join("|")
      };
    });

    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "add_shipping_info",
        previous_page_url: CookieService.getCookie("prevUrl"),
        shipping_address: shippingAddressId,
        gst_invoice: "NA",
        delivery_instruction: "NA", //Pass NA if not applicable the moment
        ecommerce: {
          currency: currency, // Pass the currency code
          value: basket?.total,
          coupon: "NA",
          items: items
        }
      });
    }
  };
  // const openAddressForm = (address: AddressData) => {
  //     // props.showEditForm({showAddresses: false, addressData: data, editMode: true, newAddressMode: false, addressesAvailable: true});
  //     // if (props.setAddressModeProfile) {
  //     //     props.setAddressModeProfile({showAddresses: false, addressData: data, editMode: true, newAddressMode: false, addressesAvailable: true})
  //     // }
  //     setEditAddressData(address);
  //     setMode("edit");
  // }

  // selectAddress(address) {
  //     switch(currentCallBackComponent) {
  //         case "bridal":
  //             if (props.case == "manage") {
  //                 props.changeBridalAddress(address.id, address);
  //             } else {
  //                 props.setCurrentModuleData('address', {'user_address': address.id}, address);
  //                 // props.setCurrentModule('created');
  //             }
  //         break;
  //         case "checkout":
  //             let products = valid.productForGa(props.items);
  //             if(activeStep == 'SHIPPING') {
  //                 dataLayer.push({
  //                     'event': 'checkout',
  //                     'ecommerce': {
  //                         'currencyCode': window.currency,
  //                         'checkout': {
  //                             'actionField': {'step': 2},
  //                             'products': products
  //                         }
  //                     }
  //                 })
  //             } else {
  //                 dataLayer.push({
  //                     'event': 'checkout',
  //                     'ecommerce': {
  //                         'currencyCode': window.currency,
  //                         'checkout': {
  //                             'actionField': {'step': 3},
  //                             'products': products
  //                         }
  //                     }
  //                 })
  //             }
  //             props.onSelectAddress(props.addressData);
  //         break;
  //     }
  // }

  const { shippingData } = useSelector((state: AppState) => state.user);
  const i = props.index;
  const id = `default_check_${i}`;
  const addressLineOneWithSpace =
    address.line1.split("").indexOf(" ") > 0 ? 40 : 30;
  const addressLineTwoWithSpace =
    address.line2.split("").indexOf(" ") > 0 ? 40 : 12;
  const divOrText =
    address.firstName.length + address.lastName.length < 21 ? "text" : "div";
  const billingEditDisable =
    activeStep == "BILLING" &&
    shippingData &&
    address.id == shippingData.id &&
    !props.isGcCheckout;

  return (
    <div
      className={
        currentCallBackComponent == "checkout-billing" ||
        currentCallBackComponent == "checkout-shipping"
          ? cs(
              bootstrapStyles.col12,
              bootstrapStyles.colMd6,
              globalStyles.voffset3v1,
              styles.checkoutAddress,
              "address-container"
            )
          : cs(
              bootstrapStyles.col12,
              // bootstrapStyles.colMd12,
              globalStyles.voffset3v1,
              "address-container"
            )
      }
      id={`address-item-${address.id}`}
      onClick={() => {
        if (!(props.isGcCheckout && currency != address.currency)) {
          (currentCallBackComponent == "checkout-billing" ||
            currentCallBackComponent == "checkout-shipping") &&
            markAsDefault(address);
        }
      }}
    >
      <div
        className={cs(
          styles.addressItemContainer,
          props.isGcCheckout && currency != address.currency
            ? styles.fadedContainer
            : "",
          {
            [styles.defaultAddress]:
              currentCallBackComponent == "checkout-shipping"
                ? address.id.toString() === shippingAddressId.toString()
                : currentCallBackComponent == "checkout-billing" &&
                  address.id.toString() === billingAddressId.toString()
          },
          {
            [styles.addressItemContainerBridal]:
              currentCallBackComponent == "bridal" ||
              currentCallBackComponent == "bridal-edit"
          },
          {
            [styles.ceriseAddressItemContainer]:
              props.currentCallBackComponent == "cerise"
          },
          {
            [styles.default]:
              address.id.toString() === shippingAddressId.toString() &&
              currentCallBackComponent == "checkout-shipping"
          },
          {
            [styles.isTulsi]: address.isTulsi
          }
        )}
      >
        <div
          className={cs(
            styles.addressItem,
            {
              [styles.addressItemCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing" ||
                currentCallBackComponent == "bridal" ||
                currentCallBackComponent == "bridal-edit"
            },
            // {
            //   [styles.checkoutFix]:
            //     currentCallBackComponent == "bridal" ||
            //     currentCallBackComponent == "bridal-edit"
            // },
            // { [styles.shippingBorder]: address.isTulsi },
            { [styles.diabledBorder]: address.id == userAddress?.id },
            {
              [styles.addressInUse]:
                // props.showAddressInBridalUse && address.isBridal
                address.id.toString() ===
                bridalProfile?.userAddressId.toString()
            },
            // { [styles.isActiveItem]: isSlected},
            {
              [styles.checkoutHeightFix]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing" ||
                currentCallBackComponent == "bridal" ||
                currentCallBackComponent == "bridal-edit"
            }
          )}
          onClick={() => {
            if (
              currentCallBackComponent == "bridal" ||
              currentCallBackComponent == "bridal-edit"
            ) {
              // if (props.showAddressInBridalUse && address.isBridal) {
              if (address.id != userAddress?.id) {
                onSelectBridalAddress(address);
                const firstErrorField = document.getElementById(
                  "address_button"
                ) as HTMLDivElement;
                if (firstErrorField) {
                  firstErrorField.focus();
                  firstErrorField.scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                  });
                }
                window.scrollTo(0, 0);
              }
              // }
            }
          }}
        >
          {/* {isSelected &&
          <div className={cs(styles.radio, "isSelectedBridalRadio")}>
            <input
              id={address.id.toString()}
              className={styles.defaultAddressCheckbox}
              // checked={
              //     address.id.toString() === bridalAddressId.toString()
              // }
              checked = {props.showAddressInBridalUse && address.isBridal? true:false}
              name={id}
              type="radio"
              onClick={() => {
                if (
                  !(props.showAddressInBridalUse && address.isBridal)
                ) {
                  if (address.id != userAddress?.id) {
                    onSelectBridalAddress(address);
                    const firstErrorField = document.getElementById(
                      "address_button"
                    ) as HTMLDivElement;
                    if (firstErrorField) {
                      firstErrorField.focus();
                      firstErrorField.scrollIntoView({
                        block: "center",
                        behavior: "smooth"
                      });
                    }
                    window.scrollTo(0, 0);
                  }
                }
              }}
            />
            <span className={styles.checkmark}></span>
          </div>}  */}
          {/*=================== Name and Default ================= */}
          {/* {currentCallBackComponent != "account" &&
            currentCallBackComponent != "checkout-shipping" &&
            currentCallBackComponent != "checkout-billing" &&
            currentCallBackComponent != "bridal" &&
            currentCallBackComponent != "bridal-edit" && (
              <div>
                {!(id === defaultAddress) && (
                  <div
                    className={cs(styles.line, styles.makeDefaultCheckoutFix)}
                  >
                    {!address.isTulsi && "Make default"}
                    {!address.isTulsi &&
                      props.currentCallBackComponent != "cerise" && (
                        <div
                          className={styles.radio}
                          id={id}
                          onClick={() => {
                            markAsDefault(address);
                            setDefaultAddress && setDefaultAddress(id);
                            if (
                              !(
                                props.isGcCheckout &&
                                currency != address.currency
                              )
                            ) {
                              markAsDefault(address, address?.id);
                              setDefaultAddress && setDefaultAddress(id);
                            }
                          }}
                        >
                          <input
                            id={id}
                            className={cs(
                              styles.defaultAddressCheckbox,
                              styles.checkoutFix
                            )}
                            checked={id === defaultAddress}
                            name={id}
                            type="radio"
                            onChange={() => {
                              markAsDefault(address);
                              setDefaultAddress && setDefaultAddress(id);
                              if (
                                !(
                                  props.isGcCheckout &&
                                  currency != address.currency
                                )
                              ) {
                                markAsDefault(address, address?.id);
                                setDefaultAddress && setDefaultAddress(id);
                              }
                            }}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}

          {currentCallBackComponent != "account" &&
            currentCallBackComponent != "checkout-shipping" &&
            currentCallBackComponent != "checkout-billing" &&
            currentCallBackComponent != "bridal" &&
            currentCallBackComponent != "bridal-edit" && (
              <div>
                {id === defaultAddress && (
                  <div className={cs(styles.line, styles.defaultCheckoutFix)}>
                    {!address.isTulsi && "Default"}
                    {!address.isTulsi &&
                      props.currentCallBackComponent != "cerise" && (
                        <div
                          className={styles.radio}
                          id={id}
                          onClick={() => {
                            markAsDefault(address);
                            setDefaultAddress && setDefaultAddress(id);
                            if (
                              !(
                                props.isGcCheckout &&
                                currency != address.currency
                              )
                            ) {
                              markAsDefault(address, address?.id);
                              setDefaultAddress && setDefaultAddress(id);
                            }
                          }}
                        >
                          <input
                            id={id}
                            className={cs(
                              styles.defaultAddressCheckbox,
                              styles.checkoutFix
                            )}
                            checked={id === defaultAddress}
                            name={id}
                            type="radio"
                            onChange={() => {
                              markAsDefault(address);
                              setDefaultAddress && setDefaultAddress(id);
                              if (
                                !(
                                  props.isGcCheckout &&
                                  currency != address.currency
                                )
                              ) {
                                markAsDefault(address, address?.id);
                                setDefaultAddress && setDefaultAddress(id);
                              }
                            }}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>
            )} */}

          {divOrText == "text" &&
            currentCallBackComponent != "account" &&
            currentCallBackComponent != "checkout-shipping" &&
            currentCallBackComponent != "checkout-billing" && (
              <div className={cs(styles.lineHead, styles.checkoutFix)}>
                {props.title}
                {/* {address.firstName}
                &nbsp;
                {address.lastName} */}
                {(currentCallBackComponent == "bridal" ||
                  currentCallBackComponent == "bridal-edit") && (
                  // !(props.showAddressInBridalUse && address.isBridal) && (
                  <div className={cs(styles.radio, "bridalRadio")}>
                    <input
                      id={address.id.toString()}
                      className={styles.defaultAddressCheckbox}
                      checked={
                        address.id.toString() ===
                        bridalProfile?.userAddressId.toString()
                      }
                      name={id}
                      type="radio"
                      onClick={() => {
                        if (
                          !(props.showAddressInBridalUse && address.isBridal)
                        ) {
                          if (address.id != userAddress?.id) {
                            onSelectBridalAddress(address);
                            const firstErrorField = document.getElementById(
                              "address_button"
                            ) as HTMLDivElement;
                            if (firstErrorField) {
                              firstErrorField.focus();
                              firstErrorField.scrollIntoView({
                                block: "center",
                                behavior: "smooth"
                              });
                            }
                            window.scrollTo(0, 0);
                          }
                        }
                      }}
                    />
                    <span className={styles.checkmark}></span>
                  </div>
                )}
                <div className="useName">
                  {address.firstName}
                  &nbsp;
                  {address.lastName}
                </div>
              </div>
            )}

          {divOrText == "text" && currentCallBackComponent == "account" && (
            <div className={styles.lineHead}>
              {/* {!address.isTulsi && props.currentCallBackComponent != "cerise" && (
                <div
                  className={styles.radio}
                  id={id}
                  onClick={() => {
                    markAsDefault(address);
                    setDefaultAddress && setDefaultAddress(id);
                    if (!(props.isGcCheckout && currency != address.currency)) {
                      markAsDefault(address, address?.id);
                      setDefaultAddress && setDefaultAddress(id);
                    }
                  }}
                >
                  <input
                    id={id}
                    className={styles.defaultAddressCheckbox}
                    checked={id === defaultAddress}
                    name={id}
                    type="radio"
                    onChange={() => {
                      markAsDefault(address);
                      setDefaultAddress && setDefaultAddress(id);
                      if (
                        !(props.isGcCheckout && currency != address.currency)
                      ) {
                        markAsDefault(address, address?.id);
                        setDefaultAddress && setDefaultAddress(id);
                      }
                    }}
                  />
                  <span className={styles.checkmark}></span>
                </div>
              )} */}
              {props.title}
              {address.firstName}
              &nbsp;
              {address.lastName}
              {!address.isTulsi && (
                <div className={styles.defaultContainer}>
                  <div
                    className={cs(styles.defaultAddressDiv, {
                      [styles.bridalAddressItem]: address.isBridal
                    })}
                  >
                    {address.isBridal && (
                      // <svg
                      //   viewBox="-3 -3 46 46"
                      //   width="60"
                      //   height="60"
                      //   preserveAspectRatio="xMidYMid meet"
                      //   x="0"
                      //   y="0"
                      //   className={styles.ceriseBridalRings}
                      // >
                      //   <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                      // </svg>
                      <img
                        className={styles.ceriseBridalRings}
                        src={addedReg}
                        width="35"
                        alt="gift_reg_icon"
                      />
                    )}
                    {/* {id === defaultAddress && (
                      <div className={styles.defaultAddress}>
                        Default Address
                      </div>
                    )} */}
                    {/* {!address.isDefaultForShipping && (
                      <div className={styles.line}>Make default</div>
                    )} */}
                  </div>
                </div>
              )}
            </div>
          )}
          {divOrText == "text" &&
            currentCallBackComponent == "checkout-shipping" && (
              <div className={styles.lineHead}>
                {!address.isTulsi &&
                  props.currentCallBackComponent != "cerise" && (
                    <div
                      className={styles.radio}
                      id={address.id.toString()}
                      onClick={() => {
                        markAsDefault(address);
                        // setDefaultAddress(id);
                      }}
                    >
                      <input
                        id={address.id.toString()}
                        className={styles.defaultAddressCheckbox}
                        checked={
                          address.id.toString() === shippingAddressId.toString()
                        }
                        name={address.id.toString()}
                        type="radio"
                        onChange={() => {
                          markAsDefault(address);
                          //setDefaultAddress(id);
                        }}
                      />
                      <span className={styles.checkmark}></span>
                    </div>
                  )}
                {props.title}
                {address.firstName}
                &nbsp;
                {address.lastName}
                {!address.isTulsi && (
                  <div className={styles.defaultContainer}>
                    <div
                      className={cs(styles.defaultAddressDiv, {
                        [styles.bridalAddressItem]: address.isBridal
                      })}
                    >
                      {address.isBridal && (
                        // <svg
                        //   viewBox="-3 -3 46 46"
                        //   width="60"
                        //   height="60"
                        //   preserveAspectRatio="xMidYMid meet"
                        //   x="0"
                        //   y="0"
                        //   className={styles.ceriseBridalRings}
                        // >
                        //   <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                        // </svg>
                        <img
                          className={styles.ceriseBridalRings}
                          src={addedReg}
                          width="35"
                          alt="gift_reg_icon"
                        />
                      )}
                      {/* {id === defaultAddress && (
                        <div className={styles.defaultAddress}>
                          Default Address
                        </div>
                      )} */}
                      {/* {!address.isDefaultForShipping && (
                      <div className={styles.line}>Make default</div>
                    )} */}
                    </div>
                  </div>
                )}
              </div>
            )}
          {divOrText == "text" &&
            currentCallBackComponent == "checkout-billing" && (
              <div className={styles.lineHead}>
                {!address.isTulsi &&
                  props.currentCallBackComponent != "cerise" && (
                    <div
                      className={styles.radio}
                      id={address.id.toString()}
                      onClick={() => {
                        if (
                          !(props.isGcCheckout && currency != address.currency)
                        ) {
                          markAsDefault(address);
                          // setDefaultAddress(id);
                        }
                      }}
                    >
                      <input
                        id={address.id.toString()}
                        className={styles.defaultAddressCheckbox}
                        checked={
                          address.id.toString() === billingAddressId.toString()
                        }
                        name={address.id.toString()}
                        type="radio"
                        onChange={() => {
                          if (
                            !(
                              props.isGcCheckout && currency != address.currency
                            )
                          ) {
                            markAsDefault(address);
                            // setDefaultAddress(id);
                          }
                        }}
                      />
                      <span className={styles.checkmark}></span>
                    </div>
                  )}
                {props.title}
                {address.firstName}
                &nbsp;
                {address.lastName}
                {!address.isTulsi && (
                  <div className={styles.defaultContainer}>
                    <div
                      className={cs(styles.defaultAddressDiv, {
                        [styles.bridalAddressItem]: address.isBridal
                      })}
                    >
                      {address.isBridal && (
                        // <svg
                        //   viewBox="-3 -3 46 46"
                        //   width="60"
                        //   height="60"
                        //   preserveAspectRatio="xMidYMid meet"
                        //   x="0"
                        //   y="0"
                        //   className={styles.ceriseBridalRings}
                        // >
                        //   <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                        // </svg>
                        <img
                          className={styles.ceriseBridalRings}
                          src={addedReg}
                          width="35"
                          alt="gift_reg_icon"
                        />
                      )}
                      {/* {id === defaultAddress && (
                        <div className={styles.defaultAddress}>
                          Default Address
                        </div>
                      )} */}
                      {/* {!address.isDefaultForShipping && (
                      <div className={styles.line}>Make default</div>
                    )} */}
                    </div>
                  </div>
                )}
              </div>
            )}
          {divOrText == "div" && (
            <div
              className={cs(styles.lineHead, {
                [styles.checkoutFix]:
                  (currentCallBackComponent == "checkout-shipping" &&
                    address.isTulsi) ||
                  (currentCallBackComponent == "checkout-billing" &&
                    address.isTulsi) ||
                  currentCallBackComponent == "bridal" ||
                  currentCallBackComponent == "bridal-edit"
              })}
            >
              {(currentCallBackComponent == "checkout-shipping" ||
                (!address.isTulsi &&
                  currentCallBackComponent == "checkout-billing")) && (
                <div
                  className={styles.radio}
                  id={
                    currentCallBackComponent !== "checkout-billing" &&
                    currentCallBackComponent !== "checkout-shipping"
                      ? id
                      : address.id.toString()
                  }
                  onClick={() => {
                    if (!(props.isGcCheckout && currency != address.currency)) {
                      markAsDefault(address);
                    }
                  }}
                >
                  <input
                    id={
                      currentCallBackComponent !== "checkout-billing" &&
                      currentCallBackComponent !== "checkout-shipping"
                        ? id
                        : address.id.toString()
                    }
                    className={styles.defaultAddressCheckbox}
                    checked={
                      currentCallBackComponent == "checkout-billing" &&
                      billingAddressId
                        ? address.id.toString() === billingAddressId.toString()
                        : currentCallBackComponent == "checkout-shipping" &&
                          shippingAddressId
                        ? address.id.toString() === shippingAddressId.toString()
                        : false
                    }
                    name={
                      currentCallBackComponent !== "checkout-billing" &&
                      currentCallBackComponent !== "checkout-shipping"
                        ? id
                        : address.id.toString()
                    }
                    type="radio"
                    onChange={() => {
                      if (
                        !(props.isGcCheckout && currency != address.currency)
                      ) {
                        markAsDefault(address);
                      }
                    }}
                  />
                  <span className={styles.checkmark}></span>
                </div>
              )}
              {(currentCallBackComponent == "bridal" ||
                currentCallBackComponent == "bridal-edit") && (
                // !(props.showAddressInBridalUse && address.isBridal) && (
                <div className={cs(styles.radio, "bridalRadio")}>
                  <input
                    id={address.id.toString()}
                    className={styles.defaultAddressCheckbox}
                    checked={
                      // address.id.toString() === bridalAddressId.toString()
                      address.id.toString() ===
                      bridalProfile?.userAddressId.toString()
                    }
                    name={id}
                    type="radio"
                    onClick={() => {
                      if (!(props.showAddressInBridalUse && address.isBridal)) {
                        if (address.id != userAddress?.id) {
                          onSelectBridalAddress(address);
                          const firstErrorField = document.getElementById(
                            "address_button"
                          ) as HTMLDivElement;
                          if (firstErrorField) {
                            firstErrorField.focus();
                            firstErrorField.scrollIntoView({
                              block: "center",
                              behavior: "smooth"
                            });
                          }
                          window.scrollTo(0, 0);
                        }
                      }
                    }}
                  />
                  <span className={styles.checkmark}></span>
                </div>
              )}
              {props.title}
              {address.firstName}
              &nbsp;
              {address.lastName}
              {!address.isTulsi && (
                <div className={styles.defaultContainer}>
                  <div
                    className={cs(styles.defaultAddressDiv, {
                      [styles.bridalAddressItem]: address.isBridal
                    })}
                  >
                    {address.isBridal && (
                      // <svg
                      //   viewBox="-3 -3 46 46"
                      //   width="60"
                      //   height="60"
                      //   preserveAspectRatio="xMidYMid meet"
                      //   x="0"
                      //   y="0"
                      //   className={styles.ceriseBridalRings}
                      // >
                      //   <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                      // </svg>
                      <img
                        className={styles.ceriseBridalRings}
                        src={addedReg}
                        width="35"
                        alt="gift_reg_icon"
                      />
                    )}
                    {/* {id === defaultAddress &&
                      currentCallBackComponent == "account" && (
                        <div className={styles.defaultAddress}>
                          Default Address
                        </div>
                      )} */}
                    {/* {!address.isDefaultForShipping && (
                      <div className={styles.line}>Make default</div>
                    )} */}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========== Nickname ======== */}

          <div className={cs(styles.nicknameWrapper)}>
            {address?.addressType}
          </div>
          {/* ========= Address ============= */}
          <div className={cs(styles.addressWrapper)}>
            <div
              className={cs(
                globalStyles.voffset2,
                styles.line,
                styles.addressLine,
                {
                  [styles.checkoutFix]:
                    currentCallBackComponent == "bridal" ||
                    currentCallBackComponent == "bridal-edit"
                }
              )}
            >
              {address.line1.length > addressLineOneWithSpace
                ? address.line1.slice(0, addressLineOneWithSpace).concat("...")
                : address.line1}
            </div>
            <div
              className={cs(styles.line, styles.addressLine, {
                [styles.checkoutFix]:
                  currentCallBackComponent == "bridal" ||
                  currentCallBackComponent == "bridal-edit"
              })}
            >
              {address.line2.length > addressLineTwoWithSpace
                ? address.line2.slice(0, addressLineTwoWithSpace).concat("...")
                : address.line2}
            </div>
            <div
              className={cs(styles.line, {
                [styles.checkoutFix]:
                  currentCallBackComponent == "bridal" ||
                  currentCallBackComponent == "bridal-edit"
              })}
            >
              {address.city}
            </div>
            <div
              className={cs(styles.line, styles.addressLine, {
                [styles.checkoutFix]:
                  currentCallBackComponent == "bridal" ||
                  currentCallBackComponent == "bridal-edit"
              })}
            >
              {address.state
                ? address.state
                : address.province
                ? address.province
                : ""}
              , {address.postCode == "000000" ? "" : address.postCode}
            </div>
            <div
              className={cs(styles.line, styles.addressLine, {
                [styles.checkoutFix]:
                  currentCallBackComponent == "bridal" ||
                  currentCallBackComponent == "bridal-edit"
              })}
            >
              {address.countryName}
            </div>
          </div>
          <div
            className={cs(styles.phoneAndEditContainer, {
              // [styles.checkoutFix]:
              //   currentCallBackComponent == "bridal" ||
              //   currentCallBackComponent == "bridal-edit"
            })}
          >
            {/* ================== Mobile ==================== */}
            <div
              className={cs(styles.addressPhoneNumber, {
                // [styles.checkoutFix]:
                //   currentCallBackComponent == "bridal" ||
                //   currentCallBackComponent == "bridal-edit"
              })}
            >
              M: {`${address.phoneCountryCode} ${address.phoneNumber}`}
            </div>
            {/* ================== Edit and Delete ======================== */}
            <div
              className={cs(styles.edit, {
                // [styles.addCheckoutActions]:
                //   currentCallBackComponent == "bridal" ||
                //   currentCallBackComponent == "bridal-edit"
              })}
            >
              {!(
                address.isTulsi ||
                address.isBackendOrder ||
                props.currentCallBackComponent == "cerise"
              ) &&
                !(props.isGcCheckout && currency != address.currency) && (
                  <span
                    className={cs(
                      styles.action,
                      {
                        [styles.addressEdit]: billingEditDisable
                      }
                      // {
                      //   [styles.checkoutFix]:
                      //     currentCallBackComponent == "bridal" ||
                      //     currentCallBackComponent == "bridal-edit"
                      // }
                    )}
                    onClick={event => {
                      event.stopPropagation();
                      if (billingEditDisable) {
                        false;
                      } else {
                        openAddressForm(address);
                      }
                    }}
                  >
                    EDIT
                  </span>
                )}
              {!(
                currentCallBackComponent == "bridal" ||
                currentCallBackComponent == "bridal-edit" ||
                address.isBridal ||
                address.isBackendOrder ||
                props.isOnlyAddress ||
                address.isTulsi ||
                props.currentCallBackComponent == "cerise" ||
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
              ) && (
                <span
                  className={cs(styles.separator, {
                    [styles.checkoutFix]:
                      currentCallBackComponent == "bridal" ||
                      currentCallBackComponent == "bridal-edit"
                  })}
                >
                  |
                </span>
              )}
              {!(
                currentCallBackComponent == "bridal" ||
                currentCallBackComponent == "bridal-edit" ||
                address.isBridal ||
                props.isOnlyAddress ||
                address.isBackendOrder ||
                address.isTulsi ||
                props.currentCallBackComponent == "cerise" ||
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
              ) && (
                <span
                  className={cs(styles.action, {
                    [styles.checkoutFix]:
                      currentCallBackComponent == "bridal" ||
                      currentCallBackComponent == "bridal-edit"
                  })}
                  onClick={deleteAddress}
                >
                  DELETE
                </span>
              )}
            </div>
          </div>
          {currentCallBackComponent !== "account" &&
            currentCallBackComponent !== "checkout-billing" &&
            currentCallBackComponent !== "checkout-shipping" &&
            currentCallBackComponent !== "bridal" &&
            currentCallBackComponent !== "bridal-edit" &&
            props.currentCallBackComponent !== "cerise" && (
              <div
                className={cs(globalStyles.ceriseBtn, styles.shipToThisBtn)}
                onClick={() => {
                  onSelectAddress(address);
                  addGAForShipping(address);
                }}
              >
                {activeStep == STEP_SHIPPING ? "SHIP" : "BILL"}
                &nbsp;TO THIS ADDRESS {address.isTulsi ? "(FREE)" : ""}
              </div>
            )}
          {address.isTulsi &&
            currentCallBackComponent == "checkout-shipping" && (
              <div className={styles.freeShippingText}>
                Free shipping for this address
              </div>
            )}
          {/* {(currentCallBackComponent == "bridal" ||
            currentCallBackComponent == "bridal-edit") &&
            !address.isBridal && (
              <Button
                variant="largeMedCharcoalCta"
                label={"USE THIS ADDRESS"}
                className={cs(globalStyles.btnFullWidth, styles.shipToThisBtn)}
                disabled={address.id == userAddress?.id}
                onClick={() => {
                  if (address.id != userAddress?.id) {
                    onSelectBridalAddress(address);
                    const firstErrorField = document.getElementById(
                      "address_button"
                    ) as HTMLDivElement;
                    if (firstErrorField) {
                      firstErrorField.focus();
                      firstErrorField.scrollIntoView({
                        block: "center",
                        behavior: "smooth"
                      });
                    }
                    window.scrollTo(0, 0);
                  }
                }}
              >
                USE THIS ADDRESS
              </div>
            )} */}
          {/* {(currentCallBackComponent == "bridal" ||
            currentCallBackComponent == "bridal-edit") &&
            address.isBridal && (
              <div
                className={cs(
                  globalStyles.disabledBtn,
                  styles.shipToThisBtn,
                  styles.addressInUse
                )}
                // onClick={() => props.selectAddress(address)}
              >
                ADDRESS IN USE
              </div>
            )} */}
        </div>
      </div>
      {currentCallBackComponent == "bridal-edit" &&
        props.showAddressInBridalUse &&
        address.isBridal && (
          <div className={globalStyles.errorMsg}>
            All orders placed before {currentDate} will be shipped to the older
            address.
          </div>
        )}
      {/* {props.shippingErrorMsg && address.id == props.addressDataIdError && (
        <div className={globalStyles.errorMsg}>{props.shippingErrorMsg}</div>
      )}
      {props.billingErrorMsg && address.id == props.addressDataIdError && (
        <div className={globalStyles.errorMsg}>{props.billingErrorMsg}</div>
      )} */}
      {deleteError && (
        <div className={globalStyles.errorMsg}>{deleteError}</div>
      )}
    </div>
  );
};

export default AddressItem;
