import React, { Fragment } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import { GiftState } from "./typings";
import mapDispatchToProps from "./mapper/actions";
import GiftCardItem from "./giftDetail";
import { AppState } from "reducers/typings";
import OtpComponent from "components/OtpComponent";
import { errorTracking } from "utils/validate";

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    mobile: state.device.mobile
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> & { isFromCheckBalance?: boolean };

class CreditNote extends React.Component<Props, GiftState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtvalue: "",
      error: "",
      newCardBox: true,
      giftList: [],
      toggleOtp: false,
      toggleResetOtpComponent: false,
      disable: true,
      // showExpired: false,
      // showInactive: false,
      // showLocked: false,
      conditionalRefresh: false
    };
  }
  // ProfileFormRef: RefObject<Formsy> = React.createRef();

  changeValue = (event: any) => {
    this.state.disable && this.setState({ disable: false });
    this.setState({
      txtvalue: event.target.value.trim()
    });
    if (this.state.error) {
      this.setState({ error: "" });
    }
  };

  handleKeyPress = (event: any) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  };

  toggleOtp = (value: boolean) => {
    this.setState({
      toggleOtp: value
    });
  };

  gcBalance = () => {
    const data: any = {
      code: this.state.txtvalue,
      inputType: "CNI"
    };
    if (this.state.txtvalue === "") {
      this.setState(
        {
          error: "Please enter a valid Credit Note code."
        },
        () => {
          errorTracking([this.state.error], location.href);
        }
      );
    } else {
      this.props
        .balanceCheck(data)
        .then(response => {
          const { giftList } = this.state;
          if (response.currStatus == "Invalid-CN" || response.type == "GIFT") {
            this.setState(
              {
                error: "Please enter a valid Credit Note code."
              },
              () => {
                errorTracking([this.state.error], location.href);
              }
            );
          } else if (
            response.currStatus == "Locked" &&
            response.type == "CNI"
          ) {
            response.status = "locked";
            giftList.push(response);
            this.setState({
              newCardBox: false,
              conditionalRefresh: true,
              txtvalue: "",
              // showLocked: true,
              // showExpired: false,
              // showInactive: false,
              giftList: giftList,
              error: ""
            });
          } else if (
            response.currStatus == "Expired" &&
            response.type == "CNI"
          ) {
            response.status = "expired";
            giftList.push(response);
            this.setState({
              newCardBox: false,
              conditionalRefresh: true,
              txtvalue: "",
              // chkbalance: data,
              // showExpired: true,
              // showInactive: false,
              // showLocked: false,
              giftList: giftList,
              error: ""
              // inputBox: false
            });
          } else {
            response.status = "active";
            giftList.push(response);
            this.setState({
              giftList: giftList,
              newCardBox: false,
              conditionalRefresh: true,
              txtvalue: "",
              error: ""
              // showExpired: false,
              // showInactive: false,
              // showLocked: false
            });
          }
        })
        .catch(err => {
          this.setState(
            {
              error: err.response.data.message
            },
            () => {
              errorTracking([this.state.error], location.href);
            }
          );
        });
    }
  };

  updateList = (response: any) => {
    const { giftList } = this.state;
    if (response.currStatus == "Invalid-CN") {
      this.setState(
        {
          error: "Please enter a valid Credit Note code."
        },
        () => {
          errorTracking([this.state.error], location.href);
        }
      );
    } else if (response.currStatus == "Locked" && response.type == "CNI") {
      response.status = "locked";
      giftList.push(response);
      this.setState({
        newCardBox: false,
        conditionalRefresh: true,
        txtvalue: "",
        // showLocked: true,
        // showExpired: false,
        // showInactive: false,
        giftList: giftList,
        error: ""
      });
      window.scrollTo(0, 0);
    } else if (response.currStatus == "Expired" && response.type == "CNI") {
      response.status = "expired";
      giftList.push(response);
      this.setState({
        newCardBox: false,
        conditionalRefresh: true,
        txtvalue: "",
        // chkbalance: data,
        // showExpired: true,
        // showInactive: false,
        // showLocked: false,
        giftList: giftList,
        error: ""
        // inputBox: false
      });
      window.scrollTo(0, 0);
    } else {
      response.status = "active";
      giftList.push(response);
      this.setState({
        giftList: giftList,
        newCardBox: false,
        conditionalRefresh: true,
        txtvalue: "",
        error: ""
        // showExpired: false,
        // showInactive: false,
        // showLocked: false
      });
      window.scrollTo(0, 0);
    }
  };

  newGiftcard = () => {
    this.setState({
      newCardBox: true,
      disable: true
    });
  };
  onClose = (code: string) => {
    let { giftList } = this.state;
    giftList = giftList.filter(data => {
      return data.code != code;
    });
    this.setState({
      giftList: giftList,
      disable: true
    });
    if (giftList.length == 0) {
      this.setState(prevState => {
        return {
          toggleResetOtpComponent: !prevState.toggleResetOtpComponent,
          newCardBox: true,
          disable: true
        };
      });
    }
  };

  updateError = (message: string) => {
    if (message) {
      this.setState({
        error: message
      });
      const elem: any = document.getElementById("credit");
      elem.scrollIntoView({ block: "center", behavior: "smooth" });
    } else {
      this.setState({
        error: ""
      });
    }
  };

  render() {
    const { newCardBox, txtvalue, toggleOtp } = this.state;
    const { isLoggedIn } = this.props;
    return (
      <Fragment>
        <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
          {this.state.giftList.map((data, i) => {
            return (
              <GiftCardItem
                isLoggedIn={isLoggedIn}
                {...data}
                onClose={this.onClose}
                conditionalRefresh={this.state.conditionalRefresh}
                // showLocked={this.state.showLocked}
                // showExpired={this.state.showExpired}
                // showInactive={this.state.showInactive}
                key={i}
              />
            );
          })}
          <div
            className={cs(
              styles.loginForm,
              { [globalStyles.voffset4]: newCardBox },
              bootstrapStyles.colMd12
            )}
          >
            {newCardBox ? (
              <div className={styles.codeWrp}>
                {toggleOtp ? (
                  ""
                ) : (
                  <Fragment>
                    <div
                      className={cs(
                        styles.flex,
                        styles.vCenterBalance,
                        styles.balanceInput
                      )}
                    >
                      <input
                        type="text"
                        autoComplete="off"
                        value={txtvalue}
                        onChange={this.changeValue}
                        onKeyDown={this.handleKeyPress}
                        id="credit"
                        className={this.state.error ? cs(styles.err) : ""}
                      />
                      <span
                        className={cs(
                          styles.colorPrimary,
                          globalStyles.pointer,
                          { [globalStyles.hidden]: !isLoggedIn },
                          styles.arrowContainer
                        )}
                      >
                        <span
                          className={styles.arrowrightsmall}
                          onClick={this.gcBalance}
                        ></span>
                      </span>
                    </div>
                    <label className={styles.gcLabel}>Credit Note</label>
                  </Fragment>
                )}
                {this.state.error ? (
                  <p className={cs(globalStyles.errorMsg)}>
                    {this.state.error}
                  </p>
                ) : (
                  ""
                )}
              </div>
            ) : (
              isLoggedIn && (
                <div
                  className={cs(
                    styles.rtcinfo,
                    globalStyles.pointer,
                    globalStyles.textLeft,
                    styles.checkAnother
                  )}
                  onClick={this.newGiftcard}
                >
                  [+] CHECK ANOTHER CREDIT NOTE CODE
                </div>
              )
            )}
          </div>
        </div>

        {!isLoggedIn ? (
          !newCardBox ? (
            ""
          ) : (
            <OtpComponent
              disableSendOtpButton={this.state.disable}
              otpFor="balanceCN"
              updateError={this.updateError}
              txtvalue={this.state.txtvalue}
              toggleOtp={this.toggleOtp}
              key={100}
              sendOtp={this.props.sendOtp}
              isCredit={true}
              checkOtpBalance={this.props.checkOtpBalance}
              updateList={this.updateList}
              isFromCheckBalance={this.props?.isFromCheckBalance}
              mobile={this.props.mobile}
            />
          )
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditNote);
