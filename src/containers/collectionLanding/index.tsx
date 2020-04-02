import React from "react";
import SecondaryHeader from "components/SecondaryHeader";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import initActionCollection from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import { Settings } from "react-slick";
import CollectionImage from "components/collectionItem";
import { CollectionItem } from "components/collectionItem/typings";

const mapStateToProps = (state: AppState) => {
  return {
    collectionData: state.collection.result,
    location: state.router.location,
    data: state.collection.data,
    currency: state.currency,
    device: state.device
  };
};
type Props = ReturnType<typeof mapStateToProps>;

class CollectionLanding extends React.Component<Props, { filterData: string }> {
  state = {
    filterData: "All"
  };

  onchangeFilter = (data: any): void => {
    this.setState({
      filterData: data
    });
  };

  render() {
    const collection = this.props.location.pathname.split("/").pop();
    const collectionName = collection ? collection.split("_")[0] : "";
    const {
      collectionData,
      data: { level2Categories }
    } = this.props;
    const filterData = collectionData.filter((item: any) => {
      return this.state.filterData == "All"
        ? true
        : item.category[0].name == this.state.filterData;
    });
    const config: Settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            dots: false,
            arrows: false
          }
        }
      ]
    };

    return (
      <div>
        <SecondaryHeader>
          <div className={styles.innerHeader}>
            <p className={styles.filterText}>FILTER BY</p>
            <SelectableDropdownMenu
              align="right"
              className={styles.dropdownRoot}
              items={level2Categories}
              value="All"
              onChange={this.onchangeFilter}
              showCaret={true}
            ></SelectableDropdownMenu>
          </div>
        </SecondaryHeader>
        <div className={cs(bootstrap.row, styles.subcHeader)}>
          <div className={cs(bootstrap.colMd12, globalStyles.textCenter)}>
            <h1>{collectionName} Collections </h1>
            <p
              dangerouslySetInnerHTML={{ __html: this.props.data.description }}
            ></p>
          </div>
        </div>
        <div className={cs(bootstrap.row, styles.collectionBlock)}>
          <div className={cs(bootstrap.colMd8, bootstrap.offsetMd2)}>
            <div className={bootstrap.row}>
              {filterData.map((data: CollectionItem, i: number) => {
                return (
                  <div
                    className={cs(bootstrap.colMd6, bootstrap.col12)}
                    key={i}
                  >
                    <CollectionImage data={data} setting={config} key={i} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(CollectionLanding);
export { initActionCollection };
