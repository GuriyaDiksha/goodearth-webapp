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

import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";

const mapStateToProps = (state: AppState, props: PDPProps) => {
  const { slug } = props;
  const id = getProductIdFromSlug(slug);
  const data = (id && state.products[id]) as Product;

  return {
    id,
    data,
    currency: state.currency,
    device: state.device
  };
};

type Props = PDPProps & ReturnType<typeof mapStateToProps>;

class PDPContainer extends React.Component<Props> {
  onImageClick = (index: number) => {
    console.log(index);
  };

  getProductImages() {
    const {
      data: { sliderImages, images }
    } = this.props;

    return images?.concat(sliderImages).map((image, index) => {
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

  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }

    const { breadcrumbs, sliderImages, images } = data;

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
                images={images ? images.concat(sliderImages) : []}
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
      </div>
    );
  }
}

export default connect(mapStateToProps)(PDPContainer);

export { initAction };
