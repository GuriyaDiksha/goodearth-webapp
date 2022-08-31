// modules
import React, {
  memo,
  useContext,
  useCallback,
  useState,
  useEffect
} from "react";
import cs from "classnames";
import { useStore, useSelector, useDispatch } from "react-redux";
// contexts
import WishlistContext from "contexts/wishlist";
import UserContext from "contexts/user";
// typings
import { Props } from "./typings.d";
// services
import WishlistService from "services/wishlist";
// styles
import iconStyles from "styles/iconFonts.scss";
import styles from "./styles.scss";
import { AppState } from "reducers/typings";
import { ChildProductAttributes } from "typings/product";
import { updateLoader } from "actions/info";
import CookieService from "../../services/cookie";

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
  parentWidth,
  source,
  // inWishlist,
  onMoveToWishlist,
  onComplete
}) => {
  const { wishlistItems, wishlistChildItems } = useContext(WishlistContext);
  const { isLoggedIn } = useContext(UserContext);
  const store = useStore();
  const {
    currency,
    wishlist: { sortBy }
  } = useSelector((state: AppState) => state);
  const [addedToWishlist, setAddedToWishlist] = useState(
    wishlistItems.indexOf(id) != -1 ||
      (basketLineId && wishlistChildItems.indexOf(id) != -1)
  );
  const dispatch = useDispatch();
  const gtmPushAddToWishlist = (addWishlist?: boolean) => {
    try {
      if (gtmListType) {
        const index = categories ? categories.length - 1 : 0;
        let category: any =
          categories &&
          categories.length > 0 &&
          categories[index].replace(/\s/g, "");
        category = category && category.replace(/>/g, "/");
        const listPath = `${gtmListType}`;
        const child = childAttributes as ChildProductAttributes[];
        console.log(category, id, title, priceRecords);
        const userConsent = CookieService.getCookie("consent").split(",");
        if (userConsent.includes("Moengage")) {
          if (addWishlist) {
            Moengage.track_event("add_to_wishlist", {
              "Product id": id,
              "Product name": title,
              quantity: 1,
              price: priceRecords?.[currency] ? +priceRecords?.[currency] : "",
              Currency: currency,
              // "Collection name": collection,
              "Category name": category?.split("/")[0],
              "Sub Category Name": category?.split("/")[1] || ""
            });
          } else {
            Moengage.track_event("remove_from_wishlist", {
              "Product id": id,
              "Product name": title,
              quantity: 1,
              price: priceRecords?.[currency] ? +priceRecords?.[currency] : "",
              Currency: currency,
              // "Collection name": collection,
              "Category name": category?.split("/")[0],
              "Sub Category Name": category?.split("/")[1] || ""
            });
          }
        }

        if (userConsent.includes("GA-Calls")) {
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
      }
    } catch (err) {
      console.log("Wishlist GTM error!");
    }
  };

  const onClick = useCallback(async () => {
    dispatch(updateLoader(true));
    if (basketLineId) {
      if (addedToWishlist) {
        WishlistService.removeFromWishlist(
          store.dispatch,
          id,
          undefined,
          sortBy,
          size
        ).finally(() => {
          dispatch(updateLoader(false));
          onComplete && onComplete();
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
            dispatch(updateLoader(false));
            onComplete && onComplete();
          });
      }
    } else {
      if (addedToWishlist) {
        WishlistService.removeFromWishlist(store.dispatch, id).finally(() => {
          dispatch(updateLoader(false));
          onComplete && onComplete();
          gtmPushAddToWishlist(false);
        });
      } else {
        WishlistService.addToWishlist(store.dispatch, id, size)
          .then(() => {
            gtmPushAddToWishlist(true);
          })
          .finally(() => {
            dispatch(updateLoader(false));
            onComplete && onComplete();
          });
      }
    }
  }, [addedToWishlist, id, isLoggedIn, basketLineId, size]);

  useEffect(() => {
    setAddedToWishlist(
      wishlistItems.indexOf(id) != -1 ||
        (basketLineId && wishlistChildItems.indexOf(id) != -1)
    );
  }, [wishlistChildItems, wishlistItems]);
  return (
    <>
      <div className={className}>
        <div
          style={parentWidth ? { width: "100%" } : {}}
          className={cs(iconStyles.icon, styles.wishlistIcon, iconClassName, {
            [iconStyles.iconWishlistAdded]: addedToWishlist,
            [iconStyles.iconWishlist]: !addedToWishlist,
            [styles.addedToWishlist]: addedToWishlist,
            [styles.mobileWishlist]: mobile
          })}
          title={
            basketLineId
              ? addedToWishlist
                ? "Remove from Saved Items"
                : "Move to Saved Items"
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
            {addedToWishlist ? "REMOVE FROM SAVED ITEMS" : "SAVE FOR LATER"}
          </div>
        )}
      </div>
    </>
  );
};

export default memo(WishlistButton);
