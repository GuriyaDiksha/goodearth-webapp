import React, { RefObject, Fragment } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { otpRedeemProps, otpState } from "./typings";
// import { Currency, currencyCode } from "typings/currency";
import globalStyles from "styles/global.scss";
// import OtpBox from "./otpBox";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import Loader from "components/Loader";
import { errorTracking } from "utils/validate";
import NewOtpComponent from "./NewOtpComponent";

class OtpReedem extends React.Component<otpRedeemProps, otpState> {
  constructor(props: otpRedeemProps) {
    super(props);
    this.state = {
      disable: false,
      msgt: "",
      showFields: false,
      radioType: "",
      subscribeError: "",
      otpTimer: 0,
      otpData: {},
      isResendOtpDisabled: true,
      updateStatus: false,
      showerror: "",
      showerrorOtp: "",
      otp: "",
      toggleOtp: false,
      isLoading: false,
      attempts: {
        attempts: 0,
        maxAttemptsAllow: 5
      },
      startTimer: true,
      isOtpSent: false
    };
  }
  // timerId: any = 0;
  emailRef: RefObject<typeof FormInput> = React.createRef();
  RegisterFormRef: RefObject<Formsy> = React.createRef();
  RegisterFormRef1: RefObject<Formsy> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  phoneInput: RefObject<HTMLInputElement> = React.createRef();
  lastNameInput: RefObject<HTMLInputElement> = React.createRef();

  UNSAFE_componentWillReceiveProps(nextProps: otpRedeemProps) {
    if (
      nextProps.redeemOtpError !== this.props.redeemOtpError ||
      nextProps.redeemOtpError !== ""
    ) {
      this.setState({ showerror: nextProps.redeemOtpError });
    }
  }

  resetSection = () => {
    this.setState({
      showFields: false
    });
  };

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    this.setState({ showerrorOtp: "" });
    // const radioElement: any = document.getElementsByName("redeem");
    // const elem = this.subscribeRef.current;
    // const { email, phoneNo } = model;
    const data: any = {};
    // if (!radioElement[0].checked && !radioElement[1].checked) {
    //   this.setState(
    //     {
    //       msgt:
    //         "Please select at least one mode of communication for OTP verification of your gift card"
    //     },
    //     () => {
    //       valid.errorTracking([this.state.msgt], location.href);
    //     }
    //   );
    //   return false;
    // }

    if (!this.props.points) {
      this.props.updateError(true);
      return false;
    }

    if (this.props.isCredit && this.RegisterFormRef1.current) {
      this.RegisterFormRef1.current.submit();
      return false;
    }
    // if (this.state.radioType == "email") {
    //   data["email"] = email;
    // } else {
    //   data["phoneNo"] = "+91" + phoneNo;
    // }
    // data["inputType"] = "GIFT";
    data["points"] = this.props.points;
    // this.setState({ startTimer: true });
    this.sendOtpApiCall(data);
  };

  onClickRadio = (event: any) => {
    this.setState({
      radioType: event.target.value,
      msgt: "",
      disable: false
    });
  };

  checkOtpValidation = (value: any) => {
    const { otpData } = this.state;
    if (!this.props.points) {
      this.props.updateError(true);
      return false;
    }
    // if (!this.state.otpData["points"]) {
    //   return false;
    // }
    const newData = otpData;
    newData["otp"] = value;

    this.setState({
      isLoading: true,
      otp: value,
      showerror: ""
    });
    this.props.checkOtpRedeem &&
      this.props
        .checkOtpRedeem(newData, this.props.history, this.props.isLoggedIn)
        .then(data => {
          if (data.message) {
            this.setState(
              {
                showerror: data.message,
                isLoading: false,
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
            // this.props.updateList(data);
            this.setState({
              toggleOtp: true,
              showerrorOtp: "",
              showerror: "",
              isLoading: false
            });
          }
          this.props.setIsOTPSent(false);
        })
        .catch(err => {
          this.setState(
            {
              showerror: err.response.data.message,
              isLoading: false,
              attempts: {
                attempts: err.response.data?.attempts || 0,
                maxAttemptsAllow: err.response.data?.maxAttemptsAllow || 5
              }
            },
            () => {
              errorTracking([this.state.showerror], location.href);
            }
          );
        })
        .finally(() => {
          // this.clearTimer();
          this.setState({
            isResendOtpDisabled: false
          });
        });
  };

  // timer = () => {
  //   this.setState({
  //     otpTimer: 300
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
  //     this.setState({ isResendOtpDisabled: false });
  //     this.clearTimer();
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
      isLoading: false
    });
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

  sendOtpApiCall = (formData: any) => {
    this.setState({
      isLoading: true
    });
    this.props
      .sendOtp(formData)
      .then((data: any) => {
        this.setState(
          {
            toggleOtp: true,
            otpData: formData,
            disable: true,
            isLoading: false,
            isOtpSent: true
          },
          () => {
            // this.timer();
            this.props.setIsOTPSent(true);
            this.props.toggleOtp(true);
          }
        );
        // }
      })
      .catch((error: any) => {
        this.setState(
          {
            showerrorOtp: error.response.data.message,
            isLoading: false
          },
          () => {
            errorTracking([this.state.showerrorOtp], location.href);
          }
        );
      });
  };

  resendOtp = () => {
    if (!this.props.points) {
      this.props.updateError(true);
      return false;
    }
    // this.clearTimer();
    this.setState({
      showerror: ""
    });
    // this.sendOtpApiCall(this.state.otpData);
    this.setState({
      isLoading: true
    });
    this.props
      .resendOtp(this.props.points)
      .then((data: any) => {
        this.setState(
          {
            toggleOtp: true,
            disable: true,
            isLoading: false,
            isOtpSent: true
          },
          () => {
            // this.timer();
            this.props.toggleOtp(true);
          }
        );
        // }
      })
      .catch((error: any) => {
        this.setState(
          {
            showerrorOtp: error.response.data.message,
            isLoading: false
          },
          () => {
            errorTracking([this.state.showerrorOtp], location.href);
          }
        );
      });
  };

  changeAttepts = (value: any) => {
    this.setState({ attempts: value });
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

  cancelOtpReq = () => {
    const { removeRedeem, setIsactiveredeem, setIsOTPSent } = this.props;
    removeRedeem();
    setIsactiveredeem(false);
    setIsOTPSent(false);
  };

  getValidationForOtp = () => {
    const { radioType } = this.state;
    return (
      <div>
        <div
          className={cs(
            globalStyles.textLeft,
            globalStyles.voffset4,
            styles.otpFormat
          )}
          id="otp-comp"
        ></div>
        <hr />
        <NewOtpComponent
          otpSentVia={this.props.number ? "" : "email"}
          resendOtp={this.resendOtp}
          verifyOtp={this.checkOtpValidation}
          errorMsg={this.state.showerror}
          attempts={this.state.attempts}
          btnText={"Redeem Points"}
          startTimer={this.state.startTimer}
          setAttempts={this.changeAttepts}
          cancelOtpReq={this.cancelOtpReq}
          setRedeemOtpError={this.props.setRedeemOtpError}
          groupTimerAndAttempts={true}
        />
        {/* {(this.props.otpFor == "activateGC"
          ? this.props.newCardBox == true
            ? true
            : false
          : true) && (
          <>
            {radioType == "number" ? (
              <div
                className={cs(
                  styles.loginForm,
                  globalStyles.voffset4,
                  styles.otpLabel
                )}
              >
                OTP HAS BEEN SENT TO YOU VIA YOUR MOBILE NUMBER. PLEASE ENTER IT
                BELOW
              </div>
            ) : (
              <div
                className={cs(
                  styles.loginForm,
                  globalStyles.voffset4,
                  styles.otpLabel
                )}
              >
                OTP HAS BEEN SENT TO YOU VIA YOUR EMAIL ADDRESS. PLEASE ENTER IT
                BELOW
              </div>
            )}
            <OtpBox notFocus={true} otpValue={this.getOtpValue} />

            <div className={cs(globalStyles.voffset4, styles.otpLabel)}>
              DIDN’T RECEIVE OTP?{" "}
              {
                <a
                  className={
                    otpTimer > 0 || this.state.isResendOtpDisabled
                      ? styles.iconStyleDisabled
                      : cs(styles.otpLabel, globalStyles.cerise)
                  }
                  onClick={() => {
                    otpTimer > 0 || this.state.isResendOtpDisabled
                      ? ""
                      : this.resendOtp();
                  }}
                >
                  RESEND OTP
                </a>
              }
              {otpTimer > 0 ? (
                <p>OTP SENT: {this.secondsToMints(otpTimer)}s</p>
              ) : (
                ""
              )}
            </div>
            <div className={cs(globalStyles.voffset3, globalStyles.relative)}>
              {this.state.showerror ? (
                <p className={globalStyles.errorMsg}>{this.state.showerror}</p>
              ) : (
                <p className={globalStyles.errorMsg}></p>
              )}
            </div>
            <div className={globalStyles.voffset4}>
              <input
                type="button"
                disabled={!(this.state.otp.length == 6)}
                className={
                  !this.state.updateStatus
                    ? cs(globalStyles.disabledBtn, globalStyles.ceriseBtn)
                    : globalStyles.ceriseBtn
                }
                value={"Redeem Points"}
                onClick={this.checkOtpValidation}
              />
            </div>
          </>
        )} */}
      </div>
    );
  };

  handleInvalidSubmit = () => {
    if (this.props.otpFor == "activateGC") {
      if (!this.props.firstName || !this.props.lastName || !this.props.points) {
        this.props.validateEmptyInputs && this.props.validateEmptyInputs();
        return false;
      }
    }
  };

  checkIfValidIndianMobileNumber = (str: string | undefined) => {
    // Regular expression to check if string is a Indian mobile number
    const regexExp = /^[6-9]\d{9}$/gi;

    return regexExp.test(str || "");
  };

  render() {
    const { radioType, isLoading } = this.state;
    const {
      loyaltyData: { CustomerPointInformation },
      number,
      email
    } = this.props;
    // console.log(number);
    return (
      <Fragment>
        <div
          className={cs(
            styles.sendOtpForm,
            styles.loginForm,
            styles.activategc
          )}
          id="gc-input"
        >
          <li>
            <hr />
          </li>
          <li className={cs(globalStyles.textLeft, styles.otpText)}>
            SEND{" "}
            <span className={globalStyles.cerise}>
              {" "}
              ONE TIME PASSWORD (OTP){" "}
            </span>
            VIA:
          </li>
          <Formsy
            ref={this.RegisterFormRef}
            onValidSubmit={this.handleSubmit}
            onInvalidSubmit={this.handleInvalidSubmit}
          >
            <li className={cs(styles.radiobtn1, styles.xradio)}>
              {/* <label className={styles.radio1}>
                <input
                  type="radio"
                  name={"redeem"}
                  value="email"
                  onClick={e => {
                    this.onClickRadio(e);
                  }}
                />
                <span className={styles.checkmark}></span>
              </label> */}
              <FormInput
                name="email"
                placeholder={"Email*"}
                label={"Email*"}
                className={cs(
                  { [styles.disableInput]: email },
                  styles.relative
                )}
                disable={email ? true : false}
                inputRef={this.emailInput}
                value={email ? email : ""}
                validations={
                  radioType == "email"
                    ? {
                        isEmail: true,
                        maxLength: 75
                      }
                    : {}
                }
                validationErrors={{
                  isEmail: "Please enter a valid Email ID",
                  maxLength: "You are allowed to enter upto 75 characters only"
                }}
                required={radioType != "email" ? "isFalse" : true}
              />
            </li>
            {this.checkIfValidIndianMobileNumber(number?.toString()) ? (
              <li
                className={cs(
                  styles.countryCode,
                  // styles.countryCodeGc,
                  styles.xradio
                )}
              >
                {/* <label className={styles.radio1}>
                <input
                  type="radio"
                  name={"redeem"}
                  value="number"
                  onClick={e => {
                    this.onClickRadio(e);
                  }}
                />
                <span className={styles.checkmark}></span>
              </label> */}
                <div className={styles.flex}>
                  <div className={styles.countryCode}>
                    <input
                      type="text"
                      value="+91"
                      placeholder="Code"
                      disabled={true}
                      className={styles.codeInput}
                    />
                  </div>
                  <div className={styles.contactNumber}>
                    <FormInput
                      name="phoneNo"
                      value={number ? number : ""}
                      disable={number ? true : false}
                      className={cs({ [styles.disableInput]: number })}
                      inputRef={this.phoneInput}
                      placeholder={"Contact Number"}
                      type="number"
                      label={"Contact Number"}
                      validations={
                        radioType == "number"
                          ? {
                              isLength: 10
                            }
                          : {}
                      }
                      validationErrors={{
                        isLength: "Phone Number should be 10 digit"
                      }}
                      required={radioType != "number" ? "isFalse" : true}
                      keyDown={e =>
                        e.which === 69 ? e.preventDefault() : null
                      }
                      onPaste={e =>
                        e?.clipboardData.getData("Text").match(/([e|E])/)
                          ? e.preventDefault()
                          : null
                      }
                    />
                  </div>
                  <p className={cs(styles.errorMsg)}>{this.state.msgt}</p>
                </div>
              </li>
            ) : null}
            <li className={styles.subscribe}>
              <p
                className={
                  this.state.showerrorOtp
                    ? cs(globalStyles.errorMsg, globalStyles.wordCap)
                    : globalStyles.hidden
                }
              >
                {this.state.showerrorOtp}
              </p>
            </li>
            <div
              className={cs({
                [globalStyles.voffset7]: !this.state.showerrorOtp
              })}
            >
              <input
                type="submit"
                disabled={
                  this.state.disable ||
                  this.props.disableBtn !== "" ||
                  (this.props.validated !== undefined && !this.props.validated)
                }
                className={cs(globalStyles.ceriseBtn, {
                  [globalStyles.disabledBtn]:
                    this.state.disable ||
                    this.props.disableBtn !== "" ||
                    (this.props.validated !== undefined &&
                      !this.props.validated)
                })}
                value="Send otp"
              />
            </div>
          </Formsy>
          {this.state.isOtpSent ||
          (this.props.validated !== undefined && !this.props.validated) ? (
            <div className={globalStyles.textCenter}>
              {this.getValidationForOtp()}
            </div>
          ) : null}
        </div>
        {isLoading && <Loader />}
      </Fragment>
    );
  }
}

export default OtpReedem;
