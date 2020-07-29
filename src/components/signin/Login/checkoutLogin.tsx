import React, { RefObject, Fragment } from "react";
import cs from "classnames";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import inputStyles from "../../../components/Formsy/styles.scss";
import InputField from "../InputField";
import Loader from "components/Loader";
import SocialLogin from "../socialLogin";
import show from "../../../images/show.svg";
import hide from "../../../images/hide.svg";
import { Context } from "components/Modal/context.ts";
import * as valid from "utils/validate";
import { connect } from "react-redux";
import { loginProps, loginState } from "./typings";
import mapDispatchToProps from "./mapper/actions";
import { AppState } from "reducers/typings";

const mapStateToProps = (state: AppState) => {
  return {
    location: state.router.location
  };
};

type Props = loginProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class CheckoutLoginForm extends React.Component<Props, loginState> {
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
      socialRedirectUrl:
        this.props.location.pathname + this.props.location.search,
      isPasswordDisabled: true,
      isLoginDisabled: true,
      shouldFocusOnPassword: false,
      successMsg: "",
      showPassword: false,
      showCurrentSection: "email"
    };
  }
  static contextType = Context;
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  passwordInput: RefObject<HTMLInputElement> = React.createRef();
  firstEmailInput: RefObject<HTMLInputElement> = React.createRef();
  async checkMailValidation() {
    if (this.state.email) {
      const data = await this.props.checkUserPassword(this.state.email);
      if (data.emailExist) {
        if (data.passwordExist) {
          this.setState(
            {
              showCurrentSection: "login",
              msg: "",
              highlight: false
            },
            () => {
              this.passwordInput.current && this.passwordInput.current.focus();
              this.passwordInput.current &&
                this.passwordInput.current.scrollIntoView(true);
            }
          );
        } else {
          const error = [
            "This account already exists. Please ",
            <span
              className={globalStyles.linkTextUnderline}
              key={1}
              onClick={this.handleResetPassword}
            >
              set a new password
            </span>
          ];
          this.setState({
            msg: error,
            highlight: true
          });
          this.emailInput.current && this.emailInput.current.focus();
        }
      } else {
        localStorage.setItem("tempEmail", this.state.email);
        this.props.showRegister?.();
        // this.setState({
        //   highlight: true,
        //   showCurrentSection:'register'
        // });
        // this.emailInput.current && this.emailInput.current.focus();
      }
    }
  }

  handleResetPassword = (event: React.MouseEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", this.state.email || "");
    this.props
      .resetPassword(formData)
      .then(data => {
        this.setState({
          highlight: false,
          msg: "",
          successMsg: data.success
        });
      })
      .catch((err: any) => {
        console.log("err: " + err.response.data.email[0]);
        this.setState({
          highlight: true,
          msg: err.response.data.email[0]
        });
      });
  };

  componentDidMount() {
    const email = localStorage.getItem("tempEmail");
    if (email) {
      this.setState({ email });
    }
    this.emailInput.current && this.emailInput.current.focus();
    localStorage.removeItem("tempEmail");
  }

  handleSubmitEmail = (event: React.FormEvent) => {
    event.preventDefault();
    this.myBlur(event);
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.myBlur(undefined, "submit");
    this.myBlurP();
    if (!this.state.highlight && !this.state.highlightp) {
      this.props
        .login(this.state.email || "", this.state.password || "")
        .then(data => {
          // this.context.closeModal();
          this.props.nextStep?.();
        })
        .catch(err => {
          if (err.response.data.non_field_errors[0] == "NotEmail") {
            this.setState({
              msg: ["No registered user found"],
              highlight: true
            });
          } else {
            this.setState({
              showerror:
                "The user name and/or password you have entered is incorrect"
            });
          }
        });
    }
  };

  myBlur(
    event?: React.FocusEvent | React.KeyboardEvent | React.FormEvent,
    value?: string
  ) {
    if (!this.state.email || this.state.msg) return false;
    value ? "" : this.checkMailValidation();
    this.setState({
      msg: "",
      highlight: false
    });
  }

  myBlurP() {
    if (!this.state.password) {
      this.setState({
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
          highlightp: true
        });
    } else {
      this.setState({
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
              showerror: "",
              isLoginDisabled: false
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
        msgp: "",
        highlightp: false,
        showerror: ""
      });
    }
  }

  togglePassword() {
    this.setState(prevState => {
      return {
        showPassword: !prevState.showPassword
      };
    });
  }

  emailForm = () => {
    return (
      <form onSubmit={this.handleSubmitEmail.bind(this)}>
        <div className={styles.categorylabel}>
          <div>
            <InputField
              value={this.state.email}
              placeholder={"Email"}
              label={"Email"}
              border={this.state.highlight}
              keyUp={e => this.handleKeyUp(e, "email")}
              handleChange={e => this.handleChange(e, "email")}
              error={this.state.msg}
              inputRef={this.firstEmailInput}
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
              className={
                this.state.isLoginDisabled
                  ? cs(globalStyles.ceriseBtn, globalStyles.disabledBtn)
                  : globalStyles.ceriseBtn
              }
              value="continue"
              disabled={this.state.isLoginDisabled}
            />
          </div>
        </div>
      </form>
    );
  };

  render() {
    const formContent = (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className={styles.categorylabel}>
          <div>
            <InputField
              value={this.state.email}
              placeholder={"Email"}
              label={"Email"}
              border={this.state.highlight}
              error={this.state.msg}
              inputRef={this.emailInput}
              disable={this.state.isPasswordDisabled}
              disablePassword={this.disablePassword}
              inputClass={
                this.state.isPasswordDisabled ? styles.disabledInput : ""
              }
            />
          </div>
          <div>
            <InputField
              blur={this.myBlurP.bind(this)}
              placeholder={"Password"}
              value={this.state.password}
              keyUp={e => this.handleKeyUp(e, "password")}
              handleChange={e => this.handleChange(e, "password")}
              label={"Password"}
              border={this.state.highlightp}
              inputRef={this.passwordInput}
              isPlaceholderVisible={this.state.isPasswordDisabled}
              error={this.state.msgp}
              type={this.state.showPassword ? "text" : "password"}
              className={inputStyles.password}
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
          </div>
          <div className={globalStyles.textCenter}>
            <span
              className={cs(
                styles.formSubheading,
                globalStyles.voffset5,
                globalStyles.pointer
              )}
              onClick={e => {
                this.props.goForgotPassword(
                  e,
                  (this.emailInput.current && this.emailInput.current.value) ||
                    ""
                );
              }}
            >
              {" "}
              FORGOT PASSWORD
            </span>
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
                this.state.isLoginDisabled
                  ? cs(globalStyles.ceriseBtn, globalStyles.disabledBtn)
                  : globalStyles.ceriseBtn
              }
              value="continue"
              disabled={this.state.isLoginDisabled}
            />
          </div>
        </div>
      </form>
    );
    const footer = (
      <>
        <div className={globalStyles.textCenter}>
          <SocialLogin />
        </div>

        {/* <div className={cs(styles.socialLoginText, styles.socialLoginFooter)}>
          {" "}
          Not a member?{" "}
          <span
            className={cs(globalStyles.cerise, globalStyles.pointer)}
            onClick={e => {
              this.props.goRegister(
                e,
                (this.emailInput.current && this.emailInput.current.value) || ""
              );
            }}
          >
            {" "}
            SIGN UP{" "}
          </span>
        </div> */}
      </>
    );

    const currentForm = () => {
      const { showCurrentSection } = this.state;
      if (showCurrentSection == "email") {
        return this.emailForm();
      } else if (showCurrentSection == "login") {
        return formContent;
      }
    };

    return (
      <Fragment>
        {this.state.successMsg ? (
          <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
            <div className={globalStyles.successMsg}>
              {this.state.successMsg}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className={cs(bootstrapStyles.col12)}>
          <div className={styles.loginForm}>{currentForm()}</div>
          {footer}
        </div>
        {this.state.disableSelectedbox && <Loader />}
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutLoginForm);
