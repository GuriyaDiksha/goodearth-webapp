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
      toggleOtp: false,
      isActivated: false,
      cardType: "Select",
      isLoader: false,
      isError: false
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

  toggleOtp = (value: boolean) => {
    this.setState({
      toggleOtp: value
    });
  };

  applyCard = () => {
    debugger;
    if (!this.state.txtvalue) {
      this.setState(
        {
          error: "Please enter a Code",
          isActivated: false
        },
        () => {
          errorTracking([this.state.error], location.href);
        }
      );
      return false;
    }
    console;
    if (this.state.cardType == "Select") {
      this.setState(
        {
          error: "Please select a valid option",
          isActivated: false,
          isError: true
        },
        () => {
          errorTracking([this.state.error], location.href);
        }
      );

      return false;
    }
    const data: any = {
      cardId: this.state.txtvalue,
      type: this.state.cardType
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
          }
          this.setState({
            txtvalue: "",
            error: "",
            isLoader: false
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
          errorTracking([this.state.error], location.href);
        }
      );
    } else {
      this.setState({
        txtvalue: ""
      });
    }
  };

  newGiftcard = () => {
    this.setState({});
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
    // setModevalue(event.target.value);
    this.setState({
      cardType: value,
      error: ""
    });
  };

  render() {
    const { newCardBox, txtvalue, toggleOtp, isLoader } = this.state;
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
              {toggleOtp ? (
                ""
              ) : (
                <Fragment>
                  <div className={cs(styles.flex, styles.vCenter)}>
                    <SelectableDropdownMenu
                      id="giftcard_dropdown"
                      align="right"
                      className={cs(
                        { [globalStyles.errorBorder]: this.state.isError },
                        mobile
                          ? styles.selectRelativemobile
                          : styles.selectRelative
                      )}
                      items={modeOptions}
                      onChange={this.onchange}
                      showCaret={true}
                      value={this.state.cardType}
                      key={"plpPage"}
                    ></SelectableDropdownMenu>
                    {/* <FormSelect
                        required
                        name="giftselect"
                        label=""
                        disable={false}
                        
                        options={modeOptions}
                        handleChange={this.onchange}
                        value={this.state.cardType}
                        validations={{
                          isExisty: true
                        }}
                      /> */}
                    <div className={cs(styles.giftInput)}>
                      <input
                        type="text"
                        value={txtvalue}
                        onChange={this.changeValue}
                        id="gift"
                        className={
                          this.state.error
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
                  {/* {this.state.cardType == "GIFTCARD" ? (
                      <label>Gift Card Code</label>
                    ) : (
                      <label>Credit Note</label>
                    )} */}
                </Fragment>
              )}
              {console.log("this.state.error", this.state.error)}
              {this.state.error ? (
                <span className={cs(globalStyles.errorMsg)}>
                  {this.state.error}
                </span>
              ) : (
                ""
              )}
              {this.state.isActivated && this.state.error ? (
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
            {/* ) : (
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
            )} */}
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
