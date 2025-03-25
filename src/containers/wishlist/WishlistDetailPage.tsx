import React, { useEffect, useState, useContext, useMemo } from "react";
import WishlistService from "services/wishlist";
import { useSelector, useDispatch } from "react-redux";
import styles from "./styles.scss";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import SecondaryHeader from "components/SecondaryHeader";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import UserContext from "contexts/user";
import { AppState } from "reducers/typings";
import {
  displayPriceWithCommas,
  displayPriceWithCommasFloat
} from "utils/utility";
import iconStyles from "styles/iconFonts.scss";
import { updateComponent, updateModal } from "../../actions/modal";
import { POPUP } from "constants/components";
import ModalStyles from "components/Modal/styles.scss";
import cross from "./../../icons/wishlistClose.svg";
import pencilIcon from "./../../icons/wishlistPencil.svg";
import { updateLoader } from "actions/info";
import Button from "components/Button";
import LoginService from "services/login";
import { updateNextUrl } from "actions/info";
import HeaderService from "services/headerFooter";
import { SearchFeaturedData } from "components/header/typings";
import { Link, useLocation } from "react-router-dom";
import CreateWishlist from "components/WishlistButton/CreateWishlist";
import linkIcon from "./../../images/linkIcon.svg";
import CookieService from "../../services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { useHistory } from "react-router-dom";
import addToBAg from "../../icons/GE- Icons-134.svg";

const WishlistDetailPage = () => {
  const dispatch = useDispatch();
  const [pId, setPId] = useState(0);
  const [activeWishlist, setActiveWishlist] = useState(null);
  const [activeWishlistItem, setActiveWishlistItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const { isLoggedIn } = useContext(UserContext);
  const history = useHistory();
  const isShared = history.location.pathname.includes("shared-wishlist");
  const { firstName, lastName } = useSelector((state: AppState) => state.user);
  const { mobile } = useSelector((state: AppState) => state.device);
  const { isSale, showTimer } = useSelector((state: AppState) => state.info);
  const { items, sharedItems, owner_name, message, wishListName } = useSelector(
    (state: AppState) => state.wishlist
  );
  // const data = useSelector((state: AppState) => state.products);
  // const data = (id && state.products[id]) as Product;
  const currency = useSelector((state: AppState) => state.currency);
  const [featureData, setFeatureData] = useState<SearchFeaturedData>({
    name: "",
    description: "",
    widgetImages: [],
    backgroundImage: "",
    enabled: false,
    products: [],
    id: 0
  });

  const [openIndex, setOpenIndex] = useState(0);

  // Toggle the accordion's open state
  const handleToggle = (index: any) => {
    setOpenIndex(openIndex === index ? null : index); // Close if already open, else open
    if (index != 0 && openIndex != index) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          const elem = document.getElementById(
            `accordion-item-${index}`
          ) as HTMLDivElement;
          const rect = elem?.getBoundingClientRect();
          const scrollTop = window.scrollY + rect.top;
          window.scrollTo({ top: scrollTop - 200, behavior: "smooth" });
        });
      }, 200);
    }
  };

  const emptyWishlistContent = (
    <div>
      <div
        className={cs(
          bootstrapStyles.row,
          { [globalStyles.marginT30]: !mobile },
          styles.minheight
        )}
      >
        {isLoggedIn && !isShared && (
          <>
            <div
              className={cs(
                bootstrapStyles.colMd12,
                styles.wishlistHeading,
                { [styles.wishlistHeadingMobile]: mobile },
                globalStyles.textCenter
              )}
            >
              <h2 className={globalStyles.voffset5}>Your Favorites</h2>
            </div>
            <div
              className={cs(
                bootstrapStyles.colMd12,
                bootstrapStyles.col12,
                globalStyles.textCenter
              )}
            >
              {
                <div className={styles.npfMsg}>
                  Mark your favorite pieces for later!
                </div>
              }
            </div>
          </>
        )}
        <div
          className={cs(
            bootstrapStyles.colMd12,
            styles.searchHeading,
            { [styles.searchHeadingMobile]: mobile },
            globalStyles.textCenter
          )}
        >
          <h2 className={globalStyles.voffset5}>
            Looking to discover some ideas?
          </h2>
        </div>
        <div className={cs(bootstrapStyles.col12, globalStyles.voffset3)}>
          <div className={bootstrapStyles.row}>
            <div
              className={cs(
                bootstrapStyles.colMd12,
                bootstrapStyles.col12,
                styles.noResultPadding,
                styles.checkheight,
                { [styles.checkheightMobile]: mobile }
              )}
            >
              {featureData?.widgetImages?.length > 0
                ? featureData?.widgetImages?.map((data, i) => {
                    return (
                      <div
                        key={i}
                        className={cs(
                          bootstrapStyles.colMd3,
                          bootstrapStyles.col6
                        )}
                      >
                        <div className={styles.searchImageboxNew}>
                          <Link to={data.ctaUrl}>
                            <img
                              src={
                                data.ctaImage == ""
                                  ? "/src/image/noimageplp.png"
                                  : data.ctaImage
                              }
                              // onError={this.addDefaultSrc}
                              alt={data.ctaText}
                              className={styles.imageResultNew}
                            />
                          </Link>
                        </div>
                        <div className={styles.imageContent}>
                          <p className={styles.searchImageTitle}>
                            {data.ctaText}
                          </p>
                          <p className={styles.searchFeature}>
                            <Link to={data.ctaUrl}>{data.title}</Link>
                          </p>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
          {mobile ? (
            ""
          ) : (
            <div className={bootstrapStyles.row}>
              <div
                className={cs(bootstrapStyles.colMd12, bootstrapStyles.col12)}
              >
                <div className={cs(styles.searchBottomBlockSecond)}>
                  <div className="text-center"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const emptySharedWishlistContent = (
    <div
      className={cs(styles.emptySharedWishlistContent, {
        [globalStyles.marginT100]: owner_name
      })}
    >
      <p>{message}</p>
      <Button
        variant="mediumMedCharcoalCta366"
        label={"PROCEED TO GOODEARTH.IN"}
        onClick={() => history.push("/")}
      />
    </div>
  );

  const updateWishlist = async () => {
    await WishlistService.updateWishlist(dispatch);
  };

  const updateWishlistShared = async (location: any) => {
    const urlParam = new URLSearchParams(location.search);
    const uid = urlParam.get("key") || "";
    await WishlistService.updateWishlistShared(dispatch, uid);
  };

  //wishlist page scroll to top when view & manage wishlist link clicked
  const location = useLocation();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  }, [location]);

  const fetchFeaturedContent = async () => {
    HeaderService.fetchSearchFeaturedContent(dispatch)
      .then(data => {
        if (data) {
          setFeatureData(data);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (isShared) {
      updateWishlistShared(location);
    } else {
      updateWishlist();
      fetchFeaturedContent();
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 700);
    }
  }, []);

  useEffect(() => {
    const wishlistTotal = sharedItems.map(item => {
      if (!item.size && item.stockDetails.length > 1) {
        const itemTotal = item.stockDetails.reduce((prev, curr) => {
          const prevprices = parseFloat(
            prev.discountedPrice[currency].toString()
          );
          const currprices = parseFloat(
            curr.discountedPrice[currency].toString()
          );
          return prevprices < currprices ? prev : curr;
        });
        return isSale
          ? +itemTotal.discountedPrice[currency]
          : +itemTotal.price[currency];
      } else if (item.size) {
        let vars = 0;
        item.stockDetails.forEach(function(items, key) {
          if (item.size == items.size) {
            vars = isSale
              ? +items.discountedPrice[currency]
              : +items.price[currency];
          }
        });
        return vars;
      } else {
        return item.stockDetails[0]
          ? isSale
            ? +item.stockDetails[0].discountedPrice[currency]
            : +item.stockDetails[0].price[currency]
          : 0;
      }
    });
    const wishlistSubtotal = wishlistTotal.reduce((total, num) => {
      return total + num;
    }, 0);
    setTotalPrice(wishlistSubtotal);
  }, [sharedItems]);

  const openPopup = (
    item: any,
    currency: any,
    isSale?: boolean,
    mobile?: boolean,
    isShared?: boolean,
    productDataId?: number,
    listName?: string
  ) => {
    const childAttributes = item?.stockDetails?.map((item: any) => {
      return {
        discountedPriceRecords: item.discountedPrice,
        id: item.productId,
        isBridalProduct: false,
        sku: item.sku,
        priceRecords: item.price,
        size: item.size,
        stock: item.stock,
        showStockThreshold: item.showStockThreshold
      };
    });
    let selectedIndex;
    let price = item.price[currency];
    childAttributes.map((v: any, i: any) => {
      if (v.size === item?.size) {
        selectedIndex = i;
        price = v.priceRecords[currency];
      }
    });
    const changeSize = async (size: string, quantity?: number) => {
      if (!isShared) {
        await WishlistService.modifyWishlistItem(
          dispatch,
          item.id,
          size,
          quantity,
          listName
          // sortBy
        );
      }
    };

    const index = item.category.length - 1;
    let category = item.category[index]
      ? item.category[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");

    dispatch(
      updateComponent(
        POPUP.NOTIFYMEPOPUP,
        {
          // sortBy: sortBy,
          price: price,
          discountedPrice: item.discountedPrice[currency],
          currency: currency,
          title: item.productName,
          childAttributes: childAttributes,
          collection: item.collection,
          selectedIndex: selectedIndex,
          changeSize: changeSize,
          isSale: isSale,
          discount: item.discount,
          badgeType: item.badgeType,
          list: "wishlist",
          sliderImages: [],
          collections: item?.collection,
          category: category,
          badge_text: item?.badge_text,
          productDataId: productDataId ? productDataId : undefined,
          listName: listName ? listName : undefined
        },
        false,
        mobile ? ModalStyles.bottomAlignSlideUp : "",
        mobile ? "slide-up-bottom-align" : ""
      )
    );
    dispatch(updateModal(true));
  };

  const gtmPushWishlist = (
    addWishlist?: boolean,
    listName?: string,
    productData?: any
  ) => {
    const index = productData.category ? productData.category.length - 1 : 0;
    let category: any =
      productData.category &&
      productData.category.length > 0 &&
      productData.category[index].replace(/\s/g, "");
    category = category && category.replace(/>/g, "/");

    const cat1 = productData.category?.[0]?.split(">");
    const cat2 = productData.category?.[1]?.split(">");

    const L1 = cat1?.[0]?.trim();
    const L2 = cat1?.[1] ? cat1?.[1]?.trim() : cat2?.[1]?.trim();
    const L3 = cat2?.[2]
      ? cat2?.[2]?.trim()
      : productData.category?.[2]?.split(">")?.[2]?.trim();

    const clickType = localStorage.getItem("clickType");
    const search = CookieService.getCookie("search") || "";

    if (addWishlist) {
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "add_to_wishlist",
        previous_page_url: CookieService.getCookie("prevUrl"),
        list_name: listName ? listName : "NA",
        page_category: "Wishlist",
        ecommerce: {
          currency: currency,
          value: productData.discountedPrice
            ? productData.discountedPrice[currency]
            : productData.price
            ? productData.price[currency]
            : null,
          items: [
            {
              item_id: productData.id,
              item_name: productData.productName,
              affiliation: productData.productName,
              coupon: "NA", //Pass NA if not applicable at the moment
              // currency: currency, // Pass the currency code
              discount:
                isSale && productData.discountedPrice
                  ? productData.badgeType == "B_flat"
                    ? productData.discountedPrice[currency]
                    : productData.price[currency] -
                      productData.discountedPrice[currency]
                  : "NA", // Pass the discount amount
              index: 0,
              item_brand: "Goodearth",
              item_category: L1,
              item_category2: L2,
              item_category3: L3,
              item_category4: "NA", //Pass NA if not applicable at the moment
              item_category5: productData.is3dimage ? "3d" : "Non3d",
              item_list_id: "NA", //Pass NA if not applicable at the moment
              item_list_name: search ? `${clickType}-${search}` : "NA", //Pass NA if not applicable at the moment
              item_variant: productData.size ? productData.size : "NA", //Pass NA if not applicable at the moment
              price: productData.discountedPrice
                ? productData.discountedPrice[currency]
                : productData.price
                ? productData.price[currency]
                : null,
              quantity: 1, //default 1
              collection_category: category ? category : "NA", //Pass NA if not applicable at the moment
              price_range: "NA"
            }
          ]
        }
      });
    } else {
      dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      dataLayer.push({
        event: "remove_from_wishlist",
        previous_page_url: CookieService.getCookie("prevUrl"),
        list_name: listName ? listName : "NA",
        page_category: "Wishlist",
        ecommerce: {
          currency: currency,
          value: productData.discountedPrice
            ? productData.discountedPrice[currency]
            : productData.price
            ? productData.price[currency]
            : null,
          items: [
            {
              item_id: productData.id,
              item_name: productData.productName,
              affiliation: productData.productName,
              coupon: "NA", //Pass NA if not applicable at the moment
              // currency: currency, // Pass the currency code
              discount:
                isSale && productData.discountedPrice
                  ? productData.badgeType == "B_flat"
                    ? productData.discountedPrice[currency]
                    : productData.price[currency] -
                      productData.discountedPrice[currency]
                  : "NA", // Pass the discount amount
              index: 0,
              item_brand: "Goodearth",
              item_category: L1,
              item_category2: L2,
              item_category3: L3,
              item_category4: "NA", //Pass NA if not applicable at the moment
              item_category5: productData.is3dimage ? "3d" : "Non3d",
              item_list_id: "NA", //Pass NA if not applicable at the moment
              item_list_name: search ? `${clickType}-${search}` : "NA", //Pass NA if not applicable at the moment
              item_variant: productData.size ? productData.size : "NA", //Pass NA if not applicable at the moment
              price: productData.discountedPrice
                ? productData.discountedPrice[currency]
                : productData.price
                ? productData.price[currency]
                : null,
              quantity: 1, //default 1
              collection_category: category ? category : "NA", //Pass NA if not applicable at the moment
              price_range: "NA"
            }
          ]
        }
      });
    }
  };

  const removeProduct = (id: number, listName: string, productData?: any) => {
    WishlistService.removeFromWishlist(
      dispatch,
      id,
      undefined,
      isLoggedIn ? listName : undefined
    ).finally(() => {
      dispatch(updateLoader(false));
      gtmPushWishlist(false, listName, productData);
    });
  };

  const deleteWishlistName = (listName: string) => {
    WishlistService.removeFromWishlist(
      dispatch,
      undefined,
      undefined,
      listName
    );
  };

  const editPopup = (id: number, name: string) => {
    dispatch(
      updateComponent(
        POPUP.EDITWISHLISTNAME,
        { id, name, deleteWishlistName },
        false,
        mobile ? ModalStyles.bottomAlignSlideUp : "",
        mobile ? "slide-up-bottom-align" : ""
      )
    );
    dispatch(updateModal(true));
  };

  const deletePopup = async (name: string) => {
    dispatch(
      updateComponent(POPUP.DELETEWISHLIST, { name, deleteWishlistName }, false)
    );
    dispatch(updateModal(true));
    dataLayer.push({
      event: "delete_list_initiate",
      list_name: name ? name : "NA"
    });
  };

  const creatWishlistPopup = (dataLength: number) => {
    dispatch(
      updateComponent(
        POPUP.CREATEWISHLIST,
        { dataLength },
        false,
        mobile ? ModalStyles.bottomAlignSlideUp : "",
        mobile ? "slide-up-bottom-align" : ""
      )
    );
    dispatch(updateModal(true));
    dataLayer.push({
      event: "new_list_initiated",
      list_name: "NA"
    });
  };

  const openLogin = (url: string, isShareLinkClicked: boolean) => {
    //Stored this value for share wishlist popup
    localStorage.setItem("isShareLinkClicked", String(isShareLinkClicked));
    LoginService.showLogin(dispatch);
    if (url) {
      dispatch(updateNextUrl(url));
    }
  };

  const editWishlistItemPopupMobile = (id: number, wishlistName?: string) => {
    dispatch(
      updateComponent(
        POPUP.ADDREMOVEWISHLISTNAMEPOPUP,
        { id: id, wishlistName: wishlistName },
        false,
        mobile ? ModalStyles.bottomAlignSlideUp : "",
        mobile ? "slide-up-bottom-align" : ""
      )
    );
    dispatch(updateModal(true));
    dataLayer.push({
      event: "edit_product_click",
      list_name: wishlistName ? wishlistName : "NA"
    });
  };

  const editWishlistItemPopup = (
    id: number,
    listIndex: any,
    ProductIndex: any,
    wishlistName?: string
  ) => {
    setPId(id);
    setActiveWishlist(listIndex);
    setActiveWishlistItem(ProductIndex);
    dataLayer.push({
      event: "edit_product_click",
      list_name: wishlistName ? wishlistName : "NA"
    });
  };

  const hideWishlistPopup = () => {
    setActiveWishlist(null);
    setActiveWishlistItem(null);
  };

  const openSharePopup = (
    listName: string,
    sharable_link: string,
    updateWishlistData: any,
    mobile: boolean
  ) => {
    dispatch(
      updateComponent(
        POPUP.SHAREWISHLIST,
        {
          // shareUrl: "https://www.goodearth.in/sssss"
          // bridalDetails={bridalDetails}
          listName,
          sharable_link,
          updateWishlistData
        },
        mobile ? false : true,
        mobile ? ModalStyles.bottomAlignSlideUp : "",
        mobile ? "slide-up-bottom-align" : ""
      )
    );
    dispatch(updateModal(true));
  };

  const gaCall = (click_type: string) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "share_wishlist",
        click_type: click_type,
        cta_location: "NA",
        cta_name:
          `${firstName} ${lastName}`
            .toLowerCase()
            .replace(/\b(\w)/g, x => x.toUpperCase()) + "&apos;s Saved List"
      });
    }
  };

  const onSharlinkClick = (
    listName: string,
    sharable_link: string,
    updateWishlistData: any
  ) => {
    gaCall("Share list");
    if (isLoggedIn) {
      openSharePopup(listName, sharable_link, updateWishlistData, mobile);
    } else {
      openLogin("/wishlist", true);
    }
  };

  return (
    <div
      className={cs(bootstrapStyles.containerFluid, {
        [styles.pageBodyTimer]: showTimer && mobile,
        [styles.sharedEmptyContainer]:
          sharedItems.length == 0 && isShared && !owner_name
      })}
    >
      {/* {console.log("dataItem---",data)} */}
      {isLoggedIn && !isShared && (
        <SecondaryHeader>
          <div className={styles.secondryHeaderWrapper}>
            <div className={styles.heading}>SAVED ITEMS</div>
            <div
              className={cs(
                styles.heading,
                globalStyles.pointer,
                globalStyles.aquaHover,
                styles.textUnderline
              )}
              onClick={() => creatWishlistPopup(items.length)}
            >
              + CREATE NEW LIST
            </div>
          </div>
        </SecondaryHeader>
      )}

      {sharedItems.length == 0 &&
        isShared &&
        !owner_name &&
        emptySharedWishlistContent}

      <div
        className={
          showTimer
            ? cs(styles.wishlistBlockOuterTimer)
            : cs(styles.wishlistBlockOuter)
        }
      >
        {!isLoggedIn && !isShared && (
          <div className={styles.topBlockContainer}>
            <div className={styles.innerContainer}>
              <h3 className={styles.heading}>Your Saved List</h3>
              <p className={styles.subheading}>
                <>
                  Here are your saved items. Stay organized with your <br />
                  items, create multiple lists, and easily share your <br />
                  favorites with friends and family.
                </>
              </p>
              <Button
                label={"Login"}
                variant="smallMedCharcoalCta"
                onClick={() => openLogin("/wishlist", false)}
              />
            </div>
          </div>
        )}

        {isShared && owner_name && (
          <div className={styles.sharedWrapper}>
            <h2 className={styles.heading}>
              {owner_name
                .toLowerCase()
                .replace(/\b(\w)/g, x => x.toUpperCase())}
              &apos;s saved items &apos;{wishListName}&apos;
            </h2>
            <p className={styles.subheading}>
              A wishlist has been shared with you.{mobile && <br />} Start
              shopping!
            </p>
          </div>
        )}

        <div
          className={cs({
            [bootstrapStyles.col10]:
              !mobile || (mobile && isShared && sharedItems.length == 0),
            [bootstrapStyles.offset1]:
              !mobile || (mobile && isShared && sharedItems.length == 0),
            [globalStyles.marginT40]: !isShared,
            [globalStyles.paddLeftRight5]: mobile
          })}
        >
          {isShared ? (
            sharedItems.length > 0 ? (
              <>
                <div
                  className={cs(styles.wishlistTop, styles.wishlistSubtotal)}
                >
                  <span>
                    {"(" +
                      sharedItems.length +
                      ` item${sharedItems.length === 1 ? "" : "s"}) Subtotal:`}
                    &nbsp;
                  </span>
                  <span>
                    {Number.isSafeInteger(+totalPrice)
                      ? displayPriceWithCommas(totalPrice, currency)
                      : displayPriceWithCommasFloat(totalPrice, currency)}
                  </span>
                </div>
                <div className={styles.listBlock}>
                  <div
                    className={cs(styles.wishlistTop, styles.wishlistSubtotal)}
                  ></div>
                  <div className={cs(styles.productBlock, bootstrapStyles.row)}>
                    {sharedItems.map((productData, productIndex) => {
                      let showStockMessage = false;
                      if (productData.size) {
                        const selectedSize = productData.stockDetails.filter(
                          item => item.size == productData.size
                        )[0];
                        showStockMessage =
                          selectedSize &&
                          selectedSize.stock > 0 &&
                          selectedSize.showStockThreshold;
                      } else {
                        showStockMessage =
                          !productData.stockDetails[0].size &&
                          productData.stockDetails[0].stock > 0 &&
                          productData.stockDetails[0].showStockThreshold;
                      }
                      const stock = productData.size
                        ? productData.stockDetails.filter(
                            item => item.size == productData.size
                          ).length > 0
                          ? productData.stockDetails.filter(
                              item => item.size == productData.size
                            )[0].stock
                          : productData.stockDetails[0].stock
                        : productData.stockDetails[0].stock;
                      return (
                        <div
                          key={productIndex}
                          className={cs(
                            styles.productData,
                            mobile
                              ? bootstrapStyles.col6
                              : bootstrapStyles.colMd3
                          )}
                        >
                          <div className={styles.imagebox}>
                            {productData.salesBadgeImage && (
                              <div
                                className={cs(
                                  {
                                    [styles.badgePositionPlpMobile]: mobile
                                  },
                                  {
                                    [styles.badgePositionPlp]: !mobile
                                  }
                                )}
                              >
                                <img src={productData.salesBadgeImage} />
                              </div>
                            )}
                            {productData?.badge_text && (
                              <div
                                className={cs(
                                  globalStyles.textCenter,
                                  globalStyles.badgePositionDesktop,
                                  styles.badgePosition,
                                  {
                                    [globalStyles.badgePositionMobile]: mobile
                                  }
                                )}
                              >
                                <div
                                  className={cs(globalStyles.badgeContainer)}
                                >
                                  {productData?.badge_text}
                                </div>
                              </div>
                            )}
                            <a href={productData.productUrl}>
                              <img
                                src={
                                  productData.productImage
                                    ? productData.productImage
                                    : "/static/img/noimageplp.png"
                                }
                                alt="Others"
                                className={styles.productImage}
                              />
                            </a>
                            <div
                              className={cs(
                                globalStyles.textCenter,
                                globalStyles.cartIconPositionDesktop,
                                {
                                  [globalStyles.cartIconPositionMobile]: mobile
                                }
                              )}
                            >
                              <div
                                className={cs(
                                  iconStyles.icon,
                                  globalStyles.iconContainer,
                                  iconStyles.iconPlpCart
                                )}
                                onClick={() =>
                                  openPopup(
                                    productData,
                                    currency,
                                    isSale,
                                    mobile,
                                    isShared
                                  )
                                }
                              ></div>
                            </div>
                          </div>
                          <div className={styles.imageContent}>
                            <p className={styles.productN}>
                              <a href={productData.productUrl}>
                                {productData.productName
                                  ? productData.productName
                                  : ""}{" "}
                              </a>
                            </p>
                            <p
                              className={cs(
                                styles.productN,
                                styles.productPrice
                              )}
                            >
                              {isSale && productData.discount ? (
                                <span className={styles.discountprice}>
                                  {productData.discountedPrice
                                    ? displayPriceWithCommas(
                                        productData.discountedPrice[currency],
                                        currency
                                      )
                                    : ""}{" "}
                                </span>
                              ) : (
                                ""
                              )}
                              {isSale && productData.discount ? (
                                <span className={styles.strikeprice}>
                                  {displayPriceWithCommas(
                                    productData.price[currency],
                                    currency
                                  )}
                                </span>
                              ) : (
                                <span
                                  className={
                                    productData.badgeType == "B_flat"
                                      ? styles.discountprice
                                      : ""
                                  }
                                >
                                  {displayPriceWithCommas(
                                    productData.price[currency],
                                    currency
                                  )}
                                </span>
                              )}
                            </p>
                            <span
                              className={cs(
                                globalStyles.errorMsg,
                                globalStyles.gold,
                                styles.errMsg,
                                styles.errMsg1
                              )}
                            >
                              {isSale &&
                                showStockMessage &&
                                `Only ${stock} Left!`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className={cs(styles.awesome)} id="emptySharedWishlist">
                {sharedItems.length == 0 &&
                  isShared &&
                  owner_name &&
                  emptySharedWishlistContent}
              </div>
            )
          ) : items.length > 0 ? (
            items.map((list, listIndex) => {
              return (
                <>
                  <div
                    key={listIndex}
                    id={`accordion-item-${listIndex}`}
                    className={cs("accordion-item", styles.listBlock)}
                  >
                    <div
                      className={cs("accordion-header", styles.wishlistHead, {
                        [globalStyles.marginB40]: openIndex != listIndex
                      })}
                    >
                      <div className={styles.wishlistHeading}>
                        <h3 className={styles.listName}>
                          {list.name} ({list.products.length})
                        </h3>
                        {!mobile && list.name != "Default" && (
                          <>
                            <span
                              className={cs(
                                styles.edit,
                                globalStyles.aquaHover
                              )}
                              onClick={() => editPopup(list.id, list.name)}
                            >
                              Edit
                            </span>
                            <span
                              className={cs(
                                styles.edit,
                                globalStyles.aquaHover
                              )}
                              onClick={() => deletePopup(list.name)}
                            >
                              Delete
                            </span>
                          </>
                        )}
                      </div>
                      {!isShared && (
                        <div className={cs(styles.shareList)}>
                          <div
                            className={styles.sharelink}
                            onClick={() =>
                              onSharlinkClick(
                                list.name,
                                list.sharable_link,
                                updateWishlist
                              )
                            }
                          >
                            <img src={linkIcon} alt="link" />
                            <span>SHARE LIST</span>
                          </div>
                          <div
                            className={styles.arrowRound}
                            onClick={() => handleToggle(listIndex)}
                          >
                            <span
                              className={cs(
                                styles.arrow,
                                openIndex === listIndex
                                  ? styles.openIcon
                                  : styles.closedIcon
                              )}
                            ></span>
                          </div>
                        </div>
                      )}
                    </div>
                    {openIndex === listIndex && (
                      <div className={styles.accordionBody}>
                        {mobile && list.name != "Default" && (
                          <div className={styles.editDelete}>
                            <span
                              className={cs(
                                styles.edit,
                                globalStyles.aquaHover
                              )}
                              onClick={() => editPopup(list.id, list.name)}
                            >
                              Edit
                            </span>
                            <span
                              className={cs(
                                styles.edit,
                                globalStyles.aquaHover
                              )}
                              onClick={() => deletePopup(list.name)}
                            >
                              Delete
                            </span>
                          </div>
                        )}
                        {list.products.length > 0 ? (
                          <div
                            className={cs(
                              styles.productBlock,
                              bootstrapStyles.row
                            )}
                          >
                            {list.products.map((productData, productIndex) => {
                              let showStockMessage = false;
                              if (productData.size) {
                                const selectedSize = productData.stockDetails.filter(
                                  item => item.size == productData.size
                                )[0];
                                showStockMessage =
                                  selectedSize &&
                                  selectedSize.stock > 0 &&
                                  selectedSize.showStockThreshold;
                              } else {
                                showStockMessage =
                                  !productData.stockDetails[0].size &&
                                  productData.stockDetails[0].stock > 0 &&
                                  productData.stockDetails[0]
                                    .showStockThreshold;
                              }
                              const stock = productData.size
                                ? productData.stockDetails.filter(
                                    item => item.size == productData.size
                                  ).length > 0
                                  ? productData.stockDetails.filter(
                                      item => item.size == productData.size
                                    )[0].stock
                                  : productData.stockDetails[0].stock
                                : productData.stockDetails[0].stock;
                              return (
                                <div
                                  key={productIndex}
                                  className={cs(
                                    styles.productData
                                    // mobile
                                    //   ? bootstrapStyles.col6
                                    //   : bootstrapStyles.colMd2
                                  )}
                                >
                                  <div className={styles.imagebox}>
                                    {productData.salesBadgeImage && (
                                      <div
                                        className={cs(
                                          {
                                            [styles.badgePositionPlpMobile]: mobile
                                          },
                                          {
                                            [styles.badgePositionPlp]: !mobile
                                          }
                                        )}
                                      >
                                        <img
                                          src={productData.salesBadgeImage}
                                        />
                                      </div>
                                    )}
                                    {productData?.badge_text && (
                                      <Link
                                        to={productData?.productUrl}
                                        className={cs(
                                          globalStyles.textCenter,
                                          globalStyles.badgePositionDesktop,
                                          globalStyles.pointer
                                          // styles.badgePosition,
                                          // {
                                          //   [globalStyles.badgePositionMobile]: mobile
                                          // }
                                        )}
                                      >
                                        <div
                                          className={cs(
                                            globalStyles.badgeContainer,
                                            globalStyles.flex
                                          )}
                                        >
                                          {productData?.badge_text}
                                        </div>
                                      </Link>
                                    )}
                                    {!isShared && (
                                      <div>
                                        <div
                                          className={cs(
                                            styles.iconCloseContainer
                                          )}
                                        >
                                          <img
                                            src={cross}
                                            alt="remove"
                                            className={cs(styles.iconClose)}
                                            onClick={() => {
                                              removeProduct(
                                                productData.productId,
                                                list.name,
                                                productData
                                              );
                                            }}
                                          />
                                        </div>
                                        {isLoggedIn && (
                                          <div
                                            className={cs(
                                              styles.iconPencilContainer
                                            )}
                                          >
                                            <img
                                              src={pencilIcon}
                                              alt="pencilIcon"
                                              className={cs(styles.iconPencil)}
                                              onClick={() =>
                                                mobile
                                                  ? editWishlistItemPopupMobile(
                                                      productData.productId,
                                                      list.name
                                                    )
                                                  : editWishlistItemPopup(
                                                      productData.productId,
                                                      listIndex,
                                                      productIndex,
                                                      list.name
                                                    )
                                              }
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    <a href={productData.productUrl}>
                                      <img
                                        src={
                                          productData.productImage
                                            ? productData.productImage
                                            : "/static/img/noimageplp.png"
                                        }
                                        alt="Others"
                                        className={styles.productImage}
                                      />
                                    </a>
                                    <div
                                      className={cs(
                                        globalStyles.textCenter,
                                        globalStyles.cartIconPositionDesktop,
                                        {
                                          [globalStyles.cartIconPositionMobile]: mobile
                                        }
                                      )}
                                    >
                                      <div
                                        className={cs(
                                          // iconStyles.icon,
                                          globalStyles.iconContainer
                                          // iconStyles.iconPlpCart
                                        )}
                                        onClick={() =>
                                          openPopup(
                                            productData,
                                            currency,
                                            isSale,
                                            mobile,
                                            isShared,
                                            productData.productId,
                                            list.name
                                          )
                                        }
                                      >
                                        <img src={addToBAg} />
                                      </div>
                                      <div
                                        className={cs(styles.addText, {
                                          [styles.forMobile]: mobile
                                        })}
                                      >
                                        ADD TO BAG
                                      </div>
                                    </div>
                                    <div className={styles.createWishlistPopup}>
                                      {activeWishlist == listIndex &&
                                        activeWishlistItem == productIndex && (
                                          <CreateWishlist
                                            hideWishlistPopup={
                                              hideWishlistPopup
                                            }
                                            wishlistName={list.name}
                                            id={pId}
                                            gtmPushWishlist={(
                                              addWishlist: boolean,
                                              listName: string
                                            ) =>
                                              gtmPushWishlist(
                                                addWishlist,
                                                listName,
                                                productData
                                              )
                                            }
                                          />
                                        )}
                                    </div>
                                  </div>
                                  <div className={styles.imageContent}>
                                    <p className={styles.productN}>
                                      <a href={productData.productUrl}>
                                        {productData.productName
                                          ? productData.productName
                                          : ""}{" "}
                                      </a>
                                    </p>
                                    <p
                                      className={cs(
                                        styles.productN,
                                        styles.productPrice
                                      )}
                                    >
                                      {isSale && productData.discount ? (
                                        <span className={styles.discountprice}>
                                          {productData.discountedPrice
                                            ? displayPriceWithCommas(
                                                productData.discountedPrice[
                                                  currency
                                                ],
                                                currency
                                              )
                                            : ""}{" "}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                      {isSale && productData.discount ? (
                                        <span className={styles.strikeprice}>
                                          {displayPriceWithCommas(
                                            productData.price[currency],
                                            currency
                                          )}
                                        </span>
                                      ) : (
                                        <span
                                          className={
                                            productData.badgeType == "B_flat"
                                              ? styles.discountprice
                                              : ""
                                          }
                                        >
                                          {displayPriceWithCommas(
                                            productData.price[currency],
                                            currency
                                          )}
                                        </span>
                                      )}
                                    </p>
                                    <span
                                      className={cs(
                                        globalStyles.errorMsg,
                                        globalStyles.gold,
                                        styles.errMsg,
                                        styles.errMsg1
                                      )}
                                    >
                                      {isSale &&
                                        showStockMessage &&
                                        `Only ${stock} Left!`}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className={styles.emptyProductBlock}>
                            <span>
                              There are no products saved in this list.
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <hr className={styles.deviderLine}></hr>
                  </div>
                </>
              );
            })
          ) : (
            <div className={cs(styles.awesome)} id="emptyWishlist">
              {items.length == 0 && emptyWishlistContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDetailPage;
