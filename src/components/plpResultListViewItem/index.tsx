import React, { EventHandler, MouseEvent, useMemo } from "react";
import { Link } from "react-router-dom";
import { PLPResultItemProps } from "./typings";
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
import * as valid from "utils/validate";
import Button from "components/Button";
import MobileSlider from "components/MobileSlider";

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
    notifyMeClick
  } = props;
  const code = currencyCode[currency as Currency];
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

  const onClickQuickview = (): void => {
    onClickQuickView ? onClickQuickView(product.id) : "";
  };

  const gtmProductClick = () => {
    valid.plpProductClick(product, page, currency, position);
  };

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
      <Button
        className={cs(
          styles.addToBagListView,
          bootstrapStyles.col6,
          bootstrapStyles.offset3
        )}
        onClick={action}
        label={buttonText}
      />
    );
  }, []);
  const isStockAvailable = isCorporate || product.inStock;

  const mobileSlides =
    mobile &&
    product.sliderImages.map(({ id, productImage }, i: number) => {
      return (
        <div key={id} className={globalStyles.relative}>
          <LazyImage
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
    });
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
      <div className={styles.imageBoxnew} id={"" + product.id}>
        <Link to={product.url} onClick={gtmProductClick}>
          <MobileSlider>{mobileSlides}</MobileSlider>
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
              <p onClick={onClickQuickview}>quickview</p>
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
        <div className={cs(styles.actions, bootstrapStyles.row)}>
          {button}
          {mobile && !isCorporate && (
            <div
              className={cs(
                globalStyles.textCenter,
                bootstrapStyles.col3
                // globalStyles.mobileWishlist,
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
                mobile={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlpResultListViewItem;
