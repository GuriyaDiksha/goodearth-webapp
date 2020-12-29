import React from "react";
import styles from "./styles.scss";
import cs from "classnames";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import { Link, useLocation } from "react-router-dom";

type Props = {
  wishlistCount: number;
  isLoggedIn: boolean;
  showMenu: boolean;
  clickToggle: () => void;
  goLogin: (e?: React.MouseEvent) => void;
  showSearch: () => void;
  isSearch: boolean;
  showBag: boolean;
  setShowBag: (showBag: boolean) => void;
  bagCount: number;
};
const BottomMenu: React.FC<Props> = ({
  bagCount,
  wishlistCount,
  isLoggedIn,
  showMenu,
  clickToggle,
  goLogin,
  showBag,
  setShowBag,
  showSearch,
  isSearch
}) => {
  const location = useLocation();
  const gtmPushWishlistClick = () => {
    dataLayer.push({
      event: "eventsToSend",
      eventAction: "wishListClick",
      eventCategory: "Click",
      eventLabel: location.pathname
    });
  };
  return (
    <div className={cs(styles.headerContainerMenu)}>
      <div className={bootstrap.row}>
        <div className={cs(bootstrap.col)}>
          <div className={cs(styles.bottomMenuItem, styles.homeBottomMenu)}>
            <Link to="/">
              <i
                className={cs(
                  iconStyles.iconBottomNavHome,
                  iconStyles.icon,
                  styles.iconStyle,
                  { [globalStyles.cerise]: location.pathname == "/" }
                )}
              ></i>
            </Link>
          </div>
        </div>
        <div className={cs(bootstrap.col)}>
          <li className={cs(styles.mobileSearch, styles.bottomMenuItem)}>
            <div onClick={showSearch}>
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
        <div className={cs(bootstrap.col, styles.hamburgerBottomMenu)}>
          <div className={styles.bottomMenuItem}>
            <i
              className={
                showMenu
                  ? styles.hidden
                  : cs(
                      iconStyles.icon,
                      iconStyles.iconLibraryMenu,
                      styles.iconStyle,
                      styles.iconFont
                    )
              }
              onClick={() => {
                clickToggle();
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
              }}
            ></i>
          </div>
        </div>
        <div className={cs(bootstrap.col, styles.mobileWishlist)}>
          <div className={styles.bottomMenuItem}>
            {isLoggedIn ? (
              <Link to="/wishlist" onClick={gtmPushWishlistClick}>
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
                    {
                      [globalStyles.cerise]: location.pathname.includes(
                        "/wishlist"
                      )
                    }
                  )}
                ></i>
                <span className={styles.badge}>
                  {wishlistCount > 0 ? wishlistCount : ""}
                </span>
              </Link>
            ) : (
              <div onClick={goLogin}>
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconWishlist,
                    styles.iconStyle
                  )}
                ></i>
              </div>
            )}
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
                  }}
                ></i>
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
      </div>
    </div>
  );
};
export default BottomMenu;
