import React, { RefObject, Fragment } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import { otpProps, otpState } from "./typings";
import globalStyles from "styles/global.scss";
import OtpBox from "./otpBox";
import Formsy from "formsy-react";
import { Link } from "react-router-dom";
import FormCheckbox from "components/Formsy/FormCheckbox";
import FormInput from "components/Formsy/FormInput";
import * as valid from "utils/validate";
import CustomerCareInfo from "components/CustomerCareInfo";
import Loader from "components/Loader";
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
      isLoading: false
    };
  }
  timerId: any = 0;
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
          valid.errorTracking([this.state.msgt], location.href);
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
            valid.errorTracking([this.state.subscribeError], location.href);
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
          valid.errorTracking([this.state.subscribeError], location.href);
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
    data["otpTo"] =
      this.state.radioType == "number" ? "phoneno" : this.state.radioType;
    this.sendOtpApiCall(data, false);
  };

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    this.setState({ showerrorOtp: "" });
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
    // const radioElement: any = this.props.isCredit
    //   ? document.getElementsByName("cca")
    //   : document.getElementsByName("gca");
    const elem = this.subscribeRef.current;
    const { email, phoneNo } = model;
    const data: any = {};
    if (!this.props.txtvalue) {
      this.props.updateError(
        `Please enter a valid ${
          this.props.isCredit ? "Credit Note" : "Gift Card"
        } code`
      );
      valid.errorTracking(
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
    //   const errorElem = document.getElementById(
    //     "selectError"
    //   ) as HTMLParagraphElement;
    //   errorElem.scrollIntoView({ block: "center", behavior: "smooth" });
    //   if (elem && elem.checked == false) {
    //     this.setState(
    //       {
    //         subscribeError: "Please accept the terms & conditions"
    //       },
    //       () => {
    //         valid.errorTracking([this.state.subscribeError], location.href);
    //       }
    //     );
    //   }
    //   return false;
    // }
    if (elem && elem.checked == false) {
      this.setState(
        {
          subscribeError: "Please accept the terms & conditions"
        },
        () => {
          valid.errorTracking([this.state.subscribeError], location.href);
        }
      );
      return false;
    }

    if (this.props.isIndiaGC) {
      data["phoneNo"] = "+91" + phoneNo;
    } else {
      data["email"] = email;
    }
    data["inputType"] = "GIFT";
    data["code"] = this.props.txtvalue;
    if (this.props.otpFor == "activateGC") {
      data["firstName"] = this.props.firstName;
      data["lastName"] = this.props.lastName;
      // this.sendOtpApiCall(data);
    }
    data["otpTo"] = this.props.isIndiaGC ? "phoneno" : "email";
    this.sendOtpApiCall(data, false);
  };

  // onClickRadio = (event: any) => {
  //   this.setState({
  //     radioType: event.target.value,
  //     msgt: ""
  //   });
  // };

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

  checkOtpValidation = () => {
    const { otpData } = this.state;
    const newData = otpData;
    newData["otp"] = this.state.otp;
    delete newData["inputType"];
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
                  disable: true
                },
                () => {
                  valid.errorTracking([this.state.showerror], location.href);
                }
              );
            } else {
              this.props.updateList(data);
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
          .catch(err => {
            if (err.response.data.error_message) {
              let errorMsg = err.response.data.error_message[0];
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
                  valid.errorTracking(
                    [this.state.showerror as string],
                    location.href
                  );
                }
              );
            } else {
              this.setState(
                {
                  showerror: err.response.data.message,
                  updateStatus: false,
                  disable: true
                },
                () => {
                  valid.errorTracking([this.state.showerror], location.href);
                }
              );
            }
          })
          .finally(() => {
            this.clearTimer();
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
                valid.errorTracking(
                  [this.state.showerror as string],
                  location.href
                );
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
                valid.errorTracking([this.state.showerror], location.href);
              }
            );
          }
        })
        .finally(() => {
          this.clearTimer();
        });
    }
  };

  timer = () => {
    this.setState({
      otpTimer: 60
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
      isLoading: true
    });
    this.props
      .sendOtp(formData)
      .then((data: any) => {
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
              valid.errorTracking([this.state.showerrorOtp], location.href);
            }
          );
        } else if (data.currStatus == "Invalid-CN") {
          this.props.updateError(
            `Please enter a valid ${
              this.props.isCredit ? "Credit Note" : "Gift Card"
            } code`
          );
          valid.errorTracking(
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
              otpData: formData
            },
            () => {
              this.timer();
              this.props.toggleOtp(true);
              this.props.updateError("");
              // document.getElementById("otp-comp").scrollIntoView();
            }
          );
        }
      })
      .catch((error: any) => {
        const { status, currStatus, message, email } = error.response.data;
        if (!status) {
          if (currStatus == "Invalid-CN") {
            let errorMessage = `Please enter a valid ${
              this.props.isCredit ? "Credit Note" : "Gift Card"
            } code`;
            if (message) {
              errorMessage = message;
            }
            this.props.updateError(errorMessage);
            valid.errorTracking([errorMessage], location.href);
          } else if (currStatus == "Active" || currStatus == "Expired") {
            this.props.updateError(message);
            valid.errorTracking([message], location.href);
          } else if (email) {
            this.RegisterFormRef1.current?.updateInputsWithError({ email });
            const elem: any = document.getElementById("creditNoteEmail");
            elem.scrollIntoView();
            window.scrollBy(0, -200);
            elem.focus();
          } else {
            if (message) {
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
                    valid.errorTracking([this.state.showerror], location.href);
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
                    valid.errorTracking(
                      [this.state.showerrorOtp],
                      location.href
                    );
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
    this.clearTimer();
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
    const { otpTimer, otpData } = this.state;
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
                  globalStyles.voffset2
                )}
              >
                FIRST NAME
              </p>
              <p>{this.props.firstName}</p>
              <p
                className={cs(
                  globalStyles.op2,
                  globalStyles.bold,
                  globalStyles.voffset2
                )}
              >
                LAST NAME
              </p>
              <p>{this.props.lastName}</p>
            </>
          )}
          <p
            className={cs(
              globalStyles.op2,
              globalStyles.bold,
              globalStyles.voffset2
            )}
          >
            {this.props.otpFor == "balanceCN"
              ? "CREDIT NOTE"
              : "GIFT CARD CODE"}
          </p>
          <p>{this.props.txtvalue}</p>
          {!this.props.isIndiaGC ? (
            <p className={globalStyles.voffset2}>
              <strong className={cs(globalStyles.op2, globalStyles.bold)}>
                {" "}
                OTP SENT TO EMAIL ADDRESS:
              </strong>{" "}
              <br />
              <p className={styles.overflowEmail}>{otpData.email}</p>
            </p>
          ) : (
            <p className={globalStyles.voffset2}>
              <strong className={cs(globalStyles.op2, globalStyles.bold)}>
                OTP SMS SENT TO MOBILE NUMBER:
              </strong>{" "}
              <br />
              {otpData.phoneNo}
            </p>
          )}
        </div>
        <hr />
        {(this.props.otpFor == "activateGC"
          ? this.props.newCardBox == true
            ? true
            : false
          : true) && (
          <>
            <div
              className={cs(
                styles.loginForm,
                globalStyles.voffset4,
                styles.otpLabel
              )}
            >
              {`OTP HAS BEEN SENT TO YOU VIA YOUR ${
                this.props.isIndiaGC ? "MOBILE NUMBER" : "EMAIL ADDRESS"
              }. PLEASE ENTER IT
                BELOW`}
            </div>
            <OtpBox otpValue={this.getOtpValue} />

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
                <p>OTP SENT: {this.secondsToMints(otpTimer)}s</p>
              ) : (
                ""
              )}
            </div>
            <div
              className={cs(
                globalStyles.voffset3,
                globalStyles.relative,
                globalStyles.textLeft
              )}
            >
              {this.state.showerror ? (
                <p
                  className={cs(
                    globalStyles.errorMsg,
                    globalStyles.txtnormal,
                    globalStyles.textCenter
                  )}
                  id="resend-otp-error"
                >
                  {this.state.showerror}
                </p>
              ) : (
                <p className={globalStyles.errorMsg}></p>
              )}
              {this.state.showerror && <CustomerCareInfo />}
            </div>
            <div className={globalStyles.voffset2}>
              <input
                type="button"
                disabled={!this.state.updateStatus}
                className={
                  !this.state.updateStatus
                    ? cs(globalStyles.disabledBtn, globalStyles.ceriseBtn)
                    : globalStyles.ceriseBtn
                }
                value={
                  this.props.otpFor == "activateGC"
                    ? "Activate Gift Card"
                    : "Check Balance"
                }
                onClick={this.checkOtpValidation}
              />
            </div>
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
              SEND{" "}
              <span className={globalStyles.cerise}>
                {" "}
                ONE TIME PASSWORD (OTP){" "}
              </span>
              VIA:
            </li>
            <Formsy
              ref={this.RegisterFormRef}
              onChange={() => {
                this.state.disable && this.setState({ disable: false });
              }}
              onValidSubmit={this.handleSubmit}
              onInvalidSubmit={this.handleInvalidSubmit}
            >
              {!this.props.isIndiaGC && (
                <li className={cs(styles.radiobtn1, styles.xradio)}>
                  <FormInput
                    name="email"
                    placeholder={"Email*"}
                    label={"Email*"}
                    className={styles.relative}
                    disable={this.props.isCredit}
                    inputRef={this.emailInput}
                    value={this.props.email ? this.props.email : ""}
                    validations={
                      !this.props.isIndiaGC
                        ? {
                            isEmail: true,
                            maxLength: 75
                          }
                        : {}
                    }
                    validationErrors={{
                      isEmail: "Please enter a valid Email ID",
                      maxLength:
                        "You are allowed to enter upto 75 characters only"
                    }}
                    required={
                      this.props.isIndiaGC || this.props.isCredit
                        ? "isFalse"
                        : true
                    }
                  />
                </li>
              )}
              {this.props.isIndiaGC && (
                <li
                  className={cs(
                    styles.countryCode,
                    styles.countryCodeGc,
                    styles.xradio
                  )}
                >
                  <div className={styles.flex}>
                    <div className={styles.contactCode}>
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
                        value={this.props.phoneNo ? this.props.phoneNo : ""}
                        inputRef={this.phoneInput}
                        placeholder={"Contact Number"}
                        type="number"
                        label={"Contact Number"}
                        validations={
                          this.props.isIndiaGC
                            ? {
                                isLength: 10
                              }
                            : {}
                        }
                        validationErrors={{
                          isLength: "Phone number should be 10 digit"
                        }}
                        required={!this.props.isIndiaGC ? "isFalse" : true}
                      />
                    </div>
                    <p id="selectError" className={cs(styles.errorMsg)}>
                      {this.state.msgt}
                    </p>
                  </div>
                </li>
              )}
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
                  id={"subscrib" + this.props.isCredit}
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
                        ? cs(globalStyles.errorMsg, globalStyles.wordCap)
                        : globalStyles.hidden
                    }
                  >
                    Please agree to the Terms and Conditions before proceeding
                  </p>
                  <p
                    id="customererror"
                    className={
                      this.state.showerrorOtp
                        ? cs(globalStyles.errorMsg, globalStyles.wordCap)
                        : globalStyles.hidden
                    }
                  >
                    {this.state.showerrorOtp}
                  </p>
                  <p>{this.state.showerrorOtp ? <CustomerCareInfo /> : ""}</p>
                </div>
              </li>
              <li className={this.state.showerrorOtp ? styles.margintop : ""}>
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
