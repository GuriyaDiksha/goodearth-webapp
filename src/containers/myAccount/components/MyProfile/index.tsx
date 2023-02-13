import React, { useEffect, useRef, useState } from "react";
import cs from "classnames";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import { ProfileProps, ProfileResponse, State } from "./typings";
import FormInput from "../../../../components/Formsy/FormInput";
import FormSelect from "../../../../components/Formsy/FormSelect";
import CountryCode from "../../../../components/Formsy/CountryCode";
import moment from "moment";
import Formsy from "formsy-react";
import FormCheckbox from "components/Formsy/FormCheckbox";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { genderOptions } from "constants/profile";
import * as valid from "utils/validate";
import { AppState } from "reducers/typings";
import { Country } from "components/Formsy/CountryCode/typings";
import { pageViewGTM } from "utils/validate";
import AccountServices from "services/account";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";

const MyProfile: React.FC<ProfileProps> = ({ setCurrentSection }) => {
  const {
    address: { countryData }
  } = useSelector((state: AppState) => state);
  const [profileState, setProfileState] = useState<State>({
    data: {},
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
  const isdList = countryData.map(list => {
    return list.isdCode;
  });

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
    const formdata = profileState.data;
    // formdata.state = formdata.state;
    if (countryOptions.length > 0 && formdata.country) {
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
        data: formdata,
        isIndia: formdata.country == "India",
        stateOptions: states
      });
      ProfileFormRef.current &&
        ProfileFormRef.current.updateInputsWithValue(formdata);
    }
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
      newsletter,
      updateProfile: false,
      data: data
    });
    changeCountryData(countryData);
    ProfileFormRef.current &&
      ProfileFormRef.current.updateInputsWithValue(formData);
  };

  useEffect(() => {
    setCurrentSection();
    AccountServices.fetchProfileData(dispatch)
      .then(data => {
        setApiResponse(data);
      })
      .catch(err => {
        setProfileState({
          ...profileState,
          showerror: "Something went wrong, please try again"
        });
      });
    LoginService.fetchCountryData(dispatch).then(res => {
      dispatch(updateCountryData(res));
      changeCountryData(res);
      pageViewGTM("MyAccount");
    });
  }, []);

  useEffect(() => {
    changeCountryData(countryData);
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
      const errorList = valid.getErrorList(
        globalStyles.errorMsg,
        "myprofile-form"
      );
      if (errorList && errorList.length) {
        valid.errorTracking(errorList, location.href);
      }
    }, 0);
  };

  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    const { updateProfile, countryOptions } = profileState;
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
    formData["firstName"] = firstName || "";
    formData["lastName"] = lastName || "";
    if (phoneCountryCode && phoneNumber) {
      formData["phoneCountryCode"] = phoneCountryCode;
      formData["phoneNumber"] = phoneNumber;
    }
    formData["gender"] = gender || "";
    formData["panPassportNumber"] = panPassportNumber || "";
    formData["dateOfBirth"] = dateOfBirth
      ? moment(dateOfBirth).format("YYYY-MM-DD")
      : null;
    formData["subscribe"] = subscribe;
    const countryCode = countryOptions.filter(
      countryOption => countryOption?.value == country
    )[0]?.code2;
    formData["country"] = countryCode;
    if (countryCode == "IN") {
      formData["state"] = state || "";
    }

    setProfileState({
      ...profileState,
      showerror: ""
    });
    AccountServices.updateProfileData(dispatch, formData)
      .then(data => {
        setApiResponse(data);
        setProfileState({
          ...profileState,
          updateProfile: false
        });
      })
      .catch(error => {
        const errdata = valid.decriptdata(error.response?.data);
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
                  [data]: data[data][0]
                },
                true
              );
              break;
            case "error_message": {
              let errorMsg = data[data][0];
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

  const setUpdateProfile = () => {
    if (!profileState.updateProfile) {
      setProfileState({ ...profileState, updateProfile: true });
    }
  };

  const onCountrySelect = (
    event: React.ChangeEvent<HTMLSelectElement> | null,
    defaultCountry?: string
  ) => {
    const { countryOptions } = profileState;
    if (countryOptions.length > 0) {
      const form = ProfileFormRef.current;
      let selectedCountry = "";
      if (event) {
        selectedCountry = event.currentTarget.value;
        // setIsAddressChanged(true);
        // setIsCountryChanged(true);
        form &&
          form.updateInputsWithValue(
            {
              state: ""
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

      if (form) {
        // reset state
        const { state } = form.getModel();
        if (state) {
          form.updateInputsWithValue({
            state: ""
          });
        }
        form.updateInputsWithValue({
          code: isd
        });
      }
      setProfileState({
        ...profileState,
        isIndia: value == "India",
        stateOptions: states
      });
    }
  };

  const {
    countryOptions,
    data,
    minDate,
    maxDate,
    isIndia,
    stateOptions,
    showerror,
    updateProfile
  } = profileState;
  const isExistyError = "This field is required";
  const {
    firstName,
    lastName,
    phoneCountryCode,
    phoneNumber,
    gender,
    panPassportNumber,
    dateOfBirth,
    subscribe
  } = data;

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
                disable={firstName ? true : false}
                className={cs({ [styles.disabledInput]: firstName })}
              />
            </div>
            <div>
              <FormInput
                name="lastName"
                placeholder={"Last Name"}
                label={"Last Name"}
                keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
                handleChange={() => setUpdateProfile()}
                disable={lastName ? true : false}
                className={cs({ [styles.disabledInput]: lastName })}
              />
            </div>
            <div className={styles.userGenderPicker}>
              <FormSelect
                name="gender"
                required
                options={genderOptions}
                value={gender || undefined}
                label="Select Gender"
                placeholder="Select Gender"
                handleChange={() => setUpdateProfile()}
                disable={gender ? true : false}
                className={cs({ [styles.disabledInput]: gender })}
              />
            </div>
            <div className={styles.calendarIconContainer}>
              <FormInput
                name="dateOfBirth"
                type="date"
                handleChange={() => setUpdateProfile()}
                value={dateOfBirth}
                disable={dateOfBirth ? true : false}
                className={cs({ [styles.disabledInput]: dateOfBirth })}
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
                    if (value && !dateOfBirth) {
                      return moment(value).isValid();
                    } else return true;
                  },
                  isMinAllowedDate: (values, value) => {
                    if (value && !dateOfBirth) {
                      return (
                        new Date(value).getTime() > new Date(minDate).getTime()
                      );
                    } else return true;
                  },
                  isMaxAllowedDate: (values, value) => {
                    if (value && !dateOfBirth) {
                      return (
                        new Date(value).getTime() < new Date(maxDate).getTime()
                      );
                    } else return true;
                  }
                }}
                validationErrors={{
                  isValidDate: "Please enter valid date of birth",
                  isMinAllowedDate: "Please enter valid date of birth",
                  isMaxAllowedDate: "Age should be at least 15 years"
                }}
              />
            </div>
            <div>
              <div className="select-group text-left">
                <FormSelect
                  required
                  label="Country"
                  value={data.country}
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
                <span className="arrow"></span>
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
                    value={data.state}
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
            <div className={cs(styles.countryCode, styles.countryCodeProfile)}>
              <CountryCode
                // fetchCountryData={fetchCountryData}
                handleChange={() => setUpdateProfile()}
                name="phoneCountryCode"
                placeholder="Code"
                label="Country Code"
                value=""
                disable={phoneCountryCode ? true : false}
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
              />

              <FormInput
                name="phoneNumber"
                placeholder={"Contact Number"}
                handleChange={() => setUpdateProfile()}
                type="number"
                label={"Contact Number"}
                disable={phoneNumber ? true : false}
                className={cs({ [styles.disabledInput]: phoneNumber })}
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
            <div>
              <FormInput
                name="panPassportNumber"
                placeholder={"Pan/Passport"}
                label={"Pan/Passport"}
                handleChange={() => setUpdateProfile()}
                disable={panPassportNumber ? true : false}
                className={cs({ [styles.disabledInput]: panPassportNumber })}
                defaultClass={styles.inputDefault}
              />
            </div>
            <div className={styles.subscribe}>
              <FormCheckbox
                value={subscribe || false}
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
              <input
                type="submit"
                formNoValidate
                disabled={!updateProfile}
                className={
                  updateProfile ? styles.updateDetails : styles.updated
                }
                value={updateProfile ? "Update Details" : "Updated"}
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
          Manage your personal information and edit your email settings.
        </div>
        {formContent}
      </div>
    </div>
  );
};

export default MyProfile;
