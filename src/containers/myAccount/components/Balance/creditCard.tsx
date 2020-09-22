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

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.user.isLoggedIn
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

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
      inputType: "CNI"
    };
    this.props
      .balanceCheck(data)
      .then(response => {
        const { giftList } = this.state;
        if (response.currStatus == "Invalid-CN" || response.type == "GIFT") {
          this.setState({
            error: "Please enter a valid code"
          });
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
        } else {
          response.status = "active";
          giftList.push(response);
          this.setState({
            giftList: giftList,
            newCardBox: false,
            txtvalue: "",
            error: ""
            // showExpired: false,
            // showInactive: false,
            // showLocked: false
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err.response.data.message
        });
      });
  };

  updateList = (response: any) => {
    const { giftList } = this.state;
    if (response.currStatus == "Invalid-CN") {
      this.setState({
        error: "Please enter a valid code"
      });
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
    } else {
      response.status = "active";
      giftList.push(response);
      this.setState({
        giftList: giftList,
        newCardBox: false,
        txtvalue: "",
        error: ""
        // showExpired: false,
        // showInactive: false,
        // showLocked: false
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

  updateError = (message: string) => {
    if (message) {
      this.setState({
        error: message
      });
      const elem: any = document.getElementById("credit");
      elem.scrollIntoView();
      window.scrollBy(0, -200);
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
              bootstrapStyles.colMd8
            )}
          >
            {newCardBox ? (
              <div>
                {toggleOtp ? (
                  ""
                ) : (
                  <Fragment>
                    <div className={cs(styles.flex, styles.vCenter)}>
                      <input
                        type="text"
                        autoComplete="off"
                        value={txtvalue}
                        onChange={this.changeValue}
                        id="credit"
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
                    <label>Credit Note</label>
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
              <div
                className={cs(
                  styles.rtcinfo,
                  globalStyles.pointer,
                  globalStyles.textLeft
                )}
                onClick={this.newGiftcard}
              >
                [+] CHECK ANOTHER CREDIT NOTE CODE
              </div>
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
