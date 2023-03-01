import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import styles from "./styles.scss";
import cs from "classnames";
import GrowlMessage from "components/GrowlMessage";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../styles/iconFonts.scss";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import UserContext from "contexts/user";
import { currencyCode } from "typings/currency";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    customerGroup: state.user.customerGroup,
    mobile: state.device.mobile,
    wishlistData: state.wishlist.items,
    cart: state.basket,
    message: state.message,
    location: state.router.location,
    meta: state.meta,
    cookies: state.cookies,
    isLoggedIn: state.user.isLoggedIn,
    currencyList: state.info.currencyList
  };
};

type Props = ReturnType<typeof mapStateToProps> & RouteComponentProps;

class CheckoutFooter extends React.Component<Props, { boId: string }> {
  constructor(props: Props) {
    super(props);
    const queryString = props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const boId = urlParams.get("bo_id") || "";
    this.state = {
      boId: boId
    };
  }
  static contextType = UserContext;

  render() {
    const { currency } = this.props;

    return (
      <div>
        <div className={cs(styles.headerContainer, styles.footer)}>
          <div className={cs(bootstrap.row, styles.minimumWidth)}>
            <div
              className={cs(
                bootstrap.colMd2,
                bootstrap.col5,
                styles.footerCurr
              )}
            >
              currency: {currency}{" "}
              {String.fromCharCode(...currencyCode[currency])}
            </div>
            <div className={cs(bootstrap.col3, bootstrap.colMd7)}>
              {/* {heading} */}
            </div>
            <div
              className={cs(bootstrap.colMd3, bootstrap.col3, {
                [styles.curr]: !this.state.boId
              })}
            >
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconPhone,
                  styles.icon
                )}
              />
              <a className={styles.mobileNum} href="tel:+919582999555">
                +91 95829 99555
              </a>{" "}
              /{" "}
              <a className={styles.mobileNum} href="tel:+919582999888">
                +91 95829 99888
              </a>
            </div>
          </div>
        </div>
        <GrowlMessage />
      </div>
    );
  }
}
const CheckoutFooterRouter = withRouter(CheckoutFooter);
export default connect(mapStateToProps)(CheckoutFooterRouter);
