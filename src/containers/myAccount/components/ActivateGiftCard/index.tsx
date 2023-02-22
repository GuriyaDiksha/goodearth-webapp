import React from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import { PasswordProps, State } from "./typings";
// import mapDispatchToProps from "./mapper/actions";
import Giftcard from "./activateGiftCard";
// import CreditCard from "./creditCard";
import { AppState } from "reducers/typings";
import { Link } from "react-router-dom";

const mapStateToProps = (state: AppState) => {
  return {
    isLoggedIn: state.user.isLoggedIn
  };
};
const mapDispatchToProps = () => {
  return {};
};
type Props = PasswordProps &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

class ActivateGiftCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
    this.state = {
      isActive: false,
      isActiveCN: false
    };
  }

  toggleInputGC = () => {
    // this.setState(previous => {
    //   return { isActive: !previous.isActive, isActiveCN: false };
    // });
  };

  toggleInputCN = () => {
    // this.setState(previous => {
    //   return { isActiveCN: !previous.isActiveCN, isActive: false };
    // });
  };

  render() {
    return (
      <div className={bootstrapStyles.row}>
        <div className={bootstrapStyles.col12}>
          <div className={styles.formHeading}>Activate Gift Card </div>
          <div className={styles.formSubheading}>
            Enter your personal information to activate your gift card
          </div>
          <div className={cs(styles.loginForm, globalStyles.voffset4)}>
            <div
              className={cs(bootstrapStyles.row, styles.otpComponentContainer)}
            >
              <div
                className={cs(
                  bootstrapStyles.colMd12,
                  globalStyles.textCenter,
                  styles.popupformbg
                )}
              >
                <div className={cs(bootstrapStyles.row, styles.formContainer)}>
                  <div
                    className={cs(
                      bootstrapStyles.col10,
                      // bootstrapStyles.offset1,
                      bootstrapStyles.colMd8
                      // bootstrapStyles.offsetMd2
                    )}
                  >
                    <Giftcard />
                  </div>
                </div>
                <Link
                  to="/customer-assistance/terms-conditions?id=howtoactivategiftcard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewTnc}
                >
                  View Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivateGiftCard);
