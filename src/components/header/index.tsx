import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "./styles.scss";
import cs from "classnames";
import SideMenu from "./sidemenu";
import MainMenu from "./menu";
import { MenuList } from "./menulist";
import Mobilemenu from "./mobileMenu";
import GrowlMessage from "../GrowlMessage";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import gelogoCerise from "../../images/gelogoCerise.svg";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import { State } from "./typings";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.header.data,
    currency: state.currency,
    mobile: state.device.mobile,
    isLoggedIn: state.user.email ? true : false,
    wishlistData: state.wishlist.items,
    cart: state.basket,
    message: state.message,
    location: state.router.location,
    meta: state.meta
  };
};

type Props = ReturnType<typeof mapStateToProps>;

class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
      showMenu: false,
      showSearch: false,
      showC: false,
      showP: false,
      activeIndex: 0,
      urlParams: new URLSearchParams(props.location.search.slice(1))
    };
  }

  onhover = (data: { show: boolean; activeIndex: number }) => {
    // if is for ipad
    // if (false) {
    //   this.setState({
    //     show:
    //       data.activeIndex == this.state.activeIndex && this.state.show == true
    //         ? false
    //         : data.show,
    //     activeIndex: data.activeIndex
    //   });
    // } else {
    this.setState({
      show: data.show,
      activeIndex: data.activeIndex
    });
    // }
  };

  mouseOut(data: { show: boolean }) {
    this.setState({ show: data.show });
  }

  showCurrency() {
    this.setState({
      showC: !this.state.showC,
      showP: false
    });
  }

  clickToggel() {
    this.setState({
      showMenu: !this.state.showMenu,
      showSearch: false
    });
  }

  render() {
    const { message, wishlistData, meta } = this.props;
    const wishlistCount = wishlistData.length;
    const wishlistIcon = wishlistCount > 0;
    return (
      <div className="">
        <Helmet>
          <title>
            Good Earth – Stylish Sustainable Luxury Retail | Goodearth.in
          </title>
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
            {this.props.mobile ? (
              <div
                className={cs(
                  bootstrap.col2,
                  bootstrap.colMd2,
                  styles.hamburger
                )}
              >
                <i
                  className={
                    this.state.showMenu
                      ? styles.hidden
                      : cs(
                          iconStyles.icon,
                          iconStyles.iconLibraryMenu,
                          styles.iconStyle,
                          styles.iconFont
                        )
                  }
                  onClick={this.clickToggel.bind(this)}
                ></i>
                <i
                  className={
                    this.state.showMenu
                      ? cs(
                          iconStyles.icon,
                          iconStyles.iconCrossNarrowBig,
                          styles.iconStyle,
                          styles.iconCrossFont
                        )
                      : styles.hidden
                  }
                  onClick={this.clickToggel.bind(this)}
                ></i>
              </div>
            ) : (
              ""
            )}
            <div
              className={cs(
                bootstrap.colMd2,
                bootstrap.col6,
                { [bootstrap.offset1]: this.props.mobile },
                styles.logoContainer
              )}
            >
              <Link to="/">
                <img className={styles.logo} src={gelogoCerise} />
              </Link>
            </div>
            {this.props.mobile ? (
              ""
            ) : (
              <div
                className={cs(
                  bootstrap.colMd6,
                  bootstrap.colLg6,
                  bootstrap.offsetMd1
                )}
              >
                <MainMenu
                  show={this.state.show}
                  ipad={false}
                  onMouseOver={(data): void => {
                    this.setState({
                      show: data.show,
                      activeIndex: data.activeIndex || 0
                    });
                  }}
                  data={this.props.data}
                  location={this.props.location}
                />
              </div>
            )}
            <div className={cs(bootstrap.colMd3, bootstrap.col3)}>
              <SideMenu
                isLoggedIn={this.props.isLoggedIn}
                mobile={this.props.mobile}
                wishlistData={wishlistData}
                currency={this.props.currency}
                sidebagData={this.props.cart}
              />
            </div>
          </div>
          <div className={cs(bootstrap.row, styles.menulistOverlap)}>
            <div
              className={
                this.state.show
                  ? cs(
                      styles.dropdownMenuBar,
                      styles.mainMenu,
                      bootstrap.colMd12,
                      bootstrap.row
                    )
                  : styles.hidden
              }
            >
              <MenuList
                ipad={false}
                activeIndex={this.state.activeIndex}
                mouseOut={(data): void => {
                  this.mouseOut(data);
                }}
                menudata={this.props.data}
                mobile={this.props.mobile}
              />
            </div>
            <div
              className={cs(bootstrap.row, bootstrap.col12, styles.mobileMenu)}
            >
              <div
                className={
                  this.state.showMenu
                    ? cs(bootstrap.col12, styles.mobileList, styles.menuOverlay)
                    : bootstrap.col12
                }
              >
                {this.props.mobile ? (
                  <div
                    className={
                      this.state.showMenu
                        ? styles.menuSliderAnimate
                        : cs(styles.menuSlider, styles.mobileList)
                    }
                  >
                    <Mobilemenu
                      menudata={this.props.data}
                      location={this.props.location}
                    />
                    <div className={styles.lowerMenu}>
                      <ul>
                        <li>
                          <i
                            className={cs(
                              { [globalStyles.cerise]: wishlistIcon },
                              { [iconStyles.iconWishlistAdded]: wishlistIcon },
                              { [iconStyles.iconWishlist]: !wishlistIcon },
                              iconStyles.icon
                            )}
                          ></i>
                          <span> wishlist ({wishlistCount})</span>
                        </li>
                        <li
                          className={
                            this.state.showC
                              ? cs(styles.currency, styles.before)
                              : this.props.location.pathname.indexOf(
                                  "/bridal/"
                                ) > 0
                              ? cs(styles.currency, styles.op3)
                              : styles.currency
                          }
                          onClick={this.showCurrency.bind(this)}
                        >
                          {" "}
                          change currency:
                        </li>
                        <li className={this.state.showC ? "" : styles.hidden}>
                          <ul>
                            <li
                              className={
                                this.props.currency == "INR"
                                  ? styles.cerise
                                  : ""
                              }
                            >
                              INR(&#8377;)
                            </li>
                            <li
                              className={
                                this.props.currency == "USD"
                                  ? styles.cerise
                                  : ""
                              }
                            >
                              USD (&#36;)
                            </li>
                            <li
                              className={
                                this.props.currency == "GBP"
                                  ? styles.cerise
                                  : ""
                              }
                            >
                              GBP (&#163;)
                            </li>
                          </ul>
                        </li>

                        <ul className={styles.adding}>
                          {this.props.isLoggedIn ? <li>My Profile</li> : ""}
                          {this.props.isLoggedIn ? <li>My Orders</li> : ""}
                          <li>Track Order</li>
                          <li>Good Earth Registry</li>
                          <li>Activate Gift Card</li>
                          <li>Cerise Program</li>
                          <li>Check Balance</li>
                          {this.props.isLoggedIn ? <li>Sign Out</li> : ""}
                          {this.props.isLoggedIn ? "" : <li>Sign In</li>}
                        </ul>
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <GrowlMessage {...message} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Header);
