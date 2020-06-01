// modules
import React, { memo, useContext, useCallback } from "react";
import cs from "classnames";
import { useStore } from "react-redux";
// contexts
import WishlistContext from "contexts/wishlist";
import UserContext from "contexts/user";
// typings
import { Props } from "./typings";
// services
import WishlistService from "services/wishlist";
import LoginService from "services/login";
// styles
import iconStyles from "styles/iconFonts.scss";
import styles from "./styles.scss";

const WishlistButton: React.FC<Props> = ({
  id,
  showText,
  className,
  iconClassName,
  mobile
}) => {
  const items = useContext(WishlistContext);
  const { isLoggedIn } = useContext(UserContext);
  const store = useStore();

  const addedToWishlist = items.indexOf(id) !== -1;

  const onClick = useCallback(() => {
    if (!isLoggedIn) {
      LoginService.showLogin(store.dispatch);
    } else {
      if (addedToWishlist) {
        WishlistService.removeFromWishlist(store.dispatch, id);
      } else {
        WishlistService.addToWishlist(store.dispatch, id);
      }
    }
  }, [addedToWishlist, id, isLoggedIn]);

  return (
    <div className={className}>
      <div
        className={cs(iconStyles.icon, styles.wishlistIcon, iconClassName, {
          [iconStyles.iconWishlistAdded]: addedToWishlist,
          [iconStyles.iconWishlist]: !addedToWishlist,
          [styles.addedToWishlist]: addedToWishlist,
          [styles.mobileWishlist]: mobile
        })}
        onClick={onClick}
      ></div>
      {showText && (
        <div
          className={cs(styles.label, {
            [styles.addedToWishlist]: addedToWishlist
          })}
        >
          {addedToWishlist ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
        </div>
      )}
    </div>
  );
};

export default memo(WishlistButton);
