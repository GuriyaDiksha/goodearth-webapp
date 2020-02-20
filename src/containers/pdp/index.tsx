import React from "react";
import { connect } from "react-redux";
import cs from "classnames";
import { Props as PDPProps } from "./typings";
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

import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import { getProductSliderItems } from "selectors/productSlider";
import { Settings } from "react-slick";
import mapDispatchToProps from "./mappers/actions";

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

class PDPContainer extends React.Component<Props> {
  onImageClick = (index: number) => {
    console.log(index);
  };

  componentDidMount() {
    this.fetchMoreProductsFromCollection();
  }

  fetchMoreProductsFromCollection() {
    const { id, fetchMoreProductsFromCollection } = this.props;

    if (id) {
      fetchMoreProductsFromCollection(id);
    }
  }

  getProductImages() {
    const {
      data: { sliderImages }
    } = this.props;

    return (
      sliderImages &&
      sliderImages.map((image, index) => {
        return (
          <div
            className={styles.productImageContainer}
            key={image.id}
            id={`img-${image.id}`}
          >
            <PdpImage {...image} index={index} onClick={this.onImageClick} />
          </div>
        );
      })
    );
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

  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }

    const { breadcrumbs, sliderImages } = data;

    return (
      <div className={styles.pdpContainer}>
        <SecondaryHeader>
          <Breadcrumbs
            levels={breadcrumbs}
            className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}
          />
        </SecondaryHeader>
        <div className={cs(bootstrap.row)}>
          <div className={cs(bootstrap.colMd1, bootstrap.offsetMd1)}>
            <div className={bootstrap.row}>
              <VerticalImageSelector
                images={sliderImages}
                className={cs(
                  bootstrap.colSm10,
                  bootstrap.offsetSm1,
                  bootstrap.offsetMd0
                )}
              />
            </div>
          </div>
          <div
            className={cs(
              bootstrap.colMd4,
              bootstrap.dNone,
              bootstrap.dMdBlock
            )}
          >
            {this.getProductImages()}
          </div>

          <div
            className={cs(
              styles.detailsContainer,
              bootstrap.colMd5,
              bootstrap.col12
            )}
          >
            {this.getProductDetails()}
          </div>
        </div>
        <div className={cs(bootstrap.row)}>{this.getRecommendedSection()}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PDPContainer);

export { initAction };
