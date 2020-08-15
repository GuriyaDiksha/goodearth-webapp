import React, { Fragment } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./gift.scss";
import { RedeemState, ReddemProps } from "./typings";
import mapDispatchToProps from "../mapper/action";
import iconStyles from "styles/iconFonts.scss";
import { AppState } from "reducers/typings";
import OtpReedem from "components/OtpComponent/otpReedem";

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    currency: state.currency,
    loyalty: state.basket.loyalty
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> &
  ReddemProps;

class Reedem extends React.Component<Props, RedeemState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtvalue: "",
      error: "",
      newCardBox: true,
      toggleOtp: true,
      isActivated: false
    };
  }
  // ProfileFormRef: RefObject<Formsy> = React.createRef();

  changeValue = (event: any) => {
    const { loyaltyData } = this.props;
    if (
      +event.target.value <= loyaltyData.eligiblePoints &&
      +event.target.value >= 0
    ) {
      this.setState({
        txtvalue: +event.target.value,
        error: ""
      });
    } else {
      this.setState({
        error: "Cant enter value more than" + loyaltyData.eligiblePoints
      });
    }
  };

  toggleOtp = (value: boolean) => {
    this.setState({
      toggleOtp: value
    });
  };

  updateError = () => {
    this.setState({
      error: "Please enter points"
    });
    const elem: any = document.getElementById("gift");
    elem.scrollIntoView();
    window.scrollBy(0, -200);
  };

  updateList = (response: any) => {
    // const { giftList } = this.state;
    // if (response.currStatus == "Invalid-CN") {
    //   this.setState({
    //     error: "Please enter a valid code"
    //   });
    // } else {
    //   giftList.push(response);
    //   this.setState({
    //     giftList: giftList,
    //     newCardBox: false,
    //     txtvalue: ""
    //   });
    // }
  };

  removeRedeem = async () => {
    this.props.removeRedeem();
  };

  render() {
    const { newCardBox, txtvalue } = this.state;
    const { loyalty } = this.props;
    const points = loyalty?.[0]?.points;
    console.log(this.props.user);
    return (
      <Fragment>
        <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
          {points ? (
            <div
              className={cs(
                styles.textLeft,
                styles.rtcinfo,
                globalStyles.voffset3
              )}
            >
              <span>{points} CERISE POINTS </span>
              <span className={styles.textMuted}>REDEEMED</span>
              <span
                className={styles.cross}
                onClick={() => {
                  this.removeRedeem();
                }}
              >
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCrossNarrowBig,
                    styles.closeFont
                  )}
                ></i>
              </span>
              <div className={globalStyles.errorMsg}>
                You have successfully redeemed your Cerise points.
              </div>
            </div>
          ) : (
            <Fragment>
              <div className={cs(styles.textLeft, globalStyles.voffset4)}>
                <p className={cs(globalStyles.cerise, styles.redeemBold)}>
                  {" "}
                  CERISE POINTS BALANCE:
                </p>
                <p className={styles.textMuted}>
                  {this.props.loyaltyData?.customerPoints}
                </p>
              </div>
              <div className={cs(styles.textLeft, globalStyles.voffset4)}>
                <p className={cs(globalStyles.cerise, styles.redeemBold)}>
                  ELIGIBLE FOR REDEMPTION:
                </p>
                <p className={styles.textMuted}>
                  {this.props.loyaltyData?.eligiblePoints}
                </p>
              </div>
              <div
                className={cs(
                  styles.textLeft,
                  globalStyles.voffset4,
                  styles.textMuted
                )}
              >
                ENTER POINTS TO REDEEM
              </div>
              <div
                className={cs(
                  styles.loginForm,
                  { [globalStyles.voffset4]: newCardBox },
                  bootstrapStyles.colMd4
                )}
              >
                <div
                  className={cs(styles.flex, styles.vCenter, {
                    [globalStyles.hidden]: !newCardBox
                  })}
                >
                  <input
                    type="number"
                    value={txtvalue}
                    onChange={this.changeValue}
                    id="redeem"
                    className={
                      this.state.error
                        ? cs(styles.marginR10, styles.err)
                        : styles.marginR10
                    }
                  />
                </div>
                <label>Redeem Points</label>

                {this.state.error ? (
                  <p className={cs(globalStyles.errorMsg)}>
                    {this.state.error}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className={bootstrapStyles.colMd8}>
                <OtpReedem
                  updateError={this.updateError}
                  toggleOtp={this.toggleOtp}
                  key={"reedem"}
                  sendOtp={this.props.sendOtpRedeem}
                  isCredit={true}
                  checkOtpRedeem={this.props.checkOtpRedeem}
                  updateList={this.updateList}
                  loyaltyData={this.props.loyaltyData}
                  points={this.state.txtvalue}
                  number={this.props.user.phoneNumber}
                />
              </div>
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reedem);
