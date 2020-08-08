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
import fabicon from "images/AppIcon.png";

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
      urlParams: new URLSearchParams(props.location.search.slice(1))
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
    if (this.props.currency != data) {
      changeCurrency(data).then((response: any) => {
        if (history.location.pathname.indexOf("/catalogue/category/") > -1) {
          const path =
            history.location.pathname +
            history.location.search.replace(currency, response.currency);
          history.replace(path);
        }
        reloadPage(this.props.cookies);
      });
    }
  };

  showSearch = () => {
    this.setState({
      showSearch: !this.state.showSearch,
      showMenu: false
    });
  };

  clickToggle = () => {
    this.setState({
      showMenu: !this.state.showMenu,
      showSearch: false
    });
    window.scrollTo(0, 0);
  };

  render() {
    const { isLoggedIn } = this.context;
    const {
      message,
      wishlistData,
      meta,
      goLogin,
      handleLogOut,
      announcement
    } = this.props;
    const messageText = announcement.message.split("|");
    const wishlistCount = wishlistData.length;
    const wishlistIcon = wishlistCount > 0;
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
          href: "/account/orders",
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
        href: "/about",
        type: "link",
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
        href: "/account/cerise",
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
        onClick: isLoggedIn ? handleLogOut : goLogin,
        type: "button",
        value: isLoggedIn ? "Sign Out" : "Sign In"
      }
    );
    return (
      <div className="">
        <Helmet>
          <title>
            Good Earth – Stylish Sustainable Luxury Retail | Goodearth.in
          </title>
          {meta.description && (
            <meta name="description" content={meta.description} />
          )}
          <link rel="icon" href={fabicon}></link>
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
            className={styles.announcement}
            style={{ backgroundColor: announcement.bgColorcode }}
          >
            {messageText.map((data, i) => {
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
          <div className={cs(bootstrap.row, styles.minimumWidth)}>
            {this.props.mobile ? (
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
              <SideMenu
                toggleSearch={this.showSearch}
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
                show={this.state.show}
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
                                  <span> wishlist ({wishlistCount})</span>
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
                                  <span> wishlist ({wishlistCount})</span>
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
                              <ul>
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
                                  INR(&#8377;)
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
                                  USD (&#36;)
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
                                  GBP (&#163;)
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
          {this.state.showSearch && (
            <Search ipad={false} toggle={this.showSearch} />
          )}
        </div>
        <GrowlMessage {...message} />
      </div>
    );
  }
}

const HeaderRouter = withRouter(Header);
export default connect(mapStateToProps, mapDispatchToProps)(HeaderRouter);
