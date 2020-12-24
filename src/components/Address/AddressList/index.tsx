import React, { useState, useContext, useEffect } from "react";
import cs from "classnames";
import AddressItem from "../AddressItem";
import Loader from "components/Loader";
import { AddressData } from "../typings";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import { AddressContext } from "../AddressMain/context";
import AddressItemBridal from "../AddressItemBridal";

type Props = {
  addressDataList: AddressData[];
  currentCallBackComponent: string;
  isBridal?: boolean;
  bridalId?: number;
  showAddressInBridalUse?: boolean;
};

const AddressList: React.FC<Props> = props => {
  const { activeStep } = useContext(AddressContext);
  const [addressData, setAddressData] = useState(props.addressDataList);
  const { addressDataList, isBridal } = props;
  useEffect(() => {
    let addressData = addressDataList;
    if (
      (activeStep == "BILLING" &&
        props.currentCallBackComponent == "checkout-billing") ||
      props.currentCallBackComponent == "account" ||
      props.currentCallBackComponent == "bridal" ||
      props.currentCallBackComponent == "bridal-edit"
    ) {
      if (addressData) {
        addressData = addressData.filter(address => !address.isTulsi);
        // if (isBridal) {
        //   addressData = addressData.filter(address => !address.isBridal);
        //   // && window.user.email == address.Email_Id);
        // }
      }
    }
    if (
      activeStep == "SHIPPING" &&
      props.currentCallBackComponent == "checkout-shipping"
    ) {
      if (isBridal) {
        addressData = addressData.filter(address => address.isBridal);
      }
    }
    // if (props.addressDataList && props.addressDataList.length > 0) {
    //   addressData = addressData.filter(data => data.id !== props.bridalId);
    // }
    setAddressData(addressData);
  }, [addressDataList]);

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

  // const markAsDefault = (addressData: AddressData) => {
  // const isValid = isAddressValid(addressData);
  // if(isValid) {

  //   const { id } = addressData;
  //   AddressService.updateAddress(dispatch, formData, id)
  //   .then(() => {
  //     setIsAddressChanged(false);
  //   })
  //   .catch(err => {
  //     const errData = err.response.data;
  //     const form = AddressFormRef.current;
  //     if (typeof errData == "string") {
  //       setErrorMessage(errData);
  //     } else if (typeof errData == "object") {
  //       form && form.updateInputsWithError(errData, true);
  //       handleInvalidSubmit();
  //     }
  //   });
  // }
  // else {
  //   openAddressForm(address);
  // }

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
  // };

  return (
    <div>
      <div
        className={cs(bootstrapStyles.row, styles.addressListContainer)}
        id="addressData"
      >
        {isBridal && activeStep == "SHIPPING" ? (
          <AddressItemBridal
            addressData={addressData[addressData.length - 1]}
            addressType="SHIPPING"
          />
        ) : (
          addressData &&
          addressData.length > 0 &&
          Object.entries(addressData).length !== 0 &&
          addressData.map((data, i) => {
            return (
              <AddressItem
                key={data.id}
                addressData={data}
                index={i}
                isOnlyAddress={addressData.length === 1}
                showAddressInBridalUse={props.showAddressInBridalUse}
              />
            );
          })
        )}
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default AddressList;
