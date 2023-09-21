import React, { useState, useCallback, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
// import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
// import styles from "../styles.scss";
import cs from "classnames";
import { AddressData, AddressFormData } from "../typings";
import AddressList from "components/Address/AddressList";
import AddressForm from "../AddressForm";
import MyAddress from "containers/myAccount/components/MyAddress";
import { AddressContext } from "./context";
import { Props, AddressModes } from "../typings";
import AddressService from "services/address";
// import { updatePinCodeList } from "actions/address";
import Loader from "components/Loader";
import AddressSection from "containers/checkout/component/address";
import {
  STEP_BILLING,
  STEP_SHIPPING
} from "../../../containers/checkout/constants";
import RegistryAddress from "containers/myAccount/components/Bridal/RegistryAddress";
import EditRegistryAddress from "../../../containers/myAccount/components/Bridal/EditRegistryAddress";
import BridalContext from "containers/myAccount/components/Bridal/context";
import myAccountStyles from "containers/myAccount/styles.scss";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import styles from "../styles.scss";
import WhatsappSubscribe from "components/WhatsappSubscribe";
import Formsy from "formsy-react";
import { updateAddressMode, updateSameAsShipping } from "actions/address";
import { CONFIG } from "constants/util";
import {
  updateBillingAddressId,
  updateShippingAddressId
} from "actions/address";
import { countryCurrencyCode } from "constants/currency";

const AddressMain: React.FC<Props> = props => {
  // data: [],
  // showAddresses: true,
  // newAddressMode: false,
  // editMode: false
  const [showDefaultAddressOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addressList, sameAsShipping } = useSelector(
    (state: AppState) => state.address
  );
  const [editAddressData, setEditAddressData] = useState<AddressData>();
  const { pinCodeData, countryData, mode } = useSelector(
    (state: AppState) => state.address
  );
  const { bridal } = useSelector((state: AppState) => state.basket);
  const { user } = useSelector((state: AppState) => state);
  const [scrollPos, setScrollPos] = useState<null | number>(null);
  const [innerScrollPos, setInnerScrollPos] = useState<null | number>(null);
  // const { isLoggedIn } = useSelector((state: AppState) => state.user);
  // const [ pincodeList, setPincodeList ] = useState([]);
  const [isdList, setIsdList] = useState<any>([]);
  const { currentCallBackComponent } = props;

  const {
    data: { userAddress, occasion }
  } = useContext(BridalContext);

  const dispatch = useDispatch();

  const setMode = (value: AddressModes) => {
    dispatch(updateAddressMode(value));
  };
  useEffect(() => {
    if (props.currentCallBackComponent == "bridal") {
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "registry",
          "Event Category": "Registry",
          "Event Action": "Shipping address page",
          "Event Label": occasion
        });
      }
    }
  }, []);
  // const [mode, setMode] = useState<AddressModes>("list");

  useEffect(() => {
    if (Object.keys(pinCodeData).length > 0) {
      // addressList.length == 0
      //   ? dispatch(updateAddressMode("new"))
      dispatch(updateAddressMode("list"));
    }
  }, [addressList.length, Object.keys(pinCodeData).length]);

  // useEffect(()=>{
  //   if(currentCallBackComponent === "checkout-shipping"){
  //     dispatch(updateShippingAddressId(props.selectedAddress?.id || 0));
  //   }
  //   if(currentCallBackComponent === "checkout-billing"){
  //     dispatch(updateBillingAddressId(props.selectedAddress?.id || 0));
  //   }
  // },[props.selectedAddress])

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
  useEffect(() => {
    if (mode == "list" && scrollPos != null) {
      if (editAddressData) {
        // focus on address-item-id
        const elem = document.getElementById(
          `address-item-${editAddressData.id}`
        );
        if (elem) {
          elem.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        window.scrollTo({
          top: scrollPos,
          behavior: "smooth"
        });
        if (innerScrollPos != null) {
          const elem = document.getElementsByClassName(
            myAccountStyles.accountFormBgMobile
          )?.[0];
          if (elem) {
            elem.scrollTop = innerScrollPos;
          }
        }
        setInnerScrollPos(null);
        setScrollPos(null);
      }
    }
  }, [mode]);
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
      dataLayer.push({
        event: "edit_address",
        click_type:
          currentCallBackComponent === "checkout-shipping"
            ? "Shipping"
            : "Billing"
      });
      dispatch(updateAddressMode("edit"));
      setScrollPos(window.scrollY);
      const elem = document.getElementsByClassName(
        myAccountStyles.accountFormBgMobile
      )?.[0];
      if (elem) {
        setInnerScrollPos(elem.scrollTop);
      }
    } else {
      dispatch(updateAddressMode("new"));
      // setEditAddressData(null);
    }
  }, []);

  const isAddressPincodeValid = useCallback(
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

  const isAddressValid = (address: AddressData): boolean => {
    const {
      postCode,
      state,
      country,
      firstName,
      lastName,
      line1,
      city,
      phoneNumber
    } = address;
    let isValid = true;
    if (country == "IN") {
      const isPincodeValid = isAddressPincodeValid(postCode, state);
      if (!isPincodeValid) {
        isValid = false;
      }
    }
    // validation for empty fields
    if (
      !firstName ||
      !lastName ||
      !line1 ||
      !city ||
      !phoneNumber ||
      !country
    ) {
      isValid = false;
    }
    return isValid;
  };

  const markAsDefault = (addressData: AddressData) => {
    const { country } = addressData;
    const isValid = isAddressValid(addressData);
    if (isValid) {
      setIsLoading(true);
      // extract formData from address
      // const {
      //   id,
      //   emailId,
      //   firstName,
      //   lastName,
      //   city,
      //   postCode,
      //   phoneCountryCode,
      //   phoneNumber,
      //   isDefaultForBilling,
      //   line1,
      //   line2,
      //   state,
      //   addressType
      // } = addressData;

      // const formData: AddressFormData = {
      //   emailId,
      //   firstName,
      //   lastName,
      //   city,
      //   postCode,
      //   country,
      //   phoneCountryCode,
      //   phoneNumber,
      //   isDefaultForShipping: true,
      //   isDefaultForBilling,
      //   line1,
      //   line2,
      //   state,
      //   addressType
      // };

      if (currentCallBackComponent === "checkout-shipping") {
        dispatch(updateShippingAddressId(addressData?.id));
        AddressService.fetchCustomDuties(
          dispatch,
          countryCurrencyCode?.[country || "IN"]
        );
        if (!props.isGoodearthShipping && !bridal && sameAsShipping) {
          dispatch(updateBillingAddressId(addressData?.id));
        }
        dispatch(
          updateSameAsShipping(
            !props.isGoodearthShipping && !bridal && sameAsShipping
          )
        );
        setIsLoading(false);
      } else if (currentCallBackComponent === "checkout-billing") {
        dispatch(updateBillingAddressId(addressData?.id));
        setIsLoading(false);
      }
      // else {
      // AddressService.updateAddress(dispatch, formData, id, addressId)
      //   .catch(err => {
      //     const errData = err.response.data;
      //     console.log(errData);
      //   })
      //   .finally(() => {
      //     setIsLoading(false);
      //   });
      // }
    } else {
      openAddressForm(addressData);
    }
  };

  const closeAddressForm = useCallback((addressId?: any) => {
    dispatch(updateAddressMode("list"));
    setTimeout(() => {
      if (addressId) {
        document
          .getElementById(`address-item-${addressId}`)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "start"
          });
      } else {
        document
          .getElementById(`addressData`)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "start"
          });
      }
    }, 300);
  }, []);

  const checkPinCode = useCallback(
    (pinCode: string) => {
      return typeof getStateFromPinCode(pinCode) == "string" ? true : false;
    },
    [pinCodeData]
  );

  useEffect(() => {
    const isdList = countryData.map(list => {
      return list.isdCode;
    });
    setIsdList(isdList);
  }, [countryData]);
  const addressContent = (
    <>
      {mode == "list" && (
        <div>
          {/* {currentCallBackComponent !== "checkout-shipping" &&
            currentCallBackComponent !== "checkout-billing" &&
            currentCallBackComponent !== "bridal-edit" &&
            currentCallBackComponent !== "bridal" && (
              <div
                className={cs(styles.addNewAddress)}
                onClick={() => {
                  if (
                    currentCallBackComponent == "bridal" &&
                    props.createRegistry
                  ) {
                    props.createRegistry();
                  } else {
                    openAddressForm();
                  }
                }}
              >
                + ADD NEW ADDRESS
              </div>
            )} */}
          <AddressList
            addressDataList={addressList}
            isBridal={bridal}
            currentCallBackComponent={currentCallBackComponent}
            showAddressInBridalUse={["bridal", "bridal-edit"].includes(
              currentCallBackComponent
            )}
          />

          {currentCallBackComponent == "bridal" &&
            CONFIG.WHATSAPP_SUBSCRIBE_ENABLED && (
              <div className={styles.loginForm}>
                <Formsy>
                  <div className={styles.categorylabel}>
                    <div className={styles.subscribe}>
                      <WhatsappSubscribe
                        data={user.preferenceData}
                        innerRef={props.innerRef}
                        isdList={isdList}
                        showTermsMessage={false}
                        showTooltip={true}
                        showManageMsg={true}
                        showPhone={true}
                        whatsappClass={styles.whatsapp}
                        countryCodeClass={styles.countryCode}
                        checkboxLabelClass={styles.checkboxLabel}
                        allowUpdate={true}
                        uniqueKey={"addressid123"}
                        whatsappFormRef={props.whatsappFormRef}
                        whatsappNoErr={props.whatsappNoError}
                      />
                    </div>
                    {/* <div className={styles.whatsappNoErr}>
                      {props.whatsappNoError}
                    </div> */}
                  </div>
                </Formsy>
              </div>
            )}

          {!showDefaultAddressOnly &&
            (currentCallBackComponent == "account" ||
              currentCallBackComponent == "bridal") && (
              <div className={globalStyles.voffset4}>
                <ul>
                  <li>
                    <input
                      type="button"
                      id="address_button"
                      className={cs(styles.charcoalBtn, {
                        [globalStyles.disabledBtn]:
                          currentCallBackComponent == "bridal" &&
                          !userAddress?.id
                      })}
                      value={
                        currentCallBackComponent == "bridal"
                          ? "create registry"
                          : "add a new address"
                      }
                      onClick={() => {
                        if (
                          currentCallBackComponent == "bridal" &&
                          props.createRegistry
                        ) {
                          props.createRegistry();
                        } else {
                          openAddressForm();
                        }
                      }}
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
          <MyAddress
            setCurrentSection={() => props.setCurrentSection?.()}
            mode={mode}
          >
            {addressContent}
          </MyAddress>
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
            activeStep={STEP_SHIPPING}
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
            errorNotification={props.errorNotification}
            isBridal={bridal}
            currentStep={props.currentStep}
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
            activeStep={STEP_BILLING}
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
            errorNotification={props.errorNotification}
            isBridal={bridal}
            currentStep={props.currentStep}
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
          <RegistryAddress
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
          </RegistryAddress>
        </AddressContext.Provider>
      );
    case "bridal-edit":
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
          <EditRegistryAddress
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
          </EditRegistryAddress>
        </AddressContext.Provider>
      );
    default:
      return (
        <AddressContext.Provider
          value={{
            setMode: setMode,
            mode: mode,
            activeStep: props.activeStep || "",
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
          <MyAddress
            setCurrentSection={() => props.setCurrentSection?.()}
            mode={mode}
          >
            {addressContent}
          </MyAddress>
        </AddressContext.Provider>
      );
  }
};
export default AddressMain;
