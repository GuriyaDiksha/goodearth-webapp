import React, { RefObject, Fragment } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { otpProps, otpState } from "./typings";
import globalStyles from "styles/global.scss";
import Formsy from "formsy-react";
import { Link } from "react-router-dom";
import FormCheckbox from "components/Formsy/FormCheckbox";
import FormInput from "components/Formsy/FormInput";
import { errorTracking, decriptdata } from "utils/validate";
import CustomerCareInfo from "components/CustomerCareInfo";
import Loader from "components/Loader";
import NewOtpComponent from "./NewOtpComponent";
import Button from "components/Button";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { censorPhoneNumber } from "utils/utility";
class OtpCompActivateGC extends React.Component<otpProps, otpState> {
  constructor(props: otpProps) {
    super(props);
    this.state = {
      disable: props.disableSendOtpButton && true,
      msgt: "",
      showFields: false,
      radioType: "",
      subscribeError: "",
      otpTimer: 0,
      otpData: {},
      updateStatus: false,
      showerror: "",
      showerrorOtp: "",
      otp: "",
      toggleOtp: false,
      isLoading: false,
      otpLimitError: false,
      phoneInput: "",
      emailInput: "",
      attempts: {
        attempts: 0,
        maxAttemptsAllow: 5
      },
      startTimer: true,
      isDisabled: false,
      attempt_count: 0,
      selectedOption: "email",
      activatedPhoneNo: ""
    };
  }
  // timerId: any = 0;
  emailRef: RefObject<typeof FormInput> = React.createRef();
  RegisterFormRef: RefObject<Formsy> = React.createRef();
  RegisterFormRef1: RefObject<Formsy> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  subscribeRef: RefObject<HTMLInputElement> = React.createRef();
  phoneInput: RefObject<HTMLInputElement> = React.createRef();
  lastNameInput: RefObject<HTMLInputElement> = React.createRef();

  resetSection = () => {
    this.setState({
      showFields: false
    });
  };

  onMailChange = (event: any) => {
    const value = event.target.value;
    if (this.RegisterFormRef.current) {
      this.RegisterFormRef.current.updateInputsWithValue({
        email: value
      });
      this.setState({ emailInput: "" });
    }
  };

  UNSAFE_componentWillReceiveProps = (nextProps: otpProps) => {
    if (this.props.toggleReset !== nextProps.toggleReset) {
      this.clickHereOtpInvalid();
    }
    if (nextProps.disableSendOtpButton != this.props.disableSendOtpButton) {
      this.setState({ disable: nextProps.disableSendOtpButton });
    }
  };

  componentDidMount = () => {
    this.props.isIndiaGC
      ? this.phoneInput.current && this.phoneInput.current.focus()
      : this.phoneInput.current && this.phoneInput.current.focus();

    this.setState({
      phoneInput: this.props.phoneNo || "",
      emailInput: this.props.email || ""
    });
  };

  changeAttepts = (value: any) => {
    this.setState({ attempts: value });
  };

  handleSubmit2 = (model: any, resetForm: any, updateInputsWithError: any) => {
    const { email } = model;
    const { phoneNo } = this.RegisterFormRef.current?.getModel();
    const data: any = {};
    const radioElement: any = this.props.isCredit
      ? document.getElementsByName("cca")
      : document.getElementsByName("gca");
    const elem = this.subscribeRef.current;
    if (!radioElement[0].checked && !radioElement[1].checked) {
      this.setState(
        {
          msgt:
            "Please select at least one mode of communication for OTP verification of your gift card"
        },
        () => {
          errorTracking([this.state.msgt], location.href);
        }
      );
      const errorElem = document.getElementById(
        "selectError"
      ) as HTMLParagraphElement;
      errorElem.scrollIntoView({ block: "center", behavior: "smooth" });
      if (elem && elem.checked == false) {
        this.setState(
          {
            subscribeError: "Please accept the terms & conditions"
          },
          () => {
            errorTracking([this.state.subscribeError], location.href);
          }
        );
      }
      return false;
    }
    if (elem && elem.checked == false) {
      this.setState(
        {
          subscribeError: "Please accept the terms & conditions"
        },
        () => {
          errorTracking([this.state.subscribeError], location.href);
        }
      );
      return false;
    }
    data["email"] = email;
    if (this.state.radioType == "number") {
      data["phoneNo"] = "+91" + phoneNo;
    }
    data["inputType"] = "CNI";
    data["code"] = this.props.txtvalue;
    // data["otpTo"] =
    //   this.state.radioType == "number" ? "phoneno" : this.state.radioType;
    this.sendOtpApiCall(data, false);
  };

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    this.setState({ showerrorOtp: "" });
    if (this.props.otpFor == "activateGC") {
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "otp_send",
          gift_card_code: this.props.txtvalue
        });
      }

      if (
        !this.props.firstName ||
        !this.props.lastName ||
        !this.props.txtvalue
      ) {
        this.props.validateEmptyInputs && this.props.validateEmptyInputs();
        return false;
      }
    }

    const elem = this.subscribeRef.current;
    const { email } = model;
    const data: any = {};
    if (!this.props.txtvalue) {
      this.props.updateError(
        `Please enter a valid ${
          this.props.isCredit ? "Credit Note" : "Gift Card"
        } code`
      );
      errorTracking(
        [
          `Please enter a valid ${
            this.props.isCredit ? "Credit Note" : "Gift Card"
          } code`
        ],
        location.href
      );
      return false;
    }

    if (this.props.isCredit && this.RegisterFormRef1.current) {
      this.RegisterFormRef1.current.submit();
      return false;
    }

    if (elem && elem.checked == false) {
      this.setState(
        {
          subscribeError: "Please accept the terms & conditions"
        },
        () => {
          errorTracking([this.state.subscribeError], location.href);
        }
      );
      return false;
    }

    //**** both email and phone option for INR GC
    // if (
    //   this.props.code == "91" &&
    //   this.state.selectedOption == "mobile number"
    // ) {
    //   data["phoneNo"] = "+91" + this.props.phoneNo;
    // } else {
    //   data["email"] = email;
    // }
    data["code"] = this.props.txtvalue;
    data["email"] = email;

    // data["inputType"] = "GIFT";
    // data["otpTo"] = "email";
    // data["otpTo"] =
    // this.props.code == "91" && this.state.selectedOption == "mobile number"
    //   ? "phoneno"
    //   : "email";

    if (this.props.otpFor == "activateGC") {
      data["firstName"] = this.props.firstName;
      data["lastName"] = this.props.lastName;
      // this.sendOtpApiCall(data);
    }
    this.sendOtpApiCall(data, false);

    // apply GA events on click of send OTP CTA
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "otp_send",
        gift_card_code: this.props.txtvalue
      });
    }
  };

  chkTermsandC = (event: React.ChangeEvent) => {
    const elem = this.subscribeRef.current;
    if (elem && elem.checked == false) {
      this.setState({
        subscribeError: "Please accept the terms & conditions"
      });
    } else {
      this.setState({
        subscribeError: "",
        showerrorOtp: ""
      });
    }
  };

  activateGiftCardGTM = (): void => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "gift_card_activated",
        gift_card_code: this.props.txtvalue
      });
    }
  };

  checkOtpValidation = (value: any) => {
    const { otpData } = this.state;
    const newData = otpData;
    newData["otp"] = value;
    delete newData["inputType"];
    this.setState({ otp: value, showerror: "" });
    if (this.props.otpFor == "activateGC") {
      this.props.activateGiftCard &&
        this.props
          .activateGiftCard(newData)
          .then(data => {
            // if(res.currStatus) {
            if (data.message) {
              this.setState(
                {
                  showerror: data.message,
                  disable: true,
                  attempts: {
                    attempts: data?.attempts || 0,
                    maxAttemptsAllow: data?.maxAttemptsAllow || 5
                  }
                },
                () => {
                  errorTracking([this.state.showerror], location.href);
                }
              );
            } else {
              this.props.updateList(data);
              // Add an event handler for when the user clicks on the 'Activate Gift Card' button. This handler should ensure the gift card is activated successfully.
              this.activateGiftCardGTM();
              this.setState({
                toggleOtp: true,
                // radioType: "",
                showerrorOtp: "",
                showerror: "",
                disable: true
              });
            }
            // this.props.toggleOtp(false);
            // }
          })
          .catch(error => {
            const data = decriptdata(error.response?.data);
            this.setState({
              attempts: {
                attempts: data?.attempts || 0,
                maxAttemptsAllow: data?.maxAttemptsAllow || 5
              }
            });
            if (data.error_message) {
              let errorMsg = data.error_message[0];
              if (errorMsg == "MaxRetries") {
                errorMsg =
                  "You have exceeded max attempts, please try after some time.";
              }
              this.setState(
                {
                  showerror: errorMsg,
                  updateStatus: false,
                  disable: true
                },
                () => {
                  errorTracking(
                    [this.state.showerror as string],
                    location.href
                  );
                }
              );
            } else {
              this.setState(
                {
                  showerror: data.message,
                  updateStatus: false,
                  disable: true
                },
                () => {
                  errorTracking([this.state.showerror], location.href);
                }
              );
              if (data.expiry) {
                this.setState({
                  isDisabled: true
                });
              }
            }
          })
          .finally(() => {
            // this.clearTimer();
          });
    } else {
      this.props
        .checkOtpBalance(newData)
        .then((response: any) => {
          this.props.updateList(response);
          this.setState({
            toggleOtp: false,
            radioType: "",
            showerrorOtp: "",
            showerror: "",
            disable: true
          });
          this.props.toggleOtp(false);
        })
        .catch((error: any) => {
          if (error.response.data.error_message) {
            let errorMsg = error.response.data.error_message[0];
            if (errorMsg == "MaxRetries") {
              errorMsg =
                "You have exceeded max attempts, please try after some time.";
            }
            this.setState(
              {
                showerror: errorMsg,
                updateStatus: false,
                disable: true
              },
              () => {
                errorTracking([this.state.showerror as string], location.href);
              }
            );
          } else {
            this.setState(
              {
                showerror: error.response.data.message,
                updateStatus: false,
                disable: true
              },
              () => {
                errorTracking([this.state.showerror], location.href);
              }
            );
          }
        })
        .finally(() => {
          // this.clearTimer();
        });
    }
  };

  // timer = () => {
  //   this.setState({
  //     otpTimer: 90
  //   });
  //   this.timerId = setInterval(() => {
  //     this.decrementTimeRemaining();
  //   }, 1000);
  // };

  // decrementTimeRemaining() {
  //   if (this.state.otpTimer > 0) {
  //     this.setState({
  //       otpTimer: this.state.otpTimer - 1
  //     });
  //   } else {
  //     clearInterval(this.timerId);
  //   }
  // }

  // clearTimer() {
  //   clearInterval(this.timerId);
  //   this.setState({
  //     otpTimer: 0
  //   });
  // }

  clickHereOtpInvalid = () => {
    this.props.toggleOtp(false);
    this.setState({
      toggleOtp: false,
      radioType: "",
      showerrorOtp: "",
      showerror: "",
      updateStatus: false,
      disable: true
    });
    // this.setState({
    //     receivedOtp: false,
    //     hideOtp: false,
    //     showerror_otp: false,
    //     showerror: '',
    //     email: '',
    //     phone: '',
    //     disable: true,
    //     inputBox: true,
    //     hideInputBox: false,
    //     txtvalue: '',
    //     subscribe: false
    // });
    // this.otp_to = '';
  };

  onChangeotp = () => {
    if (this.state.otp.length == 6) {
      this.setState({
        updateStatus: true
      });
    } else {
      this.setState({
        updateStatus: false,
        showerror: ""
      });
    }
  };

  getOtpValue = (value: string) => {
    this.setState(
      {
        otp: value
      },
      () => {
        this.onChangeotp();
      }
    );
  };

  sendOtpApiCall = (formData: any, isResendOtp: boolean) => {
    this.setState({
      disable: true,
      isLoading: true,
      showerror: ""
    });
    this.props
      .sendOtp(formData)
      .then((data: any) => {
        this.setState({
          attempts: {
            ...this.state.attempts,
            ["attempts"]: data?.attempt_count || 0
          }
        });
        if (data.inputType == "GIFT" && data.currStatus == "Invalid-CN") {
          this.setState(
            {
              showerrorOtp: "Invalid Gift Card Code"
            },
            () => {
              const errorElem = document.getElementById("customererror");
              errorElem?.scrollIntoView({
                block: "center",
                behavior: "smooth"
              });
              errorTracking([this.state.showerrorOtp], location.href);
            }
          );
        } else if (data.currStatus == "Invalid-CN") {
          this.props.updateError(
            `Please enter a valid ${
              this.props.isCredit ? "Credit Note" : "Gift Card"
            } code`
          );
          errorTracking(
            [
              `Please enter a valid ${
                this.props.isCredit ? "Credit Note" : "Gift Card"
              } code`
            ],
            location.href
          );
        } else {
          this.setState(
            {
              toggleOtp: true,
              otpData: formData,
              activatedPhoneNo: data.sms_sent && data.phoneNo
            },
            () => {
              // this.timer();
              this.props.toggleOtp(true);
              this.props.updateError("");
              // document.getElementById("otp-comp").scrollIntoView();
            }
          );
        }
      })
      .catch((error: any) => {
        const {
          status,
          currStatus,
          message,
          email,
          otpLimitExceeded
        } = decriptdata(error.response.data);
        if (!status) {
          if (currStatus == "Invalid-CN") {
            let errorMessage = `Please enter a valid ${
              this.props.isCredit ? "Credit Note" : "Gift Card"
            } code`;
            if (message) {
              errorMessage = message;
            }
            this.props.updateError(errorMessage);
            errorTracking([errorMessage], location.href);
          } else if (currStatus == "Active" || currStatus == "Expired") {
            this.props.updateError(message);
            errorTracking([message], location.href);
          } else if (email) {
            this.RegisterFormRef1.current?.updateInputsWithError({ email });
            const elem: any = document.getElementById("creditNoteEmail");
            elem.scrollIntoView();
            window.scrollBy(0, -200);
            elem.focus();
          } else {
            if (message) {
              if (otpLimitExceeded) {
                this.setState({
                  otpLimitError: true
                });
              }
              if (isResendOtp) {
                this.setState(
                  {
                    showerror: message
                  },
                  () => {
                    const errorElem = document.getElementById(
                      "resend-otp-error"
                    );
                    errorElem?.scrollIntoView({
                      block: "center",
                      behavior: "smooth"
                    });
                    errorTracking([this.state.showerror], location.href);
                  }
                );
              } else {
                this.setState(
                  {
                    showerrorOtp: message
                  },
                  () => {
                    const errorElem = document.getElementById("customererror");
                    errorElem?.scrollIntoView({
                      block: "center",
                      behavior: "smooth"
                    });
                    errorTracking([this.state.showerrorOtp], location.href);
                  }
                );
              }
            }
          }
        }
        // this.setState({
        //   showerror: "Server Error"
        // });
      })
      .finally(() => {
        this.setState({
          disable: false,
          isLoading: false
        });
      });
  };

  resendOtp = () => {
    // this.clearTimer();
    this.setState({
      isDisabled: false
    });
    this.sendOtpApiCall(this.state.otpData, true);
  };

  secondsToMints = (seconds: number) => {
    // day, h, m and s
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return minutes + ":" + seconds;
  };

  getValidationForOtp = () => {
    const { otpData } = this.state;
    return (
      <div>
        <div
          className={cs(
            globalStyles.textLeft,
            // globalStyles.voffset4,
            styles.otpFormat
          )}
          id="otp-comp"
        >
          {this.props.otpFor == "activateGC" && (
            <>
              <p
                className={cs(
                  globalStyles.op2,
                  globalStyles.bold,
                  globalStyles.voffset2,
                  styles.lineHead
                )}
              >
                FIRST NAME
              </p>
              <p className={styles.line}>{this.props.firstName}</p>
              <p
                className={cs(
                  globalStyles.op2,
                  globalStyles.bold,
                  globalStyles.voffset2,
                  styles.lineHead
                )}
              >
                LAST NAME
              </p>
              <p className={styles.line}>{this.props.lastName}</p>
            </>
          )}
          <p
            className={cs(
              globalStyles.op2,
              globalStyles.bold,
              globalStyles.voffset2,
              styles.lineHead
            )}
          >
            {this.props.otpFor == "balanceCN"
              ? "CREDIT NOTE"
              : "GIFT CARD CODE"}
          </p>
          <p className={styles.line}>{this.props.txtvalue}</p>

          {/* {this.props.code != "91" && (
            <p className={globalStyles.voffset2}>
              <p
                className={cs(
                  globalStyles.op2,
                  globalStyles.bold,
                  styles.lineHead
                )}
              >
                {" "}
                OTP SENT TO EMAIL ADDRESS:
              </p>{" "}
              <p className={cs(styles.overflowEmail, styles.line)}>
                {otpData.email}
              </p>
            </p>
          )}

          {this.props.code == "91" &&
            (this.state.selectedOption &&
            this.state.selectedOption == "mobile number" ? (
              <p className={globalStyles.voffset2}>
                <p
                  className={cs(
                    globalStyles.op2,
                    globalStyles.bold,
                    styles.lineHead
                  )}
                >
                  OTP SMS SENT TO MOBILE NUMBER:
                </p>{" "}
                <p className={styles.line}>{otpData.phoneNo}</p>
              </p>
            ) : (
              <p className={globalStyles.voffset2}>
                <p
                  className={cs(
                    globalStyles.op2,
                    globalStyles.bold,
                    styles.lineHead
                  )}
                >
                  {" "}
                  OTP SENT TO EMAIL ADDRESS:
                </p>{" "}
                <p className={cs(styles.overflowEmail, styles.line)}>
                  {otpData.email}
                </p>
              </p>
          ))} */}

          {otpData.email && (
            <p className={globalStyles.voffset2}>
              <p
                className={cs(
                  globalStyles.op2,
                  globalStyles.bold,
                  styles.lineHead
                )}
              >
                {" "}
                OTP SENT TO EMAIL ADDRESS:
              </p>{" "}
              <p className={cs(styles.overflowEmail, styles.line)}>
                {otpData.email}
              </p>
            </p>
          )}

          {this.state.activatedPhoneNo && (
            <p className={globalStyles.voffset2}>
              <p
                className={cs(
                  globalStyles.op2,
                  globalStyles.bold,
                  styles.lineHead
                )}
              >
                OTP SMS SENT TO MOBILE NUMBER:
              </p>{" "}
              <p className={styles.line}>
                {censorPhoneNumber(`+91${this.state.activatedPhoneNo}`)}
              </p>
            </p>
          )}

          {this.props.activatedGcMsg && (
            <p className={styles.activatedGcMsg}>{this.props.activatedGcMsg}</p>
          )}
        </div>
        <hr />
        {(this.props.otpFor == "activateGC"
          ? this.props.newCardBox == true
            ? true
            : false
          : true) && (
          <>
            <NewOtpComponent
              // otpSentVia={this.props.isIndiaGC ? "mobile number" : "email"}
              // otpSentVia={"email"}
              otpSentVia={
                // this.props.code == "91" ? this.state.selectedOption : "email 111"
                // this.props.isIndiaGC ? this.state.selectedOption : "email"
                otpData.email && this.state.activatedPhoneNo
                  ? "Email ID & Mobile No"
                  : "Email ID"
              }
              resendOtp={this.resendOtp}
              verifyOtp={this.checkOtpValidation}
              errorMsg={this.state.showerror}
              attempts={this.state.attempts}
              btnText={
                this.props.otpFor == "activateGC"
                  ? "Activate Gift Card"
                  : "Check Balance"
              }
              startTimer={this.state.startTimer}
              setAttempts={this.changeAttepts}
              uniqueId="activategcid"
              containerClassName={styles.otpWrapperGc}
              disabled={this.state.isDisabled}
              txtvalue={this.props.txtvalue}
            />
            <hr />
          </>
        )}
      </div>
    );
  };

  handleInvalidSubmit2 = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 0);
  };

  handleInvalidSubmit = () => {
    if (this.props.otpFor == "activateGC") {
      if (
        !this.props.firstName ||
        !this.props.lastName ||
        !this.props.txtvalue
      ) {
        this.props.validateEmptyInputs && this.props.validateEmptyInputs();
        return false;
      }
    }
  };

  radioChangeHandler = (e: any) => {
    this.setState({
      selectedOption: e.target.value
    });
  };

  render() {
    const { toggleOtp } = this.state;

    return (
      <Fragment>
        {toggleOtp || this.props.newCardBox == false ? (
          this.getValidationForOtp()
        ) : (
          <div
            className={cs(
              styles.sendOtpForm,
              styles.loginForm,
              styles.activategc
            )}
            id="gc-input"
          >
            {this.props.isCredit ? (
              <Formsy
                ref={this.RegisterFormRef1}
                onChange={() => {
                  this.state.disable && this.setState({ disable: false });
                }}
                onValidSubmit={this.handleSubmit2}
                onInvalidSubmit={this.handleInvalidSubmit2}
              >
                <FormInput
                  name="email"
                  id="creditNoteEmail"
                  placeholder={"Email Address"}
                  label={"Email Address"}
                  className={cs(styles.relative, globalStyles.voffset2)}
                  handleChange={this.onMailChange}
                  value={this.props.email ? this.props.email : ""}
                  validations={{
                    isEmail: true,
                    maxLength: 75
                  }}
                  validationErrors={{
                    isEmail: "Please enter a valid Email ID",
                    maxLength:
                      "You are allowed to enter upto 75 characters only"
                  }}
                  required={true}
                />
              </Formsy>
            ) : (
              ""
            )}
            <li>
              <hr />
            </li>
            <li className={cs(globalStyles.textLeft, styles.otpText)}>
              Send{" "}
              <span className={styles.aquaBold}> One Time Passowrd (OTP) </span>
              Via:
            </li>
            <Formsy
              ref={this.RegisterFormRef}
              onChange={() => {
                this.state.disable && this.setState({ disable: false });
              }}
              onValidSubmit={this.handleSubmit}
              onInvalidSubmit={this.handleInvalidSubmit}
            >
              {/* {!this.props.isIndiaGC && ( */}
              <li
                className={cs(styles.radiobtn1, styles.xradio, {
                  [styles.emailInput]:
                    this.props.isLoggedIn &&
                    (this.props.code == "" || this.props.code == "91")
                  // this.props.isLoggedIn && this.props.isIndiaGC
                })}
              >
                {/*  ------ Hide Radio button option  -------- */}
                {/* {this.props.isLoggedIn &&
                  (this.props.code == "" || this.props.code == "91") && (
                    <input
                      type="radio"
                      value="email"
                      id="Email"
                      name="radio-group"
                      checked={this.state.selectedOption === "email"}
                      onChange={this.radioChangeHandler}
                    />
                    // ) : (
                    // <div className={styles.placeholderRadio}>
                    //   <div className={styles.outer}></div>
                    //   <div className={styles.inner}></div>
                    // </div>
                  )} */}

                <FormInput
                  name="email"
                  placeholder={"Email*"}
                  label={"Email*"}
                  className={cs(
                    styles.relative,
                    styles.smallInput,
                    styles.customRadioBtn
                    // styles.disabledInp
                  )}
                  // disable={this.props.isCredit}
                  disable={this.props.email ? true : false}
                  inputRef={this.emailInput}
                  value={this.props.email ? this.props.email : ""}
                  handleChange={e =>
                    this.setState({ emailInput: e.target.value })
                  }
                  // validations={
                  //   !this.props.isIndiaGC
                  //     ? {
                  //         isEmail: true,
                  //         maxLength: 75
                  //       }
                  //     : {}
                  // }
                  validations={{
                    isEmail: true,
                    maxLength: 75
                  }}
                  validationErrors={{
                    isEmail: "Please enter a valid Email ID",
                    maxLength:
                      "You are allowed to enter upto 75 characters only"
                  }}
                  // required={
                  //   this.props.isIndiaGC || this.props.isCredit
                  //     ? "isFalse"
                  //     : true
                  // }
                  required={true}
                />
              </li>
              {/* )} */}

              {this.props.isLoggedIn &&
                (this.props.code == "" || this.props.code == "91") && (
                  <li
                    className={cs(
                      styles.countryCode,
                      styles.countryCodeGc,
                      styles.xradio
                    )}
                  >
                    {/*  ------ Hide Radio button option  -------- */}
                    {/* <input
                      type="radio"
                      value="mobile number"
                      id="Contact Number"
                      name="radio-group"
                      checked={this.state.selectedOption === "mobile number"}
                      onChange={this.radioChangeHandler}
                      disabled={!this.props.phoneNo ? true : false}
                    /> */}
                    <div
                      className={cs(styles.flex, styles.customRadioBtn, {
                        [styles.disabledRadio]: !this.props.phoneNo
                      })}
                    >
                      <div className={styles.contactCode}>
                        <input
                          type="text"
                          value={this.props.code ? `+${this.props.code}` : ""}
                          placeholder="Code"
                          disabled={true}
                          className={styles.codeInput}
                        />
                      </div>
                      <div className={styles.contactNumber}>
                        <FormInput
                          name="phoneNo"
                          value={this.props.phoneNo ? this.props.phoneNo : ""}
                          inputRef={this.phoneInput}
                          placeholder={"Contact Number"}
                          type="number"
                          label={"Contact Number"}
                          handleChange={e =>
                            this.setState({ phoneInput: e.target.value })
                          }
                          validations={
                            // this.props.isIndiaGC
                            this.props.code && this.props.code == "91"
                              ? {
                                  isLength: 10
                                }
                              : {}
                          }
                          validationErrors={{
                            isLength: "Phone number should be 10 digit"
                          }}
                          // required={!this.props.isIndiaGC ? "isFalse" : true}
                          required={
                            this.props.code && this.props.code == "91"
                              ? true
                              : false
                          }
                          keyDown={e =>
                            e.which === 69 ? e.preventDefault() : null
                          }
                          onPaste={e =>
                            e?.clipboardData.getData("Text").match(/([e|E])/)
                              ? e.preventDefault()
                              : null
                          }
                          disable={true}
                        />
                      </div>
                      <p id="selectError" className={cs(styles.errorMsg)}>
                        {this.state.msgt}
                      </p>
                    </div>
                    {this.props.code == "" && (
                      <p className={cs(styles.errorMsg, styles.phErrMsg)}>
                        Phone number is missing in your profile. Please update
                        it in the profile section.
                      </p>
                    )}
                  </li>
                )}
              <hr />
              <li className={styles.note}>
                <div>Please Note:</div>
                <ul>
                  <li>All digital Gift Cards can be activated here.</li>
                  <li>
                    For physical cards issued prior to 01.08.21, please contact
                    Customer care or visit store.
                  </li>
                </ul>
              </li>
              <li className={cs(styles.subscribe, styles.subscribeGc)}>
                <FormCheckbox
                  value={false}
                  id={"subscribe_" + this.props.isCredit}
                  name="terms"
                  disable={false}
                  inputRef={this.subscribeRef}
                  handleChange={this.chkTermsandC}
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
                <div>
                  <p
                    className={
                      this.state.subscribeError
                        ? cs(styles.errorMsg, globalStyles.wordCap)
                        : globalStyles.hidden
                    }
                  >
                    Please agree to the Terms and Conditions before proceeding
                  </p>
                  {this.state.showerrorOtp &&
                    !this.state.showerrorOtp?.includes(
                      "Maximum attempts reached"
                    ) && (
                      <p
                        id="customererror"
                        className={
                          this.state.showerrorOtp
                            ? cs(styles.errorMsg, globalStyles.wordCap)
                            : globalStyles.hidden
                        }
                      >
                        {this.state.showerrorOtp}
                      </p>
                    )}
                  <p>{this.state.showerrorOtp ? <CustomerCareInfo /> : ""}</p>
                </div>
              </li>

              <li className={this.state.showerrorOtp ? styles.margintop : ""}>
                {this.state.showerrorOtp &&
                  this.state.showerrorOtp?.includes(
                    "Maximum attempts reached"
                  ) && (
                    <p
                      id="customererror"
                      className={
                        this.state.showerrorOtp
                          ? cs(
                              styles.errorMsg,
                              globalStyles.wordCap,
                              globalStyles.marginB10
                            )
                          : globalStyles.hidden
                      }
                    >
                      {this.state.showerrorOtp}
                    </p>
                  )}
                <Button
                  type="submit"
                  onClick={() =>
                    this.props.isLoggedIn &&
                    // this.props.isIndiaGC &&
                    !this.props.phoneNo
                      ? this.handleSubmit({ email: this.state.emailInput })
                      : null
                  }
                  disabled={
                    this.state.disable ||
                    !this.subscribeRef.current?.checked ||
                    (!this.props.isIndiaGC && this.state.emailInput == "") ||
                    (this.props.isCredit && this.state.emailInput == "")
                  }
                  label="Send otp"
                  variant="mediumMedCharcoalCta366"
                />
              </li>
            </Formsy>
          </div>
        )}
        {this.state.isLoading && <Loader />}
      </Fragment>
    );
  }
}

export default OtpCompActivateGC;
