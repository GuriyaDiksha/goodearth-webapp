import React, { RefObject } from "react";
import { connect } from "react-redux";
import cs from "classnames";
import { Props as PDPProps, State } from "./typings";
import initAction from "./initAction";

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

import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import { getProductSliderItems } from "selectors/productSlider";
import { Settings } from "react-slick";
import mapDispatchToProps from "./mappers/actions";
import MobileSlider from "../../components/MobileSlider";
import Zoom from "components/Zoom";
import { renderModal } from "utils/modal";
import { HEADER_HEIGHT, SECONDARY_HEADER_HEIGHT } from "constants/heights";

const sidebarPosition = HEADER_HEIGHT + SECONDARY_HEADER_HEIGHT + 23;

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
    device: state.device
  };
};

type Props = PDPProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class PDPContainer extends React.Component<Props, State> {
  state: State = {
    sidebarSticky: true,
    detailsSticky: true
  };

  sidebarRef: RefObject<HTMLDivElement> = React.createRef();
  detailsRef: RefObject<HTMLDivElement> = React.createRef();
  containerRef: RefObject<HTMLDivElement> = React.createRef();

  onImageClick = (index: number) => {
    const {
      device: { mobile }
    } = this.props;
    const images = this.getProductImagesData();
    renderModal(<Zoom images={images} startIndex={index} mobile={mobile} />, {
      fullscreen: true
    });
  };

  componentDidMount() {
    this.fetchMoreProductsFromCollection();
    document.addEventListener("scroll", this.onScroll);
  }

  onScroll = () => {
    const { containerRef, sidebarRef, detailsRef } = this;
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

      let sidebarSticky = this.state.sidebarSticky,
        detailsSticky = this.state.detailsSticky,
        update = false;

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
      return (
        <div
          className={styles.productImageContainer}
          key={image.id}
          id={`img-${image.id}`}
        >
          <PdpImage {...image} index={index} onClick={this.onImageClick} />
        </div>
      );
    });
  }

  getProductDetails() {
    const {
      data,
      currency,
      device: { mobile }
    } = this.props;

    return (
      <ProductDetails
        data={data}
        currency={currency}
        mobile={mobile}
        wishlist={[]}
      />
    );
  }

  getRecommendedSection() {
    const { recommendedSliderItems } = this.props;

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
      />
    );
  }

  getMoreCollectionProductsSection() {
    const {
      data: { collectionProducts = [] }
    } = this.props;

    if (!collectionProducts.length) {
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
      <CollectionProductsSlider
        data={collectionProducts}
        setting={config as Settings}
      />
    );
  }

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

    const { sidebarSticky, detailsSticky } = this.state;

    return (
      <div className={cs(styles.pdpContainer, bootstrap.containerFluid)}>
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
                globalStyles.pageStickyElement,
                {
                  [globalStyles.pageStickyScrolling]: !sidebarSticky
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
              bootstrap.offsetMd6,
              {
                [globalStyles.pageStickyElement]: !mobile,
                [globalStyles.pageStickyScrolling]: !mobile && !detailsSticky
              }
            )}
            ref={this.detailsRef}
          >
            {this.getProductDetails()}
          </div>
        </div>
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
