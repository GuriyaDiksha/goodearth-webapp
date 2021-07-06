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
import { Context } from "components/Modal/context";
import * as valid from "utils/validate";
import { connect } from "react-redux";
import { loginProps, loginState } from "./typings";
import mapDispatchToProps from "./mapper/actions";
import { AppState } from "reducers/typings";
import { RouteComponentProps, withRouter } from "react-router";
// import CookieService from "services/cookie";

const mapStateToProps = (state: AppState) => {
  return {
    location: state.router.location,
    basket: state.basket,
    currency: state.currency
  };
};

type Props = loginProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class MainLogin extends React.Component<Props, loginState> {
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
      isSecondStepLoginDisabled: true,
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
      if (data.invalidDomain) {
        this.setState(
          {
            showerror: data.message
          },
          () => {
            valid.errorTracking([this.state.showerror], location.href);
          }
        );
      } else {
        if (data.emailExist) {
          if (data.passwordExist) {
            this.setState(
              {
                showCurrentSection: "login",
                msg: "",
                highlight: false,
                successMsg: ""
              },
              () => {
                this.passwordInput.current &&
                  this.passwordInput.current.focus();
                this.passwordInput.current &&
                  this.passwordInput.current.scrollIntoView(true);
              }
            );
          } else {
            const error = [
              "This account already exists. Please ",
              <span
                className={cs(
                  globalStyles.errorMsg,
                  globalStyles.linkTextUnderline
                )}
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
        if (err.response.data.email) {
          console.log("err: " + err.response.data.email[0]);
          this.setState({
            highlight: true,
            msg: err.response.data.email[0]
          });
        } else if (err.response.data.error_message) {
          let errorMsg = err.response.data.error_message[0];
          if (errorMsg == "MaxRetries") {
            errorMsg =
              "You have exceeded max attempts, please try after some time.";
          }
          this.setState(
            {
              msg: errorMsg,
              highlight: true
            },
            () => {
              valid.errorTracking([this.state.msg as string], location.href);
            }
          );
        }
      });
  };

  componentDidMount() {
    const email = localStorage.getItem("tempEmail");
    // const checkoutPopupCookie = CookieService.getCookie("checkoutinfopopup");
    if (email) {
      this.setState({ email, isLoginDisabled: false }, () => {
        this.myBlur();
      });
    }
    // if (checkoutPopupCookie == "show") {
    //   this.firstEmailInput.current?.focus();
    // }
    // localStorage.removeItem("tempEmail");
    this.firstEmailInput.current?.focus();
  }

  UNSAFE_componentWillReceiveProps() {
    const email = localStorage.getItem("tempEmail");
    if (!this.state.email || email) {
      if (email) {
        this.setState({ email, isLoginDisabled: false }, () => {
          this.myBlur();
        });
      }
      // this.firstEmailInput.current?.focus();
      localStorage.removeItem("tempEmail");
    }
  }

  handleSubmitEmail = (event: React.FormEvent) => {
    event.preventDefault();
    this.myBlur(event);
  };

  gtmPushSignIn = () => {
    dataLayer.push({
      event: "eventsToSend",
      eventAction: "signIn",
      eventCategory: "formSubmission",
      eventLabel: location.pathname
    });
  };
  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.myBlur(undefined, "submit");
    this.myBlurP();
    if (!this.state.highlight && !this.state.highlightp) {
      this.props
        .login(this.state.email || "", this.state.password || "", "checkout")
        .then(data => {
          this.gtmPushSignIn();
          const loginpopup = new URLSearchParams(
            this.props.history.location.search
          ).get("loginpopup");
          loginpopup == "cerise" && this.props.history.push("/");
          dataLayer.push({
            event: "checkout",
            ecommerce: {
              currencyCode: this.props.currency,
              checkout: {
                actionField: { step: 1 },
                products: this.props.basket.products
              }
            }
          });
          // this.context.closeModal();
          // this.props.nextStep?.();
        })
        .catch(err => {
          if (
            err.response.data.error_message &&
            err.response.data.error_message[0] == "NotEmail"
          ) {
            this.setState(
              {
                msg: ["No registered user found"],
                highlight: true
              },
              () => {
                valid.errorTracking(this.state.msg as string[], location.href);
              }
            );
          } else if (
            err.response.data.error_message &&
            err.response.data.error_message[0] == "MaxRetries"
          ) {
            this.setState(
              {
                showerror:
                  "You have exceeded max login attempts, please try after some time."
                // highlight: true
              },
              () => {
                valid.errorTracking([this.state.showerror], location.href);
              }
            );
          } else {
            this.setState(
              {
                showerror:
                  "Looks like either your Email ID or Password were incorrect. Please try again."
              },
              () => {
                valid.errorTracking([this.state.showerror], location.href);
              }
            );
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
      if (!this.state.isSecondStepLoginDisabled) {
        this.setState({
          isSecondStepLoginDisabled: true
        });
      }
    }
    // else if (this.state.password && this.state.password.length < 6) {
    //   if (
    //     this.state.msgp !==
    //     "Please enter at least 6 characters for the password"
    //   )
    //     this.setState({
    //       msgp: "Please enter at least 6 characters for the password",
    //       highlightp: true
    //     });
    // }
    else {
      this.setState({
        msgp: "",
        highlightp: false
      });
      if (this.state.isSecondStepLoginDisabled) {
        this.setState({
          isSecondStepLoginDisabled: false
        });
      }
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
          if (this.state.msg !== "Please enter your Email ID") {
            this.setState({
              msg: "Please enter your Email ID",
              highlight: true,
              showerror: ""
            });
          }
        } else if (!valid.checkMail(this.state.email)) {
          if (this.state.msg !== "Please enter a valid Email ID") {
            this.setState({
              msg: "Please enter a valid Email ID",
              highlight: true,
              showerror: ""
            });
          }
        } else {
          if (this.state.msg !== "") {
            this.setState({
              msg: "",
              highlight: false
            });
          }
          this.setState({
            showerror: "",
            isLoginDisabled: false
          });
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
  changeEmail = () => {
    this.setState(
      {
        showCurrentSection: "email",
        email: "",
        isLoginDisabled: true,
        showerror: "",
        password: ""
      },
      () => {
        this.firstEmailInput.current?.focus();
      }
    );
  };

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
            />
            {this.props.isBo ? (
              ""
            ) : (
              <p className={styles.loginChange} onClick={this.changeEmail}>
                Change
              </p>
            )}
          </div>
          <div>
            <InputField
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
              onClick={() => this.togglePassword()}
            >
              <img src={this.state.showPassword ? show : hide} />
            </span>
          </div>
          <div className={globalStyles.textCenter}>
            <p
              className={cs(
                styles.formSubheading,
                globalStyles.voffset3,
                globalStyles.pointer
              )}
              onClick={e => {
                this.props.goForgotPassword(
                  e,
                  (this.emailInput.current && this.emailInput.current.value) ||
                    "",
                  this.props.isBo
                );
              }}
            >
              {" "}
              FORGOT PASSWORD
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
                this.state.isSecondStepLoginDisabled
                  ? cs(globalStyles.ceriseBtn, globalStyles.disabledBtn)
                  : globalStyles.ceriseBtn
              }
              value="continue"
              disabled={this.state.isSecondStepLoginDisabled}
            />
          </div>
        </div>
      </form>
    );
    const footer = (
      <>
        <div className={globalStyles.textCenter}>
          <SocialLogin closeModel={this.context.closeModal} />
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
            <div
              className={cs(globalStyles.successMsg, globalStyles.textCenter)}
            >
              {this.state.successMsg}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
          <div className={styles.loginForm}>{currentForm()}</div>
          {this.props.isBo ? "" : footer}
        </div>
        {this.state.disableSelectedbox && <Loader />}
      </Fragment>
    );
  }
}

const MainLoginRoute = withRouter(MainLogin);
export default connect(mapStateToProps, mapDispatchToProps)(MainLoginRoute);
