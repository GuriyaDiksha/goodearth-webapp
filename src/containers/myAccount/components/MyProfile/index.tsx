import React, { RefObject } from "react";
import cs from "classnames";

import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";

import { ProfileProps, State, ProfileResponse } from "./typings";
import FormInput from "../../../../components/Formsy/FormInput";
import FormSelect from "../../../../components/Formsy/FormSelect";
import CountryCode from "../../../../components/Formsy/CountryCode";

import moment from "moment";
import Formsy from "formsy-react";
import FormCheckbox from "components/Formsy/FormCheckbox";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import mapDispatchToProps from "./mapper/actions";
import { genderOptions } from "constants/profile";
import * as valid from "utils/validate";
import { AppState } from "reducers/typings";
import { Country } from "components/Formsy/CountryCode/typings";

const mapStateToProps = (state: AppState) => {
  const isdList = state.address.countryData.map(list => {
    return list.isdCode;
  });

  return {
    isdList: isdList,
    countryData: state.address.countryData
  };
};

type Props = ProfileProps &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;
class MyProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
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
    };
    props.setCurrentSection();
  }
  ProfileFormRef: RefObject<Formsy> = React.createRef();

  componentDidMount() {
    this.props
      .fetchProfileData()
      .then(data => {
        this.setApiResponse(data);
      })
      .catch(err => {
        this.setState({
          showerror: "Something went wrong, please try again"
        });
      });
    this.props.fetchCountryData();
    this.changeCountryData(this.props.countryData);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.countryData.length != this.props.countryData.length) {
      this.changeCountryData(nextProps.countryData);
    }
  }

  setApiResponse = (data: ProfileResponse) => {
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
    this.setState(
      {
        user,
        uniqueId,
        abandonedCartNotification,
        newsletter,
        updateProfile: false,
        data: data
      },
      () => {
        this.changeCountryData(this.props.countryData);
        this.ProfileFormRef.current &&
          this.ProfileFormRef.current.updateInputsWithValue(formData);
      }
    );
  };

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    if (!this.state.updateProfile) return false;
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
    const countryCode = this.state.countryOptions.filter(
      countryOption => countryOption.value == country
    )[0].code2;
    formData["country"] = countryCode;
    if (countryCode == "IN") {
      formData["state"] = state || "";
    }

    this.setState({
      showerror: ""
    });
    this.props
      .updateProfileData(formData)
      .then(data => {
        this.setApiResponse(data);
        this.setState({
          updateProfile: false
        });
      })
      .catch(err => {
        this.setState(
          {
            // disableButton: false
          },
          () => {
            this.handleInvalidSubmit();
          }
        );
        Object.keys(err.response.data).map(data => {
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
                  [data]: err.response.data[data][0]
                },
                true
              );
              break;
            case "error_message": {
              let errorMsg = err.response.data[data][0];
              if (errorMsg == "MaxRetries") {
                errorMsg =
                  "You have exceeded max attempts, please try after some time.";
              }
              this.setState({
                showerror: errorMsg
              });
              break;
            }
          }
        });
      });
  };

  handleInvalidSubmit = () => {
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

  setUpdateProfile = () => {
    if (!this.state.updateProfile) {
      this.setState({ updateProfile: true });
    }
  };

  onCountrySelect = (
    event: React.ChangeEvent<HTMLSelectElement> | null,
    defaultCountry?: string
  ) => {
    const { countryOptions } = this.state;
    if (countryOptions.length > 0) {
      const form = this.ProfileFormRef.current;
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
      this.setState({
        isIndia: value == "India",
        stateOptions: states
      });
    }
  };

  changeCountryData = (countryData: Country[]) => {
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
    const formdata = this.state.data;
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

      this.setState(
        {
          countryOptions: countryOptions,
          data: formdata,
          isIndia: formdata.country == "India",
          stateOptions: states
        },
        () => {
          this.ProfileFormRef.current &&
            this.ProfileFormRef.current.updateInputsWithValue(formdata);
        }
      );
    }
  };

  render() {
    const { countryOptions } = this.state;
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
    } = this.state.data;
    const formContent = (
      <div className={cs(styles.loginForm, globalStyles.voffset4)}>
        <div>
          <Formsy
            ref={this.ProfileFormRef}
            onValidSubmit={this.handleSubmit}
            onInvalidSubmit={this.handleInvalidSubmit}
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
                  handleChange={() => this.setUpdateProfile()}
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
                  handleChange={() => this.setUpdateProfile()}
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
                  handleChange={() => this.setUpdateProfile()}
                  disable={gender ? true : false}
                  className={cs({ [styles.disabledInput]: gender })}
                />
              </div>
              <div className={styles.calendarIconContainer}>
                <FormInput
                  name="dateOfBirth"
                  type="date"
                  handleChange={() => this.setUpdateProfile()}
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
                          new Date(value).getTime() >
                          new Date(this.state.minDate).getTime()
                        );
                      } else return true;
                    },
                    isMaxAllowedDate: (values, value) => {
                      if (value && !dateOfBirth) {
                        return (
                          new Date(value).getTime() <
                          new Date(this.state.maxDate).getTime()
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
                    options={countryOptions}
                    handleChange={this.onCountrySelect}
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
              {this.state.isIndia && (
                <div>
                  <div className="select-group text-left">
                    <FormSelect
                      required
                      name="state"
                      label="State"
                      placeholder="Select State"
                      options={this.state.stateOptions}
                      value=""
                      validations={{
                        isExisty: true
                      }}
                      validationErrors={{
                        isExisty: isExistyError,
                        isEmptyString: isExistyError
                      }}
                      disable={
                        this.state.stateOptions.length > 0 ? true : false
                      }
                      className={cs({
                        [styles.disabledInput]:
                          this.state.stateOptions.length > 0
                      })}
                    />
                  </div>
                </div>
              )}
              <div
                className={cs(styles.countryCode, styles.countryCodeProfile)}
              >
                <CountryCode
                  // fetchCountryData={fetchCountryData}
                  handleChange={() => this.setUpdateProfile()}
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
                      if (value && this.props.isdList.length > 0) {
                        return (
                          this.props.isdList.indexOf(value ? value : "") > -1
                        );
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
                  handleChange={() => this.setUpdateProfile()}
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
                />
              </div>
              <div>
                <FormInput
                  name="panPassportNumber"
                  placeholder={"Pan/Passport"}
                  label={"Pan/Passport"}
                  handleChange={() => this.setUpdateProfile()}
                  disable={panPassportNumber ? true : false}
                  className={cs({ [styles.disabledInput]: panPassportNumber })}
                />
              </div>
              <div className={styles.subscribe}>
                <FormCheckbox
                  value={subscribe || false}
                  name="subscribe"
                  disable={false}
                  handleChange={() => this.setUpdateProfile()}
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
                {this.state.showerror ? (
                  <p className={globalStyles.errorMsg}>
                    {this.state.showerror}
                  </p>
                ) : (
                  ""
                )}
                <input
                  type="submit"
                  formNoValidate
                  disabled={!this.state.updateProfile}
                  className={
                    this.state.updateProfile
                      ? globalStyles.ceriseBtn
                      : cs(globalStyles.disabledBtn, globalStyles.ceriseBtn)
                  }
                  value={
                    this.state.updateProfile ? "Update Details" : "Updated"
                  }
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
