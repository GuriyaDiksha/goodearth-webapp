import React, { Fragment } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./gift.scss";
import { RedeemState } from "./typings";
import mapDispatchToProps from "../mapper/action";
import { AppState } from "reducers/typings";
import OtpReedem from "components/OtpComponent/otpReedem";
import { errorTracking } from "utils/validate";
import { RouteComponentProps, withRouter } from "react-router";
import tooltipIcon from "images/tooltip.svg";
import tooltipOpenIcon from "images/tooltip-open.svg";

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    currency: state.currency,
    loyalty: state.basket.loyalty
  };
};
type Props = {
  setIsactiveredeem: (val: boolean) => void;
  isOTPSent: boolean;
  setIsOTPSent: (val: boolean) => void;
  closeModal: () => any;
} & ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> &
  RouteComponentProps;

class Reedem extends React.Component<Props, RedeemState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtvalue: "",
      error: "",
      newCardBox: true,
      toggleOtp: true,
      isActivated: false,
      showTooltip: false,
      showTooltipTwo: false
    };
  }
  // ProfileFormRef: RefObject<Formsy> = React.createRef();

  impactRef1 = React.createRef<HTMLInputElement>();
  impactRef2 = React.createRef<HTMLInputElement>();

  handleClickOutside = (evt: any) => {
    if (
      this.impactRef1.current &&
      !this.impactRef1.current.contains(evt.target)
    ) {
      this.setState({ showTooltip: false });
    }
    if (
      this.impactRef2.current &&
      !this.impactRef2.current.contains(evt.target)
    ) {
      this.setState({ showTooltipTwo: false });
    }
  };

  componentDidMount(): void {
    // if (
    //   this.props.user?.loyaltyData?.CustomerPointInformation
    //     ?.EligibleRedemptionPoints === 0
    // ) {
    //   this.setState({ error: "You don't have points to redeem" });
    // }

    document.addEventListener("mousedown", this.handleClickOutside);
  }

  UNSAFE_componentWillReceiveProps(
    nextProps: Readonly<Props>,
    nextContext: any
  ): void {
    // if (
    //   this.props.user?.loyaltyData?.CustomerPointInformation?.AvailablePoint !==
    //     nextProps.user?.loyaltyData?.CustomerPointInformation?.AvailablePoint &&
    //   nextProps.user?.loyaltyData?.CustomerPointInformation?.AvailablePoint ===
    //     0
    // ) {
    //   this.setState({ error: "You don't have points to redeem" });
    // }
  }

  changeValue = (event: any) => {
    const { loyaltyData } = this.props.user;
    const value = event.target.value;
    if (value == "" || +value < 0) {
      this.setState({
        error: "Please enter your Cerise Points",
        txtvalue: ""
      });
    } else if (
      +value <= loyaltyData?.CustomerPointInformation?.EligibleRedemptionPoints
      //  && value >= 0
    ) {
      this.setState({
        txtvalue: +value,
        error: ""
      });
    } else {
      this.setState({
        error:
          "You can redeem points upto " +
          loyaltyData?.CustomerPointInformation?.EligibleRedemptionPoints
      });
    }
  };

  toggleOtp = (value: boolean) => {
    this.setState({
      toggleOtp: value
    });
  };

  updateError = () => {
    this.setState(
      {
        error: "Please enter your Cerise Points"
      },
      () => {
        errorTracking([this.state.error], location.href);
      }
    );
    const elem: any = document.getElementById("redeem");
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
    this.props.removeRedeem(this.props.history, this.props.user.isLoggedIn);
  };

  setShowTip = (value: boolean) => {
    this.setState({ showTooltip: value });
  };

  setShowTipTwo = (value: boolean) => {
    this.setState({ showTooltipTwo: value });
  };

  render() {
    const { newCardBox, txtvalue, showTooltip, showTooltipTwo } = this.state;
    const { loyalty } = this.props;
    const { loyaltyData } = this.props.user;
    const isValidated = loyalty?.[0]?.isValidated;

    return (
      <Fragment>
        <div
          className={cs(
            bootstrapStyles.row,
            styles.giftDisplay,
            globalStyles.marginT25
          )}
        >
          <Fragment>
            <div className={cs(styles.textLeft)}>
              <div className={cs(styles.tooltipWrp)}>
                <p className={cs(styles.textLeft, styles.redeemBold)}>
                  {" "}
                  Cerise Balance points
                </p>

                <div className={styles.tooltip} ref={this.impactRef1}>
                  <img
                    src={showTooltip ? tooltipOpenIcon : tooltipIcon}
                    onClick={() => {
                      this.setShowTip(!showTooltip);
                    }}
                  />
                  <div
                    className={cs(styles.tooltipMsg, {
                      [styles.show]: showTooltip
                    })}
                  >
                    This balance shows the total number of points you have in
                    your Cerise account to redeem against purchases
                    <br />
                    <img
                      src={showTooltip ? tooltipOpenIcon : tooltipIcon}
                      onClick={() => {
                        this.setShowTip(!showTooltip);
                      }}
                    />
                  </div>
                </div>
              </div>

              <p className={cs(styles.textLeft, styles.redeemPoints)}>
                {loyaltyData?.CustomerPointInformation?.AvailablePoint}
              </p>
            </div>
            <div className={cs(styles.textLeft)} ref={this.impactRef2}>
              <div className={cs(styles.tooltipWrp)}>
                <p className={cs(styles.textLeft, styles.redeemBold)}>
                  Eligible for Redemption
                </p>
                <div className={styles.tooltip}>
                  <img
                    src={showTooltipTwo ? tooltipOpenIcon : tooltipIcon}
                    onClick={() => {
                      this.setShowTipTwo(!showTooltipTwo);
                    }}
                  />
                  <div
                    className={cs(styles.tooltipMsg, {
                      [styles.show]: showTooltipTwo,
                      [styles.tipTwo]: showTooltipTwo
                    })}
                  >
                    Redemption of points is applicable on select products. You
                    can check redemption eligibility on the product page.
                    <a
                      href={"/customer-assistance/terms"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </a>
                    .
                    <br />
                    <img
                      src={showTooltipTwo ? tooltipOpenIcon : tooltipIcon}
                      onClick={() => {
                        this.setShowTipTwo(!showTooltipTwo);
                      }}
                    />
                  </div>
                </div>
              </div>
              <p
                className={cs(
                  styles.textLeft,
                  styles.redeemPoints,
                  styles.aqua
                )}
              >
                {
                  loyaltyData?.CustomerPointInformation
                    ?.EligibleRedemptionPoints
                }
              </p>
            </div>
            <div className={cs(styles.textLeft, styles.pointsToRedeem)}>
              Enter points to redeem:
            </div>
            <div
              className={cs(
                styles.loginForm,
                { [globalStyles.voffset3]: newCardBox },
                bootstrapStyles.colMd12
              )}
            >
              <div
                className={cs(styles.flex, styles.vCenter, {
                  [globalStyles.hidden]: !newCardBox
                })}
              >
                <input
                  type="number"
                  value={
                    loyaltyData?.CustomerPointInformation
                      ?.EligibleRedemptionPoints > 0
                      ? txtvalue
                      : loyaltyData?.CustomerPointInformation
                          ?.EligibleRedemptionPoints
                  }
                  onKeyDown={evt => evt.key === "." && evt.preventDefault()}
                  onChange={this.changeValue}
                  id="redeem"
                  min="0"
                  className={
                    this.state.error
                      ? cs(styles.marginR10, styles.err)
                      : cs(styles.marginR10, styles.redeemInput)
                  }
                  aria-label="redeem-code"
                  disabled={
                    loyaltyData?.CustomerPointInformation
                      ?.EligibleRedemptionPoints > 0
                      ? false
                      : true
                  }
                />
              </div>
              <label>Points</label>

              {this.state.error ? (
                <p className={cs(styles.textLeft, globalStyles.errorMsg)}>
                  {this.state.error}
                </p>
              ) : (
                ""
              )}

              {loyaltyData?.CustomerPointInformation
                ?.EligibleRedemptionPoints <= 0 && (
                <p className={cs(styles.textLeft, styles.noEnoughPoint)}>
                  You don&apos;t have points to redeem
                </p>
              )}
            </div>
            <div className={bootstrapStyles.colMd12}>
              <OtpReedem
                updateError={this.updateError}
                toggleOtp={this.toggleOtp}
                key={"reedem"}
                isLoggedIn={this.props.user.isLoggedIn}
                history={this.props.history}
                sendOtp={this.props.sendOtpRedeem}
                isCredit={true}
                checkOtpRedeem={this.props.checkOtpRedeem}
                updateList={this.updateList}
                CustomerPointInformation={loyaltyData?.CustomerPointInformation}
                points={this.state.txtvalue}
                number={this.props.user.phoneNumber}
                removeRedeem={this.removeRedeem}
                closeModal={this.props.closeModal}
                setIsactiveredeem={this.props.setIsactiveredeem}
                email={this.props.user.email}
                resendOtp={this.props.resendOtpRedeem}
                validated={isValidated}
                disableBtn={this.state.error}
                isOTPSent={this.props.isOTPSent}
                setIsOTPSent={this.props.setIsOTPSent}
              />
            </div>
          </Fragment>
        </div>
      </Fragment>
    );
  }
}

const ReedemRouter = withRouter(Reedem);
export default connect(mapStateToProps, mapDispatchToProps)(ReedemRouter);
