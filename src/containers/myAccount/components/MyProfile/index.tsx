import React, { RefObject, useEffect, useRef, useState } from "react";
import cs from "classnames";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import { ProfileProps, ProfileResponse, State } from "./typings";
import FormInput from "../../../../components/Formsy/FormInput";
import FormSelect from "../../../../components/Formsy/FormSelect";
// import CountryCode from "../../../../components/Formsy/CountryCode";
import moment from "moment";
import Formsy from "formsy-react";
import FormCheckbox from "components/Formsy/FormCheckbox";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { genderOptions } from "constants/profile";
import { getErrorList, errorTracking } from "utils/validate";
import { AppState } from "reducers/typings";
import { Country } from "components/Formsy/CountryCode/typings";
import { pageViewGTM } from "utils/validate";
import AccountService from "services/account";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";
import { updatePreferenceData } from "actions/user";
import { CONFIG } from "constants/util";
import Button from "components/Button";
import SelectDropdown from "components/Formsy/SelectDropdown";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import ModalStyles from "components/Modal/styles.scss";
import MetaService from "services/meta";

const MyProfile: React.FC<ProfileProps> = ({ setCurrentSection }) => {
  const {
    address: { countryData },
    user: { isLoggedIn },
    device: { mobile }
  } = useSelector((state: AppState) => state);

  const cookies = useSelector((state: AppState) => state.cookies);

  const {
    user: { preferenceData }
  } = useSelector((state: AppState) => state);
  const [data, setData] = useState<Partial<ProfileResponse>>({});
  const countryRef: RefObject<HTMLInputElement> = useRef(null);
  const countryCodeRef: RefObject<HTMLInputElement> = React.createRef();

  const [profileState, setProfileState] = useState<State>({
    newsletter: false,
    uniqueId: "",
    abandonedCartNotification: false,
    user: 0,
    updateProfile: false,
    subscribe: false,
    showerror: "",
    panHighlight: false,
    panmsg: "",
    dateOfBirth: "",
    code: "",
    loginVia: "email",
    showDOBLabel: false,
    nmsg: "",
    phoneNumber: "",
    phonecodeError: "",
    highlightCode: false,
    numHighlight: false,
    minDate: moment(
      new Date().setFullYear(new Date().getFullYear() - 110)
    ).format("YYYY-MM-DD"),
    maxDate: moment(
      new Date().setFullYear(new Date().getFullYear() - 15)
    ).format("YYYY-MM-DD"),
    errorDob: "",
    hightlightDob: false,
    countryOptions: [],
    stateOptions: [],
    isIndia: false
  });
  const ProfileFormRef = useRef<Formsy | null>(null);
  const dispatch = useDispatch();
  const [isdList, setIsdList] = useState(
    countryData.map(list => {
      return list.isdCode;
    })
  );

  const changeCountryData = (countryData: Country[], newData: any) => {
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
    const formdata = newData ? newData : data;
    // formdata.state = formdata.state;
    if (countryOptions.length > 0 && formdata?.country) {
      countryOptions.map(con => {
        if (con.code2 == formdata.country) {
          formdata.country = con.value;
        }
      });
      const { states } = countryOptions.filter(
        country => country.value == formdata.country
      )[0];

      setProfileState({
        ...profileState,
        countryOptions: countryOptions,
        // data: formdata,
        isIndia: formdata.country == "India",
        stateOptions: states
      });
      // ProfileFormRef.current &&
      //   ProfileFormRef.current.updateInputsWithValue(formdata);
    }
    setData(formdata);
    ProfileFormRef.current &&
      ProfileFormRef.current.updateInputsWithValue(formdata);
  };

  const setApiResponse = (data: ProfileResponse) => {
    const {
      user,
      uniqueId,
      abandonedCartNotification,
      newsletter,
      loginVia,
      ...formData
    } = data;
    formData.dateOfBirth = formData.dateOfBirth
      ? moment(formData.dateOfBirth).format("YYYY-MM-DD")
      : "";

    setProfileState({
      ...profileState,
      user,
      uniqueId,
      abandonedCartNotification,
      newsletter
      // data: data
    });
    changeCountryData(countryData, data);
    // ProfileFormRef.current &&
    //   ProfileFormRef.current.updateInputsWithValue(formData);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    setCurrentSection();
    AccountService.fetchProfileData(dispatch)
      .then(data => {
        LoginService.fetchCountryData(dispatch).then(res => {
          dispatch(updateCountryData(res));
          changeCountryData(res, data);
          pageViewGTM("MyAccount");
          window.scrollTo(0, 0);
        });
        setApiResponse(data);
      })
      .catch(err => {
        setProfileState({
          ...profileState,
          showerror: "Something went wrong, please try again"
        });
      });

    if (CONFIG.WHATSAPP_SUBSCRIBE_ENABLED) {
      AccountService.fetchAccountPreferences(dispatch).then((data: any) => {
        dispatch(updatePreferenceData(data));
      });
    }
  }, []);

  useEffect(() => {
    setIsdList(
      countryData.map(list => {
        return list.isdCode;
      })
    );
    changeCountryData(countryData, data);
  }, [countryData]);

  const handleInvalidSubmit = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = getErrorList(globalStyles.errorMsg, "myprofile-form");
      if (errorList && errorList.length) {
        errorTracking(errorList, location.href);
      }
    }, 0);
  };

  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    const { updateProfile, countryOptions, stateOptions } = profileState;
    if (!updateProfile) return false;
    const {
      firstName,
      lastName,
      phoneCountryCode,
      phoneNumber,
      gender,
      panPassportNumber,
      dateOfBirth,
      subscribe,
      country,
      state
    } = model;

    const formData: any = {};
    // formData["firstName"] = firstName || "";
    // formData["lastName"] = lastName || "";
    // if (phoneCountryCode && phoneNumber) {
    //   formData["phoneCountryCode"] = phoneCountryCode;
    //   formData["phoneNumber"] = phoneNumber;
    // }
    // formData["gender"] = gender || "";
    // formData["panPassportNumber"] = panPassportNumber || "";
    // formData["dateOfBirth"] = dateOfBirth
    //   ? moment(dateOfBirth).format("YYYY-MM-DD")
    //   : null;
    // formData["subscribe"] = subscribe;
    // const countryCode = countryOptions.filter(
    //   countryOption => countryOption?.value == country
    // )[0]?.code2;
    // formData["country"] = countryCode;
    // if (countryCode == "IN") {
    //   formData["state"] = state || "";
    // }
    // formData["whatsappSubscribe"] = preferenceData?.whatsappSubscribe;
    // Check if fields are disabled and send empty values if they are
    formData["firstName"] = data?.firstName ? "" : firstName || "";
    formData["lastName"] = data?.lastName ? "" : lastName || "";
    if (
      !data?.phoneCountryCode &&
      !data?.phoneNumber &&
      phoneCountryCode &&
      phoneNumber
    ) {
      formData["phoneCountryCode"] = phoneCountryCode;
      formData["phoneNumber"] = phoneNumber;
    } else {
      // If either field is disabled, send empty values for both phone fields
      if (data?.phoneCountryCode || data?.phoneNumber) {
        formData["phoneCountryCode"] = "";
        formData["phoneNumber"] = "";
      }
    }
    formData["gender"] = data?.gender ? "" : gender || "";
    formData["panPassportNumber"] = data?.panPassportNumber
      ? ""
      : panPassportNumber || "";
    formData["dateOfBirth"] = data?.dateOfBirth
      ? ""
      : dateOfBirth
      ? moment(dateOfBirth).format("YYYY-MM-DD")
      : null;
    formData["subscribe"] = subscribe;

    // For country and state, check if they're disabled
    const countryCode = countryOptions.filter(
      countryOption => countryOption?.value == country
    )[0]?.code2;

    // Always include country in payload, empty if disabled
    formData["country"] =
      countryOptions.length > 0 && data?.country ? "" : countryCode;

    // Always include state in payload if country is India
    if (countryCode == "IN") {
      formData["state"] =
        stateOptions.length > 0 && data?.state ? "" : state || "";
    }

    formData["whatsappSubscribe"] = preferenceData?.whatsappSubscribe || false;

    setProfileState({
      ...profileState,
      showerror: ""
    });
    AccountService.updateProfileData(dispatch, formData)
      .then(data => {
        setApiResponse(data);
        setProfileState({
          ...profileState,
          updateProfile: false
        });
        MetaService.updateMeta(dispatch, cookies);
      })
      .catch(error => {
        const errdata = error.response?.data;
        handleInvalidSubmit();
        Object.keys(errdata).map(data => {
          switch (data) {
            case "firstName":
            case "lastName":
            case "gender":
            case "dateOfBirth":
            case "phoneNumber":
            case "phoneCountryCode":
            case "panPassportNumber":
              updateInputsWithError(
                {
                  [data]: errdata?.[data]?.[0]
                },
                true
              );
              break;
            case "error_message": {
              let errorMsg = errdata?.[data]?.[0];
              if (errorMsg == "MaxRetries") {
                errorMsg =
                  "You have exceeded max attempts, please try after some time.";
              }
              setProfileState({
                ...profileState,
                showerror: errorMsg
              });
              break;
            }
          }
        });
      });
  };

  const {
    countryOptions,
    // data,
    minDate,
    maxDate,
    isIndia,
    stateOptions,
    showerror,
    updateProfile
  } = profileState;

  const setUpdateProfile = () => {
    if (!profileState.updateProfile) {
      setProfileState({ ...profileState, updateProfile: true });
    }
  };

  // const onCountrySelect = (
  //   event: React.ChangeEvent<HTMLSelectElement> | null,
  //   defaultCountry?: string
  // ) => {
  //   const { countryOptions } = profileState;
  //   if (countryOptions.length > 0) {
  //     const form = ProfileFormRef.current;
  //     let selectedCountry = "";
  //     if (event) {
  //       selectedCountry = event.currentTarget.value;
  //       // setIsAddressChanged(true);
  //       // setIsCountryChanged(true);
  //       form &&
  //         form.updateInputsWithValue(
  //           {
  //             state: ""
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

  //     if (form) {
  //       // reset state
  //       const { state } = form.getModel();
  //       if (state) {
  //         form.updateInputsWithValue({
  //           state: ""
  //         });
  //       }
  //       form.updateInputsWithValue({
  //         code: isd
  //       });
  //     }
  //     setProfileState({
  //       ...profileState,
  //       isIndia: value == "India",
  //       stateOptions: states
  //     });
  //   }
  // };

  const onCountryCodeSelect = (option: any) => {
    const form = ProfileFormRef.current;
    const selectedCountryCode = option?.value;

    form &&
      form.updateInputsWithValue({
        phoneCountryCode: selectedCountryCode
      });
    setUpdateProfile();
  };

  const onCountrySelect = (option: any, defaultCountry?: string) => {
    if (countryOptions.length > 0) {
      const form = ProfileFormRef.current;
      let selectedCountry = "";
      if (option?.value) {
        selectedCountry = option?.value;

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

      setProfileState({
        ...profileState,
        isIndia: value == "India",
        stateOptions: states
      });
    }
  };

  const getCountryCodeObject = () => {
    const arr: any[] = [];
    countryOptions.map(({ label, isd }: any) => {
      arr.push({ label: `${label}(${isd})`, value: isd });
    });
    return arr;
  };

  const onEditClick = () => {
    dispatch(
      updateComponent(
        POPUP.EditProfile,
        null,
        false,
        mobile ? ModalStyles.bottomAlignSlideUp : "",
        mobile ? "slide-up-bottom-align" : ""
      )
    );
    dispatch(updateModal(true));
  };

  const isExistyError = "This field is required";

  const formContent = (
    <div className={cs(styles.loginForm, globalStyles.voffset4)}>
      <div>
        <Formsy
          ref={ProfileFormRef}
          onValidSubmit={handleSubmit}
          onInvalidSubmit={handleInvalidSubmit}
        >
          <div className={styles.categorylabel} id="myprofile-form">
            <div>
              <FormInput
                name="emailId"
                placeholder={"Email Address"}
                label={"Email"}
                disable={true}
                className={styles.disabledInput}
              />
            </div>
            <div>
              <FormInput
                name="firstName"
                placeholder={"First Name"}
                label={"First Name"}
                keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
                required
                handleChange={() => setUpdateProfile()}
                disable={data?.firstName ? true : false}
                className={cs({ [styles.disabledInput]: data?.firstName })}
              />
            </div>
            <div>
              <FormInput
                name="lastName"
                placeholder={"Last Name"}
                label={"Last Name"}
                keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
                handleChange={() => setUpdateProfile()}
                disable={data?.lastName ? true : false}
                className={cs({ [styles.disabledInput]: data?.lastName })}
              />
            </div>
            <div className={styles.userGenderPicker}>
              <FormSelect
                name="gender"
                required
                options={genderOptions}
                value={data?.gender || undefined}
                label="Select Gender"
                placeholder="Select Gender"
                handleChange={() => setUpdateProfile()}
                disable={data?.gender ? true : false}
                className={cs({ [styles.disabledInput]: data?.gender })}
              />
            </div>
            <div className={styles.calendarIconContainer}>
              <FormInput
                name="dateOfBirth"
                type="date"
                handleChange={() => setUpdateProfile()}
                value={data?.dateOfBirth}
                disable={data?.dateOfBirth ? true : false}
                className={cs({ [styles.disabledInput]: data?.dateOfBirth })}
                id="dateOfBirth"
                placeholder="YYYY/MM/DD"
                label="Date of Birth"
                min={moment(
                  new Date().setFullYear(new Date().getFullYear() - 110)
                ).format("YYYY-MM-DD")}
                max={moment(
                  new Date().setFullYear(new Date().getFullYear() - 15)
                ).format("YYYY-MM-DD")}
                validations={{
                  isValidDate: (values, value) => {
                    if (value && !data?.dateOfBirth) {
                      return moment(value).isValid();
                    } else return true;
                  },
                  isMinAllowedDate: (values, value) => {
                    if (value && !data?.dateOfBirth) {
                      return (
                        new Date(value).getTime() > new Date(minDate).getTime()
                      );
                    } else return true;
                  },
                  isMaxAllowedDate: (values, value) => {
                    if (value && !data?.dateOfBirth) {
                      return (
                        new Date(value).getTime() < new Date(maxDate).getTime()
                      );
                    } else return true;
                  }
                }}
                validationErrors={{
                  isValidDate: "Please enter a valid Date of Birth",
                  isMinAllowedDate: "Please enter a valid Date of Birth",
                  isMaxAllowedDate: "Age should be at least 15 years"
                }}
              />
            </div>
            <div>
              <div className="select-group text-left">
                {/* <FormSelect
                  required
                  label="Country"
                  value={data?.country}
                  options={countryOptions}
                  handleChange={onCountrySelect}
                  placeholder="Select Country"
                  name="country"
                  validations={{
                    isExisty: true
                  }}
                  validationErrors={{
                    isExisty: "Please select your Country",
                    isEmptyString: isExistyError
                  }}
                  disable={countryOptions.length > 0 ? true : false}
                  className={cs({
                    [styles.disabledInput]: countryOptions.length > 0
                  })}
                />
                <span className="arrow"></span> */}
                <SelectDropdown
                  required
                  name="country"
                  handleChange={onCountrySelect}
                  label="Country*"
                  placeholder="Select Country*"
                  value={data?.country}
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
                  disable={countryOptions.length > 0 ? true : false}
                />
              </div>
            </div>
            {isIndia && (
              <div>
                <div className="select-group text-left">
                  <FormSelect
                    required
                    name="state"
                    label="State"
                    placeholder="Select State"
                    options={stateOptions}
                    value={data?.state}
                    validations={{
                      isExisty: true
                    }}
                    validationErrors={{
                      isExisty: isExistyError,
                      isEmptyString: isExistyError
                    }}
                    disable={stateOptions.length > 0 ? true : false}
                    className={cs({
                      [styles.disabledInput]: stateOptions.length > 0
                    })}
                  />
                </div>
              </div>
            )}
            {isdList?.length ? (
              <div
                className={cs(styles.countryCode, styles.countryCodeProfile)}
              >
                {/* <CountryCode
                  // fetchCountryData={fetchCountryData}
                  handleChange={() => setUpdateProfile()}
                  name="phoneCountryCode"
                  placeholder="Code"
                  label="Country Code"
                  value={data.phoneCountryCode || ""}
                  disable={data?.phoneCountryCode ? true : false}
                  id="isd_code"
                  validations={{
                    isCodeValid: (values, value) => {
                      return !(values.phoneNumber && value == "");
                    },
                    isValidCode: (values, value) => {
                      // this.props
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
                  className={cs({
                    [styles.disabledInput]: data?.phoneCountryCode
                  })}
                /> */}
                <SelectDropdown
                  name="phoneCountryCode"
                  placeholder="Code"
                  label="Country Code"
                  options={getCountryCodeObject()}
                  value={data.phoneCountryCode || ""}
                  disable={data?.phoneCountryCode ? true : false}
                  validations={{
                    isCodeValid: (values, value) => {
                      return !(values.phoneNumber && value == "");
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
                  showLabel={true}
                  optionsClass={styles.isdCode}
                  searchIconClass={styles.countryCodeSearchIcon}
                  searchInputClass={styles.countryCodeSearchInput}
                  inputRef={countryCodeRef}
                  handleChange={onCountryCodeSelect}
                  aquaClass={styles.aquaText}
                  className={styles.countryCodeWrp}
                />

                <FormInput
                  name="phoneNumber"
                  placeholder={"Contact Number"}
                  handleChange={() => setUpdateProfile()}
                  type="number"
                  label={"Contact Number"}
                  disable={data?.phoneNumber ? true : false}
                  className={cs(
                    { [styles.disabledInput]: data?.phoneNumber },
                    styles.contactNum
                  )}
                  value={data?.phoneNumber}
                  // validations={{
                  //   isPhoneValid: (values, value) => {
                  //     return !(value == "");
                  //   }
                  // }}
                  // validationErrors={{
                  //   isPhoneValid: "Please enter your Contact Number"
                  // }}
                  keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                  defaultClass={styles.inputDefault}
                  keyDown={e => (e.which === 69 ? e.preventDefault() : null)}
                  onPaste={e =>
                    e?.clipboardData.getData("Text").match(/([e|E])/)
                      ? e.preventDefault()
                      : null
                  }
                />
              </div>
            ) : null}
            <div>
              <FormInput
                name="panPassportNumber"
                placeholder={"Pan/Passport"}
                label={"Pan/Passport"}
                handleChange={() => setUpdateProfile()}
                disable={data?.panPassportNumber ? true : false}
                className={cs({
                  [styles.disabledInput]: data?.panPassportNumber
                })}
                defaultClass={styles.inputDefault}
              />
            </div>
            {/* {CONFIG.WHATSAPP_SUBSCRIBE_ENABLED && (
              <div style={{'display': 'none'}}>
                <input type="text" name="whatsappSubscribe" value={preferenceData?.whatsappSubscribe} />
              </div>
            )} */}
            <div className={styles.subscribe}>
              <FormCheckbox
                value={data?.subscribe || false}
                name="subscribe"
                disable={false}
                handleChange={() => setUpdateProfile()}
                id="subscribe"
                label={[
                  "I agree to receiving e-mails, newsletters, calls and text messages for service related information. To know more how we keep your data safe, refer to our ",
                  <Link
                    key="terms"
                    to="/customer-assistance/privacy-policy"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                ]}
              />
            </div>
            <div>
              {showerror ? <p className={styles.errorMsg}>{showerror}</p> : ""}
              <Button
                type="submit"
                disabled={!updateProfile}
                label={updateProfile ? "Update Details" : "Updated"}
                variant="mediumMedCharcoalCta366"
              />
            </div>
          </div>
        </Formsy>
      </div>
      {/* <SignedIn loginVia={loginVia} /> */}
    </div>
  );
  return (
    <div className={bootstrapStyles.row}>
      <div className={styles.editBtnWrp} onClick={onEditClick}>
        <button className={styles.editBtn}>EDIT</button>
      </div>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          bootstrapStyles.colMd8,
          bootstrapStyles.offsetMd2
        )}
      >
        <div className={styles.formHeading}>My Profile</div>
        <div className={styles.formSubheading}>
          Manage your personal information.
        </div>
        {formContent}
        <div className={styles.editProfileSection}>
          <p className={styles.editProfileHead}>
            Looking to update your profile?
          </p>
          <button className={styles.editProfileLink} onClick={onEditClick}>
            EDIT PROFILE DETAILS
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
