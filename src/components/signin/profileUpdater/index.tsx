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
import SignedIn from "../../../containers/myAccount/components/SignedIn";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import { ProfileResponse } from "containers/myAccount/components/MyProfile/typings";
import { genderOptions } from "constants/profile";
import FormSelect from "components/Formsy/FormSelect";
import FormCheckbox from "components/Formsy/FormCheckbox";
import { Link } from "react-router-dom";
import { Context } from "components/Modal/context";
import * as valid from "utils/validate";
import { Country } from "components/Formsy/CountryCode/typings";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";

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
    }
  };
};

const mapStateToProps = (state: AppState) => {
  return {
    countryData: state.address.countryData
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
      updateProfile: false,
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
    const {
      subscribe,
      emailId,
      loginVia,
      firstName,
      lastName,
      gender,
      country,
      state
    } = data;
    this.setState({
      loginVia,
      updateProfile: false,
      data: data
    });
    this.ProfileUpdateFormRef.current &&
      this.ProfileUpdateFormRef.current.updateInputsWithValue({
        emailId,
        firstName,
        lastName,
        gender,
        subscribe,
        country,
        state
      });
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
            valid.errorTracking([this.state.showerror], location.href);
          }
        );
      });
    this.props.fetchCountryData();
    this.changeCountryData(this.props.countryData);
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
    const elem = document.getElementById("subscribeemails") as HTMLInputElement;
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

  handleSubmit = (model: any, resetForm: any, updateIwithError: any) => {
    if (!this.state.updateProfile) return false;
    const { firstName, lastName, gender, subscribe, country, state } = model;
    const formData: any = {};
    formData["gender"] = gender || "";
    formData["firstName"] = firstName;
    formData["lastName"] = lastName;
    const countryCode = this.state.countryOptions.filter(
      countryOption => countryOption.value == country
    )[0].code2;
    formData["country"] = countryCode;
    if (countryCode == "IN") {
      formData["state"] = state || "";
    }

    formData["subscribe"] = subscribe;
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
        this.context.closeModal();
        window.scrollTo(0, 0);
      })
      .catch(err => {
        if (err.response.data.error_message) {
          let errorMsg = err.response.data.error_message[0];
          if (errorMsg == "MaxRetries") {
            errorMsg =
              "You have exceeded max attempts, please try after some time.";
          }
          this.setState(
            {
              showerror: errorMsg
            },
            () => {
              valid.errorTracking([this.state.showerror], location.href);
            }
          );
        } else if (err) {
          this.setState(
            {
              showerror: "Something went Wrong"
            },
            () => {
              valid.errorTracking([this.state.showerror], location.href);
            }
          );
        }
      });
  };

  handleInvalidSubmit = () => {
    const elem = document.getElementById("subscribeemails") as HTMLInputElement;
    if (elem.checked == false) {
      this.setState(
        {
          showerror: "Please accept the terms & conditions"
        },
        () => {
          valid.errorTracking([this.state.showerror], location.href);
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
      const errorList = valid.getErrorList(
        globalStyles.errorMsg,
        "profile-updater-form"
      );
      if (errorList && errorList.length) {
        valid.errorTracking(errorList, location.href);
      }
    }, 0);
  };

  render() {
    const { loginVia } = this.state;
    const {
      firstName,
      lastName,
      // subscribe,
      gender
    } = this.state.data;
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
              label={"First Name"}
              keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
              required
              handleChange={() => {
                this.setState({ updateProfile: true });
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
              label={"Last Name"}
              keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
              handleChange={() => {
                this.setState({ updateProfile: true });
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
                this.setState({ updateProfile: true });
              }}
              disable={gender ? true : false}
              className={cs({ [styles.disabledInput]: gender })}
            />
          </div>
          <div>
            <div className="select-group text-left">
              <FormSelect
                required
                label="Country"
                options={this.state.countryOptions}
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
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  value=""
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
          )}
          <div className={styles.subscribe}>
            <FormCheckbox
              value={false}
              id="subscribeemails"
              name="subscribe"
              disable={false}
              handleChange={this.chkTermsandC}
              label={[
                "I agree to the ",
                <Link
                  key="subscribe"
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
              value={true}
              id="subscribe"
              name="subscribe2"
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
              <p className={styles.loginErrMsg}>{this.state.showerror}</p>
            ) : (
              ""
            )}
            <input
              type="submit"
              disabled={!this.state.updateProfile}
              className={
                this.state.updateProfile
                  ? globalStyles.ceriseBtn
                  : cs(globalStyles.disabledBtn, globalStyles.ceriseBtn)
              }
              value={this.state.updateProfile ? "Update Details" : "Updated"}
            />
          </div>
          <SignedIn loginVia={loginVia} />
        </div>
      </Formsy>
    );
    return (
      <Popup disableClose={true}>
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
          subheading="Update your profile details for an enhanced shopping experience."
          formContent={formContent}
        />
        {/* {this.state.disableSelectedbox && <Loader />} */}
      </Popup>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdater);
