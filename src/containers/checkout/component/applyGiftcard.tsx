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
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
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
      isActivated: false,
      cardType: "GIFTCARD"
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
      cardId: this.state.txtvalue,
      type: this.state.cardType
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
            txtvalue: "",
            error: ""
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
  onClose = (code: string, type: string) => {
    // debugger
    const data: any = {
      cardId: code,
      type: type
    };
    this.props
      .removeGiftCard(data, this.props.history, this.props.user.isLoggedIn)
      .then(response => {
        this.setState({
          newCardBox: true,
          error: ""
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

  onchange = (value: any) => {
    // setModevalue(event.target.value);
    this.setState({
      cardType: value,
      error: ""
    });
  };

  render() {
    const { newCardBox, txtvalue, toggleOtp } = this.state;
    const {
      user: { isLoggedIn },
      currency,
      giftList,
      total,
      addnewGiftcard,
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
                      <SelectableDropdownMenu
                        id="giftcard_dropdown"
                        align="right"
                        className={
                          mobile
                            ? styles.selectRelativemobile
                            : styles.selectRelative
                        }
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
                      <div className={styles.giftInput}>
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
                      </div>

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
                    {this.state.cardType == "GIFTCARD" ? (
                      <label>Gift Card Code</label>
                    ) : (
                      <label>Credit Note</label>
                    )}
                  </Fragment>
                )}
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
