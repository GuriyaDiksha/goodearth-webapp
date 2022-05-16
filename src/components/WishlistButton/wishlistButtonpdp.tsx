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
import stylespdp from "./stylespdp.scss";
import { AppState } from "reducers/typings";
import { ChildProductAttributes } from "typings/product";
import { updateLoader } from "actions/info";

const WishlistButtonpdp: React.FC<Props> = ({
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
  onMoveToWishlist
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
  const gtmPushAddToWishlist = () => {
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
          });
      }
    } else {
      if (addedToWishlist) {
        WishlistService.removeFromWishlist(store.dispatch, id).finally(() => {
          dispatch(updateLoader(false));
        });
      } else {
        WishlistService.addToWishlist(store.dispatch, id, size)
          .then(() => {
            gtmPushAddToWishlist();
          })
          .finally(() => {
            dispatch(updateLoader(false));
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
      <div
        className={cs(className, stylespdp.wishlistButtonPdp)}
        onClick={onClick}
      >
        <div
          style={parentWidth ? { width: "100%" } : {}}
          className={cs(
            iconStyles.icon,
            stylespdp.wishlistIcon,
            iconClassName,
            {
              [iconStyles.iconWishlistAdded]: addedToWishlist,
              [iconStyles.iconWishlist]: !addedToWishlist,
              [stylespdp.addedToWishlist]: addedToWishlist,
              [stylespdp.mobileWishlist]: mobile
            }
          )}
          title={
            basketLineId
              ? addedToWishlist
                ? "Remove from Saved Items"
                : "Move to Saved Items"
              : ""
          }
        ></div>
        {showText && (
          <div
            className={cs(stylespdp.label, {
              [stylespdp.addedToWishlist]: addedToWishlist
            })}
          >
            {addedToWishlist ? "SAVED!" : "SAVE FOR LATER"}
          </div>
        )}
      </div>
    </>
  );
};

export default memo(WishlistButtonpdp);
