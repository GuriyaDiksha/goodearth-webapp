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
import { Product } from "typings/product";
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
import zoom from "images/zoom.png";
import LazyImage from "components/LazyImage";
import * as valid from "utils/validate";
import { POPUP } from "constants/components";

const VerticalImageSelector = loadable(() =>
  import("components/VerticalImageSelector")
);
const ProductDetails = loadable(() => import("./components/productDetails"));

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
    corporatePDP: state.meta.templateType === "corporate_pdp"
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
    updated: true
  };

  imageOffsets: number[] = [];
  sidebarRef: RefObject<HTMLDivElement> = React.createRef();
  detailsRef: RefObject<HTMLDivElement> = React.createRef();
  containerRef: RefObject<HTMLDivElement> = React.createRef();
  pdpURL = "";
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
        changeModalState: changeModalState
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
      timestamp: new Date()
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
    dataLayer.push({
      event: "PdpView",
      PageURL: this.props.location.pathname,
      PageTitle: "virtual_pdp_view"
    });
    valid.PDP(this.props.data, this.props.currency);
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
        mounted: true,
        updated: true
      },
      () => {
        window.setTimeout(() => {
          document.addEventListener("scroll", this.onScroll);
        }, 100);
      }
    );
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
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.id && this.props.id != nextProps.id) {
      this.setState({
        sidebarSticky: true,
        detailsSticky: true,
        activeImage: 0,
        detailStickyEnabled: true,
        mounted: false
      });
      this.fetchMoreProductsFromCollection(nextProps.id);
    }
    if (nextProps.location.pathname != this.props.location.pathname) {
      this.setState({
        updated: false
      });
    }
    if (this.props.currency != nextProps.currency) {
      this.fetchMoreProductsFromCollection(nextProps.id);
      this.props.fetchProduct(this.props.slug);
      this.setState({
        mounted: false
      });
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
    if (
      this.props.location.pathname != props.location.pathname &&
      !this.state.updated
    ) {
      this.setState({
        updated: true
      });
      window.setTimeout(() => {
        window.scrollTo({ top: 0 });
      }, 500);
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

    if (mobile) {
      return;
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
    productImages?.map((image, index) => {
      const ele = document.getElementById(`img-${image.id}`) as HTMLDivElement;
      const { clientHeight } = ele;
      this.imageOffsets[index] = clientHeight;
    });
  };

  getProductImages() {
    const productImages = this.getProductImagesData();

    return productImages?.map((image, index) => {
      const onImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        const ele = event.currentTarget;
        const { naturalHeight, naturalWidth } = ele;
        const height = (ele.width * naturalHeight) / naturalWidth;
        this.imageOffsets[index] = height;
      };

      return (
        <div
          className={styles.productImageContainer}
          key={image.id}
          id={`img-${image.id}`}
        >
          <PdpImage
            {...image}
            index={index}
            onClick={this.onImageClick}
            onLoad={onImageLoad}
          />
        </div>
      );
    });
  }

  getProductDetails() {
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
        corporatePDP={corporatePDP}
        data={data}
        key={data.sku}
        currency={currency}
        mobile={mobile}
        wishlist={[]}
        updateComponentModal={updateComponentModal}
        changeModalState={changeModalState}
      />
    );
  }

  getRecommendedSection() {
    const {
      recommendedSliderItems,
      device: { mobile },
      currency
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
        mobile={mobile}
      />
    );
  }

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
    const imageContainer = document.getElementById(`img-${id}`);

    if (!imageContainer) {
      return;
    }

    const { top } = imageContainer?.getBoundingClientRect();

    const scrollBy = top - PDP_TOP_OFFSET;
    window.scrollBy(0, scrollBy);

    this.setState({
      activeImage: index
    });
  };

  getWallpaperFAQ = () => {
    const {
      device: { mobile },
      data: { categories }
    } = this.props;

    if (categories.indexOf("Home > Wallcoverings") === -1) {
      return null;
    }
    return <WallpaperFAQ mobile={mobile} />;
  };

  getMobileZoomListener = (index: number) => {
    return () => {
      this.onImageClick(index);
    };
  };

  render() {
    const {
      data,
      device: { mobile }
    } = this.props;

    if (!data) {
      return null;
    }

    const { breadcrumbs } = data;
    const images = this.getProductImagesData();

    const mobileSlides =
      mobile &&
      images?.map(({ id, productImage }, i: number) => {
        return (
          <div key={id} className={globalStyles.relative}>
            <LazyImage
              aspectRatio="62:93"
              src={productImage.replace("/Micro/", "/Medium/")}
              className={globalStyles.imgResponsive}
              onClick={this.getMobileZoomListener(i)}
            />
            <div
              className={styles.mobileZoomIcon}
              onClick={this.getMobileZoomListener(i)}
            >
              <img src={zoom}></img>
              Zoom
            </div>
          </div>
        );
      });

    const { activeImage, detailStickyEnabled, mounted } = this.state;

    return (
      <div
        className={cs(styles.pdpContainer, bootstrap.containerFluid, {
          [styles.mobile]: mobile
        })}
      >
        {!mobile && (
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
          {mobile && this.state.updated && (
            <div
              className={cs(
                bootstrap.col12,
                globalStyles.mobileSliderContainer
              )}
            >
              <MobileSlider>{mobileSlides}</MobileSlider>
            </div>
          )}
          {!mobile && (
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
          )}
          {!mobile && (
            <div
              className={cs(
                bootstrap.colMd4,
                bootstrap.dNone,
                bootstrap.dMdBlock
              )}
            >
              {this.getProductImages()}
            </div>
          )}

          <div
            className={cs(
              styles.detailsContainer,
              bootstrap.colMd5,
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
        <div className={cs(bootstrap.row)}>{this.getRecommendedSection()}</div>
        <div className={cs(bootstrap.row)}>
          {this.getMoreCollectionProductsSection()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPContainer);

export { initAction };

export { metaAction };
