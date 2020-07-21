import loadable from "@loadable/component";
import React from "react";
import { Link, NavLink } from "react-router-dom";
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
import LoginService from "services/login";
import { Dispatch } from "redux";
import UserContext from "contexts/user";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";

const Mobilemenu = loadable(() => import("./mobileMenu"));

const mapStateToProps = (state: AppState) => {
  return {
    data: state.header.data,
    currency: state.currency,
    mobile: state.device.mobile,
    wishlistData: state.wishlist.items,
    cart: state.basket,
    message: state.message,
    location: state.router.location,
    meta: state.meta
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    goLogin: (event: React.MouseEvent) => {
      LoginService.showLogin(dispatch);
      event.preventDefault();
    },
    handleLogOut: () => {
      LoginService.logout(dispatch);
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

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

  mouseOut(data: { show: boolean }) {
    this.setState({ show: data.show });
  }

  showCurrency() {
    this.setState({
      showC: !this.state.showC,
      showP: false
    });
  }

  clickToggle() {
    this.setState({
      showMenu: !this.state.showMenu,
      showSearch: false
    });
  }

  render() {
    const { isLoggedIn } = this.context;
    const { message, wishlistData, meta, goLogin, handleLogOut } = this.props;
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
        href: "/about",
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
        href: "/about",
        type: "link",
        value: "Activate Gift Card"
      },
      {
        label: "Cerise Program",
        href: "/about",
        type: "link",
        value: "Cerise Program"
      },
      {
        label: "Check Balance",
        href: "/about",
        type: "link",
        value: "Check Balance"
      },
      {
        label: isLoggedIn ? "Sign Out" : "Sign In",
        href: "",
        onClick: isLoggedIn ? handleLogOut : goLogin,
        type: "link",
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
                  onClick={this.clickToggle.bind(this)}
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
                  onClick={this.clickToggle.bind(this)}
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
                    {this.state.showMenu && (
                      <>
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
                                  {
                                    [iconStyles.iconWishlistAdded]: wishlistIcon
                                  },
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
                            <li
                              className={this.state.showC ? "" : styles.hidden}
                            >
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
                              {profileItems.map(item => {
                                return (
                                  <li
                                    key={item.label}
                                    onClick={() => this.clickToggle()}
                                  >
                                    <NavLink
                                      key={item.label}
                                      to={item.href as string}
                                    >
                                      {item.label}
                                    </NavLink>
                                  </li>
                                );
                              })}
                            </ul>
                          </ul>
                        </div>
                      </>
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
