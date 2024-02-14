import React, { RefObject, Fragment } from "react";
import cs from "classnames";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
// import inputStyles from "../../../components/Formsy/styles.scss";
import InputField from "../InputField";
import Loader from "components/Loader";
import SocialLogin from "../socialLogin";
// import show from "../../../images/showPass.svg";
// import hide from "../../../images/hidePass.svg";
import { Context } from "components/Modal/context";
import { checkBlank, checkMail, errorTracking } from "utils/validate";
import { connect } from "react-redux";
import { loginProps, loginState } from "./typings";
import mapDispatchToProps from "./mapper/actions";
import { AppState } from "reducers/typings";
import { RouteComponentProps, withRouter } from "react-router";
import EmailVerification from "../emailVerification";
import { USR_WITH_NO_ORDER } from "constants/messages";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import Button from "components/Button";
import { maximumOtpAttempt } from "constants/currency";

const mapStateToProps = (state: AppState) => {
  return {
    location: state.router.location,
    basket: state.basket,
    currency: state.currency,
    sortBy: state.wishlist.sortBy,
    mobile: state.device.mobile
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
      heading: "",
      subHeading: "",
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
      showCurrentSection: "email",
      showEmailVerification: false,
      usrWithNoOrder: false,
      phoneNo: "",
      isUserActive: true
    };
  }
  static contextType = Context;
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  passwordInput: RefObject<HTMLInputElement> = React.createRef();
  firstEmailInput: RefObject<HTMLInputElement> = React.createRef();
  source =
    this.props.history.location.pathname.indexOf("checkout") != -1
      ? "checkout"
      : "";
  async checkMailValidation() {
    if (this.state.email) {
      const data = await this.props.checkUserPassword(this.state.email);
      if (data.otpSent) {
        this.setState({
          showEmailVerification: true,
          usrWithNoOrder: data.usrWithNoOrder,
          phoneNo: data?.phoneNo
        });
      } else {
        if (!data.isUserActive) {
          this.setState(
            {
              showerror: data.message,
              isUserActive: data.isUserActive,
              isLoginDisabled: true
            },
            () => {
              errorTracking([this.state.showerror], location.href);
            }
          );
        } else {
          if (data.invalidDomain) {
            this.setState(
              {
                showerror: data.message
              },
              () => {
                errorTracking([this.state.showerror], location.href);
              }
            );
          } else {
            if (data.emailExist) {
              debugger;
              if (data.passwordExist) {
                if (this.props.source == "password-reset") {
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
                        !this.props.isBo &&
                        this.passwordInput.current.scrollIntoView(true);
                    }
                  );
                } else {
                  this.setState(
                    {
                      showCurrentSection: "login",
                      msg: "",
                      highlight: false,
                      successMsg: "",
                      heading: "Welcome Back!",
                      subHeading: "Enter your password to sign in."
                    },
                    () => {
                      this.passwordInput.current &&
                        this.passwordInput.current.focus();
                      this.passwordInput.current &&
                        !this.props.isBo &&
                        this.passwordInput.current.scrollIntoView(true);
                    }
                  );
                }
              } else {
                // const error = [
                //   "Looks like you are signing in for the first time. ",
                //   <br key={2} />,
                //   "Please ",
                //   <span
                //     className={cs(
                //       // globalStyles.errorMsg,
                //       globalStyles.linkTextUnderline
                //     )}
                //     key={1}
                //     onClick={this.handleResetPassword}
                //   >
                //     set a new password
                //   </span>,
                //   " to Login!"
                // ];
                if (maximumOtpAttempt == data.attempt_count)
                  this.setState({
                    msg: data.message,
                    highlight: true,
                    isLoginDisabled: true
                  });
                this.emailInput.current && this.emailInput.current.focus();
              }
            } else {
              localStorage.setItem("tempEmail", this.state.email);
              this.props.showRegister?.();
            }
          }
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
        this.props.showGrowlMessage(data.success);
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
              errorTracking([this.state.msg as string], location.href);
            }
          );
        }
      });
  };

  componentDidMount() {
    const email = this.props.email || localStorage.getItem("tempEmail");
    // const checkoutPopupCookie = CookieService.getCookie("checkoutinfopopup");
    if (email) {
      this.setState({ email, isLoginDisabled: false }, () => {
        // this.myBlur();
      });
    }
    // if (checkoutPopupCookie == "show") {
    //   this.firstEmailInput.current?.focus();
    // }
    // localStorage.removeItem("tempEmail");
    this.firstEmailInput.current?.focus();
    const autoFocus = document.getElementById("auto_focus");
    autoFocus?.focus();

    const subHeading = this.props.isCerise
      ? "Please enter your registered e-mail address to login to your Cerise account."
      : ["/cart", "/order/checkout"].includes(location.pathname)
      ? "Please enter your email to proceed."
      : "Enter your email address to register or sign in.";

    this.setState({
      heading: this.props.heading
        ? this.props.heading
        : ["/cart", "/order/checkout"].includes(location.pathname)
        ? "Continue to Checkout"
        : "Welcome",
      subHeading: this.props.subHeading || subHeading
    });
  }

  componentDidUpdate() {
    const email = localStorage.getItem("tempEmail");
    if (email) {
      this.setState({ email, isLoginDisabled: false }, () => {
        this.myBlur();
      });
    }
    localStorage.removeItem("tempEmail");
    if (this.state.usrWithNoOrder) {
      this.props.setIsSuccessMsg?.(true);
    } else {
      this.props.setIsSuccessMsg?.(false);
    }
  }

  UNSAFE_componentWillReceiveProps() {
    const email = localStorage.getItem("tempEmail");
    if (!this.state.email || this.props.email || email) {
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

  gtmPushSignIn = (data: any) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "eventsToSend",
        eventAction: "signIn",
        eventCategory: "formSubmission",
        eventLabel: location.pathname
      });
      dataLayer.push({
        event: "login",
        user_status: "logged in", //'Pass the user status ex. logged in OR guest',
        // login_method: "", //'Pass Email or Google as per user selection',
        GE_user_ID: data?.userId
      });
    }
  };
  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.myBlur(undefined, "submit");
    this.myBlurP();
    const userConsent = CookieService.getCookie("consent").split(",");

    if (!this.state.highlight && !this.state.highlightp) {
      this.props
        .login(
          this.state.email || "",
          this.state.password || "",
          this.props.currency,
          this.source,
          undefined,
          this.props.sortBy
        )
        .then(data => {
          this.gtmPushSignIn(data);
          if (userConsent.includes(GA_CALLS)) {
            Moengage.track_event("Login", {
              email: this.state.email
            });
            Moengage.add_first_name(data.firstName);
            Moengage.add_last_name(data.lastName);
            Moengage.add_email(data.email);
            Moengage.add_mobile(data.phoneNo);
            Moengage.add_gender(data.gender);
            Moengage.add_unique_user_id(this.state.email);
          }
          const loginpopup = new URLSearchParams(
            this.props.history.location.search
          ).get("loginpopup");
          loginpopup == "cerise" && this.props.history.push("/");
          if (userConsent.includes(GA_CALLS)) {
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
          }
          // this.context.closeModal();
          this.props.nextStep?.();
          // const history = this.props.history
          // const path = history.location.pathname;
          // if (path.split("/")[1] == "password-reset") {
          //   const searchParams = new URLSearchParams(history.location.search);
          //   history.push(searchParams.get("redirect_to") || "");
          // }

          // const boid = new URLSearchParams(
          //   this.props.history.location.search
          // ).get("bo_id");

          // if (boid) {
          //   this.props.history.push(`/order/checkout?bo_id=${boid}`);
          // }
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
                errorTracking(this.state.msg as string[], location.href);
              }
            );
          } else if (
            err.response.data.error_message &&
            err.response.data.error_message[0] == "Maximum attempts reached"
          ) {
            this.setState(
              {
                showerror:
                  "You have exceeded max login attempts, please try after some time."
                // highlight: true
              },
              () => {
                errorTracking([this.state.showerror], location.href);
              }
            );
          } else {
            this.setState(
              {
                showerror:
                  "Looks like either your Email ID or Password were incorrect. Please try again."
              },
              () => {
                errorTracking([this.state.showerror], location.href);
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
    } else {
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
        // do nothing, handleSubmitEmail will run
      } else {
        if (checkBlank(this.state.email)) {
          if (this.state.msg !== "Please enter your Email ID") {
            this.setState({
              msg: "Please enter your Email ID",
              highlight: true,
              showerror: ""
            });
          }
        } else if (!checkMail(this.state.email)) {
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
        this.props.setEmail?.(event.target.value);
        this.setState({ email: event.currentTarget.value });
        break;
      }
      case "password": {
        this.setState({ password: event.currentTarget.value });
        break;
      }
    }
  }

  handlePaste(event: React.ClipboardEvent<HTMLInputElement>, type: string) {
    switch (type) {
      case "email": {
        this.disablePassword();
        const pasteTxt = event.clipboardData.getData("text");
        if (!checkMail(pasteTxt)) {
          if (this.state.msg !== "Please enter a valid Email ID") {
            this.setState({
              msg: "Please enter a valid Email ID",
              highlight: true,
              showerror: ""
            });
          }
        } else {
          this.setState({
            showerror: "",
            isLoginDisabled: false
          });
        }
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
        subHeading: "Enter your email address to register or sign in.",
        heading: "Welcome",
        email: this.props.email,
        isLoginDisabled: false,
        showerror: "",
        password: "",
        showEmailVerification: false,
        usrWithNoOrder: false
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
              id="auto_focus"
              value={this.state.email || this.props.email}
              placeholder={"Email ID"}
              label={"Email ID*"}
              border={this.state.highlight}
              keyUp={e => this.handleKeyUp(e, "email")}
              handleChange={e => this.handleChange(e, "email")}
              handlePaste={e => this.handlePaste(e, "email")}
              error={this.state.msg}
              inputRef={this.firstEmailInput}
              showLabel={true}
            />
          </div>
          <div className={styles.loginForm}>
            {this.state.showerror ? (
              <p className={cs(styles.errorMsg, styles.mainLoginError)}>
                {this.state.showerror}
                {!this.state.isUserActive && (
                  <a
                    className={cs(styles.underlineText)}
                    href="mailto:customercare@goodearth.in"
                    key="email"
                  >
                    customercare@goodearth.in
                  </a>
                )}
              </p>
            ) : (
              ""
            )}
            <Button
              type="submit"
              className={cs({ [globalStyles.btnFullWidth]: this.props.mobile })}
              label="continue"
              disabled={this.state.isLoginDisabled}
              variant="mediumMedCharcoalCta366"
            />
          </div>
        </div>
      </form>
    );
  };

  goLogin = () => {
    this.setState({
      showEmailVerification: false,
      showCurrentSection: "email",
      isLoginDisabled: true,
      showerror: "",
      password: "",
      usrWithNoOrder: false
    });
  };

  render() {
    const formContent = (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div className={styles.categorylabel}>
          <div>
            <InputField
              value={this.state.email}
              placeholder={"Email ID"}
              label={"Email ID*"}
              border={this.state.highlight}
              error={this.state.msg}
              inputRef={this.emailInput}
              disable={this.state.isPasswordDisabled}
              disablePassword={this.disablePassword}
              showLabel={true}
            />
          </div>
          {/* <div>
            <InputField
              placeholder={""}
              value={this.state.password}
              keyUp={e => this.handleKeyUp(e, "password")}
              handleChange={e => this.handleChange(e, "password")}
              handlePaste={e => this.handlePaste(e, "password")}
              label={"Password*"}
              border={this.state.highlightp}
              inputRef={this.passwordInput}
              isPlaceholderVisible={this.state.isPasswordDisabled}
              error={this.state.msgp}
              type={this.state.showPassword ? "text" : "password"}
              className={inputStyles.password}
              showLabel={true}
            />
            <span
              className={styles.togglePasswordBtn}
              onClick={() => this.togglePassword()}
            >
              <img src={this.state.showPassword ? show : hide} />
            </span>
          </div>
          <div className={globalStyles.textRight}>
            <span
              className={cs(styles.forgotPassword, globalStyles.pointer)}
              onClick={e => {
                this.props.goForgotPassword(
                  e,
                  (this.emailInput.current && this.emailInput.current.value) ||
                    "",
                  this.props.isBo
                );
              }}
            >
              FORGOT PASSWORD
            </span>
          </div> */}
          <div>
            {this.state.showerror ? (
              <p className={cs(styles.errorMsg, styles.mainLoginError)}>
                {this.state.showerror}
              </p>
            ) : (
              ""
            )}
            <Button
              type="submit"
              className={globalStyles.btnFullWidth}
              label="Login to my account"
              disabled={this.state.isSecondStepLoginDisabled}
              variant="largeMedCharcoalCta"
            />
            {this.props.isBo ? (
              ""
            ) : (
              <Button
                type="submit"
                className={cs(styles.changeEmailBtn, {
                  [globalStyles.btnFullWidth]: this.props.mobile
                })}
                label="Go Back"
                onClick={this.changeEmail}
                variant="outlineMediumMedCharcoalCta366"
              />
            )}
          </div>
        </div>
      </form>
    );
    const footer = (
      <>
        <div className={cs(globalStyles.textCenter, styles.socialLogin)}>
          <SocialLogin closeModel={this.context.closeModal} />
        </div>
      </>
    );

    const currentForm = () => {
      // const { showCurrentSection } = this.state;
      // if (showCurrentSection == "email") {
      return this.emailForm();
      // } else if (showCurrentSection == "login") {
      //   return formContent;
      // }
    };

    return (
      <Fragment>
        {this.state.showEmailVerification ? (
          <EmailVerification
            email={this.state.email || ""}
            successMsg={this.state.usrWithNoOrder ? USR_WITH_NO_ORDER : ""}
            changeEmail={this.changeEmail}
            goLogin={this.goLogin}
            // socialLogin={footer}
            setIsSuccessMsg={this.props.setIsSuccessMsg}
            products={this.props.basket.products}
            currency={this.props.currency}
            nextStep={this.props.nextStep}
            sortBy={this.props.sortBy}
            phoneNo={this.state.phoneNo}
          />
        ) : (
          <>
            {this.state.successMsg && (
              <div className={cs(styles.successMsg, globalStyles.textCenter)}>
                {this.state.successMsg}
              </div>
            )}
            {this.state.heading && (
              <div className={styles.formHeading}>{this.state.heading}</div>
            )}
            {this.props.heading2 && (
              <>
                <div className={styles.para}>{this.props.heading2}</div>
                <br />
              </>
            )}
            <div className={styles.loginFormSubheading}>
              {this.state.subHeading}
            </div>
            <div>
              <div className={styles.loginForm}>{currentForm()}</div>
              {this.props.isBo ? "" : footer}
            </div>
            {this.state.disableSelectedbox && <Loader />}
          </>
        )}
      </Fragment>
    );
  }
}

const MainLoginRoute = withRouter(MainLogin);
export default connect(mapStateToProps, mapDispatchToProps)(MainLoginRoute);
