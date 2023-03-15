import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback
} from "react";
import Formsy from "formsy-react";
import FormInput from "../../../components/Formsy/FormInput";
import FormSelect from "../../../components/Formsy/FormSelect";
import CountryCode from "../../../components/Formsy/CountryCode";
import PinCode from "../../../components/Formsy/PinCode";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { useSelector, useDispatch } from "react-redux";
import LoginService from "services/login";
import FormCheckbox from "components/Formsy/FormCheckbox";
import { AddressData, AddressFormData } from "../typings";
import { AddressContext } from "components/Address/AddressMain/context";
import { AppState } from "reducers/typings";
import { Country } from "components/Formsy/CountryCode/typings";
import AddressService from "services/address";
import { updateCountryData } from "actions/address";
import { getErrorList, errorTracking } from "utils/validate";
import BridalContext from "containers/myAccount/components/Bridal/context";
import noPincodeCountryList from "./noPincodeCountryList";

type Props = {
  addressData?: AddressData;
  currentCallBackComponent: string;
  saveAddress: () => void;
  openAddressList: () => void;
};

type CountryOptions = {
  value: string;
  label: string;
  code2: string;
  isd: string | undefined;
  states: StateOptions[];
};

type StateOptions = {
  value: string;
  label: string;
  id: number;
  nameAscii: string;
};

const AddressForm: React.FC<Props> = props => {
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCountryChanged, setIsCountryChanged] = useState(false);
  const dispatch = useDispatch();
  const {
    closeAddressForm,
    mode,
    checkPinCode,
    setIsLoading,
    currentCallBackComponent
  } = useContext(AddressContext);
  const [isIndia, setIsIndia] = useState(false);
  const [showPincode, setShowPincode] = useState(true);
  const [countryOptions, setCountryOptions] = useState<CountryOptions[]>([]);
  const [stateOptions, setStateOptions] = useState<StateOptions[]>([]);
  const { addressData } = props;
  const { currency } = useSelector((state: AppState) => state);
  const { countryData, pinCodeData, addressList } = useSelector(
    (state: AppState) => state.address
  );
  const isdList = countryData.map(list => {
    return list.isdCode;
  });
  const { setBridalAddress, bridalProfile } = useContext(BridalContext);
  const { email, isLoggedIn } = useSelector((state: AppState) => state.user);
  const { mobile } = useSelector((state: AppState) => state.device);

  const isAddressPincodeValid = useCallback(
    (postCode: string, state: string): boolean => {
      let isValid = false;
      const validState = pinCodeData[postCode];
      if (
        validState &&
        state &&
        state.toLowerCase() == validState.toLowerCase() &&
        postCode.length <= 20
      ) {
        isValid = true;
      }
      return isValid;
    },
    [pinCodeData.length]
  );

  const AddressFormRef = useRef<Formsy>(null);

  const onCountrySelect = (
    event: React.ChangeEvent<HTMLSelectElement> | null,
    defaultCountry?: string
  ) => {
    if (countryOptions.length > 0) {
      const form = AddressFormRef.current;
      let selectedCountry = "";
      if (event) {
        selectedCountry = event.currentTarget.value;
        setIsAddressChanged(true);
        setIsCountryChanged(true);
        form &&
          form.updateInputsWithValue(
            {
              state: "",
              province: ""
            },
            false
          );
      } else if (defaultCountry) {
        selectedCountry = defaultCountry;
        // need to set defaultCountry explicitly
        if (form && selectedCountry) {
          form.updateInputsWithValue({
            country: selectedCountry
          });
        }
      }

      const { states, isd, value } = countryOptions.filter(
        country => country.value == selectedCountry
      )[0];

      if (noPincodeCountryList.includes(selectedCountry)) {
        setShowPincode(false);
      } else {
        setShowPincode(true);
      }

      if (form) {
        // reset state
        const { state, province } = form.getModel();
        if (state) {
          form.updateInputsWithValue({
            state: ""
          });
        }
        if (province) {
          form.updateInputsWithValue({
            province: ""
          });
        }
        form.updateInputsWithValue({
          phoneCountryCode: isd
        });
      }
      setIsIndia(value == "India");
      setStateOptions(states);
    }
  };

  const setDefaultCountry = () => {
    switch (currency) {
      case "INR":
        onCountrySelect(null, "India");
        break;
      case "GBP":
        onCountrySelect(null, "United Kingdom");
        break;
    }
  };

  const changeCountryData = (countryData: Country[]) => {
    const countryOptions = countryData.map(country => {
      const states = country.regionSet.map(state => {
        return Object.assign({}, state, {
          value: state.nameAscii,
          label: state.nameAscii
        });
      });
      return Object.assign(
        {},
        {
          value: country.nameAscii,
          label: country.nameAscii,
          code2: country.code2,
          isd: country.isdCode,
          states: states
        }
      );
    });
    setCountryOptions(countryOptions);
  };

  const handleInvalidSubmit = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLDivElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = getErrorList(globalStyles.errorMsg, "address-form");
      if (errorList && errorList.length) {
        errorTracking(errorList, location.href);
      }
    }, 0);
  };

  const submitAddress = (model: any, resetForm: any, invalidateForm: any) => {
    setErrorMessage("");
    setIsLoading(true);
    // prepare data
    const { country, state, province } = model;
    let st = state;
    let pro = province;
    const countryCode = countryOptions.filter(
      countryOption => countryOption.value == country
    )[0].code2;
    if (stateOptions.length > 0) {
      pro = "";
      st = state;
    } else {
      st = "";
      pro = province;
    }
    const formData: AddressFormData = {
      ...model,
      state: st,
      province: pro,
      isDefaultForBilling: false,
      country: countryCode
    };
    if (mode == "new") {
      AddressService.addNewAddress(dispatch, formData)
        .then(addressList => {
          if (currentCallBackComponent == "bridal-edit") {
            const bridalAddress = addressList.filter(
              address => address.id == bridalProfile?.userAddressId
            )[0];
            if (bridalAddress) {
              setBridalAddress(bridalAddress);
            }
          }
          setIsLoading(false);
          closeAddressForm();
        })
        .catch(err => {
          const errData = err.response.data;
          const form = AddressFormRef.current;
          if (typeof errData == "string") {
            setErrorMessage(errData);
          } else if (typeof errData == "object") {
            if (err.response.data.error_message) {
              let errorMsg = err.response.data.error_message[0];
              if (errorMsg == "MaxRetries") {
                errorMsg =
                  "You have exceeded max attempts, please try after some time.";
              }
              setErrorMessage(errorMsg);
            } else {
              form && form.updateInputsWithError(errData, true);
              handleInvalidSubmit();
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (mode == "edit" && addressData) {
      const { id } = addressData;
      AddressService.updateAddress(dispatch, formData, id)
        .then(addressList => {
          if (currentCallBackComponent == "bridal-edit") {
            const bridalAddress = addressList.filter(
              address => address.id == bridalProfile?.userAddressId
            )[0];
            if (bridalAddress) {
              setBridalAddress(bridalAddress);
            }
          }
          setIsAddressChanged(false);
          setIsLoading(false);
          closeAddressForm();
        })
        .catch(err => {
          const errData = err.response.data;
          const form = AddressFormRef.current;
          if (typeof errData == "string") {
            setErrorMessage(errData);
          } else if (typeof errData == "object") {
            if (err.response.data.error_message) {
              let errorMsg = err.response.data.error_message[0];
              if (errorMsg == "MaxRetries") {
                errorMsg =
                  "You have exceeded max attempts, please try after some time.";
              }
              setErrorMessage(errorMsg);
            } else {
              form && form.updateInputsWithError(errData, true);
              handleInvalidSubmit();
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const changeState = (pinCode: string) => {
    const newState = pinCodeData[pinCode];
    const form = AddressFormRef.current;
    const { state } = form && form.getModel();
    if (state != newState) {
      setIsAddressChanged(true);
      form && form.updateInputsWithValue({ state: newState });
    }
  };

  const handlePostcodeBlur = (event: React.MouseEvent<HTMLInputElement>) => {
    const pinCode = event.currentTarget.value;
    checkPinCode(pinCode) && changeState(pinCode);
  };

  const isExistyError = "This field is required";
  const isAlphanumericError = "Only alphabets and numbers are allowed";
  const isAlphaError = "Only alphabets are allowed";
  const isEmailError = "Please enter the correct email";

  useEffect(() => {
    if (!countryData || countryData.length == 0) {
      LoginService.fetchCountryData(dispatch).then(countryData => {
        dispatch(updateCountryData(countryData));
      });
    }
    const firstField = document.getElementById("first-field") as HTMLDivElement;
    firstField && firstField.focus();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    changeCountryData(countryData);
  }, [countryData]);

  useEffect(() => {
    mode == "new" && countryOptions.length > 0 && setDefaultCountry();
  }, [countryOptions]);

  useEffect(() => {
    if (mode == "edit" && addressData) {
      // extract formData from address
      const {
        firstName,
        lastName,
        city,
        postCode,
        countryName,
        phoneCountryCode,
        phoneNumber,
        isDefaultForShipping,
        line1,
        line2,
        state,
        province
      } = addressData;
      // update stateOptions based on country
      onCountrySelect(null, countryName);

      const form = AddressFormRef.current;
      form &&
        form.updateInputsWithValue(
          {
            firstName,
            lastName,
            city,
            postCode,
            country: countryName,
            phoneCountryCode,
            phoneNumber,
            isDefaultForShipping,
            line1,
            line2,
            state,
            province
          },
          true
        );
    }
  }, [addressData, countryOptions]);
  const bridalUser = { userId: 0 };

  return (
    <div
      className={cs(
        styles.loginForm,
        {
          [bootstrapStyles.col12]:
            currentCallBackComponent == "checkout-shipping" ||
            currentCallBackComponent == "checkout-billing"
        },
        {
          [bootstrapStyles.colMd7]:
            currentCallBackComponent == "checkout-shipping" ||
            currentCallBackComponent == "checkout-billing"
        }
      )}
    >
      {((!mobile && currentCallBackComponent == "account") ||
        currentCallBackComponent == "bridal-edit") && (
        <div className="back-btn-div">
          <div
            className={cs(
              styles.backBtnTop,
              styles.backBtnAddress,
              styles.backBtnFont
            )}
            onClick={closeAddressForm}
          >
            &lt; back
          </div>
        </div>
      )}
      <Formsy
        ref={AddressFormRef}
        onValidSubmit={submitAddress}
        onInvalidSubmit={handleInvalidSubmit}
      >
        <div className={styles.categorylabel} id="address-form">
          <div>
            <FormInput
              name="emailId"
              required
              className={cs({
                [styles.disabledInput]:
                  (addressData && addressData.emailId) || email
              })}
              label={"Email Address*"}
              placeholder={"Email Address*"}
              value={(addressData && addressData.emailId) || email}
              disable={!!((addressData && addressData.emailId) || email)}
              validations={{
                isExisty: true,
                isEmail: true
              }}
              validationErrors={{
                isExisty: isExistyError,
                isEmail: isEmailError
              }}
            />
          </div>
          <div>
            <FormInput
              id="first-field"
              required
              name="firstName"
              label={"First Name*"}
              placeholder={"First Name*"}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                isExisty: true,
                isWords: true,
                maxLength: 15
              }}
              validationErrors={{
                isExisty: "Please enter your First Name",
                isWords: isAlphaError,
                maxLength: "You cannot type in more than 15 characters"
              }}
            />
          </div>
          <div>
            <FormInput
              required
              name="lastName"
              label={"Last Name*"}
              placeholder={"Last Name*"}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                isExisty: true,
                isWords: true,
                maxLength: 15
              }}
              validationErrors={{
                isExisty: "Please enter your Last Name",
                isWords: isAlphaError,
                maxLength: "You cannot type in more than 15 characters"
              }}
            />
          </div>
          {isIndia ? (
            <div>
              <PinCode
                id="pincode"
                blur={handlePostcodeBlur}
                value={
                  addressData && !isCountryChanged ? addressData.postCode : ""
                }
                handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setIsAddressChanged(true);
                }}
                label={"Pin/Zip Code*"}
                validations={{
                  isExisty: true,
                  isValidPostcode: (values, value) => {
                    const { postCode, state } = values;
                    return isAddressPincodeValid(postCode, state);
                  }
                }}
                validationErrors={{
                  isExisty: "Please fill this field",
                  isValidPostcode: "Please enter a valid Pin/Zip code"
                }}
                changeState={changeState}
                placeholder={"Pin/Zip Code*"}
                name="postCode"
                required
              />
            </div>
          ) : showPincode ? (
            <div>
              <FormInput
                required
                name="postCode"
                label={"Pin/Zip Code*"}
                placeholder={"Pin/Zip Code*"}
                value={
                  addressData && !isCountryChanged ? addressData.postCode : ""
                }
                handleChange={event => {
                  setIsAddressChanged(true);
                }}
                validations={{
                  isExisty: true,
                  matchRegexp: /^[a-z\d\-_\s]+$/i,
                  maxLength: 20
                }}
                validationErrors={{
                  isExisty: "Please fill this field",
                  matchRegexp: isAlphanumericError,
                  maxLength: "Maximum Length is 20 characters"
                }}
              />
            </div>
          ) : (
            <div style={{ display: "none" }}>
              <FormInput
                name="postCode"
                label={"Pin/Zip Code*"}
                placeholder={"Pin/Zip Code*"}
                value="000000"
                handleChange={event => {
                  setIsAddressChanged(true);
                }}
                // validations={{
                //   isExisty: true,
                //   matchRegexp: /^[a-z\d\-_\s]+$/i
                // }}
                // validationErrors={{
                //   isExisty: "Please fill this field",
                //   matchRegexp: isAlphanumericError
                // }}
              />
            </div>
          )}
          <div>
            <div className="select-group text-left">
              <FormSelect
                required
                label={"Country*"}
                options={countryOptions}
                handleChange={onCountrySelect}
                placeholder={"Select Country*"}
                name="country"
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: "Please select your Country",
                  isEmptyString: isExistyError
                }}
              />
              <span className="arrow"></span>
            </div>
          </div>
          {stateOptions && stateOptions.length > 0 ? (
            <div>
              <div className="select-group text-left">
                <FormSelect
                  required
                  name="state"
                  label={"State*"}
                  placeholder={"Select State*"}
                  disable={isIndia}
                  options={stateOptions}
                  value={
                    addressData && !isCountryChanged ? addressData.state : ""
                  }
                  handleChange={() => setIsAddressChanged(true)}
                  validations={{
                    isExisty: true
                  }}
                  validationErrors={{
                    isExisty: isExistyError,
                    isEmptyString: isExistyError
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <FormInput
                name="province"
                label={"Province"}
                placeholder={"Province"}
                value={
                  addressData && !isCountryChanged ? addressData.province : ""
                }
                handleChange={event => {
                  setIsAddressChanged(true);
                }}
                // validations={{
                //   isExisty: true,
                //   matchRegexp: /^[a-z\d\-_\s]+$/i
                // }}
                // validationErrors={{
                //   isExisty: "Please fill this field",
                //   matchRegexp: isAlphanumericError
                // }}
              />
            </div>
          )}
          <div>
            <FormInput
              required
              name="line1"
              label={"Address Line 1*"}
              placeholder={"Address Line 1*"}
              handleChange={() => setIsAddressChanged(true)}
              maxlength={75}
              validations={{
                maxLength: 75,
                isExisty: true
              }}
              validationErrors={{
                isExisty: "Please enter your Address",
                maxLength: "You cannot type in more than 75 characters"
              }}
            />
          </div>
          <div>
            <FormInput
              name="line2"
              label="Address Line 2"
              placeholder="Address Line 2"
              handleChange={() => setIsAddressChanged(true)}
              maxlength={75}
              validations={{
                maxLength: 75
              }}
              validationErrors={{
                maxLength: "You cannot type in more than 75 characters"
              }}
            />
          </div>
          <div>
            <FormInput
              required
              name="city"
              label={"City*"}
              placeholder={"City*"}
              maxlength={30}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                isExisty: true,
                isWords: true
              }}
              validationErrors={{
                isExisty: "Please enter your City",
                isWords: isAlphaError
              }}
            />
          </div>
          <div className={styles.countryCode}>
            <CountryCode
              id="isdcode"
              value=""
              disable={!!props.currentCallBackComponent}
              placeholder="Code"
              name="phoneCountryCode"
              validations={{
                isCodeValid: (values, value) => {
                  return !(values.phone && value == "");
                },
                isValidCode: (values, value) => {
                  if (value && isdList.length > 0) {
                    return isdList.indexOf(value ? value : "") > -1;
                  } else {
                    return true;
                  }
                }
              }}
              validationErrors={{
                isCodeValid: "Required",
                isValidCode: "Enter valid code"
              }}
            />

            <FormInput
              type="number"
              required
              name="phoneNumber"
              label={"Contact Number*"}
              placeholder={"Contact Number*"}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                isExisty: true,
                matchRegexp: /^[0-9\-/]+$/
              }}
              validationErrors={{
                isExisty: "Please enter your Contact Number",
                matchRegexp: "Please enter a valid Contact Number"
              }}
              keyDown={e => (e.which === 69 ? e.preventDefault() : null)}
              onPaste={e =>
                e?.clipboardData.getData("Text").match(/([e|E])/)
                  ? e.preventDefault()
                  : null
              }
            />
            <p key="contact-msg" className={styles.contactMsg}>
              This number will be used for sending OTP during delivery.
            </p>
          </div>
          {true && (
            <div className={styles.addressFormCheckbox}>
              <FormCheckbox
                name="isDefaultForShipping"
                label={["Make Default Address"]}
                value={false}
                id="isShippingAddress"
                disable={false}
                handleChange={() => setIsAddressChanged(true)}
              />
            </div>
          )}
          <div>
            <div className="row">
              <div className="col-xs-12">
                {mode == "edit" ? (
                  <input
                    formNoValidate={true}
                    type="submit"
                    value={isAddressChanged ? "Update Address" : "Updated"}
                    className={cs(
                      globalStyles.ceriseBtn,
                      {
                        [globalStyles.disabledBtn]: !isAddressChanged
                      },
                      {
                        [styles.charcoalBtn]:
                          currentCallBackComponent == "account"
                      }
                    )}
                    disabled={!isAddressChanged}
                  />
                ) : (
                  <input
                    formNoValidate={true}
                    type="submit"
                    value="Save Address"
                    className={cs(
                      globalStyles.ceriseBtn,
                      {
                        [styles.disabledBtn]: !isAddressChanged
                      },
                      {
                        [styles.charcoalBtn]:
                          currentCallBackComponent == "account"
                      }
                    )}
                    disabled={!isAddressChanged}
                  />
                )}
              </div>
            </div>
            {errorMessage ? (
              <p className={globalStyles.errorMsg}>{errorMessage}</p>
            ) : (
              <p className={globalStyles.errorMsg}></p>
            )}
          </div>
        </div>
      </Formsy>

      {((currentCallBackComponent !== "checkout-billing" &&
        currentCallBackComponent !== "checkout-shipping" &&
        currentCallBackComponent !== "bridal") ||
        mobile) && (
        <div className={cs(styles.backBtnCenter, styles.backBtnProfile)}>
          <span
            className={cs(
              styles.backBtn,
              globalStyles.ointer,
              styles.addNewAddress
            )}
            onClick={closeAddressForm}
          >
            Cancel & Go Back
          </span>
        </div>
      )}
      {isLoggedIn &&
        !mobile &&
        (currentCallBackComponent == "checkout-billing" ||
          currentCallBackComponent == "checkout-shipping") && (
          <div
            className={cs(
              globalStyles.textRight,
              styles.formSubheading,
              styles.backAddressForm
            )}
          >
            <div className={globalStyles.pointer} onClick={closeAddressForm}>
              {addressList
                ? addressList.filter(data => !data.isBridal && !data.isTulsi)
                    .length > 0 || bridalUser.userId
                  ? "< BACK TO SAVED ADDRESSES"
                  : ""
                : "< BACK TO SAVED ADDRESSES"}
              {/* Back to Saved Addresses */}
            </div>
          </div>
        )}
    </div>
  );
};

export default AddressForm;
