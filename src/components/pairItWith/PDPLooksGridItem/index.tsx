import React, { EventHandler, MouseEvent, useMemo } from "react";
import { Link } from "react-router-dom";
import { PLPResultItemProps } from "./typings.d";
import styles from "./styles.scss";
import { Currency, currencyCode } from "../../../typings/currency";
import cs from "classnames";
import bootstyles from "../../../styles/bootstrap/bootstrap-grid.scss";
// import { PartialChildProductAttributes } from "src/typings/product";
import noPlpImage from "images/noimageplp.png";
import WishlistButton from "components/WishlistButton";
import globalStyles from "styles/global.scss";
import LazyImage from "components/LazyImage";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import * as valid from "utils/validate";
import CookieService from "services/cookie";
import ButtonSmall from "components/ButtonSmall";

const PlpResultItem: React.FC<PLPResultItemProps> = (
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
    notifyMeClick
  } = props;
  const code = currencyCode[currency as Currency];
  // const {} = useStore({state:App})
  // const [primaryimage, setPrimaryimage] = useState(true);
  const { info } = useSelector((state: AppState) => state);

  const attribute: any = product.childAttributes || [];
  const totalStock = attribute.reduce(function(total: any, num: any) {
    return total + +num.stock;
  }, 0);
  // const sizeExit =
  //   attribute.filter(function(item: any) {
  //     return item.size;
  //   }).length > 0;

  const onClickQuickview = (): void => {
    onClickQuickView ? onClickQuickView(product.id) : "";
  };

  let allOutOfStock = true;
  product.childAttributes?.forEach(({ stock }) => {
    if (stock > 0) {
      allOutOfStock = false;
    }
  });

  const button = useMemo(() => {
    let buttonText: string, action: EventHandler<MouseEvent>;
    if (isCorporate) {
      buttonText = "Enquire Now";
      action = () => onEnquireClick(product.id);
    } else if (allOutOfStock) {
      buttonText = "Notify Me";
      action = () => notifyMeClick(product);
    } else {
      buttonText = "Add to Bag";
      action = () => notifyMeClick(product);
    }
    return (
      <ButtonSmall
        className={cs(
          styles.addToBagListView,
          bootstyles.col10,
          bootstyles.offset1
        )}
        onClick={action}
        label={buttonText}
      />
    );
  }, []);

  const gtmProductClick = () => {
    CookieService.setCookie("listPath", page);
    valid.plpProductClick(product, page, currency, position);
  };
  const image = product.lookImageUrl
    ? product.lookImageUrl
    : product.images?.[0]
    ? product.images[0].productImage
    : "/static/img/noimageplp.png";
  const isStockAvailable = isCorporate || product.inStock;
  return (
    <div className={styles.plpMain}>
      {product.salesBadgeImage && (
        <div className={styles.badgeImage}>
          <img src={product.salesBadgeImage} />
        </div>
      )}
      {product.justAddedBadge && !mobile && (
        <div className={styles.newBadgeImage}>
          <img src={product.justAddedBadge} />
        </div>
      )}
      <div
        className={styles.imageBoxnew}
        id={"" + product.id}
        // onMouseLeave={onMouseLeave}
      >
        {mobile && !isCorporate && (
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.mobileWishlist,
              {
                [styles.wishlistBtnContainer]: mobile
              }
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
            />
          </div>
        )}
        <Link to={product.url} onClick={gtmProductClick}>
          <LazyImage
            alt={product.altText || product.title}
            aspectRatio="62:93"
            src={image}
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
        {!mobile && (
          <div className={styles.combodiv}>
            <div
              className={
                isCorporate ? styles.imageHoverCorporate : styles.imageHover
              }
            >
              <p onClick={onClickQuickview}>add to bag</p>
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
        )}
      </div>
      <div className={styles.imageContent}>
        {isCollection ? (
          <p className={styles.collectionName}>{product.collections}</p>
        ) : (
          ""
        )}
        <p className={styles.productN}>
          <Link to={product.url}> {product.title} </Link>
        </p>
        <p className={styles.productN}>
          {info.isSale && product.discount ? (
            <span className={styles.discountprice}>
              {String.fromCharCode(...code)}{" "}
              {product.discountedPriceRecords[currency as Currency]}
            </span>
          ) : (
            ""
          )}
          {info.isSale && product.discount ? (
            <span className={styles.strikeprice}>
              {" "}
              {String.fromCharCode(...code)}{" "}
              {product.priceRecords[currency as Currency]}{" "}
            </span>
          ) : (
            <span
              className={
                product.badgeType == "B_flat" ? globalStyles.cerise : ""
              }
            >
              {String.fromCharCode(...code)}{" "}
              {product.priceRecords[currency as Currency]}
            </span>
          )}
        </p>
        {product.justAddedBadge && mobile && (
          <p className={styles.productN}>
            <span className={styles.mobileBadge}>
              <img src={product.justAddedBadge} />
            </span>
          </p>
        )}
        <div className={cs(styles.actions, bootstyles.row)}>{button}</div>
      </div>
    </div>
  );
};

export default PlpResultItem;
