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
import OtpComponent from "components/OtpComponent";

const mapStateToProps = (state: AppState) => {
  return {
    user: state.user,
    currency: state.currency
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

class ApplyGiftcard extends React.Component<Props, GiftState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txtvalue: "",
      error: "",
      newCardBox: true,
      giftList: [],
      toggelOtp: false
    };
  }
  // ProfileFormRef: RefObject<Formsy> = React.createRef();

  changeValue = (event: any) => {
    this.setState({
      txtvalue: event.target.value
    });
  };

  toggelOtp = (value: boolean) => {
    this.setState({
      toggelOtp: value
    });
  };

  gcBalance = () => {
    const data: any = {
      cardId: this.state.txtvalue
    };
    this.props.applyGiftCard(data).then(response => {
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
    });
  };

  gcBalanceOtp = (response: any) => {
    const { giftList } = this.state;
    if (response.currStatus == "Invalid-CN") {
      this.setState({
        error: "Please enter a valid code"
      });
    } else {
      giftList.push(response);
      this.setState({
        giftList: giftList,
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
    let { giftList } = this.state;
    giftList = giftList.filter(data => {
      return data.code != code;
    });
    this.setState({
      giftList: giftList
    });
  };

  updateError = (data: boolean) => {
    if (data) {
      this.setState({
        error: "Please enter a valid code"
      });
    }
    const elem: any = document.getElementById("gift");
    elem.scrollIntoView();
    window.scrollBy(0, -200);
  };

  render() {
    const { newCardBox, txtvalue, toggelOtp } = this.state;
    const {
      user: { isLoggedIn },
      currency
    } = this.props;
    return (
      <Fragment>
        <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
          {this.state.giftList.map((data, i) => {
            return (
              <GiftCardItem
                {...data}
                onClose={this.onClose}
                currency={currency}
                type="crd"
                currStatus={"sucess"}
                key={i}
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
                {toggelOtp ? (
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
                          onClick={this.gcBalance}
                        ></span>
                      </span>
                    </div>
                    <label>Gift Card Code</label>
                  </Fragment>
                )}
                {this.state.error ? (
                  <p
                    className={cs(
                      styles.errorMsg,
                      styles.ccErrorMsg,
                      styles.textLeft
                    )}
                  >
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
                [+] ADD ANOTHER GIFT CARD CODE
              </div>
            )}
          </div>
        </div>

        {!isLoggedIn ? (
          !newCardBox ? (
            ""
          ) : (
            <OtpComponent
              updateError={this.updateError}
              txtvalue={this.state.txtvalue}
              toggelOtp={this.toggelOtp}
              key={200}
              sendOtp={this.props.sendOtp}
              checkOtpBalance={this.props.checkOtpBalance}
              gcBalanceOtp={this.gcBalanceOtp}
            />
          )
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyGiftcard);
