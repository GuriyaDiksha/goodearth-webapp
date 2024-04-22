import React, { Fragment } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./gift.scss";
import { GiftState } from "./typings";
import mapDispatchToProps from "../mapper/action";
import { AppState } from "reducers/typings";
import { errorTracking } from "utils/validate";
import { RouteComponentProps, withRouter } from "react-router";
import Button from "components/Button";
const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    voucherDiscounts: state.basket.voucherDiscounts,
    isLoggedIn: state.user.isLoggedIn
  };
};
export type PromoProps = {
  onRef: any;
  onNext: () => void;
  onsubmit: () => void;
  promoVal: string;
  setIsLoading: (a: boolean) => void;
};
type Props = {} & ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> &
  PromoProps &
  RouteComponentProps;

class ApplyPromo extends React.Component<Props, GiftState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtvalue: "",
      error: "",
      newCardBox: true,
      toggleOtp: true,
      isActivated: false
    };
    // this.props.onRef(this);
  }
  // ProfileFormRef: RefObject<Formsy> = React.createRef();
  componentDidMount = () => {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
    if (this.props.promoVal) {
      this.setState({ txtvalue: this.props.promoVal });
    }
  };

  componentDidUpdate = (prevProps: Props) => {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  };
  changeValue = (event: any) => {
    this.setState({
      txtvalue: event.target.value,
      error: ""
    });
  };

  toggleOtp = (value: boolean) => {
    this.setState({
      toggleOtp: value
    });
  };

  gcBalance = () => {
    const data: any = {
      cardId: this.state.txtvalue
    };
    this.props
      .applyPromo(data, this.props.history, this.props.isLoggedIn)
      .then((response: any) => {
        if (response.status == false) {
          this.setState(
            {
              error: response.message
            },
            () => {
              errorTracking([this.state.error], location.href);
              this.props.setIsLoading(false);
            }
          );
        } else {
          this.setState(
            {
              newCardBox: false
              // txtvalue: ""
            },
            () => {
              this.props.onNext();
              this.props.setIsLoading(false);
            }
          );
        }
      })
      .catch(error => {
        const msg = error.response.data.msg;
        this.setState(
          {
            error: msg
          },
          () => {
            errorTracking([this.state.error], location.href);
            this.props.setIsLoading(false);
          }
        );
      });
  };

  newGiftcard = () => {
    this.setState({
      newCardBox: true
    });
  };

  updateError = () => {
    this.setState(
      {
        error: "Please enter a valid code"
      },
      () => {
        errorTracking([this.state.error], location.href);
      }
    );
    const elem: any = document.getElementById("gift");
    elem.scrollIntoView();
    window.scrollBy(0, -200);
  };

  render() {
    const { newCardBox, txtvalue } = this.state;
    return (
      <Fragment>
        <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
          <div
            className={cs(
              styles.loginForm,
              { [globalStyles.voffset3]: newCardBox },
              bootstrapStyles.colMd10
            )}
          >
            <div>
              <Fragment>
                <div
                  className={cs(
                    styles.flex,
                    styles.vCenter,
                    styles.promoInput,
                    {
                      [globalStyles.hidden]: !newCardBox
                    }
                  )}
                >
                  <input
                    type="text"
                    autoComplete="off"
                    value={txtvalue}
                    onChange={this.changeValue}
                    id="gift"
                    className={
                      this.state.error ? cs(styles.err) : styles.promoInputBox
                    }
                    aria-label="Promocode"
                  />
                  <Button
                    // className={cs(styles.promoApplyBtn, {
                    //   [styles.emptyPromoValue]: txtvalue == ""
                    // })}
                    onClick={() => this.props.onsubmit()}
                    label={"APPLY"}
                    disabled={txtvalue == ""}
                    variant="smallMedCharcoalCta"
                    stopHover={true}
                    className={styles.promoApply}
                  />
                </div>
              </Fragment>
              {this.state.error ? (
                <p className={cs(globalStyles.errorMsg)}>{this.state.error}</p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const ApplyPromoRouter = withRouter(ApplyPromo);
export default connect(mapStateToProps, mapDispatchToProps)(ApplyPromoRouter);
