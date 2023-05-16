import React from "react";
import MakerEnhance from "maker-enhance";
import { PLPProductItem } from "src/typings/product";
import PlpResultItem from "components/plpResultItem";
import initActionSpecific from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import {
  updateCollectionSpecificBanner,
  updateCollectionSpecificData,
  updateFilteredCollectionData
} from "actions/collection";
import { updateComponent, updateModal } from "actions/modal";
import { updateQuickviewId } from "actions/quickview";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import banner from "../../images/bannerBottom.jpg";
import CollectionService from "services/collection";
import { getProductIdFromSlug } from "utils/url";
import ReactHtmlParser from "react-html-parser";
import { collectionProductImpression, pageViewGTM } from "utils/validate";
import { Currency } from "typings/currency";
import { POPUP } from "constants/components";
import metaActionCollection from "./metaAction";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import ProductCounter from "components/ProductCounter";
import { throttle } from "lodash";
import Button from "components/Button";
import PlpCollectionItem from "components/Collection/PlpCollectionItem";
import { RouteComponentProps, withRouter } from "react-router";
import Product from "containers/plp/components/Product";
import ProductBanner from "containers/plp/components/ProductBanner";
import Banner from "containers/plp/components/Banner";

const mapStateToProps = (state: AppState) => {
  return {
    collectionIds: state.collection.collectionIds,
    collectionSpecficBanner: state.collection.collectionSpecficBanner,
    collectionSpecificData: state.collection.collectionSpecficdata,
    currency: state.currency,
    mobile: state.device.mobile,
    location: state.router.location,
    sale: state.info.isSale,
    showTimer: state.info.showTimer,
    filteredCollectionData: state.collection.filteredCollectionData,
    collectionData: state.collection.result,
    collectionMobileView: state.collection.collectionMobileView,
    collectionTemplates: state.collection.collectionTemplates
  };
};

const mapDispatchToProps = (dispatch: Dispatch, params: any) => {
  return {
    updateComponentModal: (
      component: string,
      props: any,
      fullscreen?: boolean
    ) => {
      dispatch(updateComponent(component, props, fullscreen));
    },
    changeModalState: (data: boolean) => {
      dispatch(updateModal(data));
    },
    updateQuickviewId: async () => {
      dispatch(updateQuickviewId(0));
    },
    fetchCollectioSpecificData: async (
      data: any,
      page: any,
      currency: Currency
    ) => {
      const id: any = getProductIdFromSlug(params.slug);
      const filterData = await CollectionService.fetchCollectioSpecificData(
        dispatch,
        id,
        page
      ).catch(error => {
        console.log("Collection Error", error);
      });
      if (filterData) {
        collectionProductImpression(filterData, "CollectionSpecific", currency);
        filterData.results = data.concat(filterData.results);
        dispatch(updateCollectionSpecificData({ ...filterData }));
      }
    },
    // Collection specific template banner fetch data
    fetchCollectionSpecificTemplates: async (id: number) => {
      try {
        await CollectionService.fetchCollectionSpecificTemplates(dispatch, id);
      } catch (err) {
        console.log("fetch Plp Templates error!! ", err);
      }
    },

    resetCollectionSpecificBanner: async () => {
      dispatch(
        updateCollectionSpecificBanner({
          name: "",
          description: "",
          widgetImages: [],
          backgroundImage: "",
          enabled: false,
          products: [],
          id: 0
        })
      );
    },
    reloadCollectioSpecificData: async (currency: Currency) => {
      const id: any = getProductIdFromSlug(params.slug);
      CollectionService.fetchCollectioSpecificBanner(dispatch, id)
        .then(bannerData => {
          dispatch(updateCollectionSpecificBanner({ ...bannerData }));
        })
        .catch(error => {
          console.log(`Collection Error id=${id}`, error);
        });
      const filterData = await CollectionService.fetchCollectioSpecificData(
        dispatch,
        id
      ).catch(error => {
        console.log("Collection Error", error);
      });
      if (filterData) {
        collectionProductImpression(filterData, "CollectionSpecific", currency);
        dispatch(updateCollectionSpecificData({ ...filterData }));
      }
      // on reload collection specific template banner data update
      CollectionService.fetchCollectionSpecificTemplates(dispatch, id).catch(
        error => {
          console.log(`Collection Error id=${id}`, error);
        }
      );
    },
    updateCollection: async (data: any) => {
      dispatch(updateFilteredCollectionData(data));
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;
class CollectionSpecific extends React.Component<
  Props,
  {
    specificMaker: boolean;
    nextPage: number | null;
    loader: boolean;
    shouldScroll: boolean;
    scrollView: boolean;
    showProductCounter: boolean;
    count: number;
  }
> {
  private scrollload = true;

  constructor(props: Props) {
    super(props);
    this.state = {
      specificMaker: false,
      nextPage: null,
      loader: false,
      shouldScroll: false,
      scrollView: false,
      showProductCounter: true,
      count: -1
    };
  }
  pdpURL = "";
  listPath = "";
  collectionId = (decodeURI(this.props.location.pathname)
    .split("_")
    .pop() as string).split("/")[0];

  onBeforeUnload = () => {
    const pdpProductScroll = JSON.stringify({
      id: Number(
        (decodeURI(this.pdpURL)
          .split("_")
          .pop() as string).split("/")[0]
      ),
      timestamp: new Date(),
      source: this.listPath
    });
    localStorage.setItem("collectionSpecificScroll", pdpProductScroll);
  };

  getPdpProduct = (): any => {
    let hasPdpProductDetails = false;
    let pdpProductDetails;
    if (localStorage.getItem("pdpProductScroll")) {
      hasPdpProductDetails = true;
      const item: any = localStorage.getItem("pdpProductScroll");
      pdpProductDetails = JSON.parse(item);
    }
    return { hasPdpProductDetails, pdpProductDetails };
  };

  checkForProductScroll() {
    const currentTimeStamp = new Date().getTime();
    let shouldScroll;
    let pdpProductScroll;
    const hasPdpScrollableProduct = this.getPdpProduct();
    if (hasPdpScrollableProduct.hasPdpProductDetails) {
      pdpProductScroll = hasPdpScrollableProduct.pdpProductDetails;
      if (pdpProductScroll) {
        const pdpTimeStamp = new Date(pdpProductScroll.timestamp).getTime();
        const source = pdpProductScroll.source;
        if (source.toLowerCase() == "collectionspecific") {
          shouldScroll = currentTimeStamp - pdpTimeStamp < 8000;
          this.setState(
            {
              shouldScroll: shouldScroll
            },
            () => {
              if (this.state.shouldScroll) {
                this.handleProductSearch();
              }
            }
          );
        }
      }
    }
  }

  handleProductSearch() {
    const pdpProductScrollId = this.getPdpProduct().pdpProductDetails.id;
    if (document.getElementById(pdpProductScrollId)) {
      setTimeout(() => {
        const element = document.getElementById(pdpProductScrollId);
        element ? element.scrollIntoView(true) : "";
        window.scrollBy(0, -150);
        localStorage.removeItem("pdpProductScroll");
      }, 1000);
      this.setState({
        scrollView: true
      });
    } else {
      this.appendData();
    }
  }

  onClickQuickView = (id: number) => {
    const {
      updateComponentModal,
      changeModalState,
      collectionIds
    } = this.props;
    updateComponentModal(
      POPUP.QUICKVIEW,
      {
        id: id,
        productListId: collectionIds,
        key: id,
        source: "CollectionSpecific"
      },
      true
    );
    changeModalState(true);
  };

  componentWillUnmount() {
    this.onBeforeUnload();
    window.removeEventListener("scroll", this.handleScroll);
    this.props.resetCollectionSpecificBanner();
    window.removeEventListener(
      "scroll",
      throttle(() => {
        this.setProductCount();
      }, 100)
    );
  }

  componentDidMount() {
    const that = this;
    this.pdpURL = this.props.location.pathname;

    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push(function(this: any) {
        this.reset();
      });
      pageViewGTM("CollectionSpecific");
    }
    // dataLayer.push({
    //   event: "CategoryLangingPageView",
    //   PageURL: this.props.location.pathname,
    //   Page_Title: "virtual_categoryLangingPage_view"
    // });
    this.setState({
      specificMaker: true
    });

    this.listPath = "CollectionLanding";

    window.addEventListener("scroll", this.handleScroll);
    if (!this.state.scrollView) {
      this.checkForProductScroll();
    }
    // this.updateCollectionFilter(this.props.currency);
    window.addEventListener(
      "scroll",
      throttle(() => {
        this.setProductCount();
      }, 50)
    );
    let previousUrl = "";
    const observer = new MutationObserver(function(mutations) {
      if (location.href !== previousUrl) {
        previousUrl = location.href;
        that.setState({ count: -1 });
      }
    });
    const config = { subtree: true, childList: true };
    observer.observe(document, config);
  }

  setProductCount = () => {
    const cards = document.querySelectorAll(".collection-container");
    const cardIDs: any = [];
    const height =
      (document.getElementById("collection_banner") as HTMLElement)
        ?.offsetHeight +
      (document.getElementById("collection_desc") as HTMLElement)
        ?.offsetHeight +
      (document.getElementById("collection_long_desc") as HTMLElement)
        ?.offsetHeight;

    cards.forEach(card => {
      cardIDs.push(
        Array.from(card.children[0].children).filter(e => e.id != "")[0]?.id
      );
    });

    const observer = new IntersectionObserver(
      entries => {
        let maxIndex = -Infinity;
        let element: any;
        let productID: any, idx: any;
        entries.forEach((entry, index) => {
          if (
            entry.isIntersecting &&
            entry.target.getBoundingClientRect().bottom <
              window.innerHeight - 450
          ) {
            productID = Array.from(entry.target.children[0].children).filter(
              e => e.id != ""
            )[0]?.id;
            idx = cardIDs.findIndex((e: string) => e == productID);
            if (idx > maxIndex) {
              maxIndex = idx;
              element = entry.target;
            }
          }
        });
        if (element) {
          if (idx > -1) {
            this.setState({ count: idx + 1 });
          }
          if (window.scrollY < height) {
            this.setState({ count: -1 });
          }
        } else if (
          cards[cards.length - 1].getBoundingClientRect().bottom < height ||
          window.scrollY < height
        ) {
          this.setState({ count: -1 });
        }
        observer.disconnect();
      },
      {
        rootMargin: "-130px 0px -90px 0px"
      }
    );
    cards.forEach(card => {
      observer.observe(card);
    });
  };

  updateMobileView = () => {
    if (this.props.mobile) {
      const cards = document.querySelectorAll(".collection-container");
      const cardIDs: any = [];

      cards.forEach(card => {
        cardIDs.push(card.children[0].children[0]?.id);
      });

      const observer = new IntersectionObserver(
        entries => {
          let topMostPos = Infinity;
          let leftMostPos = Infinity;
          let leftMostElement: any;
          entries.forEach((entry, index) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
              const y: number = entry.target.getBoundingClientRect().y;
              const x: number = entry.target.getBoundingClientRect().x;
              if (y < topMostPos) {
                topMostPos = y;
              }
              if (x < leftMostPos) {
                leftMostPos = x;
                leftMostElement = entry.target;
              }
            }
          });
          if (leftMostPos != Infinity) {
            const productID = leftMostElement.children[0].children[0]?.id;
            // this.props.updateMobileView();
            const top: number =
              leftMostElement.getBoundingClientRect().top - 135;
            window.scrollBy({ top: top, behavior: "smooth" });
            if (productID == cardIDs[0]) this.setState({ count: -1 });
          } else {
            // this.props.updateMobileView();
          }
          observer.disconnect();
        },
        {
          rootMargin: "-130px 0px -90px 0px"
        }
      );

      cards.forEach(card => {
        observer.observe(card);
      });
    }
  };

  multipleExist = (data: string[], filter: string[]) => {
    return filter.some(value => {
      return data.includes(value);
    });
  };

  UNSAFE_componentWillReceiveProps = (nextProps: Props) => {
    const vars: { tags?: string } = {};
    const vars2: { tags?: string } = {};

    const re = /[?&]+([^=&]+)=([^&]*)/gi;
    let match: any;

    while ((match = re.exec(this.props.location.search))) {
      vars[match[1]] = match[2];
    }

    while ((match = re.exec(nextProps.location.search))) {
      vars2[match[1]] = match[2];
    }

    if (this.props.currency != nextProps.currency) {
      this.props.reloadCollectioSpecificData(nextProps.currency);
      this.setState({
        specificMaker: false
      });
    }
    if (this.props.collectionSpecificData != nextProps.collectionSpecificData) {
      if (!this.state.scrollView) {
        this.checkForProductScroll();
      }
    }
  };
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
      .fetchCollectioSpecificData(results, next, this.props.currency)
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
    if (this.props.currency != previous.currency) {
      this.setState({
        specificMaker: true
      });
    }
  }

  render() {
    const {
      mobile,
      collectionSpecificData,
      collectionSpecficBanner,
      showTimer
    } = this.props;
    const {
      view_more_collections,
      all_collection_link,
      longDescription,
      results,
      tags,
      shortDescription,
      category
    } = collectionSpecificData;
    const { widgetImages, name } = collectionSpecficBanner;
    const { specificMaker } = this.state;

    // Collection specific template banner data initialization
    const showTemplates: any = {
      Banner: null,
      Product: null,
      ProductBanner: null
    };

    let productTemplatePos = -1;
    let productBannerTemplatePos = -1;
    if (this.props.collectionTemplates.templates.length > 0) {
      this.props.collectionTemplates.templates.map(template => {
        showTemplates[template.template] = template;
      });
      if (showTemplates["Product"]) {
        productTemplatePos = parseInt(showTemplates["Product"].placement);
      }
      if (showTemplates["ProductBanner"]) {
        productBannerTemplatePos = parseInt(
          showTemplates["ProductBanner"].placement.split("-")[0]
        );
        if (
          productTemplatePos > -1 &&
          productBannerTemplatePos > productTemplatePos
        ) {
          productBannerTemplatePos--;
        }
      }
    }

    return (
      <div
        className={cs(styles.collectionContainer, {
          [styles.collectionContainerTimer]: showTimer
        })}
      >
        {/* {!mobile && (
          <SecondaryHeader>
            <Breadcrumbs
              levels={breadcrumbs}
              className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}
            />
          </SecondaryHeader>
        )} */}
        {specificMaker && (
          <MakerEnhance
            user="goodearth"
            index="1"
            href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
          />
        )}
        <section id="collection_banner">
          <div className={cs(bootstrap.row, styles.firstBlock)}>
            {/* First check for widgetImages data if available then show that 
             else collection specific banner section will show */}
            {widgetImages?.length ? (
              <>
                <div className={bootstrap.col12}>
                  {widgetImages.map((widget: any) => {
                    if (mobile && widget.imageType == 2) {
                      return (
                        <img
                          key="mobile-collectionspecific-banner"
                          src={widget.image}
                          className={globalStyles.imgResponsive}
                          alt="Collection Widget"
                        />
                      );
                    } else if (!mobile && widget.imageType == 1) {
                      return (
                        <img
                          key="desktop-collectionspecific-banner"
                          src={widget.image}
                          className={globalStyles.imgResponsive}
                          alt="Collection Banner"
                        />
                      );
                    }
                  })}
                </div>

                <div className={bootstrap.col12}>
                  <img
                    src={banner}
                    className={globalStyles.imgResize}
                    alt="Collection Image"
                  />
                </div>
              </>
            ) : (
              <div
                className={
                  mobile
                    ? banner
                      ? cs(
                          bootstrap.row,
                          styles.imageContainerMobileBanner,
                          globalStyles.paddTop20
                        )
                      : cs(
                          bootstrap.row,
                          styles.imageContainerMobile,
                          globalStyles.paddTop20
                        )
                    : cs(
                        bootstrap.row,
                        styles.imageContainer,
                        styles.minHeight,
                        globalStyles.paddTop20
                      )
                }
                id="product_images"
              >
                {showTemplates.Banner && (
                  <Banner data={showTemplates.Banner} mobile={mobile} />
                )}
              </div>
            )}
          </div>
        </section>
        <div
          className={styles.goBack}
          onClick={() => {
            this.props?.history.push("/" + all_collection_link);
          }}
        >
          &lt; BACK TO ALL COLLECTIONS
        </div>

        <div className={styles.tagWrp}>
          {tags?.map((tag: string, i: number) => (
            <p key={i} className={styles.tag}>
              {tag}
            </p>
          ))}
        </div>
        <div className={cs(bootstrap.row, styles.padding)} id="collection_desc">
          <div
            className={cs(
              bootstrap.colMd12,
              globalStyles.textCenter,
              styles.collectionName
            )}
          >
            {name} {category}
          </div>
        </div>

        <p className={styles.subTitle}>{ReactHtmlParser(shortDescription)}</p>
        <div className={bootstrap.row} id="collection_long_desc">
          <div
            className={cs(
              bootstrap.col8,
              bootstrap.offset2,
              bootstrap.colMd4,
              bootstrap.offsetMd4,
              styles.collectionLowertext,
              globalStyles.textCenter
            )}
          >
            {ReactHtmlParser(longDescription)}
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
                <React.Fragment key={data.id}>
                  {/* Product(banner) section */}
                  {showTemplates["Product"] &&
                  results.length >= productTemplatePos &&
                  i == productTemplatePos - 1 ? (
                    <Product
                      key={`product-${i}`}
                      data={showTemplates.Product}
                      view={this.props.collectionMobileView}
                      mobile={mobile}
                    />
                  ) : (
                    ""
                  )}
                  {/* Product banner section */}
                  {showTemplates["ProductBanner"] &&
                  results.length >= productBannerTemplatePos &&
                  i == productBannerTemplatePos - 1 ? (
                    <ProductBanner
                      data={showTemplates.ProductBanner}
                      mobile={mobile}
                    />
                  ) : (
                    ""
                  )}
                  <div
                    className={cs(
                      bootstrap.colMd4,
                      bootstrap.col6,
                      "collection-container"
                    )}
                    key={data.id + "plpDiv"}
                    id={i == 0 ? "first-item" : ""}
                    onClick={() => this.updateMobileView()}
                  >
                    <PlpResultItem
                      page="CollectionSpecific"
                      position={i}
                      product={data}
                      addedToWishlist={false}
                      currency={this.props.currency}
                      key={data.id + "plpitem"}
                      mobile={mobile}
                      onClickQuickView={this.onClickQuickView}
                      isCollection={true}
                      loader={
                        !this.scrollload && results.length > 0 ? true : false
                      }
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {Object.entries(view_more_collections || {})?.length ? (
          <div className={styles.moreCollectionWrp}>
            <h2>View More Collections</h2>
            <div className={styles.moreCollectionImgsWrp}>
              {Object.entries(view_more_collections)?.map((collection, i) => (
                <PlpCollectionItem key={i} collectionData={collection[1]} />
              ))}
            </div>
            <div className={styles.btnWrp}>
              <Button
                label={"ALL COLLECTIONS"}
                className={styles.button}
                onClick={() =>
                  this.props?.history.push("/" + all_collection_link)
                }
              />
            </div>
          </div>
        ) : null}
        {specificMaker && (
          <MakerEnhance
            user="goodearth"
            index="2"
            href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
          />
        )}
        {mobile && this.state.count > -1 && this.state.showProductCounter && (
          <ProductCounter
            current={this.state.count}
            total={results?.length}
            id="collection-product-counter"
          />
        )}
      </div>
    );
  }
}

const CollectionSpecificWithRouter = withRouter(CollectionSpecific);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionSpecificWithRouter);
export { initActionSpecific };
export { metaActionCollection };
