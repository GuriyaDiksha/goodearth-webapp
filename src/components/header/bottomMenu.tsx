import React from "react";
import styles from "./styles.scss";
import cs from "classnames";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

type Props = {
  wishlistCount: number;
  showMenu: boolean;
  clickToggle: () => void;
  isLoggedIn: boolean;
  goLogin: (e?: React.MouseEvent) => void;
  showSearch: () => void;
  isSearch: boolean;
  showBag: boolean;
  setShowBag: (showBag: boolean) => void;
  bagCount: number;
  onBottomMenuClick?: (clickType: string) => void;
} & RouteComponentProps;
const BottomMenu: React.FC<Props> = ({
  bagCount,
  wishlistCount,
  showMenu,
  clickToggle,
  isLoggedIn,
  goLogin,
  showBag,
  setShowBag,
  showSearch,
  isSearch,
  onBottomMenuClick,
  history
}) => {
  const scrollDown = useSelector((state: AppState) => state.info.scrollDown);
  const location = useSelector((state: AppState) => state.router.location);
  const isPLP = location.pathname.includes("/catalogue/category");
  const gtmPushWishlistClick = () => {
    dataLayer.push({
      event: "eventsToSend",
      eventAction: "wishListClick",
      eventCategory: "Click",
      eventLabel: location.pathname
    });
  };
  return (
    <div
      className={cs(styles.headerContainerMenu, {
        [styles.hide]: isPLP && scrollDown
      })}
    >
      <div className={bootstrap.row}>
        <div className={cs(bootstrap.col)}>
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
        </div>
        <div className={cs(bootstrap.col)}>
          <li className={cs(styles.mobileSearch, styles.bottomMenuItem)}>
            <div
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
                    : cs(
                        iconStyles.icon,
                        iconStyles.iconSearch,
                        styles.iconStyle
                      )
                }
              ></i>
            </div>
          </li>
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
                  {
                    [iconStyles.iconWishlist]: !location.pathname.includes(
                      "/wishlist"
                    )
                  },
                  {
                    [iconStyles.iconWishlistAdded]: location.pathname.includes(
                      "/wishlist"
                    )
                  },
                  styles.iconStyle,
                  styles.wishlistIconStyle,
                  {
                    [globalStyles.cerise]: location.pathname.includes(
                      "/wishlist"
                    )
                  }
                )}
              />
              <span
                className={cs(styles.badge, {
                  [globalStyles.cerise]: location.pathname.includes("/wishlist")
                })}
              >
                {wishlistCount}
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
                styles.iconStyle
              )}
              onClick={(): void => {
                isLoggedIn ? history.push("/account/profile") : goLogin();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default withRouter(BottomMenu);
