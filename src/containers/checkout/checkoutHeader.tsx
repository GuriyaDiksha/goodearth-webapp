import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "./styles.scss";
import cs from "classnames";
import GrowlMessage from "components/GrowlMessage";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../styles/iconFonts.scss";
import gelogoCerise from "../../images/gelogoCerise.svg";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import LoginService from "services/login";
import MetaService from "services/meta";
import BasketService from "services/basket";
import HeaderService from "services/headerFooter";
import { Dispatch } from "redux";
import UserContext from "contexts/user";
import { Currency } from "typings/currency";
import { Cookies } from "typings/cookies";
import { MESSAGE } from "constants/messages";
import fabicon from "images/favicon.ico";
import { Basket } from "typings/basket";
import { headerClickGTM, showGrowlMessage } from "../../utils/validate";
import Api from "services/api";
import checkoutIcon from "./../../images/checkout.svg";

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

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    changeCurrency: async (data: { currency: Currency }) => {
      const response = await LoginService.changeCurrency(dispatch, data);
      return response;
    },
    reloadPage: (
      cookies: Cookies,
      pathname: string,
      currency: Currency,
      customerGroup: string,
      history: any,
      isLoggedIn: boolean
    ) => {
      HeaderService.fetchHeaderDetails(dispatch, currency, customerGroup).catch(
        err => {
          console.log("FOOTER API ERROR ==== " + err);
        }
      );
      HeaderService.fetchFooterDetails(dispatch).catch(err => {
        console.log("FOOTER API ERROR ==== " + err);
      });
      Api.getAnnouncement(dispatch).catch(err => {
        console.log("Announcement API ERROR ==== " + err);
      });
      Api.getSalesStatus(dispatch).catch(err => {
        console.log("Sale status API error === " + err);
      });
      Api.getPopups(dispatch).catch(err => {
        console.log("Popups Api ERROR === " + err);
      });
      // }
      // if (page?.includes("/category_landing/")) {
      //   // L
      // }
      // HeaderService.fetchHomepageData(dispatch).catch(err => {
      //   console.log("Homepage API ERROR ==== " + err);
      // });
      MetaService.updateMeta(dispatch, cookies);
      if (
        pathname.includes("/order/checkout") ||
        pathname.includes("/order/gc_checkout")
      ) {
        BasketService.fetchBasket(dispatch, "checkout", history, isLoggedIn);
        showGrowlMessage(dispatch, MESSAGE.CURRENCY_CHANGED_SUCCESS, 7000);
      } else if (pathname.includes("/cart")) {
        BasketService.fetchBasket(dispatch, "cart");
        showGrowlMessage(dispatch, MESSAGE.CURRENCY_CHANGED_SUCCESS, 7000);
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
        // if (data.currency == "INR") {
        //   this.props.history.push("/maintenance");
        // }
        headerClickGTM(
          "Currency",
          "Top",
          this.props.mobile,
          this.props.isLoggedIn
        );
        reloadPage(
          this.props.cookies,
          this.props.location.pathname,
          data.currency,
          this.props.customerGroup,
          this.props.history,
          this.props.isLoggedIn
        );
      });
    }
    // this.setState({
    //   showC: !this.state.showC,
    //   showP: false
    // });
  };

  componentDidMount() {
    // hide chat container
    setTimeout(() => {
      const chatContainer = document.getElementById("mobile-chat-container");
      if (chatContainer && this.props.location.pathname == "/order/checkout") {
        chatContainer.style.display = "none";
      }
    }, 1000);

    this.props.updateMeta(
      this.props.cookies,
      this.props.location.pathname,
      this.props.currency,
      this.props.cart
    );
  }

  setIntervalX = (callback: any, delay: number, repetitions: number) => {
    let x = 0;
    const intervalID = window.setInterval(function() {
      callback();

      if (++x === repetitions) {
        window.clearInterval(intervalID);
      }
    }, delay);
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.location.pathname != nextProps.location.pathname) {
      this.setIntervalX(
        () => {
          const chatContainer = document.getElementById(
            "mobile-chat-container"
          );

          if (
            chatContainer &&
            nextProps.location.pathname == "/order/checkout"
          ) {
            chatContainer.style.display = "none";
          }
        },
        1000,
        4
      );
    }
  }

  phoneGaCalls = (e: any) => {
    dataLayer.push({
      event: "checkout_phone_num",
      click_type: e.target.innerText
    });
  };

  render() {
    const { meta, mobile } = this.props;

    let heading = null;
    if (this.props.location.pathname.indexOf("cart") > -1) {
      heading = (
        <span
          className={cs({
            [styles.vCenter]: !mobile,
            [styles.justifyRight]: mobile
          })}
        >
          {/* <span>
            <i
              className={cs(iconStyles.icon, iconStyles.iconCart, styles.cart)}
            ></i>
          </span> */}
          {/* {mobile ? (
            <span className={styles.headLineheight}> BAG</span>
          ) : (
            <span className={styles.headLineheight}>SHOPPING BAG</span>
          )} */}
        </span>
      );
    }

    if (
      this.props.location.pathname.indexOf("checkout") > -1 ||
      this.props.location.pathname.indexOf("order/orderconfirmation") > -1
    ) {
      heading = (
        <span className={cs(styles.vCenter, { [styles.justifyRight]: mobile })}>
          <span>
            <img src={checkoutIcon} alt="checkout-button" />
          </span>
          {/* {mobile ? ( */}
          <span className={styles.headLineheight}> CHECKOUT</span>
          {/* ) : (
            <span className={styles.headLineheight}>SECURE CHECKOUT</span>
          )} */}
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
                : "Good Earth – Luxury Indian Design House Explore handcrafted designs that celebrate style from an Indian perspective"
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
          <div
            className={cs(
              bootstrap.row,
              styles.minimumWidth,
              styles.justifyBetween
            )}
          >
            <div
              className={cs(
                bootstrap.colMd3,
                bootstrap.col5,
                styles.logoContainer
              )}
            >
              <Link
                to="/"
                onClick={e => {
                  this.state.boId
                    ? e.preventDefault()
                    : headerClickGTM(
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
                  alt="goodearth-logo"
                  src={gelogoCerise}
                />
              </Link>
            </div>
            <div
              className={cs({ [bootstrap.col3]: !mobile }, bootstrap.colMd6, {
                [bootstrap.col6]: mobile
              })}
            >
              {heading}
            </div>
            {mobile ? null : (
              <div
                className={cs(bootstrap.colMd3, bootstrap.col3, styles.curr)}
              >
                {/* <SelectableDropdownMenu
                id="currency-dropdown-checkout"
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
              ></SelectableDropdownMenu> */}
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconPhone,
                    styles.icon
                  )}
                />
                <a
                  className={styles.mobileNum}
                  href="tel:+919582999555"
                  onClick={this.phoneGaCalls}
                >
                  +91 95829 99555
                </a>{" "}
                /{" "}
                <a
                  className={styles.mobileNum}
                  href="tel:+919582999888"
                  onClick={this.phoneGaCalls}
                >
                  +91 95829 99888
                </a>
              </div>
            )}
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
