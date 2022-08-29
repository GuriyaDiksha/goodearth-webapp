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
import { currencyCodes } from "constants/currency";
import { ProductID } from "typings/id";
import * as util from "utils/validate";
import Loader from "components/Loader";
import { AppState } from "reducers/typings";
import CookieService from "../../services/cookie";

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
  sortBy?: string;
  list?: string;
  sliderImages: { icon: boolean }[];
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
  sortBy,
  list,
  sliderImages
}) => {
  const { dispatch } = useStore();

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
  const onSizeSelect = useCallback(
    selected => {
      setSelectedSize(selected);
      setQuantity(1);

      changeSize?.(selected.size);
      setSizeerror(false);
    },
    [childAttributes, selectedSize]
  );
  useEffect(() => {
    const inStockSizes = childAttributes.filter(child => child.stock > 0);
    if (inStockSizes.length == 1 && !selectedSize) {
      setSelectedSize(inStockSizes[0]);
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
      message = "This field is required";
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
    const arr = category?.split(">");
    const l1 = arr?.[arr.length - 3];
    const category3 = (sliderImages || [])?.filter(ele => ele?.icon).length
      ? "3d"
      : "non 3d";
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes("GA-Calls")) {
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
        Variant: size
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
                quantity: quantity
              }
            ]
          }
        }
      });
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          items: [
            {
              item_id: selectedSize?.sku || childAttributes[0].sku, //Pass the product id
              item_name: title, // Pass the product name
              affiliation: title, // Pass the product name
              coupon: "", // Pass the coupon if available
              currency: currency, // Pass the currency code
              discount: discount, // Pass the discount amount
              index: "",
              item_brand: "Goodearth",
              item_category: category,
              item_category2: selectedSize?.size, //pass the item category2 ex.Size
              item_category3: category3, //pass the product type 3d or non 3d
              item_list_id: "", //pass the item list id
              item_list_name: "", //pass the item list name ex.search results
              item_variant: selectedSize?.size || "",
              item_category4: l1, //pass the L1
              item_category5: collection,
              price:
                selectedSize?.discountedPriceRecords[currency] ||
                selectedSize?.priceRecords[currency],
              quantity: quantity
            }
          ]
        }
      });
    }
  };

  const addToBasket = async () => {
    if (selectedSize) {
      WishlistService.removeFromWishlist(
        dispatch,
        selectedSize.id,
        undefined,
        sortBy,
        selectedSize.size
      );
      setShowLoader(true);
      BasketService.addToBasket(dispatch, selectedSize.id, quantity)
        .then(() => {
          util.showGrowlMessage(
            dispatch,
            MESSAGE.ADD_TO_BAG_SUCCESS,
            3000,
            "ADD_TO_BAG_SUCCESS"
          );
          gtmPushAddToBag();
          closeModal();
        })
        .catch(err => {
          if (typeof err.response.data != "object") {
            util.showGrowlMessage(dispatch, err.response.data);
            util.errorTracking([err.response.data], window.location.href);
          }
        })
        .finally(() => {
          setShowLoader(false);
        });
    } else {
      // setSizeErrorMsg("Please select a Size to proceed");
      util.errorTracking(["Please select a Size to proceed"], location.href);
    }
  };

  const onNotifyClick = async () => {
    const { valid, message } = validator(email);
    setMsg("");
    if (!valid) {
      setEmailError(message);
      util.errorTracking([message], location.href);
    } else {
      if (selectedSize) {
        const { successful, message } = await ProductService.notifyMe(
          dispatch,
          selectedSize.id,
          email
        );
        if (!successful) {
          setEmailError(message);
          util.errorTracking([message], location.href);
        } else {
          setMsg(message);
          // util.errorTracking([message], location.href);
          basketLineId && onNotifyCart?.(basketLineId);
        }
      } else {
        // setSizeErrorMsg("Please select a Size to proceed");
        util.errorTracking(["Please select a Size to proceed"], location.href);
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
            <p className={styles.productN}>
              {isSale && discount ? (
                <span className={styles.discountprice}>
                  {String.fromCharCode(...currencyCodes[currency])}&nbsp;
                  {selectedSize
                    ? selectedSize.discountedPriceRecords[currency]
                    : discountedPrice}
                  &nbsp;{" "}
                </span>
              ) : (
                ""
              )}
              {isSale && discount ? (
                <span className={styles.strikeprice}>
                  {String.fromCharCode(...currencyCodes[currency])}&nbsp;
                  {selectedSize ? selectedSize.priceRecords[currency] : price}
                </span>
              ) : (
                <span
                  className={badgeType == "B_flat" ? globalStyles.cerise : ""}
                >
                  {String.fromCharCode(...currencyCodes[currency])}&nbsp;
                  {selectedSize ? selectedSize.priceRecords[currency] : price}
                </span>
              )}
            </p>
          </div>
        </div>
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
                    Please select a size to proceed
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
        <div className={styles.inputContainer}>
          {((selectedSize && selectedSize.stock === 0) || allOutOfStock) && (
            <div className={cs(styles.emailInput, globalStyles.textLeft)}>
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
