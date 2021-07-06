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
import Quantity from "components/quantity";
import SizeSelector from "components/SizeSelector";
import Button from "components/Button";
import Share from "components/Share";
import Accordion from "components/Accordion";
import WishlistButton from "components/WishlistButton";
import ColorSelector from "components/ColorSelector";
import ReactHtmlParser from "react-html-parser";
import Loader from "components/Loader";
// services
import BasketService from "services/basket";
import BridalService from "services/bridal";
import ProductService from "services/product";
import HeaderService from "services/headerFooter";
import CookieService from "../../../../services/cookie";
// typings
import { Props } from "./typings";
import {
  ChildProductAttributes,
  PartialProductItem,
  Product
} from "typings/product";
// constants
import { currencyCodes } from "constants/currency";
// styles
import iconStyles from "../../../../styles/iconFonts.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import ModalStyles from "components/Modal/styles.scss";
import { updateStoreState } from "actions/header";
import { MESSAGE } from "constants/messages";
import { useLocation, useHistory } from "react-router";
import { AppState } from "reducers/typings";
import CustomerCareInfo from "components/CustomerCareInfo";
import { updateProduct } from "actions/product";
import * as valid from "utils/validate";
import { POPUP } from "constants/components";
import cushionFiller from "images/cushionFiller.svg";
import inshop from "../../../../images/inShop.svg";

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
    loyaltyDisabled,
    shipping,
    compAndCare,
    sku,
    url,
    gaVariant,
    groupedProducts,
    salesBadgeImage,
    fillerMessage,
    justAddedBadge,
    badgeType,
    invisibleFields
  },
  corporatePDP,
  mobile,
  currency,
  isQuickview,
  changeModalState,
  updateComponentModal,
  closeModal,
  source,
  showAddToBagMobile
}) => {
  const [productTitle, subtitle] = title.split("(");
  const {
    info,
    user: { bridalId, bridalCurrency }
  } = useSelector((state: AppState) => state);
  // const [img] = images;

  const location = useLocation();
  const history = useHistory();
  const [gtmListType, setGtmListType] = useState("");
  const [onload, setOnload] = useState(false);
  const [
    selectedSize,
    setSelectedSize
  ] = useState<ChildProductAttributes | null>(
    childAttributes.length === 1 ? childAttributes[0] : null
  );

  const [isRegistry, setIsRegistry] = useState<{ [x: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  // const items = basket.lineItems?.map(
  //   item => item.product.childAttributes[0].id
  // );
  const [addedToBag, setAddedToBag] = useState(false);
  // const [sizeerror, setSizeerror] = useState(false);
  // useEffect(() => {
  //   setAddedToBag(
  //     (selectedSize?.id && items.indexOf(selectedSize?.id) !== -1) as boolean
  //   );
  // }, [selectedSize]);
  useLayoutEffect(() => {
    setGtmListType("PDP");
    setOnload(true);
  });
  useEffect(() => {
    if (childAttributes.length === 1 && !selectedSize) {
      setSelectedSize(childAttributes[0]);
    }
    if (childAttributes.length > 0) {
      const registryMapping = {};
      childAttributes.map(child => {
        registryMapping[child.size] = child.isBridalProduct;
      });
      setIsRegistry(registryMapping);
    }
  }, [childAttributes, selectedSize]);

  useEffect(() => {
    if (childAttributes.length === 1) {
      setSelectedSize(childAttributes[0]);
    } else if (selectedSize) {
      const newSize = childAttributes.filter(
        child => child.id == selectedSize.id
      )[0];
      setSelectedSize(newSize);
    }
  }, [discountedPriceRecords]);
  useEffect(() => {
    if (priceRecords[currency] == 0) {
      history.push("/error-page", {});
    }
  }, [currency, priceRecords[currency]]);

  const { dispatch } = useStore();
  const price = corporatePDP
    ? priceRecords[currency]
    : selectedSize && selectedSize.priceRecords
    ? selectedSize.priceRecords[currency]
    : priceRecords[currency];
  const discountPrices =
    selectedSize && selectedSize.discountedPriceRecords
      ? selectedSize.discountedPriceRecords[currency]
      : discountedPriceRecords[currency];

  const [sizeError, setSizeError] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  const showError = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        "show-error"
      )[0] as HTMLDivElement;
      if (firstErrorField) {
        // firstErrorField.focus();
        // mobile &&
        firstErrorField.scrollIntoView({
          block: "center",
          behavior: "smooth"
        });
      }
    }, 0);
  };

  useEffect(() => {
    if (corporatePDP) {
      // setQuantity(10);
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
        setSizeError("Please select a Size to proceed");
      }
    },
    [selectedSize]
  );

  const onSizeChartClick = useCallback(() => {
    if (!sizeChartHtml) {
      return;
    }
    // renderModal(<SizeChartPopup html={sizeChartHtml} />);
    updateComponentModal(POPUP.SIZECHARTPOPUP, { html: sizeChartHtml });
    changeModalState(true);
  }, [sizeChartHtml]);

  const [childAttr] = childAttributes;
  const { size = "" } = childAttr || {};
  const [height, width] = size.match(/[0-9.]+/gim) || [];

  const onWallpaperClick = useCallback(() => {
    updateComponentModal(POPUP.WALLPAPERPOPUP, {
      price: priceRecords[currency],
      currency: String.fromCharCode(...currencyCodes[currency])
    });
    changeModalState(true);
  }, [height, width, currency]);

  const accordionSections = useMemo(() => {
    return [
      {
        header: "PRODUCT DETAILS",
        body: <div>{ReactHtmlParser(details)}</div>,
        id: "details"
      },
      {
        header: "Dimensions & Care",
        body: <div>{ReactHtmlParser(compAndCare)}</div>,
        id: "compAndCare"
      },
      {
        header: "Shipping & Handling",
        body: <div>{ReactHtmlParser(shipping)}</div>,
        id: "shippAndHandle"
      }
    ];
  }, [details, compAndCare, compAndCare]);

  const setSelectedSKU = () => {
    let currentSKU = sku;
    if (selectedSize) {
      currentSKU = selectedSize.sku;
    }
    return currentSKU;
  };
  const gtmPushAddToBag = () => {
    const index = categories.length - 1;
    let category = categories[index]
      ? categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");
    dataLayer.push({
      event: "addToCart",
      ecommerce: {
        currencyCode: currency,
        add: {
          products: [
            {
              name: title,
              id: setSelectedSKU(),
              price: discountPrices || price,
              brand: "Goodearth",
              category: category,
              variant: selectedSize?.size || "",
              quantity: quantity
            }
          ]
        }
      }
    });
  };

  const addToBasket = () => {
    if (!selectedSize) {
      setSizeError("Please select a Size to proceed");
      valid.errorTracking(
        ["Please select a Size to proceed"],
        window.location.href
      );
      showError();
    } else {
      BasketService.addToBasket(dispatch, selectedSize.id, quantity)
        .then(() => {
          setAddedToBag(true);
          setTimeout(() => {
            setAddedToBag(false);
          }, 3000);
          valid.showGrowlMessage(dispatch, MESSAGE.ADD_TO_BAG_SUCCESS);
          gtmPushAddToBag();
        })
        .catch(err => {
          if (typeof err.response.data != "object") {
            valid.showGrowlMessage(dispatch, err.response.data);
            valid.errorTracking([err.response.data], window.location.href);
          }
        });
    }
  };

  const checkAvailability = () => {
    if (!selectedSize) {
      setSizeError("Please select a Size to proceed");
      valid.errorTracking(
        ["Please select a Size to proceed"],
        window.location.href
      );
      showError();
    } else {
      setIsLoading(true);
      HeaderService.checkShopAvailability(dispatch, selectedSize.sku)
        .then(() => {
          setIsLoading(false);
          dispatch(updateStoreState(true));
        })
        .catch(err => {
          setIsLoading(false);
          if (typeof err.response.data != "object") {
            valid.showGrowlMessage(dispatch, err.response.data);
            valid.errorTracking([err.response.data], window.location.href);
          }
        });
    }
  };

  const addToRegistry = (event: React.MouseEvent) => {
    const formData: {
      productId: number;
      bridalProfileId: number;
      qtyRequested: number;
    } = {
      productId: 0,
      bridalProfileId: 0,
      qtyRequested: 0
    };
    let productId = -1;
    const element = event.currentTarget as HTMLElement;
    if (
      element.classList.contains(styles.active) ||
      (selectedSize && isRegistry[selectedSize.size])
    ) {
      valid.showGrowlMessage(dispatch, MESSAGE.ADD_TO_REGISTRY_AGAIN);
      return false;
    }
    if (childAttributes[0].size) {
      if (!selectedSize) {
        setSizeError("Please select a Size to proceed");
        showError();
        return false;
      }
      childAttributes.map(child => {
        if (selectedSize.size == child.size) {
          productId = child.id;
        }
      });
    } else {
      productId = childAttributes[0].id;
    }

    formData["productId"] = productId;
    formData["bridalProfileId"] = bridalId;
    formData["qtyRequested"] = quantity;
    BridalService.addToRegistry(dispatch, formData)
      .then(res => {
        valid.showGrowlMessage(dispatch, MESSAGE.ADD_TO_REGISTRY_SUCCESS);
        const registry = Object.assign({}, isRegistry);
        if (selectedSize) {
          registry[selectedSize.size] = true;
          setIsRegistry(registry);
        }
        if (productId) {
          ProductService.fetchProductDetails(dispatch, productId).then(
            product => {
              dispatch(
                updateProduct({ ...product, partial: false } as Product<
                  PartialProductItem
                >)
              );
            }
          );
        }
      })
      .catch(err => {
        const message = err.response.data.message;
        if (message) {
          valid.showGrowlMessage(dispatch, message);
        } else {
          valid.showGrowlMessage(dispatch, MESSAGE.ADD_TO_REGISTRY_FAIL);
        }
      });
    event.stopPropagation();
  };

  const onEnquireClick = () => {
    updateComponentModal(
      // <CorporateEnquiryPopup id={id} quantity={quantity} />,
      POPUP.THIRDPARTYENQUIRYPOPUP,
      {
        id: id,
        quantity: quantity
      },
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
    const index = categories.length - 1;
    let category = categories[index]
      ? categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");
    updateComponentModal(
      POPUP.NOTIFYMEPOPUP,
      {
        collection: collection,
        category: category,
        price: priceRecords[currency],
        currency: currency,
        childAttributes: childAttributes,
        title: title,
        selectedIndex: selectedIndex,
        discount: discount,
        badgeType: badgeType,
        isSale: info.isSale,
        discountedPrice: discountPrices,
        list: isQuickview ? "quickview" : "pdp"
      },
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

  const sizeSelectClick = () => {
    // setSizeerror(true);
    setSizeError("Please select a Size to proceed");
    showError();
  };

  const button = useMemo(() => {
    let buttonText: string, action: EventHandler<MouseEvent>;
    if (corporatePDP) {
      buttonText = "Enquire Now";
      action = onEnquireClick;
      // setSizeerror(false);
    } else if (allOutOfStock || (selectedSize && selectedSize.stock == 0)) {
      buttonText = "Notify Me";
      action = notifyMeClick;
      // setSizeerror(false);
    } else if (!selectedSize && childAttributes.length > 1) {
      buttonText = "Select Size";
      action = sizeSelectClick;
    } else {
      buttonText = addedToBag ? "Added!" : "Add to Bag";
      action = addedToBag ? () => null : addToBasket;
      // setSizeerror(false);
    }

    return <Button label={buttonText} onClick={action} />;
  }, [corporatePDP, selectedSize, addedToBag, quantity, currency, discount]);

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
  const withBadge = images && images.length && images[0].badgeImagePdp;
  return (
    <div className={bootstrap.row}>
      <div
        className={cs(
          bootstrap.col10,
          bootstrap.offset1,
          bootstrap.colMd11,
          styles.sideContainer,
          { [styles.marginT0]: withBadge }
        )}
      >
        {isLoading && <Loader />}
        <div className={cs(bootstrap.row)}>
          {images && images[0]?.badgeImagePdp && (
            <div className={bootstrap.col12}>
              <img
                src={images[0]?.badgeImagePdp}
                width="100"
                className={styles.badgeImg}
              />
            </div>
          )}

          {/* {mobile && (
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
          )} */}
          <div
            className={cs(bootstrap.col12, styles.collectionHeader, {
              [globalStyles.voffset3]: !withBadge
            })}
          >
            {collection && (
              <Link
                to={collectionUrl || "#"}
                onClick={closeModal ? closeModal : () => null}
              >
                {" "}
                {collection}{" "}
              </Link>
            )}
          </div>
          <div className={cs(bootstrap.col12, bootstrap.colMd8, styles.title)}>
            {productTitle}
            {subtitle && <p>({subtitle.split(")")[0]})</p>}
          </div>
          {!(invisibleFields && invisibleFields.indexOf("price") > -1) && (
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
                  {String.fromCharCode(...currencyCodes[currency])}
                  &nbsp;
                  {discountPrices}
                  <br />
                </span>
              ) : (
                ""
              )}
              {info.isSale && discount ? (
                <span className={styles.oldPrice}>
                  {String.fromCharCode(...currencyCodes[currency])}
                  &nbsp;
                  {price}
                </span>
              ) : (
                <span
                  className={badgeType == "B_flat" ? globalStyles.cerise : ""}
                >
                  {" "}
                  {String.fromCharCode(...currencyCodes[currency])}
                  &nbsp;
                  {price}
                </span>
              )}
            </div>
          )}
        </div>

        {groupedProducts?.length ? (
          <div
            className={cs(bootstrap.row, styles.spacer, {
              [styles.spacerQuickview]: isQuickview && withBadge
            })}
          >
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
                  <ColorSelector
                    products={groupedProducts}
                    onClick={closeModal ? closeModal : () => null}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {showSize ? (
          !(invisibleFields.indexOf("size") > -1) && (
            <div
              className={cs(bootstrap.row, styles.spacer, {
                [styles.spacerQuickview]: isQuickview && withBadge
              })}
            >
              <div className={mobile ? bootstrap.col12 : bootstrap.col8}>
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
                      isCorporatePDP={corporatePDP}
                      sizes={childAttributes}
                      onChange={onSizeSelect}
                      selected={selectedSize ? selectedSize.id : undefined}
                    />
                    <span className={cs(styles.sizeErrorMessage, "show-error")}>
                      {sizeError}
                    </span>
                    <span className={cs(styles.sizeErrorMessage)}>
                      {info.isSale &&
                        selectedSize &&
                        selectedSize.showStockThreshold &&
                        selectedSize.stock > 0 &&
                        `Only ${selectedSize.stock} Left!${
                          selectedSize.othersBasketCount > 0
                            ? ` *${selectedSize.othersBasketCount} others have this item in their bag.`
                            : ""
                        }`}
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
              {/* {sizeerror && mobile ? (
              <p className={styles.errorMsg}>Please select a size to proceed</p>
            ) : (
              ""
            )} */}
              {categories &&
                categories.filter(category =>
                  category.toLowerCase().includes("wallcovering")
                ).length > 0 && (
                  <div
                    className={cs(bootstrap.colSm4, styles.label, {
                      [globalStyles.textCenter]: !mobile
                    })}
                  >
                    <span
                      className={styles.sizeGuide}
                      onClick={onWallpaperClick}
                    >
                      {" "}
                      Wallpaper Calculator{" "}
                    </span>
                  </div>
                )}
            </div>
          )
        ) : (
          <span className={cs(styles.sizeErrorMessage)}>
            {info.isSale &&
              selectedSize &&
              selectedSize.stock > 0 &&
              selectedSize.showStockThreshold &&
              `Only ${
                selectedSize.stock
              } Left!${selectedSize.othersBasketCount &&
                ` *${selectedSize.othersBasketCount} others have this item in their bag.`}`}
          </span>
        )}
        <div
          className={cs(bootstrap.row, globalStyles.marginT30, {
            [styles.spacerQuickview]: isQuickview && withBadge
          })}
        >
          <div className={bootstrap.col8}>
            {!(invisibleFields.indexOf("quantity") > -1) && (
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
                    minValue={minQuantity}
                    maxValue={corporatePDP ? 1 : maxQuantity}
                    currentValue={quantity}
                    onChange={onQuantityChange}
                    // errorMsg={selectedSize ? "Available qty in stock is" : ""}
                  />
                </div>
              </div>
            )}
          </div>
          {bridalId !== 0 && bridalCurrency == currency && !corporatePDP && (
            <div
              className={cs(
                bootstrap.col4,
                globalStyles.textCenter,
                styles.bridalSection
              )}
              onClick={addToRegistry}
            >
              <div
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconRings,
                  styles.bridalRing,
                  {
                    [styles.active]:
                      selectedSize && isRegistry[selectedSize.size]
                  }
                )}
              ></div>
              <p
                className={cs(styles.label, {
                  [globalStyles.cerise]:
                    selectedSize && isRegistry[selectedSize.size]
                })}
              >
                {selectedSize && isRegistry[selectedSize.size]
                  ? "added"
                  : "add to registry"}
              </p>
            </div>
          )}
        </div>
        {info.isSale && fillerMessage ? (
          <div
            className={cs(
              bootstrap.col12,
              bootstrap.colMd10,
              globalStyles.voffset3,
              styles.errorMsg
            )}
          >
            <img
              src={cushionFiller}
              className={styles.cushionFiller}
              alt="cushion-filler-icon"
            />
            {ReactHtmlParser(fillerMessage)}
          </div>
        ) : (
          ""
        )}
        <div
          className={cs(
            bootstrap.row,
            styles.spacer,
            { [styles.spacerQuickview]: isQuickview && withBadge },
            styles.actionButtonsContainer,
            {
              [globalStyles.voffset3]: mobile
            }
          )}
        >
          <div
            className={cs(globalStyles.textCenter, globalStyles.voffset1, {
              [bootstrap.col8]: !corporatePDP,
              [styles.addToBagBtnContainer]: mobile,
              [bootstrap.colSm8]: !mobile,
              [bootstrap.colSm12]: corporatePDP && mobile,
              [globalStyles.hidden]: mobile && !showAddToBagMobile
            })}
          >
            {button}
            {onload && !info.isSale && !loyaltyDisabled && isQuickview ? (
              <p className={cs(styles.errorMsg, styles.notEligible)}>
                This product is not eligible for Cerise points accumulation.
              </p>
            ) : (
              ""
            )}
            {isQuickview ? (
              <Link
                to={url}
                className={cs(styles.moreDetails, { [styles.lh45]: withBadge })}
                onClick={() => {
                  changeModalState(false);
                  const listPath = `${source || "PLP"}`;
                  CookieService.setCookie("listPath", listPath);
                }}
              >
                view more details
              </Link>
            ) : (
              ""
            )}
          </div>
          <div
            className={cs(bootstrap.col4, globalStyles.textCenter, {
              [styles.wishlistBtnContainer]: mobile,
              [globalStyles.voffset1]: mobile,
              [globalStyles.hidden]: corporatePDP || !showAddToBagMobile
            })}
          >
            <WishlistButton
              gtmListType={gtmListType}
              title={title}
              childAttributes={childAttributes}
              priceRecords={priceRecords}
              discountedPriceRecords={discountedPriceRecords}
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
          className={cs(bootstrap.col12, bootstrap.colMd9, {
            [styles.quickviewLoyaltyMessage]: isQuickview,
            [globalStyles.voffset1]: !mobile,
            [globalStyles.voffset3]: mobile
          })}
        >
          {onload && !info.isSale && !loyaltyDisabled && !isQuickview ? (
            <p className={styles.errorMsg}>
              This product is not eligible for Cerise points accumulation.
            </p>
          ) : (
            ""
          )}
        </div>
        {!isQuickview && (
          <div
            className={cs(
              bootstrap.col12,
              bootstrap.colMd9,
              globalStyles.voffset3
            )}
          >
            <img
              alt="goodearth-logo"
              src={inshop}
              style={{
                width: "17px",
                height: "17px",
                cursor: "pointer",
                marginRight: "8px"
              }}
            />
            <span
              className={styles.shopAvailability}
              onClick={checkAvailability}
            >
              {" "}
              Check in-shop availability{" "}
            </span>
          </div>
        )}
        <div
          className={cs(
            bootstrap.col12,
            bootstrap.colMd9,
            globalStyles.voffset3
          )}
        >
          {/* {!mobile && !isQuickview && (
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
          )} */}
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
          {!isQuickview && (
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
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetails);
