import React from "react";
import { Link } from "react-router-dom";
import cs from "classnames";
import { AppState } from "reducers/typings";
import MakerEnhance from "maker-enhance";
import globalStyles from "styles/global.scss";
import "../../styles/myslick.css";
import styles from "./styles.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import bannermotive from "../../images/banner-motif.png";
import bannerborder from "../../images/banner2-border.jpg";
import closeShopthelook from "../../images/close-Shopthelook.svg";
import Shopthelook from "../../images/Shopthelook.svg";
import bird from "../../images/bird-motif.png";
import WhatPeopleBuying from "components/PeopleBuying";
import CategoryService from "services/category";
import { CategoryProps } from "typings/category";
import { addCategoryData } from "actions/category";
import { getProductIdFromSlug, getProductNameFromSlug } from "utils/url";
// import Instagram from "components/Instagram";
import "./slick.css";
import initActionCategoryLanding from "./initAction";
import metaActionCategoryLanding from "./metaAction";
// import { Settings } from "react-slick";
// import CollectionImage from "components/collectionItem";
// import { CollectionItem } from "components/collectionItem/typings";
// import MobileDropdownMenu from "components/MobileDropdown";
import Slider, { Settings } from "react-slick";
import LazyImage from "components/LazyImage";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import {
  pageViewGTM,
  promotionClick,
  promotionImpression
} from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const mapStateToProps = (state: AppState) => {
  return {
    shopthelook1: state.category.shopthelook1,
    shopthelook2: state.category.shopthelook2,
    editSection: state.category.editSection,
    topliving: state.category.topliving,
    peoplebuying: state.category.peoplebuying,
    newarrival: state.category.newarrival,
    location: state.router.location,
    data: state.collection.data,
    currency: state.currency,
    device: state.device,
    showTimer: state.info.showTimer
  };
};

const mapActionsToProps = (dispatch: Dispatch) => {
  return {
    reloadCategoryLanding: async ({ slug }: any) => {
      const id = getProductIdFromSlug(slug);
      const name = getProductNameFromSlug(slug)?.toUpperCase();
      if (id) {
        const [
          shopthelook1,
          shopthelook2,
          editSection,
          topliving,
          peoplebuying
        ] = await Promise.all([
          CategoryService.fetchCategoryMultiImage(
            dispatch,
            `CAT_${id}_1`
          ).catch(err => {
            console.log("Colloection Page error =" + id);
          }),
          CategoryService.fetchCategoryMultiImage(
            dispatch,
            `CAT_${id}_2`
          ).catch(err => {
            console.log("Colloection Page error CAT_=" + id);
          }),
          CategoryService.fetchCategoryMultiImage(
            dispatch,
            `${name}CURATED`
          ).catch(err => {
            console.log("Colloection Page error CURATED =" + id);
          }),
          CategoryService.fetchCategoryMultiImage(dispatch, `TOP${name}`).catch(
            err => {
              console.log("Colloection Page error TOP =" + id);
            }
          ),
          CategoryService.fetchLatestProduct(dispatch, id).catch(err => {
            console.log("Colloection Page error =" + id);
          })
        ]);
        const data: CategoryProps = {
          shopthelook1: shopthelook1,
          shopthelook2: shopthelook2,
          editSection: editSection,
          topliving: topliving,
          peoplebuying: peoplebuying,
          newarrival: {}
        };
        dispatch(addCategoryData({ ...data }));
      }
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapActionsToProps>;

class CategoryLanding extends React.Component<
  Props,
  { catLanding: boolean; show: boolean; showbottom: boolean; isSale: boolean }
> {
  state = {
    catLanding: false,
    show: false,
    showbottom: false,
    isSale: false
  };
  componentDidMount() {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push(function(this: any) {
        this.reset();
      });
      pageViewGTM("CategoryLanding");
      dataLayer.push({
        event: "CategoryLandingView",
        PageURL: this.props.location.pathname,
        Page_Title: "virtual_categoryLanding_view"
      });
    }
    if (userConsent.includes(GA_CALLS)) {
      Moengage.track_event("Page viewed", {
        "Page URL": this.props.location.pathname,
        "Page Name": "CategoryLandingView"
      });
    }
    this.setState({
      catLanding: true
    });
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
  }

  UNSAFE_componentWillReceiveProps(newprops: any) {
    if (this.props.location.pathname != newprops.pathname) {
      pageViewGTM("CategoryLanding");
      this.setState({
        catLanding: false
      });
    }

    if (this.props.currency != newprops.currency) {
      this.props.reloadCategoryLanding(this.props);
      this.setState({
        catLanding: false
      });
    }
  }

  componentDidUpdate(previousProps: any, previousState: any) {
    if (
      this.props.location.pathname != previousProps.location.pathname &&
      !this.state.catLanding
    ) {
      this.setState({
        catLanding: true
      });
    }
    if (this.props.currency != previousProps.currency) {
      this.setState({
        catLanding: true
      });
    }
  }

  createTopliving() {
    const html = [],
      data = this.props.topliving,
      settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "200px",
        //autoplay: true,
        //autoplayspeed: 1000,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              centerMode: true,
              centerPadding: "30px",
              arrows: false
            }
          }
        ]
      };
    if (!data.widgetImages) return false;

    html.push(
      <Slider
        {...settings}
        className={
          this.props.device.mobile ? styles.noArrows : styles.categoryArrow
        }
      >
        {data.widgetImages.map((img: any, i: number) => {
          return (
            <div className={styles.imgWidth} key={i}>
              <h2 className={styles.headLink3}>
                <span>&nbsp;{img.title.split("|")[0]}</span>
                <span>{img.title.split("|")[1]}&nbsp;</span>
              </h2>
              {img.banner_type == 1 ? (
                <iframe width="70%" height="474px" src={img.video_url}></iframe>
              ) : (
                <Link
                  to={img.ctaUrl}
                  onClick={() => promotionClick(Object.assign({}, data, img))}
                >
                  <img
                    src={img.image}
                    className={globalStyles.imgResponsive}
                    alt={img.altText || img.ctaText}
                  />
                </Link>
              )}
              <div
                className={cs(
                  globalStyles.textCenter,
                  globalStyles.voffset2,
                  styles.ctaCurly
                )}
              >
                <Link
                  to={img.ctaUrl}
                  onClick={() => promotionClick(Object.assign({}, data, img))}
                >
                  {img.ctaText}
                </Link>
              </div>
            </div>
          );
        })}
      </Slider>
    );

    if (html.length) {
      promotionImpression(data);
    }
    return html;
  }

  closeShoplook() {
    this.setState({
      show: !this.state.show
    });
  }

  closeBottomShoplook() {
    this.setState({
      showbottom: !this.state.showbottom
    });
  }

  getBannerForCategory(allData: any, id: number) {
    const data = allData.widgetData || [],
      html: any = [];
    data.map((widget: any, i: number) => {
      if (this.props.device.mobile) {
        if (widget.imageType == 2) {
          html.push(
            <div>
              <img
                src={widget.image}
                className={globalStyles.imgResponsive}
                alt={widget.altText || widget.ctaText}
              />
              {widget.ctaText ? (
                <div
                  className={cs(
                    styles.bannerBtnLink,
                    styles.icon,
                    globalStyles.textCenter
                  )}
                >
                  <Link
                    to={widget.ctaUrl}
                    onClick={() =>
                      promotionClick(Object.assign({}, allData, widget))
                    }
                  >
                    <span>{widget.ctaText}</span>
                  </Link>
                </div>
              ) : (
                ""
              )}
            </div>
          );
        }
      } else if (widget.imageType == 1) {
        html.push(
          <div>
            <img
              alt={widget.altText || widget.ctaText}
              src={widget.image}
              className={cs(globalStyles.imgResponsive, styles.cursorPointer)}
            />
            {widget.ctaText ? (
              <div
                className={cs(
                  styles.bannerBtnLink,
                  styles.icon,
                  globalStyles.textCenter
                )}
              >
                <Link
                  to={widget.ctaUrl}
                  onClick={() =>
                    promotionClick(Object.assign({}, allData, widget))
                  }
                >
                  <span>{widget.ctaText}</span>
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
        );
      }
    });
    if (html.length) {
      promotionImpression(allData);
    }
    return html;
  }

  createMiddleBlock() {
    const htmlblock1 = [];
    if (this.props.editSection.widgetImages) {
      const data = this.props.editSection.widgetImages;
      for (let i = 0; i < data.length; i++) {
        if (i % 2 == 0) {
          htmlblock1.push(
            <div className={bootstrap.colMd6}>
              <div className={cs(bootstrap.row, styles.leftPromo)}>
                <div className={cs(bootstrap.colMd12, styles.promoDisp)}>
                  <Link
                    to={data[i].ctaUrl}
                    onClick={() =>
                      promotionClick(
                        Object.assign({}, this.props.editSection, data[i + 1])
                      )
                    }
                  >
                    <img
                      src={data[i].image}
                      alt={data[i].alt}
                      className={globalStyles.imgResponsive}
                    />
                  </Link>
                </div>
                <div
                  className={cs(
                    bootstrap.colMd12,
                    styles.promoDisp,
                    styles.colReverse,
                    styles.txtDispLeft
                  )}
                >
                  <div
                    className={cs(
                      styles.alignDispLeft,
                      styles.textRight,
                      styles.widthLess
                    )}
                  >
                    <h4 className={styles.headLink2}>
                      <p>{data[i + 1].title.split("|")[0]}</p>
                      <p>{data[i + 1].title.split("|")[1]}</p>
                    </h4>
                    <div className={styles.smallDesc}>
                      {data[i + 1].description}
                    </div>
                    <div
                      className={cs(
                        styles.ctaCurly,
                        styles.textCenter,
                        styles.pullRight
                      )}
                    >
                      <Link
                        to={data[i + 1].ctaUrl}
                        onClick={() =>
                          promotionClick(
                            Object.assign(
                              {},
                              this.props.editSection,
                              data[i + 1]
                            )
                          )
                        }
                      >
                        {" "}
                        {data[i + 1].ctaText}{" "}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          htmlblock1.push(
            <div className={bootstrap.colMd6}>
              <div className={cs(bootstrap.row, styles.rightPromo)}>
                <div
                  className={cs(
                    bootstrap.colMd8,
                    styles.promoDisp,
                    styles.txtDisp,
                    styles.textLeft
                  )}
                >
                  <h4 className={styles.headLink2}>
                    <p>{data[i - 1].title.split("|")[0]}</p>
                    <p>{data[i - 1].title.split("|")[1]}</p>
                  </h4>
                  <div className={styles.smallDesc}>
                    {data[i - 1].description}
                  </div>
                  <div className={cs(styles.ctaCurly, styles.textCenter)}>
                    <Link
                      to={data[i - 1].ctaUrl}
                      onClick={() =>
                        promotionClick(
                          Object.assign({}, this.props.editSection, data[i - 1])
                        )
                      }
                    >
                      {" "}
                      {data[i - 1].ctaText}
                    </Link>
                  </div>
                </div>
                <div
                  className={cs(
                    bootstrap.colMd12,
                    styles.promoDisp,
                    styles.textLeft
                  )}
                >
                  <Link
                    to={data[i].ctaUrl}
                    onClick={() =>
                      promotionClick(
                        Object.assign({}, this.props.editSection, data[i - 1])
                      )
                    }
                  >
                    <img
                      src={data[i].image}
                      alt={data[i].alt}
                      className={globalStyles.imgResponsive}
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        }
      }
    }
    if (htmlblock1.length) {
      promotionImpression(this.props.editSection);
    }
    return htmlblock1;
  }

  createMiddleBlockMobile() {
    const html: any = [];
    {
      this.props.editSection.widgetImages
        ? this.props.editSection.widgetImages.map((data: any, i: number) => {
            if (i % 2 == 0) {
              html.push(
                <div className={bootstrap.col12}>
                  <div className={cs(bootstrap.row, styles.leftPromo)}>
                    <div className={cs(bootstrap.row, styles.promoDisp)}>
                      <Link
                        to={data.ctaUrl}
                        onClick={() =>
                          promotionClick(
                            Object.assign({}, this.props.editSection, data)
                          )
                        }
                      >
                        <LazyImage
                          src={data.image}
                          alt={data.alt}
                          className={globalStyles.imgResponsive}
                        />
                      </Link>
                    </div>
                    <div
                      className={cs(
                        bootstrap.col12,
                        styles.promoDisp,
                        styles.txtDisp
                      )}
                    >
                      <h2 className={styles.headLink2}>
                        <p>{data.title.split("|")[0]}</p>
                        <p>{data.title.split("|")[1]}</p>
                      </h2>

                      <span className={styles.subtitleHead}>
                        {data.description}
                      </span>
                      <div className={styles.ctaCurly}>
                        <Link
                          to={data.ctaUrl}
                          onClick={() =>
                            promotionClick(
                              Object.assign({}, this.props.editSection, data)
                            )
                          }
                        >
                          {data.ctaText}
                        </Link>
                      </div>
                      <div>
                        <img src={bannermotive} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              html.push(
                <div className={cs(bootstrap.col12, bootstrap.colMd6)}>
                  <div className={cs(bootstrap.col12, styles.promoDisp)}>
                    <Link to={data.ctaUrl}>
                      <img
                        src={data.image}
                        alt={data.title}
                        className={globalStyles.imgResponsive}
                        onClick={() =>
                          promotionClick(
                            Object.assign({}, this.props.editSection, data)
                          )
                        }
                      />
                    </Link>
                  </div>
                  <div className={cs(bootstrap.col12, styles.promoDisp)}>
                    <div className={styles.alignDispLeft}>
                      <h2 className={styles.headLink2}>
                        <p>{data.title.split("|")[0]}</p>
                        <p>{data.title.split("|")[1]}</p>
                      </h2>
                      <span className={styles.subtitleHead}>
                        {data.description}
                      </span>
                      <div className={styles.ctaCurly}>
                        <Link
                          to={data.ctaUrl}
                          onClick={() =>
                            promotionClick(
                              Object.assign({}, this.props.editSection, data)
                            )
                          }
                        >
                          {data.ctaText}
                        </Link>
                      </div>
                      <div className={globalStyles.voffset5}>
                        <img src={bird} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })
        : "";
    }
    if (html.length) {
      promotionImpression(this.props.editSection);
    }
    return html;
  }

  render() {
    const { catLanding, show, showbottom } = this.state;
    const {
      shopthelook1,
      shopthelook2,
      editSection,
      peoplebuying,
      device: { mobile }
    } = this.props;

    // if (!peoplebuying.length) {
    //   return null;
    // } var settings = {

    const config: Settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      arrows: true,
      slidesToScroll: 1,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            centerMode: true,
            centerPadding: "60px",
            arrows: false
          }
        }
      ]
    };
    return (
      <div
        className={cs(
          "category-landing",
          styles.pageBody,
          { [styles.pageBodyTimer]: this.props.showTimer },
          bootstrap.containerFluid
        )}
      >
        {catLanding && (
          <div className={cs(bootstrap.row, styles.firstBlock)}>
            <div className={cs(bootstrap.col12, styles.heroBannerHome)}>
              <MakerEnhance
                user="goodearth"
                index="1"
                href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
              />
            </div>
          </div>
        )}
        {shopthelook1.widgetImages ? (
          shopthelook1.widgetImages.length > 0 ? (
            <section>
              <div className={cs(bootstrap.row, styles.firstBlock)}>
                <div className={cs(bootstrap.col12, styles.heroBannerHome)}>
                  {this.getBannerForCategory(shopthelook1, shopthelook1.id)}
                  <div className={bootstrap.row}>
                    <div className={bootstrap.col12}>
                      {/* {show ? <ShopTheLook listdata={shopthelook1.product}
                                                            close={this.closeShoplook}/> : ""} */}
                    </div>
                  </div>
                </div>
                <div className={bootstrap.col12}>
                  <img
                    src={shopthelook1.background_image}
                    className={bootstrap.imgResponsive}
                  />
                  {!mobile ? (
                    <div className={styles.bannerBottomIcon}>
                      <img src={bannermotive} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {(shopthelook1.product ? (
                  shopthelook1.product.length > 0 ? (
                    true
                  ) : (
                    false
                  )
                ) : (
                  false
                )) ? (
                  <div className={styles.iconShop}>
                    <img
                      src={show ? closeShopthelook : Shopthelook}
                      onClick={this.closeShoplook}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </section>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {/*  {isSale ? (
          ""
        ) : (
         <section>
            <div className={cs(bootstrap.row, styles.heroBannerHome)}>
              <div
                className={cs(
                  bootstrap.col12,
                  styles.textCenter,
                  styles.newArrivals
                )}
              >
               <NewArrivals /> 
              </div>
            </div>
          </section>
        )}  */}
        {catLanding && (
          <div className={cs(bootstrap.row, styles.firstBlock)}>
            <div className={cs(bootstrap.col12, styles.heroBannerHome)}>
              <MakerEnhance
                user="goodearth"
                index="2"
                href={`${window.location.origin}${this.props.location.pathname}?${this.props.location.search}`}
              />
            </div>
          </div>
        )}
        {this.props.topliving.widgetImages && (
          <section>
            <div className={cs(styles.catVideosBlock, "featured-section")}>
              <div className={styles.textCenter}>{this.createTopliving()}</div>
            </div>
          </section>
        )}
        {editSection.widgetImages && mobile && (
          <section className={cs(styles.catThirdBlock, styles.textCenter)}>
            <div className={globalStyles.gutter0}>
              <h2 className={styles.headLink}>{editSection.name}</h2>
              <div className={styles.smallDesc}>{editSection.description}</div>

              <div className={bootstrap.row}>
                {this.createMiddleBlockMobile()}
              </div>
            </div>
          </section>
        )}
        {editSection.widgetImages && !mobile && (
          <section
            className={cs(
              styles.catThirdBlock,
              globalStyles.textCenter,
              globalStyles.voffset6
            )}
            style={{
              background:
                "url('" + editSection.background_image + "') no-repeat"
            }}
          >
            <div className={cs(globalStyles.gutter0, bootstrap.container)}>
              <h2 className={styles.headLink}> {editSection.name}</h2>
              <div className={styles.smallDesc}>{editSection.description}</div>
              <div className={cs(bootstrap.row, styles.voffset3)}>
                {this.createMiddleBlock()}
              </div>
            </div>
          </section>
        )}

        {peoplebuying && (
          <section>
            {peoplebuying.results?.length >= 4 &&
              typeof document !== "undefined" && (
                <div className={cs(bootstrap.row, styles.fBlock)}>
                  <div
                    className={cs(bootstrap.colMd12, globalStyles.textCenter)}
                  >
                    <WhatPeopleBuying
                      data={peoplebuying.results}
                      setting={config}
                      mobile={mobile}
                      currency={this.props.currency}
                    />
                  </div>
                </div>
              )}
          </section>
        )}
        {shopthelook2.widgetImages ? (
          shopthelook2.widgetImages.length > 0 ? (
            <section>
              <div className={cs(bootstrap.row, styles.slickShopthelook)}>
                <div className={bootstrap.col12}>
                  <img
                    src={bannerborder}
                    className={globalStyles.imgResponsive}
                  />
                </div>
                <div className={cs(bootstrap.col12, styles.heroBannerHome)}>
                  {this.getBannerForCategory(shopthelook2, shopthelook2.id)}
                  <div className={bootstrap.row}>
                    <div className={bootstrap.col12}>
                      {/* {showbottom ? <ShopTheLook listdata={shopthelook2.product}
                                                        close={this.closeBottomShoplook.bind(this)}/> : ""} */}
                    </div>
                  </div>
                </div>
                <div className={bootstrap.col12}>
                  <img
                    src={bannerborder}
                    className={globalStyles.imgResponsive}
                  />
                </div>
                {(shopthelook2.product ? (
                  shopthelook2.product.length > 0 ? (
                    true
                  ) : (
                    false
                  )
                ) : (
                  false
                )) ? (
                  <div className={styles.iconShop}>
                    <img
                      src={showbottom ? closeShopthelook : Shopthelook}
                      onClick={this.closeBottomShoplook.bind(this)}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </section>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {/* <section>
          <div id="inst" className={styles.instafeed1}>
            <Instagram />
          </div>
          <div className={cs(styles.iconInsta, globalStyles.textCenter)}>
            <a
              href="http://www.instagram.com/goodearthindia"
              target="_blank"
              rel="noopener noreferrer"
              className="icon icon_footer-instagram"
            ></a>
            <br />
            <a
              href="http://www.instagram.com/goodearthindia"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconInsta}
            >
              @goodearthindia
            </a>
          </div>
        </section> */}
      </div>
    );
  }
}
export default connect(mapStateToProps, mapActionsToProps)(CategoryLanding);
export { initActionCategoryLanding };
export { metaActionCategoryLanding };
