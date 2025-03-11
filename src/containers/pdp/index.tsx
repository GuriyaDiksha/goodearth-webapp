// import loadable from "@loadable/component";
import React, { RefObject } from "react";
import { connect } from "react-redux";
import throttle from "lodash/throttle";
import cs from "classnames";
import { Props as PDPProps, State } from "./typings.d";
import initAction from "./initAction";
import metaAction from "./metaAction";
import DockedPanel from "./docked";
import MakerEnhance from "maker-enhance";
import { getProductIdFromSlug } from "utils/url";
import { AppState } from "reducers/typings";
import {
  ChildProductAttributes,
  PLPProductItem,
  Product
} from "typings/product";
import Breadcrumbs from "components/Breadcrumbs";
import WeRecommendSlider from "components/weRecomend";
import CollectionProductsSlider from "components/moreCollection";
import WallpaperFAQ from "./components/WallpaperFAQ";

import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import { getProductSliderItems } from "selectors/productSlider";
import Slider, { Settings } from "react-slick";
import mapDispatchToProps from "./mappers/actions";
import MobileSlider from "../../components/MobileSlider";
import { HEADER_HEIGHT, SECONDARY_HEADER_HEIGHT } from "constants/heights";
import zoom from "images/zoom.svg";
// import mobile3d from "images/3d/3DButton.svg";
import LazyImage from "components/LazyImage";
import "./index.css";
import {
  moveChatUp,
  PDP,
  getPageType,
  pageViewGTM,
  moveChatDown,
  MoreFromCollectionProductImpression,
  viewSelectionGTM
} from "utils/validate";
import { POPUP } from "constants/components";
import PairItWithSlider from "components/pairItWith";
import ModalStyles from "components/Modal/styles.scss";
// import overlay from "images/3d/HelloARIcon.svg";
// import { Link } from "react-router-dom";
import noPlpImage from "images/noimageplp.png";
// import iconFonts from "../../styles/iconFonts.scss";
import PDPLooksGridItem from "components/pairItWith/PDPLooksGridItem";
import PDPLooksItem from "components/pairItWith/PDPLooksItem";
import CookieService from "services/cookie";
// import PdpSkeleton from "./components/pdpSkeleton"
import Skeleton from "react-loading-skeleton";
import ProductDetails from "./components/productDetails";
// import PdpSlider from "components/PdpSlider";
import PDPImagesContainer from "./components/PDPImagesContainer";

// import activeGrid from "images/plpIcons/active_grid.svg";
// import inactiveGrid from "images/plpIcons/inactive_grid.svg";
// import activeList from "images/plpIcons/active_list.svg";
// import inactiveList from "images/plpIcons/inactive_list.svg";
// import Counter from "components/ProductCounter/counter";
import { GA_CALLS } from "constants/cookieConsent";
// import { product } from "reducers/product";
// import pdp_top from "images/3d/pdp_top.svg";
import button_image from "images/3d/button_image.svg";
import Mobile360 from "./../../icons/360mobile.svg";
import ShopTheLookPopup from "components/Popups/ShopTheLook";
// import ReactPlayer from "react-player";

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
    customerGroup: state.user.customerGroup,
    meta: state.meta,
    selectedSizeId: state.header.sizeChartData.selected,
    isLoggedIn: state.user.isLoggedIn
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
    },
    imageHover: false,
    showDock: false,
    selectedSize: null,
    pdpButton: null,
    shopShopLookPopup: false
  };

  myref: RefObject<any> = React.createRef();
  bottomDockRef: RefObject<any> = React.createRef();
  imageOffsets: number[] = [];
  sidebarRef: RefObject<HTMLDivElement> = React.createRef();
  detailsRef: RefObject<HTMLDivElement> = React.createRef();
  containerRef: RefObject<HTMLDivElement> = React.createRef();
  pdpURL = "";
  listPath = "";
  imageIntervalID: null | number = null;

  onImageClick = (index: number) => {
    const {
      updateComponentModal,
      changeModalState,
      device: { mobile, tablet },
      data,
      corporatePDP,
      selectedSizeId,
      currency
    } = this.props;
    const images = this.getProductImagesData();

    const selectedSize = data?.childAttributes?.filter(
      item => item.id == selectedSizeId
    )[0];

    const price = corporatePDP
      ? data.priceRecords[currency]
      : selectedSize && selectedSize?.priceRecords
      ? selectedSize?.priceRecords[currency]
      : data?.priceRecords[currency];

    const discountPrices =
      selectedSize && selectedSize?.discountedPriceRecords
        ? selectedSize?.discountedPriceRecords[currency]
        : data?.discountedPriceRecords[currency];

    updateComponentModal(
      POPUP.ZOOM,
      {
        images: images,
        startIndex: index,
        mobile: mobile,
        tablet: tablet,
        changeModalState: changeModalState,
        alt: this.props?.data?.altText,
        data,
        buttoncall: this.returnPDPButton(),
        showPrice:
          data.invisibleFields && data.invisibleFields.indexOf("price") > -1,
        price,
        discountPrices
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

  setShowDock = () => {
    //bottom banner code
    const pdpCta = document.querySelectorAll(
      ".src-containers-pdp-components-productDetails-_styles_action-buttons-container"
    )[0];
    const footerStart = document.querySelectorAll(
      ".src-components-footer-_styles_footer-top"
    )[0];
    let ctaVisible = false;
    let footerVisible = false;
    let footerAboveHeader = false;
    const observer = new IntersectionObserver(
      entries => {
        //Check for CTA not visible
        entries.forEach(entry => {
          if (
            entry.target.classList.contains(
              "src-containers-pdp-components-productDetails-_styles_action-buttons-container"
            )
          ) {
            if (entry.target.getBoundingClientRect().bottom <= 115) {
              ctaVisible = false;
            }
            if (entry.target.getBoundingClientRect().bottom > 115) {
              ctaVisible = true;
            }
          }
          if (
            entry.target.classList.contains(
              "src-components-footer-_styles_footer-top"
            )
          ) {
            if (entry.intersectionRatio > 0.9) {
              footerVisible = true;
            } else if (entry.target.getBoundingClientRect().top < 90) {
              footerAboveHeader = true;
            } else {
              footerVisible = false;
            }
          }
          if (
            !ctaVisible &&
            !footerVisible &&
            (this.getPairItWithSection() ||
              this.state.showLooks ||
              this.getRecommendedSection() ||
              this.getMoreCollectionProductsSection())
          ) {
            this.setState({ showDock: true });
            this.bottomDockRef.current.style.maxHeight = 80 + "px";
          } else {
            this.setState({ showDock: false });
            this.bottomDockRef.current.style.maxHeight = 0 + "px";
          }
          if (!ctaVisible && !footerVisible && footerAboveHeader) {
            this.setState({ showDock: false });
            this.bottomDockRef.current.style.maxHeight = 0 + "px";
          }
          observer.disconnect();
        });
      },
      {
        rootMargin: "-110px 0px 0px 0px"
      }
    );
    if (pdpCta && this.bottomDockRef.current) {
      observer.observe(pdpCta);
    }

    if (footerStart && this.bottomDockRef.current) {
      observer.observe(footerStart);
    }
  };

  componentDidMount() {
    this.pdpURL = this.props.location.pathname;
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push(function(this: any) {
        this.reset();
      });

      pageViewGTM("PDP");
      dataLayer.push({
        event: "PdpView",
        PageURL: this.props.location.pathname,
        Page_Title: "virtual_pdp_view"
      });
    }

    if (userConsent.includes(GA_CALLS)) {
      Moengage.track_event("Page viewed", {
        "Page URL": this.props.location.pathname,
        "Page Name": "PdpView"
      });
    }

    const { data, currency } = this.props;

    let category = "",
      subcategoryname = "";
    if (data?.categories) {
      const index = data?.categories?.length - 1;
      category = data?.categories[index]
        ? data?.categories[index]?.replace(/\s/g, "")
        : "";
      const arr = category?.split(">");
      subcategoryname = arr[arr?.length - 1];
      category = category?.replace(/>/g, "/");
    }

    let variants = "";

    data?.childAttributes?.map((child: any) => {
      if (variants) {
        variants += "," + child.size;
      } else {
        variants += child.size;
      }
    });
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        "Event Category": "GA Ecommerce",
        "Event Action": "PDP",
        "Event Label": subcategoryname,
        "Product Category": category.replace("/", "-"),
        "Login Status": this.props.isLoggedIn ? "logged in" : "logged out",
        "Time Stamp": new Date().toISOString(),
        "Page Url": location.href,
        "Product Name": data?.title,
        "Product ID": data?.id,
        Variant: variants,
        "Page Type": getPageType(),
        "Page referrer url": CookieService.getCookie("prevUrl")
      });
    }
    PDP(data, currency, this.props.isSale);

    moveChatDown();

    if (data && data?.looksProducts && data?.looksProducts?.length >= 2) {
      MoreFromCollectionProductImpression(
        data.looksProducts,
        "ShopByLook",
        currency
      );
    }

    setTimeout(() => {
      const list = CookieService.getCookie("listPath");
      this.listPath = list || "";
      CookieService.setCookie("listPath", "");
    }, 2000);

    window.addEventListener(
      "scroll",
      throttle(() => {
        this.setShowDock();
      }, 50)
    );

    if (this.props.device.mobile) {
      this.getProductImagesData();
      const elem = document.getElementById("pincode-bar");
      elem && elem.classList.add(globalStyles.hiddenEye);
      const chatButtonElem = document.getElementById("chat-button");
      const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
      if (scrollToTopButtonElem) {
        scrollToTopButtonElem.style.bottom = "65px";
      }
      if (chatButtonElem) {
        chatButtonElem.style.bottom = "10px";
      }
    }
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

    this.fetchMoreProductsFromCollection(this.props?.id);

    this.startImageAutoScroll();

    window.addEventListener("scroll", event => {
      const windowSize = window.outerWidth;
      if (windowSize <= 992) {
        const windowScroll = window.scrollY;
        // const scrollAfterDiv = document.getElementById("more_collection_div");
        const dockedDiv = document.getElementById("docked_div");
        const scrollAfterDiv = document.getElementById("product_detail_sec");
        const headerContainer = document.getElementById("header_container");

        if (scrollAfterDiv) {
          const rect = scrollAfterDiv.getBoundingClientRect();
          const scrollBottom = rect.bottom + 100; // added 100 for padding of div
          //  console.log("bottom---" +scrollBottom);
          // console.log("y---" +rect);
          // console.log("window---" +windowScroll);
          if (dockedDiv) {
            if (windowScroll >= scrollBottom) {
              dockedDiv.style.cssText =
                "position: absolute;bottom: -7.5%;transition: transform .3s ease-out,-webkit-transform .3s ease-out;";
              if (scrollAfterDiv) {
                scrollAfterDiv.style.cssText = "z-index: 5";
              }
              if (headerContainer) {
                headerContainer.style.display = "block";
              }
            } else {
              dockedDiv.style.cssText =
                "position: fixed;bottom: 0;transition: transform .3s ease-out,-webkit-transform .3s ease-out;";
              if (scrollAfterDiv) {
                scrollAfterDiv.style.cssText = "z-index: 6";
              }
              if (headerContainer) {
                headerContainer.style.display = "none";
              }
            }
          }
        }
        // if (scrollAfterDiv) {
        //   const topPos = scrollAfterDiv.offsetTop;
        //   const height = scrollAfterDiv.offsetHeight;
        //   const newtopPos = topPos - (height);
        //   console.log(windowScroll+ "----" +newtopPos+ "----" +topPos)
        //   if (dockedDiv) {
        //     if (windowScroll >= newtopPos) {
        //       dockedDiv.style.cssText = "position: absolute;bottom: -7%;";
        //     } else {
        //       dockedDiv.style.cssText = "position: fixed;bottom: 0;";
        //     }
        //   }
        // }
      }
    });
  }

  componentWillUnmount() {
    this.onBeforeUnload();
    document.removeEventListener("scroll", this.onScroll);
    if (this.props.device.mobile) {
      const elem = document.getElementById("pincode-bar");
      const headerContainer = document.getElementById("header_container");

      elem &&
        elem.classList.contains(globalStyles.hiddenEye) &&
        elem.classList.remove(globalStyles.hiddenEye);
      const chatButtonElem = document.getElementById("chat-button");
      const scrollToTopButtonElem = document.getElementById("scrollToTop-btn");
      if (scrollToTopButtonElem) {
        scrollToTopButtonElem.style.bottom = "65px";
      }
      if (chatButtonElem) {
        chatButtonElem.style.bottom = "10px";
      }

      if (headerContainer) {
        headerContainer.style.display = "block";
      }
    }
    window.removeEventListener(
      "scroll",
      throttle(() => {
        this.setShowDock();
      }, 100)
    );
    moveChatUp();

    if (this.imageIntervalID) {
      clearInterval(this.imageIntervalID);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { data, currency } = nextProps;
    if (this.props?.id && this.props?.id != nextProps?.id) {
      pageViewGTM("PDP");
      PDP(nextProps?.data, this.props?.currency, this.props.isSale);
      if (data && data?.looksProducts && data?.looksProducts?.length >= 2) {
        MoreFromCollectionProductImpression(
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
      this.fetchMoreProductsFromCollection(nextProps?.id);
    }
    if (
      this.props?.data &&
      !this.props?.data?.title &&
      nextProps?.data?.title
    ) {
      PDP(nextProps?.data, this.props?.currency, this.props.isSale);
      if (data && data?.looksProducts && data?.looksProducts?.length >= 2) {
        MoreFromCollectionProductImpression(
          data.looksProducts,
          "ShopByLook",
          currency
        );
      }
    }
    if (!this.props?.data && nextProps.data?.title) {
      PDP(nextProps?.data, this.props?.currency, this.props.isSale);
      if (data && data?.looksProducts && data.looksProducts?.length >= 2) {
        MoreFromCollectionProductImpression(
          data?.looksProducts,
          "ShopByLook",
          currency
        );
      }
    }
    if (
      this.props?.currency != nextProps?.currency ||
      this.props?.customerGroup != nextProps?.customerGroup
    ) {
      this.fetchMoreProductsFromCollection(nextProps?.id);
      this.props.fetchProduct(this.props?.slug);
      this.setState({
        mounted: false
      });
    }
    if (nextProps?.data && nextProps?.data?.looksProducts) {
      if (
        nextProps.data?.looksProducts?.length >= 2 &&
        !this.state?.showLooks
      ) {
        this.setState({
          showLooks: true
        });
      } else if (
        nextProps?.data?.looksProducts?.length < 2 &&
        this.state?.showLooks
      ) {
        this.setState({
          showLooks: false
        });
      }
    }

    if (this.props.location.pathname != nextProps.location.pathname) {
      setTimeout(() => {
        window.scrollTo({
          top: 0
        });
      }, 100);
    }
  }

  componentDidUpdate(props: Props) {
    const {
      data,
      device: { mobile }
    } = this.props;
    if (!data) {
      return;
    }
    const productImages = this.getProductImagesData();
    if (props?.data && props.data?.id !== data?.id) {
      document.removeEventListener("scroll", this.onScroll);
      if (!this.state.showAddToBagMobile && mobile) {
        this.setState({
          showAddToBagMobile: true
        });
      }

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

      if (productImages?.length === 1 && this.state?.detailStickyEnabled) {
        state.detailStickyEnabled = false;
      }

      this.setState(state, () => {
        document.addEventListener("scroll", this.onScroll);
      });
    }
    if (this?.props?.currency != props?.currency) {
      this.setState({
        mounted: true
      });
    }
    if (this.state?.showDock) {
      if (this.bottomDockRef.current) {
        this.bottomDockRef.current.style.maxHeight = 80 + "px";
      }
    } else {
      if (this.bottomDockRef.current) {
        this.bottomDockRef.current.style.maxHeight = 0 + "px";
      }
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
          if (this.state?.showAddToBagMobile) {
            this.setState({
              showAddToBagMobile
            });
          }
        }
      } else if (!this.state?.showAddToBagMobile) {
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

      let sidebarSticky = this.state?.sidebarSticky,
        detailsSticky = this.state?.detailsSticky,
        update = false;
      const activeImage = this.state?.activeImage;

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

      if (activeImage !== c && c < imageOffsets?.length) {
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
      sliderImages = data?.sliderImages;
      images = data?.images;
    }
    return images ? images?.concat(sliderImages || []) : [];
  };

  prevImage = (afterStateChangeCallback?: () => void) => {
    const len = this.getProductImagesData().length;
    const active = this.state?.activeImage;
    this.setState(
      {
        activeImage: (len + ((active - 1) % len)) % len
      },
      () => {
        afterStateChangeCallback?.();
      }
    );
  };

  nextImage = (afterStateChangeCallback?: () => void) => {
    const len = this.getProductImagesData().length;
    const active = this.state?.activeImage;
    this.setState(
      {
        activeImage: (active + 1) % len
      },
      () => {
        afterStateChangeCallback?.();
      }
    );
  };

  stopAutoImageScroll = () => {
    if (this.imageIntervalID) {
      clearInterval(this.imageIntervalID);
    }
  };

  startImageAutoScroll = () => {
    // this.imageIntervalID = setInterval(this.nextImage, 7000);
  };

  resetAutoImageScroll = () => {
    if (this.imageIntervalID) {
      clearInterval(this.imageIntervalID);
    }
    this.startImageAutoScroll();
  };

  onClickImageArrowLeft = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    this.prevImage(this.stopAutoImageScroll);
  };

  onClickImageArrowRight = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    this.nextImage(this.stopAutoImageScroll);
  };

  getProductImages() {
    const productImages = this.getProductImagesData();
    let icon;
    for (const e of productImages) {
      if (e.icon) {
        icon = e.icon;
        break;
      }
    }
    // console.log(productImages)
    // if (productImages?.length > 0) {
    //   const img =
    //     productImages?.[this.state?.activeImage] ||
    //     productImages?.[this.state?.activeImage - 1];
    //   // return productImages?.map((image, index) => {
    //   const onImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    //     const ele = event.currentTarget;
    //     const { naturalHeight, naturalWidth } = ele;
    //     const height = (ele.width * naturalHeight) / naturalWidth;
    //     this.imageOffsets[0] = height;
    //   };
    return (
      <PDPImagesContainer
        productImages={productImages}
        onClick={this.onImageClick}
        is3d={icon || false}
        data={this.props.data}
        selectedSizeId={this.props.selectedSizeId}
        currency={this.props.currency}
        handleLooksClick={this.handleLooksClick}
        buttoncall={this.returnPDPButton()}
        productName={this.props.data?.title}
      />
      // <div
      //   className={styles.productImageContainer}
      //   key={img?.id}
      //   id={`img-${img?.id}`}
      //   onMouseEnter={() => {
      //     this.setState({ imageHover: true });
      //   }}
      //   onMouseLeave={() => {
      //     this.setState({ imageHover: false });
      //   }}
      // >
      //   <PdpImage
      //     alt={this.props.data?.altText || this.props.data?.title}
      //     {...img}
      //     index={this.state.activeImage}
      // onClick={this.onImageClick}
      //     onLoad={onImageLoad}
      //     iconAll={iconAll}
      //     codeAll={codeAll}
      //     data={this.props.data}
      //     corporatePDP={this.props.corporatePDP}
      //     selectedSizeId={this.props.selectedSizeId}
      //     currency={this.props.currency}
      //     buttoncall={this.state.pdpButton}
      //   />
      //   <div>
      //     <Counter
      //       id="pdp-image-counter"
      //       current={this.state.activeImage + 1}
      //       total={productImages.length}
      //     />
      //   </div>
      //   {productImages?.length > 1 && (
      //     <div
      //       className={cs(styles.imageArrowLeft, {
      //         [styles.show]: this.state.imageHover
      //       })}
      //       onClick={this.onClickImageArrowLeft}
      //     ></div>
      //   )}
      //   {productImages?.length > 1 && (
      //     <div
      //       className={cs(styles.imageArrowRight, {
      //         [styles.show]: this.state.imageHover
      //       })}
      //       onClick={this.onClickImageArrowRight}
      //     ></div>
      //   )}
      // {this.state.showLooks && (
      // <div
      //   id="looks-btn"
      //   className={styles.looksBtn}
      //   onClick={this.handleLooksClick}
      // >
      //   shop the look
      // </div>
      // )}
      // </div>
    );
    // });
    // } else {
    // return [1, 2, 3].map((image, index) => {
    //   return (
    //     <div
    //       className={styles.productImageContainer}
    //       key={image}
    //       id={`img-${image}`}
    //     >
    //       <Skeleton duration={1} height={540} />
    //     </div>
    //   );
    // });
    // }
  }

  getProductDetails = () => {
    const {
      data,
      currency,
      device: { mobile, tablet },
      updateComponentModal,
      changeModalState,
      corporatePDP,
      meta
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
        loading={meta.templateType == "" ? true : false}
        setPDPButton={this.getPDPButton}
        tablet={tablet}
        source="pdp"
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

    if (
      recommendedSliderItems?.length < 4 ||
      typeof document == "undefined" ||
      recommendedSliderItems?.length == 0
    ) {
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
        recommendedProducts={this.props?.recommendedProducts}
        setting={config as Settings}
        currency={currency}
        mobile={mobile || tablet}
        isSale={this.props?.isSale}
        corporatePDP={corporatePDP}
      />
    );
  }

  updateMobileView = (plpMobileView: "list" | "grid") => {
    if (this.props.plpMobileView != plpMobileView) {
      this.props.updateMobileView(plpMobileView);
      CookieService.setCookie("plpMobileView", plpMobileView);
      viewSelectionGTM(plpMobileView);
    }
  };

  getMoreCollectionProductsSection() {
    const {
      data: { collectionProducts = [] },
      device: { mobile }
    } = this.props;
    if (
      collectionProducts?.length < (mobile ? 2 : 4) ||
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
    this.stopAutoImageScroll();
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
      categories?.filter(category =>
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
    const {
      updateComponentModal,
      changeModalState,
      data,
      corporatePDP,
      selectedSizeId,
      currency
    } = this.props;

    const selectedSize = data?.childAttributes?.filter(
      item => item.id == selectedSizeId
    )[0];

    const price = corporatePDP
      ? data.priceRecords[currency]
      : selectedSize && selectedSize?.priceRecords
      ? selectedSize?.priceRecords[currency]
      : data?.priceRecords[currency];

    const discountPrices =
      selectedSize && selectedSize?.discountedPriceRecords
        ? selectedSize?.discountedPriceRecords[currency]
        : data?.discountedPriceRecords[currency];

    updateComponentModal(
      POPUP.HELLOARPOPUP,
      {
        code,
        data,
        buttoncall: this.returnPDPButton(),
        showPrice:
          data.invisibleFields && data.invisibleFields.indexOf("price") > -1,
        price,
        discountPrices
      },
      true,
      "mobile-3d",
      styles.mobileHelloArPopup
    );
    changeModalState(true);
  };

  notifyMeClick = (product: PLPProductItem) => {
    const {
      categories,
      collection,
      collections,
      priceRecords,
      discountedPriceRecords,
      childAttributes,
      title,
      discount,
      badgeType,
      plpSliderImages,
      badge_text
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
    const index = categories?.length - 1;
    let category = categories[index]
      ? categories[index]?.replace(/\s/g, "")
      : "";
    category = category?.replace(/>/g, "/");
    updateComponentModal(
      POPUP.NOTIFYMEPOPUP,
      {
        collection: collection,
        // collections && collections?.length > 0 ? collections[0] : "",
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
        list: "pdp",
        sliderImages: plpSliderImages,
        collections: collections,
        badge_text: badge_text
      },
      false,
      undefined
    );
    changeModalState(true);
  };

  getLooksSection = () => {
    const {
      currency,
      device: { mobile, tablet },
      data
    } = this.props;

    // Filter out products where the price is equal to 0
    const filteredLooksProducts = this.props.data.looksProducts?.filter(
      item => item.priceRecords[currency] != 0
    );
    const slidesCount = (): number =>
      !mobile ? (data.lookImageType === "landscape" ? 2 : 3) : 1.4;
    const configSetting = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: slidesCount(),
      slidesToScroll: 1,
      arrows: true
    };

    return data ? (
      <>
        {/* {mobile && (
          <div
            className={cs(styles.listGridBar, {
              [styles.listGridBarTimer]: this.props?.showTimer,
              [styles.hide]: this.props?.scrollDown
            })}
          >
            <div
              className={styles.gridContainer}
              onClick={() => this.updateMobileView("grid")}
            >
              <span
                className={cs(styles.gridSpan, {
                  [styles.active]: this.props?.plpMobileView == "grid"
                })}
              >
                Grid
              </span>
              <img
                src={
                  this.props.plpMobileView == "grid" ? activeGrid : inactiveGrid
                }
                className={cs(styles.gridIcon)}
              />
            </div>
            <div
              className={styles.listContainer}
              onClick={() => this.updateMobileView("list")}
            >
              <img
                src={
                  this.props.plpMobileView == "list" ? activeList : inactiveList
                }
                className={cs(styles.listIcon)}
              />
              <span
                className={cs(styles.listSpan, {
                  [styles.active]: this.props?.plpMobileView == "list"
                })}
              >
                List
              </span>
            </div>
          </div>
        )} */}
        <div className={cs(styles.shopTheLookContainer)}>
          <h2
            id="looks-section"
            className={cs(styles.header, globalStyles.paddBottom20)}
          >
            Shop The Look
          </h2>
          <div className={cs(bootstrap.row, globalStyles.paddBottom20)}>
            <div
              className={cs(
                bootstrap.colMd5,
                data.lookImageType === "landscape"
                  ? bootstrap.colLg6
                  : bootstrap.colLg4
              )}
            >
              <div
                className={cs({
                  [styles.looksMainImage]: mobile
                })}
              >
                {/* <Link
                    to={data.url}
                    // onClick={gtmProductClick}
                  > */}
                <img
                  alt={data?.altText || data?.title}
                  src={
                    data?.lookImageUrl ||
                    (data?.images?.[0]
                      ? data?.images?.[0]?.productImage
                      : "/static/img/noimageplp.png")
                  }
                  className={cs(globalStyles.paddR30)}
                  style={{
                    width: "100%",
                    height: "100%",
                    aspectRatio:
                      data.lookImageType === "landscape" ? "93/65" : "59/80"
                  }}
                />
                {/* </Link> */}
              </div>
            </div>

            <div
              className={cs(
                bootstrap.colMd7,
                data.lookImageType === "landscape"
                  ? bootstrap.colLg6
                  : bootstrap.colLg8,
                "slider-container",
                styles.looksContainer
              )}
            >
              {filteredLooksProducts && filteredLooksProducts.length > 1 ? (
                <Slider {...configSetting}>
                  {filteredLooksProducts &&
                    filteredLooksProducts.map((item, i) => {
                      return (
                        <div key={i} className={cs(styles.looksItemContainer)}>
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
                </Slider>
              ) : (
                <div className={bootstrap.row}>
                  {filteredLooksProducts &&
                    filteredLooksProducts.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className={cs(
                            styles.looksItemContainer,
                            data.lookImageType === "landscape"
                              ? bootstrap.colLg6
                              : bootstrap.colLg4
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
              )}
            </div>
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
      device: { mobile },
      currency
    } = this.props;

    // Filter out products where the price is equal to 0
    const filteredPairItWithProducts = pairItWithProducts?.filter(
      item => item.priceRecords[currency] != 0
    );

    // Check if we have enough products to display
    if (
      filteredPairItWithProducts.length < (mobile ? 2 : 4) ||
      typeof document === "undefined"
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
        data={filteredPairItWithProducts} // Use filtered products here
        setting={config as Settings}
        mobile={mobile}
        currency={currency}
      />
    );
  };
  handleShopLookPopup = (): void => {
    this.setState({
      shopShopLookPopup: true
    });
    document.body.classList.add(globalStyles.noScroll);
  };
  closeShopLookPopUp = (): void => {
    this.setState({
      shopShopLookPopup: false
    });
    document.body.classList.remove(globalStyles.noScroll);
  };

  handleLooksClick = (e: any) => {
    const elem = document.getElementById("looks-section");
    if (elem) {
      const headerOffset = 130;
      const elemPos = elem.offsetTop;
      const offsetPos = elemPos - headerOffset;
      window.scroll({ top: offsetPos, behavior: "smooth" });
    }
    e.stopPropagation();
    // trigger event on click of Shop the Look CTA
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "shop_the_look",
        click_type: this.props.data?.title
      });
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

  getPDPButton = (button: JSX.Element) => {
    this.setState({ pdpButton: button });
  };

  returnPDPButton = () => {
    return this.state.pdpButton;
  };

  render() {
    const {
      data,
      device: { mobile, tablet },
      corporatePDP,
      currency,
      selectedSizeId
    } = this.props;

    if (!data) {
      return null;
    }

    const selectedSize = data?.childAttributes?.filter(
      item => item.id == selectedSizeId
    )[0];

    const price = corporatePDP
      ? data.priceRecords[currency]
      : selectedSize && selectedSize?.priceRecords
      ? selectedSize?.priceRecords[currency]
      : data?.priceRecords[currency];

    const discountPrices =
      selectedSize && selectedSize?.discountedPriceRecords
        ? selectedSize?.discountedPriceRecords[currency]
        : data?.discountedPriceRecords[currency];

    const { breadcrumbs } = data;
    const images: any[] = this.getProductImagesData();
    let iconIndex = -1;
    images?.map((data, i) => {
      if (data?.code) {
        iconIndex = i;
      }
      return data?.code != "";
    });
    let mobileSlides: any[] = [];
    if (mobile || tablet) {
      if (images?.length > 0) {
        mobileSlides = images?.map(
          (
            { id, productImage, icon, code, video_link, media_type, type },
            i: number
          ) => {
            return (
              <div
                key={id}
                className={cs(globalStyles.relative, {
                  [styles.videoDiv]: !(
                    media_type === "Image" || type === "main"
                  )
                })}
              >
                {media_type === "Image" || type === "main" ? (
                  <div className={cs(styles.container)}>
                    <img
                      // fetchpriority={i < 2 ? "high" : "low"}
                      alt={data?.altText || data?.title}
                      // aspectRatio="62:93"
                      src={productImage?.replace("/Micro/", "/Medium/")}
                      className={globalStyles.imgResponsive}
                      onClick={this.getMobileZoomListener(i)}
                    />
                  </div>
                ) : (
                  <>
                    {/* <div className={styles.overlayDiv}></div>
                    <ReactPlayer
                      url={vimeo_link}
                      playing={true}
                      volume={1}
                      muted={true}
                      width={"100%"}
                      height={"auto"}
                      playsinline={true}
                    /> */}
                    {/* <video
                      src={video_link}
                      autoPlay
                      loop
                      preload="auto"
                      width={"100%"}
                      height={"auto"}
                      onClick={this.getMobileZoomListener(i)}
                      muted
                    /> */}
                    <div
                      className={styles.videoWrp}
                      onClick={this.getMobileZoomListener(i)}
                      dangerouslySetInnerHTML={{
                        __html: `
                  <video
                    loop
                    muted
                    autoplay
                    playsinline
                    preload="metadata"
                  >
                  <source src="${video_link}" />
                  </video>`
                      }}
                    />
                  </>
                )}
                {iconIndex > -1 ? (
                  icon ? (
                    // <div className={styles.mobile3d}>
                    //   <img
                    //     src={mobile3d}
                    //     onClick={(e: any) => this.onClickMobile3d(e, code)}
                    //   ></img>
                    // </div>
                    <div
                      className={styles.viewInBtn}
                      onClick={(e: any) => this.onClickMobile3d(e, code)}
                    >
                      <img
                        className={styles.image}
                        src={button_image}
                        alt="product-img"
                      />
                      <div className={styles.text}>VIEW IN 3D</div>
                    </div>
                  ) : (
                    <img
                      src={Mobile360}
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
                      alt="product-img"
                    ></img>
                  )
                ) : (
                  ""
                )}
                {this.state.showLooks && mobile && (
                  <div
                    id="looks-btn-mobile"
                    className={cs(styles.looksBtnMobile, styles.looksBtn)}
                    onClick={
                      mobile && !tablet
                        ? this.handleShopLookPopup
                        : this.handleLooksClick
                    }
                  >
                    shop look
                  </div>
                )}
                <div
                  className={styles.mobileZoomIcon}
                  onClick={this.getMobileZoomListener(i)}
                >
                  <img src={zoom} alt="product-img"></img>
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

    const { detailStickyEnabled, mounted } = this.state;

    return (
      <div
        className={cs(
          styles.pdpContainer,
          // { [styles.pdpContainer]: showSecondary },
          // { [styles.pdpSecondcontainer]: !showSecondary },
          { [styles.pdpContainerTimer]: this.props.showTimer },
          bootstrap.containerFluid,
          { [bootstrap.noPad]: !mobile },
          {
            [styles.mobile]: mobile
          }
        )}
      >
        {/* {!mobile && showSecondary && (
          // <SecondaryHeader>
            <Breadcrumbs
              levels={breadcrumbs}
              className={cs(bootstrap.row, bootstrap.col12, styles.breadcrumbs)}
            />
          // </SecondaryHeader>
        )} */}
        {!mobile && (
          <div className={cs(styles.breadcrumbsSection, bootstrap.row)}>
            <Breadcrumbs
              levels={breadcrumbs}
              className={cs(bootstrap.colMd10)}
            />
          </div>
        )}
        <div
          id="product_detail_sec"
          className={cs(bootstrap.row, styles.productSection, {
            [styles.paddingBottom]: this.props.data?.freeProductText
          })}
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
              {typeof document == "object" && (
                <MobileSlider val={this.state.goToIndex} type={"pdp"}>
                  {mobileSlides}
                </MobileSlider>
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
                bootstrap.colMd6,
                bootstrap.dNone,
                bootstrap.dMdBlock
              )}
            >
              {this.getProductImages()}
              {/* {images && (
                <PdpSlider
                  alt={data?.altText || data?.title}
                  images={images}
                  className={cs(
                    bootstrap.colSm10,
                    bootstrap.offsetSm1,
                    bootstrap.offsetMd0
                  )}
                  activeIndex={activeImage}
                  onImageClick={this.onSliderImageClick}
                />
              )} */}
            </div>
          )}

          <div
            className={cs(
              styles.detailsContainer,
              {
                [globalStyles.pageStickyElement]:
                  !mobile && detailStickyEnabled,
                [bootstrap.col12]: tablet || mobile,
                [bootstrap.colMd4]: !tablet && !mobile
              },
              {
                [globalStyles.paddTop20]: mobile
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
        {this.state.shopShopLookPopup && (
          <ShopTheLookPopup
            data={data}
            currency={currency}
            notifyMeClick={this.notifyMeClick}
            onEnquireClick={this.onEnquireClick}
            closeShopLookPopUp={this.closeShopLookPopUp}
            isOpen={this.state.shopShopLookPopup}
          />
        )}
        {this.state.showLooks && this.getLooksSection()}
        <div className={bootstrap.row}>{this.getPairItWithSection()}</div>
        <div className={cs(bootstrap.row)}>{this.getRecommendedSection()}</div>
        <div className={cs(bootstrap.row)}>
          {!this.state?.showLooks && this.getMoreCollectionProductsSection()}
        </div>
        {!mobile && (
          <div className={cs(styles.bottomPanel)} ref={this.bottomDockRef}>
            <DockedPanel
              data={data}
              buttoncall={this.returnPDPButton()}
              showPrice={
                data.invisibleFields &&
                data.invisibleFields.indexOf("price") > -1
              }
              price={price}
              discountPrice={discountPrices}
              mobile={mobile}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPContainer);

export { initAction };

export { metaAction };
