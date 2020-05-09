import React, { RefObject } from "react";
import cs from "classnames";
// import Axios from 'axios';
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
// import iconStyles from "styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
// import Loader from "components/Loader";
import SocialLogin from "../socialLogin";
import Popup from "../popup/Popup";
import FormContainer from "../formContainer";
import LoginService from "services/login";
import show from "../../../images/show.svg";
import hide from "../../../images/hide.svg";
import { Context } from "components/Modal/context.ts";
import moment from "moment";
// import Config from 'components/config'
import Formsy from "formsy-react";
import FormInput from "../FormInput";
import FormSelect from "../FormSelect";
import FormCheckbox from "../FormCheckbox";
import { Link } from "react-router-dom";
import CountryCode from "../CountryCode";

type Props = {};
type State = {
  disableButton: boolean;
  msgt: string;
  url: string;
  showerror: string;
  showFields: boolean;
  successMsg: string;
  showPassword: boolean;
  minDate: string;
  maxDate: string;
  showDOBLabel: boolean;
  genderOptions: { value: string; label: string }[];
};

class RegisterForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disableButton: false,
      msgt: "",
      url: location.pathname + location.search,
      showerror: "",
      showFields: false,
      successMsg: "",
      showPassword: false,
      genderOptions: [
        { value: "Female", label: "Female" },
        { value: "Male", label: "Male" },
        { value: "Others", label: "Others" }
      ],
      minDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 110)
      ).format("YYYY-MM-DD"),
      maxDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 15)
      ).format("YYYY-MM-DD"),
      showDOBLabel: false
    };
  }
  static contextType = Context;
  emailRef: RefObject<typeof FormInput> = React.createRef();
  RegisterFormRef: RefObject<Formsy> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  firstNameInput: RefObject<HTMLInputElement> = React.createRef();
  lastNameInput: RefObject<HTMLInputElement> = React.createRef();

  componentDidMount() {
    // document.getElementById('subscrib').checked = false;
    // if (window.register_email) {
    //     this.refs.emailRef.state.value = window.register_email;
    //     this.setState({});
    // }
    // window.register_email = '';
    // this.pickerRef.setOpen(false);
    // this.refs.emailRef.refs.emailInput.focus();
  }

  handleSubmit(model: any, resetForm: any, updateInputsWithError: any) {
    // console.log(model);
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
    formData["phone_no"] = code && phone ? code + " " + phone : phone;
    formData["subscribe"] = terms;
    // this.setState({
    //     disableButton: true
    // })
    // Axios.post(Config.hostname + 'myapi/register/', formData
    // ).then(res => {
    //     this.setState({
    //             disableButton: false
    //         }
    //     )
    //     if (res.status === 201) {
    //         let cookieString = "key=" + res.data.key + "; expires=Sun, 15 Jul 2050 00:00:01 UTC; path=/";
    //         document.cookie = cookieString;
    //         document.cookie = "bridal_id=" + res.data.bridal_id + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    //         document.cookie = "bridal_currency=" + res.data.bridal_currency + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    //         window.dataLayer.push({
    //             'event': 'eventsToSend',
    //             'eventAction': 'signup',
    //             'eventCategory': 'formSubmission',
    //             'eventLabel': location.pathname
    //         });
    //         document.location.reload();
    //     }
    // }).catch((err) => {
    //     this.setState({
    //         disableButton: false
    //     }, ()=> {
    //         this.handleInvalidSubmit()
    //     })
    //     Object.keys(err.response.data).map(data => {
    //         switch (data) {
    //             case 'firstName':
    //                 this.setState({
    //                     msgn: err.response.data[data][0],
    //                     highlightn: true
    //                 })
    //                 break;
    //             case 'lastName':
    //                 this.setState({
    //                     msgl: err.response.data[data][0],
    //                     highlightl: true
    //                 })
    //                 break;
    //             case 'username':
    //             case 'email':
    //                 if (err.response.data[data].length == 2) {
    //                     this.setState({
    //                         showerror: "This account already exists <a class='error' href=" + err.response.data[data][0] + "> please set a new password</a>"
    //                     })
    //                 } else {
    //                     this.setState({
    //                         showerror: '',
    //                         msg: err.response.data[data][0],
    //                         highlight: true
    //                     })
    //                 }
    //                 break;
    //             case 'password1':
    //                 this.setState({
    //                     msgp: err.response.data[data][0],
    //                     highlightp: true
    //                 });
    //                 break;
    //             case 'password2':
    //                 this.setState({
    //                     msgcp: err.response.data[data][0],
    //                     highlightcp: true
    //                 });
    //                 break;
    //             case 'gender':
    //                 this.setState({
    //                     msgGender: err.response.data[data][0],
    //                     highlightGender: true
    //                 });
    //                 break;
    //             case 'phone_no':
    //                 this.setState({
    //                     nmsg: err.response.data[data][0],
    //                     numHighlight: true
    //                 });
    //                 break;
    //             case 'phone_no':
    //                 this.setState({
    //                     nmsg: err.response.data[data][0],
    //                     numHighlight: true
    //                 })
    //                 break;
    //         }
    //     });
    // });
    // event.preventDefault();
    //     if(!this.mailValidation()){
    //         this.handleInvalidSubmit();
    //         event.preventDefault();
    //         return false;
    //     }
    //     this.myBlurP();
    //     this.myBlurName();
    //     this.myBlurLName();
    //     // this.myBlur();
    //     this.myBlurGender();
    //     this.myPhoneCode();
    //     this.handleConfirmPassword();
    //     if(this.state.msgcp || this.state.msgp || this.state.msg || this.state.msgl || this.state.msgt || this.state.nmsg || this.state.msgn || this.state.msgGender) {
    //         this.handleInvalidSubmit();
    //         event.preventDefault();
    //         return false;
    //     }
    //     if (document.getElementById('subscribeemails').checked == false || (this.refs.phoneref.state.value.trim().length == 0 || this.state.code.trim().length == 0 ) & (this.refs.phoneref.state.value.trim().length > 0 || this.state.code.trim().length > 0)) {
    //         if (document.getElementById('subscribeemails').checked == false) {
    //             this.setState({
    //                 msgt: "Please accept the terms & conditions"
    //             })
    //         }
    //         event.preventDefault();
    //         return false;
    //     }
    //     if (this.refs.passwordRef.state.value !== this.refs.confirmPasswordRef.state.value) {
    //         event.preventDefault();
    //         this.setState({
    //             msgcp: 'Passwords do not match',
    //             highlightcp: true
    //         }, () => {
    //             this.handleInvalidSubmit();
    //         })
    //         return false;
    //     }
    //
  }

  handleInvalidSubmit() {
    const elem = document.getElementById("subscribeemails") as HTMLInputElement;
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
      }
    }, 0);
  }

  // myBlur() {
  // if(this.checkMailValidation()) {
  //     this.setState({
  //         msg: '',
  //         highlight: false
  //     })
  //     return true;
  // }
  // else {
  //     this.resetSection();
  //     return false;
  // }
  // this.verifyEmail();
  // }

  handleResetPassword(event: React.MouseEvent) {
    event.preventDefault();

    // let formData = new FormData();
    // formData.append('email', this.state.email || "");

    // LoginService.resetPassword(formData).then((res) => {
    //     this.setState({
    //         highlight: false,
    //         msg: '',
    //         successMsg: res.data.success,
    //     });
    // }).catch((err) => {
    //     console.log("err: " + err.response.data.email[0 ]);
    //     this.setState({
    //         highlight: true,
    //         msg: err.response.data.email[0],
    //     })
    // })
  }

  async checkMailValidation(): Promise<boolean> {
    let isValid = false;
    const data = await LoginService.checkuserpassword(
      (this.RegisterFormRef.current &&
        this.RegisterFormRef.current.getModel().email) ||
        ""
    ).catch(err => {
      console.log("err: " + err);
      isValid = false;
    });
    if (data.emailExist) {
      if (data.passwordExist) {
        const error = [
          <span key="email-error">
            This account already exists. Please{" "}
            <span
              className={globalStyles.linkTextUnderline}
              onClick={this.goLogin}
            >
              Sign In
            </span>
          </span>
        ];
        this.setState((prevState, prevProps) => {
          return {
            ...prevState,
            msg: error,
            highlight: true,
            showFields: false
          };
        });
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
              onClick={e => this.handleResetPassword(e)}
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
        isValid = false;
      }
    } else {
      this.firstNameInput.current && this.firstNameInput.current.focus();
      isValid = true;
    }
    return isValid;
  }

  myBlurName() {
    //     if (valid.checkBlank(this.refs.fnameRef.state.value)) {
    //         this.setState({
    //             msgn: 'Please Enter First Name',
    //             highlightn: true
    //         });
    //     }
    //     else {
    //         this.setState({
    //             msgn: '',
    //             highlightn: false
    //         });
    //     }
  }

  myBlurLName() {
    //     if (valid.checkBlank(this.refs.lnameRef.state.value)) {
    //         this.setState({
    //             msgl: 'Please Enter Last Name',
    //             highlightl: true
    //         });
    //     }
    //     else {
    //         this.setState({
    //             msgl: '',
    //             highlightl: false
    //         });
    //     }
  }

  chkTermsandC(event: React.ChangeEvent) {
    // const elem = document.getElementById('subscribeemails') as HTMLInputElement;
    //     if ( elem && elem.checked == false) {
    //         this.setState({
    //             msgt: "Please accept the terms & conditions"
    //         })
    //     }
    //     else {
    //         this.setState({
    //             msgt: ''
    //         });
    //     }
  }

  setGender(gender: string) {
    //     this.setState({
    //         gender: gender,
    //         highlightGender: false,
    //         msgGender: ""
    //     })
  }

  // handleDobChange(event: React.KeyboardEvent) {
  //     // const selectedDate = event.target.value;
  //     const selectedDate = this.refs.dobRef.state.value;
  //     if(moment(selectedDate).isValid()) {
  //         if(selectedDate >= this.state.minDate) {
  //             if(selectedDate <= this.state.maxDate) {
  //                 this.setState({
  //                     errorDob: "",
  //                     highlightDob: false
  //                 })
  //             } else {
  //                 this.setState({
  //                     errorDob: "Age should be at least 15 years",
  //                     highlightDob: true
  //                 })
  //             }
  //         } else {
  //             this.setState({
  //                 errorDob: "Please enter valid date of birth",
  //                 highlightDob: true
  //             })
  //         }
  //     } else {
  //         if(selectedDate === "") {
  //             this.setState({
  //                 errorDob: "",
  //                 highlightDob: false
  //             })
  //         } else {
  //             this.setState({
  //                 errorDob: "Please enter valid date of birth",
  //                 highlightDob: true
  //             })
  //         }
  //     }
  //     this.setState({
  //         dateOfBirth: selectedDate
  //     })
  // }

  onClickCalendar() {
    //     // this.pickerRef.setOpen(true);
  }

  setCode(data: string) {
    // this.setState({
    //     code: data
    // })
  }

  goLogin(event: React.MouseEvent) {
    //     window.temp_email = this.refs.emailRef.state.value;
    LoginService.showLogin();
    event.preventDefault();
  }

  resetSection() {
    this.setState({
      showFields: false
    });
  }

  verifyEmail() {
    this.checkMailValidation().then((isValid: boolean) => {
      if (!isValid) {
        this.resetSection();
      }
    });
  }
  async onMailChange(event: React.KeyboardEvent) {
    if (event.key == "Enter") {
      this.verifyEmail();
    } else {
      this.resetSection();
    }
  }

  handleFirstNameKeyPress(e: React.KeyboardEvent) {
    if (e.key == "Enter") {
      e.preventDefault();
      this.lastNameInput.current && this.lastNameInput.current.focus();
    }
  }
  mailValidation() {
    // let validate = true;
    //     if (valid.checkBlank(this.refs.emailRef.state.value)) {
    //         this.setState({
    //             msg: 'Please Enter Email',
    //             highlight: true,
    //             showFields: false
    //         })
    //         validate = false;
    //     }
    //     else if (!valid.checkMail(this.refs.emailRef.state.value)) {
    //         this.setState({
    //             msg: 'Enter valid email',
    //             highlight: true,
    //             showFields: false
    //         })
    //         validate = false;
    //     } else if (this.refs.emailRef.state.value.length > 75) {
    //         this.setState({
    //             msg: 'You are allowed to enter upto 75 characters only',
    //             highlight: true,
    //             showFields: false
    //         })
    //         validate = false;
    //     } else {
    //         this.setState({
    //             msg: '',
    //             highlight: false,
    //             showFields: true
    //         })
    //     }
    //     return validate;
  }

  handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: string
  ) {
    const value = event.currentTarget.value;
    this.setState((prevState, prevProps) => {
      return {
        ...prevState,
        [type]: value
      };
    });
    // switch (type) {
    //   case "email": {
    //     this.setState({ email: event.currentTarget.value });
    //     break;
    //   }
    //   case "password": {
    //     this.setState({ password: event.currentTarget.value });
    //     break;
    //   }
    //   case "confirmPassword": {
    //     this.setState({ confirmPassword: event.currentTarget.value });
    //     break;
    //   }
    //   case "dob": {
    //     this.setState({ dob: event.currentTarget.value });
    //     break;
    //   }
    //   case "country": {
    //     this.setState({ country: event.currentTarget.value });
    //     break;
    //   }
    //   case "phone": {
    //     this.setState({ phone: event.currentTarget.value });
    //     break;
    //   }
    //   case "fname": {
    //     this.setState({ fname: event.currentTarget.value });
    //     break;
    //   }
    //   case "lname": {
    //     this.setState({ lname: event.currentTarget.value });
    //     break;
    //   }
    // }
  }

  togglePassword() {
    this.setState(prevState => {
      return {
        showPassword: !prevState.showPassword
      };
    });
  }

  // handleDOBFocus (showDOBLabel) {
  //     this.setState({
  //         showDOBLabel
  //     })
  // }

  render() {
    const showFieldsClass = this.state.showFields ? "" : styles.disabledInput;

    const formContent = (
      <Formsy
        ref={this.RegisterFormRef}
        onValidSubmit={(model, reset, u) => this.handleSubmit(model, reset, u)}
        onInvalidSubmit={() => this.handleInvalidSubmit()}
      >
        <ul className={styles.categorylabel}>
          <li>
            <FormInput
              name="email"
              blur={() => this.verifyEmail()}
              placeholder={"Email*"}
              label={"Email*"}
              keyUp={e => this.onMailChange(e)}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              inputRef={this.emailInput}
              handleChange={e => this.handleChange(e, "email")}
              validations={{
                isEmail: true,
                maxLength: 75
              }}
              validationErrors={{
                isEmail: "Enter valid email",
                maxLength: "You are allowed to enter upto 75 characters only"
              }}
              required
            />
          </li>
          <li>
            <FormInput
              name="firstName"
              placeholder={"First Name*"}
              label={"First Name*"}
              inputRef={this.firstNameInput}
              disable={!this.state.showFields}
              className={showFieldsClass}
              keyPress={e => this.handleFirstNameKeyPress(e)}
              handleChange={e => this.handleChange(e, "fname")}
              required
            />
          </li>
          <li>
            <FormInput
              name="lastName"
              placeholder={"Last Name*"}
              label={"Last Name*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              handleChange={e => this.handleChange(e, "lname")}
              inputRef={this.lastNameInput}
              required
            />
          </li>
          <li className={styles.userGenderPicker}>
            <FormSelect
              required
              name="gender"
              label="Select Gender*"
              placeholder="Select Gender*"
              options={this.state.genderOptions}
              handleChange={e => this.handleChange(e, "gender")}
              disable={!this.state.showFields}
              className={this.state.showFields ? "" : styles.disabledInput}
            />
          </li>
          <li className={styles.calendarIconContainer}>
            <FormInput
              name="dateOfBirth"
              type="date"
              value={null}
              disable={!this.state.showFields}
              className={showFieldsClass}
              id="date_of_birth"
              placeholder="YYYY/MM/DD"
              label="Date of Birth"
              handleChange={e => this.handleChange(e, "dob")}
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
                isValidDate: "Please enter valid date oof birth",
                isMinAllowedDate: "Please enter valid date of birth",
                isMaxAllowedDate: "Age should be at least 15 years"
              }}
            />
          </li>
          <li className={cs(styles.countryCode, "country-code-profile")}>
            <CountryCode
              name="code"
              setCode={value => this.setCode(value)}
              placeholder="Code"
              label="Code"
              disable={!this.state.showFields}
              id="isdcode"
              value=""
              validations={{
                isCodeValid: (values, value) => {
                  return !(values.phone && value == "");
                }
              }}
              validationErrors={{
                isCodeValid: "Required"
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
                isPhoneValid: "This field is Required."
              }}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              handleChange={e => this.handleChange(e, "phone")}
            />
          </li>
          <li>
            <FormInput
              name="password1"
              placeholder={"Password*"}
              label={"Password*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              handleChange={e => this.handleChange(e, "password")}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              type={this.state.showPassword ? "text" : "password"}
              validations={{
                minLength: 6
              }}
              validationErrors={{
                minLength: "Please enter at least 6 characters for the password"
              }}
              required
            />
            <span
              className={styles.togglePasswordBtn}
              onClick={
                this.state.showFields ? () => this.togglePassword() : () => null
              }
            >
              <img src={this.state.showPassword ? show : hide} />
            </span>
          </li>
          <li>
            <FormInput
              name="password2"
              placeholder={"Confirm Password*"}
              label={"Confirm Password*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              handleChange={e => this.handleChange(e, "confirmPassword")}
              type={this.state.showPassword ? "text" : "password"}
              validations={{
                equalsField: "password1"
              }}
              validationErrors={{
                equalsField: "Passwords do not match"
              }}
              required
            />
          </li>

          <li className={styles.subscribe}>
            <FormCheckbox
              id="subscribeemails"
              name="subscribe"
              disable={!this.state.showFields}
              handleChange={e => this.chkTermsandC(e)}
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
              required="isFalse"
            />
          </li>
          <li className={styles.subscribe}>
            <FormCheckbox
              id="subscrib"
              name="terms"
              disable={!this.state.showFields}
              label={[
                "I agree to receiving e-mails, calls and text messages for service related information. To know more how we keep your data safe, refer to our ",
                <Link
                  key="terms"
                  to="/customer-assistance/privacy-policy"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              ]}
            />
          </li>
          <li>
            <p
              className={
                this.state.msgt
                  ? cs(globalStyles.errorMsg, globalStyles.wordCap)
                  : globalStyles.hiddenEye
              }
            >
              Please accept the Terms & Conditions
            </p>
          </li>
          <li>
            {this.state.showerror ? (
              <p
                className={styles.loginErrMsg}
                dangerouslySetInnerHTML={{ __html: this.state.showerror }}
              ></p>
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
          </li>
        </ul>
      </Formsy>
    );
    const footer = (
      <>
        <SocialLogin />
        <div className={cs(styles.socialLoginText, styles.socialLoginFooter)}>
          {" "}
          Already registered?{" "}
          <span
            className={cs(globalStyles.cerise, globalStyles.pointer)}
            onClick={this.goLogin}
          >
            {" "}
            SIGN IN{" "}
          </span>
        </div>
      </>
    );
    return (
      <Popup>
        {this.state.successMsg ? (
          <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
            <div className={globalStyles.successMsg}>
              {this.state.successMsg}
            </div>
          </div>
        ) : (
          ""
        )}
        <FormContainer
          heading="Welcome"
          subheading="First time visiting? Enter your email address and password to join in."
          formContent={formContent}
          footer={footer}
        />
        {/* {this.state.disableSelectedbox && <Loader />} */}
      </Popup>
    );
  }
}

export default RegisterForm;
