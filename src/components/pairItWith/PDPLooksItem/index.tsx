import React, { EventHandler, MouseEvent, useMemo } from "react";
import { Link } from "react-router-dom";
import { PLPResultItemProps } from "./typings";
// import "../../../styles/myslick.css";
// import "./slick.css";
import styles from "./styles.scss";
import { Currency } from "../../../typings/currency";
import cs from "classnames";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import { PartialChildProductAttributes } from "src/typings/product";
import noPlpImage from "images/noimageplp.png";
import WishlistButton from "components/WishlistButton";
import globalStyles from "styles/global.scss";
import LazyImage from "components/LazyImage";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { plpProductClick } from "utils/validate";
import CookieService from "services/cookie";
import { displayPriceWithCommas } from "utils/utility";
import Button from "components/Button";
import { Icons } from "components/dropdown/stories";
import iconStyles from "styles/iconFonts.scss";
import addBag from "../../../icons/GE- Icons-134.svg";
const PlpResultListViewItem: React.FC<PLPResultItemProps> = (
  props: PLPResultItemProps
) => {
  const {
    product,
    currency,
    // onClickQuickView,
    mobile,
    isVisible,
    isCollection,
    isCorporate,
    position,
    page,
    onEnquireClick,
    notifyMeClick,
    closeShopLookPopUp
  } = props;
  // const {} = useStore({state:App})
  // const [primaryimage, setPrimaryimage] = useState(true);
  const { info } = useSelector((state: AppState) => state);

  let allOutOfStock = true;
  product.childAttributes?.forEach(({ stock }) => {
    if (stock > 0) {
      allOutOfStock = false;
    }
  });
  // const onMouseEnter = (): void => {
  //   product.plpImages?.[1] ? setPrimaryimage(false) : "";
  // };
  const attribute: any = product.childAttributes || [];
  const totalStock = attribute.reduce(function(total: any, num: any) {
    return total + +num.stock;
  }, 0);
  const sizeExit =
    attribute.filter(function(item: any) {
      return item.size;
    }).length > 0;
  // const onMouseLeave = (): void => {
  //   product.plpImages?.[1] ? setPrimaryimage(true) : "";
  // };

  //   const onClickQuickview = (): void => {
  //     onClickQuickView ? onClickQuickView(product.id) : "";
  //   };

  const gtmProductClick = () => {
    CookieService.setCookie("listPath", page);
    plpProductClick(product, page, currency, position, info.isSale);
  };

  const button = useMemo(() => {
    // let buttonText: string;
    let action: EventHandler<MouseEvent>;
    if (isCorporate) {
      // buttonText = "Enquire Now";
      action = () => {
        // e.preventDefault();
        onEnquireClick(product.id, product.partner);
      };
    } else if (allOutOfStock) {
      // buttonText = "Notify Me";
      action = () => {
        // e.preventDefault();
        notifyMeClick(product);
      };
    } else {
      // buttonText = "Add to Bag";
      action = () => {
        // e.preventDefault();
        notifyMeClick(product);
      };
    }
    return (
      <>
        {/* <Button
        className={cs(
          // styles.addToBagListView,
          // styles.shopTheLookCta,
          bootstrapStyles.col7
          // { [styles.notifyMe]: allOutOfStock || isCorporate }
        )}
        onClick={action}
        label={buttonText}
        variant={
          allOutOfStock || isCorporate
            ? "outlineSmallMedCharcoalCta"
            : "outlineExtraSmallAquaCta"
        }
      /> */}
        <div
          className={cs(
            globalStyles.textCenter,
            globalStyles.cartIconPositionDesktop,
            { [globalStyles.cartIconPositionMobile]: mobile }
          )}
        >
          {/* <div
            className={cs(
              iconStyles.icon,
              globalStyles.iconContainer,
              iconStyles.iconPlpCart
            )}
            onClick={e => action(e)}
          ></div> */}

          <div
            className={cs(
              globalStyles.iconContainer

              // iconStyles.iconPlpCart,
            )}
          >
            <img onClick={e => action(e)} src={addBag} />
          </div>

          <div
            className={cs(styles.addText, { [styles.forMobile]: mobile })}
            onClick={e => action(e)}
          >
            ADD TO BAG
          </div>
        </div>
      </>
    );
  }, []);
  const isStockAvailable = isCorporate || product.inStock;

  //   const mobileSlides =
  //     mobile && product.plpSliderImages
  //       ? product.plpSliderImages.map((productImage, i: number) => {
  //           return (
  //             <div key={i} className={globalStyles.relative}>
  //               <LazyImage
  //                 aspectRatio="62:93"
  //                 src={productImage.replace("/Micro/", "/Medium/")}
  //                 isVisible={isVisible}
  //                 className={globalStyles.imgResponsive}
  //                 onError={(e: any) => {
  //                   e.target.onerror = null;
  //                   e.target.src = noPlpImage;
  //                 }}
  //               />
  //             </div>
  //           );
  //         })
  //       : [
  //           <div key={"no-image"} className={globalStyles.relative}>
  //             <LazyImage
  //               aspectRatio="62:93"
  //               src={noPlpImage}
  //               isVisible={isVisible}
  //               className={globalStyles.imgResponsive}
  //             />
  //           </div>
  //         ];
  const getImageSrc = () => {
    if (page == "ShopByLook") {
      let src = "";
      product.images?.map(item => {
        if (item.looks_tagged) {
          src = item.productImage;
        }
      });
      if (!src) {
        product.sliderImages?.map(item => {
          if (item.looks_tagged) {
            src = item.productImage.replace("/Micro/", "/Medium/");
          }
        });
      }
      return src || "/static/img/noimageplp.png";
    } else {
      return (
        product.lookImageUrl ||
        (product.images?.[0]
          ? product.images?.[0].productImage
          : "/static/img/noimageplp.png")
      );
    }
  };
  return (
    <div className={styles.plpMain}>
      {product.salesBadgeImage && (
        <div
          className={cs(
            { [styles.badgeImage]: !mobile },
            { [styles.badgeImageMobile]: mobile }
          )}
        >
          <img src={product.salesBadgeImage} />
        </div>
      )}

      <div className={styles.imageBoxnew} id={"" + product.id}>
        {product.justAddedBadge && (
          <div className={styles.newBadgeImage}>
            <img src={product.justAddedBadge} />
          </div>
        )}
        {!isCorporate && product?.badge_text && (
          <Link
            to={product?.url}
            className={cs(
              globalStyles.textCenter,
              globalStyles.badgePositionDesktop,
              globalStyles.pointer,
              { [globalStyles.badgePositionMobile]: mobile }
            )}
          >
            <div className={cs(globalStyles.badgeContainer, globalStyles.flex)}>
              {product?.badge_text}
            </div>
          </Link>
        )}
        {!isCorporate && (
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.desktopWishlist,
              { [globalStyles.mobileWishlistPlp]: mobile }
            )}
          >
            <WishlistButton
              gtmListType="Search"
              title={product.title}
              childAttributes={product.childAttributes}
              priceRecords={product.priceRecords}
              discountedPriceRecords={product.discountedPriceRecords}
              categories={product.categories}
              id={product.id}
              showText={false}
              key={product.id}
              mobile={false}
              badgeType={product?.badgeType}
              isPlpTile={true}
            />
          </div>
        )}
        {button}
        <Link
          to={product.url}
          onClick={() => {
            gtmProductClick();
            if (closeShopLookPopUp) closeShopLookPopUp();
          }}
        >
          {/* <MobileSlider>{mobileSlides}</MobileSlider> */}
          <LazyImage
            aspectRatio="62:93"
            src={getImageSrc()}
            alt={product.altText || product.title}
            className={styles.imageResultnew}
            isVisible={isVisible}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = noPlpImage;
            }}
          />
        </Link>
        <div
          className={cs(
            isStockAvailable
              ? globalStyles.hidden
              : totalStock > 0
              ? globalStyles.hidden
              : styles.outstock
          )}
        >
          <Link to={product.url}> NOTIFY ME</Link>
        </div>
      </div>
      <div className={styles.imageContent}>
        {isCollection ? (
          <p className={styles.collectionName}>{product.collection}</p>
        ) : (
          ""
        )}
        <p className={styles.productN}>
          <Link to={product.url}> {product.title} </Link>
        </p>
        <p className={styles.productN}>
          {info.isSale && product.discount ? (
            <span className={styles.discountprice}>
              {displayPriceWithCommas(
                product.discountedPriceRecords[currency as Currency],
                currency
              )}
            </span>
          ) : (
            ""
          )}
          {info.isSale && product.discount ? (
            <span className={styles.strikeprice}>
              {" "}
              {displayPriceWithCommas(
                product.priceRecords[currency as Currency],
                currency
              )}{" "}
            </span>
          ) : (
            <span
              className={product.badgeType == "B_flat" ? globalStyles.gold : ""}
            >
              {displayPriceWithCommas(
                product.priceRecords[currency as Currency],
                currency
              )}
            </span>
          )}
        </p>

        {!mobile && sizeExit && (
          <div
            className={cs(
              styles.productSizeList,
              // { [styles.productSizeListMobile]: mobile },
              bootstrapStyles.row
            )}
          >
            <div className={styles.productSize}> size</div>
            <div className="">
              <ul>
                {(props.product
                  .childAttributes as PartialChildProductAttributes[])?.map(
                  (data: PartialChildProductAttributes, i: number) => {
                    return (
                      <li
                        className={
                          +data.stock || isCorporate ? "" : styles.disabled
                        }
                        key={i}
                      >
                        {data.size}
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlpResultListViewItem;
