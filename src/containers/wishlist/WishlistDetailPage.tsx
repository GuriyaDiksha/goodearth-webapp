import React, { useEffect, useState, useContext } from "react";
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
import cross from "./../../icons/wishlist_cross.svg";
import pencilIcon from "./../../icons/pencil.svg";
import { updateLoader } from "actions/info";
import Button from "components/Button";
import LoginService from "services/login";
import { updateNextUrl } from "actions/info";
import HeaderService from "services/headerFooter";
import { SearchFeaturedData } from "components/header/typings";
import { Link } from "react-router-dom";
import CreateWishlist from "components/WishlistButton/CreateWishlist";
import linkIcon from "./../../images/linkIcon.svg";
import CookieService from "../../services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { useHistory } from "react-router-dom";

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
  const { items, sharedItems } = useSelector(
    (state: AppState) => state.wishlist
  );
  const { owner_name, message } = useSelector(
    (state: AppState) => state.wishlist
  );
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
                  <div className=" text-center"></div>
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
        window.scrollTo(0, 0);
      }, 1000);
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
    const childAttributes = item.stockDetails.map((item: any) => {
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

  const removeProduct = (id: number, listName: string) => {
    WishlistService.removeFromWishlist(
      dispatch,
      id,
      undefined,
      isLoggedIn ? listName : undefined
    ).finally(() => {
      dispatch(updateLoader(false));
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
  };

  const openLogin = (url: string, isShareLinkClicked: boolean) => {
    //Stored this value for share wishlist popup
    localStorage.setItem("isShareLinkClicked", String(isShareLinkClicked));
    LoginService.showLogin(dispatch);
    if (url) {
      dispatch(updateNextUrl(url));
    }
  };

  const editWishlistItemPopupMobile = (id: number) => {
    dispatch(
      updateComponent(
        POPUP.ADDREMOVEWISHLISTNAMEPOPUP,
        { id },
        false,
        mobile ? ModalStyles.bottomAlignSlideUp : "",
        mobile ? "slide-up-bottom-align" : ""
      )
    );
    dispatch(updateModal(true));
  };

  const editWishlistItemPopup = (
    id: number,
    listIndex: any,
    ProductIndex: any
  ) => {
    setPId(id);
    setActiveWishlist(listIndex);
    setActiveWishlistItem(ProductIndex);
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
      {isLoggedIn && !isShared && (
        <SecondaryHeader>
          <div className={styles.secondryHeaderWrapper}>
            <div className={styles.heading}>SAVED ITEMS</div>
            <div
              className={cs(
                styles.heading,
                globalStyles.pointer,
                globalStyles.aquaHover
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
        className={cs(bootstrapStyles.row, styles.wishlistBlockOuter, {
          [styles.wishlistBlockOuterTimer]: showTimer
        })}
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
              &apos;s Saved List
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
                            <p className={styles.productN}>
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
                                styles.errMsg
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
                  <div key={listIndex} className={styles.listBlock}>
                    <div className={styles.wishlistHead}>
                      <div className={styles.wishlistHeading}>
                        <h3 className={styles.listName}>
                          {list.name} ({list.products.length})
                        </h3>
                        {!list.name.includes("Default") && (
                          <span
                            className={cs(styles.edit, globalStyles.aquaHover)}
                            onClick={() => editPopup(list.id, list.name)}
                          >
                            Edit
                          </span>
                        )}
                      </div>
                      {!isShared && (
                        <div
                          className={styles.shareList}
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
                      )}
                    </div>
                    {list.products.length > 0 ? (
                      <div
                        className={cs(styles.productBlock, bootstrapStyles.row)}
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
                                      className={cs(
                                        globalStyles.badgeContainer
                                      )}
                                    >
                                      {productData?.badge_text}
                                    </div>
                                  </div>
                                )}
                                {!isShared && (
                                  <>
                                    <img
                                      src={cross}
                                      alt="remove"
                                      className={cs(styles.iconCross)}
                                      onClick={() => {
                                        removeProduct(
                                          productData.productId,
                                          list.name
                                        );
                                      }}
                                    />
                                    {isLoggedIn && (
                                      <div
                                        className={cs(
                                          styles.pencilIconContainer
                                        )}
                                      >
                                        <img
                                          src={pencilIcon}
                                          alt="pencilIcon"
                                          className={cs(styles.iconPencil)}
                                          onClick={() =>
                                            mobile
                                              ? editWishlistItemPopupMobile(
                                                  productData.productId
                                                )
                                              : editWishlistItemPopup(
                                                  productData.productId,
                                                  listIndex,
                                                  productIndex
                                                )
                                          }
                                        />
                                      </div>
                                    )}
                                  </>
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
                                        isShared,
                                        productData.productId,
                                        list.name
                                      )
                                    }
                                  ></div>
                                </div>
                                <div className={styles.createWishlistPopup}>
                                  {activeWishlist == listIndex &&
                                    activeWishlistItem == productIndex && (
                                      <CreateWishlist
                                        hideWishlistPopup={hideWishlistPopup}
                                        id={pId}
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
                                <p className={styles.productN}>
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
                                    styles.errMsg
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
                        <span>There are no products saved in this list.</span>
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
