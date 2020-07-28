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
    isLoggedIn: state.user.isLoggedIn
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

class Giftcard extends React.Component<Props, GiftState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtvalue: "",
      firstName: "",
      lastName: "",
      error: "",
      newCardBox: true,
      giftList: [],
      toggelOtp: false
    };
  }
  ActivateGCForm = React.createRef<Formsy>();

  toggelOtp = (value: boolean) => {
    this.setState({
      toggelOtp: value
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

  gcBalanceOtp = (response: any) => {
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
  };

  newGiftcard = () => {
    this.setState({
      newCardBox: true
    });
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
  updateError = (data: boolean) => {
    if (data) {
      this.setState({
        error: "Please enter a valid code"
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
    const { newCardBox, toggelOtp } = this.state;
    const { isLoggedIn } = this.props;
    // const { firstName, lastName, giftCardCode } = this.ActivateGCForm.current ? this.ActivateGCForm.current.getModel() : {
    //   firstName: "",
    //   lastName: "",
    //   giftCardCode: ""
    // }
    const { firstName, lastName, txtvalue } = this.state;
    return (
      <Fragment>
        <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
          {this.state.giftList.map((data, i) => {
            return <GiftCardItem {...data} onClose={this.onClose} key={i} />;
          })}
          <div
            className={cs(
              styles.loginForm,
              // { [globalStyles.voffset4]: newCardBox },
              bootstrapStyles.col12
            )}
          >
            {newCardBox ? (
              <Formsy
                ref={this.ActivateGCForm}
                onValidSubmit={() => console.log("submitted")}
                onInvalidSubmit={this.scrollToErrors}
              >
                <div className={styles.categorylabel}>
                  {toggelOtp ? (
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
                          handleChange={e => this.handleChange(e, "txtvalue")}
                          required
                        />
                        <span
                          className={cs(
                            styles.colorPrimary,
                            globalStyles.pointer,
                            { [globalStyles.hidden]: !isLoggedIn }
                          )}
                        >
                          <span
                            className={styles.arrowrightsmall}
                            onClick={this.gcBalance}
                          ></span>
                        </span>
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
            ) : (
              <div
                className={cs(
                  styles.rtcinfo,
                  globalStyles.pointer,
                  globalStyles.textLeft
                )}
                onClick={this.newGiftcard}
              >
                [+] CHECK ANOTHER GIFT CARD CODE
              </div>
            )}
          </div>
        </div>

        {!isLoggedIn ? (
          !newCardBox ? (
            ""
          ) : (
            <OtpComponent
              updateError={this.updateError}
              txtvalue={txtvalue}
              firstName={firstName}
              lastName={lastName}
              toggelOtp={this.toggelOtp}
              // validateInputs={this.ActivateGCForm.current ? this.ActivateGCForm.current.submit : () => null}
              // validateInputs={this.scrollToErrors}
              validateEmptyInputs={this.validateEmptyInputs}
              key={200}
              sendOtp={this.props.sendOtpGiftCard}
              checkOtpBalance={this.props.checkOtpBalance}
              gcBalanceOtp={this.gcBalanceOtp}
            />
          )
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Giftcard);
