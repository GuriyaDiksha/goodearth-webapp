import React, { RefObject } from "react";
import { connect } from "react-redux";
import cs from "classnames";
import { QuickviewProps, State } from "./typings";

import { AppState } from "reducers/typings";
import { Product } from "typings/product";
import VerticalImageSelector from "components/VerticalImageSelector";
import PdpImage from "containers/pdp/components/pdpImage";
import ProductDetails from "containers/pdp/components/productDetails";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import mapDispatchToProps from "./initAction";
import fontStyles from "styles/iconFonts.scss";

const mapStateToProps = (state: AppState, props: QuickviewProps) => {
  let { id } = props;
  const {
    quickview: { quickviewId }
  } = state;
  id = quickviewId || id;
  const data = (id && state.products[id]) as Product;
  return {
    id,
    data,
    currency: state.currency,
    device: state.device
  };
};

type Props = QuickviewProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class Quickview extends React.Component<Props, State> {
  state: State = {
    sidebarSticky: true,
    detailsSticky: true,
    currentIndex: 0
  };

  sidebarRef: RefObject<HTMLDivElement> = React.createRef();
  detailsRef: RefObject<HTMLDivElement> = React.createRef();
  containerRef: RefObject<HTMLDivElement> = React.createRef();

  onImageClick = (index: number) => {
    // code for image click
  };

  closeModal = () => {
    this.props.changeModalState(false);
  };

  componentDidMount() {
    const { fetchProductsDetails, id } = this.props;
    fetchProductsDetails(id);
  }

  getProductImagesData = () => {
    const {
      data: { sliderImages, images }
    } = this.props;

    return images ? images.concat(sliderImages || []) : [];
  };

  getProductImages = (index: number) => {
    const image = this.getProductImagesData()[index];
    if (image)
      return (
        <div
          className={styles.productImageContainer}
          key={image.id}
          id={`img-${image.id}`}
        >
          <PdpImage {...image} index={index} onClick={this.onImageClick} />
        </div>
      );
  };

  onClickImage = (index: number) => {
    this.setState({
      currentIndex: index
    });
  };

  getProductDetails = () => {
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
        isQuickview={true}
      />
    );
  };

  onClickNextButton = (next: boolean) => {
    const { productListId, id, fetchProductsDetails } = this.props;
    let index = productListId.indexOf(id);
    if (next && index < productListId.length - 1) {
      const newId = productListId[++index];
      fetchProductsDetails(newId);
    } else if (!next && index > 0) {
      const newId = productListId[--index];
      fetchProductsDetails(newId);
    }
  };

  render() {
    const {
      data,
      device: { mobile }
    } = this.props;

    if (!data) {
      return null;
    }
    const images = this.getProductImagesData();

    const { currentIndex } = this.state;
    const { productListId, id } = this.props;
    const index = productListId.indexOf(id);
    return (
      <div
        className={cs(
          styles.pdpContainer,
          bootstrap.containerFluid,
          styles.quickviewSize
        )}
      >
        <div className={cs({ [globalStyles.hidden]: index <= 0 })}>
          <span
            className={cs(
              styles.preButtonStyle,
              fontStyles.iconArrowLeft,
              fontStyles.icon
            )}
            onClick={() => {
              this.onClickNextButton(false);
            }}
          ></span>
        </div>
        <div
          className={cs(bootstrap.row, styles.productSection)}
          ref={this.containerRef}
        >
          {!mobile && (
            <div
              className={cs(bootstrap.colMd1, styles.sidebar)}
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
                  onImageClick={this.onClickImage}
                  activeIndex={currentIndex}
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
              {this.getProductImages(currentIndex || 0)}
            </div>
          )}

          <div
            className={cs(styles.detailsContainer, bootstrap.colMd6)}
            ref={this.detailsRef}
          >
            {this.getProductDetails()}
          </div>
          <button
            className={cs(
              fontStyles.icon,
              fontStyles.iconCrossNarrowBig,
              styles.quickviewClose
            )}
            onClick={this.closeModal}
          />
        </div>
        <div
          className={cs({
            [globalStyles.hidden]: index >= productListId.length - 1
          })}
        >
          <span
            className={cs(
              styles.nextButtonStyle,
              fontStyles.iconArrowRight,
              fontStyles.icon
            )}
            onClick={() => {
              this.onClickNextButton(true);
            }}
          ></span>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quickview);
