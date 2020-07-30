import React, { useContext } from "react";
import { AddressData } from "../typings";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import AddressService from "services/address";
// import * as valid from 'components/common/validation/validate'
// import axios from 'axios';
// import Config from "components/config";
import * as Steps from "containers/checkout/constants";
import { useDispatch, useSelector } from "react-redux";
import { AddressContext } from "components/Address/AddressMain/context";
import { CheckoutAddressContext } from "containers/checkout/component/context";
import BridalContext from "containers/myAccount/components/Bridal/context";
import { AppState } from "reducers/typings";
// import * as CustomerAddressApi from "api/CustomerAddressApi";

type Props = {
  addressData: AddressData;
  title?: string;
  selectAddress: (address: AddressData) => void;
  index: number;
  isOnlyAddress: boolean;
  // addressType?: string;
  showAddressInBridalUse?: boolean;
  shippingErrorMsg?: string;
  billingErrorMsg?: string;
  addressDataIdError?: number;
};

const AddressItem: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const {
    openAddressForm,
    markAsDefault,
    setIsLoading,
    currentCallBackComponent,
    activeStep
  } = useContext(AddressContext);
  const { onSelectAddress } = useContext(CheckoutAddressContext);
  // const isDefaultAddress = () => {
  //     return props.addressData.isDefaultForShipping;
  // }
  const { step, changeBridalAddress, setCurrentModuleData } = useContext(
    BridalContext
  );
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
          // props.setCurrentModule('created');
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

  const address = props.addressData;
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
        className={cs(styles.addressItemContainer, {
          [styles.addressItemContainerCheckout]:
            currentCallBackComponent == "checkout-shipping" ||
            currentCallBackComponent == "checkout-billing" ||
            currentCallBackComponent == "bridal"
        })}
      >
        <div
          className={cs(
            styles.addressItem,
            {
              [styles.addressItemCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing" ||
                currentCallBackComponent == "bridal"
            },
            { [styles.shippingBorder]: address.isEdit },
            {
              [styles.addressInUse]:
                props.showAddressInBridalUse && address.isBridal
            }
          )}
        >
          {!address.isEdit && (
            <div className={styles.defaultContainer}>
              <div className={styles.defaultAddressDiv}>
                {address.isDefaultForShipping && (
                  <div className={styles.defaultAddress}>Default</div>
                )}
                {!address.isDefaultForShipping && (
                  <div className={styles.line}>Make default</div>
                )}
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
                currentCallBackComponent == "bridal"
            })}
          >
            {!address.isEdit && (
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
            {!(address.isBridal || props.isOnlyAddress || address.isEdit) && (
              <span className={styles.separator}>|</span>
            )}
            {!(address.isBridal || props.isOnlyAddress || address.isEdit) && (
              <span
                className={styles.action}
                onClick={() => {
                  setIsLoading(true);
                  AddressService.deleteAddress(
                    dispatch,
                    address.id
                  ).finally(() => setIsLoading(false));
                }}
              >
                DELETE
              </span>
            )}
          </div>
          {currentCallBackComponent !== "account" &&
            currentCallBackComponent !== "bridal" && (
              <div
                className={cs(
                  globalStyles.ceriseBtn,
                  globalStyles.cursorPointer,
                  styles.shipToThisBtn
                )}
                onClick={() => onSelectAddress(address)}
              >
                {activeStep == Steps.STEP_SHIPPING ? "SHIP" : "BILL"}
                &nbsp;TO THIS ADDRESS {address.isEdit ? "(FREE)" : ""}
              </div>
            )}
          {currentCallBackComponent == "bridal" && !address.isBridal && (
            <div
              className={cs(
                globalStyles.ceriseBtn,
                globalStyles.cursorPointer,
                styles.shipToThisBtn
              )}
              onClick={() => handleSelect(address)}
            >
              USE THIS ADDRESS
            </div>
          )}
          {currentCallBackComponent == "bridal" && address.isBridal && (
            <div
              className={cs(
                globalStyles.cursorPointer,
                globalStyles.disabledBtn,
                styles.shipToThisBtn,
                styles.addressInUse
              )}
              onClick={() => props.selectAddress(address)}
            >
              ADDRESS IN USE
            </div>
          )}
        </div>
      </div>
      {props.shippingErrorMsg && address.id == props.addressDataIdError && (
        <div className={globalStyles.errorMsg}>{props.shippingErrorMsg}</div>
      )}
      {props.billingErrorMsg && address.id == props.addressDataIdError && (
        <div className={globalStyles.errorMsg}>{props.billingErrorMsg}</div>
      )}
    </div>
  );
};

export default AddressItem;
