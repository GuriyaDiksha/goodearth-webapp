import React, {
  EventHandler,
  useEffect,
  useMemo,
  useState,
  MouseEvent
} from "react";
import { Link, useHistory } from "react-router-dom";
import { PLPResultItemProps } from "./typings.d";
import styles from "./styles.scss";
import { Currency, currencyCode } from "../../typings/currency";
import cs from "classnames";
import bootstyles from "../../styles/bootstrap/bootstrap-grid.scss";
import { PartialChildProductAttributes } from "src/typings/product";
import noPlpImage from "images/noimageplp.png";
import WishlistButton from "components/WishlistButton";
import globalStyles from "styles/global.scss";
import LazyImage from "components/LazyImage";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import Price from "components/Price";
import SkeletonImage from "./skeleton";
import { plpProductClick, getPageType } from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import PlpResultImageSlider from "components/PlpResultImageSlider";
import plpThreeSixty from "./../../icons/plp-three-sixty.svg";
import iconStyles from "styles/iconFonts.scss";
import addToBAg from "../../icons/GE- Icons-134.svg";
const PlpResultItem: React.FC<PLPResultItemProps> = (
  props: PLPResultItemProps
) => {
  const {
    product,
    currency,
    onClickQuickView,
    mobile,
    isVisible,
    isCorporate,
    position,
    page,
    loader,
    isSearch,
    onEnquireClick,
    notifyMeClick,
    tablet
  } = props;
  const code = currencyCode[currency as Currency];
  // const {} = useStore({state:App})
  const [primaryimage, setPrimaryimage] = useState(true);
  const {
    info,
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);
  const [isAnimate, setIsAnimate] = useState(false);
  const history = useHistory();

  let allOutOfStock = true;
  product.childAttributes?.forEach(({ stock }) => {
    if (stock > 0) {
      allOutOfStock = false;
    }
  });

  useEffect(() => {
    if (mobile || tablet) {
      const val = localStorage.getItem("plp") || "";
      if (!val.split(",").includes(history.location.pathname)) {
        setIsAnimate(true);
      }
      const arr = val.split(",").includes(history.location.pathname)
        ? val
        : val
        ? `${val},${history.location.pathname}`
        : history.location.pathname;
      localStorage.setItem("plp", arr);
    }
  }, [mobile, tablet]);

  const onMouseEnter = (): void => {
    product.plpImages?.[1] ? setPrimaryimage(false) : "";
  };
  const attribute: any = product.childAttributes || [];
  const totalStock = attribute.reduce(function(total: any, num: any) {
    return total + +num.stock;
  }, 0);
  const sizeExit =
    attribute.filter(function(item: any) {
      return item.size;
    }).length > 0;
  const onMouseLeave = (): void => {
    product.plpImages?.[1] ? setPrimaryimage(true) : "";
  };

  const onClickQuickview = (): void => {
    onClickQuickView ? onClickQuickView(product.id) : "";
  };
  const redirect360IconClick = (productTitle: string): void => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "3d_icon_click",
        cta_name: productTitle
      });
    }
    if (product.url) {
      history.push(product.url);
    } else {
      console.warn("Product URL is not defined.");
    }
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
  const image = primaryimage
    ? product.plpImages
      ? product.plpImages[0]
      : ""
    : product.plpImages
    ? product.plpImages[1]
    : "";
  const isStockAvailable = isCorporate || product.inStock;
  const mobileSlides = product?.plpSliderImages
    ?.slice(0, 3)
    .map((productImage, i: number) => {
      return (
        <div key={i} className={globalStyles.relative}>
          <LazyImage
            alt={product.altText || product.title}
            aspectRatio="62:93"
            src={productImage.replace("/Micro/", "/Medium/")}
            isVisible={isVisible}
            className={cs(globalStyles.imgResponsive, {
              // ["firstImageContainer"]: position === 0 && !isSearch && isAnimate
            })}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = noPlpImage;
            }}
            containerClassName={
              position === 0 && !isSearch && isAnimate
                ? "firstImageContainer"
                : ""
            }
          />
          {i === 0 &&
          product?.plpImages?.[1] &&
          position === 0 &&
          !isSearch &&
          isAnimate ? (
            <LazyImage
              alt={product.altText || product.title}
              aspectRatio="62:93"
              src={product?.plpImages?.[1].replace("/Micro/", "/Medium/")}
              isVisible={isVisible}
              className={cs(globalStyles.imgResponsive)}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = noPlpImage;
              }}
              containerClassName={"secondImageContainer"}
            />
          ) : null}
        </div>
      );
    });

  const gaCall = (action: any) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "bag_quick_view",
        cta_location: page.toUpperCase() === "PLP" ? "PLP" : "Search Results"
      });
    }

    if (mobile) {
      action();
    } else {
      onClickQuickview();
    }
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
          { [globalStyles.cartIconPositionMobile]: mobile }
          // styles.wishlistBtnContainer
          // {
          //   [styles.wishlistBtnContainer]: mobile
          // }
        )}
        onClick={() => gaCall(action)}
      >
        {/* <div
          className={cs(
            iconStyles.icon,
            globalStyles.iconContainer,
            iconStyles.iconPlpCart,
          )}
          onClick={() => gaCall(action)}
        ></div> */}
        <div
          className={cs(
            globalStyles.iconContainer

            // iconStyles.iconPlpCart,
          )}
        >
          <img src={addToBAg} />
        </div>

        <div
          className={cs(styles.addText, { [styles.forMobile]: mobile })}
          onClick={() => gaCall(action)}
        >
          ADD TO BAG
        </div>
      </div>
      // <Buttons
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

  // return loader ? (
  //   <div className={styles.plpMain}>
  //     <SkeletonImage />
  //   </div>
  // ) :
  return (
    <div className={styles.plpMain}>
      {info.isSale && product.salesBadgeImage && (
        <div className={mobile ? styles.badgeImageMobile : styles.badgeImage}>
          <img src={product.salesBadgeImage} width="100" />
        </div>
      )}

      <div
        className={styles.imageBoxnew}
        id={"" + product.id}
        onMouseLeave={onMouseLeave}
      >
        {product.justAddedBadge && (
          <div className={styles.newBadgeImage}>
            <img src={product.justAddedBadge} width="100" />
          </div>
        )}

        {!isCorporate && (
          <div
            className={cs(
              globalStyles.textCenter,
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
              mobile={mobile}
              isPlpTile={true}
              badgeType={product?.badgeType}
            />
          </div>
        )}

        {!isCorporate && product?.is3dimage && (
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.threeSixtyIconPositionDesktop,
              { [globalStyles.threeSixtyIconPositionMobile]: mobile }
            )}
          >
            <div
              onClick={() => redirect360IconClick(product?.title)}
              className={cs(
                globalStyles.iconContainer,
                globalStyles.threeSixtyContainer,
                globalStyles.pointer
              )}
            >
              <img src={plpThreeSixty} alt="360" />
            </div>
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

        {button}
        <Link
          to={product.url}
          onMouseEnter={onMouseEnter}
          onClick={gtmProductClick}
        >
          {/* {mobile ? ( */}
          <PlpResultImageSlider mobile={mobile} productName={product.title}>
            {mobileSlides}
          </PlpResultImageSlider>
          {/* ) : (
            <LazyImage
              aspectRatio="62:93"
              src={image}
              alt={product.altText || product.title}
              className={styles.imageResultnew}
              isVisible={isVisible}
              onError={(e: any) => {
                e.target.onerror = null;
                e.target.src = noPlpImage;
              }}
            />
          )} */}
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
                {isCorporate
                  ? "quickview"
                  : isStockAvailable
                  ? "add to bag"
                  : "notify me"}
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
        {/* {isCollection ? (
          <p className={styles.collectionName}>{product.collection}</p>
        ) : (
          ""
        )} */}
        <p className={styles.productN}>
          <Link to={product.url}> {product.title} </Link>
        </p>
        {!(product.invisibleFields?.indexOf("price") > -1) && (
          <Price
            product={product}
            code={code}
            isSale={info.isSale}
            currency={currency}
          />
        )}

        {sizeExit && !mobile && (
          <div
            className={cs(
              styles.productSizeList,
              // { [styles.productSizeListMobile]: mobile },
              bootstyles.row
            )}
          >
            <div className={styles.productSize}> size</div>
            <div className="">
              {!(product.invisibleFields?.indexOf("size") > -1) && (
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
      </div>
    </div>
  );
};

export default PlpResultItem;
