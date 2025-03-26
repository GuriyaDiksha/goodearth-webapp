import React, { RefObject } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import AccountService from "services/account";
import { AppState } from "reducers/typings";
import cs from "classnames";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import Popup from "../popup/Popup";
import FormContainer from "../formContainer";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import { ProfileResponse } from "containers/myAccount/components/MyProfile/typings";
import { genderOptions } from "constants/profile";
import FormSelect from "components/Formsy/FormSelect";
import FormCheckbox from "components/Formsy/FormCheckbox";
import { Link } from "react-router-dom";
import { Context } from "components/Modal/context";
import { getErrorList, decriptdata, errorTracking } from "utils/validate";
import { Country } from "components/Formsy/CountryCode/typings";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";
import Button from "components/Button";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import ModalStyles from "components/Modal/styles.scss";
import SelectDropdown from "components/Formsy/SelectDropdown";
import CookieService from "services/cookie";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchProfileData: () => {
      return AccountService.fetchProfileData(dispatch);
    },
    updateProfileData: (formData: FormData) => {
      return AccountService.updateProfileData(dispatch, formData);
    },
    fetchCountryData: async () => {
      const countryData = await LoginService.fetchCountryData(dispatch);
      dispatch(updateCountryData(countryData));
    },
    openSharePopup: (mobile: boolean) => {
      dispatch(
        updateComponent(
          POPUP.SHAREWISHLIST,
          {
            // shareUrl: "https://www.goodearth.in/sssss"
            // bridalDetails={bridalDetails}
          },
          mobile ? false : true,
          mobile ? ModalStyles.bottomAlignSlideUp : "",
          mobile ? "slide-up-bottom-align" : ""
        )
      );
      dispatch(updateModal(true));
    }
  };
};

const mapStateToProps = (state: AppState) => {
  return {
    countryData: state.address.countryData,
    mobile: state.device.mobile
  };
};

type Props = {} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

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

type State = {
  data: Partial<ProfileResponse>;
  updateProfile: boolean;
  subscribe: boolean;
  showerror: string;
  loginVia: string;
  countryOptions: CountryOptions[];
  stateOptions: StateOptions[];
  isIndia: boolean;
};

class ProfileUpdater extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: {},
      updateProfile: true,
      subscribe: false,
      showerror: "",
      loginVia: "email",
      countryOptions: [],
      stateOptions: [],
      isIndia: false
    };
  }
  ProfileUpdateFormRef: RefObject<Formsy> = React.createRef();
  static contextType = Context;
  setApiResponse = (data: ProfileResponse) => {
    const { loginVia } = data;
    this.setState(
      {
        loginVia,
        // updateProfile: false,
        data: data
      },
      () => {
        this.changeCountryData(this.props.countryData);
      }
    );
  };

  componentDidMount() {
    this.props
      .fetchProfileData()
      .then(data => {
        this.setApiResponse(data);
      })
      .catch(err => {
        this.setState(
          {
            showerror: "Something went wrong, please try again"
          },
          () => {
            errorTracking([this.state.showerror], location.href);
          }
        );
      });
    this.props.fetchCountryData();
    this.changeCountryData(this.props.countryData);

    document.body.classList.add(globalStyles.noScroll);
  }

  componentWillUnmount(): void {
    document.body.classList.remove(globalStyles.noScroll);
  }

  onCountrySelect = (
    event: React.ChangeEvent<HTMLSelectElement> | null,
    defaultCountry?: string
  ) => {
    const { countryOptions } = this.state;
    if (countryOptions.length > 0) {
      const form = this.ProfileUpdateFormRef.current;
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

      const { states, value } = countryOptions.filter(
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
        // form.updateInputsWithValue({
        //   code: isd
        // });
      }
      this.setState({
        isIndia: value == "India",
        stateOptions: states,
        updateProfile: true
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
          this.ProfileUpdateFormRef.current &&
            this.ProfileUpdateFormRef.current.updateInputsWithValue(formdata);
        }
      );
    } else {
      this.ProfileUpdateFormRef.current &&
        this.ProfileUpdateFormRef.current.updateInputsWithValue(formdata);
    }
    this.setState({
      countryOptions
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.countryData.length != this.props.countryData.length) {
      this.changeCountryData(nextProps.countryData);
    }
  }

  chkTermsandC = (event: React.ChangeEvent): void => {
    const elem = document.getElementById("tnc") as HTMLInputElement;
    if (elem.checked == false) {
      this.setState({
        showerror: "Please accept the terms & conditions"
      });
    } else {
      this.setState({
        showerror: ""
      });
    }
  };

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    if (!this.state.updateProfile) return false;
    const {
      firstName,
      lastName,
      gender,
      subscribe,
      country,
      state,
      phoneCountryCode,
      phoneNumber
    } = model;
    const formData: any = {};
    // formData["gender"] = gender || "";
    // formData["firstName"] = firstName;
    // formData["lastName"] = lastName;
    const countryCode = this.state.countryOptions.filter(
      countryOption => countryOption.value == country
    )[0].code2;
    formData["country"] = this.state.data.country ? "" : countryCode;
    // formData["country"] = countryCode;
    if (countryCode == "IN") {
      // formData["state"] = state || "";
      formData["state"] = this.state.data.state ? "" : state || "";
    }

    if (phoneCountryCode && phoneNumber) {
      // formData["phoneNumber"] = phoneNumber;
      // formData["phoneCountryCode"] = phoneCountryCode;
      formData["phoneNumber"] = this.state.data.phoneNumber ? "" : phoneNumber;
      formData["phoneCountryCode"] = this.state.data.phoneCountryCode
        ? ""
        : phoneCountryCode;
    }

    formData["subscribe"] = subscribe;
    this.setState({
      showerror: ""
    });
    // Check if fields are disabled before adding them to formData
    // For firstName and lastName, check if they're already set (which means disabled)
    formData["firstName"] = this.state.data.firstName ? "" : firstName;
    formData["lastName"] = this.state.data.lastName ? "" : lastName;
    formData["gender"] = this.state.data.gender ? "" : gender || "";
    this.props
      .updateProfileData(formData)
      .then(data => {
        const isShareLinkClicked = JSON.parse(
          localStorage.getItem("isShareLinkClicked") || "false"
        );
        this.setApiResponse(data);
        this.setState({
          updateProfile: false
        });
        this.context.closeModal();
        //Code to open share link popup after profile update
        if (isShareLinkClicked) {
          this.props.openSharePopup(this.props.mobile);
          localStorage.removeItem("isShareLinkClicked");
        }
        window.scrollTo(0, 0);
        this.setUpdateProfilePhoneNo();
      })
      .catch(error => {
        const data = error.response?.data;
        if (data.error_message) {
          let errorMsg = data.error_message[0];
          if (errorMsg == "MaxRetries") {
            errorMsg =
              "You have exceeded max attempts, please try after some time.";
          }
          this.setState(
            {
              showerror: errorMsg
            },
            () => {
              errorTracking([this.state.showerror], location.href);
            }
          );
        }
        // else if (error) {
        //   this.setState(
        //     {
        //       showerror: "Something went Wrong"
        //     },
        //     () => {
        //       errorTracking([this.state.showerror], location.href);
        //     }
        //   );
        // }
        Object.keys(data).map(key => {
          switch (key) {
            case "firstName":
            case "lastName":
            case "gender":
              updateInputsWithError(
                {
                  [key]: data[key][0]
                },
                true
              );
              break;
            case "phoneNumber":
              updateInputsWithError(
                {
                  [key]: data[key][0]
                },
                true
              );
              break;
            case "email":
              if (data[key].length == 2) {
                this.setState({
                  showerror:
                    "This account already exists <a class='error' href=" +
                    data[key][0] +
                    "> please set a new password</a>"
                });
              } else {
                this.setState({
                  showerror: ""
                });
                updateInputsWithError(
                  {
                    [key]: data[key][0]
                  },
                  true
                );
              }
              break;
            default:
              if (typeof data == "object") {
                let errorMsg: string = data[key][0];
                if (errorMsg == "MaxRetries") {
                  errorMsg =
                    "You have exceeded max registration attempts, please try after some time";
                }
                this.setState({
                  showerror: errorMsg
                });
              }
          }
        });
      });
  };

  handleInvalidSubmit = () => {
    const elem = document.getElementById("tnc") as HTMLInputElement;
    if (elem.checked == false) {
      this.setState(
        {
          showerror: "Please accept the terms & conditions"
        },
        () => {
          errorTracking([this.state.showerror], location.href);
        }
      );
    }
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = getErrorList(
        globalStyles.errorMsg,
        "profile-updater-form"
      );
      if (errorList && errorList.length) {
        errorTracking(errorList, location.href);
      }
    }, 0);
  };

  // ******* code for country code *******
  countryCodeRef: RefObject<HTMLInputElement> = React.createRef();
  getCountryCodeObject = () => {
    const { countryOptions } = this.state;
    const arr: any[] = [];
    countryOptions.map(({ label, isd }: any) => {
      arr.push({ label: `${label}(${isd})`, value: isd });
    });
    return arr;
  };

  onCountryCodeSelect = (option: any) => {
    const form = this.ProfileUpdateFormRef.current;
    const selectedCountryCode = option?.value;

    form &&
      form.updateInputsWithValue({
        phoneCountryCode: selectedCountryCode
      });
  };

  setUpdateProfilePhoneNo = () => {
    const userId = CookieService.getCookie("userId");
    if (typeof document != "undefined" && typeof window != "undefined") {
      CookieService.setCookie(`upp_${userId}`, "0123456789", 365);
      console.log("set upp cokkie.....");
    }
  };

  render() {
    const {
      emailId,
      firstName,
      lastName,
      subscribe,
      gender,
      country,
      state,
      phoneCountryCode,
      phoneNumber
    } = this.state.data;

    // const form = this.ProfileUpdateFormRef.current;
    // let isd = "";
    // this.state.countryOptions.filter((countryOption: any) => {
    //   if (countryOption.value == this.state.data.country) {
    //     return (isd = countryOption.isd);
    //   }
    // })[0];
    // form &&
    //   form.updateInputsWithValue({
    //     phoneCountryCode: isd
    //   });

    const isExistyError = "This field is required";
    const formContent = (
      <Formsy
        ref={this.ProfileUpdateFormRef}
        onValidSubmit={this.handleSubmit}
        onInvalidSubmit={this.handleInvalidSubmit}
      >
        <div className={styles.categorylabel} id="profile-updater-form">
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
              label={"First Name *"}
              keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
              required
              handleChange={() => {
                // this.setState({ updateProfile: true });
              }}
              disable={firstName ? true : false}
              className={cs({ [styles.disabledInput]: firstName })}
            />
          </div>
          <div>
            <FormInput
              name="lastName"
              required
              placeholder={"Last Name"}
              label={"Last Name *"}
              keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
              handleChange={() => {
                // this.setState({ updateProfile: true });
              }}
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
              label="Select Gender*"
              placeholder="Select Gender*"
              handleChange={() => {
                // this.setState({ updateProfile: true });
              }}
              disable={gender ? true : false}
              className={cs({ [styles.disabledInput]: gender })}
            />
          </div>
          <div>
            <div className="select-group text-left">
              <FormSelect
                required
                label="Country*"
                options={this.state.countryOptions}
                handleChange={this.onCountrySelect}
                placeholder="Select Country*"
                name="country"
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: "Please select your Country",
                  isEmptyString: isExistyError
                }}
                disable={country ? true : false}
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
                  label="State*"
                  placeholder="Select State*"
                  options={this.state.stateOptions}
                  handleChange={() => {
                    // this.setState({ updateProfile: true });
                  }}
                  value=""
                  validations={{
                    isExisty: true
                  }}
                  validationErrors={{
                    isExisty: isExistyError,
                    isEmptyString: isExistyError
                  }}
                  disable={state ? true : false}
                />
              </div>
            </div>
          )}
          <div className={styles.countryCode}>
            <SelectDropdown
              name="phoneCountryCode"
              // required
              placeholder="Code"
              label="Country Code"
              value={phoneCountryCode || undefined}
              disable={phoneCountryCode ? true : false}
              validations={{
                isCodeValid: (values, value) => {
                  return !(values.phoneNumber && value == "");
                }
              }}
              validationErrors={{
                isCodeValid: "Required"
              }}
              allowFilter={true}
              showLabel={true}
              optionsClass={styles.isdCode}
              aquaClass={styles.aquaText}
              searchIconClass={styles.countryCodeSearchIcon}
              searchInputClass={styles.countryCodeSearchInput}
              className={cs(styles.countryCodeWrp, {
                [styles.disabledInput]: phoneCountryCode
              })}
              inputRef={this.countryCodeRef}
              handleChange={this.onCountryCodeSelect}
              options={this.getCountryCodeObject()}
            />
            <FormInput
              name="phoneNumber"
              // required
              value={phoneNumber || undefined}
              placeholder={"Contact Number"}
              label={"Contact Number"}
              type="number"
              validations={{
                isExisty: true
                // compulsory: (values, value) => {
                //   if (values?.whatsappSubscribe && value == "") {
                //     return false;
                //   } else {
                //     return true;
                //   }
                // }
              }}
              validationErrors={{
                isExisty: "Please enter a valid Contact Number"
                // compulsory: "Please enter your Contact Number"
              }}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              keyDown={e => (e.which === 69 ? e.preventDefault() : null)}
              onPaste={e =>
                e?.clipboardData.getData("Text").match(/([e|E])/)
                  ? e.preventDefault()
                  : null
              }
              showLabel={true}
              disable={phoneNumber ? true : false}
              className={cs(styles.contactNum, {
                [styles.disabledInput]: phoneNumber
              })}
            />
          </div>
          <div className={styles.subscribe}>
            <FormCheckbox
              value={false}
              id="tnc"
              name="tnc"
              disable={false}
              handleChange={this.chkTermsandC}
              label={[
                "I agree to the ",
                <Link
                  key="tnc"
                  to="/customer-assistance/terms-conditions"
                  target="_blank"
                >
                  Terms and Conditions
                </Link>,
                "*"
              ]}
              validations="isTrue"
              required
            />
          </div>
          <div className={styles.subscribe}>
            <FormCheckbox
              value={subscribe || false}
              id="subscribe"
              name="subscribe"
              disable={false}
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
              <p className={cs(styles.errorMsg, globalStyles.textLeft)}>
                {this.state.showerror}
              </p>
            ) : (
              ""
            )}
            <Button
              type="submit"
              disabled={!this.state.updateProfile}
              className={globalStyles.btnFullWidth}
              label={this.state.updateProfile ? "Update Details" : "Updated"}
              variant="largeAquaCta"
            />
          </div>
          {/* <SignedIn loginVia={loginVia} /> */}
        </div>
      </Formsy>
    );
    return (
      <Popup
        disableClose={
          emailId && firstName && lastName && gender && country && !phoneNumber
            ? false
            : true
        }
        setUpdateProfilePhoneNo={this.setUpdateProfilePhoneNo}
      >
        {/* {this.state.successMsg ? (
          <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
            <div className={globalStyles.successMsg}>
              {this.state.successMsg}
            </div>
          </div>
        ) : (
          ""
        )} */}
        <FormContainer
          heading="Update Profile"
          subheading="Just a few more details! Update your profile for a personalised experience."
          formContent={formContent}
        />
        {/* {this.state.disableSelectedbox && <Loader />} */}
      </Popup>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdater);
