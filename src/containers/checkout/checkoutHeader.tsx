import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
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
import HeaderService from "services/headerFooter";
import { Dispatch } from "redux";
import UserContext from "contexts/user";
import { currencyCode, Currency } from "typings/currency";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import SelectableDropdownMenu from "../../components/dropdown/selectableDropdownMenu";
import { Cookies } from "typings/cookies";
import { CURRENCY_CHANGED_SUCCESS } from "constants/messages";
import fabicon from "images/favicon.ico";
import { Basket } from "typings/basket";
import * as util from "../../utils/validate";
import Api from "services/api";

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
    cookies: state.cookies,
    isLoggedIn: state.user.isLoggedIn
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changeCurrency: async (data: { currency: Currency }) => {
      const response = await LoginService.changeCurrency(dispatch, data);
      return response;
    },
    reloadPage: (cookies: Cookies, pathname: string, currency: Currency) => {
      HeaderService.fetchHeaderDetails(dispatch).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      HeaderService.fetchFooterDetails(dispatch).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("Announcement API ERROR ==== " + err);
      });
      // }
      // if (page?.includes("/category_landing/")) {
      //   // L
      // }
      HeaderService.fetchHomepageData(dispatch).catch(err => {
        console.log("Homepage API ERROR ==== " + err);
      });
      MetaService.updateMeta(dispatch, cookies);
      if (pathname.includes("/order/checkout")) {
        BasketService.fetchBasket(dispatch, "checkout");
        util.showGrowlMessage(dispatch, CURRENCY_CHANGED_SUCCESS, 7000);
      } else if (pathname.includes("/cart")) {
        BasketService.fetchBasket(dispatch, "cart");
        util.showGrowlMessage(dispatch, CURRENCY_CHANGED_SUCCESS, 7000);
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
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class CheckoutHeader extends React.Component<Props, { boId: string }> {
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

  changeCurrency = (cur: any) => {
    const { changeCurrency, reloadPage } = this.props;
    const data: any = {
      currency: cur
    };
    if (this.props.currency != data.currency) {
      return changeCurrency(data).then(response => {
        if (data.currency == "INR") {
          this.props.history.push("/maintenance");
        }
        util.headerClickGTM(
          "Currency",
          "Top",
          this.props.mobile,
          this.props.isLoggedIn
        );
        reloadPage(
          this.props.cookies,
          this.props.location.pathname,
          data.currency
        );
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
    const { meta, mobile, currency } = this.props;
    const items: DropdownItem[] = [
      {
        label: "INR" + " " + String.fromCharCode(...currencyCode["INR"]),
        value: "INR"
      },
      {
        label: "USD" + " " + String.fromCharCode(...currencyCode["USD"]),
        value: "USD"
      },
      {
        label: "GBP" + " " + String.fromCharCode(...currencyCode["GBP"]),
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
            {meta.title
              ? meta.title
              : "Good Earth – Stylish Sustainable Luxury Retail | Goodearth.in"}
          </title>
          <link rel="icon" href={fabicon}></link>
          <meta
            name="description"
            content={
              meta.description
                ? meta.description
                : "Good Earth India's official website. Explore unique product stories and craft traditions that celebrate the heritage of the Indian subcontinent."
            }
          />
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
              <Link
                to="/"
                onClick={e => {
                  this.state.boId
                    ? e.preventDefault()
                    : util.headerClickGTM(
                        "Logo",
                        "Top",
                        this.props.mobile,
                        this.props.isLoggedIn
                      );
                }}
              >
                <img
                  className={
                    this.state.boId ? styles.logoWithoutcursor : styles.logo
                  }
                  src={gelogoCerise}
                />
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
                { [styles.curr]: !this.state.boId },
                { [styles.disableCurr]: this.state.boId }
              )}
            >
              <SelectableDropdownMenu
                align={"left"}
                items={items}
                value={currency}
                showCaret={true}
                className={
                  this.state.boId
                    ? styles.disableCheckoutHeader
                    : styles.checkoutHeader
                }
                onChangeCurrency={this.changeCurrency}
                disabled={this.state.boId ? true : false}
              ></SelectableDropdownMenu>
            </div>
          </div>
        </div>
        <GrowlMessage />
      </div>
    );
  }
}
const CheckoutHeaderRouter = withRouter(CheckoutHeader);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutHeaderRouter);
