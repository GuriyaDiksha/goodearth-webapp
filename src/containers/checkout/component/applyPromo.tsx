import React, { Fragment } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./gift.scss";
import { GiftState } from "./typings";
import mapDispatchToProps from "../mapper/action";
import PromoItem from "./promoDetails";
import { AppState } from "reducers/typings";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    voucherDiscounts: state.basket.voucherDiscounts
  };
};
export type PromoProps = {
  onRef: any;
  onNext: () => void;
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> &
  PromoProps;

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
    this.props.onRef(this);
  }
  // ProfileFormRef: RefObject<Formsy> = React.createRef();

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

  gcBalance = () => {
    const data: any = {
      cardId: this.state.txtvalue
    };
    this.props
      .applyPromo(data)
      .then((response: any) => {
        if (response.status == false) {
          this.setState({
            error: response.message
          });
        } else {
          this.setState({
            newCardBox: false,
            txtvalue: ""
          });
          this.props.onNext();
        }
      })
      .catch(error => {
        const msg = error.response?.data?.[0];
        this.setState({
          error: msg
        });
      });
  };

  gcBalanceOtp = (response: any) => {
    if (response.status == false) {
      this.updateError();
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
    this.props.removePromo(data).then(response => {
      this.setState({
        newCardBox: true
      });
    });
  };

  updateError = () => {
    this.setState({
      error: "Please enter a valid code"
    });
    const elem: any = document.getElementById("gift");
    elem.scrollIntoView();
    window.scrollBy(0, -200);
  };

  render() {
    const { newCardBox, txtvalue } = this.state;
    const { currency, voucherDiscounts } = this.props;
    return (
      <Fragment>
        <div className={cs(bootstrapStyles.row, styles.giftDisplay)}>
          {voucherDiscounts.map((data, i) => {
            return (
              <PromoItem
                {...data.voucher}
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
            {voucherDiscounts.length == 0 ? (
              <div>
                <Fragment>
                  <div
                    className={cs(styles.flex, styles.vCenter, {
                      [globalStyles.hidden]: !newCardBox
                    })}
                  >
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
                  <label>Promo Code</label>
                </Fragment>
                {this.state.error ? (
                  <p className={cs(globalStyles.errorMsg)}>
                    {this.state.error}
                  </p>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyPromo);
