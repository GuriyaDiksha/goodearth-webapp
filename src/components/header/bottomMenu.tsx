import React, { useState } from "react";
import styles from "./styles.scss";
import cs from "classnames";
import SelectableDropdownMenu from "../dropdown/selectableDropdownMenu";
import { DropdownItem } from "../dropdown/baseDropdownMenu/typings";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import Loader from "components/Loader";
import globalStyles from "../../styles/global.scss";
import storyStyles from "../../styles/stories.scss";
import iconStyles from "../../styles/iconFonts.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import mapDispatchToProps from "./mapper/actions";
import { BottomMenuProps } from "./typings";
import { connect } from "react-redux";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const mapStateToProps = (state: AppState) => {
  return {
    cookies: state.cookies,
    slab: state.user.slab,
    currencyList: state.info.currencyList,
    user: state.user,
    sortBy: state.wishlist.sortBy
  };
};

type Props = BottomMenuProps &
  RouteComponentProps &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

const BottomMenu: React.FC<Props> = ({
  bagCount,
  wishlistCount,
  isLoggedIn,
  goLogin,
  showBag,
  setShowBag,
  showSearch,
  isSearch,
  onBottomMenuClick,
  history,
  currencyList,
  currency,
  changeCurrency,
  reloadPage,
  cookies,
  user,
  sortBy
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const scrollDown = useSelector((state: AppState) => state.info.scrollDown);
  const location = useSelector((state: AppState) => state.router.location);
  const isPLP =
    location.pathname.includes("/catalogue/category") ||
    location.pathname.includes("/search");
  const gtmPushWishlistClick = () => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "eventsToSend",
        eventAction: "wishListClick",
        eventCategory: "Click",
        eventLabel: location.pathname
      });
    }
  };

  const curryList = currencyList.map(data => {
    return {
      label: data.currencyCode + " " + data.currencySymbol,
      value: data.currencyCode
    };
  });
  const items: DropdownItem[] = curryList;

  const isBridalRegistryPage =
    location.pathname.indexOf("/bridal/") > -1 &&
    !location.pathname.includes("/account/");

  const currencyChange = (cur: any) => {
    const data: any = {
      currency: cur
    };
    if (!isLoading && currency != data.currency) {
      setIsLoading(true);
    }
    return changeCurrency(data)
      .then((response: any) => {
        if (history.location.pathname.indexOf("/catalogue/category/") > -1) {
          const path =
            history.location.pathname +
            history.location.search.replace(currency, response.currency);
          history.replace(path);
        }
        onBottomMenuClick?.("Currency");
        reloadPage(
          cookies,
          response.currency,
          user.customerGroup,
          history.location.pathname,
          user.isLoggedIn,
          sortBy
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      className={cs(styles.headerContainerMenu, {
        [styles.hide]: isPLP && scrollDown
      })}
      // onClick={() => {
      // dataLayer.push({
      //   event: "Footer Click",
      //   clickType: "",
      //   location: "Bottom",
      //   userStatus: isLoggedIn ? "logged in" : "logged out"
      // });
      // }}
    >
      <div className={bootstrap.row}>
        {/* <div className={cs(bootstrap.col)}>
          <div className={cs(styles.bottomMenuItem, styles.homeBottomMenu)}>
            <Link to="/" onClick={() => onBottomMenuClick?.("Logo")}>
              <i
                className={cs(
                  iconStyles.iconBottomNavHome,
                  iconStyles.icon,
                  styles.iconStyle,
                  styles.logoIconStyle,
                  { [globalStyles.cerise]: location.pathname == "/" }
                )}
              ></i>
            </Link>
          </div>
        </div> */}
        <div className={cs(bootstrap.col)}>
          <div className={cs(styles.bottomMenuItem)}>
            <SelectableDropdownMenu
              id="currency-dropdown-sidemenu"
              align="left"
              direction="up"
              className={storyStyles.greyBG}
              items={items}
              value={currency}
              onChangeCurrency={currencyChange}
              disabled={isBridalRegistryPage ? true : false}
              showCaret={true}
            />
          </div>
        </div>
        <div className={cs(bootstrap.col)}>
          <div
            className={cs(styles.mobileSearch, styles.bottomMenuItem)}
            onClick={() => {
              showSearch();
              onBottomMenuClick?.("Search");
            }}
          >
            <i
              className={
                isSearch
                  ? cs(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig,
                      styles.iconStyleCross
                    )
                  : cs(iconStyles.icon, iconStyles.iconSearch, styles.iconStyle)
              }
            ></i>
          </div>
        </div>
        {/* <div className={cs(bootstrap.col, styles.hamburgerBottomMenu)}>
          <div className={styles.bottomMenuItem}>
            <i
              className={
                showMenu
                  ? styles.hidden
                  : cs(
                      iconStyles.icon,
                      iconStyles.iconLibraryMenu,
                      styles.iconStyle,
                      styles.iconFont,
                      styles.menuIconStyle
                    )
              }
              onClick={() => {
                clickToggle();
                onBottomMenuClick?.("Mobile Menu");
              }}
            ></i>
            <i
              className={
                showMenu
                  ? cs(
                      iconStyles.icon,
                      iconStyles.iconCrossNarrowBig,
                      // styles.iconStyle,
                      styles.iconCrossFont
                    )
                  : styles.hidden
              }
              onClick={() => {
                clickToggle();
                onBottomMenuClick?.("Mobile Menu");
              }}
            ></i>
          </div>
        </div> */}
        <div className={cs(bootstrap.col, styles.mobileWishlist)}>
          <div className={styles.bottomMenuItem}>
            <Link
              to="/wishlist"
              onClick={() => {
                gtmPushWishlistClick();
                onBottomMenuClick?.("Wishlist");
              }}
            >
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconWishlist,
                  {
                    [globalStyles.gold]: location.pathname.includes("/wishlist")
                  },
                  styles.iconStyle,
                  styles.wishlistIconStyle
                )}
              />
              <span
                className={cs(styles.badge, {
                  [globalStyles.gold]: location.pathname.includes("/wishlist")
                })}
              >
                {wishlistCount > 0 ? wishlistCount : ""}
              </span>
            </Link>
          </div>
        </div>
        <div className={cs(bootstrap.col, globalStyles.cerise)}>
          <div className={styles.bottomMenuItem}>
            <ul>
              <li className={styles.cartBottomMenu}>
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconCart,
                    styles.iconStyle
                  )}
                  onClick={(): void => {
                    setShowBag(true);
                    onBottomMenuClick?.("Cart");
                  }}
                />
                <span
                  className={styles.badge}
                  onClick={(): void => {
                    setShowBag(true);
                  }}
                >
                  {bagCount}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className={cs(bootstrap.col)}>
          <div className={styles.bottomMenuItem}>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconProfile,
                styles.iconStyle,
                {
                  [globalStyles.gold]: location.pathname.includes(
                    "/account/profile"
                  )
                }
              )}
              onClick={(): void => {
                isLoggedIn ? history.push("/account/profile") : goLogin();
              }}
            />
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};
const BottomMenuWithRouter = withRouter(BottomMenu);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomMenuWithRouter);
