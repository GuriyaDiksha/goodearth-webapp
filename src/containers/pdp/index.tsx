import React, { RefObject, SyntheticEvent } from "react";
import { connect } from "react-redux";
import cs from "classnames";
import { Props as PDPProps, State } from "./typings";
import initAction from "./initAction";
import metaAction from "./metaAction";

import { getProductIdFromSlug } from "utils/url";
import { AppState } from "reducers/typings";
import { Product } from "typings/product";
import SecondaryHeader from "components/SecondaryHeader";
import Breadcrumbs from "components/Breadcrumbs";
import VerticalImageSelector from "components/VerticalImageSelector";
import PdpImage from "./components/pdpImage";
import ProductDetails from "./components/productDetails";
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
import Zoom from "components/Zoom";
import { HEADER_HEIGHT, SECONDARY_HEADER_HEIGHT } from "constants/heights";

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

  return {
    id,
    data,
    recommendedSliderItems,
    currency: state.currency,
    device: state.device,
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
    detailStickyEnabled: true
  };

  imageOffsets: number[] = [];
  sidebarRef: RefObject<HTMLDivElement> = React.createRef();
  detailsRef: RefObject<HTMLDivElement> = React.createRef();
  containerRef: RefObject<HTMLDivElement> = React.createRef();

  onImageClick = (index: number) => {
    const {
      updateComponentModal,
      changeModalState,
      device: { mobile }
    } = this.props;
    const images = this.getProductImagesData();
    updateComponentModal(
      <Zoom
        images={images}
        startIndex={index}
        mobile={mobile}
        changeModalState={changeModalState}
      />,
      true
    );
    changeModalState(true);
  };

  componentDidMount() {
    this.fetchMoreProductsFromCollection();
    this.onScroll();
    document.addEventListener("scroll", this.onScroll);
  }

  componentDidUpdate() {
    const { data } = this.props;
    if (!data) {
      return;
    }
    const productImages = this.getProductImagesData();
    if (productImages.length === 1 && this.state.detailStickyEnabled) {
      this.setState({
        detailStickyEnabled: false
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

  fetchMoreProductsFromCollection() {
    const { id, fetchMoreProductsFromCollection } = this.props;

    if (id) {
      fetchMoreProductsFromCollection(id);
    }
  }

  getProductImagesData() {
    const {
      data: { sliderImages, images }
    } = this.props;

    return images ? images.concat(sliderImages || []) : [];
  }

  getProductImages() {
    const productImages = this.getProductImagesData();

    return productImages.map((image, index) => {
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
      device: { mobile }
    } = this.props;

    if (!recommendedSliderItems.length) {
      return null;
    }

    const config: Settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
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
        setting={config as Settings}
        currency={"INR"}
        mobile={mobile}
      />
    );
  }

  getMoreCollectionProductsSection() {
    const {
      data: { collectionProducts = [] },
      device: { mobile }
    } = this.props;

    if (!collectionProducts.length) {
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
            infinite: true
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

    if (categories.indexOf("Living > Wallcoverings") === -1) {
      return null;
    }
    return <WallpaperFAQ mobile={mobile} />;
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
          <div key={id}>
            <img
              src={productImage.replace("/Micro/", "/Medium/")}
              className={globalStyles.imgResponsive}
            />
          </div>
        );
      });

    const {
      sidebarSticky,
      detailsSticky,
      activeImage,
      detailStickyEnabled
    } = this.state;

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
          {mobile && (
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
                {
                  [globalStyles.pageStickyElement]: !mobile,
                  [globalStyles.pageStickyScrolling]: !sidebarSticky && !mobile
                }
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
                bootstrap.dMdBlock,
                bootstrap.offsetMd2
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
                [bootstrap.offsetMd6]: !mobile && detailStickyEnabled,
                [globalStyles.pageStickyElement]:
                  !mobile && detailStickyEnabled,
                [globalStyles.pageStickyScrolling]: !mobile && !detailsSticky
              }
            )}
            ref={this.detailsRef}
          >
            {this.getProductDetails()}
          </div>
        </div>
        {this.getWallpaperFAQ()}
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
