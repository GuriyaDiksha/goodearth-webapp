import React from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import { PasswordProps, State } from "./typings";
import mapDispatchToProps from "./mapper/actions";
import Giftcard from "./giftcard";
import CreditCard from "./creditCard";
import { AppState } from "reducers/typings";
import { Link } from "react-router-dom";

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    mobile: state.device.mobile
  };
};
type Props = PasswordProps &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

class CheckBalance extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
    this.state = {
      isActive: false,
      isActiveCN: false
    };
  }

  toggleInputGC = () => {
    this.setState(previous => {
      return { isActive: !previous.isActive, isActiveCN: false };
    });
  };

  toggleInputCN = () => {
    this.setState(previous => {
      return { isActiveCN: !previous.isActiveCN, isActive: false };
    });
  };

  render() {
    return (
      <div className={bootstrapStyles.row}>
        <div className={bootstrapStyles.col12}>
          <div className={styles.formHeading}>Check Balance</div>
          <div
            className={cs(styles.formSubheading, styles.activategcSubheading)}
          >
            Check your gift card or credit note balance
          </div>
          <div className={cs(styles.loginForm, globalStyles.voffset4)}>
            <div className={bootstrapStyles.row}>
              <div
                className={cs(
                  bootstrapStyles.colMd12,
                  globalStyles.textCenter,
                  styles.popupformbg
                )}
              >
                <div className={bootstrapStyles.row}>
                  <div
                    className={cs({
                      [bootstrapStyles.col12]: this.props.mobile,
                      [bootstrapStyles.offset0]: this.props.mobile,
                      [bootstrapStyles.col10]: !this.props.mobile,
                      [bootstrapStyles.offset1]: !this.props.mobile
                    })}
                  >
                    <div
                      className={cs(styles.balanceContainer, styles.marginFix)}
                    >
                      <div
                        className={cs(styles.flex, styles.section)}
                        id="gc-balance"
                      >
                        <div
                          className={cs(styles.horizontal, {
                            [styles.open]: this.state.isActive
                          })}
                          onClick={this.toggleInputGC}
                        >
                          {/* {this.state.isActive ? "-" : "+"} */}
                        </div>
                        <div className={cs(styles.inputContainer)}>
                          <div
                            className={cs(styles.colorPrimary, styles.textLeft)}
                          >
                            <span
                              onClick={this.toggleInputGC}
                              className={styles.balanceSectionHead}
                            >
                              CHECK YOUR GIFT CARD BALANCE{" "}
                            </span>
                          </div>
                          <div>
                            {this.state.isActive && (
                              <Giftcard isFromCheckBalance={true} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className={cs(styles.flex, styles.section)}
                        id="cc-balance"
                      >
                        <div
                          className={cs(styles.horizontal, {
                            [styles.open]: this.state.isActiveCN
                          })}
                          onClick={this.toggleInputCN}
                        >
                          {/* {this.state.isActiveCN ? "-" : "+"} */}
                        </div>
                        <div className={cs(styles.inputContainer)}>
                          <div
                            className={cs(styles.colorPrimary, styles.textLeft)}
                          >
                            <span
                              onClick={this.toggleInputCN}
                              className={styles.balanceSectionHead}
                            >
                              CHECK YOUR CREDIT NOTE BALANCE
                            </span>
                          </div>
                          <div>
                            {this.state.isActiveCN && (
                              <CreditCard isFromCheckBalance={true} />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.rtc}>
                        <Link
                          to="/customer-assistance/terms-conditions"
                          className={styles.underlineLink}
                          target="_blank"
                        >
                          {" "}
                          View Terms & Conditions{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckBalance);
