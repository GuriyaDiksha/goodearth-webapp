import loadable from "@loadable/component";
import React, { ReactNode } from "react";
import MakerEnhance from "maker-enhance";
import SecondaryHeader from "components/SecondaryHeader";
import Breadcrumbs from "components/Breadcrumbs";
import { PLPProductItem } from "src/typings/product";
import PlpResultItem from "components/plpResultItem";
import initActionSpecific from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import { updateCollectionSpecificData } from "actions/collection";
import { updateComponent, updateModal } from "actions/modal";
import { updateQuickviewId } from "actions/quickview";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import banner from "../../images/bannerBottom.jpg";
import CollectionService from "services/collection";
import { getProductIdFromSlug } from "utils/url.ts";
import Loader from "components/Loader";

const Quickview = loadable(() => import("components/Quickview"));

const mapStateToProps = (state: AppState) => {
  return {
    collectionIds: state.collection.collectionIds,
    collectionSpecficBanner: state.collection.collectionSpecficBanner,
    collectionSpecificData: state.collection.collectionSpecficdata,
    currency: state.currency,
    mobile: state.device.mobile,
    location: state.router.location
  };
};

const mapDispatchToProps = (dispatch: Dispatch, params: any) => {
  return {
    updateComponentModal: (component: ReactNode, fullscreen?: boolean) => {
      dispatch(updateComponent(component, fullscreen));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    },
    updateQuickviewId: async () => {
      dispatch(updateQuickviewId(0));
    },
    fetchCollectioSpecificData: async (data: any, page: any) => {
      const id: any = getProductIdFromSlug(params.slug);
      const filterData = await CollectionService.fetchCollectioSpecificData(
        id,
        page
      ).catch(error => {
        console.log("Collection Error", error);
      });
      if (filterData) {
        filterData.results = data.concat(filterData.results);
        dispatch(updateCollectionSpecificData({ ...filterData }));
      }
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class CollectionSpecific extends React.Component<
  Props,
  { specificMaker: boolean; nextPage: number | null; loader: boolean }
> {
  private scrollload = true;

  constructor(props: Props) {
    super(props);
    this.state = {
      specificMaker: false,
      nextPage: null,
      loader: false
    };
  }

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

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  componentDidMount() {
    this.setState({
      specificMaker: true
    });
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html: any = document.getElementById("product_images");
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (
      windowBottom + 2000 >= docHeight &&
      this.scrollload &&
      this.props.collectionSpecificData.next
    ) {
      this.appendData();
    }
  };

  appendData = () => {
    const { results, next } = this.props.collectionSpecificData;
    this.scrollload = false;
    this.setState({
      loader: this.scrollload
    });
    this.props
      .fetchCollectioSpecificData(results, next)
      .then(res => {
        this.scrollload = true;
        this.setState({
          loader: this.scrollload
        });
      })
      .catch(error => {
        this.scrollload = true;
        this.setState({
          loader: this.scrollload
        });
      });
  };

  componentDidUpdate(previous: Props) {
    if (
      this.props.location.pathname != previous.location.pathname &&
      !this.state.specificMaker
    ) {
      this.setState({
        specificMaker: true
      });
    }
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
        {specificMaker && (
          <MakerEnhance
            user="goodearth"
            index="1"
            href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
          />
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
            id="product_images"
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
          {!this.scrollload ? <Loader /> : ""}
        </div>
        {specificMaker && (
          <MakerEnhance
            user="goodearth"
            index="2"
            href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
          />
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionSpecific);
export { initActionSpecific };
