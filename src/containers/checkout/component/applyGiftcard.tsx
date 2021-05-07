import React, { Fragment } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./gift.scss";
import { GiftState } from "./typings";
import mapDispatchToProps from "../mapper/action";
import GiftCardItem from "./giftDetails";
import { AppState } from "reducers/typings";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import * as valid from "utils/validate";

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    currency: state.currency,
    giftList: state.basket.giftCards,
    total: state.basket.total,
    addnewGiftcard: state.basket.addnewGiftcard
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> &
  RouteComponentProps;

class ApplyGiftcard extends React.Component<Props, GiftState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtvalue: "",
      error: "",
      newCardBox: props.giftList.length > 0 ? false : true,
      toggleOtp: false,
      isActivated: false
    };
  }
  private firstLoad = true;
  // ProfileFormRef: RefObject<Formsy> = React.createRef();

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps.giftList.length > 0 && this.firstLoad) {
      this.firstLoad = false;
      this.setState({
        newCardBox: false
      });
    }
  }

  changeValue = (event: any) => {
    this.setState({
      txtvalue: event.target.value
    });
  };

  toggleOtp = (value: boolean) => {
    this.setState({
      toggleOtp: value
    });
  };

  applyCard = () => {
    if (!this.state.txtvalue) {
      this.setState(
        {
          error: "Please enter a Code",
          isActivated: false
        },
        () => {
          valid.errorTracking([this.state.error], location.href);
        }
      );
      return false;
    }
    const data: any = {
      cardId: this.state.txtvalue
    };

    this.props
      .applyGiftCard(data, this.props.history, this.props.user.isLoggedIn)
      .then((response: any) => {
        if (response.status == false) {
          this.updateError(response.message, response.isNotActivated);
        } else {
          dataLayer.push({
            event: "eventsToSend",
            eventAction: "giftCard",
            eventCategory: "promoCoupons",
            eventLabel: data.cardId
          });
          this.setState({
            newCardBox: false,
            txtvalue: ""
          });
        }
      });
  };

  gcBalanceOtp = (response: any) => {
    if (response.status == false) {
      this.setState(
        {
          error: "Please enter a valid Gift Card code."
        },
        () => {
          valid.errorTracking([this.state.error], location.href);
        }
      );
    } else {
      this.setState({
        newCardBox: false,
        txtvalue: ""
      });
    }
  };

  newGiftcard = () => {
    this.setState({
      newCardBox: true
    });
  };
  onClose = (code: string) => {
    const data: any = {
      cardId: code
    };
    this.props
      .removeGiftCard(data, this.props.history, this.props.user.isLoggedIn)
      .then(response => {
        this.setState({
          newCardBox: true
        });
      });
  };

  updateError = (value?: string, activate?: boolean) => {
    this.setState(
      {
        error: value ? value : "Please enter a valid Gift Card code.",
        isActivated: activate ? true : false
      },
      () => {
        valid.errorTracking([this.state.error], location.href);
      }
    );
    const elem: any = document.getElementById("gift");
    elem.scrollIntoView();
    window.scrollBy(0, -200);
  };

  render() {
    const { newCardBox, txtvalue, toggleOtp } = this.state;
    const {
      user: { isLoggedIn },
      currency,
      giftList,
      total,
      addnewGiftcard
    } = this.props;
    return (
      <Fragment>
        <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
          {giftList.map((data, i) => {
            return (
              <GiftCardItem
                isLoggedIn={isLoggedIn}
                {...data}
                onClose={this.onClose}
                currency={currency}
                type="crd"
                currStatus={"sucess"}
                key={"gift" + i}
              />
            );
          })}
          <div
            className={cs(
              styles.loginForm,
              { [globalStyles.voffset4]: newCardBox },
              bootstrapStyles.colMd7
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
                          onClick={this.applyCard}
                        ></span>
                      </span>
                    </div>
                    <label>Gift Card Code / Credit Note</label>
                  </Fragment>
                )}
                {this.state.error ? (
                  <span className={cs(globalStyles.errorMsg)}>
                    {this.state.error}
                  </span>
                ) : (
                  ""
                )}
                {this.state.isActivated ? (
                  <p
                    className={cs(
                      styles.activeUrl,
                      globalStyles.cerise,
                      globalStyles.voffset1
                    )}
                  >
                    <Link to={"/account/giftcard-activation"}>
                      ACTIVATE GIFT CARD
                    </Link>
                  </p>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div
                className={cs(
                  {
                    [globalStyles.hidden]: +total <= 0 || +addnewGiftcard <= 0
                  },
                  styles.rtcinfo,
                  globalStyles.pointer,
                  globalStyles.textLeft
                )}
                onClick={this.newGiftcard}
              >
                [+] ADD ANOTHER GIFT CARD CODE / CREDIT NOTE
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

const ApplyGiftcardRouter = withRouter(ApplyGiftcard);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplyGiftcardRouter);
