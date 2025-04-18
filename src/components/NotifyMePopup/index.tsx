import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  EventHandler,
  MouseEvent,
  useEffect
} from "react";
import { useSelector, useStore } from "react-redux";
import cs from "classnames";
// components
import PdpQuantity from "components/quantity/pdpQuantity";
import SizeSelector from "components/SizeSelector";
import PdpButton from "components/Button/pdpButton";
import CloseButton from "components/Modal/components/CloseButton";
import InputField from "components/InputField";
// services
import BasketService from "services/basket";
import ProductService from "services/product";
import WishlistService from "services/wishlist";
// contexts
import UserContext from "contexts/user";
import { Context as ModalContext } from "components/Modal/context";
// styles
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { ChildProductAttributes } from "typings/product";
import { MESSAGE } from "constants/messages";
import { Currency } from "typings/currency";
import { ProductID } from "typings/id";
import { errorTracking, showGrowlMessage } from "utils/validate";
import Loader from "components/Loader";
import { AppState } from "reducers/typings";
import CookieService from "../../services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { displayPriceWithCommas } from "utils/utility";
import { isArray } from "lodash";
import { useHistory } from "react-router";

type Props = {
  basketLineId?: ProductID;
  price: number;
  currency: Currency;
  title: string;
  childAttributes: ChildProductAttributes[];
  collection?: string;
  selectedIndex?: number;
  isSale?: boolean;
  discount: boolean;
  badgeType?: string;
  discountedPrice?: number;
  category?: string;
  changeSize?: (size: string, quantity?: number) => void;
  onNotifyCart?: (basketLineId: ProductID) => void;
  // sortBy?: string;
  list?: string;
  sliderImages: { icon: boolean }[];
  collections: string[];
  badge_text?: string;
  productDataId?: number;
  listName?: string;
  source?: string;
};

const NotifyMePopup: React.FC<Props> = ({
  basketLineId,
  currency,
  price,
  discountedPrice,
  collection,
  category,
  childAttributes,
  title,
  selectedIndex,
  changeSize,
  onNotifyCart,
  isSale,
  discount,
  badgeType,
  // sortBy,
  list,
  sliderImages,
  collections,
  badge_text,
  productDataId,
  listName
}) => {
  const { dispatch } = useStore();
  const history = useHistory();

  const user = useContext(UserContext);
  const { closeModal } = useContext(ModalContext);
  const [
    selectedSize,
    setSelectedSize
  ] = useState<ChildProductAttributes | null>(
    selectedIndex !== undefined ? childAttributes[selectedIndex] : null
  );

  const minQuantity = 1;
  const maxQuantity = selectedSize ? selectedSize.stock : 1;
  const [sizeerror, setSizeerror] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const isLoggedIn = useSelector((state: AppState) => state.user.isLoggedIn);
  const mobile = useSelector((state: AppState) => state.device.mobile);
  const [productTitle, subtitle] = title.split("(");
  const onQuantityChange = useCallback(
    value => {
      setQuantity(value);
    },
    [selectedSize]
  );
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (
      typeof document == "object" &&
      (document?.getElementById("modal-fullscreen") as HTMLElement) &&
      mobile
    ) {
      (document.getElementById(
        "modal-fullscreen"
      ) as HTMLElement).style.height = "auto";
    }
    // if (document?.getElementById("modal-fullscreen-container") && mobile) {
    //   (document.getElementById(
    //     "modal-fullscreen-container"
    //   ) as HTMLElement).style.height = "auto";
    // }
  }, []);

  const onSizeSelect = useCallback(
    selected => {
      setSelectedSize(selected);
      setQuantity(1);

      changeSize?.(selected.size);
      setSizeerror(false);
    },
    [childAttributes, selectedSize]
  );

  const [showQty, setShowQty] = useState(false);
  useEffect(() => {
    const inStockSizes = childAttributes.filter(child => child.stock > 0);
    if (inStockSizes.length >= 1 && !selectedSize) {
      setShowQty(true);
    }
  }, []);

  useEffect(() => {
    const inStockSizes = childAttributes.filter(child => child.stock > 0);
    if (inStockSizes.length == 1 && !selectedSize) {
      setSelectedSize(inStockSizes[0]);
    }
    if (selectedSize && selectedSize.stock == 0) {
      setShowQty(false);
    }
  }, [childAttributes, selectedSize]);

  const userExists = !!(user && user.email);

  const [msg, setMsg] = useState("");
  // const [sizeErrorMsg, setSizeErrorMsg] = useState("");

  const [email, setEmail] = useState(userExists ? user.email : "");
  const [emailError, setEmailError] = useState("");

  const onEmailChange = (value: string, error: string) => {
    setEmail(value);
    setEmailError(error);
  };

  const validator = (value: string) => {
    let valid = true,
      message = "";
    const re = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!value) {
      valid = false;
      message = "Please enter your Email ID";
    } else if (!re.test(value)) {
      valid = false;
      message = "Please enter a valid Email ID";
    }

    return {
      valid,
      message
    };
  };
  const gtmPushAddToBag = () => {
    const categoryList = category;

    let subcategoryname = categoryList ? categoryList.split(" > ") : "";
    if (subcategoryname) {
      subcategoryname = subcategoryname[subcategoryname.length - 1];
    }
    const size = selectedSize?.size || "";
    const cat1 = categoryList?.[0]?.split(">");
    const cat2 = categoryList?.[1]?.split(">");

    const L1 = cat1?.[0]?.trim();

    const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

    const L3 = cat2?.[2]
      ? cat2?.[2]?.trim()
      : categoryList?.[2]?.split(">")?.[2]?.trim();
    const clickType = localStorage.getItem("clickType");

    const category5 = (sliderImages || [])?.filter(ele => ele?.icon).length
      ? "3d"
      : "non 3d";
    const view3dValue = sliderImages.filter(ele => ele?.icon).length
      ? "View3d"
      : "nonView3d";
    const userConsent = CookieService.getCookie("consent").split(",");
    const search = CookieService.getCookie("search") || "";
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        "Event Category": "GA Ecommerce",
        "Event Action": "Add to Cart",
        "Event Label": subcategoryname,
        "Time Stamp": new Date().toISOString(),
        "Cart Source": location.href,
        "Product Category": categoryList,
        "Login Status": isLoggedIn ? "logged in" : "logged out",
        "Product Name": title,
        "Product ID": selectedSize?.id,
        dimension8: view3dValue,
        Variant: size,
        dimension12: selectedSize?.color
      });
      dataLayer.push({
        event: "addToCart",
        ecommerce: {
          currencyCode: currency,
          add: {
            products: [
              {
                name: title,
                id: selectedSize?.sku || childAttributes[0].sku,
                price:
                  selectedSize?.discountedPriceRecords[currency] ||
                  selectedSize?.priceRecords[currency],
                brand: "Goodearth",
                category: category,
                variant: selectedSize?.size || childAttributes[0].size || "",
                quantity: quantity,
                dimension8: view3dValue,
                dimension12: selectedSize?.color
              }
            ]
          }
        }
      });
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "add_to_cart",
        previous_page_url: CookieService.getCookie("prevUrl"),
        ecommerce: {
          currency: currency,
          value: selectedSize?.discountedPriceRecords
            ? selectedSize?.discountedPriceRecords[currency]
            : selectedSize?.priceRecords
            ? selectedSize?.priceRecords[currency]
            : null,
          items: [
            {
              item_id: selectedSize?.sku || childAttributes[0].sku, //Pass the product id
              item_name: title, // Pass the product name
              affiliation: title, // Pass the product name
              coupon: "NA", // Pass the coupon if available
              currency: currency, // Pass the currency code
              discount:
                isSale && selectedSize?.discountedPriceRecords[currency]
                  ? badgeType == "B_flat"
                    ? selectedSize.discountedPriceRecords[currency]
                    : selectedSize.priceRecords[currency] -
                      selectedSize.discountedPriceRecords[currency]
                  : "NA", // Pass the discount amount
              index: "NA",
              item_brand: "Goodearth",
              item_category: L1,
              item_category2: L2,
              item_category3: L3,
              item_category4: "NA",
              item_category5: category5,
              item_list_id: "NA", //pass the item list id
              item_list_name: search ? `${clickType}-${search}` : "NA",
              item_variant: selectedSize?.size || "",
              // item_category4: l1, //pass the L1,
              // item_category5: collection,
              price: selectedSize?.priceRecords[currency],
              quantity: quantity,
              // dimension12: selectedSize?.color,
              collection_category: isArray(collections)
                ? collections?.join("|")
                : collections,
              price_range: "NA",
              atc_location: list || "NA"
            }
          ]
        }
      });
    }
  };

  const addToBasket = async () => {
    if (selectedSize) {
      setShowLoader(true);
      BasketService.addToBasket(dispatch, selectedSize.id, quantity)
        .then(() => {
          showGrowlMessage(
            dispatch,
            MESSAGE.ADD_TO_BAG_SUCCESS,
            3000,
            "ADD_TO_BAG_SUCCESS"
          );
          gtmPushAddToBag();
          closeModal();
          if (!history.location.pathname.includes("shared-wishlist")) {
            WishlistService.removeFromWishlist(
              dispatch,
              // selectedSize.id,
              productDataId,
              undefined,
              isLoggedIn ? listName : undefined
              // sortBy,
              // selectedSize.size
            );
            // WishlistService.countWishlist(dispatch);
          }
        })
        .catch(err => {
          if (typeof err?.response?.data != "object") {
            showGrowlMessage(dispatch, err?.response?.data);
            errorTracking([err?.response?.data], window.location.href);
          }
        })
        .finally(() => {
          setShowLoader(false);
        });
    } else {
      // setSizeErrorMsg("Please select a Size to proceed");
      errorTracking(["Please select a Size to proceed"], location.href);
    }
  };

  const onNotifyClick = async () => {
    const { valid, message } = validator(email);
    setMsg("");
    if (!valid) {
      setEmailError(message);
      errorTracking([message], location.href);
    } else {
      if (selectedSize) {
        const { successful, message } = await ProductService.notifyMe(
          dispatch,
          selectedSize.id,
          email
        );
        if (!successful) {
          setEmailError(message);
          errorTracking([message], location.href);
        } else {
          setMsg(message);
          // util.errorTracking([message], location.href);
          basketLineId && onNotifyCart?.(basketLineId);
        }
      } else {
        // setSizeErrorMsg("Please select a Size to proceed");
        errorTracking(["Please select a size to continue"], location.href);
      }
      // trigger event on click of Notify Me CTA
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "notify_me",
          click_type: productTitle,
          cta_name: selectedSize ? selectedSize.size : "NA"
        });
      }
    }
  };

  window.onpopstate = () => {
    closeModal();
  };

  const sizeSelectClick = () => {
    setSizeerror(true);
  };

  const Pdpbutton = useMemo(() => {
    let buttonText: string, action: EventHandler<MouseEvent>;
    let allOutOfStock = true;
    childAttributes.forEach(({ stock }) => {
      if (stock > 0) {
        allOutOfStock = false;
      }
    });

    if (!selectedSize && childAttributes.length > 1) {
      buttonText = "Select Size";
      action = sizeSelectClick;
    } else if (allOutOfStock || (selectedSize && selectedSize.stock == 0)) {
      buttonText = "Notify Me";
      action = onNotifyClick;
    } else {
      buttonText = "Add to Bag";
      action = addToBasket;
    }
    if (msg == "Notify me request accepted successfully.") {
      buttonText = "NOTIFICATION REQUEST RECEIVED!";
      action = () => {
        return undefined;
      };
    }
    return (
      <PdpButton
        label={buttonText}
        onClick={action}
        className={cs(styles.button)}
        variant="largeAquaCta"
      />
    );
  }, [selectedSize, email, quantity, msg]);

  useEffect(() => {
    setMsg("");
    setEmailError("");
    // setSizeErrorMsg("");
  }, [selectedSize]);

  const sizeExists = childAttributes[0].size;
  let allOutOfStock = true;

  childAttributes.forEach(({ stock }) => {
    if (stock > 0) {
      allOutOfStock = false;
    }
  });
  return (
    <div className={cs(styles.container, { [styles.mobile]: mobile })}>
      <div className={styles.header}>
        <CloseButton className={styles.closeBtn} />
      </div>
      {/* {msg && <div className={styles.successMsg}>{msg}</div>} */}
      <div className={styles.contentContainer}>
        <div className={styles.infoContainer}>
          <div className={styles.detailsContainer}>
            <div className={styles.collection}>{collection}</div>
            <div className={styles.title}>{productTitle}</div>
            {subtitle && (
              <p className={styles.subtitle}>({subtitle.split(")")[0]})</p>
            )}
          </div>
          <div className={styles.price}>
            <p className={cs(styles.productN)}>
              {isSale && discount ? (
                <>
                  {currency === "INR" && (
                    <span
                      className={cs(
                        styles.mrp
                        // {
                        //   [globalStyles.gold]:
                        //     badgeType == "B_flat" || (isSale && discount)
                        // }
                      )}
                    >
                      MRP.
                    </span>
                  )}
                  <span className={styles.discountprice}>
                    {selectedSize
                      ? displayPriceWithCommas(
                          selectedSize.discountedPriceRecords[currency],
                          currency
                        )
                      : displayPriceWithCommas(discountedPrice || "", currency)}
                  </span>
                  {currency === "INR" && !(isSale && discount) && (
                    <p className={styles.incTax}>(Incl. of all taxes)</p>
                  )}
                </>
              ) : (
                ""
              )}
              {isSale && discount ? (
                <span className={styles.strikeprice}>
                  {selectedSize
                    ? displayPriceWithCommas(
                        selectedSize.priceRecords[currency],
                        currency
                      )
                    : displayPriceWithCommas(price, currency)}
                </span>
              ) : (
                <>
                  {currency === "INR" && (
                    <span
                      className={cs(
                        styles.mrp
                        // {
                        //   [globalStyles.gold]:
                        //     badgeType == "B_flat" || (isSale && discount)
                        // }
                      )}
                    >
                      MRP.
                    </span>
                  )}
                  <span
                    className={badgeType == "B_flat" ? styles.flatPrice : ""}
                  >
                    {selectedSize
                      ? displayPriceWithCommas(
                          selectedSize.priceRecords[currency],
                          currency
                        )
                      : displayPriceWithCommas(price, currency)}
                  </span>
                </>
              )}
            </p>
            {currency === "INR" && (
              <p className={styles.incTax}>(Incl. of all taxes)</p>
            )}
          </div>
        </div>
        {badge_text && (
          <div
            className={cs(
              globalStyles.badgeContainer,
              globalStyles.grey,
              globalStyles.marginT10
            )}
          >
            {badge_text}
          </div>
        )}
        <div className={styles.sizeContainer}>
          {sizeExists ? (
            <>
              <div className={cs(styles.label, styles.sizeLabel)}> SIZE</div>
              <div>
                <SizeSelector
                  sizes={childAttributes}
                  onChange={onSizeSelect}
                  sizeClassName={styles.sizeBox}
                  selected={selectedSize ? selectedSize.id : undefined}
                  containerClassName={styles.sizesBox}
                />
                {sizeerror && (
                  <p className={styles.sizeError}>
                    Please select a size to continue
                  </p>
                )}
                {isSale &&
                  selectedSize &&
                  selectedSize.stock > 0 &&
                  selectedSize.showStockThreshold && (
                    <span className={styles.sizeError}>
                      Only {selectedSize.stock} Left!
                    </span>
                  )}
              </div>
            </>
          ) : (
            <span className={cs(styles.sizeError)}>
              {isSale &&
                selectedSize &&
                selectedSize.stock > 0 &&
                selectedSize.showStockThreshold &&
                `Only ${selectedSize.stock} Left!`}
            </span>
          )}
        </div>

        {showQty || (selectedSize && selectedSize.stock != 0) ? (
          <div className={styles.quantityContainer}>
            <div className={cs(styles.label, styles.qtyLabel)}> QUANTITY</div>
            <div className={styles.qtyContainer}>
              <PdpQuantity
                source="notifyme"
                id={selectedSize ? selectedSize.id : 0}
                minValue={minQuantity}
                maxValue={maxQuantity}
                currentValue={quantity}
                onChange={onQuantityChange}
                // errorMsg={selectedSize ? "Available qty in stock is" : ""}
                disabled={(selectedSize && selectedSize.stock == 0) || false}
                className={styles.quantityWrapper}
                errorMsgClass={styles.sizeError}
                inputClass={styles.inputQuantity}
              />
            </div>
          </div>
        ) : null}
        <div className={styles.inputContainer}>
          {((selectedSize && selectedSize.stock === 0) || allOutOfStock) && (
            <div
              className={cs(
                styles.emailInput,
                globalStyles.textLeft,
                styles.applyFont
              )}
            >
              <InputField
                id="width"
                value={email}
                onChange={onEmailChange}
                validator={validator}
                className="notify-me-email-input"
                label="Email ID"
                placeholder="Email Address"
                errorMsg={emailError}
                disabled={userExists}
              />
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>{Pdpbutton}</div>
      </div>
      {showLoader && <Loader />}
    </div>
  );
};

export default NotifyMePopup;
