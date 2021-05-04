import React, { useContext, useEffect, useState } from "react";
import { AddressData } from "../typings";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import AddressService from "services/address";
import * as Steps from "containers/checkout/constants";
import { useDispatch, useSelector } from "react-redux";
import { AddressContext } from "components/Address/AddressMain/context";
import { CheckoutAddressContext } from "containers/checkout/component/context";
import BridalContext from "containers/myAccount/components/Bridal/context";
import { AppState } from "reducers/typings";
import bridalRing from "../../../images/bridal/rings.svg";

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
  // const isDefaultAddress = () => {
  //     return props.addressData.isDefaultForShipping;
  // }
  const {
    step,
    changeBridalAddress,
    setCurrentModule,
    setCurrentModuleData,
    data: { userAddress }
  } = useContext(BridalContext);
  const [deleteError, setDeleteError] = useState("");
  const address = props.addressData;
  // const [selectId, setSelectId ] = useState(data.userAddress?.id || '');
  const deleteAddress = () => {
    setIsLoading(true);
    AddressService.deleteAddress(dispatch, address.id)
      .catch(err => {
        const error = err.response.data;

        if (typeof error == "string") {
          setDeleteError(error);
        }
      })
      .finally(() => setIsLoading(false));
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
          setCurrentModule("created");
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
      } else {
        // this.manageAddressPostcode("edit", address);
        openAddressForm(address);
      }
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
    address.line1.split("").indexOf(" ") > 0 ? 55 : 30;
  const addressLineTwoWithSpace =
    address.line2.split("").indexOf(" ") > 0 ? 25 : 12;
  const divOrText =
    (address.firstName.length < 14 && address.lastName.length < 7) ||
    (address.firstName.length < 7 && address.lastName.length < 14)
      ? "text"
      : "div";
  const billingEditDisable =
    activeStep == "BILLING" && shippingData && address.id == shippingData.id;
  console.log(address.id, userAddress?.id);
  return (
    <div
      className={
        currentCallBackComponent == "checkout-billing" ||
        currentCallBackComponent == "checkout-shipping"
          ? cs(
              bootstrapStyles.col10,
              bootstrapStyles.colSm4,
              bootstrapStyles.colMd4,
              globalStyles.voffset5,
              "address-container"
            )
          : cs(
              bootstrapStyles.col12,
              bootstrapStyles.colMd6,
              globalStyles.voffset5,
              "address-container"
            )
      }
    >
      <div
        className={cs(
          styles.addressItemContainer,
          {
            [styles.addressItemContainerCheckout]:
              currentCallBackComponent == "checkout-shipping" ||
              currentCallBackComponent == "checkout-billing" ||
              currentCallBackComponent == "bridal" ||
              currentCallBackComponent == "bridal-edit"
          },
          {
            [styles.ceriseAddressItemContainer]:
              props.currentCallBackComponent == "cerise"
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
            { [styles.shippingBorder]: address.isTulsi },
            { [styles.diabledBorder]: address.id == userAddress?.id },
            {
              [styles.addressInUse]:
                props.showAddressInBridalUse && address.isBridal
            }
          )}
        >
          {!address.isTulsi && (
            <div className={styles.defaultContainer}>
              <div
                className={cs(styles.defaultAddressDiv, {
                  [styles.bridal]: address.isBridal
                })}
              >
                {address.isBridal && (
                  <svg
                    viewBox="-3 -3 46 46"
                    width="60"
                    height="60"
                    preserveAspectRatio="xMidYMid meet"
                    x="0"
                    y="0"
                    className={styles.ceriseBridalRings}
                  >
                    <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                  </svg>
                )}
                {address.isDefaultForShipping && (
                  <div className={styles.defaultAddress}>Default</div>
                )}
                {!address.isDefaultForShipping && (
                  <div className={styles.line}>Make default</div>
                )}
                {props.currentCallBackComponent != "cerise" && (
                  <div
                    className={styles.radio}
                    id={id}
                    onClick={() => markAsDefault(address)}
                  >
                    <input
                      id={id}
                      className={styles.defaultAddressCheckbox}
                      checked={address.isDefaultForShipping}
                      name={id}
                      type="radio"
                      onChange={() => markAsDefault(address)}
                    />
                    <span className={styles.checkmark}></span>
                  </div>
                )}
              </div>
            </div>
          )}
          {divOrText == "text" && (
            <div className={styles.lineHead}>
              {props.title}
              {address.firstName}
              &nbsp;
              {address.lastName}
            </div>
          )}
          {divOrText == "div" && (
            <div className={styles.lineHead}>
              {props.title}
              <p className={styles.names}>{address.firstName}</p>
              <p className={styles.names}>{address.lastName}</p>
            </div>
          )}
          <div
            className={cs(
              globalStyles.voffset2,
              styles.line,
              styles.addressLine
            )}
          >
            {address.line1.length > addressLineOneWithSpace
              ? address.line1.slice(0, addressLineOneWithSpace).concat("...")
              : address.line1}
          </div>
          <div className={cs(styles.line, styles.addressLine)}>
            {address.line2.length > addressLineTwoWithSpace
              ? address.line2.slice(0, addressLineTwoWithSpace).concat("...")
              : address.line2}
          </div>
          <div className={styles.line}>{address.city}</div>
          <div className={styles.line}>
            {address.state}, {address.postCode}
          </div>
          <div className={styles.line}>{address.countryName}</div>
          <div
            className={styles.addressPhoneNumber}
          >{`${address.phoneCountryCode} ${address.phoneNumber}`}</div>
          <div
            className={cs(globalStyles.marginT20, styles.edit, {
              [styles.addCheckoutActions]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing" ||
                currentCallBackComponent == "bridal" ||
                currentCallBackComponent == "bridal-edit"
            })}
          >
            {!(
              address.isTulsi ||
              address.isBackendOrder ||
              props.currentCallBackComponent == "cerise"
            ) && (
              <span
                className={cs(styles.action, {
                  [styles.addressEdit]: billingEditDisable
                })}
                onClick={
                  billingEditDisable
                    ? () => false
                    : () => openAddressForm(address)
                }
              >
                EDIT
              </span>
            )}
            {!(
              address.isBridal ||
              address.isBackendOrder ||
              props.isOnlyAddress ||
              address.isTulsi ||
              props.currentCallBackComponent == "cerise"
            ) && <span className={styles.separator}>|</span>}
            {!(
              address.isBridal ||
              props.isOnlyAddress ||
              address.isBackendOrder ||
              address.isTulsi ||
              props.currentCallBackComponent == "cerise"
            ) && (
              <span className={styles.action} onClick={deleteAddress}>
                DELETE
              </span>
            )}
          </div>
          {currentCallBackComponent !== "account" &&
            currentCallBackComponent !== "bridal" &&
            currentCallBackComponent !== "bridal-edit" &&
            props.currentCallBackComponent !== "cerise" && (
              <div
                className={cs(globalStyles.ceriseBtn, styles.shipToThisBtn)}
                onClick={() => onSelectAddress(address)}
              >
                {activeStep == Steps.STEP_SHIPPING ? "SHIP" : "BILL"}
                &nbsp;TO THIS ADDRESS {address.isTulsi ? "(FREE)" : ""}
              </div>
            )}
          {(currentCallBackComponent == "bridal" ||
            currentCallBackComponent == "bridal-edit") &&
            !address.isBridal && (
              <div
                className={cs(
                  globalStyles.ceriseBtn,
                  globalStyles.cursorPointer,
                  { [globalStyles.disabledBtn]: address.id == userAddress?.id },
                  styles.shipToThisBtn
                )}
                // onClick={() => props.selectAddress(address)}
                onClick={() => {
                  if (address.id != userAddress?.id)
                    onSelectBridalAddress(address);
                }}
              >
                USE THIS ADDRESS
              </div>
            )}
          {(currentCallBackComponent == "bridal" ||
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
            )}
        </div>
      </div>
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
