import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "./styles.scss";
import cs from "classnames";
import GrowlMessage from "components/GrowlMessage";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import gelogoCerise from "../../images/gelogoCerise.svg";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
// import { State } from "./typings";
import LoginService from "services/login";
import MetaService from "services/meta";
import BasketService from "services/basket";
import { Dispatch } from "redux";
import UserContext from "contexts/user";
import { currencyCode, Currency } from "typings/currency";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import SelectableDropdownMenu from "../../components/dropdown/selectableDropdownMenu";
import { Cookies } from "typings/cookies";
import { CURRENCY_CHANGED_SUCCESS } from "constants/messages";
import { showMessage } from "actions/growlMessage";
import fabicon from "images/favicon.ico";
import { Basket } from "typings/basket";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.header.data,
    currency: state.currency,
    mobile: state.device.mobile,
    wishlistData: state.wishlist.items,
    cart: state.basket,
    message: state.message,
    location: state.router.location,
    meta: state.meta,
    cookies: state.cookies
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changeCurrency: async (data: { currency: Currency }) => {
      const response = await LoginService.changeCurrency(dispatch, data);
      return response;
    },
    reloadPage: (cookies: Cookies, pathname: string) => {
      MetaService.updateMeta(dispatch, cookies);
      if (pathname.includes("/order/checkout")) {
        BasketService.fetchBasket(dispatch, "checkout");
        dispatch(showMessage(CURRENCY_CHANGED_SUCCESS, 7000));
      } else if (pathname.includes("/cart")) {
        BasketService.fetchBasket(dispatch, "cart");
        dispatch(showMessage(CURRENCY_CHANGED_SUCCESS, 7000));
      }
    },
    updateMeta: (
      cookies: Cookies,
      pathname: string,
      currency: Currency,
      cart: Basket
    ) => {
      MetaService.updateMeta(dispatch, cookies);
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class CheckoutHeader extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }
  static contextType = UserContext;

  changeCurrency = (cur: any) => {
    const { changeCurrency, reloadPage } = this.props;
    const data: any = {
      currency: cur
    };
    if (this.props.currency != data) {
      changeCurrency(data).then(response => {
        reloadPage(this.props.cookies, this.props.location.pathname);
      });
    }
    // this.setState({
    //   showC: !this.state.showC,
    //   showP: false
    // });
  };

  componentDidMount() {
    this.props.updateMeta(
      this.props.cookies,
      this.props.location.pathname,
      this.props.currency,
      this.props.cart
    );
  }

  render() {
    const { message, meta, mobile, currency } = this.props;
    const items: DropdownItem[] = [
      {
        label: "INR" + " " + String.fromCharCode(currencyCode["INR"]),
        value: "INR"
      },
      {
        label: "USD" + " " + String.fromCharCode(currencyCode["USD"]),
        value: "USD"
      },
      {
        label: "GBP" + " " + String.fromCharCode(currencyCode["GBP"]),
        value: "GBP"
      }
    ];

    let heading = null;
    if (this.props.location.pathname.indexOf("cart") > -1) {
      heading = (
        <span className={styles.vCenter}>
          <span>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCartFilled,
                styles.cart
              )}
            ></i>
          </span>
          {mobile ? (
            <span className={styles.headLineheight}> BAG</span>
          ) : (
            <span className={styles.headLineheight}>SHOPPING BAG</span>
          )}
        </span>
      );
    }

    if (this.props.location.pathname.indexOf("checkout") > -1) {
      heading = (
        <span className={styles.vCenter}>
          <span>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconLockbtn,
                styles.lock
              )}
            ></i>
          </span>
          {mobile ? (
            <span className={styles.headLineheight}> CHECKOUT</span>
          ) : (
            <span className={styles.headLineheight}>SECURE CHECKOUT</span>
          )}
        </span>
      );
    }
    return (
      <div>
        <Helmet>
          <title>
            Good Earth – Stylish Sustainable Luxury Retail | Goodearth.in
          </title>
          <link rel="icon" href={fabicon}></link>
          {meta.description && (
            <meta name="description" content={meta.description} />
          )}
          {meta.keywords && <meta name="keywords" content={meta.keywords} />}
          {meta.ogTitle && (
            <meta property="og:title" content={`Goodearth | ${meta.ogTitle}`} />
          )}
          {meta.ogDescription && (
            <meta property="og:description" content={meta.ogDescription} />
          )}
          {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
          {meta.ogUrl && <meta property="og:url" content={meta.ogUrl} />}
          {meta.ogType && <meta property="og:type" content={meta.ogType} />}
          {meta.ogSiteName && (
            <meta property="og:site_name" content={meta.ogSiteName} />
          )}
          {meta.ogImageWidth && (
            <meta property="og:image:width" content={meta.ogImageWidth} />
          )}
          {meta.ogImageHeight && (
            <meta property="og:image:height" content={meta.ogImageHeight} />
          )}

          {meta.twitterCard && (
            <meta name="twitter:card" content={meta.twitterCard} />
          )}
          {meta.twitterTitle && (
            <meta name="twitter:title" content={meta.twitterTitle} />
          )}
          {meta.twitterUrl && (
            <meta name="twitter:url" content={meta.twitterUrl} />
          )}
          {meta.twitterDescription && (
            <meta
              name="twitter:description"
              content={meta.twitterDescription}
            />
          )}
          {meta.twitterImage && (
            <meta name="twitter:image" content={meta.twitterImage} />
          )}
          {meta.twitterDomain && (
            <meta name="twitter:domain" content={meta.twitterDomain} />
          )}
          {meta.twitterCreator && (
            <meta name="twitter:creator" content={meta.twitterCreator} />
          )}
          {meta.twitterSite && (
            <meta name="twitter:site" content={meta.twitterSite} />
          )}
        </Helmet>
        <div className={cs(styles.headerContainer)}>
          <div className={cs(bootstrap.row, styles.minimumWidth)}>
            <div
              className={cs(
                bootstrap.colMd2,
                bootstrap.col5,
                styles.logoContainer
              )}
            >
              <Link to="/">
                <img className={styles.logo} src={gelogoCerise} />
              </Link>
            </div>
            <div className={cs(bootstrap.col3, bootstrap.colMd7)}>
              {heading}
            </div>
            <div
              className={cs(
                bootstrap.colMd2,
                bootstrap.col3,
                globalStyles.voffset2,
                styles.curr
              )}
            >
              <SelectableDropdownMenu
                align={"left"}
                items={items}
                value={currency}
                showCaret={true}
                className={styles.checkoutHeader}
                onChange={this.changeCurrency}
              ></SelectableDropdownMenu>
            </div>
          </div>
        </div>
        <GrowlMessage {...message} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutHeader);
