import loadable from "@loadable/component";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import goodearth from "fonts/goodearth.woff2";
import styles from "./styles.scss";
import cs from "classnames";
import SideMenu from "./sidemenu";
// import MainMenu from "./menu";
// import { MenuList } from "./menulist";
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
import fabicon from "images/favicon.ico";
import MakerUtils from "../../utils/maker";
import BottomMenu from "./bottomMenu";
import * as util from "../../utils/validate";
const Bag = loadable(() => import("../Bag/index"));
const StoreDetails = loadable(() => import("../StoreDetails/index"));

const Mobilemenu = loadable(() => import("./mobileMenu"));
// import Mobilemenu from "./mobileMenu";
import MegaMenu from "./megaMenu";
import CountdownTimer from "./CountdownTimer";
import AnnouncementBar from "./AnnouncementBar";
import { CUST } from "constants/util";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.header.data,
    megaMenuData: state.header.megaMenuData,
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
    cookies: state.cookies,
    showTimer: state.info.showTimer,
    timerData: state.header.timerData,
    customerGroup: state.user.customerGroup,
    showStock: state.header.storeData.visible
  };
};

export type Props = ReturnType<typeof mapStateToProps> &
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
      activeIndex: -1,
      urlParams: new URLSearchParams(props.location.search.slice(1)),
      selectedPincode: "",
      showPincodePopup: false,
      showBag: false,
      showCartMobile:
        (this.props.location.pathname.includes("/catalogue/") &&
          !this.props.location.pathname.includes("/catalogue/category")) ||
        (this.props.location.pathname.includes("/bridal/") &&
          !this.props.location.pathname.includes("/account/"))
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

  listenAnnouncementBarClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", event => {
        const elem = event.target as HTMLAnchorElement;
        util.announcementBarGTM(
          elem.dataset.text || "",
          elem.getAttribute("href") || ""
        );
      });
    }
  };

  componentDidMount() {
    const isBridalPublicPage =
      this.props.location.pathname.includes("/bridal/") &&
      !this.props.location.pathname.includes("/account/");
    let bridalKey = "";
    if (isBridalPublicPage) {
      const pathArray = this.props.location.pathname.split("/");
      bridalKey = pathArray[pathArray.length - 1];
    }
    this.props.onLoadAPiCall(
      this.props.isLoggedIn,
      this.props.cookies,
      bridalKey
    );
    const queryString = this.props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("loginpopup");
    if (id == "abandoncart") {
      if (!this.props.isLoggedIn) {
        this.props.goLogin();
      }
      this.props.history.push("/cart");
    }
    if (id == "cerise") {
      if (!this.props.isLoggedIn) {
        this.props.goLogin();
      } else {
        this.props.history.push("/");
      }
    }
    this.setState({
      selectedPincode: localStorage.getItem("selectedPincode")
    });

    // to fetch announcement bar in case user navigates away from bridal public link without adding bridal products to basket
    if (
      this.props.announcement.isBridalActive &&
      !this.props.cart.bridal &&
      !isBridalPublicPage
    ) {
      this.props.fetchAnnouncement();
    }

    // add click listener for announcement bar
    this.listenAnnouncementBarClick("bar1");
    this.listenAnnouncementBarClick("bar2");
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.location.pathname != prevProps.location.pathname) {
      const isPDP =
        this.props.location.pathname.includes("/catalogue/") &&
        !this.props.location.pathname.includes("/catalogue/category");
      const isBridalPublicPage =
        this.props.location.pathname.includes("/bridal/") &&
        !this.props.location.pathname.includes("/account/");
      if (isPDP || isBridalPublicPage) {
        if (!this.state.showCartMobile) {
          this.setState({
            showCartMobile: true
          });
        }
      } else {
        if (this.state.showCartMobile) {
          this.setState({
            showCartMobile: false
          });
        }
      }

      // to fetch announcement bar in case user navigates away from bridal public link without adding bridal products to basket
      if (
        this.props.announcement.isBridalActive &&
        !this.props.cart.bridal &&
        !isBridalPublicPage
      ) {
        this.props.fetchAnnouncement();
      }
    }
  }

  // mouseOut(data: { show: boolean }) {
  //   this.setState({ show: data.show });
  // }

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
        // if (data.currency == "INR") {
        //   history.push("/maintenance");
        // }
        this.setState({
          activeIndex: -1 // default value -1 not 0
        });
        if (history.location.pathname.indexOf("/catalogue/category/") > -1) {
          const path =
            history.location.pathname +
            history.location.search.replace(currency, response.currency);
          history.replace(path);
        }
        reloadPage(
          this.props.cookies,
          response.currency,
          history.location.pathname,
          this.props.isLoggedIn
        );
      });
    }
  };

  onSideMenuClick = (clickType: string) => {
    util.headerClickGTM(
      clickType,
      "Top",
      this.props.mobile,
      this.props.isLoggedIn
    );
  };

  onBottomMenuClick = (clickType: string) => {
    util.headerClickGTM(
      clickType,
      "Bottom",
      this.props.mobile,
      this.props.isLoggedIn
    );
  };

  onMenuClick = ({
    l1,
    l2,
    l3,
    clickUrl1,
    clickUrl2,
    clickUrl3
  }: {
    [x: string]: string;
  }) => {
    util.menuNavigationGTM({
      l1: util.getInnerText(l1) || "",
      l2: util.getInnerText(l2) || "",
      l3: util.getInnerText(l3) || "",
      clickUrl1: clickUrl1 || "",
      clickUrl2: clickUrl2 || "",
      clickUrl3: clickUrl3 || "",
      mobile: this.props.mobile,
      isLoggedIn: this.props.isLoggedIn
    });
  };

  onMegaMenuClick = ({
    l1,
    l2,
    l3,
    clickUrl1,
    clickUrl2,
    clickUrl3,
    template,
    img2,
    img3,
    cta,
    subHeading
  }: {
    [x: string]: string;
  }) => {
    const obj = {
      l1: util.getInnerText(l1) || "",
      l2: util.getInnerText(l2) || "",
      l3: util.getInnerText(l3) || "",
      clickUrl1: clickUrl1 || "",
      clickUrl2: clickUrl2 || "",
      clickUrl3: clickUrl3 || "",
      template: template || "",
      img2: img2 || "",
      img3: img3 || "",
      cta: util.getInnerText(cta) || "",
      subHeading: subHeading || "",
      mobile: this.props.mobile || false,
      isLoggedIn: this.props.isLoggedIn || false
    };
    util.megaMenuNavigationGTM(obj);
  };

  showSearch = () => {
    if (
      this.props.history.location.pathname.indexOf("/bridal/") > 0 &&
      !this.props.location.pathname.includes("/account/")
    ) {
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

  clearBridalSession = async (source: string) => {
    await this.props.clearBridalSession();
    this.props.history.push("/");
    this.props.reloadAfterBridal(this.props.cookies, source);
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
    util.headerClickGTM(
      "Logo",
      "Top",
      this.props.mobile,
      this.props.isLoggedIn
    );
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
      wishlistData,
      meta,
      goLogin,
      handleLogOut,
      location,
      mobile,
      slab,
      customerGroup
    } = this.props;
    const wishlistCount = wishlistData.length;
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
      {
        label: "Good Earth Registry",
        href: isLoggedIn ? "/account/bridal" : "",
        onClick: isLoggedIn
          ? () => null
          : () => this.props.goLogin(undefined, "/account/bridal"),
        type: isLoggedIn ? "link" : "button",
        value: "Good Earth Registry"
      },
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
    const isBridalRegistryPage =
      this.props.location.pathname.indexOf("/bridal/") > -1 &&
      !(this.props.location.pathname.indexOf("/account/") > -1);
    const isCeriseCustomer = slab
      ? slab.toLowerCase() == "cerise" ||
        slab.toLowerCase() == "cerise sitara" ||
        customerGroup == CUST.CERISE ||
        customerGroup == CUST.CERISE_SITARA
      : false;
    return (
      <div className="">
        <Helmet defer={false}>
          <title>
            {meta.title
              ? meta.title
              : "Good Earth – Stylish Sustainable Luxury Retail | Goodearth.in"}
          </title>
          {
            <meta
              name="description"
              content={
                meta.description
                  ? meta.description
                  : "Good Earth India's official website. Explore unique product stories and craft traditions that celebrate the heritage of the Indian subcontinent."
              }
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
          <meta httpEquiv="X-Frame-Options" content="deny" />
          <link
            rel="preload"
            href={goodearth}
            as="font"
            crossOrigin="crossorigin"
          />
        </Helmet>

        <div className={cs(styles.headerContainer)}>
          <AnnouncementBar
            clearBridalSession={this.clearBridalSession}
            isBridalRegistryPage={isBridalRegistryPage}
          />
          {!isBridalRegistryPage &&
            !isCeriseCustomer &&
            this.props.showTimer &&
            this.props.timerData && <CountdownTimer />}
          {this.state.showSearch && (
            <Search ipad={false} toggle={this.showSearch} />
          )}
          <div className={cs(styles.minimumWidth, styles.headerBg)}>
            <div className={bootstrap.row}>
              {mobile ? (
                <div
                  className={cs(
                    bootstrap.col3,
                    bootstrap.colLg2,
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
                      util.headerClickGTM(
                        "Mobile Menu",
                        "Top",
                        true,
                        isLoggedIn
                      );
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
                  bootstrap.colLg2,
                  bootstrap.col6,
                  styles.logoContainer
                )}
              >
                <Link to="/" onClick={this.handleLogoClick}>
                  <img
                    alt="goodearth-logo"
                    src={gelogoCerise}
                    style={{
                      width: "111px",
                      cursor: "pointer"
                    }}
                  />
                </Link>
              </div>
              {mobile ? (
                ""
              ) : (
                <div
                  className={cs(
                    bootstrap.colLg6,
                    bootstrap.col3,
                    bootstrap.offsetLg1,
                    globalStyles.static
                  )}
                >
                  {/* <MainMenu
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
                  /> */}
                  <MegaMenu
                    show={this.state.show}
                    activeIndex={this.state.activeIndex}
                    ipad={false}
                    onMegaMenuClick={this.onMegaMenuClick}
                    mouseOver={(data: {
                      show: boolean;
                      activeIndex: number;
                    }): void => {
                      this.setState(
                        {
                          show: data.show,
                          activeIndex: data.show ? data.activeIndex : -1
                        },
                        () => {
                          const elem = document.getElementById(
                            `mega-menu-list-${data.activeIndex}`
                          );
                          if (data.show) {
                            if (elem) {
                              elem.style.maxHeight = elem.scrollHeight + "px";
                            }
                          } else {
                            if (elem) {
                              elem.style.removeProperty("max-height");
                            }
                          }
                        }
                      );
                    }}
                    data={this.props.megaMenuData}
                    location={this.props.location}
                  />
                </div>
              )}
              <div className={cs(bootstrap.colLg3, bootstrap.col3)}>
                {!mobile && (
                  <SideMenu
                    onSideMenuClick={this.onSideMenuClick}
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
                  <ul className={cs(bootstrap.row)}>
                    <li className={cs(styles.mobileSearch, bootstrap.col)}>
                      <div
                        onClick={() => {
                          !this.state.showSearch &&
                            this.onSideMenuClick("Search");
                          this.showSearch();
                        }}
                      >
                        <i
                          className={
                            this.state.showSearch
                              ? cs(
                                  iconStyles.icon,
                                  iconStyles.iconCrossNarrowBig,
                                  styles.iconStyleCross,
                                  styles.iconDefaultColor
                                )
                              : cs(
                                  iconStyles.icon,
                                  iconStyles.iconSearch,
                                  styles.iconStyle,
                                  styles.iconDefaultColor
                                )
                          }
                        ></i>
                        {mobile ? "" : <span>Search</span>}
                      </div>
                    </li>
                    {this.state.showCartMobile && (
                      <li className={cs(styles.mobileSearch, bootstrap.col)}>
                        <div
                          onClick={() => {
                            this.setShowBag(true);
                            this.onSideMenuClick("Cart");
                          }}
                        >
                          <i
                            className={cs(
                              iconStyles.icon,
                              iconStyles.iconCart,
                              styles.iconStyle,
                              styles.iconDefaultColor
                            )}
                          ></i>
                          <span className={styles.badge}>{bagCount}</span>
                        </div>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className={cs(bootstrap.row)}>
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
                          onMobileMenuClick={this.onMenuClick}
                          onHeaderMegaMenuClick={this.onMegaMenuClick}
                          menudata={this.props.data}
                          megaMenuData={this.props.megaMenuData}
                          location={this.props.location}
                          clickToggle={this.clickToggle}
                          wishlistCount={wishlistCount}
                          changeCurrency={this.changeCurrency}
                          showCurrency={this.showCurrency}
                          showC={this.state.showC}
                          profileItems={profileItems}
                          goLogin={this.props.goLogin}
                        />
                      </>
                    }
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <GrowlMessage />
        <MakerUtils />
        {/* {this.props.currency.toString().toUpperCase() == "INR" &&
          !(
            this.props.location.pathname.includes("/search") ||
            this.props.location.pathname.includes("/catalogue") ||
            isBridalRegistryPage
          ) && (
            <div className={styles.fixedPincodeBar} id="pincode-bar">
              <div>
                <span>
                  Due to the current restrictions on movement, please enter your
                  Pincode to check if your location is serviceable.
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
          )} */}
        {mobile && !isBridalRegistryPage && (
          <BottomMenu
            onBottomMenuClick={this.onBottomMenuClick}
            showBag={this.state.showBag}
            showSearch={this.showSearch}
            isSearch={this.state.showSearch}
            setShowBag={this.setShowBag}
            wishlistCount={wishlistCount}
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
        {this.props.showStock && (
          <StoreDetails
            showShipping={this.props.showShipping}
            cart={this.props.cart}
            currency={this.props.currency}
            active={this.props.showStock}
          />
        )}
      </div>
    );
  }
}

const HeaderRouter = withRouter(Header);
export default connect(mapStateToProps, mapDispatchToProps)(HeaderRouter);
