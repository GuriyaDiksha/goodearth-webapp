import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  EventHandler,
  MouseEvent
} from "react";
import cs from "classnames";
import { useStore } from "react-redux";
// components
import SizeSelector from "components/SizeSelector";
import Quantity from "components/quantity";
import Button from "components/Button";
import Share from "components/Share";
import Accordion from "components/Accordion";
import WishlistButton from "components/WishlistButton";
import SizeChartPopup from "../sizeChartPopup";
import ColorSelector from "components/ColorSelector";
import WallpaperPopup from "../wallpaperPopup";
import NotifyMePopup from "components/NotifyMePopup";
// services
import BasketService from "services/basket";
// actions
import { showMessage } from "actions/growlMessage";
// typings
import { Props } from "./typings";
import { ChildProductAttributes } from "typings/product";
// constants
import { currencyCodes } from "constants/currency";
// styles
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import ModalStyles from "components/Modal/styles.scss";
import { ADD_TO_BAG_SUCCESS } from "constants/messages";

const saleStatus = true;

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
    loyalityDisabled,
    shipping,
    compAndCare,
    sku,
    url,
    groupedProducts
  },
  corporatePDP,
  mobile,
  currency,
  isQuickview,
  changeModalState,
  updateComponentModal
}) => {
  const [productTitle, subtitle] = title.split("(");

  const [img] = images;

  const [
    selectedSize,
    setSelectedSize
  ] = useState<ChildProductAttributes | null>(
    childAttributes.length === 1 ? childAttributes[0] : null
  );

  const { dispatch } = useStore();
  const price =
    selectedSize && selectedSize.priceRecords
      ? selectedSize.priceRecords[currency]
      : priceRecords[currency];

  const [sizeError, setSizeError] = useState("");

  const onSizeSelect = useCallback(
    selected => {
      setSelectedSize(selected);
      setSizeError("");
    },
    [id, childAttributes, selectedSize]
  );

  const minQuantity = 1;
  const maxQuantity = selectedSize ? selectedSize.stock : 1;

  const [quantity, setQuantity] = useState<number>(1);

  const onQuantityChange = useCallback(
    value => {
      if (selectedSize) {
        setQuantity(value);
        setSizeError("");
      } else {
        setSizeError("Please select size");
      }
    },
    [selectedSize]
  );

  const onSizeChartClick = useCallback(() => {
    if (!sizeChartHtml) {
      return;
    }
    // renderModal(<SizeChartPopup html={sizeChartHtml} />);
    updateComponentModal(<SizeChartPopup html={sizeChartHtml} />);
    changeModalState(true);
  }, [sizeChartHtml]);

  const [childAttr] = childAttributes;
  const { size = "" } = childAttr || {};
  const [height, width] = size.match(/[0-9.]+/gim) || [];

  const onWallpaperClick = useCallback(() => {
    updateComponentModal(
      <WallpaperPopup
        price={priceRecords[currency]}
        currency={String.fromCharCode(currencyCodes[currency])}
      />
    );
    changeModalState(true);
  }, [height, width]);

  const accordionSections = useMemo(() => {
    return [
      {
        header: "Details",
        body: <div dangerouslySetInnerHTML={{ __html: details }}></div>,
        id: "details"
      },
      {
        header: "Dimensions & Care",
        body: <div dangerouslySetInnerHTML={{ __html: compAndCare }}></div>,
        id: "compAndCare"
      },
      {
        header: "Shipping & Handling",
        body: <div dangerouslySetInnerHTML={{ __html: shipping }}></div>,
        id: "shippAndHandle"
      }
    ];
  }, [details, compAndCare, compAndCare]);

  const addToBasket = async () => {
    if (!selectedSize) {
      setSizeError("Please select size");
    } else {
      await BasketService.addToBasket(dispatch, selectedSize.id, quantity);
      dispatch(showMessage(ADD_TO_BAG_SUCCESS));
    }
  };

  const onEnquireClick = () => {
    console.log(123);
  };

  const notifyMeClick = () => {
    let selectedIndex = 0;

    childAttributes.map((v, i) => {
      if (v.id === selectedSize?.id) {
        selectedIndex = i;
      }
    });

    updateComponentModal(
      <NotifyMePopup
        collection={collection}
        price={priceRecords[currency]}
        currency={String.fromCharCode(currencyCodes[currency])}
        childAttributes={childAttributes}
        title={title}
        selectedIndex={selectedIndex}
      />,
      false,
      ModalStyles.bottomAlign
    );
    changeModalState(true);
  };

  const button = useMemo(() => {
    let buttonText: string, action: EventHandler<MouseEvent>;
    if (corporatePDP) {
      buttonText = "Enquire Now";
      action = onEnquireClick;
    } else if (selectedSize && selectedSize.stock == 0) {
      buttonText = "Notify Me";
      action = notifyMeClick;
    } else {
      buttonText = "Add to Bag";
      action = addToBasket;
    }

    return <Button label={buttonText} onClick={action} />;
  }, [corporatePDP, selectedSize]);

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

  return (
    <div className={bootstrap.row}>
      <div
        className={cs(
          bootstrap.col10,
          bootstrap.offset1,
          bootstrap.colMd11,
          styles.sideContainer
        )}
      >
        <div className={cs(bootstrap.row)}>
          {img ? (
            img.badgeImagePDP ? (
              <div className={bootstrap.col12}>
                <img src={img.badgeImagePDP} width="100" />
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          {mobile && (
            <div className={cs(bootstrap.col12)}>
              <Share
                mobile={mobile}
                link={window.location.href}
                mailSubject="Gifting Ideas"
                mailText={
                  "Here's what I found! It reminded me of you, check it out on Good Earth's web boutique " +
                  window.location.href
                }
              />
            </div>
          )}
          <div className={cs(bootstrap.col12, styles.collectionHeader)}>
            {collection && <a href={collectionUrl}> {collection} </a>}
          </div>
          <div className={cs(bootstrap.col12, bootstrap.colMd8, styles.title)}>
            {productTitle}
            {subtitle && <p>({subtitle.split(")")[0]})</p>}
          </div>
          <div
            className={cs(
              bootstrap.col12,
              bootstrap.colMd4,
              styles.priceContainer,
              { [globalStyles.textCenter]: !mobile }
            )}
          >
            {saleStatus && discount && discountedPriceRecords ? (
              <span className={styles.discountedPrice}>
                {String.fromCharCode(currencyCodes[currency])}
                &nbsp;
                {discountedPriceRecords[currency]}
                <br />
              </span>
            ) : (
              ""
            )}
            {saleStatus && discount ? (
              <span className={styles.oldPrice}>
                {String.fromCharCode(currencyCodes[currency])}
                &nbsp;
                {price}
              </span>
            ) : (
              <span>
                {" "}
                {String.fromCharCode(currencyCodes[currency])}
                &nbsp;
                {price}
              </span>
            )}
          </div>
        </div>

        {groupedProducts?.length ? (
          <div className={cs(bootstrap.row, styles.spacer)}>
            <div className={bootstrap.col8}>
              <div className={bootstrap.row}>
                <div
                  className={cs(
                    bootstrap.col12,
                    bootstrap.colSm3,
                    styles.label,
                    styles.colour
                  )}
                >
                  Color
                </div>
                <div className={cs(bootstrap.col12, bootstrap.colSm9)}>
                  <ColorSelector products={groupedProducts} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {showSize ? (
          <div className={cs(bootstrap.row, styles.spacer)}>
            <div className={bootstrap.col8}>
              <div className={bootstrap.row}>
                <div
                  className={cs(
                    bootstrap.col12,
                    bootstrap.colSm3,
                    styles.label,
                    styles.size
                  )}
                >
                  Size
                </div>
                <div
                  className={cs(
                    bootstrap.col12,
                    bootstrap.colSm9,
                    styles.sizeContainer
                  )}
                >
                  <SizeSelector
                    sizes={childAttributes}
                    onChange={onSizeSelect}
                    selected={selectedSize ? selectedSize.id : undefined}
                  />
                  <span className={styles.sizeErrorMessage}>{sizeError}</span>
                </div>
              </div>
            </div>
            {sizeChartHtml && (
              <div
                className={cs(bootstrap.colSm4, styles.label, {
                  [globalStyles.textCenter]: !mobile
                })}
              >
                <span className={styles.sizeGuide} onClick={onSizeChartClick}>
                  {" "}
                  Size Guide{" "}
                </span>
              </div>
            )}
            {categories && categories.indexOf("Living > Wallcoverings") !== -1 && (
              <div
                className={cs(bootstrap.colSm4, styles.label, {
                  [globalStyles.textCenter]: !mobile
                })}
              >
                <span className={styles.sizeGuide} onClick={onWallpaperClick}>
                  {" "}
                  Wallpaper Calculator{" "}
                </span>
              </div>
            )}
          </div>
        ) : (
          ""
        )}
        <div className={cs(bootstrap.row, styles.spacer)}>
          <div className={bootstrap.col8}>
            <div className={bootstrap.row}>
              <div
                className={cs(
                  bootstrap.col12,
                  bootstrap.colSm3,
                  styles.label,
                  styles.quantity
                )}
              >
                Quantity
              </div>
              <div className={cs(bootstrap.col12, bootstrap.colSm9)}>
                <Quantity
                  id={selectedSize ? selectedSize.id : undefined}
                  minValue={minQuantity}
                  maxValue={maxQuantity}
                  currentValue={quantity}
                  onChange={onQuantityChange}
                  errorMsg={selectedSize ? "Available qty in stock is" : ""}
                />
              </div>
            </div>
          </div>
          {/* <div
            className={cs(
              bootstrap.col4,
              globalStyles.textCenter,
              styles.bridalSection
            )}
          >
            <div
              className={cs(
                iconStyles.icon,
                iconStyles.iconRings,
                styles.bridalRing
              )}
            ></div>
            <p className={styles.label}>add to registry</p>
          </div> */}
        </div>
        <div
          className={cs(
            bootstrap.row,
            styles.spacer,
            styles.actionButtonsContainer,
            {
              [globalStyles.voffset3]: mobile
            }
          )}
        >
          <div
            className={cs(
              bootstrap.colSm8,
              bootstrap.col9,
              globalStyles.textCenter,
              {
                [styles.addToBagBtnContainer]: mobile
              }
            )}
          >
            {button}
            {isQuickview ? (
              <a href={url} className={styles.moreDetails}>
                view more details
              </a>
            ) : (
              ""
            )}
          </div>
          <div
            className={cs(
              bootstrap.colSm4,
              bootstrap.col3,
              globalStyles.textCenter,
              {
                [styles.wishlistBtnContainer]: mobile
              }
            )}
          >
            <WishlistButton
              id={id}
              showText={!mobile}
              iconClassName={cs({
                [styles.mobileWishlistIcon]: mobile
              })}
            />
          </div>
        </div>
        <div
          className={cs(
            bootstrap.col12,
            bootstrap.colMd9,
            globalStyles.voffset1
          )}
        >
          {loyalityDisabled ? (
            <p className={styles.errorMsg}>
              This product is not eligible for Cerise points accumulation.
            </p>
          ) : (
            ""
          )}
        </div>
        <div
          className={cs(
            bootstrap.col12,
            bootstrap.colMd9,
            globalStyles.voffset3
          )}
        >
          {!mobile && !isQuickview && (
            <Share
              mobile={mobile}
              link={window.location.href}
              mailSubject="Gifting Ideas"
              mailText={
                "Here's what I found! It reminded me of you, check it out on Good Earth's web boutique " +
                window.location.href
              }
            />
          )}

          <div>
            {!isQuickview && (
              <Accordion
                sections={accordionSections}
                headerClassName={styles.accordionHeader}
                bodyClassName={styles.accordionBody}
                defaultOpen="details"
              />
            )}
          </div>
          {!isQuickview && (
            <div className={cs(styles.sku, globalStyles.voffset4)}>
              Vref. {sku}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetails);
