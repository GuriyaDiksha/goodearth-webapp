import React, { useContext, useState, useEffect } from "react";
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
import addedReg from "../../../images/registery/addedReg.svg";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import moment from "moment";
import { useHistory } from "react-router";
import BridalService from "services/bridal";
import { BridalProfileData } from "containers/myAccount/components/Bridal/typings";
import { isFormModuleOpen, updateBillingAddressId } from "actions/address";
import UserContext from "contexts/user";

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
  const { bridalProfile, setBridalAddressId, bridalAddressId } = useContext(
    BridalContext
  );
  const {
    currency,
    basket,
    address: { shippingAddressId, billingAddressId },
    info: { isSale, deliveryText }
  } = useSelector((state: AppState) => state);
  const history = useHistory();
  const [addressMsg, setAddressMsg] = useState("");
  const currentDate = moment().format("DD/MM/YYYY");
  const {
    // step,
    // changeBridalAddress,
    // setCurrentModuleData,
    data: { userAddress }
  } = useContext(BridalContext);
  const [deleteError, setDeleteError] = useState("");
  const address = props.addressData;
  const bridalProfileData = bridalProfile as BridalProfileData;
  const { isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    if (
      isLoggedIn &&
      props.isGcCheckout &&
      currentCallBackComponent == "checkout-billing"
    ) {
      AddressService.fetchAddressList(dispatch).then(addressList => {
        const defaultBillingAdd = addressList.filter(
          address =>
            address.isDefaultForBilling && currency === address?.currency
        );
        defaultBillingAdd?.map(item => {
          const defaultBillingAddId = item.id;
          dispatch(updateBillingAddressId(defaultBillingAddId));
        });
      });
    }
  }, [isLoggedIn]);

  const fetchBridalItems = () => {
    BridalService.fetchBridalItems(dispatch, bridalProfileData.bridalId).then(
      data => {
        const result = data.results;
        if (result.length != 0) {
          let i;
          for (i = 0; i <= result.length; i++) {
            const qtyBought = result[i].qtyBought;
            if (qtyBought && qtyBought >= 1) {
              setAddressMsg(
                `All orders placed before ${currentDate} will be shipped to the older address.`
              );
            }
          }
        }
      }
    );
  };
  const deleteAddress = (event: any) => {
    event.stopPropagation();
    setIsLoading(true);
    const maindiv = document.getElementById(`address-item-${address.id}`);
    AddressService.deleteAddress(dispatch, address.id)
      .catch(err => {
        const error = err.response.data;

        if (typeof error == "string" && maindiv) {
          maindiv.getElementsByTagName("div")[0].style.border =
            "1px solid #ab1e56";
          setDeleteError(error);
        }
      })
      .finally(() => setIsLoading(false));
    if (deleteError && maindiv) {
      maindiv.getElementsByTagName("div")[0].style.border = "1px solid #ab1e56";
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

  // const handleSelect = (address: AddressData) => {
  //   switch (currentCallBackComponent) {
  //     case "bridal":
  //       if (step == "manage") {
  //         changeBridalAddress(address.id);
  //       } else {
  //         setCurrentModuleData("address", {
  //           userAddress: address
  //         });
  //       }
  //       break;
  //     case "bridal-edit":
  //       changeBridalAddress(address.id);
  //       fetchBridalItems();
  //       break;
  //   }
  // };

  const onSelectBridalAddress = (address: AddressData) => {
    if (address) {
      const isValid = isAddressValid(address);
      if (isValid) {
        // handleSelect(address);
        if (currentCallBackComponent === "bridal-edit") {
          fetchBridalItems();
        }
        setBridalAddressId(address);
      } else {
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
        index: "NA",
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

  const { shippingData } = useSelector((state: AppState) => state.user);
  const i = props.index;
  const id = `default_check_${i}`;
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
              // bootstrapStyles.colMd6,
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
        address.isShippingCountry
          ? !(props.isGcCheckout && currency != address.currency) &&
            (currentCallBackComponent == "checkout-billing" ||
              currentCallBackComponent == "checkout-shipping") &&
            markAsDefault(address)
          : null;
      }}
    >
      <div
        className={cs(
          { [styles.diabledAddress]: !address.isShippingCountry },
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
          },
          {
            [styles.checkout]:
              currentCallBackComponent == "checkout-shipping" ||
              currentCallBackComponent == "checkout-billing"
          },
          {
            [styles.cerise]: props.currentCallBackComponent == "cerise"
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
            // { [styles.shippingBorder]: address.isTulsi },
            {
              [styles.diabledBorder]:
                address.id == userAddress?.id &&
                currentCallBackComponent != "bridal-edit"
            },
            {
              [styles.addressInUse]:
                // props.showAddressInBridalUse && address.isBridal
                address.id.toString() === bridalAddressId?.id?.toString()
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
              currentCallBackComponent === "bridal" ||
              currentCallBackComponent === "bridal-edit"
            ) {
              // if (props.showAddressInBridalUse && address.isBridal) {
              if (address.id != userAddress?.id) {
                onSelectBridalAddress(address);
              }
              // }
            }
          }}
        >
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
                      className={cs(
                        globalStyles.radioCheck,
                        styles.defaultAddressCheckbox
                      )}
                      checked={
                        address.id.toString() ===
                        bridalAddressId?.id?.toString()
                      }
                      name={id}
                      type="radio"
                      onClick={() => {
                        if (
                          !(props.showAddressInBridalUse && address.isBridal)
                        ) {
                          if (address.id != userAddress?.id) {
                            onSelectBridalAddress(address);
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
              {props.title}
              {address.firstName}
              &nbsp;
              {address.lastName}
              {!address.isTulsi && address.isBridal && (
                <div className={styles.defaultContainer}>
                  <div
                    className={cs(styles.defaultAddressDiv, {
                      [styles.bridalAddressItem]: address.isBridal
                    })}
                  >
                    {address.isBridal && (
                      <img
                        className={styles.ceriseBridalRings}
                        src={addedReg}
                        width="30"
                        alt="gift_reg_icon"
                      />
                    )}
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
                        address.isShippingCountry
                          ? markAsDefault(address)
                          : null;
                        // setDefaultAddress(id);
                      }}
                    >
                      <input
                        id={address.id.toString()}
                        className={cs(
                          globalStyles.radioCheck,
                          styles.defaultAddressCheckbox
                        )}
                        checked={
                          address.id.toString() === shippingAddressId.toString()
                        }
                        name={address.id.toString()}
                        type="radio"
                        onChange={() => {
                          address.isShippingCountry
                            ? markAsDefault(address)
                            : null;
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
                {!address.isTulsi && address.isBridal && (
                  <div className={styles.defaultContainer}>
                    <div
                      className={cs(styles.defaultAddressDiv, {
                        [styles.bridalAddressItem]: address.isBridal
                      })}
                    >
                      {address.isBridal && (
                        <img
                          className={styles.ceriseBridalRings}
                          src={addedReg}
                          width="30"
                          alt="gift_reg_icon"
                        />
                      )}
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
                        address.isShippingCountry
                          ? !(
                              props.isGcCheckout && currency != address.currency
                            ) && markAsDefault(address)
                          : null;
                        // setDefaultAddress(id);
                      }}
                    >
                      <input
                        id={address.id.toString()}
                        className={cs(
                          globalStyles.radioCheck,
                          styles.defaultAddressCheckbox
                        )}
                        checked={
                          address.id.toString() === billingAddressId.toString()
                        }
                        name={address.id.toString()}
                        type="radio"
                        onChange={() => {
                          address.isShippingCountry
                            ? !(
                                props.isGcCheckout &&
                                currency != address.currency
                              ) &&
                              !address.isShippingCountry &&
                              markAsDefault(address)
                            : null;
                          // setDefaultAddress(id);
                        }}
                      />
                      <span className={styles.checkmark}></span>
                    </div>
                  )}
                {props.title}
                {address.firstName}
                &nbsp;
                {address.lastName}
                {!address.isTulsi && address.isBridal && (
                  <div className={styles.defaultContainer}>
                    <div
                      className={cs(styles.defaultAddressDiv, {
                        [styles.bridalAddressItem]: address.isBridal
                      })}
                    >
                      {address.isBridal && (
                        <img
                          className={styles.ceriseBridalRings}
                          src={addedReg}
                          width="30"
                          alt="gift_reg_icon"
                        />
                      )}
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
                    address.isShippingCountry
                      ? !(props.isGcCheckout && currency != address.currency) &&
                        !address.isShippingCountry &&
                        markAsDefault(address)
                      : null;
                  }}
                >
                  <input
                    id={
                      currentCallBackComponent !== "checkout-billing" &&
                      currentCallBackComponent !== "checkout-shipping"
                        ? id
                        : address.id.toString()
                    }
                    className={cs(
                      globalStyles.radioCheck,
                      styles.defaultAddressCheckbox
                    )}
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
                      address.isShippingCountry
                        ? !(
                            props.isGcCheckout && currency != address.currency
                          ) && markAsDefault(address)
                        : null;
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
                    className={cs(
                      globalStyles.radioCheck,
                      styles.defaultAddressCheckbox
                    )}
                    checked={
                      // address.id.toString() === bridalAddressId.toString()
                      address.id.toString() === bridalAddressId?.id?.toString()
                    }
                    name={id}
                    type="radio"
                    onClick={() => {
                      if (!(props.showAddressInBridalUse && address.isBridal)) {
                        if (address.id != userAddress?.id) {
                          onSelectBridalAddress(address);
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
              {!address.isTulsi && address.isBridal && (
                <div className={styles.defaultContainer}>
                  <div
                    className={cs(styles.defaultAddressDiv, {
                      [styles.bridalAddressItem]: address.isBridal
                    })}
                  >
                    {address.isBridal && (
                      <img
                        className={styles.ceriseBridalRings}
                        src={addedReg}
                        width="30"
                        alt="gift_reg_icon"
                      />
                    )}
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
              {address.line1}
              {address.line2 && ", "}
              {address.line2},
            </div>

            <div
              className={cs(styles.line, {
                [styles.checkoutFix]:
                  currentCallBackComponent == "bridal" ||
                  currentCallBackComponent == "bridal-edit"
              })}
            >
              {address.city}, {address?.state} - {address.postCode}
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
          <div className={cs(styles.phoneAndEditContainer)}>
            {/* ================== Mobile ==================== */}
            <div className={cs(styles.addressPhoneNumber)}>
              M: {`${address.phoneCountryCode} ${address.phoneNumber}`}
            </div>
            {/* ================== Edit and Delete ======================== */}
            {address.isShippingCountry && (
              <div className={cs(styles.edit)}>
                {!(address.isTulsi || address.isBackendOrder) &&
                  !(props.isGcCheckout && currency != address.currency) && (
                    <span
                      className={cs(styles.action, {
                        [styles.addressEdit]: billingEditDisable
                      })}
                      onClick={event => {
                        event.stopPropagation();
                        if (
                          billingEditDisable ||
                          props.currentCallBackComponent == "cerise"
                        ) {
                          history.push("/account/address");
                          false;
                        } else {
                          openAddressForm(address);
                          dispatch(isFormModuleOpen(true));
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
            )}
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
        </div>
      </div>
      {addressMsg &&
        address.id.toString() === bridalAddressId?.id?.toString() && (
          <div className={globalStyles.errorMsg}>{addressMsg}</div>
        )}
      {deleteError && (
        <div className={globalStyles.errorMsg}>{deleteError}</div>
      )}
      {!address.isShippingCountry && (
        <div className={cs(globalStyles.errorMsg, styles.currencyUnavailable)}>
          Shipping to the UAE is currently unavailable.
        </div>
      )}
    </div>
  );
};

export default AddressItem;
