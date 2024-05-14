import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
  RefObject
} from "react";
import Formsy from "formsy-react";
import FormInput from "../../../components/Formsy/FormInput";
import FormSelect from "../../../components/Formsy/FormSelect";
// import CountryCode from "../../../components/Formsy/CountryCode";
import PinCode from "../../../components/Formsy/PinCode";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { useSelector, useDispatch } from "react-redux";
import LoginService from "services/login";
import { AddressData, AddressFormData } from "../typings";
import { AddressContext } from "components/Address/AddressMain/context";
import { AppState } from "reducers/typings";
import { Country } from "components/Formsy/CountryCode/typings";
import AddressService from "services/address";
import { updateCountryData } from "actions/address";
import { getErrorList, errorTracking } from "utils/validate";
import BridalContext from "containers/myAccount/components/Bridal/context";
import noPincodeCountryList from "./noPincodeCountryList";
import Button from "components/Button";
import SelectDropdown from "components/Formsy/SelectDropdown";
import iconStyles from "styles/iconFonts.scss";
import { cloneDeep } from "lodash";
import BridalService from "services/bridal";
import {
  BridalDetailsType,
  BridalProfileData
} from "containers/myAccount/components/Bridal/typings";
import { updateAddressList } from "actions/address";
import { updateUser } from "actions/user";

type Props = {
  addressData?: AddressData;
  currentCallBackComponent: string;
  saveAddress: () => void;
  openAddressList: () => void;
  isGcCheckout?: boolean;
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
  const [nickname, setNickname] = useState("");
  const dispatch = useDispatch();
  const {
    closeAddressForm,
    mode,
    checkPinCode,
    setIsLoading,
    currentCallBackComponent
  } = useContext(AddressContext);

  const { bridalId } = useSelector((state: AppState) => state.user);
  // const [bridalProfile1, setBridalProfile] = useState<BridalProfileData>();
  // const [shareLink, setShareLink] = useState("");
  // const [bridalDetails, setBridalDetails] = useState<BridalDetailsType>({
  //   occasion: "",
  //   registrantName: "",
  //   registryName: "",
  //   coRegistrantName: "",
  //   userAddress: undefined,
  //   eventDate: ""
  // });
  const { user } = useSelector((state: AppState) => state);
  const address = props.addressData;

  const { currency } = useSelector((state: AppState) => state);
  const [isIndia, setIsIndia] = useState(currency === "INR");
  const [showPincode, setShowPincode] = useState(true);
  const [countryOptions, setCountryOptions] = useState<CountryOptions[]>([]);
  const [stateOptions, setStateOptions] = useState<StateOptions[]>([]);
  const { addressData } = props;
  const { countryData, pinCodeData } = useSelector(
    (state: AppState) => state.address
  );
  const isdList = countryData.map(list => {
    return list.isdCode;
  });
  const { changeBridalAddress, setBridalAddress, bridalProfile } = useContext(
    BridalContext
  );
  const { email, isLoggedIn } = useSelector((state: AppState) => state.user);
  const { mobile } = useSelector((state: AppState) => state.device);
  const countryRef: RefObject<HTMLInputElement> = useRef(null);
  const countryCodeRef: RefObject<HTMLInputElement> = React.createRef();

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

  // const onCountrySelect = (
  //   event: React.ChangeEvent<HTMLSelectElement> | null,
  //   defaultCountry?: string
  // ) => {
  //   if (countryOptions.length > 0) {
  //     const form = AddressFormRef.current;
  //     let selectedCountry = "";
  //     if (event) {
  //       selectedCountry = event.currentTarget.value;
  //       setIsAddressChanged(true);
  //       setIsCountryChanged(true);
  //       form &&
  //         form.updateInputsWithValue(
  //           {
  //             state: "",
  //             province: ""
  //           },
  //           false
  //         );
  //     } else if (defaultCountry) {
  //       selectedCountry = defaultCountry;
  //       // need to set defaultCountry explicitly
  //       if (form && selectedCountry) {
  //         form.updateInputsWithValue({
  //           country: selectedCountry
  //         });
  //       }
  //     }

  //     const { states, isd, value } = countryOptions.filter(
  //       country => country.value == selectedCountry
  //     )[0];

  //     if (noPincodeCountryList.includes(selectedCountry)) {
  //       setShowPincode(false);
  //     } else {
  //       setShowPincode(true);
  //     }

  //     if (form) {
  //       // reset state
  //       const { state, province } = form.getModel();
  //       if (state) {
  //         form.updateInputsWithValue({
  //           state: ""
  //         });
  //       }
  //       if (province) {
  //         form.updateInputsWithValue({
  //           province: ""
  //         });
  //       }
  //       form.updateInputsWithValue({
  //         phoneCountryCode: isd
  //       });
  //     }
  //     setIsIndia(value == "India");
  //     setStateOptions(states);
  //   }
  // };

  const onCountrySelect = (option: any, defaultCountry?: string) => {
    if (countryOptions.length > 0) {
      const form = AddressFormRef.current;
      let selectedCountry = "";
      if (option?.value) {
        selectedCountry = option?.value;
        setIsAddressChanged(true);
        setIsCountryChanged(true);
        form &&
          form.updateInputsWithValue(
            {
              state: "",
              province: "",
              country: selectedCountry
            },
            false
          );
      }

      if (defaultCountry) {
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
        setIsIndia(true);
        onCountrySelect(null, "India");
        break;
      case "GBP":
        setIsIndia(false);
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

  const getBridalProfileData = async () => {
    const data = await BridalService.fetchBridalProfile(dispatch, bridalId);
    if (data) {
      // setBridalProfile(data);
      // setBridalDetails(Object.assign({}, data, { userAddress: undefined }));
      // setShareLink(`${__DOMAIN__}/${data.shareLink}`);
      dispatch(
        updateUser(
          Object.assign({}, user, {
            bridalId: data.bridalId,
            bridalCurrency: data.currency
          })
        )
      );
    }
    return data;
  };

  const changeAddress = (newAddressId: number) => {
    getBridalProfileData()
      .then(_data => {
        AddressService.fetchAddressList(dispatch).then(data => {
          // dispatch(updateAddressList(data));
          const items = data;
          for (let i = 0; i < items.length; i++) {
            if (items[i].id == newAddressId) {
              setBridalAddress(items[i]);
              break;
            }
          }
        });
      })
      .catch(err => {
        console.error("Axios Error: ", err.response.data);
      });
  };

  const changeBridalAddressOnEdit = (addressId: number) => {
    const data = {
      bridalId: bridalId,
      addressId
    };
    BridalService.updateBridalAddress(dispatch, data).then(res => {
      // setBridalProfile(res[0]);
      // setShareLink(`${__DOMAIN__}/${res[0].shareLink}`);
      changeAddress(data.addressId);
      // setCurrentScreenValue("manageregistryfull");
    });
  };

  const submitAddress = (model: any, resetForm: any, invalidateForm: any) => {
    setErrorMessage("");
    setIsLoading(true);
    // prepare data
    const { country, state, province, addressType } = model;
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
      isDefaultForShipping: false,
      country: countryCode,
      addressType: addressType || ""
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
          const copyAddressList = cloneDeep(addressList);
          setIsLoading(false);
          closeAddressForm(
            copyAddressList?.[copyAddressList?.length - 1]?.isTulsi
              ? copyAddressList?.sort((a, b) => a.id - b.id)?.[
                  copyAddressList?.length - 2
                ]?.id
              : copyAddressList?.sort((a, b) => a.id - b.id)?.[
                  copyAddressList?.length - 1
                ]?.id
          );
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
              changeBridalAddress(id);
            }
          }
          setIsAddressChanged(false);
          setIsLoading(false);
          closeAddressForm(id);
          if (currentCallBackComponent == "account" && address?.isBridal) {
            changeBridalAddressOnEdit(id);
          }
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
  const isAlphaError = "Please enter only alphabetic characters";
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
        //  isDefaultForShipping = false,
        line1,
        line2,
        state,
        province,
        addressType
      } = addressData;
      // update stateOptions based on country
      onCountrySelect(null, countryName);
      setNickname(addressType || "");

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
            isDefaultForShipping: false,
            line1,
            line2,
            state,
            province,
            addressType: addressType || ""
          },
          true
        );

      setTimeout(() => {
        const firstErrorField = document.getElementsByClassName(
          globalStyles.errorBorder
        )[0] as HTMLDivElement;
        if (firstErrorField) {
          firstErrorField.focus();
          // firstErrorField.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }, 500);
    }
  }, [addressData, countryOptions]);

  useEffect(() => {
    if (
      mobile &&
      (currentCallBackComponent == "checkout-shipping" ||
        currentCallBackComponent == "checkout-billing")
    ) {
      document.body.classList.add(globalStyles.noScroll);
    }

    return () => {
      document.body.classList.remove(globalStyles.noScroll);
    };
  }, [mobile, currentCallBackComponent]);

  const handleCharLimit = (e: any) => {
    setNickname(e.target.value);
    setIsAddressChanged(true);
  };

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
      {currentCallBackComponent !== "checkout-shipping" &&
        currentCallBackComponent !== "checkout-billing" && (
          <div className="back-btn-div">
            <div
              className={
                currentCallBackComponent == "bridal"
                  ? cs(
                      styles.backBtnTopBridal,
                      styles.backBtnAddressBridal,
                      styles.backBtnFont
                    )
                  : cs(
                      styles.backBtnTop,
                      styles.backBtnAddress,
                      styles.backBtnFont
                    )
              }
              onClick={() =>
                closeAddressForm(mode === "edit" ? addressData?.id : undefined)
              }
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
        <div
          className={cs(globalStyles.voffset6, styles.categorylabel, {
            [styles.checkoutMobilePopup]:
              (mobile && currentCallBackComponent == "checkout-shipping") ||
              currentCallBackComponent == "checkout-billing"
          })}
          id="address-form"
        >
          {(currentCallBackComponent == "checkout-shipping" ||
            currentCallBackComponent == "checkout-billing") &&
            mobile && (
              <div
                className={cs(
                  styles.formTitleWrapper,
                  globalStyles.flex,
                  globalStyles.gutterBetween
                )}
              >
                <div className={styles.formTitle}>
                  {mode == "edit" ? "Edit ADDRESS" : "ADD NEW ADDRESS"}
                </div>
                <div
                  className={styles.formClose}
                  onClick={() =>
                    closeAddressForm(
                      mode === "edit" ? addressData?.id : undefined
                    )
                  }
                >
                  <i
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig,
                      styles.iconCross
                    )}
                  ></i>
                </div>
              </div>
            )}
          <div
            className={cs({
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
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
          <div
            className={cs({
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
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
                maxLength: "Please do not exceed the limit of 15 characters"
              }}
            />
          </div>
          <div
            className={cs({
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
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
                maxLength: "Please do not exceed the limit of 15 characters"
              }}
            />
          </div>
          {isIndia ? (
            <div
              className={cs({
                [styles.shipBillCheckout]:
                  currentCallBackComponent == "checkout-shipping" ||
                  currentCallBackComponent == "checkout-billing"
              })}
            >
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
                  isExisty: "Please enter a Pin/Zip code",
                  isValidPostcode: "Please enter a valid Pin/Zip code"
                }}
                changeState={changeState}
                placeholder={"Pin/Zip Code*"}
                name="postCode"
                disable={props.isGcCheckout && mode == "edit" ? true : false}
                required
              />
            </div>
          ) : showPincode ? (
            <div
              className={cs({
                [styles.shipBillCheckout]:
                  currentCallBackComponent == "checkout-shipping" ||
                  currentCallBackComponent == "checkout-billing"
              })}
            >
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
                  isExisty: "Please enter a Pin/Zip code",
                  matchRegexp: isAlphanumericError,
                  maxLength: "Maximum Length is 20 characters"
                }}
                disable={props.isGcCheckout && mode == "edit" ? true : false}
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
                disable={props.isGcCheckout && mode == "edit" ? true : false}
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
          <div
            className={cs({
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
            <div className="select-group text-left">
              {/* <FormSelect
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
              <span className="arrow"></span>*/}
              <SelectDropdown
                required
                name="country"
                handleChange={onCountrySelect}
                label="Country*"
                placeholder="Select Country*"
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: "Please select your Country",
                  isEmptyString: isExistyError
                }}
                options={countryOptions}
                allowFilter={true}
                inputRef={countryRef}
                disable={props.isGcCheckout && mode == "edit" ? true : false}
              />
            </div>
          </div>
          {stateOptions && stateOptions.length > 0 ? (
            <div
              className={cs({
                [styles.shipBillCheckout]:
                  currentCallBackComponent == "checkout-shipping" ||
                  currentCallBackComponent == "checkout-billing"
              })}
            >
              <div className="select-group text-left">
                <FormSelect
                  required
                  name="state"
                  label={"State*"}
                  placeholder={"Select State*"}
                  disable={
                    isIndia ||
                    (!isIndia && props.isGcCheckout && mode == "edit")
                  }
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
            <div
              className={cs({
                [styles.shipBillCheckout]:
                  currentCallBackComponent == "checkout-shipping" ||
                  currentCallBackComponent == "checkout-billing"
              })}
            >
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
          <div
            className={cs({
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
            <FormInput
              required
              name="line1"
              label={"House no / Floor / Building / Area*"}
              placeholder={"House no / Floor / Building / Area*"}
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
          <div
            className={cs({
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
            <FormInput
              name="line2"
              label="Nearby landmark (optional)"
              placeholder="Nearby landmark (optional)"
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
          <div
            className={cs({
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
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
          <div
            className={cs(styles.countryCode, {
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
            {/* <CountryCode
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
            />  */}

            <SelectDropdown
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
                isValidCode: "Please enter a valid country code"
              }}
              allowFilter={true}
              options={[]}
              inputRef={countryCodeRef}
              className={styles.countryCodeWrp}
            />

            <FormInput
              type="number"
              required
              name="phoneNumber"
              className={styles.contactNum}
              label={isIndia ? "Mobile Number*" : "Contact Number*"}
              placeholder={isIndia ? "Mobile Number*" : "Contact Number*"}
              handleChange={() => setIsAddressChanged(true)}
              validations={{
                isExisty: true,
                matchRegexp: /^[0-9\-/]+$/
              }}
              validationErrors={{
                isExisty: `Please enter your ${
                  isIndia ? "Mobile Number" : "Contact Number"
                }`,
                matchRegexp: `Please enter a valid ${
                  isIndia ? "Mobile Number" : "Contact Number"
                }`
              }}
              keyDown={e => (e.which === 69 ? e.preventDefault() : null)}
              onPaste={e =>
                e?.clipboardData.getData("Text").match(/([e|E])/)
                  ? e.preventDefault()
                  : null
              }
            />
            {isIndia && (
              <p key="contact-msg" className={styles.contactMsg}>
                This number will be used for sending OTP during delivery.
              </p>
            )}
          </div>

          <div
            className={cs({
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
            <FormInput
              id="addressType"
              name="addressType"
              label={"Address Nickname"}
              placeholder={"Address Nickname"}
              handleChange={e => handleCharLimit(e)}
              validations={{
                isWords: true,
                maxLength: 30
              }}
              validationErrors={{
                isWords: isAlphaError,
                maxLength: "You cannot type in more than 30 characters"
              }}
              maxlength={30}
            />
            <p className={styles.charLimit}>
              Character Limit:{" "}
              {30 - nickname?.length >= 0 ? 30 - nickname?.length : 0}/30
            </p>
          </div>
          {/* <div className={styles.addressFormCheckbox}>
            <FormCheckbox
              name="isDefaultForShipping"
              label={["Make Default Address"]}
              value={false}
              id="isShippingAddress"
              disable={addressData?.isDefaultForShipping || false}
              handleChange={() =>
                !addressData?.isDefaultForShipping && setIsAddressChanged(true)
              }
            />
          </div> */}

          <div
            className={cs(globalStyles.textCenter, {
              [styles.checkoutMobilePopupButton]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing",
              [styles.shipBillCheckout]:
                currentCallBackComponent == "checkout-shipping" ||
                currentCallBackComponent == "checkout-billing"
            })}
          >
            <div
              className={cs(globalStyles.flex, styles.btnWrp, {
                [styles.maxWidth]: mobile
              })}
            >
              <div
                className={cs(
                  {
                    [styles.maxWidth]: mobile,
                    [styles.fullWidth]:
                      currentCallBackComponent == "bridal-edit" ||
                      currentCallBackComponent == "bridal"
                  },
                  {
                    [globalStyles.paddT20]: !(
                      mobile &&
                      (currentCallBackComponent == "checkout-shipping" ||
                        currentCallBackComponent == "checkout-billing")
                    )
                  }
                )}
              >
                {mode == "edit" ? (
                  <Button
                    variant="mediumMedCharcoalCta366"
                    type="submit"
                    label={"SAVE ADDRESS"}
                    disabled={!isAddressChanged}
                    className={cs({ [styles.maxWidth]: mobile })}
                  />
                ) : (
                  <Button
                    variant="mediumMedCharcoalCta366"
                    type="submit"
                    label={"ADD NEW ADDRESS"}
                    className={cs({ [styles.maxWidth]: mobile })}
                  />
                )}
              </div>
              {/* {currentCallBackComponent !== "bridal-edit" &&
                currentCallBackComponent !== "bridal" && (
                  <div className="col-xs-6">
                    <button
                      className={cs(
                        {
                          [styles.aquaBtn]:
                            currentCallBackComponent == "account" ||
                            currentCallBackComponent == "checkout-shipping" ||
                            currentCallBackComponent == "checkout-billing"
                        },
                        {
                          [styles.charcoalBtnWidth]:
                            currentCallBackComponent == "checkout-shipping" ||
                            currentCallBackComponent == "checkout-billing"
                        }
                      )}
                      onClick={() =>
                        closeAddressForm(
                          mode === "edit" ? addressData?.id : undefined
                        )
                      }
                    >
                      cancel
                    </button>
                  </div>
                )} */}
            </div>
            {errorMessage ? (
              <p className={globalStyles.errorMsg}>{errorMessage}</p>
            ) : (
              <p className={globalStyles.errorMsg}></p>
            )}
          </div>
        </div>
      </Formsy>

      {
        <div
          className={cs(styles.backBtnCenter, styles.backBtnProfile, {
            [styles.backBtnCheckout]:
              currentCallBackComponent == "checkout-shipping" ||
              currentCallBackComponent == "checkout-billing"
          })}
        >
          <span
            className={cs(
              styles.backBtn,
              globalStyles.ointer,
              styles.addNewAddress
            )}
            onTouchEnd={() => {
              window.scrollTo(0, 0);
              closeAddressForm(mode === "edit" ? addressData?.id : undefined);
            }}
            onClick={() => {
              window.scrollTo(0, 0);
              closeAddressForm(mode === "edit" ? addressData?.id : undefined);
            }}
          >
            Go Back
          </span>
        </div>
      }
      {/* no need of BACK TO SAVED ADDRESSES at bottom so putting false here temprary */}
      {/* {isLoggedIn &&
        !mobile &&
        false &&
        (currentCallBackComponent == "checkout-billing" ||
          currentCallBackComponent == "checkout-shipping") && (
          <div
            className={cs(
              globalStyles.textRight,
              styles.formSubheading,
              styles.backAddressForm
            )}
          >
            <div
              className={globalStyles.pointer}
              onClick={() =>
                closeAddressForm(mode === "edit" ? addressData?.id : undefined)
              }
            >
              {addressList
                ? addressList.filter(data => !data.isBridal && !data.isTulsi)
                    .length > 0 || bridalUser.userId
                  ? "< BACK TO SAVED ADDRESSES"
                  : ""
                : "< BACK TO SAVED ADDRESSES"}
              {/* Back to Saved Addresses 
            </div>
          </div>
        )} */}
    </div>
  );
};

export default AddressForm;
