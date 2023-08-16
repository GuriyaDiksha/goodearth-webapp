import loadable from "@loadable/component";
import React, { RefObject } from "react";
import { connect } from "react-redux";
import cs from "classnames";
import { QuickviewProps, State } from "./typings";

import { AppState } from "reducers/typings";
import { Product } from "typings/product";
import PdpImage from "containers/pdp/components/pdpImage";
import ProductDetails from "containers/pdp/components/productDetails";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import mapDispatchToProps from "./initAction";
import fontStyles from "styles/iconFonts.scss";
import CookieService from "../../services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import ReactPlayer from "react-player";

const VerticalImageSelector = loadable(() =>
  import("components/VerticalImageSelector")
);

const mapStateToProps = (state: AppState, props: QuickviewProps) => {
  let { id } = props;
  const {
    quickview: { quickviewId }
  } = state;
  id = quickviewId == 0 ? id : quickviewId;
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
    currentIndex: 0,
    isLoading: false
  };

  sidebarRef: RefObject<HTMLDivElement> = React.createRef();
  detailsRef: RefObject<HTMLDivElement> = React.createRef();
  containerRef: RefObject<HTMLDivElement> = React.createRef();

  onImageClick = (index: number) => {
    // code for image click
  };

  closeModal = () => {
    this.props.changeModalState(false);
    const { fetchProductsDetails } = this.props;
    fetchProductsDetails(0);
  };

  gtmPushOpenQuickview = () => {
    try {
      let category = "";
      if (this.props.data.categories) {
        const index = this.props.data.categories.length - 1;
        category = this.props.data.categories[index].replace(/\s/g, "");
        category = category.replace(/>/g, "/");
      }
      const productList = this.props.data.childAttributes?.map(item => {
        return {
          name: this.props.data.title,
          id: item.sku,
          price: item.discountedPriceRecords
            ? item.discountedPriceRecords[this.props.currency]
            : item.priceRecords[this.props.currency],
          brand: "Goodearth",
          category: category,
          variant: item.size || ""
        };
      });
      const listPath = `Quickview`;
      CookieService.setCookie("listPath", listPath);
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "productImpression",
          ecommerce: {
            currencyCode: this.props.currency,
            detail: {
              // actionField: { list: "Quickview" },
              actionField: { list: listPath },
              products: productList
            }
          }
        });
      }
    } catch (err) {
      console.log("Quickview GTM error!");
    }
  };

  componentDidMount() {
    const { fetchProductsDetails, id } = this.props;
    this.setState({
      isLoading: true
    });
    fetchProductsDetails(id).then(() => {
      this.setState({
        isLoading: false
      });
    });
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
          {" "}
          {image?.media_type === "Image" || image?.type === "main" ? (
            <PdpImage
              alt={this.props.data.altText || this.props.data.title}
              {...image}
              index={index}
              onClick={this.onImageClick}
            />
          ) : (
            <>
              <div className={styles.overlayDiv}></div>
              <ReactPlayer
                url={image?.vimeo_link}
                playing={true}
                volume={1}
                muted={true}
                width={"100%"}
                height={"auto"}
                playsinline={true}
              />
            </>
          )}
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
      device: { mobile, tablet },
      updateComponentModal,
      changeModalState
    } = this.props;

    return (
      <ProductDetails
        key={data.sku}
        data={data}
        currency={currency}
        closeModal={this.closeModal}
        mobile={mobile}
        wishlist={[]}
        isQuickview={true}
        loading={this.state.isLoading}
        corporatePDP={this.props.corporatePDP ? true : false}
        updateComponentModal={updateComponentModal}
        changeModalState={changeModalState}
        source={this.props.source}
        tablet={tablet}
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
    this.setState({ currentIndex: 0 });
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
          <button
            className={cs(
              fontStyles.icon,
              fontStyles.iconCrossNarrowBig,
              styles.quickviewClose
            )}
            onClick={this.closeModal}
          />
          {!mobile && (
            <div
              className={cs(bootstrap.colMd1, styles.sidebar)}
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

          <div className={cs(bootstrap.colMd6)} ref={this.detailsRef}>
            {this.getProductDetails()}
          </div>
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
