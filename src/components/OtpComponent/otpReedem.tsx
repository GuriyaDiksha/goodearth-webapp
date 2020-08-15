import React, { RefObject, Fragment } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { otpRedeemProps, otpState } from "./typings";
// import { Currency, currencyCode } from "typings/currency";
import globalStyles from "styles/global.scss";
import OtpBox from "./otpBox";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import Loader from "components/Loader";

class OtpReedem extends React.Component<otpRedeemProps, otpState> {
  constructor(props: otpRedeemProps) {
    super(props);
    this.state = {
      disable: true,
      msgt: "",
      showFields: false,
      radioType: "",
      subscribeError: "",
      otpTimer: 0,
      otpData: {},
      updateStatus: false,
      showerror: "",
      showerrorOtp: "",
      showError: "",
      otp: "",
      toggleOtp: false,
      isLoading: false
    };
  }
  timerId: any = 0;
  emailRef: RefObject<typeof FormInput> = React.createRef();
  RegisterFormRef: RefObject<Formsy> = React.createRef();
  RegisterFormRef1: RefObject<Formsy> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  phoneInput: RefObject<HTMLInputElement> = React.createRef();
  lastNameInput: RefObject<HTMLInputElement> = React.createRef();

  resetSection = () => {
    this.setState({
      showFields: false
    });
  };

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    this.setState({ showerrorOtp: "" });

    const radioElement: any = document.getElementsByName("redeem");
    // const elem = this.subscribeRef.current;
    const { email, phoneNo } = model;
    const data: any = {};
    if (!radioElement[0].checked && !radioElement[1].checked) {
      this.setState({
        msgt:
          "Please select at least one mode of communication for OTP verification of your gift card"
      });
      return false;
    }

    if (!this.props.points) {
      this.props.updateError(true);
      return false;
    }

    if (this.props.isCredit && this.RegisterFormRef1.current) {
      this.RegisterFormRef1.current.submit();
      return false;
    }
    if (this.state.radioType == "email") {
      data["email"] = email;
    } else {
      data["phoneNo"] = "+91" + phoneNo;
    }
    // data["inputType"] = "GIFT";
    data["points"] = this.props.points;
    this.sendOtpApiCall(data);
  };

  onClickRadio = (event: any) => {
    this.setState({
      radioType: event.target.value,
      msgt: "",
      disable: false
    });
  };

  checkOtpValidation = () => {
    const { otpData } = this.state;
    const newData = otpData;
    newData["otp"] = this.state.otp;
    this.setState({
      isLoading: true
    });
    this.props.checkOtpRedeem &&
      this.props
        .checkOtpRedeem(newData)
        .then(data => {
          if (data.message) {
            this.setState({
              showerror: data.message,
              isLoading: false
            });
          } else {
            // this.props.updateList(data);
            this.setState({
              toggleOtp: true,
              showerrorOtp: "",
              showerror: "",
              isLoading: false
            });
          }
        })
        .catch(err => {
          this.setState({
            showerror: err.response.data.message,
            isLoading: false
          });
        })
        .finally(() => {
          this.clearTimer();
        });
  };

  timer = () => {
    this.setState({
      otpTimer: 300
    });
    this.timerId = setInterval(() => {
      this.decrementTimeRemaining();
    }, 1000);
  };

  decrementTimeRemaining() {
    if (this.state.otpTimer > 0) {
      this.setState({
        otpTimer: this.state.otpTimer - 1
      });
    } else {
      clearInterval(this.timerId);
    }
  }

  clearTimer() {
    clearInterval(this.timerId);
    this.setState({
      otpTimer: 0
    });
  }

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
            isLoading: false
          },
          () => {
            this.timer();
            this.props.toggleOtp(true);
          }
        );
        // }
      })
      .catch((error: any) => {
        this.setState({
          showError: "Server Error",
          isLoading: false
        });
      });
  };

  resendOtp = () => {
    this.clearTimer();
    this.sendOtpApiCall(this.state.otpData);
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
    const { radioType, otpTimer } = this.state;
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
        {(this.props.otpFor == "activateGC"
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
              {this.state.showerror ? (
                <a
                  className={cs(globalStyles.cerise, styles.otpLabel)}
                  onClick={this.clickHereOtpInvalid}
                >
                  CLICK HERE
                </a>
              ) : (
                <a
                  className={
                    otpTimer > 0
                      ? styles.iconStyleDisabled
                      : cs(styles.otpLabel, globalStyles.cerise)
                  }
                  onClick={() => {
                    otpTimer > 0 ? "" : this.resendOtp();
                  }}
                >
                  RESEND OTP
                </a>
              )}
              {otpTimer > 0 ? (
                <p>OTP SENT:{this.secondsToMints(otpTimer)}s</p>
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
        )}
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

  render() {
    const { radioType, isLoading } = this.state;
    const {
      loyaltyData: { detail },
      number
    } = this.props;
    console.log(number);
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
              <label className={styles.radio1}>
                <input
                  type="radio"
                  name={"redeem"}
                  value="email"
                  onClick={e => {
                    this.onClickRadio(e);
                  }}
                />
                <span className={styles.checkmark}></span>
              </label>
              <FormInput
                name="email"
                placeholder={"Email*"}
                label={"Email*"}
                className={cs(
                  { [styles.disableInput]: detail?.EmailId },
                  styles.relative
                )}
                disable={detail?.EmailId ? true : false}
                inputRef={this.emailInput}
                value={detail ? detail.EmailId : ""}
                validations={
                  radioType == "email"
                    ? {
                        isEmail: true,
                        maxLength: 75
                      }
                    : {}
                }
                validationErrors={{
                  isEmail: "Enter valid email",
                  maxLength: "You are allowed to enter upto 75 characters only"
                }}
                required={radioType != "email" ? "isFalse" : true}
              />
            </li>
            <li
              className={cs(
                styles.countryCode,
                styles.countryCodeGc,
                styles.xradio
              )}
            >
              <label className={styles.radio1}>
                <input
                  type="radio"
                  name={"redeem"}
                  value="number"
                  onClick={e => {
                    this.onClickRadio(e);
                  }}
                />
                <span className={styles.checkmark}></span>
              </label>
              <div className={styles.flex}>
                <div>
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
                  />
                </div>
                <p className={cs(styles.errorMsg)}>{this.state.msgt}</p>
              </div>
            </li>
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
            <div className={globalStyles.voffset7}>
              <input
                type="submit"
                disabled={this.state.disable}
                className={
                  this.state.disable
                    ? cs(globalStyles.ceriseBtn, globalStyles.disabledBtn)
                    : globalStyles.ceriseBtn
                }
                value="Send otp"
              />
            </div>
          </Formsy>
          <div className={globalStyles.textCenter}>
            {this.getValidationForOtp()}
          </div>
        </div>
        {isLoading && <Loader />}
      </Fragment>
    );
  }
}

export default OtpReedem;
