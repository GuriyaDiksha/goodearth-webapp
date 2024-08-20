import React, { useState, useEffect, useContext } from "react";
import styles from "./styles.scss";
import cs from "classnames";
import Button from "components/Button";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import fontStyles from "styles/iconFonts.scss";
import { Link } from "react-router-dom";
import WishlistService from "services/wishlist";
import { WishlistResponse } from "services/wishlist/typings";
import {
  ChildProductAttributes,
  PartialChildProductAttributes
} from "src/typings/product";
import CookieService from "../../services/cookie";
import { PriceRecord } from "typings/price";
import { ProductID } from "typings/id";
import { useStore, useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { AppState } from "reducers/typings";
import { GA_CALLS } from "constants/cookieConsent";
import { showGrowlMessage } from "utils/validate";
import UserContext from "contexts/user";
import { updateLoader } from "actions/info";
import { decriptdata } from "utils/validate";
import globalStyles from "styles/global.scss";

type Props = {
  hideWishlistPopup?: any;
  gtmListType?: string;
  title?: string;
  childAttributes?: ChildProductAttributes[] | PartialChildProductAttributes[];
  priceRecords?: PriceRecord;
  discountedPriceRecords?: PriceRecord;
  categories?: string[];
  id: ProductID;
  showText?: boolean;
  className?: string;
  size?: string;
  mobile?: boolean;
  iconClassName?: string;
  basketLineId?: ProductID;
  onMoveToWishlist?: () => void;
  source?: string;
  inWishlist?: boolean;
  parentWidth?: boolean;
  onComplete?: () => void;
  isPlpTile?: boolean;
  tablet?: boolean;
  badgeType?: string;
  updateWishlistData?: any;
};

const CreateWishlist: React.FC<Props> = ({
  hideWishlistPopup,
  gtmListType,
  id,
  // size,
  // showText,
  title,
  categories,
  priceRecords,
  // discountedPriceRecords,
  childAttributes,
  // className,
  // iconClassName,
  // mobile,
  basketLineId,
  // parentWidth,
  // source,
  // onMoveToWishlist,
  badgeType,
  updateWishlistData
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const store = useStore();
  const { isLoggedIn } = useContext(UserContext);
  const {
    currency,
    info: { isSale }
  } = useSelector((state: AppState) => state);
  const [wishlistDataItem, setWishListItemData] = useState<WishlistResponse>({
    data: []
  });

  const [listName, setListName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isenable, setIsenable] = useState(false);

  const onInputChange = (e: any) => {
    const value = e.currentTarget.value.trim();
    setListName(value);
    if (value) {
      setIsenable(true);
    } else {
      setIsenable(false);
      setErrorMsg("");
      setIsenable(false);
    }
  };

  const fetchWishlistName = async () => {
    const data = await WishlistService.updateWishlist(dispatch);
    if (data) {
      setWishListItemData(data);
    }
  };

  useEffect(() => {
    fetchWishlistName();
  }, []);

  const handleSubmit = (listName: string) => {
    WishlistService.addToWishlist(store.dispatch, undefined, listName)
      .then(res => {
        setListName(listName);
        fetchWishlistName();
        setErrorMsg("");
        setIsenable(false);
      })
      .catch((error: any) => {
        const data = decriptdata(error.response?.data);
        console.log(error);
        if (data.success == false) {
          if (data.message == "Wishlist name already exist!") {
            setErrorMsg("List with same name exists");
          }
        }
      });
  };

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
                  coupon: "", // Pass the coupon if available
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
                      : "",
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

  const addWishlistHandler = (listName: string) => {
    WishlistService.addToWishlist(store.dispatch, id, listName)
      .then(() => {
        const growlMsg = (
          <div>
            Your item has been saved to {listName}.{" "}
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
        gtmPushAddToWishlist(true);
        showGrowlMessage(dispatch, growlMsg);
        fetchWishlistName();
        if (history.location.pathname.includes("wishlist")) {
          updateWishlistData();
        }
      })
      .finally(() => {
        dispatch(updateLoader(false));
      });
  };

  const removeWishlistHandler = async (id: number, listName: string) => {
    WishlistService.removeFromWishlist(
      dispatch,
      id,
      undefined,
      listName
    ).finally(() => {
      dispatch(updateLoader(false));
      gtmPushAddToWishlist(false);
      fetchWishlistName();
      if (history.location.pathname.includes("wishlist")) {
        updateWishlistData();
      }
    });
  };

  return (
    <>
      <div className={styles.createWishlistWrapper}>
        <div className={styles.heading}>
          <p>Save Product to List(s)</p>
          <span
            className={cs(
              styles.closePopup,
              fontStyles.icon,
              fontStyles.iconCross
            )}
            onClick={hideWishlistPopup}
          ></span>
        </div>
        <div className={styles.wishlistItems}>
          {wishlistDataItem.data.map((item: any, i: any) => {
            const hasProductId = item.products.some(
              (product: any) => product.productId === id
            );
            return (
              <>
                <li key={i} className={cs(styles.listItem)}>
                  <span
                    className={cs(styles.listName, {
                      [globalStyles.gold]: hasProductId
                    })}
                  >
                    {item.name}
                  </span>
                  {hasProductId ? (
                    <span
                      className={cs(styles.addRemoveCta, globalStyles.gold)}
                      onClick={() => removeWishlistHandler(id, item.name)}
                    >
                      REMOVE
                    </span>
                  ) : (
                    <span
                      className={cs(styles.addRemoveCta)}
                      onClick={() => addWishlistHandler(item.name)}
                    >
                      ADD
                    </span>
                  )}
                </li>
              </>
            );
          })}
        </div>
        {wishlistDataItem.data.length < 6 ? (
          <Formsy onValidSubmit={handleSubmit}>
            <div className={styles.wishlistForm}>
              <FormInput
                id=""
                className={cs(styles.inputField, styles.regFormLabel, {
                  [styles.errorBorder]: errorMsg
                })}
                name="listName"
                placeholder="Create New List"
                label="Create New List"
                validations={{
                  maxLength: 30,
                  isExisty: true
                }}
                validationErrors={{
                  maxLength: "You can not enter more than 30 characters"
                }}
                value={listName || ""}
                handleChange={onInputChange}
              />
              <Button
                variant={
                  !isenable ? "smallLightGreyCta" : "smallMedCharcoalCta"
                }
                type="submit"
                label={"CREATE"}
                disabled={!isenable}
                stopHover={true}
                className={cs(styles.createBtn)}
              />
              {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
            </div>
          </Formsy>
        ) : (
          <div className={styles.inputBoxHide}>
            <span>
              Only upto 5 lists can be created. To edit or make changes
            </span>
          </div>
        )}
        {!history.location.pathname.includes("wishlist") && (
          <div className={styles.manageLink}>
            <Link to="/wishlist">Manage Your Lists</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateWishlist;
