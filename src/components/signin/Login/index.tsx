import React, { RefObject } from "react";
import cs from "classnames";
// import Axios from 'axios';
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
// import iconStyles from "styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import InputField from "../InputField";
import Loader from "components/Loader";
import SocialLogin from "../socialLogin";
import Popup from "../popup/Popup";
import FormContainer from "../formContainer";
import show from "../../../images/show.svg";
import hide from "../../../images/hide.svg";
import { Context } from "components/Modal/context.ts";

// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
// import InputField from './inputField'
// import Popup from 'components/common/popup/genericpopup'
// import axios from 'axios';
// import Config from 'components/config'
// import * as valid from 'components/common/validation/validate'
// import Loader from '../Loader/index';

type Props = {
  loginclick: string;
  // showRegister?: () => void;
  // closePopup: () => void;
  // showForgotPassword: () => void;
};

type State = {
  msg: string;
  msgp: string;
  highlight: boolean;
  highlightp: boolean;
  disableSelectedbox: boolean;
  showerror: string;
  socialRedirectUrl: string;
  isPasswordDisabled: boolean;
  isLoginDisabled: boolean;
  shouldFocusOnPassword: boolean;
  successMsg: string;
  showPassword: boolean;
};
class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      msgp: "",
      msg: "",
      highlight: false,
      highlightp: false,
      disableSelectedbox: false,
      showerror: "",
      socialRedirectUrl: location.pathname + location.search,
      isPasswordDisabled: true,
      isLoginDisabled: true,
      shouldFocusOnPassword: false,
      successMsg: "",
      showPassword: false
    };
    // this.checkMailValidation = this.checkMailValidation.bind(this);
    // this.disablePassword = this.disablePassword.bind(this);
    // this.onChange = this.onChange.bind(this);
    // this.handleResetPassword = this.handleResetPassword.bind(this);
    // this.togglePassword = this.togglePassword.bind(this);
    // this.goRegister = this.goRegister.bind(this);
    // this.goForgotPassword = this.goForgotPassword.bind(this);
  }
  static contextType = Context;
  emailRef: RefObject<InputField> = React.createRef();
  passwordRef: RefObject<InputField> = React.createRef();
  // checkMailValidation() {
  //     axios.post(Config.hostname + 'myapi/checkuserpassword/', {
  //         email: this.refs.emailRef.state.value
  //     }).then(res=> {
  //         if(res.data.email_exist) {
  //             if(res.data.pwd_exist) {
  //                 this.setState({
  //                     isPasswordDisabled: false,
  //                     msg: '',
  //                     highlight: false
  //                 },() => {
  //                     this.refs.passwordRef.refs.passwordInput.focus();
  //                 })
  //             }
  //             else {
  //                 window.email_goodearth = this.refs.emailRef.state.value;
  //                 const error = ["This account already exists. Please ", <span onClick={this.handleResetPassword}>set a new password</span>];
  //                 this.setState({
  //                     msg: error,
  //                     highlight: true
  //                 })
  //             }
  //         }
  //         else {
  //             const error =["No registered user found. Please ", <span onClick={this.goRegister}>Sign Up</span>];
  //             this.setState({
  //                 msg: error,
  //                 highlight: true
  //             })
  //         }

  //     }).catch((err) => {
  //         console.log("err: " + err);
  //         this.setState({
  //             showerror: '',
  //             highlight: false
  //         })
  //     })
  // }

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

  // componentDidMount() {
  //     if(window.temp_email) {
  //         this.refs.emailRef.state.value = window.temp_email;
  //         this.setState({});
  //     }
  //     this.refs.emailRef.refs.emailInput.focus();
  //     window.temp_email = '';
  // }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    alert("Implement Login");
    //     this.myBlur(event, 'submit');
    //     this.myBlurP();
    //     if (!this.state.highlight && !this.state.highlightp) {
    //         window.email_goodearth = this.refs.emailRef.state.value;
    //         axios.post(Config.hostname + 'rest-auth/login/', {
    //             email: this.refs.emailRef.state.value,
    //             password: this.refs.passwordRef.state.value
    //         }).then(res=> {
    //             if (res.status === 200) {
    //                 let cookieString = "key=" + res.data.key + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    //                 document.cookie = cookieString;
    //                 document.cookie = "bridal_id=" + res.data.bridal_id + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    //                 document.cookie = "bridal_currency=" + res.data.bridal_currency + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    //                 window.dataLayer.push({
    //                     'event': 'eventsToSend',
    //                     'eventAction': 'signIn',
    //                     'eventCategory': 'formSubmission',
    //                     'eventLabel': location.pathname
    //                 });
    //                 if (this.props.loginclick == 'bridal') {
    //                     location.href = '/accountpage?mod=bridal';
    //                 } else if (this.props.loginclick == 'cart') {
    //                     let parameter = location.search.split('loginpopup=abandoncart')[1];
    //                     if (parameter) {
    //                         location.href = '/cart/' + '?' + parameter;
    //                     } else {
    //                         location.href = '/cart/';
    //                     }
    //                 } else if (this.props.loginclick == 'profile') {
    //                     location.href = '/accountpage?mod=profile';
    //                 } else if (this.props.loginclick == 'cerise') {
    //                     if (res.data.customer_slab) {
    //                         location.href = '/accountpage?mod=cerise';
    //                     } else {
    //                         location.href = '/cerise';
    //                     }
    //                 } else {
    //                     document.location.reload();
    //                     window.scrollTo(0, 0);
    //                 }

    //             }
    //         }).catch((err) => {
    //             console.log("err: " + err);
    //             if (err.response.data.non_field_errors[0] == 'NotEmail') {
    //                 window.register_email = this.refs.emailRef.state.value;
    //                 this.setState({
    //                     msg: ["No registered user found. Please ", <span onClick={this.goRegister}>Sign Up</span>],
    //                     highlight: true
    //                 })
    //             } else {
    //                 window.register_email = '';
    //                 this.setState({
    //                     showerror: 'The user name and/or password you have entered is incorrect',
    //                 })
    //             }

    //         })
    //     }
  }

  myBlur(event: React.FocusEvent, value?: string) {
    //     if(!this.refs.emailRef.state.value || this.state.msg) return false;
    //     value ? "" : this.checkMailValidation();
    //     this.setState({
    //         msg: '',
    //         highlight: false
    //     })
  }

  myBlurP() {
    //     if(this.refs.passwordRef.state.value.length == 0) {
    //         this.setState({
    //             isLoginDisabled: true,
    //             msgp: 'Please enter your password',
    //             highlightp: true,
    //         })
    //     }
    //     else if (this.refs.passwordRef.state.value.length < 6) {
    //                 if(this.state.msgp !== "Please enter at least 6 characters for the password")
    //                 this.setState({
    //                     msgp: 'Please enter at least 6 characters for the password',
    //                     highlightp: true,
    //                     isLoginDisabled: false
    //                 });
    //             }
    //     else {
    //         this.setState({
    //             isLoginDisabled: false,
    //             msgp: '',
    //             highlightp: false
    //         })
    //     }
  }

  onChange(event: React.KeyboardEvent, type?: string) {
    //     if (this.state.showerror) {
    //         this.setState({
    //             showerror: '',
    //         })
    //     }
    //     if(type === "email") {
    //         if(event.key == "Enter") {
    //             this.myBlur(event);
    //         }
    //         else {
    //             if (valid.checkBlank(this.refs.emailRef.state.value)) {
    //                 if(this.state.msg !== "Please Enter Email") {
    //                     this.setState({
    //                         msg: 'Please Enter Email',
    //                         highlight: true,
    //                         showerror: ""
    //                     })
    //                 }
    //             }
    //             else if (!valid.checkMail(this.refs.emailRef.state.value)) {
    //                 if(this.state.msg !== "Enter valid email") {
    //                     this.setState({
    //                         msg: 'Enter valid email',
    //                         highlight: true,
    //                         showerror: ""
    //                     })
    //                 }
    //             }
    //             else {
    //                 if(this.state.msg !== "") {
    //                     this.setState({
    //                         msg: "",
    //                         highlight: false,
    //                         showerror: ""
    //                     })
    //                 }
    //             }
    //         }
    //     }
    //     if(type === "password") {
    //             this.myBlurP();
    //     }
  }

  disablePassword() {
    if (!this.state.isPasswordDisabled) {
      this.setState({
        isPasswordDisabled: true,
        isLoginDisabled: true,
        msgp: "",
        highlightp: false,
        showerror: ""
      });
    }
  }

  goRegister() {
    alert("implement open register form");
    //     window.register_email = this.refs.emailRef.state.value;
    //     this.props.showRegister();
  }

  togglePassword() {
    this.setState(prevState => {
      return {
        showPassword: !prevState.showPassword
      };
    });
  }

  goForgotPassword() {
    alert("implement open forgot password form");
    //     window.email_goodearth = this.refs.emailRef.state.value;
    //     this.props.showForgotPassword();
  }

  render() {
    const formContent = (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className="categorylabel">
          <li>
            <InputField
              blur={e => this.myBlur(e)}
              ref={this.emailRef}
              placeholder={"Email"}
              label={"Email"}
              border={this.state.highlight}
              keyUp={e => this.onChange(e, "email")}
              error={this.state.msg}
              inputRef="emailInput"
              disablePassword={this.disablePassword}
            />
          </li>
          <li>
            <InputField
              blur={this.myBlurP.bind(this)}
              placeholder={"Password"}
              keyUp={e => this.onChange(e, "password")}
              ref={this.passwordRef}
              label={"Password"}
              border={this.state.highlightp}
              inputRef="passwordInput"
              disable={this.state.isPasswordDisabled}
              isPlaceholderVisible={this.state.isPasswordDisabled}
              error={this.state.msgp}
              type={this.state.showPassword ? "text" : "password"}
              // shouldFocus={this.state.shouldFocusOnPassword}
              inputClass={
                this.state.isPasswordDisabled ? styles.disabledInput : ""
              }
            />
            <span
              className={styles.togglePasswordBtn}
              onClick={
                !this.state.isPasswordDisabled
                  ? this.togglePassword
                  : () => false
              }
            >
              <img src={this.state.showPassword ? show : hide} />
            </span>
          </li>
          <li>
            <span
              className={cs(
                styles.formSubheading,
                globalStyles.voffset5,
                globalStyles.pointer
              )}
              onClick={this.goForgotPassword}
            >
              {" "}
              FORGOT PASSWORD
            </span>
          </li>
          <li>
            {this.state.showerror ? (
              <p className={styles.loginErrMsg}>{this.state.showerror}</p>
            ) : (
              ""
            )}
            <input
              type="submit"
              className={
                this.state.isLoginDisabled
                  ? cs(globalStyles.ceriseBtn, globalStyles.disabledBtn)
                  : globalStyles.ceriseBtn
              }
              value="continue"
              disabled={this.state.isLoginDisabled}
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
          Not a member?{" "}
          <span
            className={cs(globalStyles.cerise, globalStyles.pointer)}
            onClick={this.goRegister}
          >
            {" "}
            SIGN UP{" "}
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
          heading="Welcome back"
          subheading="Enter your email address to register or sign in."
          formContent={formContent}
          footer={footer}
        />
        {this.state.disableSelectedbox && <Loader />}
      </Popup>
    );
  }
}

export default LoginForm;
