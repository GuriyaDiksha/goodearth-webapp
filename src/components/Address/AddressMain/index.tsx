import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
// import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
// import styles from "../styles.scss";
// import cs from "classnames";
import { AddressData, AddressFormData } from "../typings";
import AddressList from "components/Address/AddressList";
import AddressForm from "../AddressForm";
import MyAddress from "containers/myAccount/components/MyAddress";
import { AddressContext } from "./context";
import { Props, AddressModes } from "../typings";
import AddressService from "services/address";
import LoginService from "services/login";
import { updatePinCodeList, updateCountryData } from "actions/address";
import Loader from "components/Loader";
import AddressSection from "containers/checkout/component/address";
import * as Steps from "../../../containers/checkout/constants";
import ManageAddress from "containers/myAccount/components/Bridal/ManageAddress";
// import AddressDataList from "../../../../components/Address/AddressDataList.json";

// import AddressMainComponent from '../../components/common/address/addressMain';

const AddressMain: React.FC<Props> = props => {
  // data: [],
  // showAddresses: true,
  // newAddressMode: false,
  // editMode: false
  const [showDefaultAddressOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addressList } = useSelector((state: AppState) => state.address);
  const [editAddressData, setEditAddressData] = useState<AddressData>();
  const { pinCodeData } = useSelector((state: AppState) => state.address);
  // const [ pincodeList, setPincodeList ] = useState([]);
  const dispatch = useDispatch();

  const fetchCountryData = async () => {
    const countryData = await LoginService.fetchCountryData(dispatch);
    dispatch(updateCountryData(countryData));
  };

  useEffect(() => {
    AddressService.fetchPinCodeData(dispatch).then(data => {
      const pinCodeList = Object.keys(data.data);
      dispatch(updatePinCodeList(data.data, pinCodeList));
    });
    fetchCountryData();
  }, []);
  const [mode, setMode] = useState<AddressModes>("list");

  // useEffect(() => {
  //   (addressList.length) && openAddressForm()
  // },[props.addresses])
  // const [ editAddresaData, setEditAddressData ] = useState(null);

  // manageAddress(data, index) {
  //     props.changeMode(data, this.state.data[index]);
  // }

  // onClickBack() {
  //     props.setCurrentModule('details');
  // }

  // isDefaultAddress(address) {
  //     return address.is_default_for_shipping;
  // }

  // setAddressAvailable(data) {
  //     this.setState({
  //         addressesAvailable: data
  //     })
  // }

  // setMode(value) {
  //     this.setState({
  //         editMode: value
  //     })
  // }

  // setAddressModeProfile(modes) {
  //     this.setState(modes)
  // }

  // setBridalStep() {
  //     props.setCurrentModule('address');
  //     this.setAddressModeProfile({showAddresses: true, editMode: false, newAddressMode: false, addressesAvailable: false});
  // }

  const getStateFromPinCode = useCallback(
    (pinCode: string): string | undefined => pinCodeData[pinCode],
    [pinCodeData]
  );

  const openAddressForm = useCallback((address?: AddressData) => {
    // if (addressMode == "new") {
    //     this.showEditForm({showAddresses: false, addressData: "", editMode: false, newAddressMode: true});
    //     this.props.setAddressModeProfile({showAddresses: false, addressData: "", editMode: false, newAddressMode: true});
    // }
    if (address) {
      setEditAddressData(address);
      setMode("edit");
    } else {
      setMode("new");
      // setEditAddressData(null);
    }
  }, []);

  const isAddressValid = useCallback(
    (postCode: string, state: string): boolean => {
      let isValid = false;
      const validState = getStateFromPinCode(postCode);
      if (validState && state.toLowerCase() == validState.toLowerCase()) {
        isValid = true;
      }
      return isValid;
    },
    [pinCodeData]
  );

  const markAsDefault = (addressData: AddressData) => {
    const { country, state, postCode } = addressData;
    const isValid = country == "IN" ? isAddressValid(postCode, state) : true;
    if (isValid) {
      setIsLoading(true);
      // extract formData from address
      const {
        id,
        emailId,
        firstName,
        lastName,
        city,
        postCode,
        phoneCountryCode,
        phoneNumber,
        isDefaultForBilling,
        line1,
        line2,
        state
      } = addressData;

      const formData: AddressFormData = {
        emailId,
        firstName,
        lastName,
        city,
        postCode,
        country,
        phoneCountryCode,
        phoneNumber,
        isDefaultForShipping: true,
        isDefaultForBilling,
        line1,
        line2,
        state
      };

      AddressService.updateAddress(dispatch, formData, id)
        .catch(err => {
          const errData = err.response.data;
          console.log(errData);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      openAddressForm(addressData);
    }
  };

  const closeAddressForm = useCallback(() => {
    setMode("list");
    window.scrollTo(0, 0);
  }, []);

  const checkPinCode = useCallback(
    (pinCode: string) => {
      return typeof getStateFromPinCode(pinCode) == "string" ? true : false;
    },
    [pinCodeData]
  );
  const { currentCallBackComponent } = props;
  const addressContent = (
    <>
      {mode == "list" && (
        <div>
          <AddressList
            addressDataList={addressList}
            openAddressForm={address => null}
            deleteAddress={id => null}
            selectAddress={address => null}
            isValidAddress={() => null}
            currentCallBackComponent={currentCallBackComponent}
          />

          {!showDefaultAddressOnly && currentCallBackComponent == "account" && (
            <div className={globalStyles.voffset4}>
              <ul>
                <li>
                  <input
                    type="button"
                    className={globalStyles.ceriseBtn}
                    value="add a new address"
                    onClick={() => openAddressForm()}
                  />
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
      {mode == "new" && (
        <AddressForm
          // addressData={null}
          currentCallBackComponent={currentCallBackComponent}
          saveAddress={() => null}
          openAddressList={() => null}
        ></AddressForm>
      )}
      {mode == "edit" && (
        <AddressForm
          addressData={editAddressData}
          currentCallBackComponent={currentCallBackComponent}
          saveAddress={() => null}
          openAddressList={() => null}
        ></AddressForm>
      )}
      {isLoading && <Loader />}
    </>
  );

  switch (currentCallBackComponent) {
    case "account":
      return (
        <AddressContext.Provider
          value={{
            setMode: setMode,
            mode: mode,
            activeStep: props.activeStep || "",
            // editAddressData: editAddressData,
            setEditAddressData: setEditAddressData,
            currentCallBackComponent: currentCallBackComponent,
            checkPinCode: checkPinCode,
            isAddressValid: isAddressValid,
            openAddressForm: openAddressForm,
            closeAddressForm: closeAddressForm,
            markAsDefault: markAsDefault,
            setIsLoading: setIsLoading
          }}
        >
          <MyAddress mode={mode}>{addressContent}</MyAddress>
        </AddressContext.Provider>
      );
    case "checkout-shipping":
      return (
        <AddressContext.Provider
          value={{
            setMode: setMode,
            mode: mode,
            activeStep: props.activeStep || "",
            // editAddressData: editAddressData,
            setEditAddressData: setEditAddressData,
            currentCallBackComponent: currentCallBackComponent,
            checkPinCode: checkPinCode,
            isAddressValid: isAddressValid,
            openAddressForm: openAddressForm,
            closeAddressForm: closeAddressForm,
            markAsDefault: markAsDefault,
            setIsLoading: setIsLoading
          }}
        >
          <AddressSection
            activeStep={Steps.STEP_SHIPPING}
            mode={mode}
            isActive={props.isActive}
            selectedAddress={props.selectedAddress}
            next={
              props.next ||
              function() {
                return null;
              }
            }
            openAddressForm={openAddressForm}
            finalizeAddress={
              props.finalizeAddress ||
              function() {
                return null;
              }
            }
            hidesameShipping={true}
            // items={this.props.basket}
            // bridalId={this.props.bridalId}
            bridalId=""
            isGoodearthShipping={props.isGoodearthShipping || false}
            // addressType={Steps.STEP_SHIPPING}
            addresses={addressList}
            // user={this.props.user}
            error={props.error}
          >
            {addressContent}
          </AddressSection>
        </AddressContext.Provider>
      );
    case "checkout-billing":
      return (
        <AddressContext.Provider
          value={{
            setMode: setMode,
            mode: mode,
            activeStep: props.activeStep || "",
            // editAddressData: editAddressData,
            setEditAddressData: setEditAddressData,
            currentCallBackComponent: currentCallBackComponent,
            checkPinCode: checkPinCode,
            isAddressValid: isAddressValid,
            openAddressForm: openAddressForm,
            closeAddressForm: closeAddressForm,
            markAsDefault: markAsDefault,
            setIsLoading: setIsLoading
          }}
        >
          <AddressSection
            activeStep={Steps.STEP_BILLING}
            mode={mode}
            isActive={props.isActive}
            selectedAddress={props.selectedAddress}
            next={
              props.next ||
              function() {
                return null;
              }
            }
            openAddressForm={openAddressForm}
            finalizeAddress={
              props.finalizeAddress ||
              function() {
                return null;
              }
            }
            hidesameShipping={true}
            // items={this.props.basket}
            // bridalId={this.props.bridalId}
            bridalId=""
            isGoodearthShipping={props.isGoodearthShipping || false}
            // addressType={Steps.STEP_SHIPPING}
            addresses={addressList}
            // user={this.props.user}
            error={props.error}
          >
            {addressContent}
          </AddressSection>
        </AddressContext.Provider>
      );
    case "bridal":
      return (
        <AddressContext.Provider
          value={{
            setMode: setMode,
            mode: mode,
            activeStep: props.activeStep || "",
            // editAddressData: editAddressData,
            setEditAddressData: setEditAddressData,
            currentCallBackComponent: currentCallBackComponent,
            checkPinCode: checkPinCode,
            isAddressValid: isAddressValid,
            openAddressForm: openAddressForm,
            closeAddressForm: closeAddressForm,
            markAsDefault: markAsDefault,
            setIsLoading: setIsLoading
          }}
        >
          <ManageAddress
          // activeStep={Steps.STEP_BILLING}
          // mode={mode}
          // isActive={props.isActive}
          // selectedAddress={props.selectedAddress}
          // next={props.next || function () { return null}}
          // openAddressForm={openAddressForm}
          // finalizeAddress={props.finalizeAddress || function () { return null}}
          // hidesameShipping={true}
          // items={this.props.basket}
          // bridalId={this.props.bridalId}
          // bridalId=""
          // isGoodearthShipping={props.isGoodearthShipping || false}
          // addressType={Steps.STEP_SHIPPING}
          // addresses={addressList}
          // user={this.props.user}
          // error={props.error}
          >
            {addressContent}
          </ManageAddress>
        </AddressContext.Provider>
      );
    default:
      return (
        <AddressContext.Provider
          value={{
            setMode: setMode,
            mode: mode,
            activeStep: props.activeStep || "",
            // editAddressData: editAddressData,
            setEditAddressData: setEditAddressData,
            currentCallBackComponent: currentCallBackComponent,
            checkPinCode: checkPinCode,
            isAddressValid: isAddressValid,
            openAddressForm: openAddressForm,
            closeAddressForm: closeAddressForm,
            markAsDefault: markAsDefault,
            setIsLoading: setIsLoading
          }}
        >
          <MyAddress mode={mode}>{addressContent}</MyAddress>
        </AddressContext.Provider>
      );
  }
};
export default AddressMain;
