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
  inWishlist,
  onMoveToWishlist
}) => {
  const items = useContext(WishlistContext);
  const { isLoggedIn } = useContext(UserContext);
  const [showLoader, setShowLoader] = useState(false);
  const store = useStore();
  const {
    currency,
    wishlist: { sortBy }
  } = useSelector((state: AppState) => state);
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
      setShowLoader(true);
      if (basketLineId) {
        WishlistService.moveToWishlist(
          store.dispatch,
          basketLineId,
          size || "",
          source,
          sortBy
        )
          .then(() => {
            onMoveToWishlist?.();
          })
          .finally(() => {
            setShowLoader(false);
          });
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
            [iconStyles.iconWishlistAdded]:
              (addedToWishlist && !basketLineId) || inWishlist,
            [iconStyles.iconWishlist]:
              (!addedToWishlist || basketLineId) && !inWishlist,
            [styles.addedToWishlist]:
              (addedToWishlist && !basketLineId) || inWishlist,
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
      {showLoader && <Loader />}
    </>
  );
};

export default memo(WishlistButton);
