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
import OtpComponent from "components/OtpComponent";
import FormInput from "components/Formsy/FormInput";
import Formsy from "formsy-react";

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
      showInactive: false
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
        this.setState({
          error: "Please enter a valid code"
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
      this.setState({
        error: "Please enter a valid code"
      });
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
        newCardBox: true,
        isSuccess: false
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
    }, 0);
  };
  updateError = (message: string) => {
    if (message) {
      this.setState({
        error: message
      });
    }
    const elem: any = document.getElementById("gift");
    elem.scrollIntoView();
    window.scrollBy(0, -200);
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

  render() {
    const { newCardBox, showOTPValidationScreen } = this.state;
    const { isLoggedIn } = this.props;
    // const { firstName, lastName, giftCardCode } = this.ActivateGCForm.current ? this.ActivateGCForm.current.getModel() : {
    //   firstName: "",
    //   lastName: "",
    //   giftCardCode: ""
    // }
    const { firstName, lastName, txtvalue, isSuccess } = this.state;
    return (
      <Fragment>
        {!newCardBox && isSuccess && (
          <div className={cs(globalStyles.successMsg)}>
            Success. Gift Card Code Activated.
          </div>
        )}
        {newCardBox && (
          <Formsy
            ref={this.ActivateGCForm}
            // onValidSubmit={() => console.log("submitted")}
            onInvalidSubmit={this.scrollToErrors}
          >
            <div className={styles.categorylabel}>
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
                      required
                    />
                  </div>
                </Fragment>
              )}
              {/* {this.state.error ? (
                  <p
                    className={cs(
                      styles.errorMsg,
                      styles.ccErrorMsg,
                      styles.textLeft
                    )}
                  >
                    {this.state.error}
                  </p>
                ) : (
                  ""
                )} */}
            </div>
          </Formsy>
        )}
        <OtpComponent
          disableSendOtpButton={this.state.disable}
          toggleReset={this.state.toggleResetOtpComponent}
          updateError={this.updateError}
          txtvalue={txtvalue}
          firstName={firstName}
          lastName={lastName}
          toggleOtp={this.toggleOtp}
          otpFor="activateGC"
          email={isLoggedIn ? this.props.user.email : ""}
          // validateInputs={this.ActivateGCForm.current ? this.ActivateGCForm.current.submit : () => null}
          // validateInputs={this.scrollToErrors}
          validateEmptyInputs={this.validateEmptyInputs}
          key={200}
          sendOtp={this.props.sendOtpGiftCard}
          checkOtpBalance={this.props.checkOtpBalance}
          activateGiftCard={this.props.activateGiftCard}
          updateList={this.updateList}
          newCardBox={this.state.newCardBox}
        />
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
                showLocked={this.state.showLocked}
                showExpired={this.state.showExpired}
                showInactive={this.state.showInactive}
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
