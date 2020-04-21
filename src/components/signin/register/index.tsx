import React, { RefObject } from "react";
import cs from "classnames";
// import Axios from 'axios';
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
// import iconStyles from "styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import InputField from "../InputField";
// import Loader from "components/Loader";
import SocialLogin from "../socialLogin";
import Popup from "../popup/Popup";
import FormContainer from "../formContainer";
import LoginService from "services/login";
import show from "../../../images/show.svg";
import hide from "../../../images/hide.svg";
import { Context } from "components/Modal/context.ts";
import moment from "moment";
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
// import { CalendarIcon, ClearIcon } from 'components/common/form/Calendar';
// import Config from 'components/config'
import GenderPicker from "../genderPicker";
import CountryCode from "../CountryCode";

// import * as valid from 'components/common/validation/validate'
// import DatePicker from 'react-datepicker';
// import DatePicker from 'react-date-picker';
// import 'react-datepicker/dist/react-datepicker.css';
type Props = {};
type State = {
  msg: string;
  msgn: string;
  msgp: string;
  msgcp: string;
  msgl: string;
  nmsg: string;
  errorDob: string;
  highlight: boolean;
  highlightp: boolean;
  highlightcp: boolean;
  highlightn: boolean;
  highlightl: boolean;
  numHighlight: boolean;
  highlightDob: boolean;
  highlightGender: boolean;
  highlightCode: boolean;
  disableButton: boolean;
  msgt: string;
  url: string;
  gender: string;
  dateOfBirth: string;
  code: string;
  showerror: string;
  showFields: boolean;
  successMsg: string;
  showPassword: boolean;
  msgGender: string;
  phonecodeError: string;
  minDate: string;
  maxDate: string;
  showDOBLabel: boolean;
};

class RegisterForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      msg: "",
      msgn: "",
      msgp: "",
      msgcp: "",
      msgl: "",
      nmsg: "",
      errorDob: "",
      highlight: false,
      highlightp: false,
      highlightcp: false,
      highlightn: false,
      highlightl: false,
      numHighlight: false,
      highlightDob: false,
      highlightGender: false,
      highlightCode: false,
      disableButton: false,
      msgt: "",
      url: location.pathname + location.search,
      gender: "",
      dateOfBirth: "",
      code: "",
      showerror: "",
      showFields: false,
      successMsg: "",
      showPassword: false,
      msgGender: "",
      phonecodeError: "",
      minDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 110)
      ).format("YYYY-MM-DD"),
      maxDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 15)
      ).format("YYYY-MM-DD"),
      showDOBLabel: false
    };
    // this.todaydate = moment();
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.chkTermsandC = this.chkTermsandC.bind(this);
    // this.setGender = this.setGender.bind(this);
    // this.onClickCalendar = this.onClickCalendar.bind(this);
    // this.setCode = this.setCode.bind(this);
    // this.goLogin = this.goLogin.bind(this);
    // this.onMailChange = this.onMailChange.bind(this);
    // this.checkMailValidation = this.checkMailValidation.bind(this);
    // this.mailValidation = this.mailValidation.bind(this);
    // this.handleResetPassword = this.handleResetPassword.bind(this);
    // this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    // this.togglePassword = this.togglePassword.bind(this);
    // this.handleDOBFocus = this.handleDOBFocus.bind(this);
  }
  static contextType = Context;
  emailRef: RefObject<InputField> = React.createRef();
  passwordRef: RefObject<InputField> = React.createRef();
  confirmPasswordRef: RefObject<InputField> = React.createRef();
  dobRef: RefObject<InputField> = React.createRef();
  countryRef: RefObject<CountryCode> = React.createRef();
  phoneRef: RefObject<InputField> = React.createRef();
  fnameRef: RefObject<InputField> = React.createRef();
  lnameRef: RefObject<InputField> = React.createRef();
  // componentDidMount() {
  //     document.getElementById('subscrib').checked = false;
  //     if (window.register_email) {
  //         this.refs.emailRef.state.value = window.register_email;
  //         this.setState({});
  //     }
  //     window.register_email = '';
  //     // this.pickerRef.setOpen(false);
  //     this.refs.emailRef.refs.emailInput.focus();
  // }

  handleSubmit(event: React.FormEvent) {
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
    //     let formData = {};
    //     formData['username'] = this.refs.emailRef.state.value;
    //     formData['email'] = this.refs.emailRef.state.value;
    //     formData['password1'] = this.refs.passwordRef.state.value;
    //     formData['password2'] = this.refs.confirmPasswordRef.state.value;
    //     formData['first_name'] = this.refs.fnameRef.state.value;
    //     formData['last_name'] = this.refs.lnameRef.state.value;
    //     formData["gender"] = this.state.gender;
    //     const dateOfBirth = this.state.dateOfBirth ? moment(this.state.dateOfBirth).format('YYYY-MM-DD') : null;
    //     formData['dateOfBirth'] = dateOfBirth;
    //     formData['phone_no'] = this.state.code && this.refs.phoneref.state.value ? this.state.code + ' ' + this.refs.phoneref.state.value : this.refs.phoneref.state.value;
    //     formData['subscribe'] = document.getElementById('subscrib').checked;
    //     this.setState({
    //         disableButton: true
    //     })
    //     axios.post(Config.hostname + 'myapi/register/', formData
    //     ).then(res => {
    //         this.setState({
    //                 disableButton: false
    //             }
    //         )
    //         if (res.status === 201) {
    //             let cookieString = "key=" + res.data.key + "; expires=Sun, 15 Jul 2050 00:00:01 UTC; path=/";
    //             document.cookie = cookieString;
    //             document.cookie = "bridal_id=" + res.data.bridal_id + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    //             document.cookie = "bridal_currency=" + res.data.bridal_currency + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    //             window.dataLayer.push({
    //                 'event': 'eventsToSend',
    //                 'eventAction': 'signup',
    //                 'eventCategory': 'formSubmission',
    //                 'eventLabel': location.pathname
    //             });
    //             document.location.reload();
    //         }
    //     }).catch((err) => {
    //         this.setState({
    //             disableButton: false
    //         }, ()=> {
    //             this.handleInvalidSubmit()
    //         })
    //         Object.keys(err.response.data).map(data => {
    //             switch (data) {
    //                 case 'first_name':
    //                     this.setState({
    //                         msgn: err.response.data[data][0],
    //                         highlightn: true
    //                     })
    //                     break;
    //                 case 'last_name':
    //                     this.setState({
    //                         msgl: err.response.data[data][0],
    //                         highlightl: true
    //                     })
    //                     break;
    //                 case 'username':
    //                 case 'email':
    //                     if (err.response.data[data].length == 2) {
    //                         this.setState({
    //                             showerror: "This account already exists <a class='error' href=" + err.response.data[data][0] + "> please set a new password</a>"
    //                         })
    //                     } else {
    //                         this.setState({
    //                             showerror: '',
    //                             msg: err.response.data[data][0],
    //                             highlight: true
    //                         })
    //                     }
    //                     break;
    //                 case 'password1':
    //                     this.setState({
    //                         msgp: err.response.data[data][0],
    //                         highlightp: true
    //                     });
    //                     break;
    //                 case 'password2':
    //                     this.setState({
    //                         msgcp: err.response.data[data][0],
    //                         highlightcp: true
    //                     });
    //                     break;
    //                 case 'gender':
    //                     this.setState({
    //                         msgGender: err.response.data[data][0],
    //                         highlightGender: true
    //                     });
    //                     break;
    //                 case 'phone_no':
    //                     this.setState({
    //                         nmsg: err.response.data[data][0],
    //                         numHighlight: true
    //                     });
    //                     break;
    //                 case 'phone_no':
    //                     this.setState({
    //                         nmsg: err.response.data[data][0],
    //                         numHighlight: true
    //                     })
    //                     break;
    //             }
    //         });
    //     });
    //     event.preventDefault();
  }

  // handleInvalidSubmit() {
  //     setTimeout(() => {
  //         let firstErrorField = document.getElementsByClassName('error-border')[0];
  //         if (firstErrorField) {
  //             firstErrorField.focus();
  //             firstErrorField.scrollIntoView({block: "center", behavior: 'smooth'})
  //         }
  //     }, 500);
  // }

  myBlurGender() {
    //     if (!this.state.gender) {
    //         this.setState({
    //             highlightGender: true,
    //             msgGender: "Please Select your Gender."
    //         })
    //     }
  }

  myPhoneCode() {
    //     if (this.state.code.trim().length == 0 & this.refs.phoneref.state.value.trim().length == 0) {
    //         this.setState({
    //             phonecodeError: "",
    //             highlightCode: false,
    //             nmsg: "",
    //             numHighlight: false
    //         })
    //     }
    //     if ((this.refs.phoneref.state.value.trim().length == 0 & this.state.code.trim().length > 0)) {
    //         this.setState({
    //             nmsg: "This field is required",
    //             numHighlight: true
    //         })
    //     }
    //     else if (this.state.code.trim().length == 0 & this.refs.phoneref.state.value.trim().length > 0) {
    //         this.setState({
    //             phonecodeError: "Required",
    //             highlightCode: true
    //         })
    //     }
  }

  myPhoneCodeBlur() {
    //     if (this.state.code.trim().length == 0 & this.refs.phoneref.state.value.trim().length == 0) {
    //         this.setState({
    //             phonecodeError: "",
    //             highlightCode: false,
    //             nmsg: "",
    //             numHighlight: false
    //         })
    //     }
    //     else if (this.state.code.trim().length == 0 & this.refs.phoneref.state.value.trim().length > 0) {
    //         this.setState({
    //             phonecodeError: "Required",
    //             highlightCode: true
    //         })
    //     }
    //     else {
    //         this.setState({
    //             phonecodeError: "",
    //             highlightCode: false
    //         })
    //     }
  }

  myPhoneNumberBlur() {
    //     if (this.state.code.trim().length == 0 & this.refs.phoneref.state.value.trim().length == 0) {
    //         this.setState({
    //             phonecodeError: "",
    //             highlightCode: false,
    //             nmsg: "",
    //             numHighlight: false
    //         })
    //     }
    //     if ((this.refs.phoneref.state.value.trim().length == 0 & this.state.code.trim().length > 0)) {
    //         this.setState({
    //             nmsg: "This field is required",
    //             numHighlight: true
    //         })
    //     }
    //     else {
    //         this.setState({
    //             nmsg: "",
    //             numHighlight: false
    //         })
    //     }
  }

  myBlur() {
    //     if(this.mailValidation()) {
    //         if(this.checkMailValidation()) {
    //             this.setState({
    //                 msg: '',
    //                 highlight: false
    //             })
    //             return true;
    //         }
    //         else {
    //             this.resetSection();
    //             return false;
    //         }
    //     }
    //     else {
    //         this.resetSection();
    //         return false;
    //     }
  }

  // handleResetPassword(event) {
  //     event.preventDefault();

  //     let formData = new FormData();
  //     formData.append('email', this.refs.emailRef.state.value);
  //     axios.post(Config.hostname+'myapi/reset_password/', formData
  //     ).then((res) => {
  //         this.setState({
  //             highlight: false,
  //             msg: '',
  //             successMsg: res.data.success,
  //         });
  //     }).catch((err) => {
  //         console.log("err: " + err.response.data.email[0 ]);
  //         this.setState({
  //             highlight: true,
  //             msg: err.response.data.email[0],
  //         })
  //     })
  // }

  checkMailValidation() {
    //     axios.post(Config.hostname + 'myapi/checkuserpassword/', {
    //         email: this.refs.emailRef.state.value
    //     }).then(res=> {
    //         if(res.data.email_exist) {
    //             if(res.data.pwd_exist) {
    //                 const error = ["This account already exists. Please ", <span onClick={this.goLogin}>Sign In</span>];
    //                 this.setState({
    //                     msg: error,
    //                     highlight: true,
    //                     showFields: false
    //                 })
    //                 return false;
    //             }
    //             else {
    //                 const error = ["This account already exists. Please ", <span onClick={this.handleResetPassword}>set a new password</span>];
    //                 this.setState({
    //                     msg: error,
    //                     highlight: true,
    //                     showFields: false
    //                 })
    //                 return false;
    //             }
    //         }
    //         else {
    //             this.setState({
    //                 showFields: true,
    //                 msg: '',
    //                 highlight: false
    //             },() => {
    //                 this.refs.fnameRef.refs.firstNameInput.focus();
    //             })
    //             return true;
    //         }
    //     }).catch((err) => {
    //         console.log("err: " + err);
    //         this.setState({
    //             showerror: '',
    //             highlight: false
    //         })
    //     })
  }

  myBlurP() {
    //     if (this.refs.passwordRef.state.value.length < 6) {
    //         this.setState({
    //             msgp: 'Please enter at least 6 characters for the password',
    //             highlightp: true
    //         });
    //     }
    //     else {
    //         this.setState({
    //             msgp: '',
    //             highlightp: false
    //         });
    //     }
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
    //     if (document.getElementById('subscribeemails').checked == false) {
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

  handleDobChange(event: React.KeyboardEvent) {
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
  }

  onClickCalendar() {
    //     // this.pickerRef.setOpen(true);
  }

  setCode(data: string) {
    //     this.setState({
    //         code: data
    //     })
  }

  goLogin(event: React.MouseEvent) {
    //     window.temp_email = this.refs.emailRef.state.value;
    LoginService.showLogin();
    event.preventDefault();
  }

  resetSection() {
    //     this.setState({
    //         showFields: false,
    //         msgp: '',
    //         highlightp: false,
    //         msgGender: '',
    //         highlightGender: false,
    //         msgl: '',
    //         highlightl: false,
    //         msgn: '',
    //         highlightn: false,
    //         msgt: '',
    //         numHighlight: false,
    //         nmsg: ''
    //     })
  }
  onMailChange(event: React.KeyboardEvent) {
    //         if (this.mailValidation()) {
    //             if(event.key == "Enter") {
    //                 if(this.checkMailValidation()) {
    //                     this.setState({
    //                         msg: '',
    //                         highlight: false,
    //                     })
    //                 }
    //                 else {
    //                     this.resetSection();
    //                 }
    //             }
    //             else {
    //                 this.resetSection();
    //             }
    //         }
    //         else {
    //             this.resetSection();
    //         }
  }

  handleFirstNameKeyPress(e: React.KeyboardEvent) {
    //     if(e.key == "Enter") {
    //         e.preventDefault();
    //         this.refs.lnameRef.refs.lastNameInput.focus();
    //     }
  }
  mailValidation() {
    //     let validate = true;
    //         if (valid.checkBlank(this.refs.emailRef.state.value)) {
    //             this.setState({
    //                 msg: 'Please Enter Email',
    //                 highlight: true,
    //                 showFields: false
    //             })
    //             validate = false;
    //         }
    //         else if (!valid.checkMail(this.refs.emailRef.state.value)) {
    //             this.setState({
    //                 msg: 'Enter valid email',
    //                 highlight: true,
    //                 showFields: false
    //             })
    //             validate = false;
    //         } else if (this.refs.emailRef.state.value.length > 75) {
    //             this.setState({
    //                 msg: 'You are allowed to enter upto 75 characters only',
    //                 highlight: true,
    //                 showFields: false
    //             })
    //             validate = false;
    //         } else {
    //             this.setState({
    //                 msg: '',
    //                 highlight: false,
    //                 showFields: true
    //             })
    //         }
    //         return validate;
  }

  handleConfirmPassword(event: React.KeyboardEvent) {
    //     this.myBlurP();
    //     const error = this.state.msgcp;
    //     const value = this.refs.confirmPasswordRef.state.value;
    //     if(this.refs.passwordRef.state.value.length >= 6 ) {
    //     }
    //     if(value) {
    //         if (this.refs.passwordRef.state.value !== this.refs.confirmPasswordRef.state.value) {
    //             this.setState({
    //                 msgcp: "Passwords do not match",
    //                 highlightcp: true
    //             })
    //         }
    //         else {
    //             if(error) {
    //                 this.setState({
    //                     msgcp: "",
    //                     highlightcp: false
    //                 })
    //             }
    //         }
    //     }
  }

  togglePassword() {
    //     this.setState((prevState) => {
    //         return {
    //             showPassword: !prevState.showPassword
    //         }
    //     })
  }

  // handleDOBFocus (showDOBLabel) {
  //     this.setState({
  //         showDOBLabel
  //     })
  // }

  render() {
    const showFieldsClass = this.state.showFields ? "" : styles.disabledInput;
    const formContent = (
      <form onSubmit={() => this.handleSubmit}>
        <ul className={styles.categorylabel}>
          <li>
            <InputField
              blur={!this.state.msg ? () => this.myBlur : () => false}
              ref={this.emailRef}
              placeholder={"Email*"}
              label={"Email*"}
              keyUp={e => this.onMailChange(e)}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              inputRef="emailInput"
              error={this.state.msg}
              border={this.state.highlight}
            />
          </li>
          <li>
            <InputField
              blur={this.myBlurName.bind(this)}
              ref={this.fnameRef}
              placeholder={"First Name*"}
              label={"First Name*"}
              inputRef="firstNameInput"
              disable={!this.state.showFields}
              className={showFieldsClass}
              keyPress={e => this.handleFirstNameKeyPress(e)}
              error={this.state.msgn}
              border={this.state.highlightn}
            />
          </li>
          <li>
            <InputField
              blur={this.myBlurLName.bind(this)}
              placeholder={"Last Name*"}
              ref={this.lnameRef}
              label={"Last Name*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              inputRef="lastNameInput"
              error={this.state.msgl}
              border={this.state.highlightl}
            />
          </li>
          <li className={styles.userGenderPicker}>
            <GenderPicker
              setGender={this.setGender}
              msgGender={this.state.msgGender}
              gender={this.state.gender}
              disable={!this.state.showFields}
              // className={this.state.showFields?"": "disabled-input"}
              highlightGender={this.state.highlightGender}
            />
          </li>
          <li className={styles.calendarIconContainer}>
            {/* <DatePicker onChange={this.onChange.bind(this)}
                            onFocus={() => this.handleDOBFocus(true)}
                            onBlur={() => this.handleDOBFocus(false)}
                            ref={(node) => { this.pickerRef = node; }}
                            className={!this.state.showFields? "input-style disabled-input react-datepicker-ignore-onclickoutside":"input-style"}
                            maxDate={this.todaydate} selected={this.state.dateOfBirth}
                            disabled={!this.state.showFields}
                            dateFormat="DD/MM/YYYY" placeholderText="DOB DD/MM/YYYY"/>
                <label className={this.state.showDOBLabel && this.state.showFields || false ? "label" : "label hidden" }
>{"Date of Birth DD/MM/YYYY"}</label>
                <span className="calendar-icon" onClick={this.onClickCalendar}>
                    <img src="/static/img/bridal/icons_bridal-registry-calendar.svg" width="45"
                          height="45"/>
                </span> */}
            {/* <DatePicker onChange={this.onChange.bind(this)}
                            value={this.state.dateOfBirth}
                            dayPlaceholder="DD"
                            monthPlaceholder="MM"
                            yearPlaceholder="YYYY"
                            // formatLongDate={(locale, date) => formatDate(date, 'YYYY MMM dd')}
                            format="yyyy/M/d"
                            defaultView="decade"
                            view={this.state.dateOfBirth == "" || this.state.dateOfBirth == null ? "decade" : "month"}
                            id="date_of_birth"
                            disabled={!this.state.showFields}
                            activeStartDate={new Date(new Date().setFullYear(1991))}
                            minDetail="decade"
                            clearIcon={this.state.dateOfBirth == "" || this.state.dateOfBirth == null ? null: <ClearIcon />}
                            calendarIcon={<CalendarIcon />}
                            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 15))}
                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 110))}
                            returnValue="start"
                            showLeadingZeros={false}/> */}
            <InputField
              type="date"
              keyUp={e => this.handleDobChange(e)}
              // value={this.state.dateOfBirth}
              disable={!this.state.showFields}
              className={showFieldsClass}
              ref={this.dobRef}
              id="date_of_birth"
              placeholder="YYYY/MM/DD"
              label="Date of Birth"
              min={moment(
                new Date().setFullYear(new Date().getFullYear() - 110)
              ).format("YYYY-MM-DD")}
              max={moment(
                new Date().setFullYear(new Date().getFullYear() - 15)
              ).format("YYYY-MM-DD")}
              error={this.state.errorDob}
              border={this.state.highlightDob}
            />
            {/* {this.state.showFields ? <label htmlFor="date_of_birth">Date of Birth</label> : ""} */}
            {/* {this.state.errorDob || ""?<p className="error-msg txtnormal" >{this.state.errorDob}</p>:""} */}
          </li>
          <li className={cs(styles.countryCode, "country-code-profile")}>
            <CountryCode
              ref={this.countryRef}
              setCode={this.setCode}
              placeholder="Code"
              error={this.state.phonecodeError}
              disabled={!this.state.showFields}
              border={this.state.highlightCode}
              id="isdcode"
              blur={this.myPhoneCodeBlur.bind(this)}
            />
            <InputField
              ref={this.phoneRef}
              placeholder={"Contact Number"}
              type="number"
              disable={!this.state.showFields}
              className={showFieldsClass}
              label={"Contact Number"}
              border={this.state.numHighlight}
              blur={this.myPhoneNumberBlur.bind(this)}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              error={this.state.nmsg}
            />
          </li>
          <li>
            <InputField
              blur={this.myBlurP.bind(this)}
              ref={this.passwordRef}
              placeholder={"Password*"}
              label={"Password*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              error={this.state.msgp}
              border={this.state.highlightp}
              keyUp={e => this.handleConfirmPassword(e)}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              type={this.state.showPassword ? "text" : "password"}
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
            <InputField
              blur={this.myBlurP.bind(this)}
              ref={this.confirmPasswordRef}
              placeholder={"Confirm Password*"}
              label={"Confirm Password*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              error={this.state.msgcp}
              border={this.state.highlightcp}
              keyUp={e => this.handleConfirmPassword(e)}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              type={this.state.showPassword ? "text" : "password"}
            />
          </li>

          <li className={styles.subscribe}>
            <input
              disabled={!this.state.showFields}
              onChange={e => this.chkTermsandC(e)}
              type="checkbox"
              id="subscribeemails"
            />
            <label htmlFor="subscribeemails">
              I agree to the{" "}
              <a href="/customer-assistance/terms-conditions" target="_blank">
                Terms and Conditions
              </a>
              *
            </label>
          </li>
          <li className={styles.subscribe}>
            <input
              disabled={!this.state.showFields}
              type="checkbox"
              id="subscrib"
            />
            <label htmlFor="subscrib">
              I agree to receiving e-mails, calls and text messages for service
              related information. To know more how we keep your data safe,
              refer to our{" "}
              <a href="/customer-assistance/privacy-policy" target="_blank">
                Privacy Policy
              </a>{" "}
            </label>
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
      </form>
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
