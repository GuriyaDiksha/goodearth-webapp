import loadable from "@loadable/component";
import React from "react";
import SecondaryHeader from "components/SecondaryHeader";
import Breadcrumbs from "components/Breadcrumbs";
import { PLPProductItem } from "src/typings/product";
import PlpResultItem from "components/plpResultItem";
import initActionSpecific from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import banner from "../../images/bannerBottom.jpg";
import mapDispatchToProps from "../../components/Modal/mapper/actions";
const Quickview = loadable(() => import("components/Quickview"));
const MakerEnhance = loadable(() => import("maker-enhance"));

const mapStateToProps = (state: AppState) => {
  return {
    collectionIds: state.collection.collectionIds,
    collectionSpecficBanner: state.collection.collectionSpecficBanner,
    collectionSpecificData: state.collection.collectionSpecficdata,
    currency: state.currency,
    mobile: state.device.mobile
  };
};
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class CollectionSpecific extends React.Component<
  Props,
  { specificMaker: boolean }
> {
  state = {
    specificMaker: false
  };
  onClickQuickView = (id: number) => {
    const {
      updateComponentModal,
      changeModalState,
      collectionIds
    } = this.props;
    updateComponentModal(
      <Quickview id={id} productListId={collectionIds} key={id} />,
      true
    );
    changeModalState(true);
  };

  componentDidMount() {
    this.setState({
      specificMaker: true
    });
  }

  render() {
    const {
      mobile,
      collectionSpecificData,
      collectionSpecficBanner
    } = this.props;
    const { breadcrumbs, longDescription, results } = collectionSpecificData;
    const { widgetImages, description } = collectionSpecficBanner;
    const { specificMaker } = this.state;
    return (
      <div className={styles.collectionContainer}>
        {!mobile && (
          <SecondaryHeader>
            <Breadcrumbs
              levels={breadcrumbs}
              className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}
            />
          </SecondaryHeader>
        )}
        {specificMaker && <MakerEnhance user="goodearth" index="1" />}
        <section>
          <div className={cs(bootstrap.row, styles.firstBlock)}>
            <div className={bootstrap.col12}>
              {widgetImages.map((widget: any) => {
                if (mobile && widget.imageType == 2) {
                  return (
                    <img
                      src={widget.image}
                      className={globalStyles.imgResponsive}
                    />
                  );
                } else if (!mobile && widget.imageType == 1) {
                  return (
                    <img
                      src={widget.image}
                      className={globalStyles.imgResponsive}
                    />
                  );
                }
              })}
            </div>
            <div className={bootstrap.col12}>
              <img src={banner} className={globalStyles.imgResize} />
            </div>
          </div>
        </section>
        <div className={cs(bootstrap.row, styles.padding)}>
          <div
            className={cs(
              bootstrap.colMd12,
              globalStyles.textCenter,
              styles.collectionName
            )}
          >
            {description}
          </div>
        </div>
        <div className={bootstrap.row}>
          <div
            className={cs(
              bootstrap.col8,
              bootstrap.offset2,
              bootstrap.colMd6,
              bootstrap.offsetMd3,
              styles.collectionLowertext,
              globalStyles.textCenter
            )}
          >
            {longDescription}
          </div>
        </div>
        <div className={cs(bootstrap.row, styles.collectionBlock)}>
          <div
            className={cs(
              bootstrap.colMd10,
              bootstrap.offsetMd1,
              bootstrap.colSm12,
              bootstrap.row
            )}
          >
            {results.map((data: PLPProductItem, i: number) => {
              return (
                <div
                  className={cs(bootstrap.colMd4, bootstrap.col6)}
                  key={data.id + "plpDiv"}
                >
                  <PlpResultItem
                    product={data}
                    addedToWishlist={false}
                    currency={this.props.currency}
                    key={data.id + "plpitem"}
                    mobile={mobile}
                    onClickQuickView={this.onClickQuickView}
                    isCollection={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {specificMaker && <MakerEnhance user="goodearth" index="2" />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionSpecific);
export { initActionSpecific };
