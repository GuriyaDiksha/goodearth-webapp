import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  EventHandler,
  MouseEvent,
  useEffect,
  useLayoutEffect,
  Fragment
} from "react";
import { Link } from "react-router-dom";
import cs from "classnames";
import { useStore, useSelector } from "react-redux";
// components
import PdpQuantity from "components/quantity/pdpQuantity";
import SizeSelector from "components/SizeSelector";
import PdpButton from "components/Button/pdpButton";
import Share from "components/Share";
// import Accordion from "components/Accordion";
import WishlistButtonpdp from "components/WishlistButton/wishlistButtonpdp";
import WishlistButton from "components/WishlistButton";

import ColorSelector from "components/ColorSelector";
import ReactHtmlParser from "react-html-parser";
import Loader from "components/Loader";
import throttle from "lodash/throttle";
// services
import BasketService from "services/basket";
import BridalService from "services/bridal";
import ProductService from "services/product";
import HeaderService from "services/headerFooter";
import CookieService from "../../../../services/cookie";
// typings
import { Props } from "./typings";
import {
  ChildProductAttributes,
  GroupedProductItem,
  PartialProductItem,
  Product
} from "typings/product";
// constants
import { currencyCodes } from "constants/currency";
// styles
import iconStyles from "../../../../styles/iconFonts.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import ModalStyles from "components/Modal/styles.scss";
import {
  updateSizeChartData,
  updateSizeChartSelected,
  updateSizeChartShow,
  updateSizeChartSizes,
  updateStoreState
} from "actions/header";
import { MESSAGE } from "constants/messages";
import { useLocation, useHistory } from "react-router";
import { AppState } from "reducers/typings";
import PdpCustomerCareInfo from "components/CustomerCareInfo/pdpCustomerCare";
import { updateProduct } from "actions/product";
import {
  updatefillerProduct,
  updateshowFiller,
  updateButtonData
} from "actions/filler";
import { showGrowlMessage, errorTracking } from "utils/validate";
import { POPUP } from "constants/components";
import asset from "images/asset.svg";
import offer from "images/offer.svg";
import inshop from "../../../../images/inShop.svg";
import legal from "../../../../images/legal.svg";
import { updateQuickviewId } from "../../../../actions/quickview";
import Accordion from "components/Accordion";
import PdpSkeleton from "../pdpSkeleton";
import { isEmpty } from "lodash";
import { GA_CALLS } from "constants/cookieConsent";
import { displayPriceWithCommas } from "utils/utility";
import addReg from "../../../../images/registery/addReg.svg";
import addedReg from "../../../../images/registery/addedReg.svg";
import ShareProductPopup from "../sharePopup";
import share from "../../../../images/sharePdp/share.svg";
import close from "../../../../images/sharePdp/close.svg";
import CreateWishlist from "components/WishlistButton/CreateWishlist";
import { updateComponent, updateModal } from "actions/modal";
import WishlistService from "services/wishlist";
import { updateLoader } from "actions/info";
import { useRef } from "react";
import { childAttributes } from "containers/myAccount/components/Bridal/typings";

const ProductDetails: React.FC<Props> = ({
  data: {
    id,
    title,
    details,
    collection,
    collectionUrl,
    images = [],
    discount,
    discountedPriceRecords,
    priceRecords,
    childAttributes,
    sizeChartHtml,
    categories,
    loyaltyDisabled,
    shipping,
    compAndCare,
    manufactureInfo,
    sku,
    url,
    gaVariant,
    groupedProducts,
    salesBadgeImage,
    fillerMessage,
    complianceLine,
    fillerUrl,
    justAddedBadge,
    badgeType,
    invisibleFields,
    partner,
    sizeChart,
    badgeMessage,
    fillerProduct,
    shortDesc,
    sliderImages,
    collections,
    badge_text,
    freeProductText
  },
  data,
  corporatePDP,
  mobile,
  tablet,
  currency,
  isQuickview,
  changeModalState,
  updateComponentModal,
  closeModal,
  toggelHeader,
  source,
  showAddToBagMobile,
  loading,
  setPDPButton
}): JSX.Element => {
  const [isShare, setIsShare] = useState(false);
  const [productTitle] = title.split("(");
  const {
    info,
    user: { bridalId, bridalCurrency }
  } = useSelector((state: AppState) => state);
  // const [img] = images;
  const store = useStore();
  const { dispatch } = useStore();
  const location = useLocation();
  const history = useHistory();
  const [gtmListType, setGtmListType] = useState("");
  const [onload, setOnload] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [
    selectedSize,
    setSelectedSize
  ] = useState<ChildProductAttributes | null>(
    childAttributes.length === 1 ? childAttributes[0] : null
  );
  const { items } = useSelector((state: AppState) => state.wishlist);

  const [isRegistry, setIsRegistry] = useState<{ [x: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  // const items = basket.lineItems?.map(
  //   item => item.product.childAttributes[0].id
  // );
  const [addedToBag, setAddedToBag] = useState(false);
  const [addedFillerToBag, setAddedFillerToBag] = useState(false);
  const [apiTrigger, setApiTrigger] = useState(false);
  const [isStockset, setIsStockset] = useState(false);
  const [pdpLoader, setPdpLoader] = useState(true);
  const isLoggedIn = useSelector((state: AppState) => state.user.isLoggedIn);
  const slab = useSelector((state: AppState) => state.user.slab);
  const isCeriseUser =
    slab.toLowerCase() === "cerise" ||
    slab.toLowerCase() === "cerise sitara" ||
    slab.toLowerCase() === "cerise club";

  const canUseDOM = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
  const selectedId = useSelector(
    (state: AppState) => state.header.sizeChartData.selected
  );

  const ele: any =
    typeof document == "object" &&
    document.getElementsByClassName(
      "src-containers-pdp-_styles_product-section"
    );

  if (pdpLoader && ele[0] && mobile) {
    ele[0].style.zIndex = 5;
  } else if (ele[0] && mobile) {
    ele[0].style.zIndex = 6;
  }

  const isPDP =
    history.location.pathname.includes("/catalogue/") &&
    !history.location.pathname.includes("/catalogue/category");
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setGtmListType("PDP");
    setOnload(true);
  });

  useEffect(() => {
    let count = 0;
    let tempSize: ChildProductAttributes | undefined;

    if (childAttributes.length === 1 && !selectedSize) {
      setSelectedSize(childAttributes[0]);
      dispatch(updateSizeChartSelected(childAttributes[0].id));
    }
    if (childAttributes.length > 0) {
      const registryMapping = {};
      childAttributes.map(child => {
        registryMapping[child.size] = child.isBridalProduct;
        if (child.stock > 0) {
          count++;
          tempSize = child;
        }
      });
      if (tempSize && count == 1 && !isStockset) {
        setSelectedSize(tempSize);
        dispatch(updateSizeChartSelected(tempSize.id));
        setIsStockset(true);
      }

      setIsRegistry(registryMapping);
    }
    dispatch(
      updateSizeChartSizes({
        sizes: childAttributes,
        isCorporatePDP: corporatePDP
      })
    );
  }, [childAttributes, selectedSize]);

  useEffect(() => {
    const falsyValues = ["", [], false, 0];
    const isFalsyData = Object.values(data)?.every(
      x =>
        falsyValues.includes(x) ||
        Object.values(data["priceRecords"])?.every(val => val === -1) ||
        Object.values(data["discountedPriceRecords"])?.every(val => val === -1)
    );
    if (!isEmpty(data) && !isFalsyData) {
      setPdpLoader(false);
    }

    return () => {
      dispatch(updateSizeChartSelected(undefined));
    };
  }, []);

  useEffect(() => {
    if (!selectedSize || selectedSize.id != selectedId) {
      const size = childAttributes.filter(child => child.id == selectedId)[0];
      setSelectedSize(size);
    }
  }, [selectedId]);

  useEffect(() => {
    if (childAttributes.length === 1) {
      setSelectedSize(childAttributes[0]);
      dispatch(updateSizeChartSelected(childAttributes[0].id));
    } else if (selectedSize) {
      const newSize = childAttributes.filter(
        child => child.id == selectedSize.id
      )[0];
      setSelectedSize(newSize);
      dispatch(updateSizeChartSelected(newSize.id));
    }
  }, [discountedPriceRecords]);

  useEffect(() => {
    if (priceRecords[currency] == 0) {
      history.push("/error-page", {});
    }
  }, [currency, priceRecords[currency]]);

  const price = corporatePDP
    ? priceRecords[currency]
    : selectedSize && selectedSize.priceRecords
    ? selectedSize.priceRecords[currency]
    : priceRecords[currency];
  const discountPrices =
    selectedSize && selectedSize.discountedPriceRecords
      ? selectedSize.discountedPriceRecords[currency]
      : discountedPriceRecords[currency];

  const [sizeError, setSizeError] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  const showError = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        "show-error"
      )[0] as HTMLDivElement;
      if (firstErrorField) {
        // firstErrorField.focus();
        // mobile &&
        firstErrorField.scrollIntoView({
          block: "center",
          behavior: "smooth"
        });
      }
    }, 0);
  };

  useEffect(() => {
    if (corporatePDP) {
      // setQuantity(10);
    } else {
      setQuantity(1);
    }
  }, [corporatePDP]);

  const onSizeSelect = useCallback(
    selected => {
      setSelectedSize(selected);
      if (selectedSize?.id !== selected.id) {
        setQuantity(1);
      }
      setSizeError("");
      dispatch(updateSizeChartSelected(selected.id));
    },
    [id, childAttributes, selectedSize]
  );

  const minQuantity = 1;
  const maxQuantity = selectedSize ? selectedSize.stock : 1;

  const onQuantityChange = useCallback(
    value => {
      if (selectedSize) {
        setQuantity(value);
        setSizeError("");
      } else {
        setSizeError("Please select a size to continue");
      }
    },
    [selectedSize]
  );

  const onSizeChartClick = () => {
    if (sizeChart || sizeChart != "") {
      dispatch(updateSizeChartData(sizeChart));
      dispatch(updateSizeChartShow(true));
    }
  };

  const [childAttr] = childAttributes;
  const { size = "" } = childAttr || {};
  const [height, width] = size.match(/[0-9.]+/gim) || [];
  const onWallpaperClick = useCallback(() => {
    updateComponentModal(
      POPUP.WALLPAPERPOPUP,
      {
        price: priceRecords[currency],
        currency: String.fromCharCode(...currencyCodes[currency])
      },
      undefined,
      mobile ? styles.wallpaperPopupBody : "",
      mobile ? styles.wallpaperPopupContainer : ""
    );
    changeModalState(true);
  }, [height, width, currency]);

  const accordionSections = useMemo(() => {
    const sections = [
      {
        header: "PRODUCT DETAILS",
        body: <div>{ReactHtmlParser(details)}</div>,
        id: "details"
      },
      {
        header: "Dimensions & Care",
        body: <div>{ReactHtmlParser(compAndCare)}</div>,
        id: "compAndCare"
      },
      {
        header: "Shipping & Handling",
        body: <div>{ReactHtmlParser(shipping)}</div>,
        id: "shippAndHandle"
      },
      {
        header: "Queries or Assistance",
        body: <div> {!isQuickview && <PdpCustomerCareInfo />} </div>,
        id: "queries"
      }
      // {
      //   header: "Share",
      //   body: (
      //     <div>
      //       {!isQuickview && (
      //         <Share
      //           mobile={mobile}
      //           link={`${__DOMAIN__}${location.pathname}`}
      //           mailSubject="Gifting Ideas"
      //           mailText={`${
      //             corporatePDP
      //               ? `Here's what I found, check it out on Good Earth's web boutique`
      //               : `Here's what I found! It reminded me of you, check it out on Good Earth's web boutique`
      //           } ${__DOMAIN__}${location.pathname}`}
      //         />
      //       )}
      //     </div>
      //   ),
      //   id: "share"
      // }
    ];
    if (manufactureInfo) {
      sections.push({
        header: "More Information",
        body: <div>{ReactHtmlParser(manufactureInfo)}</div>,
        id: "manufactureInfo"
      });
    }
    return sections;
  }, [details, compAndCare, shipping, manufactureInfo]);

  const handleScroll = () => {
    const banner = document.getElementById(
      "announcement_bar"
    ) as HTMLDivElement | null;
    const mainHeader = document.getElementById(
      "myHeader"
    ) as HTMLDivElement | null;

    if (mainHeader && banner) {
      const mainHeaderHeight = mainHeader.clientHeight;
      const bannerHeight = banner.clientHeight;
      const totalScroll = !mobile ? 430 : 840 + mainHeaderHeight + bannerHeight;
      window.scrollTo({ top: totalScroll, left: 0, behavior: "smooth" });
    }
  };

  const setSelectedSKU = () => {
    let currentSKU = sku;
    if (selectedSize) {
      currentSKU = selectedSize.sku;
    }
    return currentSKU;
  };
  const gtmPushAddToBag = () => {
    const index = categories.length - 1;
    let categoryname = "";
    let subcategoryname = "";
    let category = categories[index]
      ? categories[index].replace(/\s/g, "")
      : "";
    const arr = category.split(">");
    categoryname = arr[arr.length - 2];
    subcategoryname = arr[arr.length - 1];
    category = category.replace(/>/g, "/");
    const l1 = arr[arr.length - 3];
    const category5 = sliderImages.filter(ele => ele?.icon).length
      ? "3d"
      : "non 3d";

    const view3dValue = sliderImages.filter(ele => ele?.icon).length
      ? "View3d"
      : "nonView3d";

    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      Moengage.track_event("add_to_cart", {
        "Product id": sku || childAttributes[0].sku,
        "Product name": title,
        quantity: quantity,
        price: +price,
        Currency: currency,
        "Collection name": collection,
        "Category name": categoryname,
        "Sub Category Name": subcategoryname,
        Size: selectedSize?.size
      });
    }

    const categoryList = categories
      ? categories.length > 0
        ? categories[categories.length - 1].replace(/>/g, "-")
        : ""
      : "";
    let subcategory = categoryList ? categoryList.split(" > ") : "";
    if (subcategory) {
      subcategory = subcategory[subcategory.length - 1];
    }

    const cat1 = categories?.[0]?.split(">");
    const cat2 = categories?.[1]?.split(">");

    const L1 = cat1?.[0]?.trim();

    const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();

    const L3 = cat2?.[2]
      ? cat2?.[2]?.trim()
      : data.categories?.[2]?.split(">")?.[2]?.trim();

    const clickType = localStorage.getItem("clickType");
    const size = selectedSize?.size || "";
    const search = CookieService.getCookie("search") || "";
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        "Event Category": "GA Ecommerce",
        "Event Action": "Add to Cart",
        "Event Label": subcategory,
        "Time Stamp": new Date().toISOString(),
        "Cart Source": window.location.href,
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
                id: setSelectedSKU(),
                price: discountPrices || price,
                brand: "Goodearth",
                category: category,
                variant: selectedSize?.size || "",
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
          value: discountedPriceRecords[currency]
            ? discountedPriceRecords[currency]
            : price
            ? price
            : null,
          items: [
            {
              item_id: setSelectedSKU(), //Pass the product id
              item_name: title, // Pass the product name
              affiliation: title, // Pass the product name
              coupon: "NA", // Pass the coupon if available
              currency: currency, // Pass the currency code
              discount:
                info.isSale && discount
                  ? data?.badgeType == "B_flat"
                    ? discountPrices
                    : price - discountPrices
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
              price: discountPrices || price,
              quantity: quantity,
              // dimension12: selectedSize?.color,
              collection_category: collections?.join("|"),
              price_range: "NA",
              atc_location: source?.toLowerCase()
            }
          ]
        }
      });
    }
  };

  //For closing zoom popup
  const closeZoomModal = () => {
    if (document?.getElementById("zoomPopup") as HTMLElement) {
      changeModalState(false);
      if (
        typeof document == "object" &&
        (document?.getElementById("modal-fullscreen") as HTMLElement) &&
        mobile
      ) {
        (document.getElementById(
          "modal-fullscreen"
        ) as HTMLElement).style.height = "calc(100% - 55px)";
      }
      if (document?.getElementById("modal-fullscreen-container") && mobile) {
        (document.getElementById(
          "modal-fullscreen-container"
        ) as HTMLElement).style.height = "calc(100% - 55px)";
      }

      document.body.classList.remove(globalStyles.fixed);
    }
  };

  const addToBasket = () => {
    if (!selectedSize) {
      setSizeError("Please select a size to continue");
      errorTracking(["Please select a size to continue"], window.location.href);
      showError();
      closeZoomModal();
    } else {
      setApiTrigger(true);
      BasketService.addToBasket(dispatch, selectedSize.id, quantity)
        .then(() => {
          setApiTrigger(false);
          setAddedToBag(true);
          setTimeout(() => {
            setAddedToBag(false);
            closeModal ? closeModal() : null;
          }, 3000);
          showGrowlMessage(dispatch, MESSAGE.ADD_TO_BAG_SUCCESS);
          gtmPushAddToBag();
          closeZoomModal();
        })
        .catch(err => {
          closeZoomModal();
          setApiTrigger(false);
          if (typeof err.response.data != "object") {
            showGrowlMessage(dispatch, err.response.data);
            errorTracking([err.response.data], window.location.href);
          }
        });
    }
  };

  const checkAvailability = () => {
    if (!selectedSize) {
      setSizeError("Please select a size to continue");
      errorTracking(["Please select a size to continue"], window.location.href);
      showError();
    } else {
      setIsLoading(true);
      HeaderService.checkShopAvailability(dispatch, selectedSize.sku)
        .then(() => {
          setIsLoading(false);
          dispatch(updateStoreState(true));
        })
        .catch(err => {
          setIsLoading(false);
          if (typeof err.response.data != "object") {
            showGrowlMessage(dispatch, err.response.data);
            errorTracking([err.response.data], window.location.href);
          }
        });
    }
    // trigger event on click of check-in shop availability
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "shop_availability_click"
      });
    }
  };

  const addToRegistry = (event: React.MouseEvent) => {
    const formData: {
      productId: number;
      bridalProfileId: number;
      qtyRequested: number;
    } = {
      productId: 0,
      bridalProfileId: 0,
      qtyRequested: 0
    };
    let productId = -1;
    const element = event.currentTarget as HTMLElement;
    if (
      element.classList.contains(styles.active) ||
      (selectedSize && isRegistry[selectedSize.size])
    ) {
      showGrowlMessage(dispatch, MESSAGE.ADD_TO_REGISTRY_AGAIN);
      setTimeout(() => {
        closeModal ? closeModal() : null;
      }, 3000);
      return false;
    }
    if (childAttributes[0].size) {
      if (!selectedSize) {
        setSizeError("Please select a size to continue");
        showError();
        return false;
      }
      childAttributes.map(child => {
        if (selectedSize.size == child.size) {
          productId = child.id;
        }
      });
    } else {
      productId = childAttributes[0].id;
    }

    formData["productId"] = productId;
    formData["bridalProfileId"] = bridalId;
    formData["qtyRequested"] = quantity;
    BridalService.addToRegistry(dispatch, formData)
      .then(res => {
        {
          bridalId !== 0 && BridalService.countBridal(dispatch, bridalId);
        }
        showGrowlMessage(dispatch, MESSAGE.ADD_TO_REGISTRY_SUCCESS);
        setTimeout(() => {
          closeModal ? closeModal() : null;
        }, 3000);
        const registry = Object.assign({}, isRegistry);
        const userConsent = CookieService.getCookie("consent").split(",");
        if (userConsent.includes(GA_CALLS)) {
          dataLayer.push({
            event: "registry",
            "Event Category": "Registry",
            "Event Action": "Product added",
            // 'Event Label': bridalItem,
            "Product Name": productTitle,
            "Product ID": productId,
            Variant: selectedSize?.size
          });

          dataLayer.push({
            event: "add_to_registry",
            click_type: productTitle
          });
        }

        if (selectedSize) {
          registry[selectedSize.size] = true;
          setIsRegistry(registry);
        }
        if (productId) {
          ProductService.fetchProductDetails(dispatch, productId).then(
            product => {
              dispatch(
                updateProduct({ ...product, partial: false } as Product<
                  PartialProductItem
                >)
              );
            }
          );
        }
      })
      .catch(err => {
        const message = err.response.data.message;
        if (message) {
          showGrowlMessage(dispatch, message);
        } else {
          showGrowlMessage(dispatch, MESSAGE.ADD_TO_REGISTRY_FAIL);
        }
      });
    event.stopPropagation();
  };

  const onEnquireClick = () => {
    const selectdata = childAttributes.filter(data => {
      return data.size == selectedSize?.size;
    })[0];
    closeZoomModal();

    updateComponentModal(
      // <CorporateEnquiryPopup id={id} quantity={quantity} />,
      POPUP.THIRDPARTYENQUIRYPOPUP,
      {
        partner: partner,
        id: selectdata ? selectdata.id : id,
        quantity: quantity,
        size: selectedSize?.size
      },
      mobile ? true : false,
      mobile ? ModalStyles.bottomAlign : undefined
    );
    changeModalState(true);
  };

  const notifyMeClick = () => {
    // // add GA event on click of Notify Me CTA
    // const userConsent = CookieService.getCookie("consent").split(",");
    // if (userConsent.includes(GA_CALLS)) {
    //   dataLayer.push({
    //     event: "notify_me",
    //     click_type: title,
    //     click_url: `${location.pathname}${location.search}`
    //   });
    // }

    let selectedIndex = undefined;

    childAttributes.map((v, i) => {
      if (v.id === selectedSize?.id) {
        selectedIndex = i;
      }
    });
    const index = categories.length - 1;
    let category = categories[index]
      ? categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");

    closeZoomModal();

    updateComponentModal(
      POPUP.NOTIFYMEPOPUP,
      {
        collection: collection,
        category: category,
        price: priceRecords[currency],
        currency: currency,
        childAttributes: childAttributes,
        title: title,
        selectedIndex: selectedIndex,
        discount: discount,
        badgeType: badgeType,
        isSale: info.isSale,
        discountedPrice: discountPrices,
        list: isQuickview ? "quickview" : "pdp",
        sliderImages: sliderImages,
        collections: collections,
        badge_text: badge_text
      },
      false,
      mobile ? ModalStyles.bottomAlignSlideUp : "",
      mobile ? "slide-up-bottom-align" : ""
    );
    changeModalState(true);
  };

  let allOutOfStock = true;
  childAttributes.forEach(({ stock }) => {
    if (stock > 0) {
      allOutOfStock = false;
    }
  });

  const fillernotifyMeClick = () => {
    const {
      childAttributes,
      categories,
      collection,
      priceRecords,
      title,
      discount,
      badgeType,
      discountedPriceRecords,
      collections
    } = fillerProduct;

    let selectedIndex = undefined;
    childAttributes.map((v: childAttributes, i: number) => {
      if (v.id === fillerProduct?.id) {
        selectedIndex = i;
      }
    });
    const index = categories.length - 1;
    let category = categories[index]
      ? categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");

    closeZoomModal();
    updateComponentModal(
      POPUP.NOTIFYMEPOPUP,
      {
        collection: collection,
        category: category,
        price: fillerProduct.priceRecords[currency],
        currency: currency,
        childAttributes: childAttributes,
        title: title,
        discount: discount,
        badgeType: badgeType,
        selectedIndex: selectedIndex,
        discountedPrice: discountPrices,
        list: "pdp",
        sliderImages: fillerProduct.plpSliderImages,
        collections: collections,
        badge_text: fillerProduct?.badge_text
      },
      false
      // ModalStyles.bottomAlign
    );
    changeModalState(true);
  };

  // Ensure that fillerProduct and childAttributes are properly defined

  let fillerOutOfStock = true;
  fillerProduct?.childAttributes?.forEach(({ stock }: { stock: number }) => {
    if (stock > 0) {
      fillerOutOfStock = false;
    }
  });
  // let fillerOutOfStock = true;
  // fillerProduct.childAttributes.forEach(({ stock }) => {
  //   if (stock > 0) {
  //     allOutOfStock = false;
  //   }
  // });

  const sizeSelectClick = () => {
    // setSizeerror(true);
    closeZoomModal();
    setSizeError("Please select a size to continue");
    showError();
  };

  const fillerSectionRef = useRef<HTMLDivElement | null>(null);
  const addFillerProductToBasket = () => {
    if (!selectedSize) {
      setSizeError("Please select a size for the filler product.");
      errorTracking(
        ["Please select a size for the filler product."],
        window.location.href
      );
      showError();
      closeZoomModal();
    } else {
      setApiTrigger(true);
      BasketService.addToBasket(dispatch, fillerProduct.id, quantity) // Assume `true` indicates it's a filler product
        .then(() => {
          setApiTrigger(false);
          setAddedFillerToBag(true);
          setTimeout(() => {
            setAddedFillerToBag(false);
            closeModal ? closeModal() : null;
          }, 3000);
          showGrowlMessage(dispatch, MESSAGE.ADD_TO_BAG_SUCCESS);
          gtmPushAddToBag();
          closeZoomModal();
        })
        .catch(err => {
          closeZoomModal();
          setApiTrigger(false);
          if (typeof err.response.data != "object") {
            showGrowlMessage(dispatch, err.response.data);
            errorTracking([err.response.data], window.location.href);
          }
        });
    }
  };

  const PdpFillerButton = useMemo(() => {
    let buttonText1: string, action: EventHandler<MouseEvent>;
    if (corporatePDP) {
      buttonText1 = "Enquire Now";
      action = apiTrigger || loading ? () => null : onEnquireClick;
      // setSizeerror(false);
    } else if (
      fillerOutOfStock ||
      (fillerProduct && fillerProduct.childAttributes.stock == 0)
    ) {
      buttonText1 = "Notify Me";
      action = apiTrigger || loading ? () => null : fillernotifyMeClick;
      // setSizeerror(false);
    } else if (!fillerProduct && fillerProduct.childAttributes.length > 1) {
      buttonText1 = "Select Size";
      action = apiTrigger || loading ? () => null : sizeSelectClick;
    } else {
      buttonText1 = addedFillerToBag ? "Added!" : "Add to Bag";
      action = addedFillerToBag
        ? () => null
        : apiTrigger || loading
        ? () => null
        : addFillerProductToBasket;
      // setSizeerror(false);
    }
    setPDPButton?.(
      <PdpButton
        label={buttonText1}
        onClick={action}
        variant={
          buttonText1 == "Notify Me" ? "smallLightGreyCta" : "smallWhiteCta"
        }
      />
    );
    if (setPDPButton) {
      dispatch(
        updateButtonData(
          <PdpButton
            label={buttonText1}
            onClick={action}
            variant={
              buttonText1 == "Notify Me" ? "smallLightGreyCta" : "smallWhiteCta"
            }
          />
        )
      );
    }

    return (
      <PdpButton
        label={buttonText1}
        onClick={action}
        variant={
          buttonText1 == "Notify Me" ? "smallLightGreyCta" : "smallWhiteCta"
        }
      />
    );
  }, [
    corporatePDP,
    selectedSize,
    addedFillerToBag,
    quantity,
    currency,
    discount,
    apiTrigger,
    loading
  ]);

  const Pdpbutton = useMemo(() => {
    let buttonText: string, action: EventHandler<MouseEvent>;
    if (corporatePDP) {
      buttonText = "Enquire Now";
      action = apiTrigger || loading ? () => null : onEnquireClick;
      // setSizeerror(false);
    } else if (allOutOfStock || (selectedSize && selectedSize.stock == 0)) {
      buttonText = "Notify Me";
      action = apiTrigger || loading ? () => null : notifyMeClick;
      // setSizeerror(false);
    } else if (!selectedSize && childAttributes.length > 1) {
      buttonText = "Select Size";
      action = apiTrigger || loading ? () => null : sizeSelectClick;
    } else {
      buttonText = addedToBag ? "Added!" : "Add to Bag";
      action = addedToBag
        ? () => null
        : apiTrigger || loading
        ? () => null
        : addToBasket;
      // setSizeerror(false);
    }
    setPDPButton?.(
      <PdpButton
        label={buttonText}
        onClick={action}
        variant={
          buttonText == "Notify Me" ? "mediumLightGreyCta" : "mediumAquaCta366"
        }
      />
    );
    if (setPDPButton) {
      dispatch(
        updateButtonData(
          <PdpButton
            label={buttonText}
            onClick={action}
            variant={
              buttonText == "Notify Me"
                ? "mediumLightGreyCta"
                : "mediumAquaCta366"
            }
          />
        )
      );
    }

    return (
      <PdpButton
        label={buttonText}
        onClick={action}
        variant={
          buttonText == "Notify Me" ? "mediumLightGreyCta" : "mediumAquaCta366"
        }
      />
    );
  }, [
    corporatePDP,
    selectedSize,
    addedToBag,
    quantity,
    currency,
    discount,
    apiTrigger,
    loading
  ]);

  // const yourElement:React.RefObject<HTMLDivElement> = createRef();

  const isInViewport = (offset = 0, yourElement: any) => {
    if (!yourElement) return false;
    const top = yourElement.getBoundingClientRect().top;
    return top + offset >= 0 && top - offset - 100 <= window.innerHeight;
  };

  const isBelowViewport = (yourElement: any) => {
    if (!yourElement) return false;
    const top = yourElement.getBoundingClientRect().top;
    return top > window.innerHeight;
  };

  const onScroll = throttle(() => {
    const addToBagBtn = document.getElementById("yourElement") || "";
    const footer = document.getElementById("footer-start") || "";
    const isAddToBagBtnVisible = isInViewport(-80, addToBagBtn) || false;
    const isFooterBelowViewPort = isBelowViewport(footer) || false;
    if (!isAddToBagBtnVisible && isFooterBelowViewPort) {
      if (!showDock) {
        setShowDock(true);
        toggelHeader && toggelHeader(false);
      }
    } else if (showDock) {
      setShowDock(false);
      toggelHeader && toggelHeader(true);
    }
  }, 800);

  useEffect(() => {
    document.addEventListener("scroll", onScroll, true);
    return () => document.removeEventListener("scroll", onScroll, true);
  });

  const showSize = useMemo(() => {
    let show = false;
    childAttributes.every(attr => {
      if (attr.size) {
        show = true;
        return false;
      }
      return false;
    });

    return show;
  }, [childAttributes]);
  const withBadge = images && images.length && images[0].badgeImagePdp;

  //For Current Product images in color variant array
  let currentProductColorObj: GroupedProductItem = {
    color: [""],
    images: images,
    title: "",
    url: "",
    id: 0
  };
  if (groupedProducts) {
    if (groupedProducts.length > 0) {
      if (childAttributes[0].color) {
        currentProductColorObj = {
          color: childAttributes[0].color,
          images: images,
          title: title,
          url: url,
          id: id
        };
      }
    }
  }

  const currentProductColorObjArr: GroupedProductItem[] = [
    currentProductColorObj
  ];

  const sharePopupToggle = () => {
    setIsShare(!isShare);
  };

  const sharePopupToggleMobile = () => {
    updateComponentModal(
      POPUP.SHAREPDPPOPUP,
      {
        corporatePDP: corporatePDP,
        productName: title,
        productUrl: url
      },
      false,
      mobile ? ModalStyles.bottomAlignSlideUp : "",
      mobile ? "slide-up-bottom-align" : ""
    );
    changeModalState(true);
  };

  const addToDefaultWishlist = () => {
    WishlistService.addToWishlist(
      store.dispatch,
      id,
      undefined,
      selectedSize ? selectedSize.size : undefined
    )
      .then(() => {
        const growlMsg = (
          <div>
            Your item has been saved to <b>Default List.</b>{" "}
            {isLoggedIn ? "Click here" : "Sign In"} to&nbsp;
            <Link
              className={globalStyles.underlineOffset}
              to="/wishlist"
              key="wishlist"
              style={{ textDecoration: "underline", pointerEvents: "all" }}
            >
              view & manage
            </Link>
            &nbsp;your lists.
          </div>
        );
        // gtmPushAddToWishlist(true);
        showGrowlMessage(dispatch, growlMsg);
      })
      .finally(() => {
        dispatch(updateLoader(false));
      });
  };

  // Callback function to handle data from the child Component - WislistButtonPdp
  const createWishlistPopupMobile = () => {
    if (items.length == 0) {
      addToDefaultWishlist();
    }
    closeZoomModal();
    updateComponentModal(
      POPUP.ADDREMOVEWISHLISTNAMEPOPUP,
      { id },
      false,
      mobile ? ModalStyles.bottomAlignSlideUp : "",
      mobile ? "slide-up-bottom-align" : ""
    );
    changeModalState(true);
  };

  const createWishlistPopup = (data: any) => {
    setIsWishlistOpen(data);
    if (items.length == 0) {
      addToDefaultWishlist();
    }
  };

  const hideWishlistPopup = () => {
    setIsWishlistOpen(false);
  };

  const collectionClick = (collectionName: string) => {
    closeModal ? closeModal : () => null;
    // trigger event on click of collection title
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "collection_click",
        click_type: collectionName
      });
    }
  };

  return (
    <Fragment>
      {/* {!mobile && !isQuickview && showDock && (
        <DockedPanel
          data={data}
          buttoncall={Pdpbutton}
          showPrice={invisibleFields && invisibleFields.indexOf("price") > -1}
          price={price}
          discountPrice={discountPrices}
        />
      )} */}
      {pdpLoader && !isQuickview ? (
        <PdpSkeleton />
      ) : (
        <div className={bootstrap.row}>
          <div
            className={cs(
              bootstrap.col11,
              bootstrap.colMd11,
              styles.sideContainer,
              { [styles.marginT0]: withBadge }
            )}
          >
            {(isLoading || loading) && <Loader />}
            <div className={cs(bootstrap.row)}>
              <div
                className={styles.shareCta}
                onClick={mobile ? sharePopupToggleMobile : sharePopupToggle}
              >
                <p>SHARE</p>
                {!isShare ? (
                  <img src={share} alt="share" />
                ) : (
                  <img src={close} alt="close" />
                )}
              </div>
              {isShare && !mobile && (
                <ShareProductPopup
                  corporatePDP={corporatePDP}
                  productName={title}
                  productUrl={url}
                />
              )}
              {images && images[0]?.badgeImagePdp && (
                <div className={cs(bootstrap.col12, styles.badgePadding)}>
                  <img
                    src={images[0]?.badgeImagePdp}
                    width="80px"
                    height="80px"
                    className={styles.badgeImg}
                  />
                </div>
              )}
              {/* {mobile && (
                <div className={cs(bootstrap.col12)}>
                  <Share
                    mobile={mobile}
                    link={`${__DOMAIN__}${location.pathname}`}
                    mailSubject="Gifting Ideas"
                    mailText={`${
                      corporatePDP
                        ? `Here's what I found, check it out on Good Earth's web boutique`
                        : `Here's what I found! It reminded me of you, check it out on Good Earth's web boutique`
                    } ${__DOMAIN__}${location.pathname}`}
                  />
                </div>
              )} */}
              {collection && (
                <div
                  className={cs(bootstrap.col12, styles.collectionHeader, {})}
                >
                  {collection && (
                    <Link
                      to={collectionUrl || "#"}
                      onClick={() => collectionClick(collection)}
                    >
                      {" "}
                      {collection}{" "}
                    </Link>
                  )}
                </div>
              )}
              <div
                className={cs(
                  // isQuickview || mobile ? bootstrap.col7 : bootstrap.col7,
                  // isQuickview || mobile ? bootstrap.colMd7 : bootstrap.colMd7,
                  styles.title
                )}
              >
                {title}
                {shortDesc && <p>{shortDesc}</p>}
                {badge_text && (
                  <div
                    className={cs(
                      globalStyles.badgeContainer,
                      globalStyles.grey,
                      styles.badgeMargin,
                      { [globalStyles.pointer]: !isQuickview }
                    )}
                    onClick={() => !isQuickview && handleScroll()}
                  >
                    {badge_text}
                  </div>
                )}
              </div>
            </div>

            {!(invisibleFields && invisibleFields.indexOf("price") > -1) && (
              <div
                className={cs(
                  // isQuickview || mobile ? bootstrap.col5 : bootstrap.col5,
                  // isQuickview || mobile ? bootstrap.colMd5 : bootstrap.colMd5,
                  styles.priceContainer
                  // { [globalStyles.textCenter]: !mobile }
                )}
              >
                {currency === "INR" && (
                  <span
                    className={cs(
                      styles.mrp
                      // {
                      //   [globalStyles.gold]: badgeType == "B_flat" || (info.isSale && discount && discountedPriceRecords)
                      // }
                    )}
                  >
                    MRP.
                  </span>
                )}
                {info.isSale && discount && discountedPriceRecords ? (
                  <span className={styles.discountedPrice}>
                    {displayPriceWithCommas(discountPrices, currency)}
                    {/* <br /> */}
                  </span>
                ) : (
                  ""
                )}
                {info.isSale && discount ? (
                  <span className={styles.oldPrice}>
                    {displayPriceWithCommas(price, currency)}
                  </span>
                ) : (
                  <span
                    className={cs(styles.normalPrice, {
                      [globalStyles.gold]: badgeType == "B_flat",
                      [globalStyles.fontSize16]: badgeType == "B_flat"
                    })}
                  >
                    {" "}
                    {displayPriceWithCommas(price, currency)}
                  </span>
                )}
                {currency === "INR" && (
                  <p className={styles.incTax}>(Incl. of all taxes)</p>
                )}
              </div>
            )}

            {groupedProducts?.length ? (
              <div
                className={cs(bootstrap.row, styles.spacer, {
                  [styles.spacerQuickview]: isQuickview && withBadge
                })}
              >
                <div className={bootstrap.col12}>
                  <div className={bootstrap.row}>
                    <div
                      className={cs(
                        bootstrap.col12,
                        bootstrap.colSm2,
                        { [bootstrap.colMd2]: mobile },
                        styles.label,
                        styles.colour
                      )}
                    >
                      Color
                    </div>
                    <div
                      className={cs(bootstrap.col12, bootstrap.colSm10, {
                        [bootstrap.colMd10]: mobile
                      })}
                    >
                      <ColorSelector
                        products={[
                          ...currentProductColorObjArr,
                          ...groupedProducts
                        ]}
                        onClick={closeModal ? closeModal : () => null}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {showSize ? (
              !(invisibleFields && invisibleFields.indexOf("size") > -1) && (
                <div
                  className={cs(bootstrap.row, styles.spacer, {
                    [styles.spacerQuickview]: isQuickview && withBadge
                  })}
                >
                  <div className={mobile ? bootstrap.col12 : bootstrap.col10}>
                    <div className={bootstrap.row}>
                      <div
                        className={cs(
                          bootstrap.col12,
                          bootstrap.colSm2,
                          { [bootstrap.colMd2]: mobile },
                          styles.label,
                          styles.size,
                          { [styles.mobileMargin]: mobile }
                        )}
                      >
                        Size
                      </div>
                      <div
                        className={cs(
                          bootstrap.col12,
                          { [bootstrap.colMd10]: mobile },
                          bootstrap.colSm10,
                          styles.sizeContainer
                        )}
                      >
                        <SizeSelector
                          isCorporatePDP={corporatePDP}
                          sizes={childAttributes}
                          onChange={onSizeSelect}
                          selected={selectedSize ? selectedSize.id : undefined}
                        />
                        <span
                          className={cs(styles.sizeErrorMessage, "show-error")}
                        >
                          {sizeError}
                        </span>
                        <span className={cs(styles.sizeErrorMessage)}>
                          {info.isSale &&
                            selectedSize &&
                            selectedSize.showStockThreshold &&
                            selectedSize.stock > 0 &&
                            `${
                              selectedSize.othersBasketCount > 0
                                ? ` ${selectedSize.othersBasketCount} other${
                                    selectedSize.othersBasketCount > 1
                                      ? "s"
                                      : ""
                                  } have this item in their bag.`
                                : ""
                            } Only ${selectedSize.stock} Left!`}
                        </span>
                      </div>
                    </div>
                  </div>
                  {sizeChart && !isQuickview && (
                    <div
                      className={cs(bootstrap.colSm2, styles.label, {
                        [globalStyles.textRight]: !mobile
                      })}
                    >
                      <span
                        className={styles.sizeGuide}
                        onClick={onSizeChartClick}
                      >
                        {" "}
                        Size Guide{" "}
                      </span>
                    </div>
                  )}
                  {/* {sizeerror && mobile ? (
              <p className={styles.errorMsg}>Please select a size to proceed</p>
            ) : (
              ""
            )} */}
                  {categories &&
                    !isQuickview &&
                    categories.filter(category =>
                      category.toLowerCase().includes("wallcovering")
                    ).length > 0 && (
                      <div
                        className={cs(bootstrap.colSm4, styles.label, {
                          [globalStyles.textCenter]: !mobile
                        })}
                      >
                        <span
                          className={styles.sizeGuide}
                          onClick={onWallpaperClick}
                        >
                          {" "}
                          Wallpaper Calculator{" "}
                        </span>
                      </div>
                    )}
                </div>
              )
            ) : (
              <span className={cs(styles.sizeErrorMessage)}>
                {info.isSale &&
                  selectedSize &&
                  selectedSize.stock > 0 &&
                  selectedSize.showStockThreshold &&
                  `${
                    selectedSize.othersBasketCount > 0
                      ? ` ${selectedSize.othersBasketCount} other${
                          selectedSize.othersBasketCount > 1 ? "s" : ""
                        } have this item in their bag.`
                      : ""
                  } Only ${selectedSize.stock} Left!`}
              </span>
            )}
            <div
              className={cs(bootstrap.row, {
                [globalStyles.marginT30]: !mobile,
                [styles.spacerQuickview]: isQuickview && withBadge
              })}
            >
              <div
                className={cs(bootstrap.col8, {
                  [bootstrap.colMd12]: mobile
                })}
              >
                {!(
                  invisibleFields && invisibleFields.indexOf("quantity") > -1
                ) && (
                  <div className={bootstrap.row}>
                    <div
                      className={cs(
                        bootstrap.col12,
                        bootstrap.colSm3,
                        { [bootstrap.colMd2]: mobile },
                        styles.label,
                        styles.quantity,
                        styles.qtyLabel,
                        { [styles.mobileMargin]: mobile }
                      )}
                    >
                      Quantity
                    </div>
                    <div
                      className={cs(
                        bootstrap.col12,
                        bootstrap.colSm9,
                        styles.qtyComponent,
                        { [bootstrap.colMd10]: mobile },
                        styles.widgetQty
                      )}
                    >
                      <PdpQuantity
                        source="pdp"
                        key={selectedSize?.sku}
                        id={selectedSize?.id || 0}
                        minValue={minQuantity}
                        maxValue={corporatePDP ? 1 : maxQuantity}
                        currentValue={quantity}
                        onChange={onQuantityChange}
                        errorMsgClass={styles.sizeErrorMessage}
                        // errorMsg={selectedSize ? "Available qty in stock is" : ""}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* {bridalId !== 0 && bridalCurrency == currency && !corporatePDP && (
                <div
                  className={cs(
                    bootstrap.col4,
                    globalStyles.textCenter,
                    styles.bridalSection
                  )}
                  onClick={addToRegistry}
                >
                  <div
                    className={cs(
                      iconStyles.icon,
                      iconStyles.iconRings,
                      styles.bridalRing,
                      {
                        [styles.active]:
                          selectedSize && isRegistry[selectedSize.size]
                      }
                    )}
                  ></div>
                  <p
                    className={cs(styles.label, {
                      [globalStyles.cerise]:
                        selectedSize && isRegistry[selectedSize.size]
                    })}
                  >
                    {selectedSize && isRegistry[selectedSize.size]
                      ? "added"
                      : "add to registry"}
                  </p>
                </div>
              )} */}
            </div>
            {badgeMessage && !isQuickview ? (
              <div
                className={cs(
                  bootstrap.col12,
                  bootstrap.colMd12,
                  styles.salesOffer
                )}
              >
                <img
                  src={offer}
                  className={styles.offerImage}
                  alt="offer20-icon"
                  style={{
                    width: "17px",
                    marginRight: "8px"
                  }}
                />
                <div className={cs(styles.offerMessage)}>
                  {ReactHtmlParser(badgeMessage)}
                </div>
              </div>
            ) : (
              " "
            )}
            {fillerProduct &&
            fillerProduct.discountedPriceRecords[currency] > 0 &&
            !isQuickview ? (
              <div
                className={cs(
                  bootstrap.col12,
                  bootstrap.colMd10,
                  globalStyles.voffset3,
                  styles.cushionError,
                  styles.fillerContainer
                )}
              >
                <img
                  src={asset}
                  className={styles.cushionFiller}
                  alt="cushion-filler-icon"
                />
                <div>
                  Insert not included.{" "}
                  <Link
                    onClick={e => {
                      if (Object.keys(fillerProduct)?.length > 0) {
                        dispatch(updatefillerProduct(fillerProduct));
                        // dispatch(updateshowFiller(true));
                      }

                      // Scroll to the filler product section smoothly
                      if (fillerSectionRef.current) {
                        fillerSectionRef.current.scrollIntoView({
                          behavior: "smooth", // Smooth scroll
                          block: "center" // Align the section to the center of the screen vertically
                        });
                      }

                      // Prevent default link behavior since there’s no URL
                      e.preventDefault();
                    }}
                    to={fillerUrl || "#"}
                  >
                    Click here to purchase.
                  </Link>
                </div>
              </div>
            ) : (
              ""
            )}
            <div
              id="docked_div"
              className={cs(
                bootstrap.row,
                styles.spacer,
                { [styles.spacerQuickview]: isQuickview && withBadge },
                styles.actionButtonsContainer,
                {
                  [globalStyles.voffset3]: mobile
                }
              )}
            >
              <div
                id="yourElement"
                className={cs(globalStyles.voffset1, {
                  [bootstrap.col8]: !corporatePDP,
                  [styles.addToBagBtnContainer]: mobile,
                  [bootstrap.colSm10]: !mobile,
                  [bootstrap.colSm12]: corporatePDP && mobile
                  // [globalStyles.hidden]: mobile && !showAddToBagMobile
                })}
              >
                {Pdpbutton}
                {onload &&
                !info.isSale &&
                loyaltyDisabled &&
                isQuickview &&
                isCeriseUser &&
                currency === "INR" ? (
                  <p className={cs(styles.errorMsg, styles.notEligible)}>
                    This product is not eligible for cerise points.
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div
                className={cs(bootstrap.col4, globalStyles.textCenter, {
                  [styles.wishlistText]: !mobile,
                  [styles.wishlistBtnContainer]: mobile,
                  [globalStyles.voffset1]: mobile,
                  [bootstrap.colSm2]: !mobile,
                  [globalStyles.hidden]:
                    partner == "Souk" || partner == "Object D Art"
                  // [globalStyles.hidden]: corporatePDP || !showAddToBagMobile
                })}
              >
                <WishlistButtonpdp
                  // gtmListType={gtmListType}
                  gtmListType={"pdp"}
                  title={title}
                  parentWidth={true}
                  childAttributes={childAttributes}
                  priceRecords={priceRecords}
                  discountedPriceRecords={discountedPriceRecords}
                  categories={categories}
                  id={id}
                  showText={!mobile}
                  mobile={mobile}
                  size={selectedSize ? selectedSize.size : undefined}
                  iconClassName={cs({
                    [styles.mobileWishlistIcon]: mobile
                  })}
                  badgeType={badgeType}
                  createWishlistPopup={
                    mobile ? createWishlistPopupMobile : createWishlistPopup
                  }
                  isPdp={isPDP}
                  closeModal={closeModal}
                />
              </div>
              <div className="createWishlistPopup">
                {isWishlistOpen && (
                  <CreateWishlist
                    hideWishlistPopup={hideWishlistPopup}
                    gtmListType={gtmListType}
                    title={title}
                    parentWidth={true}
                    childAttributes={childAttributes}
                    priceRecords={priceRecords}
                    discountedPriceRecords={discountedPriceRecords}
                    categories={categories}
                    id={id}
                    showText={!mobile}
                    mobile={mobile}
                    size={selectedSize ? selectedSize.size : undefined}
                    iconClassName={cs({
                      [styles.mobileWishlistIcon]: mobile
                    })}
                    badgeType={badgeType}
                  />
                )}
              </div>
            </div>
            <div
              className={cs(bootstrap.col12, bootstrap.colMd9, {
                [styles.quickviewLoyaltyMessage]: isQuickview,
                [globalStyles.voffset1]: !mobile,
                [globalStyles.voffset3]: mobile
              })}
            >
              {onload &&
              loyaltyDisabled &&
              !info.isSale &&
              !isQuickview &&
              isCeriseUser &&
              currency === "INR" ? (
                <p className={styles.errorMsg}>
                  This product is not eligible for cerise points.
                </p>
              ) : (
                ""
              )}
            </div>

            {bridalId !== 0 && bridalCurrency == currency && !corporatePDP && (
              <div
                className={cs(
                  // bootstrap.col4,
                  // globalStyles.textCenter,
                  styles.bridalSection
                )}
                onClick={addToRegistry}
              >
                <div
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconRing,
                    styles.bridalRing,
                    {
                      [styles.active]:
                        selectedSize && isRegistry[selectedSize.size]
                    }
                  )}
                >
                  {selectedSize && isRegistry[selectedSize.size] ? (
                    <img src={addedReg} width="20px" height="20px"></img>
                  ) : (
                    <img src={addReg} width="20px" height="20px"></img>
                  )}
                </div>
                <p className={cs(styles.label, styles.paddingT3)}>
                  {selectedSize && isRegistry[selectedSize.size]
                    ? "added to registry"
                    : "add to registry"}
                </p>
              </div>
            )}

            {isQuickview && (
              <div className={styles.viewDetails}>
                <Link
                  to={url}
                  className={cs({ [styles.lh45]: withBadge })}
                  onClick={() => {
                    changeModalState(false);
                    const listPath = `${source || "PLP"}`;
                    CookieService.setCookie("listPath", listPath);
                    dispatch(updateQuickviewId(0));
                  }}
                >
                  VIEW DETAILS
                </Link>
              </div>
            )}

            {!isQuickview && freeProductText?.length ? (
              <div className={styles.freeTextSection}>
                <div className={styles.head}>
                  <img src={addReg} width="15px" height="15px"></img>
                  <p>Free Gift Included</p>
                </div>
                <hr />
                <dl className={styles.list}>
                  {freeProductText.map((text, i) => (
                    <div className={styles.item} key={i + text?.heading}>
                      <dt className={styles.title}>
                        <span className={styles.dot}></span> {text?.heading}
                      </dt>
                      {text?.free_products?.map((value, index) => (
                        <dd className={styles.text} key={index}>
                          <span>.</span> {value}
                        </dd>
                      ))}
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            {!isQuickview && (
              <div
                className={cs(
                  bootstrap.col12,
                  bootstrap.colMd9,
                  globalStyles.voffset2,
                  styles.padding
                )}
              >
                <img
                  alt="goodearth-logo"
                  src={inshop}
                  style={{
                    width: "17px",
                    height: "17px",
                    cursor: "pointer",
                    marginRight: "8px"
                  }}
                />
                <span
                  className={styles.shopAvailability}
                  onClick={checkAvailability}
                >
                  Check in-shop availability{" "}
                </span>
              </div>
            )}
            {complianceLine && !isQuickview && (
              <div
                className={cs(
                  bootstrap.col12,
                  bootstrap.colMd12,
                  globalStyles.voffset2
                )}
              >
                <div
                  className={cs(globalStyles.flex, styles.complianceContainer)}
                >
                  <img
                    alt="goodearth-logo"
                    src={legal}
                    style={{
                      width: "17px",
                      marginRight: "8px"
                    }}
                  />
                  <div className={styles.compliance}>
                    {ReactHtmlParser(complianceLine)}
                  </div>
                </div>

                {/* this is the filler product section */}

                {fillerProduct &&
                  fillerProduct.discountedPriceRecords[currency] > 0 && (
                    <div
                      ref={fillerSectionRef}
                      className={styles.outerFillerContainer}
                    >
                      <h3 className={styles.fillerHeading}>
                        ADD CUSHION FILLER
                      </h3>
                      <div className={styles.fillerContainer}>
                        {/* this is for image */}
                        <div className={styles.imageContainer}>
                          {fillerProduct.title && (
                            <Link to={fillerProduct.url}>
                              <img
                                className={styles.fillerImage}
                                src={fillerProduct.plpSliderImages[0]}
                                alt={fillerProduct.title}
                              />
                            </Link>
                          )}

                          <div
                            id="docked_div"
                            className={cs(
                              styles.imageContainerIcon,

                              {
                                [styles.spacerQuickview]:
                                  isQuickview && withBadge
                              }
                            )}
                          >
                            <div
                              className={cs(
                                bootstrap.col4,
                                globalStyles.textCenter,
                                {
                                  [styles.wishlistText]: !mobile,
                                  [styles.wishlistBtnContainer]: mobile,
                                  [globalStyles.voffset1]: mobile,
                                  [bootstrap.colSm2]: !mobile,
                                  [globalStyles.hidden]:
                                    partner == "Souk" ||
                                    partner == "Object D Art"
                                  // [globalStyles.hidden]: corporatePDP || !showAddToBagMobile
                                }
                              )}
                            >
                              {/* <WishlistButtonpdp
                              gtmListType={"pdp"}
                              title={fillerProduct.title}
                              parentWidth={true}
                              childAttributes={childAttributes}
                              priceRecords={fillerProduct.priceRecords}
                              discountedPriceRecords={
                                fillerProduct.discountedPriceRecords
                              }
                              categories={categories}
                              id={fillerProduct.id}
                              mobile={mobile}
                              iconClassName={cs({
                                [styles.mobileWishlistIcon]: mobile
                              })}
                              size={
                                selectedSize ? selectedSize.size : undefined
                              }
                              badgeType={badgeType}
                              isPdp={isPDP}
                              closeModal={closeModal}
                              createWishlistPopup={
                                mobile
                                  ? createWishlistPopupMobile
                                  : createWishlistPopup
                              }
                            /> */}
                              <WishlistButton
                                gtmListType="Search"
                                title={fillerProduct.title}
                                childAttributes={fillerProduct.childAttributes}
                                priceRecords={fillerProduct.priceRecords}
                                discountedPriceRecords={
                                  fillerProduct.discountedPriceRecords
                                }
                                categories={fillerProduct.categories}
                                id={fillerProduct.id}
                                showText={false}
                                key={fillerProduct.id}
                                mobile={mobile}
                                isPlpTile={true}
                                badgeType={fillerProduct?.badgeType}
                              />
                            </div>
                          </div>
                        </div>

                        {/* this is for name or title */}
                        <div className={styles.fillerDetailContainer}>
                          <div className={styles.fillerTitle}>
                            <Link to={fillerProduct.url}>
                              {fillerProduct.title}
                            </Link>
                          </div>
                          <div>
                            {/* This is for price section  */}
                            <div className={styles.fillerPrice}>
                              {currency === "INR" && (
                                <span
                                  className={cs(styles.fillerMrp, {
                                    [styles.mrpSale]:
                                      badgeType == "b_flat" ||
                                      (info.isSale &&
                                        fillerProduct.discount &&
                                        fillerProduct.discountedPriceRecords)
                                  })}
                                >
                                  MRP.
                                </span>
                              )}

                              {info.isSale &&
                              fillerProduct.discount &&
                              fillerProduct.discountedPriceRecords ? (
                                <span className={styles.fillerDiscountedPrice}>
                                  {displayPriceWithCommas(
                                    fillerProduct.discountedPriceRecords[
                                      currency
                                    ],
                                    currency
                                  )}
                                </span>
                              ) : (
                                ""
                              )}
                              {info.isSale && fillerProduct.discount ? (
                                <span className={styles.fillerOldPrice}>
                                  {displayPriceWithCommas(
                                    fillerProduct.priceRecords[currency],
                                    currency
                                  )}
                                </span>
                              ) : (
                                <span
                                  className={cs(styles.fillerNormalPrice, {
                                    [globalStyles.gold]: badgeType == "B_flat",
                                    [globalStyles.fontSize16]:
                                      badgeType == "B_flat"
                                  })}
                                >
                                  {" "}
                                  {displayPriceWithCommas(
                                    fillerProduct.priceRecords[currency],
                                    currency
                                  )}
                                </span>
                              )}
                              {currency === "INR" && (
                                <p className={styles.fillerIncTax}>
                                  (Incl. of all taxes)
                                </p>
                              )}
                            </div>

                            {/* this is for size*/}

                            {showSize
                              ? !(
                                  invisibleFields &&
                                  invisibleFields.indexOf("size") > -1
                                ) && (
                                  <div style={{ width: "170px" }}>
                                    <div
                                      className={
                                        mobile
                                          ? bootstrap.col12
                                          : bootstrap.col10
                                      }
                                    >
                                      <div className={bootstrap.row}>
                                        <div>
                                          <div
                                            className={cs(
                                              bootstrap.col12,
                                              bootstrap.colSm2,
                                              { [bootstrap.colMd2]: mobile },
                                              styles.label,
                                              styles.fillersize,
                                              { [styles.mobileMargin]: mobile }
                                            )}
                                          >
                                            Size:
                                          </div>
                                        </div>
                                        <div
                                          className={styles.fillerSizeContainer}
                                        >
                                          <SizeSelector
                                            containerClassName={
                                              styles.fillerSizeContainer
                                            }
                                            isCorporatePDP={corporatePDP}
                                            sizes={childAttributes}
                                            onChange={onSizeSelect}
                                            selected={
                                              selectedSize
                                                ? selectedSize.id
                                                : undefined
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              : ""}

                            {/* this is for add to bag  button */}

                            <div
                              id="yourElement"
                              className={cs(globalStyles.voffset1, {
                                // [bootstrap.col8]: !corporatePDP,
                                // [styles.addToBagBtnContainer]: mobile,
                                [bootstrap.colSm10]: !mobile,
                                [bootstrap.colSm12]: corporatePDP && mobile
                              })}
                              style={{ marginLeft: "-3px" }}
                            >
                              {PdpFillerButton}
                              {onload &&
                                !info.isSale &&
                                loyaltyDisabled &&
                                isQuickview &&
                                isCeriseUser &&
                                currency === "INR" && (
                                  <p
                                    className={cs(
                                      styles.errorMsg,
                                      styles.notEligible
                                    )}
                                  >
                                    This product is not eligible for cerise
                                    points.
                                  </p>
                                )}
                            </div>
                          </div>

                          <div className={styles.fillerLink}>
                            <Link to="/catalogue/category/living/cushion-covers_47/?source=plp&category_shop=Home > Cushion Covers > Fillers">
                              VIEW ALL CUSHION FILLER
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* this is the filler product section */}
              </div>
            )}

            <div
              className={cs(
                bootstrap.col12,
                bootstrap.colMd12,
                globalStyles.voffset3
              )}
            >
              {/* {!mobile && !isQuickview && (
                <Share
                  mobile={mobile}
                  link={`${__DOMAIN__}${location.pathname}`}
                  mailSubject="Gifting Ideas"
                  mailText={`${
                    corporatePDP
                      ? `Here's what I found, check it out on Good Earth's web boutique`
                      : `Here's what I found! It reminded me of you, check it out on Good Earth's web boutique`
                  } ${__DOMAIN__}${location.pathname}`}
                />
              )} */}
              <div>
                {!isQuickview && (
                  <Accordion
                    sections={accordionSections}
                    className="pdp-accordion"
                    headerClassName={styles.accordionHeader}
                    bodyClassName={styles.accordionBody}
                    defaultOpen="details"
                  />
                )}
              </div>
              {/* {!isQuickview && (
                <div className={cs(styles.sku, globalStyles.voffset4)}>
                  Vref. {setSelectedSKU()}
                </div>
              )} */}
              {/* {!isQuickview && <CustomerCareInfo />} */}
              {/* {!isQuickview && (
                <Share
                  mobile={mobile}
                  link={`${__DOMAIN__}${location.pathname}`}
                  mailSubject="Gifting Ideas"
                  mailText={`${
                    corporatePDP
                      ? `Here's what I found, check it out on Good Earth's web boutique`
                      : `Here's what I found! It reminded me of you, check it out on Good Earth's web boutique`
                  } ${__DOMAIN__}${location.pathname}`}
                />
              )} */}
              {!isQuickview && (
                <div className={cs(styles.sku, globalStyles.voffset4)}>
                  Vref. {setSelectedSKU()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default memo(ProductDetails);
