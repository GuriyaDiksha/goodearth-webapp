import loadable from "@loadable/component";
import React, { RefObject, SyntheticEvent } from "react";
import { connect } from "react-redux";
import cs from "classnames";
import { Props as PDPProps, State } from "./typings.d";
import initAction from "./initAction";
import metaAction from "./metaAction";
import MakerEnhance from "maker-enhance";
import { getProductIdFromSlug } from "utils/url";
import { AppState } from "reducers/typings";
import {
  ChildProductAttributes,
  PLPProductItem,
  Product
} from "typings/product";
import SecondaryHeader from "components/SecondaryHeader";
import Breadcrumbs from "components/Breadcrumbs";
import PdpImage from "./components/pdpImage";
import WeRecommendSlider from "components/weRecomend";
import CollectionProductsSlider from "components/moreCollection";
import WallpaperFAQ from "./components/WallpaperFAQ";

import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import { getProductSliderItems } from "selectors/productSlider";
import { Settings } from "react-slick";
import mapDispatchToProps from "./mappers/actions";
import MobileSlider from "../../components/MobileSlider";
import { HEADER_HEIGHT, SECONDARY_HEADER_HEIGHT } from "constants/heights";
import zoom from "images/zoom.svg";
import mobile3d from "images/3d/3DButton.svg";
import LazyImage from "components/LazyImage";
import * as valid from "utils/validate";
import { POPUP } from "constants/components";
import PairItWithSlider from "components/pairItWith";
import ModalStyles from "components/Modal/styles.scss";
import overlay from "images/3d/HelloARIcon.svg";
// import { Link } from "react-router-dom";
import noPlpImage from "images/noimageplp.png";
import iconFonts from "../../styles/iconFonts.scss";
import PDPLooksGridItem from "components/pairItWith/PDPLooksGridItem";
import PDPLooksItem from "components/pairItWith/PDPLooksItem";
import CookieService from "services/cookie";
// import PdpSkeleton from "./components/pdpSkeleton"
import Skeleton from "react-loading-skeleton";

// const VerticalImageSelector = loadable(() =>
//   import("components/VerticalImageSelector")
// );
// const ProductDetails = loadable(() => import("./components/productDetails"));
import ProductDetails from "./components/productDetails";
import PdpSlider from "components/PdpSlider";

const PDP_TOP_OFFSET = HEADER_HEIGHT + SECONDARY_HEADER_HEIGHT;
const sidebarPosition = PDP_TOP_OFFSET + 23;

const mapStateToProps = (state: AppState, props: PDPProps) => {
  const { slug } = props;
  const id = getProductIdFromSlug(slug);
  const data = (id && state.products[id]) as Product;

  const recommendedSliderItems =
    data && data.recommendedProducts && data.recommendedProducts.length
      ? getProductSliderItems(data.recommendedProducts, state.products)
      : [];
  const recommendedProducts =
    data && data.recommendedProducts && data.recommendedProducts.length
      ? data.recommendedProducts.map(id => state.products[id])
      : [];

  return {
    id,
    data,
    recommendedSliderItems,
    recommendedProducts,
    currency: state.currency,
    device: state.device,
    location: state.router.location,
    corporatePDP: state.meta.templateType === "corporate_pdp",
    isSale: state.info.isSale,
    plpMobileView: state.plplist.plpMobileView,
    scrollDown: state.info.scrollDown,
    showTimer: state.info.showTimer,
    customerGroup: state.user.customerGroup
  };
};

type Props = PDPProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class PDPContainer extends React.Component<Props, State> {
  state: State = {
    sidebarSticky: true,
    detailsSticky: true,
    activeImage: 0,
    detailStickyEnabled: true,
    mounted: false,
    showLooks:
      this.props.data && this.props.data.looksProducts
        ? this.props.data.looksProducts.length >= 2
        : false,
    showAddToBagMobile: true,
    showSecondary: true,
    loaded: false,
    goToIndex: {
      index: -1,
      value: ""
    }
  };
  myref: RefObject<any> = React.createRef();
  imageOffsets: number[] = [];
  sidebarRef: RefObject<HTMLDivElement> = React.createRef();
  detailsRef: RefObject<HTMLDivElement> = React.createRef();
  containerRef: RefObject<HTMLDivElement> = React.createRef();
  pdpURL = "";
  listPath = "";
  onImageClick = (index: number) => {
    const {
      updateComponentModal,
      changeModalState,
      device: { mobile }
    } = this.props;
    const images = this.getProductImagesData();
    updateComponentModal(
      POPUP.ZOOM,
      {
        images: images,
        startIndex: index,
        mobile: mobile,
        changeModalState: changeModalState,
        alt: this.props.data.altText
      },
      true
    );
    changeModalState(true);
    document.body.classList.add(globalStyles.fixed);
  };

  onBeforeUnload = () => {
    const pdpProductScroll = JSON.stringify({
      id: Number(
        (decodeURI(this.pdpURL)
          .split("_")
          .pop() as string).split("/")[0]
      ),
      timestamp: new Date(),
      source: this.listPath
    });
    localStorage.setItem("pdpProductScroll", pdpProductScroll);
  };

  componentDidMount() {
    this.pdpURL = this.props.location.pathname;
    if (
      !this.props.device.mobile &&
      this.imageOffsets.length < 1 &&
      this.props.data
    ) {
      this.getImageOffset();
    }
    dataLayer.push(function(this: any) {
      this.reset();
    });
    valid.pageViewGTM("PDP");
    dataLayer.push({
      event: "PdpView",
      PageURL: this.props.location.pathname,
      PageTitle: "virtual_pdp_view"
    });
    Moengage.track_event("Page viewed", {
      "Page URL": this.props.location.pathname,
      "Page Name": "PdpView"
    });
    const { data, currency } = this.props;
    valid.PDP(data, currency);
    const list = CookieService.getCookie("listPath");
    this.listPath = list || "";
    CookieService.setCookie("listPath", "");
    valid.moveChatDown();
    if (data && data.looksProducts && data.looksProducts.length >= 2) {
      valid.MoreFromCollectionProductImpression(
        data.looksProducts,
        "ShopByLook",
        currency
      );
    }
    // if (this.props.device.mobile) {
    //   this.getProductImagesData();
    //   const elem = document.getElementById("pincode-bar");
    //   elem && elem.classList.add(globalStyles.hiddenEye);
    //   const chatButtonElem = document.getElementById("chat-button");
    //   const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
    //   if (scrollToTopButtonElem) {
    //     scrollToTopButtonElem.style.bottom = "65px";
    //   }
    //   if (chatButtonElem) {
    //     chatButtonElem.style.bottom = "10px";
    //   }
    // }
    this.setState(
      {
        mounted: true
      },
      () => {
        window.setTimeout(() => {
          document.addEventListener("scroll", this.onScroll);
        }, 100);
      }
    );
    window.setTimeout(() => {
      if (this.state.loaded == false) {
        this.setState({
          loaded: true
        });
      }
    }, 1000);
    this.fetchMoreProductsFromCollection(this.props.id);
  }

  componentWillUnmount() {
    this.onBeforeUnload();
    document.removeEventListener("scroll", this.onScroll);
    if (this.props.device.mobile) {
      const elem = document.getElementById("pincode-bar");
      elem &&
        elem.classList.contains(globalStyles.hiddenEye) &&
        elem.classList.remove(globalStyles.hiddenEye);
      // const chatButtonElem = document.getElementById("chat-button");
      // const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
      // if (scrollToTopButtonElem) {
      //   scrollToTopButtonElem.style.bottom = "65px";
      // }
      // if (chatButtonElem) {
      //   chatButtonElem.style.bottom = "10px";
      // }
    }
    valid.moveChatUp();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { data, currency } = nextProps;
    if (this.props.id && this.props.id != nextProps.id) {
      valid.pageViewGTM("PDP");
      valid.PDP(nextProps.data, this.props.currency);
      if (data && data.looksProducts && data.looksProducts.length >= 2) {
        valid.MoreFromCollectionProductImpression(
          data.looksProducts,
          "ShopByLook",
          currency
        );
      }
      this.setState({
        sidebarSticky: true,
        detailsSticky: true,
        activeImage: 0,
        detailStickyEnabled: true,
        mounted: false
      });
      this.fetchMoreProductsFromCollection(nextProps.id);
    }
    if (this.props.data && !this.props.data.title && nextProps.data.title) {
      valid.PDP(nextProps.data, this.props.currency);
      if (data && data.looksProducts && data.looksProducts.length >= 2) {
        valid.MoreFromCollectionProductImpression(
          data.looksProducts,
          "ShopByLook",
          currency
        );
      }
    }
    if (!this.props.data && nextProps.data?.title) {
      valid.PDP(nextProps.data, this.props.currency);
      if (data && data.looksProducts && data.looksProducts.length >= 2) {
        valid.MoreFromCollectionProductImpression(
          data.looksProducts,
          "ShopByLook",
          currency
        );
      }
    }
    if (
      this.props.currency != nextProps.currency ||
      this.props.customerGroup != nextProps.customerGroup
    ) {
      this.fetchMoreProductsFromCollection(nextProps.id);
      this.props.fetchProduct(this.props.slug);
      this.setState({
        mounted: false
      });
    }
    if (nextProps.data && nextProps.data.looksProducts) {
      if (nextProps.data.looksProducts.length >= 2 && !this.state.showLooks) {
        this.setState({
          showLooks: true
        });
      } else if (
        nextProps.data.looksProducts.length < 2 &&
        this.state.showLooks
      ) {
        this.setState({
          showLooks: false
        });
      }
    }
  }

  componentDidUpdate(props: Props) {
    const { data } = this.props;
    if (!data) {
      return;
    }
    const productImages = this.getProductImagesData();
    if (props.data && props.data.id !== data.id) {
      document.removeEventListener("scroll", this.onScroll);
      window.scrollTo({
        top: 0
      });
      this.setState({
        showSecondary: true
      });

      const state: any = {
        sidebarSticky: true,
        detailsSticky: true,
        mounted: true
      };

      if (productImages.length === 1 && this.state.detailStickyEnabled) {
        state.detailStickyEnabled = false;
      }

      this.setState(state, () => {
        document.addEventListener("scroll", this.onScroll);
      });
    }
    if (this.props.currency != props.currency) {
      this.setState({
        mounted: true
      });
    }
  }

  onScroll = () => {
    const {
      device: { mobile }
    } = this.props;
    const { containerRef, sidebarRef, detailsRef, imageOffsets } = this;

    if (mobile && this.state.showLooks) {
      const looksElem = document.getElementById("looks-section");
      if (looksElem) {
        const showAddToBagMobile =
          looksElem.getBoundingClientRect().top - window.innerHeight > 0;
        if (showAddToBagMobile) {
          if (!this.state.showAddToBagMobile) {
            this.setState({
              showAddToBagMobile
            });
          }
        } else {
          if (this.state.showAddToBagMobile) {
            this.setState({
              showAddToBagMobile
            });
          }
        }
      } else if (!this.state.showAddToBagMobile) {
        this.setState({
          showAddToBagMobile: true
        });
      }
    }
    if (
      containerRef &&
      containerRef.current &&
      sidebarRef &&
      sidebarRef.current &&
      detailsRef &&
      detailsRef.current
    ) {
      const containerBounds = containerRef.current?.getBoundingClientRect();
      const sidebarBounds = sidebarRef.current?.getBoundingClientRect();
      const detailsBounds = detailsRef.current?.getBoundingClientRect();
      const scrollOffset = window.scrollY;

      let sidebarSticky = this.state.sidebarSticky,
        detailsSticky = this.state.detailsSticky,
        update = false;
      const activeImage = this.state.activeImage;

      const containerBottom = Math.floor(containerBounds.bottom);
      if (sidebarSticky) {
        if (Math.floor(sidebarBounds.bottom) >= containerBottom) {
          sidebarSticky = false;
          update = true;
        }
      } else if (Math.floor(sidebarBounds.top) >= sidebarPosition) {
        sidebarSticky = true;
        update = true;
      }

      if (detailsSticky) {
        if (
          Math.floor(detailsBounds.bottom) >= containerBottom &&
          detailsSticky
        ) {
          detailsSticky = false;
          update = true;
        }
      } else if (Math.floor(detailsBounds.top) >= sidebarPosition) {
        detailsSticky = true;
        update = true;
      }

      let c = 0;
      let offset = 0;

      for (c; c < imageOffsets.length; c++) {
        offset += imageOffsets[c] + 6;

        if (scrollOffset < offset) {
          break;
        }
      }

      if (activeImage !== c && c < imageOffsets.length) {
        this.setState({
          activeImage: c
        });
      }

      update &&
        this.setState({
          sidebarSticky,
          detailsSticky
        });
    }
  };

  fetchMoreProductsFromCollection = (id: number | null) => {
    const { fetchMoreProductsFromCollection } = this.props;
    if (id) {
      fetchMoreProductsFromCollection(id);
    }
  };

  getProductImagesData = () => {
    const { data } = this.props;
    let sliderImages, images;
    if (data) {
      sliderImages = data.sliderImages;
      images = data.images;
    }
    return images ? images.concat(sliderImages || []) : [];
  };

  getImageOffset = () => {
    const productImages = this.getProductImagesData();
    // productImages?.map((image, index) => {
    //   const ele = document.getElementById(`img-${image.id}`) as HTMLDivElement;
    //   const { clientHeight } = ele;
    //   this.imageOffsets[index] = clientHeight;
    // });
  };

  getProductImages() {
    const productImages = this.getProductImagesData();
    if (productImages.length > 0) {
      const img = productImages?.[this.state.activeImage];
      // return productImages?.map((image, index) => {
      const onImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        const ele = event.currentTarget;
        const { naturalHeight, naturalWidth } = ele;
        const height = (ele.width * naturalHeight) / naturalWidth;
        this.imageOffsets[0] = height;
      };

      return (
        <div
          className={styles.productImageContainer}
          key={img.id}
          id={`img-${img.id}`}
        >
          <PdpImage
            alt={this.props.data.altText || this.props.data.title}
            {...img}
            index={this.state.activeImage}
            onClick={this.onImageClick}
            onLoad={onImageLoad}
          />
        </div>
      );
      // });
    } else {
      return [1, 2, 3].map((image, index) => {
        return (
          <div
            className={styles.productImageContainer}
            key={image}
            id={`img-${image}`}
          >
            <Skeleton duration={1} height={540} />
          </div>
        );
      });
    }
  }

  getProductDetails = () => {
    const {
      data,
      currency,
      device: { mobile },
      updateComponentModal,
      changeModalState,
      corporatePDP
    } = this.props;
    return (
      <ProductDetails
        showAddToBagMobile={this.state.showAddToBagMobile}
        toggelHeader={this.toggelHeader}
        corporatePDP={corporatePDP}
        data={data}
        key={data.sku}
        currency={currency}
        mobile={mobile}
        wishlist={[]}
        updateComponentModal={updateComponentModal}
        changeModalState={changeModalState}
        loading={false}
      />
    );
  };

  getRecommendedSection() {
    const {
      recommendedSliderItems,
      device: { mobile, tablet },
      currency,
      corporatePDP
    } = this.props;

    if (recommendedSliderItems.length < 4 || typeof document == "undefined") {
      return null;
    }

    const config: Settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      arrows: true,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            dots: false,
            arrows: true
          }
        }
      ]
    };
    return (
      <WeRecommendSlider
        data={recommendedSliderItems}
        recommendedProducts={this.props.recommendedProducts}
        setting={config as Settings}
        currency={currency}
        mobile={mobile || tablet}
        isSale={this.props.isSale}
        corporatePDP={corporatePDP}
      />
    );
  }

  updateMobileView = (plpMobileView: "list" | "grid") => {
    if (this.props.plpMobileView != plpMobileView) {
      this.props.updateMobileView(plpMobileView);
      CookieService.setCookie("plpMobileView", plpMobileView);
      valid.viewSelectionGTM(plpMobileView);
    }
  };

  getMoreCollectionProductsSection() {
    const {
      data: { collectionProducts = [] },
      device: { mobile }
    } = this.props;

    if (
      collectionProducts.length < (mobile ? 2 : 4) ||
      typeof document == "undefined"
    ) {
      return null;
    }

    const config: Settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 3,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: true,
            arrows: true
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            centerMode: true,
            className: "center",
            centerPadding: "20px",
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
      <CollectionProductsSlider
        data={collectionProducts}
        setting={config as Settings}
        mobile={mobile}
        currency={this.props.currency}
      />
    );
  }
  onSliderImageClick = (index: number) => {
    const images = this.getProductImagesData();
    const { id } = images[index];
    // const imageContainer = document.getElementById(`img-${id}`);

    // if (!imageContainer) {
    //   return;
    // }

    // const { top } = imageContainer?.getBoundingClientRect();

    // const scrollBy = top - PDP_TOP_OFFSET;
    // window.scrollBy(0, scrollBy);

    this.setState({
      activeImage: index
    });
  };

  getWallpaperFAQ = () => {
    const {
      device: { mobile },
      data: { categories }
    } = this.props;

    const isWallcovering =
      categories &&
      categories.filter(category =>
        category.toLowerCase().includes("wallcovering")
      ).length > 0;
    categories;
    if (!isWallcovering) {
      return null;
    }
    return <WallpaperFAQ mobile={mobile} />;
  };

  onEnquireClick = (id: number, partner?: string) => {
    const { updateComponentModal, changeModalState } = this.props;
    const mobile = this.props.device.mobile;
    updateComponentModal(
      // <CorporateEnquiryPopup id={id} quantity={quantity} />,
      POPUP.THIRDPARTYENQUIRYPOPUP,
      {
        id,
        partner: partner || ""
      },
      mobile ? true : false,
      mobile ? ModalStyles.bottomAlign : undefined
    );
    changeModalState(true);
  };

  onClickMobile3d = (e: any, code: string) => {
    const { updateComponentModal, changeModalState } = this.props;
    updateComponentModal(
      POPUP.HELLOARPOPUP,
      {
        code
      },
      true
    );
    changeModalState(true);
  };

  notifyMeClick = (product: PLPProductItem) => {
    const {
      categories,
      collections,
      priceRecords,
      discountedPriceRecords,
      childAttributes,
      title,
      discount,
      badgeType
    } = product;
    const {
      updateComponentModal,
      changeModalState,
      currency,
      isSale
    } = this.props;
    const selectedIndex = childAttributes?.length == 1 ? 0 : undefined;
    // childAttributes?.map((v, i) => {
    //   if (v.id === selectedSize?.id) {
    //     selectedIndex = i;
    //   }
    // });
    const index = categories.length - 1;
    let category = categories[index]
      ? categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");
    updateComponentModal(
      POPUP.NOTIFYMEPOPUP,
      {
        collection: collections && collections.length > 0 ? collections[0] : "",
        category: category,
        price: priceRecords[currency],
        currency: currency,
        childAttributes: childAttributes as ChildProductAttributes[],
        title: title,
        selectedIndex: selectedIndex,
        discount: discount,
        badgeType: badgeType,
        isSale: isSale,
        discountedPrice: discountedPriceRecords[currency],
        list: "pdp"
      },
      false,
      ModalStyles.bottomAlign
    );
    changeModalState(true);
  };
  getLooksSection = () => {
    const {
      currency,
      device: { mobile },
      data,
      showTimer
    } = this.props;
    return data ? (
      <>
        {mobile && (
          <div
            className={cs(
              styles.listGridBar,
              { [styles.listGridBarTimer]: showTimer },
              globalStyles.voffset5,
              {
                [styles.hide]: this.props.scrollDown
              }
            )}
          >
            <i
              key="grid-icon"
              className={cs(iconFonts.icon, iconFonts.iconGridView, {
                [styles.active]: this.props.plpMobileView == "grid"
              })}
              onClick={() => this.updateMobileView("grid")}
            />
            <i
              key="list-icon"
              className={cs(iconFonts.icon, iconFonts.iconListView, {
                [styles.active]: this.props.plpMobileView == "list"
              })}
              onClick={() => this.updateMobileView("list")}
            />
          </div>
        )}
        <div>
          <h2 id="looks-section" className={styles.header}>
            Shop The Look
          </h2>
          <div className={bootstrap.row}>
            {!mobile && (
              <div className={bootstrap.colMd4}>
                <div className={styles.looksMainImage}>
                  {/* <Link
                    to={data.url}
                    // onClick={gtmProductClick}
                  > */}
                  <LazyImage
                    alt={data.altText || data.title}
                    aspectRatio="62:93"
                    src={
                      data.lookImageUrl ||
                      (data.images?.[0]
                        ? data.images?.[0].productImage
                        : "/static/img/noimageplp.png")
                    }
                    className={styles.imageResultnew}
                    // isVisible={}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = noPlpImage;
                    }}
                  />
                  {/* </Link> */}
                </div>
              </div>
            )}
            {mobile && this.props.plpMobileView == "grid" ? (
              this.props.data.looksProducts &&
              this.props.data.looksProducts.map((item, index) => {
                return (
                  <div
                    className={cs(
                      bootstrap.colMd4,
                      bootstrap.col6,
                      styles.setWidth
                    )}
                    key={item.id}
                  >
                    <PDPLooksGridItem
                      page="ShopByLook"
                      position={index}
                      product={item}
                      addedToWishlist={false}
                      currency={currency}
                      key={item.id}
                      mobile={mobile}
                      isVisible={index < 3 ? true : undefined}
                      // onClickQuickView={this.onClickQuickView}
                      // isCorporate={this.state.corporoateGifting}
                      onEnquireClick={this.onEnquireClick}
                      notifyMeClick={this.notifyMeClick}
                    />
                  </div>
                );
              })
            ) : (
              <div
                className={cs(bootstrap.colMd8, styles.looksContainer, {
                  [styles.looksContainerListView]: mobile
                })}
              >
                <div className={bootstrap.row}>
                  {this.props.data.looksProducts &&
                    this.props.data.looksProducts.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className={cs(
                            styles.looksItemContainer,
                            bootstrap.colMd4
                          )}
                        >
                          <PDPLooksItem
                            page="ShopByLook"
                            position={i}
                            product={item}
                            addedToWishlist={false}
                            currency={currency || "INR"}
                            key={item.id}
                            mobile={mobile || false}
                            isCorporate={false}
                            notifyMeClick={this.notifyMeClick}
                            onEnquireClick={this.onEnquireClick}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    ) : (
      ""
    );
  };

  getPairItWithSection = () => {
    const {
      data: { pairItWithProducts = [] },
      device: { mobile }
    } = this.props;

    if (
      pairItWithProducts.length < (mobile ? 2 : 4) ||
      typeof document == "undefined"
    ) {
      return null;
    }

    const config: Settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 3,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            infinite: true,
            arrows: true
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1.1,
            centerMode: true,
            className: "center",
            centerPadding: "30px",
            slidesToScroll: 1,
            arrows: false
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            arrows: true
          }
        }
      ]
    };
    return (
      <PairItWithSlider
        data={pairItWithProducts}
        setting={config as Settings}
        mobile={mobile}
        currency={this.props.currency}
      />
    );
  };

  handleLooksClick = () => {
    const elem = document.getElementById("looks-section");
    if (elem) {
      const headerOffset = 130;
      const elemPos = elem.offsetTop;
      const offsetPos = elemPos - headerOffset;
      window.scroll({ top: offsetPos, behavior: "smooth" });
    }
  };

  getMobileZoomListener = (index: number) => {
    return () => {
      this.onImageClick(index);
    };
  };

  toggelHeader = (value: boolean) => {
    this.setState({
      showSecondary: value
    });
  };

  render() {
    const {
      data,
      device: { mobile, tablet }
    } = this.props;

    if (!data) {
      return null;
    }

    const { breadcrumbs } = data;
    const images: any[] = this.getProductImagesData();
    let iconIndex = -1;
    images?.map((data, i) => {
      if (data.code) {
        iconIndex = i;
      }
      return data.code != "";
    });
    let mobileSlides: any[] = [];
    if (mobile || tablet) {
      if (images.length > 0) {
        mobileSlides = images?.map(
          ({ id, productImage, icon, code }, i: number) => {
            return (
              <div key={id} className={globalStyles.relative}>
                <LazyImage
                  alt={data.altText || data.title}
                  aspectRatio="62:93"
                  src={productImage.replace("/Micro/", "/Medium/")}
                  className={globalStyles.imgResponsive}
                  onClick={this.getMobileZoomListener(i)}
                />
                {iconIndex > -1 ? (
                  icon ? (
                    <div className={styles.mobile3d}>
                      <img
                        src={mobile3d}
                        onClick={(e: any) => this.onClickMobile3d(e, code)}
                      ></img>
                    </div>
                  ) : (
                    <img
                      src={overlay}
                      className={cs({
                        [styles.mobileHelloicon]: mobile,
                        [styles.tabHelloicon]: tablet
                      })}
                      onClick={() => {
                        this.setState({
                          goToIndex: {
                            index: Math.random(),
                            value: iconIndex
                          }
                        });
                      }}
                    ></img>
                  )
                ) : (
                  ""
                )}
                <div
                  className={styles.mobileZoomIcon}
                  onClick={this.getMobileZoomListener(i)}
                >
                  <img src={zoom}></img>
                </div>
              </div>
            );
          }
        );
      } else {
        mobileSlides = [1].map((id, i: number) => {
          return (
            <div key={id} className={globalStyles.relative}>
              <Skeleton duration={1} height={560} />
            </div>
          );
        });
      }
    }

    const {
      activeImage,
      detailStickyEnabled,
      mounted,
      showSecondary
    } = this.state;

    return (
      <div
        className={cs(
          styles.pdpContainer,
          // { [styles.pdpContainer]: showSecondary },
          // { [styles.pdpSecondcontainer]: !showSecondary },
          { [styles.pdpContainerTimer]: this.props.showTimer },
          bootstrap.containerFluid,
          {
            [styles.mobile]: mobile
          }
        )}
      >
        {!mobile && showSecondary && (
          <SecondaryHeader>
            <Breadcrumbs
              levels={breadcrumbs}
              className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}
            />
          </SecondaryHeader>
        )}

        <div
          className={cs(bootstrap.row, styles.productSection)}
          ref={this.containerRef}
        >
          {mobile && (
            <div
              key={this.props.id?.toString()}
              className={cs(
                bootstrap.col12,
                globalStyles.mobileSliderContainer,
                { [styles.tabletSliderContainer]: tablet }
              )}
            >
              <MobileSlider val={this.state.goToIndex}>
                {mobileSlides}
              </MobileSlider>
              {this.state.showLooks && mobile && (
                <div
                  id="looks-btn-mobile"
                  className={cs(styles.looksBtnMobile, styles.looksBtn)}
                  onClick={this.handleLooksClick}
                >
                  shop the look
                </div>
              )}
            </div>
          )}
          {/* {!mobile && (
            <div
              className={cs(
                bootstrap.colMd1,
                bootstrap.offsetMd1,
                styles.sidebar,
                globalStyles.pageStickyElement
              )}
              ref={this.sidebarRef}
            >
              <div className={bootstrap.row}>
                <VerticalImageSelector
                  alt={data.altText || data.title}
                  images={images}
                  className={cs(
                    bootstrap.colSm10,
                    bootstrap.offsetSm1,
                    bootstrap.offsetMd0
                  )}
                  activeIndex={activeImage}
                  onImageClick={this.onSliderImageClick}
                /> 
              </div>
            </div>
          )} */}
          {!mobile && (
            <div
              className={cs(
                bootstrap.colMd4,
                bootstrap.dNone,
                bootstrap.dMdBlock,
                bootstrap.offsetMd1
              )}
            >
              {this.getProductImages()}
              {images && (
                <PdpSlider
                  alt={data.altText || data.title}
                  images={images}
                  className={cs(
                    bootstrap.colSm10,
                    bootstrap.offsetSm1,
                    bootstrap.offsetMd0
                  )}
                  activeIndex={activeImage}
                  onImageClick={this.onSliderImageClick}
                />
              )}
              {this.state.showLooks && !mobile && (
                <div
                  id="looks-btn"
                  className={styles.looksBtn}
                  onClick={this.handleLooksClick}
                >
                  shop the look
                </div>
              )}
              {this.state.showLooks && !mobile && (
                <div className={styles.looksBtnOverlay}></div>
              )}
            </div>
          )}

          <div
            className={cs(
              styles.detailsContainer,
              bootstrap.colLg5,
              bootstrap.col12,
              {
                [globalStyles.pageStickyElement]: !mobile && detailStickyEnabled
              }
            )}
            ref={this.detailsRef}
          >
            {this.getProductDetails()}
          </div>
        </div>
        {this.getWallpaperFAQ()}
        {mounted && (
          <MakerEnhance
            user="goodearth"
            index="1"
            href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
          />
        )}
        {this.state.showLooks && this.getLooksSection()}
        <div className={bootstrap.row}>{this.getPairItWithSection()}</div>
        <div className={cs(bootstrap.row)}>{this.getRecommendedSection()}</div>
        <div className={cs(bootstrap.row)}>
          {!this.state.showLooks && this.getMoreCollectionProductsSection()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPContainer);

export { initAction };

export { metaAction };
