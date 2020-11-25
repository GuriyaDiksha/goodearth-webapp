import React from "react";
import { Dispatch } from "redux";
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
import MobileDropdownMenu from "components/MobileDropdown";
import MakerEnhance from "maker-enhance";
import CollectionService from "services/collection";
import {
  updateCollectionData,
  updateCollectionFilter
} from "actions/collection";
import { getProductIdFromSlug } from "utils/url.ts";
import { RouteComponentProps, withRouter } from "react-router";

const mapStateToProps = (state: AppState) => {
  return {
    collectionData: state.collection.result,
    location: state.router.location,
    data: state.collection.data,
    currency: state.currency,
    device: state.device
  };
};

const mapDispatchToProps = (dispatch: Dispatch, params: any) => {
  return {
    // create function for dispatch
    fetchCollectionMappingAndData: async () => {
      const id = getProductIdFromSlug(params.level1);
      if (id) {
        const [filterData, collectionData] = await Promise.all([
          CollectionService.fetchCollectionMapping(
            dispatch,
            id,
            params.id
          ).catch(err => {
            console.log("Collection Landing Error", err);
          }),
          CollectionService.fetchCollectionData(dispatch, +params.id).catch(
            err => {
              console.log("Collection Landing Error", err);
            }
          )
        ]);
        if (filterData) {
          dispatch(updateCollectionFilter({ ...filterData }));
        }
        if (collectionData) {
          dispatch(updateCollectionData(collectionData));
        }
      }
    }
  };
};

type RouteInfo = {
  id: string;
  level1: string;
};
type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteInfo>;

class CollectionLanding extends React.Component<
  Props,
  { filterData: string; onloadState: boolean; landingMaker: boolean }
> {
  state = {
    filterData: "All",
    onloadState: false,
    landingMaker: false
  };

  onChangeFilter = (data: any): void => {
    const {
      history,
      match: { params }
    } = this.props;
    console.log(this.props);
    const { id } = params;
    const newId = this.props.data.level2Categories
      .filter(item => item.value == data)[0]
      .id?.toString();
    if (newId) {
      const newUrl = history.location.pathname.replace(`/${id}/`, `/${newId}/`);
      history.push(newUrl);
      this.setState(
        {
          filterData: data
        },
        () => {
          window.scrollTo(0, 0);
        }
      );
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data.selectValue?.[0] && !this.state.onloadState) {
      this.setState({
        filterData: nextProps.data.selectValue?.[0]?.name,
        onloadState: true
      });
    } else if (nextProps.data.selectValue?.length == 0) {
      this.setState({
        filterData: "All"
      });
    }
    if (this.props.location.pathname != nextProps.location.pathname) {
      this.setState({
        landingMaker: false,
        onloadState: false
      });
    }
    if (this.props.currency != nextProps.currency) {
      this.setState({
        landingMaker: false
      });
    }
  }
  componentDidMount() {
    dataLayer.push({
      event: "CategoryLangingPageView",
      PageURL: this.props.location.pathname,
      PageTitle: "virtual_categoryLangingPage_view"
    });
    this.setState({
      landingMaker: true
    });
  }

  componentDidUpdate(previous: Props) {
    if (
      this.props.location.pathname != previous.location.pathname &&
      !this.state.landingMaker
    ) {
      this.setState({
        landingMaker: true
      });
      this.props.fetchCollectionMappingAndData();
    }
    if (this.props.currency != previous.currency) {
      this.setState({
        landingMaker: true
      });
    }
  }

  render() {
    const collection = this.props.location.pathname.split("/").pop();
    const collectionName = collection ? collection.split("_")[0] : "";
    const isLivingpage = this.props.location.pathname.includes("living");
    const {
      collectionData,
      device: { mobile },
      data: { level2Categories }
    } = this.props;

    // Code for checking selected filter form collection list
    const filterData = collectionData.filter((item: any) => {
      return this.state.filterData == "All"
        ? true
        : item.categoryName
            .map((data: any) => {
              return data.name;
            })
            .indexOf(this.state.filterData) > -1;
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
            dots: true,
            arrows: false
          }
        }
      ]
    };

    return (
      <div>
        {isLivingpage && (
          <SecondaryHeader>
            {mobile ? (
              <div>
                <MobileDropdownMenu
                  list={level2Categories}
                  onChange={this.onChangeFilter}
                  showCaret={true}
                  open={false}
                  value={this.state.filterData}
                />
              </div>
            ) : (
              <div className={styles.innerHeader}>
                <p className={styles.filterText}>FILTER BY</p>
                <SelectableDropdownMenu
                  align="right"
                  className={styles.dropdownRoot}
                  items={level2Categories}
                  value={this.state.filterData}
                  onChange={this.onChangeFilter}
                  showCaret={true}
                ></SelectableDropdownMenu>
              </div>
            )}
          </SecondaryHeader>
        )}

        {!mobile && (
          <div
            className={cs(bootstrap.row, styles.subcHeader, {
              [styles.subcHeaderNew]: !isLivingpage
            })}
          >
            <div className={cs(bootstrap.colMd12, globalStyles.textCenter)}>
              <h1>{collectionName} Collections </h1>
              <p
                dangerouslySetInnerHTML={{
                  __html: this.props.data.description
                }}
              ></p>
            </div>
          </div>
        )}
        {this.state.landingMaker ? (
          <MakerEnhance
            user="goodearth"
            index="1"
            href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
          />
        ) : (
          ""
        )}
        <div
          className={cs(
            bootstrap.row,
            { [styles.collectionBlockNonliving]: !isLivingpage },
            { [styles.collectionBlock]: isLivingpage }
          )}
        >
          <div className={cs(bootstrap.colMd8, bootstrap.offsetMd2)}>
            <div className={bootstrap.row}>
              {filterData.map((data: CollectionItem, i: number) => {
                return (
                  <div
                    className={cs(
                      bootstrap.colMd6,
                      bootstrap.col12,
                      "collection-item"
                    )}
                    key={i + "collection-item"}
                  >
                    <CollectionImage
                      data={data}
                      setting={config}
                      key={data.id}
                    />
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
const CollectionLandingRoute = withRouter(CollectionLanding);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionLandingRoute);
export { initActionCollection };
