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
import { GA_CALLS } from "constants/cookieConsent";
import { useHistory } from "react-router";
import globalStyles from "styles/global.scss";
import { showGrowlMessage } from "utils/validate";
import { Link } from "react-router-dom";

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
  onComplete,
  isPlpTile, //Use this for new icon
  tablet,
  badgeType
}) => {
  const { wishlistItems, wishlistChildItems } = useContext(WishlistContext);
  const { isLoggedIn } = useContext(UserContext);
  const store = useStore();
  const {
    currency,
    // wishlist: { sortBy },
    info: { isSale }
  } = useSelector((state: AppState) => state);
  const [addedToWishlist, setAddedToWishlist] = useState(
    wishlistItems.indexOf(id) != -1 ||
      (basketLineId && wishlistChildItems.indexOf(id) != -1)
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const gtmPushAddToWishlist = (addWishlist?: boolean) => {
    try {
      if (gtmListType) {
        const index = categories ? categories.length - 1 : 0;
        let category: any =
          categories &&
          categories.length > 0 &&
          categories[index].replace(/\s/g, "");
        category = category && category.replace(/>/g, "/");
        const cat1 = categories?.[0]?.split(">");
        const cat2 = categories?.[1]?.split(">");

        const L1 = cat1?.[0]?.trim();

        const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

        const L3 = cat2?.[2]
          ? cat2?.[2]?.trim()
          : categories?.[2]?.split(">")?.[2]?.trim();

        const clickType = localStorage.getItem("clickType");
        const listPath = `${gtmListType}`;
        const child = childAttributes as ChildProductAttributes[];
        const search = CookieService.getCookie("search") || "";

        console.log(category, id, title, priceRecords);
        const userConsent = CookieService.getCookie("consent").split(",");
        if (userConsent.includes(GA_CALLS)) {
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

        if (userConsent.includes(GA_CALLS)) {
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
          dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
          dataLayer.push({
            event: "add_to_wishlist",
            previous_page_url: CookieService.getCookie("prevUrl"),
            ecommerce: {
              currency: currency,
              value: child?.[0].discountedPriceRecords
                ? child?.[0].discountedPriceRecords[currency]
                : child?.[0].priceRecords
                ? child?.[0].priceRecords[currency]
                : null,
              items: [
                {
                  item_id: id, //Pass the product id
                  item_name: title, // Pass the product name
                  affiliation: title, // Pass the product name
                  coupon: "NA", // Pass the coupon if available
                  currency: currency, // Pass the currency code
                  discount:
                    isSale && child?.[0].discountedPriceRecords
                      ? badgeType == "B_flat"
                        ? child?.[0].discountedPriceRecords[currency]
                        : child?.[0].priceRecords[currency] -
                          child?.[0].discountedPriceRecords[currency]
                      : "NA", // Pass the discount amount
                  index: 0,
                  item_brand: "Goodearth",
                  item_category: L1,
                  item_category2: L2,
                  item_category3: L3,
                  item_category4: "NA",
                  item_category5: "NA",
                  item_list_id: "NA",
                  item_list_name: search ? `${clickType}-${search}` : "NA",
                  item_variant:
                    childAttributes && childAttributes[0].size
                      ? childAttributes[0].size
                      : "NA",
                  price: child?.[0].discountedPriceRecords
                    ? child?.[0].discountedPriceRecords[currency]
                    : child?.[0].priceRecords
                    ? child?.[0].priceRecords[currency]
                    : null,
                  quantity: 1,
                  price_range: "NA"
                }
              ]
            }
          });
        }
      }
    } catch (err) {
      console.log("Wishlist GTM error!");
    }
  };

  const onClick = useCallback(async () => {
    const isShared = history.location.pathname.includes("shared-wishlist");

    dispatch(updateLoader(true));
    if (basketLineId) {
      if (addedToWishlist) {
        WishlistService.removeFromWishlist(
          store.dispatch,
          id,
          undefined
          // sortBy,
          // size
        ).finally(() => {
          dispatch(updateLoader(false));
          onComplete && onComplete();

          // WishlistService.countWishlist(dispatch);
        });
      } else {
        WishlistService.moveToWishlist(
          store.dispatch,
          basketLineId,
          // size || childAttributes?.[0].size || "",
          source
          // sortBy
        )
          .then(() => {
            onMoveToWishlist?.();
            gtmPushAddToWishlist(true);
            // WishlistService.countWishlist(dispatch);
          })
          .finally(() => {
            dispatch(updateLoader(false));
            onComplete && onComplete();
          });
      }
    } else {
      if (addedToWishlist) {
        WishlistService.removeFromWishlist(
          store.dispatch,
          id,
          undefined
          // undefined,
          // undefined
        ).finally(() => {
          dispatch(updateLoader(false));
          onComplete && onComplete();
          gtmPushAddToWishlist(false);

          // WishlistService.countWishlist(dispatch);
        });
      } else {
        const growlMsg = (
          <div>
            Your item has been saved to Default List.{" "}
            {isLoggedIn ? "Click here" : "Sign In"} to&nbsp;
            <Link
              to="/wishlist"
              key="wishlist"
              style={{ textDecoration: "underline", pointerEvents: "all" }}
            >
              view & mange
            </Link>
            &nbsp;your lists.
          </div>
        );
        WishlistService.addToWishlist(store.dispatch, id)
          .then(() => {
            gtmPushAddToWishlist(true);
            showGrowlMessage(dispatch, growlMsg);
            // WishlistService.countWishlist(dispatch);
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
        {gtmListType == "cart" ||
          (gtmListType == "MiniBag" ? (
            ""
          ) : (
            <div
              style={parentWidth ? { width: "100%" } : {}}
              className={cs(iconStyles.icon, iconClassName, {
                [iconStyles.iconWishlistAdded]: addedToWishlist && !isPlpTile,
                [iconStyles.iconWishlist]: !addedToWishlist && !isPlpTile,
                [styles.addedToWishlist]: addedToWishlist && showText,
                [iconStyles.iconPlpWishlistAdded]: addedToWishlist && isPlpTile,
                [iconStyles.iconPlpWishlist]: !addedToWishlist && isPlpTile,
                [globalStyles.tabletIconSize]: tablet && isPlpTile,
                [styles.mobileWishlist]: mobile && !isPlpTile,
                [globalStyles.iconContainer]: isPlpTile,
                [styles.wishlistPaddingTop]: isPlpTile,
                [styles.wishlistIcon]: !isPlpTile
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
          ))}
        {showText && (
          <div
            className={cs(styles.label, {
              [styles.addedToWishlist]: addedToWishlist
            })}
            onClick={onClick}
          >
            {addedToWishlist ? "SAVED!" : "SAVE"}
          </div>
        )}
      </div>
    </>
  );
};

export default memo(WishlistButton);
