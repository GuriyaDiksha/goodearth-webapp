import React, { Fragment } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import { GiftState } from "./typings";
import mapDispatchToProps from "./mapper/actions";
import GiftCardItem from "./giftDetail";
import { AppState } from "reducers/typings";
import OtpComponent from "components/OtpComponent";
import * as valid from "utils/validate";

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
      // showInactive: false,
      // showLocked: false,
      // showExpired: false,
      conditionalRefresh: false,
      txtvalue: "",
      error: "",
      newCardBox: true,
      giftList: [],
      toggleOtp: false,
      toggleResetOtpComponent: false,
      disable: true
    };
  }
  // ProfileFormRef: RefObject<Formsy> = React.createRef();

  changeValue = (event: any) => {
    this.state.disable && this.setState({ disable: false });
    this.setState({
      txtvalue: event.target.value
    });
    if (this.state.error) {
      this.setState({ error: "" });
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
      inputType: "GIFT"
    };
    this.props
      .balanceCheck(data)
      .then(response => {
        const { giftList } = this.state;
        if (response.currStatus == "Not Activated" && response.type == "GIFT") {
          response.status = "inactive";
          giftList.push(response);
          this.setState({
            giftList: giftList,
            newCardBox: false,
            txtvalue: "",
            // showInactive: true,
            // showExpired: false,
            // showLocked: false,
            conditionalRefresh: true,
            error: ""
          });
        } else if (
          response.currStatus == "Expired" &&
          response.type == "GIFT"
        ) {
          response.status = "expired";
          giftList.push(response);
          this.setState({
            newCardBox: false,
            conditionalRefresh: true,
            // chkbalance: data,
            // showExpired: true,
            txtvalue: "",
            // showInactive: false,
            // showLocked: false,
            giftList: giftList,
            error: ""
            // inputBox: false
          });
        } else if (response.currStatus == "Locked" && response.type == "GIFT") {
          response.status = "locked";
          giftList.push(response);
          this.setState({
            newCardBox: false,
            conditionalRefresh: true,
            // showLocked: true,
            // showExpired: false,
            txtvalue: "",
            // showInactive: false,
            giftList: giftList,
            error: ""
          });
        } else {
          response.status = "active";
          giftList.push(response);
          this.setState({
            giftList: giftList,
            // showExpired: false,
            // showInactive: false,
            // showLocked: false,
            newCardBox: false,
            txtvalue: "",
            error: "",
            conditionalRefresh: true
          });
        }
      })
      .catch(err => {
        const { status, currStatus, message } = err.response.data;
        if (!status) {
          if (currStatus == "Invalid-CN") {
            this.setState(
              {
                error: message
              },
              () => {
                valid.errorTracking([this.state.error], location.href);
              }
            );
          } else {
            // to be handled
          }
        }
      });
  };

  updateList = (response: any) => {
    const { giftList } = this.state;
    if (response.currStatus == "Invalid-CN") {
      this.setState(
        {
          error: "Please enter a valid code"
        },
        () => {
          valid.errorTracking([this.state.error], location.href);
        }
      );
    } else if (
      response.currStatus == "Not Activated" &&
      response.type == "GIFT"
    ) {
      response.status = "inactive";
      giftList.push(response);
      this.setState({
        giftList: giftList,
        newCardBox: false,
        txtvalue: "",
        // showInactive: true,
        // showExpired: false,
        // showLocked: false,
        conditionalRefresh: true,
        error: ""
      });
      window.scrollTo(0, 0);
    } else if (response.currStatus == "Expired" && response.type == "GIFT") {
      response.status = "expired";
      giftList.push(response);
      this.setState({
        newCardBox: false,
        conditionalRefresh: true,
        // chkbalance: data,
        // showExpired: true,
        // showInactive: false,
        // showLocked: false,
        giftList: giftList,
        txtvalue: "",
        error: ""
        // inputBox: false
      });
      window.scrollTo(0, 0);
    } else if (response.currStatus == "Locked" && response.type == "GIFT") {
      response.status = "locked";
      giftList.push(response);
      this.setState({
        newCardBox: false,
        conditionalRefresh: true,
        // showLocked: true,
        // showExpired: false,
        txtvalue: "",
        // showInactive: false,
        giftList: giftList,
        error: ""
      });
      window.scrollTo(0, 0);
    } else {
      response.status = "active";
      giftList.push(response);
      this.setState({
        // showExpired: false,
        // showInactive: false,
        // showLocked: false,
        giftList: giftList,
        newCardBox: false,
        txtvalue: "",
        error: "",
        conditionalRefresh: true
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
      const elem: any = document.getElementById("gift");
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
                // showExpired={this.state.showExpired}
                // showLocked={this.state.showLocked}
                conditionalRefresh={this.state.conditionalRefresh}
                // showInactive={this.state.showInactive}
                onClose={this.onClose}
                key={i}
              />
            );
          })}
          <div
            className={cs(
              styles.loginForm,
              { [globalStyles.voffset4]: newCardBox },
              bootstrapStyles.colMd8
            )}
          >
            {newCardBox ? (
              <>
                <div className={styles.vMargin20}>
                  {toggleOtp ? (
                    ""
                  ) : (
                    <Fragment>
                      <div className={cs(styles.flex, styles.vCenterBalance)}>
                        <input
                          type="text"
                          autoComplete="off"
                          value={txtvalue}
                          onChange={this.changeValue}
                          id="gift"
                          className={
                            this.state.error
                              ? cs(styles.marginR10, styles.err)
                              : styles.marginR10
                          }
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
                      <label>Gift Card Code</label>
                    </Fragment>
                  )}
                  {this.state.error && (
                    <p className={cs(globalStyles.errorMsg)}>
                      {this.state.error}
                    </p>
                  )}
                </div>
              </>
            ) : (
              isLoggedIn && (
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
              toggleReset={this.state.toggleResetOtpComponent}
              updateError={this.updateError}
              txtvalue={this.state.txtvalue}
              toggleOtp={this.toggleOtp}
              key={200}
              sendOtp={this.props.sendOtp}
              checkOtpBalance={this.props.checkOtpBalance}
              updateList={this.updateList}
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
