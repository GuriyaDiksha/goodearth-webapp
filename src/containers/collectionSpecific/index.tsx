import React from "react";
import SecondaryHeader from "components/SecondaryHeader";
import Breadcrumbs from "components/Breadcrumbs";
import { PLPProductItem } from "src/typings/product";
import PlpResultItem from "components/plpResultItem";
// import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import initActionSpecific from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import banner from "../../images/bannerBottom.jpg";
// import { Settings } from "react-slick";
// import CollectionImage from "components/collectionItem";
// import { CollectionItem } from "components/collectionItem/typings";

const mapStateToProps = (state: AppState) => {
  return {
    collectionSpecficBanner: state.collection.collectionSpecficBanner,
    collectionSpecificData: state.collection.collectionSpecficdata,
    currency: state.currency,
    mobile: state.device.mobile
  };
};
type Props = ReturnType<typeof mapStateToProps>;

class CollectionLanding extends React.Component<Props, {}> {
  render() {
    const {
      mobile,
      collectionSpecificData,
      collectionSpecficBanner
    } = this.props;
    const { breadcrumbs, longDescription, results } = collectionSpecificData;
    const { widgetImages, description } = collectionSpecficBanner;
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
                } else if (widget.imageType == 1) {
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
              <img src={banner} className={globalStyles.imgResponsive} />
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
                <div className={cs(bootstrap.colMd4, bootstrap.col6)} key={i}>
                  <PlpResultItem
                    product={data}
                    addedToWishlist={false}
                    currency={this.props.currency}
                    key={i}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(CollectionLanding);
export { initActionSpecific };
