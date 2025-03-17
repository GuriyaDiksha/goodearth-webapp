import React, { EventHandler, MouseEvent, useMemo } from "react";
import { Link } from "react-router-dom";
import { PLPResultItemProps } from "./typings";
import "../../styles/myslick.css";
import "./slick.css";
import styles from "./styles.scss";
import { Currency, currencyCode } from "../../typings/currency";
import cs from "classnames";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import { PartialChildProductAttributes } from "src/typings/product";
import noPlpImage from "images/noimageplp.png";
import WishlistButton from "components/WishlistButton";
import globalStyles from "styles/global.scss";
import LazyImage from "components/LazyImage";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { getPageType, plpProductClick } from "utils/validate";
import CookieService from "services/cookie";
import Price from "components/Price";
import SkeletonImage from "components/plpResultItem/skeleton";
import { GA_CALLS } from "constants/cookieConsent";
import iconStyles from "styles/iconFonts.scss";
import plpThreeSixty from "./../../icons/plp-three-sixty.svg";
import PlpResultImageSlider from "components/PlpResultImageSlider";

const PlpResultListViewItem: React.FC<PLPResultItemProps> = (
  props: PLPResultItemProps
) => {
  const {
    product,
    currency,
    onClickQuickView,
    mobile,
    isVisible,
    isCollection,
    isCorporate,
    position,
    page,
    onEnquireClick,
    notifyMeClick,
    loader
  } = props;
  const code = currencyCode[currency as Currency];
  // const {} = useStore({state:App})
  // const [primaryimage, setPrimaryimage] = useState(true);
  const {
    info,
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);

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

  const onClickQuickview = (): void => {
    onClickQuickView ? onClickQuickView(product.id) : "";
  };

  const gtmProductClick = () => {
    CookieService.setCookie("listPath", page);
    plpProductClick(product, page, currency, position, info.isSale);
    const len = product.categories.length;
    const category = product.categories[len - 1];
    const l3Len = category.split(">").length;
    const l3 = category.split(">")[l3Len - 1];
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        "Event Category": "GA Ecommerce",
        "Event Action": "Product Click ",
        "Event Label": l3,
        "Time Stamp": new Date().toISOString(),
        "Page Url": location.href,
        "Page Type": getPageType(),
        "Product Category": category.replace(/>/g, "-"),
        "Login Status": isLoggedIn ? "logged in" : "logged out",
        "Page referrer url": CookieService.getCookie("prevUrl"),
        "Product Name": product.title,
        "Product ID": product.id
      });
    }
  };

  const gaCall = (action: any) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "bag_quick_view",
        cta_location: page.toUpperCase() === "PLP" ? "PLP" : "Search Results"
      });
    }

    action();
  };

  const button = useMemo(() => {
    // let buttonText: string,
    let action: EventHandler<MouseEvent>;
    if (isCorporate) {
      // buttonText = "Enquire Now";
      action = () => onEnquireClick(product.id, product.partner);
    } else if (allOutOfStock) {
      // buttonText = "Notify Me";
      action = () => notifyMeClick(product);
    } else {
      // buttonText = "Add to Bag";
      action = () => notifyMeClick(product);
    }
    return (
      <div
        className={cs(
          globalStyles.textCenter,
          globalStyles.cartIconPositionDesktop,
          globalStyles.listRightBottomPosition,
          { [globalStyles.cartIconPositionMobile]: mobile }
          // styles.wishlistBtnContainer
          // {
          //   [styles.wishlistBtnContainer]: mobile
          // }
        )}
      >
        <div
          className={cs(
            iconStyles.icon,
            globalStyles.iconContainer,
            iconStyles.iconPlpCart
          )}
          onClick={() => gaCall(action)}
        ></div>
      </div>
      // <Button
      //   className={cs(
      //     styles.addToBagListView,
      //     // styles.productBtn,
      //     bootstrapStyles.col8,
      //     globalStyles.btnFullWidth,
      //     { [styles.enquireNotifyMe]: isCorporate || allOutOfStock }
      //   )}
      //   onClick={action}
      //   label={buttonText}
      //   variant="smallAquaCta"
      // />
    );
  }, []);
  const isStockAvailable = isCorporate || product.inStock;

  const mobileSlides =
    mobile && product.plpSliderImages
      ? product.plpSliderImages.map((productImage, i: number) => {
          return (
            <div key={i} className={globalStyles.relative}>
              <LazyImage
                alt={product.altText || product.title}
                aspectRatio="62:93"
                src={productImage.replace("/Micro/", "/Medium/")}
                isVisible={isVisible}
                className={globalStyles.imgResponsive}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = noPlpImage;
                }}
              />
            </div>
          );
        })
      : [
          <div key={"no-image"} className={globalStyles.relative}>
            <LazyImage
              alt={product.altText || product.title}
              aspectRatio="62:93"
              src={noPlpImage}
              isVisible={isVisible}
              className={globalStyles.imgResponsive}
            />
          </div>
        ];
  // return loader ? (
  //   <div className={styles.plpMain}>
  //     <SkeletonImage />
  //   </div>
  // ) :
  return (
    <div className={styles.plpMain}>
      {product.salesBadgeImage && (
        <div className={styles.badgeImage}>
          <img src={product.salesBadgeImage} />
        </div>
      )}

      <div className={styles.imageBoxnew} id={"" + product.id}>
        {product.justAddedBadge && (
          <div className={styles.newBadgeImage}>
            <img src={product.justAddedBadge} />
          </div>
        )}
        {!isCorporate && (
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.listRightPosition,
              globalStyles.desktopWishlist,
              { [globalStyles.mobileWishlistPlp]: mobile }
              // styles.wishlistBtnContainer
              // {
              //   [styles.wishlistBtnContainer]: mobile
              // }
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
              mobile={mobile} //sending false becuase icon height will be same as desktop
              isPlpTile={true}
              badgeType={product?.badgeType}
            />
          </div>
        )}
        {!isCorporate && product?.is3dimage && (
          <Link to={product?.url}>
            <div
              className={cs(
                globalStyles.textCenter,
                globalStyles.listRightBottomPosition,
                globalStyles.threeSixtyIconPositionDesktop,
                { [globalStyles.threeSixtyIconPositionMobile]: mobile }
              )}
            >
              <div
                className={cs(
                  globalStyles.iconContainer,
                  globalStyles.threeSixtyContainer
                )}
              >
                <img src={plpThreeSixty} alt="360" />
              </div>
            </div>
          </Link>
        )}

        {!isCorporate && product?.badge_text && (
          <Link
            to={product?.url}
            className={cs(
              globalStyles.textCenter,
              globalStyles.listLeftBottomPosition,
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
        {button}

        <Link to={product.url} onClick={gtmProductClick}>
          <PlpResultImageSlider mobile={mobile} productName={product.title}>
            {mobileSlides}
          </PlpResultImageSlider>
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
        {/* {!mobile && (
          <div className={styles.combodiv}>
            <div
              className={
                isCorporate ? styles.imageHoverCorporate : styles.imageHover
              }
            >
              <p onClick={onClickQuickview}>
                {isCorporate ? "quickview" : "add to bag"}
              </p>
            </div>
            {!isCorporate && (
              <div className={styles.imageHover}>
                <div
                  className={cs(globalStyles.textCenter, {
                    [styles.wishlistBtnContainer]: mobile
                  })}
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
                  />
                </div>
              </div>
            )}
          </div>
        )} */}
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
        {!(product.invisibleFields.indexOf("price") > -1) && (
          <Price
            product={product}
            code={code}
            isSale={info.isSale}
            currency={currency}
          />
        )}

        {sizeExit && (
          <div
            className={cs(
              styles.productSizeList,
              // { [styles.productSizeListMobile]: mobile },
              bootstrapStyles.row
            )}
          >
            <div className={styles.productSize}> size</div>
            <div className="">
              {!(product.invisibleFields.indexOf("size") > -1) && (
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
              )}
            </div>
          </div>
        )}
        {/* <div className={cs(styles.actions, bootstrapStyles.row)}> */}
        {/* {button} */}

        {/* </div> */}
      </div>
    </div>
  );
};

export default PlpResultListViewItem;
