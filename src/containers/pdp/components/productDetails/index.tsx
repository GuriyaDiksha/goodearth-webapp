import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  EventHandler,
  MouseEvent,
  useEffect,
  useLayoutEffect
} from "react";
import { Link } from "react-router-dom";
import cs from "classnames";
import { useStore, useSelector } from "react-redux";
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
// import CorporateEnquiryPopup from "components/CorporateEnquiryPopup";
import ThirdPartyEnquiryPopup from "components/ThirdPartyEnquiryPopup";
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
import { useLocation, useHistory } from "react-router";
import { AppState } from "reducers/typings";
import CustomerCareInfo from "components/CustomerCareInfo";

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
    gaVariant,
    groupedProducts,
    salesBadgeImage,
    fillerMessage,
    justAddedBadge,
    badgeType
  },
  corporatePDP,
  mobile,
  currency,
  isQuickview,
  changeModalState,
  updateComponentModal
}) => {
  const [productTitle, subtitle] = title.split("(");
  const { info } = useSelector((state: AppState) => state);
  // const [img] = images;

  const location = useLocation();
  const history = useHistory();
  const [gtmListType, setGtmListType] = useState("");
  const [
    selectedSize,
    setSelectedSize
  ] = useState<ChildProductAttributes | null>(
    childAttributes.length === 1 ? childAttributes[0] : null
  );

  useLayoutEffect(() => {
    setGtmListType(localStorage?.getItem("list") || "");
  });
  useEffect(() => {
    if (childAttributes.length === 1 && !selectedSize) {
      setSelectedSize(childAttributes[0]);
    }
  }, [childAttributes, selectedSize]);

  useEffect(() => {
    if (priceRecords[currency] == 0) {
      history.push("/error-page", {});
    }
  }, [currency, priceRecords[currency]]);

  const { dispatch } = useStore();
  const price =
    selectedSize && selectedSize.priceRecords
      ? selectedSize.priceRecords[currency]
      : priceRecords[currency];
  const discountPrices =
    selectedSize && selectedSize.discountedPriceRecords
      ? selectedSize.discountedPriceRecords[currency]
      : discountedPriceRecords[currency];

  const [sizeError, setSizeError] = useState("");
  const [quantity, setQuantity] = useState<number>(corporatePDP ? 10 : 1);

  const showError = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        "show-error"
      )[0] as HTMLDivElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 0);
  };

  useEffect(() => {
    if (corporatePDP) {
      setQuantity(10);
    } else {
      setQuantity(1);
    }
  }, [corporatePDP]);

  const onSizeSelect = useCallback(
    selected => {
      setSelectedSize(selected);
      setQuantity(1);
      setSizeError("");
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
  }, [height, width, currency]);

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

  const gtmPushAddToBag = () => {
    dataLayer.push({
      event: "addToCart",
      ecommerce: {
        currencyCode: currency,
        add: {
          products: [
            {
              name: title,
              id: childAttributes[0].sku,
              price: priceRecords[currency],
              brand: "Goodearth",
              category: collection,
              variant: gaVariant,
              quantity: quantity,
              list: localStorage.getItem("list")
            }
          ]
        }
      }
    });
  };

  const addToBasket = () => {
    if (!selectedSize) {
      setSizeError("Please select size");
      showError();
    } else {
      BasketService.addToBasket(dispatch, selectedSize.id, quantity)
        .then(() => {
          dispatch(showMessage(ADD_TO_BAG_SUCCESS));
          gtmPushAddToBag();
        })
        .catch(err => {
          dispatch(showMessage(err.response.data));
        });
    }
  };

  const setSelectedSKU = () => {
    let currentSKU = sku;
    if (selectedSize) {
      currentSKU = selectedSize.sku;
    }
    return currentSKU;
  };
  const onEnquireClick = () => {
    updateComponentModal(
      // <CorporateEnquiryPopup id={id} quantity={quantity} />,
      <ThirdPartyEnquiryPopup id={id} quantity={quantity} />,
      mobile ? true : false,
      mobile ? ModalStyles.bottomAlign : undefined
    );
    changeModalState(true);
  };

  const notifyMeClick = () => {
    let selectedIndex = undefined;

    childAttributes.map((v, i) => {
      if (v.id === selectedSize?.id) {
        selectedIndex = i;
      }
    });

    updateComponentModal(
      <NotifyMePopup
        collection={collection}
        price={priceRecords[currency]}
        currency={currency}
        childAttributes={childAttributes}
        title={title}
        selectedIndex={selectedIndex}
        discount={discount}
        badgeType={badgeType}
        isSale={info.isSale}
      />,
      false,
      ModalStyles.bottomAlign
    );
    changeModalState(true);
  };

  let allOutOfStock = true;
  childAttributes.forEach(({ stock }) => {
    if (stock > 0) {
      allOutOfStock = false;
    }
  });

  const button = useMemo(() => {
    let buttonText: string, action: EventHandler<MouseEvent>;
    if (corporatePDP) {
      buttonText = "Enquire Now";
      action = onEnquireClick;
    } else if (allOutOfStock || (selectedSize && selectedSize.stock == 0)) {
      buttonText = "Notify Me";
      action = notifyMeClick;
    } else {
      buttonText = "Add to Bag";
      action = addToBasket;
    }

    return <Button label={buttonText} onClick={action} />;
  }, [corporatePDP, selectedSize, quantity]);

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
          {images && (
            <div className={bootstrap.col12}>
              <img src={images[0]?.badgeImagePdp} width="100" />
            </div>
          )}

          {mobile && (
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
          )}
          <div
            className={cs(
              bootstrap.col12,
              styles.collectionHeader,
              globalStyles.voffset3
            )}
          >
            {collection && (
              <Link to={collectionUrl || "#"}> {collection} </Link>
            )}
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
            {info.isSale && discount && discountedPriceRecords ? (
              <span className={styles.discountedPrice}>
                {String.fromCharCode(currencyCodes[currency])}
                &nbsp;
                {discountPrices}
                <br />
              </span>
            ) : (
              ""
            )}
            {info.isSale && discount ? (
              <span className={styles.oldPrice}>
                {String.fromCharCode(currencyCodes[currency])}
                &nbsp;
                {price}
              </span>
            ) : (
              <span
                className={badgeType == "B_flat" ? globalStyles.cerise : ""}
              >
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
                  <span className={cs(styles.sizeErrorMessage, "show-error")}>
                    {sizeError}
                  </span>
                </div>
              </div>
            </div>
            {sizeChartHtml && !isQuickview && (
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
              <div
                className={cs(
                  bootstrap.col12,
                  bootstrap.colSm9,
                  styles.widgetQty
                )}
              >
                <Quantity
                  source="pdp"
                  key={selectedSize?.sku}
                  id={selectedSize?.id || 0}
                  minValue={corporatePDP ? 10 : minQuantity}
                  maxValue={corporatePDP ? 1000 : maxQuantity}
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
        {info.isSale && fillerMessage ? (
          <div
            className={cs(
              bootstrap.col12,
              bootstrap.colMd10,
              globalStyles.voffset3,
              styles.errorMsg
            )}
            dangerouslySetInnerHTML={{ __html: fillerMessage || "" }}
          ></div>
        ) : (
          ""
        )}
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
            className={cs(globalStyles.textCenter, globalStyles.voffset1, {
              [bootstrap.col9]: !corporatePDP,
              [styles.addToBagBtnContainer]: mobile,
              [bootstrap.colSm8]: !mobile,
              [bootstrap.colSm12]: corporatePDP && mobile
            })}
          >
            {button}
            {isQuickview ? (
              <Link
                to={url}
                className={styles.moreDetails}
                onClick={() => {
                  changeModalState(false);
                }}
              >
                view more details
              </Link>
            ) : (
              ""
            )}
          </div>
          <div
            className={cs(bootstrap.col3, globalStyles.textCenter, {
              [styles.wishlistBtnContainer]: mobile,
              [globalStyles.voffset1]: mobile,
              [globalStyles.hidden]: corporatePDP
            })}
          >
            <WishlistButton
              gtmListType={gtmListType}
              title={title}
              childAttributes={childAttributes}
              priceRecords={priceRecords}
              categories={categories}
              id={id}
              showText={!mobile}
              size={selectedSize ? selectedSize.size : undefined}
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
              link={`${__DOMAIN__}${location.pathname}`}
              mailSubject="Gifting Ideas"
              mailText={`${
                corporatePDP
                  ? `Here's what I found, check it out on Good Earth's web boutique`
                  : `Here's what I found! It reminded me of you, check it out on Good Earth's web boutique`
              } ${__DOMAIN__}${location.pathname}`}
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
              Vref. {setSelectedSKU()}
            </div>
          )}
          {!isQuickview && <CustomerCareInfo />}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetails);
