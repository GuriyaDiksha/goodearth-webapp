import React, { Fragment } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import { GiftState } from "./typings";
import mapDispatchToProps from "../mapper/actions";
import GiftCardItem from "../Balance/giftDetail";
import { AppState } from "reducers/typings";
import FormInput from "components/Formsy/FormInput";
import Formsy from "formsy-react";
import * as valid from "utils/validate";
import OtpCompActivateGC from "components/OtpComponent/OtpCompActivateGC";
import Loader from "components/Loader";
import { Link } from "react-router-dom";

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    user: state.user
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

class Giftcard extends React.Component<Props, GiftState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtvalue: "",
      firstName: this.props.isLoggedIn ? this.props.user.firstName : "",
      lastName: this.props.isLoggedIn ? this.props.user.lastName : "",
      error: "",
      newCardBox: true,
      giftList: [],
      showOTPValidationScreen: false,
      isSuccess: false,
      toggleResetOtpComponent: false,
      disable: true,
      conditionalRefresh: false,
      showLocked: false,
      showExpired: false,
      showInactive: false,
      showSendOtp: false,
      isIndiaGC: false,
      isProceedBtnDisabled: true,
      isLoading: false
    };
  }
  ActivateGCForm = React.createRef<Formsy>();
  toggleOtp = (value: boolean) => {
    this.setState({
      showOTPValidationScreen: value
    });
  };

  gcBalance = () => {
    const data: any = {
      // code: this.state.txtvalue
    };
    this.props.balanceCheck(data).then((response: any) => {
      const { giftList } = this.state;
      if (response.currStatus == "Invalid-CN") {
        this.setState(
          {
            error: "Please enter a valid Gift Card code"
          },
          () => {
            valid.errorTracking([this.state.error], location.href);
          }
        );
        this.ActivateGCForm.current?.updateInputsWithError({
          giftCardCode: "Please enter a valid Gift Card code"
        });
      } else {
        giftList.push(response);
        this.setState({
          giftList: giftList,
          newCardBox: false
          // txtvalue: ""
        });
      }
    });
  };

  handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    this.state.disable && this.setState({ disable: false });
    const value = event.target.value;
    switch (field) {
      case "firstName":
        this.setState({ firstName: value });
        break;
      case "lastName":
        this.setState({ lastName: value });
        break;
      case "txtvalue":
        this.setState({ txtvalue: value });
    }
  };

  updateList = (response: any) => {
    const { giftList } = this.state;
    if (response.currStatus == "Invalid-CN") {
      this.setState(
        {
          error: "Please enter a valid Gift Card code"
        },
        () => {
          valid.errorTracking([this.state.error], location.href);
        }
      );
    } else {
      giftList.push(response);
      this.setState({
        giftList: giftList,
        newCardBox: false,
        isSuccess: true
        // txtvalue: ""
      });
      window.scrollTo(0, 0);
    }
  };

  newGiftcard = () => {
    // implement page refresh here
    this.setState(prevState => {
      return {
        toggleResetOtpComponent: !prevState.toggleResetOtpComponent,
        showOTPValidationScreen: false,
        newCardBox: true,
        disable: true,
        isSuccess: false,
        giftList: [],
        txtvalue: "",
        showSendOtp: false
      };
    });
    // this.props.history.push(this.props.history.location.pathname, {});
  };
  onClose = (code: string) => {
    let { giftList } = this.state;
    giftList = giftList.filter(data => {
      return data.code != code;
    });
    this.setState({
      giftList: giftList
    });
  };

  scrollToErrors = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLInputElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = valid.getErrorList(
        globalStyles.errorMsg,
        "activate-giftcard-form"
      );
      if (errorList && errorList.length) {
        valid.errorTracking(errorList, location.href);
      }
    }, 0);
  };
  updateError = (message: string) => {
    if (message) {
      this.setState({
        error: message
      });
      this.ActivateGCForm.current?.updateInputsWithError({
        giftCardCode: message
      });
      const elem: any = document.getElementById("gift");
      elem.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };

  errorOnBlur = (event: React.FocusEvent<Element>) => {
    const elem = event.currentTarget as HTMLInputElement;
    const value = elem.value;
    const name = elem.name;

    if (!value) {
      this.ActivateGCForm.current &&
        this.ActivateGCForm.current.updateInputsWithValue(
          {
            [name]: ""
          },
          true
        );
    }
  };

  validateEmptyInputs = () => {
    if (this.ActivateGCForm.current) {
      const {
        firstName,
        lastName,
        giftCardCode
      } = this.ActivateGCForm.current.getModel();
      let values = {};
      if (!firstName) {
        values = { ...values, firstName: "" };
      }
      if (!lastName) {
        values = { ...values, lastName: "" };
      }
      if (!giftCardCode) {
        values = { ...values, giftCardCode: "" };
      }
      this.ActivateGCForm.current.updateInputsWithValue(values, true);
      this.scrollToErrors();
    }
  };

  onGCFormSubmit = (model: any, resetForm: any, invalidateForm: any) => {
    const { firstName, lastName, giftCardCode } = model;
    if (!firstName || !lastName || !giftCardCode) {
      this.validateEmptyInputs();
      return false;
    }

    this.setState({
      isLoading: true
    });
    this.props
      .checkGiftCard(giftCardCode)
      .then(res => {
        this.setState({
          isLoading: false
        });
        if (res.currStatus == "Active" || res.currStatus == "Applied") {
          this.ActivateGCForm.current &&
            this.ActivateGCForm.current.updateInputsWithError(
              {
                giftCardCode: [
                  <>
                    This gift card is already activated.{" "}
                    <Link
                      to="/account/check-balance"
                      key="check-balance-click-here"
                      style={{
                        textDecoration: "underline",
                        pointerEvents: "all"
                      }}
                    >
                      Click here
                    </Link>{" "}
                    to check balance.
                  </>
                ]
              },
              true
            );
        } else {
          if (res.type == "GIFT") {
            if (res.curr == "INR") {
              this.setState({
                isIndiaGC: true,
                showSendOtp: true
              });
            } else {
              this.setState({
                isIndiaGC: false,
                showSendOtp: true
              });
            }
          }
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false
        });
        if (
          (err.response.status == 400 && err.response.data.status == false) ||
          err.response.status == 406
        ) {
          this.ActivateGCForm.current &&
            this.ActivateGCForm.current.updateInputsWithError({
              giftCardCode:
                err.response.data.message ||
                "Please enter a valid Gift Card code"
            });
        }
      });
  };

  changeGiftCardCode = () => {
    this.setState({
      showSendOtp: false,
      txtvalue: ""
    });
    const elem = document.getElementById("gift");
    elem && elem.focus();
  };

  render() {
    const { newCardBox, showOTPValidationScreen } = this.state;
    const { isLoggedIn } = this.props;
    // const { firstName, lastName, giftCardCode } = this.ActivateGCForm.current ? this.ActivateGCForm.current.getModel() : {
    //   firstName: "",
    //   lastName: "",
    //   giftCardCode: ""
    // }
    const { firstName, lastName, txtvalue, isSuccess, isLoading } = this.state;
    return (
      <Fragment>
        {!newCardBox && isSuccess && (
          <div className={cs(globalStyles.successMsg)}>
            Success. Gift Card Code Activated.
          </div>
        )}
        {newCardBox && (
          <div>
            <Formsy
              ref={this.ActivateGCForm}
              onValidSubmit={this.onGCFormSubmit}
              onInvalidSubmit={this.scrollToErrors}
              onChange={() => {
                const disabled = this.state.isProceedBtnDisabled;
                disabled &&
                  this.setState({
                    isProceedBtnDisabled: false
                  });
              }}
            >
              <div className={styles.categorylabel} id="activate-giftcard-form">
                {showOTPValidationScreen ? (
                  ""
                ) : (
                  <Fragment>
                    <div>
                      <FormInput
                        name="firstName"
                        placeholder="First Name"
                        type="text"
                        blur={e => this.errorOnBlur(e)}
                        id="firstName"
                        label={"First Name"}
                        value={firstName}
                        handleChange={e => this.handleChange(e, "firstName")}
                        required
                      />
                    </div>
                    <div>
                      <FormInput
                        name="lastName"
                        placeholder="Last Name"
                        type="text"
                        label={"Last Name"}
                        blur={e => this.errorOnBlur(e)}
                        id="lastName"
                        value={lastName}
                        handleChange={e => this.handleChange(e, "lastName")}
                        required
                      />
                    </div>
                    <div>
                      <FormInput
                        name="giftCardCode"
                        type="text"
                        placeholder="Gift Card Code"
                        label="Gift Card Code"
                        blur={e => this.errorOnBlur(e)}
                        id="gift"
                        value={txtvalue}
                        handleChange={e => this.handleChange(e, "txtvalue")}
                        disable={this.state.showSendOtp}
                        required
                      />
                      {this.state.showSendOtp && (
                        <p
                          className={styles.loginChange}
                          onClick={this.changeGiftCardCode}
                        >
                          Change
                        </p>
                      )}
                    </div>
                    {!this.state.showSendOtp && (
                      <div>
                        <input
                          type="submit"
                          value="proceed"
                          className={cs(globalStyles.ceriseBtn, {
                            [globalStyles.disabledBtn]: this.state
                              .isProceedBtnDisabled
                          })}
                          disabled={this.state.isProceedBtnDisabled}
                        />
                      </div>
                    )}
                  </Fragment>
                )}
              </div>
            </Formsy>
            {isLoading && <Loader />}
          </div>
        )}
        {this.state.showSendOtp && (
          <OtpCompActivateGC
            disableSendOtpButton={this.state.disable}
            toggleReset={this.state.toggleResetOtpComponent}
            updateError={this.updateError}
            txtvalue={txtvalue}
            firstName={firstName}
            lastName={lastName}
            isIndiaGC={this.state.isIndiaGC}
            toggleOtp={this.toggleOtp}
            otpFor="activateGC"
            email={isLoggedIn ? this.props.user.email : ""}
            phoneNo={isLoggedIn ? this.props.user.phoneNumber : ""}
            // validateInputs={this.ActivateGCForm.current ? this.ActivateGCForm.current.submit : () => null}
            // validateInputs={this.scrollToErrors}
            validateEmptyInputs={this.validateEmptyInputs}
            key={200}
            sendOtp={this.props.sendOtpGiftCard}
            checkOtpBalance={this.props.checkOtpBalance}
            activateGiftCard={this.props.activateGiftCard}
            updateList={this.updateList}
            newCardBox={this.state.newCardBox}
            newGiftCard={this.newGiftcard}
          />
        )}
        <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
          {this.state.giftList.map((data, i) => {
            return (
              <GiftCardItem
                isLoggedIn={isLoggedIn}
                {...data}
                viewOnly={true}
                onClose={this.onClose}
                key={i}
                conditionalRefresh={this.state.conditionalRefresh}
                // showLocked={this.state.showLocked}
                // showExpired={this.state.showExpired}
                // showInactive={this.state.showInactive}
              />
            );
          })}
          <div
            className={cs(
              styles.loginForm,
              // { [globalStyles.voffset4]: newCardBox },
              bootstrapStyles.col12
            )}
          >
            {!newCardBox && (
              <div
                className={cs(
                  styles.rtcinfo,
                  globalStyles.pointer,
                  globalStyles.textLeft
                )}
                onClick={this.newGiftcard}
              >
                [+] ACTIVATE ANOTHER GIFT CARD
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Giftcard);
