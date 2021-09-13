import React, { RefObject, Fragment } from "react";
import cs from "classnames";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import show from "../../../images/show.svg";
import hide from "../../../images/hide.svg";
import { Context } from "components/Modal/context";
import moment from "moment";
import Formsy from "formsy-react";
import FormInput from "../../Formsy/FormInput";
import FormSelect from "../../Formsy/FormSelect";
import FormCheckbox from "../../Formsy/FormCheckbox";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import CountryCode from "../../Formsy/CountryCode";
import { registerState } from "./typings";
import mapDispatchToProps from "./mapper/actions";
import { connect } from "react-redux";
import { checkMail } from "utils/validate";
import { AppState } from "reducers/typings";
import SocialLogin from "../socialLogin";
import { RegisterProps } from "./typings";
import { genderOptions } from "constants/profile";
import * as valid from "utils/validate";
import EmailVerification from "../EmailVerification";
const mapStateToProps = (state: AppState) => {
  const isdList = state.address.countryData.map(list => {
    return list.isdCode;
  });
  return {
    location: state.router.location,
    basket: state.basket,
    currency: state.currency,
    countryData: isdList
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RegisterProps &
  RouteComponentProps;

class CheckoutRegisterForm extends React.Component<Props, registerState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disableButton: false,
      msgt: "",
      url: props.location.pathname + props.location.search,
      showerror: "",
      showFields: true,
      successMsg: "",
      showPassword: false,
      minDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 110)
      ).format("YYYY-MM-DD"),
      maxDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 15)
      ).format("YYYY-MM-DD"),
      showDOBLabel: false,
      passValidLength: false,
      passValidUpper: false,
      passValidLower: false,
      passValidNum: false,
      showPassRules: false,
      shouldValidatePass: false,
      showEmailVerification: false,
      email: ""
    };
  }
  static contextType = Context;
  emailRef: RefObject<typeof FormInput> = React.createRef();
  RegisterFormRef: RefObject<Formsy> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  subscribeRef: RefObject<HTMLInputElement> = React.createRef();
  firstNameInput: RefObject<HTMLInputElement> = React.createRef();
  lastNameInput: RefObject<HTMLInputElement> = React.createRef();

  componentDidMount() {
    const email = localStorage.getItem("tempEmail");
    if (email && this.emailInput.current) {
      this.RegisterFormRef.current &&
        this.RegisterFormRef.current.updateInputsWithValue({ email: email });
      this.firstNameInput.current?.focus();
      // this.emailInput.current.value = email;
    }
    localStorage.removeItem("tempEmail");
    this.emailInput.current && this.emailInput.current.focus();
    this.props.fetchCountryData();
  }
  gtmPushRegister = () => {
    dataLayer.push({
      event: "eventsToSend",
      eventAction: "signup",
      eventCategory: "formSubmission",
      eventLabel: location.pathname
    });
  };

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const {
      email,
      password1,
      password2,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      code,
      terms
    } = model;
    const formData: any = {};
    formData["username"] = email;
    formData["email"] = email;
    formData["password1"] = password1;
    formData["password2"] = password2;
    formData["firstName"] = firstName;
    formData["lastName"] = lastName;
    formData["gender"] = gender;
    formData["dateOfBirth"] = dateOfBirth
      ? moment(dateOfBirth).format("YYYY-MM-DD")
      : null;
    if (code && phone) {
      formData["phoneNo"] = phone;
      formData["phoneCountryCode"] = code;
    }
    formData["subscribe"] = terms;
    formData["redirectTo"] =
      this.props.history.location.pathname +
        this.props.history.location.search || "/";
    this.setState({
      disableButton: true
    });
    this.props
      .register(formData, "checkout")
      .then(data => {
        this.gtmPushRegister();
        this.props.nextStep?.();
        this.setState({
          showEmailVerification: true,
          email
        });
      })
      .catch(err => {
        this.setState(
          {
            disableButton: false
          },
          () => {
            this.handleInvalidSubmit();
          }
        );
        Object.keys(err.response.data).map(data => {
          switch (data) {
            case "firstName":
            case "lastName":
            case "password1":
            case "password2":
            case "gender":
            case "dateOfBirth":
              updateInputsWithError(
                {
                  [data]: err.response.data[data][0]
                },
                true
              );
              break;
            case "phoneNo":
              updateInputsWithError(
                {
                  phone: err.response.data[data][0]
                },
                true
              );
              break;
            case "email":
              if (err.response.data[data].length == 2) {
                this.setState({
                  showerror:
                    "This account already exists <a class='error' href=" +
                    err.response.data[data][0] +
                    "> please set a new password</a>"
                });
              } else {
                this.setState({
                  showerror: ""
                });
                updateInputsWithError(
                  {
                    email: err.response.data[data][0]
                  },
                  true
                );
              }
              break;
            default:
              if (typeof err.response.data == "object") {
                let errorMsg = err.response.data[data][0];
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
    const elem = this.subscribeRef.current;
    if (elem && elem.checked == false) {
      this.setState({
        msgt: "Please accept the terms & conditions"
      });
    } else {
      this.setState({
        msgt: ""
      });
    }
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      } else if (elem && elem.checked == false) {
        elem.focus();
        elem.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = valid.getErrorList(
        globalStyles.errorMsg,
        "checkout-register-form"
      );
      if (errorList && errorList.length) {
        valid.errorTracking(errorList, location.href);
      }
    }, 0);
  };

  handleResetPassword = (event: React.MouseEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      "email",
      (this.RegisterFormRef.current &&
        this.RegisterFormRef.current.getModel().email) ||
        ""
    );
    formData.append(
      "redirectTo",
      this.props.history.location.pathname +
        this.props.history.location.search || "/"
    );

    this.props
      .resetPassword(formData)
      .then(data => {
        this.setState({
          successMsg: data.success
        });
      })
      .catch(err => {
        if (err.response.data.email) {
          this.RegisterFormRef.current &&
            this.RegisterFormRef.current.updateInputsWithError(
              {
                email: err.response.data.email[0]
              },
              true
            );
          valid.errorTracking(err.response.data.email[0], location.href);
        } else if (err.response.data.error_message) {
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
              valid.errorTracking(
                [this.state.showerror as string],
                location.href
              );
            }
          );
        }
      });
  };

  checkMailValidation = async (): Promise<boolean> => {
    let isValid = false;
    const data = await this.props
      .checkUserPassword(
        (this.RegisterFormRef.current &&
          this.RegisterFormRef.current.getModel().email) ||
          ""
      )
      .catch(err => {
        console.log("err: " + err);
        isValid = false;
      });
    if (data && data.emailExist) {
      if (data && data.passwordExist) {
        const error = [
          <span key="email-error">
            This account already exists. Please{" "}
            <span
              className={globalStyles.linkTextUnderline}
              onClick={e =>
                this.props.goLogin(
                  e,
                  (this.emailInput.current && this.emailInput.current.value) ||
                    ""
                )
              }
            >
              Sign In
            </span>
          </span>
        ];
        this.setState({ showFields: false });
        this.RegisterFormRef.current &&
          this.RegisterFormRef.current.updateInputsWithError(
            {
              email: error
            },
            true
          );
        isValid = false;
      } else {
        const error = [
          <span key="email-error2">
            This account already exists. Please{" "}
            <span
              className={globalStyles.linkTextUnderline}
              onClick={this.handleResetPassword}
            >
              set a new password
            </span>
          </span>
        ];
        this.RegisterFormRef.current &&
          this.RegisterFormRef.current.updateInputsWithError(
            {
              email: error
            },
            true
          );
        this.setState({ showFields: false });
        isValid = false;
      }
    } else {
      this.setState({ showFields: true });
      this.firstNameInput.current && this.firstNameInput.current.focus();
      isValid = true;
    }
    return isValid;
  };

  chkTermsandC = (event: React.ChangeEvent) => {
    const elem = this.subscribeRef.current;
    if (elem && elem.checked == false) {
      this.setState({
        msgt: "Please accept the terms & conditions"
      });
    } else {
      this.setState({
        msgt: ""
      });
    }
  };

  resetSection = () => {
    this.setState({
      showFields: false
    });
  };

  verifyEmail = () => {
    const { email } =
      this.RegisterFormRef.current && this.RegisterFormRef.current.getModel();
    email &&
      checkMail(email) &&
      this.checkMailValidation().then((isValid: boolean) => {
        if (!isValid) {
          this.resetSection();
        }
      });
  };
  onMailChange = (event: React.KeyboardEvent) => {
    if (event.key == "Enter") {
      this.verifyEmail();
    } else {
      this.resetSection();
    }
  };

  changeEmail = (event: any) => {
    this.props.changeEmail?.();
  };

  handleFirstNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      e.preventDefault();
      this.lastNameInput.current && this.lastNameInput.current.focus();
    }
  };

  togglePassword = () => {
    this.setState(prevState => {
      return {
        showPassword: !prevState.showPassword
      };
    });
  };

  render() {
    const showFieldsClass = this.state.showFields ? "" : styles.disabledInput;
    // const { goLogin } = this.props;

    const formContent = (
      <Formsy
        ref={this.RegisterFormRef}
        onValidSubmit={this.handleSubmit}
        onInvalidSubmit={this.handleInvalidSubmit}
      >
        <div className={styles.categorylabel} id="checkout-register-form">
          <div>
            <FormInput
              name="email"
              blur={this.verifyEmail}
              placeholder={"Email*"}
              label={"Email*"}
              keyUp={this.onMailChange}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              inputRef={this.emailInput}
              disable={true}
              validations={{
                isEmail: true,
                maxLength: 75
              }}
              validationErrors={{
                isEmail: "Please enter a valid Email ID",
                maxLength: "You are allowed to enter upto 75 characters only"
              }}
              required
            />
            <p className={styles.loginChange} onClick={this.changeEmail}>
              Change
            </p>
          </div>
          <div>
            <FormInput
              name="firstName"
              placeholder={"First Name*"}
              label={"First Name*"}
              inputRef={this.firstNameInput}
              disable={!this.state.showFields}
              className={showFieldsClass}
              validations={{
                isWords: true
              }}
              validationErrors={{
                isWords: "Only alphabets are allowed"
              }}
              keyPress={this.handleFirstNameKeyPress}
              required
            />
          </div>
          <div>
            <FormInput
              name="lastName"
              placeholder={"Last Name*"}
              label={"Last Name*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              validations={{
                isWords: true
              }}
              validationErrors={{
                isWords: "Only alphabets are allowed"
              }}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              inputRef={this.lastNameInput}
              required
            />
          </div>
          <div className={styles.userGenderPicker}>
            <FormSelect
              required
              name="gender"
              label="Select Gender*"
              placeholder="Select Gender*"
              options={genderOptions}
              disable={!this.state.showFields}
              className={this.state.showFields ? "" : styles.disabledInput}
            />
          </div>
          <div className={styles.calendarIconContainer}>
            <FormInput
              name="dateOfBirth"
              type="date"
              value={null}
              disable={!this.state.showFields}
              className={showFieldsClass}
              id="date_of_birth"
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
                  if (value) {
                    return moment(value).isValid();
                  } else return true;
                },
                isMinAllowedDate: (values, value) => {
                  if (value) {
                    return (
                      new Date(value).getTime() >
                      new Date(this.state.minDate).getTime()
                    );
                  } else return true;
                },
                isMaxAllowedDate: (values, value) => {
                  if (value) {
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
          <div className={styles.countryCode}>
            <CountryCode
              name="code"
              placeholder="Code"
              label="Country Code"
              disable={!this.state.showFields}
              id="isdcode"
              value=""
              validations={{
                isCodeValid: (values, value) => {
                  return !(values.phone && value == "");
                },
                isValidCode: (values, value) => {
                  if (value && this.props.countryData.length > 0) {
                    return (
                      this.props.countryData.indexOf(value ? value : "") > -1
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
              name="phone"
              value=""
              placeholder={"Contact Number"}
              type="number"
              disable={!this.state.showFields}
              className={showFieldsClass}
              label={"Contact Number"}
              validations={{
                isPhoneValid: (values, value) => {
                  return !(values.code && value == "");
                }
              }}
              validationErrors={{
                isPhoneValid: "Please enter your Contact Number"
              }}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
            />
          </div>
          <div>
            <FormInput
              name="password1"
              placeholder={"Password*"}
              label={"Password*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              onFocus={() => {
                this.setState({
                  showPassRules: true
                });
              }}
              blur={() => {
                const value =
                  this.RegisterFormRef.current &&
                  this.RegisterFormRef.current.getModel().password1;
                if (value) {
                  const res =
                    value.length >= 6 &&
                    value.length <= 20 &&
                    /[a-z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[A-Z]/.test(value);
                  if (res) {
                    this.setState({
                      showPassRules: false
                    });
                  } else {
                    this.RegisterFormRef.current?.updateInputsWithError({
                      password1:
                        "Please verify that your password follows all rules displayed"
                    });
                  }
                }
                this.setState({
                  shouldValidatePass: true
                });
              }}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              type={this.state.showPassword ? "text" : "password"}
              validations={{
                // minLength: 6,
                isValid: (values, value) => {
                  const {
                    passValidLength,
                    passValidLower,
                    passValidUpper,
                    passValidNum,
                    shouldValidatePass
                  } = this.state;
                  if (value) {
                    const validLength = passValidLength;
                    const validLower = passValidLower;
                    const validUpper = passValidUpper;
                    const validNum = passValidNum;

                    value.length >= 6 && value.length <= 20
                      ? !validLength &&
                        this.setState({
                          passValidLength: true
                        })
                      : validLength &&
                        this.setState({
                          passValidLength: false
                        });

                    /[a-z]/.test(value)
                      ? !validLower &&
                        this.setState({
                          passValidLower: true
                        })
                      : validLower &&
                        this.setState({
                          passValidLower: false
                        });

                    /[0-9]/.test(value)
                      ? !validNum &&
                        this.setState({
                          passValidNum: true
                        })
                      : validNum &&
                        this.setState({
                          passValidNum: false
                        });

                    /[A-Z]/.test(value)
                      ? !validUpper &&
                        this.setState({
                          passValidUpper: true
                        })
                      : validUpper &&
                        this.setState({
                          passValidUpper: false
                        });
                  } else {
                    this.setState({
                      passValidLength: false,
                      passValidLower: false,
                      passValidUpper: false,
                      passValidNum: false
                    });
                  }
                  return shouldValidatePass
                    ? value &&
                        value.length >= 6 &&
                        value.length <= 20 &&
                        /[a-z]/.test(value) &&
                        /[0-9]/.test(value) &&
                        /[A-Z]/.test(value)
                    : true;
                }
              }}
              validationErrors={{
                isValid:
                  "Please verify that your password follows all rules displayed"
              }}
              required
            />
            <span
              className={styles.togglePasswordBtn}
              onClick={this.state.showFields ? this.togglePassword : () => null}
            >
              <img src={this.state.showPassword ? show : hide} />
            </span>
          </div>
          <div
            className={cs(
              { [styles.show]: this.state.showPassRules },
              styles.passwordValidation
            )}
          >
            <p>Your password must contain</p>
            <ul>
              <li
                className={cs({ [styles.correct]: this.state.passValidLength })}
              >
                6 to 20 characters
              </li>
              <li
                className={cs({ [styles.correct]: this.state.passValidUpper })}
              >
                1 uppercase
              </li>
              <li className={cs({ [styles.correct]: this.state.passValidNum })}>
                1 numeric digit
              </li>
              <li
                className={cs({ [styles.correct]: this.state.passValidLower })}
              >
                1 lowercase
              </li>
            </ul>
          </div>
          <div>
            <FormInput
              name="password2"
              placeholder={"Confirm Password*"}
              label={"Confirm Password*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              isDrop={true}
              isPaste={true}
              type={this.state.showPassword ? "text" : "password"}
              validations={{
                equalsField: "password1",
                isValid: (values, value) => {
                  return (
                    values.password1 &&
                    value &&
                    /[a-z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[A-Z]/.test(value)
                  );
                }
              }}
              validationErrors={{
                equalsField: "The Password entered doesn't match"
              }}
              required
            />
          </div>

          <div className={styles.subscribe}>
            <FormCheckbox
              value={false}
              inputRef={this.subscribeRef}
              id="subscribeemails"
              name="subscribe"
              disable={!this.state.showFields}
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
              value={false}
              id="subscrib"
              name="terms"
              disable={!this.state.showFields}
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
            <p
              className={
                this.state.msgt
                  ? cs(globalStyles.errorMsg, globalStyles.wordCap)
                  : globalStyles.hiddenEye
              }
            >
              Please accept the Terms & Conditions
            </p>
          </div>
          <div>
            {this.state.showerror ? (
              <p className={styles.loginErrMsg}>{this.state.showerror}</p>
            ) : (
              ""
            )}
            <input
              type="submit"
              className={
                this.state.disableButton || !this.state.showFields
                  ? cs(globalStyles.disabledBtn, globalStyles.ceriseBtn)
                  : globalStyles.ceriseBtn
              }
              value="continue"
              disabled={this.state.disableButton || !this.state.showFields}
            />
          </div>
        </div>
      </Formsy>
    );
    const footer = (
      <>
        <div className={globalStyles.textCenter}>
          <SocialLogin
            closeModel={() => {
              this.props.nextStep?.();
            }}
          />
        </div>
      </>
    );

    return this.state.showEmailVerification ? (
      <EmailVerification
        email={this.state.email}
        changeEmail={this.changeEmail}
      />
    ) : (
      <>
        {this.state.successMsg ? (
          <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
            <div className={globalStyles.successMsg}>
              {this.state.successMsg}
            </div>
          </div>
        ) : (
          ""
        )}
        {!this.props.history.location.pathname.includes("/order/checkout") && (
          <>
            <div className={styles.formHeading}>Welcome</div>
            <div className={styles.formSubheading}>
              Please Enter Your Email To Register
            </div>
          </>
        )}
        <Fragment>
          <div className={cs(bootstrapStyles.col12)}>
            <div className={styles.loginForm}>{formContent}</div>
            {footer}
          </div>
        </Fragment>
      </>
    );
  }
}

const CheckoutRegisterFormRoute = withRouter(CheckoutRegisterForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutRegisterFormRoute);
