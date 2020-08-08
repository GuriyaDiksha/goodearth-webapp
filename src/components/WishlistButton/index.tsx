// modules
import React, { memo, useContext, useCallback } from "react";
import cs from "classnames";
import { useStore } from "react-redux";
// contexts
import WishlistContext from "contexts/wishlist";
import UserContext from "contexts/user";
// typings
import { Props } from "./typings.d";
// services
import WishlistService from "services/wishlist";
import LoginService from "services/login";
// styles
import iconStyles from "styles/iconFonts.scss";
import styles from "./styles.scss";

const WishlistButton: React.FC<Props> = ({
  id,
  size,
  showText,
  className,
  iconClassName,
  mobile,
  basketLineId,
  onMoveToWishlist
}) => {
  const items = useContext(WishlistContext);
  const { isLoggedIn } = useContext(UserContext);
  const store = useStore();

  const addedToWishlist = items.indexOf(id) !== -1;

  const onClick = useCallback(async () => {
    if (!isLoggedIn) {
      LoginService.showLogin(store.dispatch);
    } else {
      if (basketLineId) {
        await WishlistService.moveToWishlist(store.dispatch, basketLineId);
        onMoveToWishlist?.();
      } else {
        if (addedToWishlist) {
          WishlistService.removeFromWishlist(store.dispatch, id);
        } else {
          WishlistService.addToWishlist(store.dispatch, id, size);
        }
      }
    }
  }, [addedToWishlist, id, isLoggedIn, basketLineId, size]);

  return (
    <div className={className}>
      <div
        className={cs(iconStyles.icon, styles.wishlistIcon, iconClassName, {
          [iconStyles.iconWishlistAdded]: addedToWishlist && !basketLineId,
          [iconStyles.iconWishlist]: !addedToWishlist || basketLineId,
          [styles.addedToWishlist]: addedToWishlist && !basketLineId,
          [styles.mobileWishlist]: mobile
        })}
        title={basketLineId ? "Move to Wishlist" : ""}
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
