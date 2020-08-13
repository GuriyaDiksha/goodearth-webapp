// modules
import React, { memo, useContext, useCallback } from "react";
import cs from "classnames";
import { useStore, useSelector } from "react-redux";
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
import { AppState } from "reducers/typings";

const WishlistButton: React.FC<Props> = ({
  id,
  size,
  showText,
  className,
  iconClassName,
  mobile,
  basketLineId,
  onMoveToWishlist,
  product
}) => {
  const items = useContext(WishlistContext);
  const { isLoggedIn } = useContext(UserContext);
  const store = useStore();
  const { currency } = useSelector((state: AppState) => state);
  const addedToWishlist = items.indexOf(id) !== -1;
  const gtmPushAddToWishlist = () => {
    const index = product.categories.length - 1;
    let category = product.categories[index].replace(/\s/g, "");
    category = category.replace(/>/g, "/");
    dataLayer.push({
      event: "AddtoWishlist",
      ecommerce: {
        currencyCode: currency,
        add: {
          products: [
            {
              name: product.title,
              id: product.childAttributes?.[0].sku,
              price: product.priceRecords[currency],
              brand: "Goodearth",
              category: category,
              variant:
                product.childAttributes && product.childAttributes[0].color
                  ? product.childAttributes[0].color[0]
                  : "",
              quantity: 1,
              list: "Search"
            }
          ]
        }
      }
    });
  };

  const onClick = useCallback(async () => {
    if (!isLoggedIn) {
      LoginService.showLogin(store.dispatch);
    } else {
      if (basketLineId) {
        await WishlistService.moveToWishlist(store.dispatch, basketLineId);
        onMoveToWishlist?.();
      } else {
        if (addedToWishlist) {
          WishlistService.removeFromWishlist(store.dispatch, id).then(() => {
            gtmPushAddToWishlist();
          });
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
