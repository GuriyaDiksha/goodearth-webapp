import loadable from "@loadable/component";
import React from "react";
import {
  Link,
  NavLink,
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "./styles.scss";
import cs from "classnames";
import SideMenu from "./sidemenu";
import MainMenu from "./menu";
import { MenuList } from "./menulist";
import GrowlMessage from "../GrowlMessage";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import gelogoCerise from "../../images/gelogoCerise.svg";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import { State } from "./typings";
import UserContext from "contexts/user";
import mapDispatchToProps from "./mapper/actions";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import Search from "./search";
import ReactHtmlParser from "react-html-parser";
import fabicon from "images/favicon.ico";
import MakerUtils from "../../utils/maker";
import BottomMenu from "./bottomMenu";
const Bag = loadable(() => import("../Bag/index"));

const Mobilemenu = loadable(() => import("./mobileMenu"));

const mapStateToProps = (state: AppState) => {
  return {
    data: state.header.data,
    announcement: state.header.announcementData,
    currency: state.currency,
    mobile: state.device.mobile,
    wishlistData: state.wishlist.items,
    cart: state.basket,
    message: state.message,
    location: state.router.location,
    meta: state.meta,
    isLoggedIn: state.user.isLoggedIn,
    slab: state.user.slab,
    cookies: state.cookies
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

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
      urlParams: new URLSearchParams(props.location.search.slice(1)),
      selectedPincode: "",
      showPincodePopup: false,
      showBag: false
    };
  }
  static contextType = UserContext;

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

  componentDidMount() {
    this.props.onLoadAPiCall(this.props.isLoggedIn, this.props.cookies);
    const queryString = this.props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("loginpopup");
    if (id == "abandoncart") {
      if (!this.props.isLoggedIn) {
        this.props.goLogin();
      }
      this.props.history.push("/cart");
    }
    this.setState({
      selectedPincode: localStorage.getItem("selectedPincode")
    });
  }

  mouseOut(data: { show: boolean }) {
    this.setState({ show: data.show });
  }

  showCurrency = () => {
    this.setState({
      showC: !this.state.showC,
      showP: false
    });
  };

  changeCurrency = (cur: any) => {
    const { changeCurrency, reloadPage, history, currency } = this.props;
    const data: any = {
      currency: cur
    };
    if (this.props.currency != data.currency) {
      changeCurrency(data).then((response: any) => {
        if (history.location.pathname.indexOf("/catalogue/category/") > -1) {
          const path =
            history.location.pathname +
            history.location.search.replace(currency, response.currency);
          history.replace(path);
        }
        reloadPage(this.props.cookies, history.location.pathname);
      });
    }
  };

  showSearch = () => {
    if (this.props.history.location.pathname.indexOf("/bridal/") > 0) {
      return false;
    }
    this.setState({
      showSearch: !this.state.showSearch,
      showMenu: false
    });
  };

  hideMenu = () => {
    this.state.showMenu &&
      this.setState({
        showMenu: false
      });
  };

  clickToggle = () => {
    const isMobileMenuOpen = !this.state.showMenu;

    if (isMobileMenuOpen) {
      document.body.classList.add(globalStyles.noScroll);
    } else {
      document.body.classList.remove(globalStyles.noScroll);
    }
    this.setState({
      showMenu: !this.state.showMenu,
      showSearch: false
    });
    window.scrollTo(0, 0);
  };

  gtmPushLogoClick = () => {
    dataLayer.push({
      event: "eventsToSend",
      eventAction: "logo",
      eventCategory: "Click",
      eventLabel: location.pathname
    });
  };

  setShowBag = (showBag: boolean) => {
    this.setState({
      showBag
    });
  };

  handleLogoClick = () => {
    this.gtmPushLogoClick();
    this.setState({
      showC: false,
      showMenu: false,
      showSearch: false
    });
    if (document.body.classList.contains(globalStyles.noScroll)) {
      document.body.classList.remove(globalStyles.noScroll);
    }
    window.scrollTo(0, 0);
  };

  showPincode = () => {
    this.setState({ showPincodePopup: true });
    this.props.showPincodePopup(this.setPincode);
  };
  setPincode = (pincode: string) => {
    this.setState({ selectedPincode: pincode });
  };

  render() {
    const { isLoggedIn } = this.context;
    const {
      message,
      wishlistData,
      meta,
      goLogin,
      handleLogOut,
      announcement,
      location,
      mobile
    } = this.props;
    const messageText = announcement.message?.split("|");
    const wishlistCount = wishlistData.length;
    const wishlistIcon = wishlistCount > 0;
    let bagCount = 0;
    const item = this.props.cart.lineItems;
    for (let i = 0; i < item.length; i++) {
      bagCount = bagCount + item[i].quantity;
    }
    const profileItems: DropdownItem[] = [];
    isLoggedIn &&
      profileItems.push(
        {
          label: "My Profile",
          href: "/account/profile",
          type: "link"
        },
        {
          label: "My Orders",
          href: "/account/my-orders",
          type: "link"
        }
      );
    profileItems.push(
      {
        label: "Track Order",
        href: "/account/track-order",
        type: "link"
      },
      // {
      //   label: "Good Earth Registry",
      //   href: "/about",
      //   type: "link",
      //   value: "Good Earth Registry"
      // },
      {
        label: "Activate Gift Card",
        href: "/account/giftcard-activation",
        type: "link",
        value: "Activate Gift Card"
      },
      {
        label: "Cerise Program",
        href: isLoggedIn && this.props.slab ? "/account/cerise" : "/cerise",
        type: "link",
        value: "Cerise Program"
      },
      {
        label: "Check Balance",
        href: "/account/check-balance",
        type: "link",
        value: "Check Balance"
      },
      {
        label: isLoggedIn ? "Sign Out" : "Sign In",
        onClick: isLoggedIn ? () => handleLogOut(this.props.history) : goLogin,
        type: "button",
        value: isLoggedIn ? "Sign Out" : "Sign In"
      }
    );
    return (
      <div className="">
        <Helmet defer={false}>
          <title>
            Good Earth – Stylish Sustainable Luxury Retail | Goodearth.in
          </title>
          {
            <meta
              name="description"
              content={meta.description ? meta.description : ""}
            />
          }
          <link
            rel="canonical"
            href={`${__DOMAIN__}${location.pathname}${
              location.search ? "?" + location.search : ""
            }`}
            data-defer={false}
          ></link>
          <link rel="icon" href={fabicon} data-defer={false}></link>
          {meta.keywords && <meta name="keywords" content={meta.keywords} />}
          {meta.ogTitle && (
            <meta property="og:title" content={`Goodearth | ${meta.ogTitle}`} />
          )}
          {
            <meta
              property="og:description"
              content={meta.ogDescription ? meta.ogDescription : ""}
            />
          }
          {<meta property="og:image" content={meta.ogImage || ""} />}
          {meta.ogUrl && <meta property="og:url" content={meta.ogUrl} />}
          {meta.ogType && <meta property="og:type" content={meta.ogType} />}
          {meta.ogSiteName && (
            <meta property="og:site_name" content={meta.ogSiteName} />
          )}
          {
            <meta
              property="og:image:width"
              content={meta.ogImageWidth ? meta.ogImageWidth : "948"}
            />
          }
          {
            <meta
              property="og:image:height"
              content={meta.ogImageHeight ? meta.ogImageHeight : "632"}
            />
          }

          {meta.twitterCard && (
            <meta name="twitter:card" content={meta.twitterCard} />
          )}
          {meta.twitterTitle && (
            <meta
              name="twitter:title"
              content={`Goodearth | ${meta.twitterTitle}`}
            />
          )}
          {meta.twitterUrl && (
            <meta name="twitter:url" content={meta.twitterUrl} />
          )}
          {
            <meta
              name="twitter:description"
              content={meta.twitterDescription ? meta.twitterDescription : ""}
            />
          }
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
            className={styles.announcement}
            style={{ backgroundColor: announcement.bgColorcode }}
          >
            {messageText?.map((data, i) => {
              if (announcement.url) {
                return (
                  <div
                    key={i + "msgtext"}
                    className={
                      messageText.length > 1
                        ? i == 0
                          ? styles.boxx1
                          : styles.boxx2
                        : "width100"
                    }
                  >
                    <Link to={announcement.url ? "" + announcement.url : "/"}>
                      <div>{ReactHtmlParser(data)}</div>
                    </Link>
                  </div>
                );
              } else {
                return (
                  <div
                    key={i + "msgtext"}
                    className={
                      messageText.length > 1
                        ? i == 0
                          ? styles.boxx1
                          : styles.boxx2
                        : "width100"
                    }
                  >
                    {ReactHtmlParser(data)}
                  </div>
                );
              }
            })}
          </div>
          {this.state.showSearch && (
            <Search ipad={false} toggle={this.showSearch} />
          )}
          <div className={styles.minimumWidth}>
            <div className={bootstrap.row}>
              {mobile ? (
                <div
                  className={cs(
                    bootstrap.col3,
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
                    onClick={() => {
                      this.clickToggle();
                    }}
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
                    onClick={() => {
                      this.clickToggle();
                    }}
                  ></i>
                </div>
              ) : (
                ""
              )}
              <div
                className={cs(
                  bootstrap.colMd2,
                  bootstrap.col6,
                  styles.logoContainer
                )}
              >
                <Link to="/" onClick={this.handleLogoClick}>
                  <img className={styles.logo} src={gelogoCerise} />
                </Link>
              </div>
              {mobile ? (
                ""
              ) : (
                <div
                  className={cs(
                    bootstrap.colMd6,
                    bootstrap.col3,
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
                {!mobile && (
                  <SideMenu
                    showBag={this.state.showBag}
                    setShowBag={this.setShowBag}
                    showSearch={this.state.showSearch}
                    toggleSearch={this.showSearch}
                    mobile={mobile}
                    wishlistData={wishlistData}
                    currency={this.props.currency}
                    sidebagData={this.props.cart}
                  />
                )}
                {mobile && (
                  <li className={cs(styles.mobileSearch)}>
                    <div onClick={this.showSearch}>
                      <i
                        className={
                          this.state.showSearch
                            ? cs(
                                iconStyles.icon,
                                iconStyles.iconCrossNarrowBig,
                                styles.iconStyleCross
                              )
                            : cs(
                                iconStyles.icon,
                                iconStyles.iconSearch,
                                styles.iconStyle
                              )
                        }
                      ></i>
                      {mobile ? "" : <span>Search</span>}
                    </div>
                  </li>
                )}
              </div>
            </div>
          </div>
          <div>
            <div
              className={
                this.state.show
                  ? cs(styles.dropdownMenuBar, styles.mainMenu, bootstrap.row)
                  : styles.hidden
              }
            >
              <MenuList
                ipad={false}
                activeIndex={this.state.activeIndex}
                mouseOut={(data): void => {
                  this.mouseOut(data);
                }}
                show={this.state.show}
                menudata={this.props.data}
                mobile={mobile}
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
                {mobile ? (
                  <div
                    className={
                      this.state.showMenu
                        ? styles.menuSliderAnimate
                        : cs(styles.menuSlider, styles.mobileList)
                    }
                  >
                    {
                      <>
                        <Mobilemenu
                          menudata={this.props.data}
                          location={this.props.location}
                          clickToggle={this.clickToggle}
                        />
                        <div className={styles.lowerMenu}>
                          <ul>
                            <li>
                              {isLoggedIn ? (
                                <Link
                                  to="/wishlist"
                                  className={styles.wishlistLink}
                                  onClick={this.clickToggle}
                                >
                                  <i
                                    className={cs(
                                      styles.wishlistIcon,
                                      { [globalStyles.cerise]: wishlistIcon },
                                      {
                                        [iconStyles.iconWishlistAdded]: wishlistIcon
                                      },
                                      {
                                        [iconStyles.iconWishlist]: !wishlistIcon
                                      },
                                      iconStyles.icon
                                    )}
                                  />
                                  <span>
                                    {" "}
                                    wishlist{" "}
                                    {wishlistCount ? `(${wishlistCount})` : ""}
                                  </span>
                                </Link>
                              ) : (
                                <div
                                  onClick={e => {
                                    this.props.goLogin(e);
                                    this.clickToggle();
                                  }}
                                  className={styles.wishlistLink}
                                >
                                  <i
                                    className={cs(
                                      styles.wishlistIcon,
                                      { [globalStyles.cerise]: wishlistIcon },
                                      {
                                        [iconStyles.iconWishlistAdded]: wishlistIcon
                                      },
                                      {
                                        [iconStyles.iconWishlist]: !wishlistIcon
                                      },
                                      iconStyles.icon
                                    )}
                                  />
                                  <span> wishlist</span>
                                </div>
                              )}
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
                              onClick={this.showCurrency}
                            >
                              {" "}
                              change currency:
                            </li>
                            <li
                              className={this.state.showC ? "" : styles.hidden}
                            >
                              <ul className={styles.noMargin}>
                                <li
                                  data-name="INR"
                                  className={
                                    this.props.currency == "INR"
                                      ? styles.cerise
                                      : ""
                                  }
                                  onClick={() => {
                                    this.changeCurrency("INR");
                                    this.clickToggle();
                                  }}
                                >
                                  India | INR(&#8377;)
                                </li>
                                <li
                                  data-name="USD"
                                  className={
                                    this.props.currency == "USD"
                                      ? styles.cerise
                                      : ""
                                  }
                                  onClick={() => {
                                    this.changeCurrency("USD");
                                    this.clickToggle();
                                  }}
                                >
                                  Rest Of The World | USD (&#36;)
                                </li>
                                <li
                                  data-name="GBP"
                                  className={
                                    this.props.currency == "GBP"
                                      ? styles.cerise
                                      : ""
                                  }
                                  onClick={() => {
                                    this.changeCurrency("GBP");
                                    this.clickToggle();
                                  }}
                                >
                                  United Kingdom | GBP (&#163;)
                                </li>
                              </ul>
                            </li>

                            <ul className={styles.adding}>
                              {profileItems.map(item => {
                                return (
                                  <li
                                    key={item.label}
                                    onClick={e => {
                                      item.onClick && item.onClick(e);
                                      this.clickToggle();
                                    }}
                                  >
                                    {item.type == "button" ? (
                                      <>{item.label}</>
                                    ) : (
                                      <NavLink
                                        key={item.label}
                                        to={item.href as string}
                                      >
                                        {item.label}
                                      </NavLink>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </ul>
                        </div>
                      </>
                    }
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {false &&
            this.props.currency.toString().toUpperCase() == "INR" &&
            (this.props.location.pathname.includes("/catalogue/")
              ? this.props.location.pathname.includes("/category/")
                ? true
                : false
              : true) && (
              <div className={styles.fixedPincodeBar} id="pincode-bar">
                <div>
                  <span>
                    We have resumed deliveries Pan India. Enter your Pincode to
                    check if your location is serviceable.
                  </span>
                  <a
                    className={styles.pincodeBarBtn}
                    onClick={() => this.showPincode()}
                  >
                    <span className={cs(styles.location)}>
                      <i
                        className={cs(
                          // { [styles.iconClass]: menuOpen },
                          iconStyles.icon,
                          iconStyles.iconLocation,
                          styles.iconStore
                        )}
                      ></i>
                    </span>
                    <span>
                      {this.state.selectedPincode
                        ? this.state.selectedPincode
                        : "Pincode"}
                    </span>
                  </a>
                </div>
              </div>
            )}
          {this.state.showPincodePopup}
        </div>
        <GrowlMessage {...message} />
        <MakerUtils />
        {mobile && (
          <BottomMenu
            showBag={this.state.showBag}
            showSearch={this.showSearch}
            isSearch={this.state.showSearch}
            setShowBag={this.setShowBag}
            wishlistCount={wishlistCount}
            isLoggedIn={isLoggedIn}
            showMenu={this.state.showMenu}
            clickToggle={this.clickToggle}
            goLogin={this.props.goLogin}
            bagCount={bagCount}
          />
        )}
        {this.state.showBag && (
          <Bag
            showShipping={this.props.showShipping}
            cart={this.props.cart}
            currency={this.props.currency}
            active={this.state.showBag}
            toggleBag={(): void => {
              this.setState(prevState => {
                return { showBag: !prevState.showBag };
              });
            }}
          />
        )}
      </div>
    );
  }
}

const HeaderRouter = withRouter(Header);
export default connect(mapStateToProps, mapDispatchToProps)(HeaderRouter);
