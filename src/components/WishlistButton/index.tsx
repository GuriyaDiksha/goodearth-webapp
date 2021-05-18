// modules
import React, { memo, useContext, useCallback, useState } from "react";
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
import Loader from "components/Loader";
import { ChildProductAttributes } from "typings/product";

const WishlistButton: React.FC<Props> = ({
  gtmListType,
  id,
  size,
  showText,
  title,
  categories,
  priceRecords,
  discountedPriceRecords,
  childAttributes,
  className,
  iconClassName,
  mobile,
  basketLineId,
  source,
  // inWishlist,
  onMoveToWishlist
}) => {
  const { wishlistItems, wishlistChildItems } = useContext(WishlistContext);
  const { isLoggedIn } = useContext(UserContext);
  const [showLoader, setShowLoader] = useState(false);
  const store = useStore();
  const {
    currency,
    wishlist: { sortBy }
  } = useSelector((state: AppState) => state);
  let addedToWishlist = wishlistItems.indexOf(id) !== -1;
  if (!addedToWishlist && basketLineId) {
    addedToWishlist = wishlistChildItems.indexOf(id) != -1;
  }
  const gtmPushAddToWishlist = () => {
    try {
      if (gtmListType) {
        const index = categories ? categories.length - 1 : 0;
        let category =
          categories &&
          categories.length > 0 &&
          categories[index].replace(/\s/g, "");
        category = category && category.replace(/>/g, "/");
        const listPath = `${gtmListType}`;
        const child = childAttributes as ChildProductAttributes[];
        dataLayer.push({
          event: "AddtoWishlist",
          ecommerce: {
            currencyCode: currency,
            add: {
              products: [
                {
                  name: title,
                  id: child?.[0].sku,
                  price: child?.[0].discountedPriceRecords
                    ? child?.[0].discountedPriceRecords[currency]
                    : child?.[0].priceRecords
                    ? child?.[0].priceRecords[currency]
                    : null,
                  brand: "Goodearth",
                  category: category,
                  variant:
                    childAttributes && childAttributes[0].size
                      ? childAttributes[0].size
                      : "",
                  quantity: 1,
                  list: listPath
                }
              ]
            }
          }
        });
      }
    } catch (err) {
      console.log("Wishlist GTM error!");
    }
  };

  const onClick = useCallback(async () => {
    if (!isLoggedIn) {
      LoginService.showLogin(store.dispatch);
    } else {
      setShowLoader(true);
      if (basketLineId) {
        if (addedToWishlist) {
          WishlistService.removeFromWishlist(
            store.dispatch,
            id,
            undefined,
            sortBy,
            size
          ).finally(() => {
            setShowLoader(false);
          });
        } else {
          WishlistService.moveToWishlist(
            store.dispatch,
            basketLineId,
            size || childAttributes?.[0].size || "",
            source,
            sortBy
          )
            .then(() => {
              onMoveToWishlist?.();
            })
            .finally(() => {
              setShowLoader(false);
            });
        }
      } else {
        if (addedToWishlist) {
          WishlistService.removeFromWishlist(store.dispatch, id).finally(() => {
            setShowLoader(false);
          });
        } else {
          WishlistService.addToWishlist(store.dispatch, id, size)
            .then(() => {
              gtmPushAddToWishlist();
            })
            .finally(() => {
              setShowLoader(false);
            });
        }
      }
    }
  }, [addedToWishlist, id, isLoggedIn, basketLineId, size]);

  return (
    <>
      <div className={className}>
        <div
          className={cs(iconStyles.icon, styles.wishlistIcon, iconClassName, {
            [iconStyles.iconWishlistAdded]: addedToWishlist,
            [iconStyles.iconWishlist]: !addedToWishlist,
            [styles.addedToWishlist]: addedToWishlist,
            [styles.mobileWishlist]: mobile
          })}
          title={
            basketLineId
              ? addedToWishlist
                ? "Remove from Wishlist"
                : "Move to Wishlist"
              : ""
          }
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
      {showLoader && <Loader />}
    </>
  );
};

export default memo(WishlistButton);
