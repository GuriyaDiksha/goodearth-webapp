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
  gtmListType,
  id,
  size,
  showText,
  title,
  categories,
  priceRecords,
  childAttributes,
  className,
  iconClassName,
  mobile,
  basketLineId,
  source,
  onMoveToWishlist
}) => {
  const items = useContext(WishlistContext);
  const { isLoggedIn } = useContext(UserContext);
  const store = useStore();
  const { currency } = useSelector((state: AppState) => state);
  const addedToWishlist = items.indexOf(id) !== -1;
  const gtmPushAddToWishlist = () => {
    if (gtmListType) {
      const index = categories ? categories.length - 1 : 0;
      let category =
        categories &&
        categories.length > 0 &&
        categories[index].replace(/\s/g, "");
      category = category && category.replace(/>/g, "/");
      dataLayer.push({
        event: "AddtoWishlist",
        ecommerce: {
          currencyCode: currency,
          add: {
            products: [
              {
                name: title,
                id: childAttributes?.[0].sku,
                price: priceRecords ? priceRecords[currency] : null,
                brand: "Goodearth",
                category: category,
                variant:
                  childAttributes && childAttributes[0].color
                    ? childAttributes[0].color[0]
                    : "",
                quantity: 1,
                list: gtmListType
              }
            ]
          }
        }
      });
    }
  };

  const onClick = useCallback(async () => {
    if (!isLoggedIn) {
      LoginService.showLogin(store.dispatch);
    } else {
      if (basketLineId) {
        await WishlistService.moveToWishlist(
          store.dispatch,
          basketLineId,
          source
        );
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
