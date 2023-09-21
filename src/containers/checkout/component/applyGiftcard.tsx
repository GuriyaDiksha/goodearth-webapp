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
import { errorTracking } from "utils/validate";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import Loader from "components/Loader";

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    currency: state.currency,
    giftList: state.basket.giftCards,
    total: state.basket.total,
    addnewGiftcard: state.basket.addnewGiftcard,
    mobile: state.device.mobile
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> & {
    onRef: any;
  } & RouteComponentProps;

class ApplyGiftcard extends React.Component<Props, GiftState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtvalue: "",
      error: "",
      newCardBox: true,
      isActivated: false,
      cardType: "Select",
      isLoader: false,
      isError: false,
      isEmptyInput: false
    };
  }
  private firstLoad = true;
  // ProfileFormRef: RefObject<Formsy> = React.createRef();

  // PaymentFormRef: RefObject<Formsy> = React.createRef();
  componentDidMount = () => {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  };

  componentDidUpdate = (prevProps: Props) => {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  };

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

  applyCard = () => {
    const { cardType, txtvalue, error } = this.state;
    this.setState({ error: "", isError: false, isEmptyInput: false });

    let errMsg = "";
    if (cardType == "Select" && !txtvalue) {
      errMsg = "Please select a valid option & enter a valid code";
    } else if (cardType == "Select") {
      errMsg = "Please select a valid option";
    } else if (!txtvalue) {
      errMsg = "Please enter a valid code";
    }

    if (errMsg) {
      this.setState(
        {
          error: errMsg,
          isActivated: false,
          isError: cardType == "Select",
          isEmptyInput: !txtvalue
        },
        () => {
          errorTracking([error], location.href);
        }
      );
      return false;
    }

    const data: any = {
      cardId: txtvalue,
      type: cardType
    };

    this.setState({ isLoader: true });

    this.props
      .applyGiftCard(data, this.props.history, this.props.user.isLoggedIn)
      .then((response: any) => {
        if (response.status == false) {
          this.updateError(response.message, response.isNotActivated);
          this.setState({ isLoader: false });
        } else {
          const userConsent = CookieService.getCookie("consent").split(",");
          if (userConsent.includes(GA_CALLS)) {
            dataLayer.push({
              event: "eventsToSend",
              eventAction: "giftCard",
              eventCategory: "promoCoupons",
              eventLabel: data.cardId
            });
            dataLayer.push({
              event: "gift_card_or_credit_note",
              click_type: cardType,
              gift_card_code: data.cardId
            });
          }
          this.setState({
            txtvalue: "",
            error: "",
            isLoader: false
          });
        }
      });
  };

  onClose = (code: string, type: string) => {
    const data: any = {
      cardId: code,
      type: type
    };
    this.setState({ isLoader: true });
    this.props
      .removeGiftCard(data, this.props.history, this.props.user.isLoggedIn)
      .then(response => {
        this.setState({
          error: "",
          isLoader: false
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
        errorTracking([this.state.error], location.href);
      }
    );
    const elem: any = document.getElementById("gift");
    elem.scrollIntoView();
    window.scrollBy(0, -200);
  };

  onchange = (value: any) => {
    this.setState({
      cardType: value,
      error: "",
      isError: false,
      isEmptyInput: false
    });
  };

  render() {
    const {
      newCardBox,
      txtvalue,
      isLoader,
      error,
      isActivated,
      isEmptyInput,
      isError,
      cardType
    } = this.state;
    const {
      user: { isLoggedIn },
      currency,
      giftList,
      mobile
    } = this.props;
    const modeOptions = [
      {
        value: "GIFTCARD",
        label: "Gift Card"
      },
      {
        value: "CREDITNOTE",
        label: "Credit Note"
      }
    ];
    return (
      <Fragment>
        <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
          <div
            className={cs(
              styles.loginForm,
              { [globalStyles.voffset3]: newCardBox },
              bootstrapStyles.colMd7
            )}
          >
            {/* {newCardBox ? ( */}
            <div>
              <Fragment>
                <div className={cs(styles.flex, styles.vCenter)}>
                  <SelectableDropdownMenu
                    id="giftcard_dropdown"
                    align="right"
                    className={cs(
                      { [globalStyles.errorBorder]: isError },
                      mobile
                        ? styles.selectRelativemobile
                        : styles.selectRelative
                    )}
                    items={modeOptions}
                    onChange={this.onchange}
                    showCaret={true}
                    value={cardType}
                    key={"plpPage"}
                  ></SelectableDropdownMenu>

                  <div className={cs(styles.giftInput)}>
                    <input
                      type="text"
                      value={txtvalue}
                      onChange={this.changeValue}
                      id="gift"
                      className={
                        (error && !isError) || isEmptyInput
                          ? cs(
                              styles.marginR10,
                              styles.ht50,
                              styles.err,
                              styles.giftCardCodeInput
                            )
                          : cs(
                              styles.marginR10,
                              styles.ht50,
                              styles.giftCardCodeInput
                            )
                      }
                      aria-label="giftcard code"
                    />
                    <span
                      className={cs(styles.applyBtn, globalStyles.pointer, {
                        [globalStyles.hidden]: !isLoggedIn
                      })}
                      onClick={this.applyCard}
                    >
                      Apply
                    </span>
                  </div>
                </div>
              </Fragment>

              {error ? (
                <span className={cs(globalStyles.errorMsg)}>{error}</span>
              ) : (
                ""
              )}
              {isActivated && error ? (
                <p
                  className={cs(
                    styles.activeUrl,
                    globalStyles.charcoal,
                    globalStyles.voffset1
                  )}
                >
                  <Link
                    target="_blank"
                    to={"/account/giftcard-activation"}
                    className={globalStyles.charcoal}
                  >
                    ACTIVATE GIFT CARD
                  </Link>
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
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
        </div>
        {isLoader && <Loader />}
      </Fragment>
    );
  }
}

const ApplyGiftcardRouter = withRouter(ApplyGiftcard);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplyGiftcardRouter);
