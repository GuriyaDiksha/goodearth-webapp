import React, { useState } from "react";
import cs from "classnames";
// import axios from 'axios';
// import Config from "components/config";
import AddressItem from "../AddressItem";
import Loader from "components/Loader";
import { AddressData } from "../typings";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
// import globalStyles from "styles/global.scss";
import styles from "../styles.scss";

// import * as CustomerAddressApi from "api/CustomerAddressApi";

type Props = {
  addressDataList: AddressData[];
  openAddressForm: (address: AddressData) => void;
  deleteAddress: (id: number) => void;
  selectAddress: (address: AddressData) => void;
  isValidAddress: () => void;
  currentCallBackComponent: string;
  addressType?: string;
  isBridal?: boolean;
  bridalId?: number;
  showAddressInBridalUse?: boolean;
};

const AddressList: React.FC<Props> = props => {
  let addressData =
    Object.keys(props.addressDataList).length === 0 &&
    props.addressDataList.constructor === Object
      ? props.addressDataList
      : Array.isArray(props.addressDataList)
      ? props.addressDataList
      : [props.addressDataList];
  if (
    props.addressType == "BILLING" &&
    props.currentCallBackComponent == "checkout"
  ) {
    addressData = addressData.filter(address => !address.isEdit);
    if (props.isBridal) {
      addressData = addressData.filter(address => !address.isBridal);
      // && window.user.email == address.Email_Id);
    }
  }
  if (props.addressDataList && props.addressDataList.length > 0) {
    addressData = addressData.filter(data => data.id !== props.bridalId);
  }

  // const [ addressDataList: addressData || [],
  const [isLoading] = useState(false);

  // componentWillReceiveProps(props) {
  //     let addressData = props.addressDataList;
  //     if (props.addressDataList &&  props.addressDataList.length && props.addressType == "BILLING") {
  //         addressData = addressData.filter(data => !data.is_edit)
  //         if (props.isbridal) {
  //             addressData = addressData.filter(address => !address.isBridal && window.user.email == address.Email_Id);
  //         }
  //     }
  //     if (props.addressDataList &&  props.addressDataList.length > 0) {
  //         addressData = addressData.filter(data => data.id !== props.bridal_id)
  //     }

  //     this.setState({
  //         addressData: addressData
  //     });
  //     this.setLoadingStatus(false);
  // }

  // const scrollIntoViewAddress = (id: number) => {
  //     document.getElementById(id).focus();
  // }

  // setUpdatedDefaultAddress(data) {
  //     let addresses = data.data.Address;
  //     if (props.currentCallBackComponent !== "checkout") {
  //        addresses = addresses.filter(address => !address.is_edit);
  //     }
  //     if (props.currentCallBackComponent === "checkout" && props.addressType === "BILLING") {
  //         addresses = addresses.filter(address => !address.is_edit)
  //     }
  //     props.setAddressData(addresses);
  //     this.setState({
  //         addressData: addresses
  //     })
  // }

  const markAsDefault = (data: AddressData) => {
    //     const isAddressValid = props.checkAddressPostcode(data);
    //     if(isAddressValid) {
    //         const formData = new FormData();
    //         this.setLoadingStatus(true);
    //         Object.keys(data).forEach(key => {
    //             if (key === "is_default_for_shipping") {
    //                 formData.append(key, true);
    //             } else {
    //                 formData.append(key, data[key]);
    //             }
    //         });
    //         formData.append('action_type', 'update');
    //         if (props.currentCallBackComponent !== "checkout") {
    //             axios.post(Config.hostname + 'myapi/saveaddressdetails/', formData)
    //             .then((res) => {
    //                 this.setUpdatedDefaultAddress(res);
    //                 this.setLoadingStatus(false);
    //             })
    //             .catch((err) => this.setLoadingStatus(false))
    //         } else {
    //             CustomerAddressApi.touchAddress(formData, props.dispatch);
    //         }
    //     }
    //     else {
    //         props.manageAddressPostcode("edit", data);
    //     }
  };

  return (
    <div>
      <div
        className={cs(bootstrapStyles.row, styles.addressListContainer)}
        id="addressData"
      >
        {props.addressDataList &&
          props.addressDataList.length > 0 &&
          Object.entries(props.addressDataList).length !== 0 &&
          props.addressDataList.map((data, i) => {
            return (
              <AddressItem
                key={data.id}
                addressData={data}
                index={i}
                openAddressForm={props.openAddressForm}
                // getAddressDetails={props.getAddressDetails}
                // setAddressAvailable={props.setAddressAvailable}
                // setUpdatedDefaultAddress={this.setUpdatedDefaultAddress}
                // setMode={props.setMode}
                // isbridal={props.isbridal}
                isOnlyAddress={props.addressDataList.length === 1}
                // setCurrentModule={props.setCurrentModule}
                // setCurrentModuleData={props.setCurrentModuleData}
                addressType={props.addressType}
                // setAddressModeProfile={props.setAddressModeProfile}
                currentCallBackComponent={props.currentCallBackComponent}
                // items={props.items}
                // setLoadingStatus={setIsLoading}
                selectAddress={props.selectAddress}
                // toggleAddressForm={props.toggleAddressForm}
                deleteAddress={props.deleteAddress}
                // dispatch={props.dispatch}
                // shippingErrorMsg={props.shippingErrorMsg}
                // billingErrorMsg={props.billingErrorMsg}
                // addressIdError={props.addressIdError}
                // removeErrorMessages={props.removeErrorMessages}
                // changeBridalAddress={props.changeBridalAddress}
                // case={props.case}
                isValidAddress={props.isValidAddress}
                showAddressInBridalUse={props.showAddressInBridalUse}
                markAsDefault={markAsDefault}
              />
            );
          })}
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default AddressList;
