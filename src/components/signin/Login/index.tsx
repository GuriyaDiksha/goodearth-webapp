import React, { RefObject } from "react";
import cs from "classnames";
import styles from "../styles.scss";
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
import LoginService from "services/login";
import * as valid from "utils/validate";

type Props = {
  loginclick?: string;
};

type State = {
  email: string | null;
  password: string | null;
  msg: string | (string | JSX.Element)[];
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
      email: "",
      password: "",
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
  }
  static contextType = Context;
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  passwordInput: RefObject<HTMLInputElement> = React.createRef();
  async checkMailValidation() {
    if (this.state.email) {
      const data = await LoginService.checkuserpassword(this.state.email);
      if (data.emailExist) {
        if (data.passwordExist) {
          this.setState(
            {
              isPasswordDisabled: false,
              msg: "",
              highlight: false
            },
            () => {
              this.passwordInput.current && this.passwordInput.current.focus();
            }
          );
        } else {
          // window.email_goodearth = this.refs.emailRef.state.value;
          const error = [
            "This account already exists. Please ",
            <span key={1} onClick={this.handleResetPassword}>
              set a new password
            </span>
          ];
          this.setState({
            msg: error,
            highlight: true
          });
        }
      } else {
        const error = [
          "No registered user found. Please ",
          <span key={2} onClick={this.goRegister}>
            Sign Up
          </span>
        ];
        this.setState({
          msg: error,
          highlight: true
        });
      }
    }

    // }).catch((err) => {
    //     console.log("err: " + err);
    //     this.setState({
    //         showerror: '',
    //         highlight: false
    //     })
    // })
  }

  handleResetPassword(event: React.MouseEvent) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", this.state.email || "");
    LoginService.resetPassword(formData)
      .then(res => {
        this.setState({
          highlight: false,
          msg: "",
          successMsg: res.data.success
        });
      })
      .catch(err => {
        console.log("err: " + err.response.data.email[0]);
        this.setState({
          highlight: true,
          msg: err.response.data.email[0]
        });
      });
  }

  componentDidMount() {
    // if(window.temp_email) {
    //     this.refs.emailRef.state.value = window.temp_email;
    //     this.setState({});
    // }
    this.emailInput.current && this.emailInput.current.focus();
    // window.temp_email = '';
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    this.myBlur(undefined, "submit");
    this.myBlurP();
    if (!this.state.highlight && !this.state.highlightp) {
      // window.email_goodearth = this.refs.emailRef.state.value;

      LoginService.login(this.state.email || "", this.state.password || "")
        .then(res => {
          if (res.status === 200) {
            // window.dataLayer.push({
            //     'event': 'eventsToSend',
            //     'eventAction': 'signIn',
            //     'eventCategory': 'formSubmission',
            //     'eventLabel': location.pathname
            // });
            // if (this.props.loginclick == "bridal") {
            //   location.href = "/accountpage?mod=bridal";
            // } else if (this.props.loginclick == "cart") {
            //   const parameter = location.search.split("loginpopup=abandoncart")[1];
            //   if (parameter) {
            //     location.href = "/cart/" + "?" + parameter;
            //   } else {
            //     location.href = "/cart/";
            //   }
            // } else if (this.props.loginclick == "profile") {
            //   location.href = "/accountpage?mod=profile";
            // } else if (this.props.loginclick == "cerise") {
            //   if (res.data.customer_slab) {
            //     location.href = "/accountpage?mod=cerise";
            //   } else {
            //     location.href = "/cerise";
            //   }
            // } else {
            //   document.location.reload();
            // }
            this.context.closeModal();
            window.scrollTo(0, 0);
          }
        })
        .catch(err => {
          console.log("err: " + err);
          if (err.response.data.non_field_errors[0] == "NotEmail") {
            // window.register_email = this.refs.emailRef.state.value;
            this.setState({
              msg: [
                "No registered user found. Please ",
                <span key="signin-email-error" onClick={this.goRegister}>
                  Sign Up
                </span>
              ],
              highlight: true
            });
          } else {
            // window.register_email = '';
            this.setState({
              showerror:
                "The user name and/or password you have entered is incorrect"
            });
          }
        });
    }
  }

  myBlur(event?: React.FocusEvent | React.KeyboardEvent, value?: string) {
    if (!this.state.email || this.state.msg) return false;
    value ? "" : this.checkMailValidation();
    this.setState({
      msg: "",
      highlight: false
    });
  }

  myBlurP() {
    if (this.state.password && this.state.password.length == 0) {
      this.setState({
        isLoginDisabled: true,
        msgp: "Please enter your password",
        highlightp: true
      });
    } else if (this.state.password && this.state.password.length < 6) {
      if (
        this.state.msgp !==
        "Please enter at least 6 characters for the password"
      )
        this.setState({
          msgp: "Please enter at least 6 characters for the password",
          highlightp: true,
          isLoginDisabled: false
        });
    } else {
      this.setState({
        isLoginDisabled: false,
        msgp: "",
        highlightp: false
      });
    }
  }

  handleKeyUp(event: React.KeyboardEvent, type?: string) {
    if (this.state.showerror) {
      this.setState({
        showerror: ""
      });
    }
    if (type === "email") {
      if (event.key == "Enter") {
        this.myBlur(event);
      } else {
        if (valid.checkBlank(this.state.email)) {
          if (this.state.msg !== "Please Enter Email") {
            this.setState({
              msg: "Please Enter Email",
              highlight: true,
              showerror: ""
            });
          }
        } else if (!valid.checkMail(this.state.email)) {
          if (this.state.msg !== "Enter valid email") {
            this.setState({
              msg: "Enter valid email",
              highlight: true,
              showerror: ""
            });
          }
        } else {
          if (this.state.msg !== "") {
            this.setState({
              msg: "",
              highlight: false,
              showerror: ""
            });
          }
        }
      }
    }
    if (type === "password") {
      this.myBlurP();
    }
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>, type: string) {
    switch (type) {
      case "email": {
        this.disablePassword();
        this.setState({ email: event.currentTarget.value });
        break;
      }
      case "password": {
        this.setState({ password: event.currentTarget.value });
        break;
      }
    }
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

  goRegister(event: React.MouseEvent) {
    //     window.register_email = this.refs.emailRef.state.value;
    LoginService.showRegister();
    event.preventDefault();
  }

  togglePassword() {
    this.setState(prevState => {
      return {
        showPassword: !prevState.showPassword
      };
    });
  }

  goForgotPassword(event: React.MouseEvent) {
    //     window.email_goodearth = this.refs.emailRef.state.value;
    LoginService.showForgotPassword();
    event.preventDefault();
  }

  render() {
    const formContent = (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={styles.categorylabel}>
          <li>
            <InputField
              blur={e => this.myBlur(e)}
              // ref={this.emailRef}
              value={this.state.email}
              placeholder={"Email"}
              label={"Email"}
              border={this.state.highlight}
              keyUp={e => this.handleKeyUp(e, "email")}
              handleChange={e => this.handleChange(e, "email")}
              error={this.state.msg}
              inputRef={this.emailInput}
              disablePassword={this.disablePassword}
            />
          </li>
          <li>
            <InputField
              blur={this.myBlurP.bind(this)}
              placeholder={"Password"}
              value={this.state.password}
              keyUp={e => this.handleKeyUp(e, "password")}
              handleChange={e => this.handleChange(e, "password")}
              // ref={this.passwordRef}
              label={"Password"}
              border={this.state.highlightp}
              inputRef={this.passwordInput}
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
                  ? () => this.togglePassword()
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
              onClick={e => this.goForgotPassword(e)}
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
            onClick={e => this.goRegister(e)}
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
