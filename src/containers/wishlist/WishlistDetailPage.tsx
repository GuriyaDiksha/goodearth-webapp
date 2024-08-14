import React, { useEffect, useState, useContext } from "react";
import WishlistService from "services/wishlist";
import { WishlistResponse } from "services/wishlist/typings";
import { useSelector, useDispatch, useStore } from "react-redux";
import styles from "./styles.scss";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import SecondaryHeader from "components/SecondaryHeader";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import UserContext from "contexts/user";
import { AppState } from "reducers/typings";
import globalstyles from "styles/global.scss";
import { displayPriceWithCommas } from "utils/utility";
import iconStyles from "styles/iconFonts.scss";
import { updateComponent, updateModal } from "../../actions/modal";
import { POPUP } from "constants/components";
import ModalStyles from "components/Modal/styles.scss";
import cross from "./../../icons/wishlist_cross.svg";
import { updateLoader } from "actions/info";
import { decriptdata } from "utils/validate";
import { Context } from "components/Modal/context";
import Button from "components/Button";
import LoginService from "services/login";
import { updateNextUrl } from "actions/info";
import HeaderService from "services/headerFooter";
import { SearchFeaturedData } from "components/header/typings";
import { Link } from "react-router-dom";

// export type Props = {
//   featureData: WidgetImage[];
// }

const WishlistDetailPage = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { closeModal } = useContext(Context);
  const { mobile } = useSelector((state: AppState) => state.device);
  const { isSale } = useSelector((state: AppState) => state.info);
  const isShared = useSelector((state: AppState) =>
    state.router.location.pathname.includes("shared-wishlist")
  );
  const currency = useSelector((state: AppState) => state.currency);
  const [wishlistDataItem, setWishListItemData] = useState<WishlistResponse>({
    data: []
  });
  const [featureData, setFeatureData] = useState<SearchFeaturedData>({
    name: "",
    description: "",
    widgetImages: [],
    backgroundImage: "",
    enabled: false,
    products: [],
    id: 0
  });
  const dispatch = useDispatch();

  const fetchWishlistName = async () => {
    const data = await WishlistService.updateWishlist(dispatch);
    if (data) {
      setWishListItemData(data);
    }
  };
  useEffect(() => {
    fetchWishlistName();
  }, []);

  const fetchFeaturedContent = async () => {
    HeaderService.fetchSearchFeaturedContent(dispatch)
      .then(data => {
        console.log(data);
        if (data) {
          setFeatureData(data);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const emptyWishlistContent = (
    <div>
      <div
        className={cs(
          bootstrapStyles.row,
          { [globalStyles.marginT30]: !mobile },
          styles.minheight
        )}
      >
        {isLoggedIn && (
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

  const openPopup = (
    item: any,
    currency: any,
    isSale?: boolean,
    mobile?: boolean,
    isShared?: boolean
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
          quantity
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
          badge_text: item?.badge_text
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
      listName
    ).finally(() => {
      dispatch(updateLoader(false));
      fetchWishlistName();
    });
  };

  // const [errorMsg, setErrorMsg] = useState("");
  // const updateWishlistName = async (id: number, listName: string) =>{
  //   const data ={id,listName};
  //   WishlistService.updateWishlistName(dispatch, data)
  //   .then(res => {
  //     fetchWishlistName();
  //     setErrorMsg("");
  //     closeModal();
  //   })
  //   .catch((error: any) => {
  //     const data = decriptdata(error.response?.data);
  //     console.log(error);
  //     if(data.success == false){
  //       if(data.message=="Wishlist name already exist!"){
  //         setErrorMsg("List with same name exists");
  //       }
  //     }
  //   });
  // }

  const deleteWishlistName = (listName: string) => {
    WishlistService.removeFromWishlist(
      dispatch,
      undefined,
      undefined,
      listName
    );
    fetchWishlistName();
  };

  const editPopup = (id: number, name: string, updateWishlistData: any) => {
    dispatch(
      updateComponent(
        POPUP.EDITWISHLISTNAME,
        { id, name, updateWishlistData, deleteWishlistName },
        false
      )
    );
    dispatch(updateModal(true));
  };

  const creatWishlistPopup = (dataLength: number, updateWishlistData: any) => {
    dispatch(
      updateComponent(
        POPUP.CREATEWISHLIST,
        { dataLength, updateWishlistData },
        false
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

  return (
    <div
      className={cs(
        bootstrapStyles.containerFluid,
        globalStyles.voffset5,
        styles.wishlistPage
      )}
    >
      {console.log(wishlistDataItem.data.length)}
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
      {isLoggedIn && (
        <>
          <SecondaryHeader>
            <div
              className={cs(
                bootstrapStyles.colMd7,
                bootstrapStyles.offsetMd1,
                styles.careersHeader,
                globalStyles.verticalMiddle
              )}
            >
              <div>
                <span className={styles.heading}>SAVED ITEMS</span>
              </div>
            </div>
            <div
              className={cs(
                bootstrapStyles.colMd2,
                bootstrapStyles.offsetMd2,
                styles.careersHeader,
                globalStyles.verticalMiddle
              )}
            >
              <div>
                <span
                  className={cs(
                    styles.heading,
                    globalStyles.pointer,
                    globalStyles.aquaHover
                  )}
                  onClick={() =>
                    creatWishlistPopup(
                      wishlistDataItem.data.length,
                      fetchWishlistName
                    )
                  }
                >
                  + CREATE NEW LIST
                </span>
              </div>
            </div>
          </SecondaryHeader>
        </>
      )}
      <div className={cs(styles.wishlistBlock)}>
        {wishlistDataItem.data.length > 0 ? (
          wishlistDataItem.data.map((list, listIndex) => {
            return (
              <>
                <div key={listIndex} className={styles.listBlock}>
                  <div className={styles.wishlistHeading}>
                    <h3 className={styles.listName}>
                      {list.name} ({list.products.length})
                    </h3>
                    <span
                      className={cs(styles.edit, globalStyles.aquaHover)}
                      onClick={() =>
                        editPopup(list.id, list.name, fetchWishlistName)
                      }
                    >
                      Edit
                    </span>
                  </div>
                  {list.products.length > 0 ? (
                    <div className={styles.productBlock}>
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
                              bootstrapStyles.colMd3
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
                              {!isShared && (
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
          <div
            className={cs(styles.wishlistBlock, styles.awesome)}
            id="emptyWishlist"
          >
            {wishlistDataItem.data.length == 0 && emptyWishlistContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistDetailPage;
