import React, { Component, LegacyRef } from "react";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
import mapActionsToProps from "./actions";
import { withRouter, RouteComponentProps } from "react-router-dom";
import cs from "classnames";
import styles from "./styles.scss";
import storeIcon from "images/shopLocator/store.svg";
import cafeIcon from "images/shopLocator/cafe.svg";
import anarIcon from "images/shopLocator/anar.png";
import "./shoplocator-slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
import prevIcon from "../../images/shopLocator_LeftArrow.svg";
import nextIcon from "../../images/shopLocator_RightArrow.svg";
import globalStyles from "styles/global.scss";

import Accordion from "components/Accordion";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000
};

const mapStateToProps = (state: AppState) => {
  return {
    mobile: state.device.mobile,
    tablet: state.device.tablet,
    saleTimer: state.info.showTimer
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapActionsToProps> &
  DispatchProp &
  RouteComponentProps & {
    city: string;
  };

type State = {
  shopData: any;
  currentCity: string;
  currentCityData: any;
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

class ShopLocator extends Component<Props, State> {
  containerRef: LegacyRef<HTMLDivElement> | undefined;
  constructor(props: any) {
    super(props);
    this.state = {
      shopData: {},
      currentCity: "",
      currentCityData: {},
      canScrollLeft: false,
      canScrollRight: true
    };
    this.containerRef = React.createRef<HTMLDivElement>();
  }

  onHeaderItemClick = (data: any) => {
    // if (
    //   document.getElementById("bottomSlide") &&
    //   document.getElementById(data)
    // ) {
    //   (document.getElementById("bottomSlide") as HTMLDivElement).style.left =
    //     (document.getElementById(data) as HTMLDivElement).offsetLeft + "px";
    // }
    this.setState({
      currentCity: data
    });
    window.history.pushState("", "", data);
  };

  scrollTop = () => {
    const banner = document.getElementById("page-banner") as HTMLDivElement;
    const h1 = banner.clientHeight;
    window.scrollTo({ top: h1, behavior: "smooth" });
  };
  horizontalScroll = (direction: string) => {
    if (direction === "left" && !this.state.canScrollLeft) return;
    if (direction === "right" && !this.state.canScrollRight) return;
    const scrollAmount = 240;
    const container = (this.containerRef as React.RefObject<HTMLDivElement>)
      .current;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  checkScrollPosition = () => {
    const container = (this.containerRef as React.RefObject<HTMLDivElement>)
      .current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      this.setState({
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 1
      });
    }
  };

  componentDidMount(): void {
    this.props
      .fetchShopLocatorData()
      .then((data: any) => {
        this.setState(
          {
            shopData: data
          },
          () => {
            if (this.props.city) {
              this.setState({ currentCity: this.props.city }, () => {
                const ele = document.getElementById(
                  this.props.city || ""
                ) as HTMLDivElement;
                if (ele) {
                  ele?.focus();
                  // if (document.getElementById("bottomSlide")) {
                  //   (document.getElementById(
                  //     "bottomSlide"
                  //   ) as HTMLDivElement).style.left = ele.offsetLeft + "px";
                  // }
                  setTimeout(() => {
                    ele.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "center"
                    });
                  }, 100);
                }
              });
            } else {
              // change this
              this.setState(
                {
                  currentCity: Object.keys(this.state.shopData)[0]
                },
                () => {
                  const ele = document.getElementById(
                    Object.keys(this.state.shopData)[0] || ""
                  ) as HTMLDivElement;
                  if (ele) {
                    ele?.focus();
                    // if (document.getElementById("bottomSlide")) {
                    //   (document.getElementById(
                    //     "bottomSlide"
                    //   ) as HTMLDivElement).style.left = ele.offsetLeft + "px";
                    // }
                    setTimeout(() => {
                      ele.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center"
                      });
                    }, 100);
                  }
                }
              );
            }
          }
        );
      })
      .catch((err: any) => {
        console.log(err);
      });
    //always load page from description
    setTimeout(() => {
      this.scrollTop();
    }, 100);

    const container = (this.containerRef as React.RefObject<HTMLDivElement>)
      .current;
    if (container) {
      window.addEventListener("resize", this.checkScrollPosition);
      container.addEventListener("scroll", this.checkScrollPosition);
      this.checkScrollPosition();
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    setTimeout(() => {
      const city = window.location.href
        .split("/")
        .pop()
        ?.split("?")?.[0];
      if (this.state.currentCity !== city) {
        this.setState(
          {
            currentCity: city || ""
          },
          () => {
            const ele = document.getElementById(city || "") as HTMLDivElement;
            if (ele) {
              ele?.focus();
              // if (document.getElementById("bottomSlide")) {
              //   (document.getElementById(
              //     "bottomSlide"
              //   ) as HTMLDivElement).style.left = ele.offsetLeft + "px";
              //   (document.getElementById(
              //     "bottomSlide"
              //   ) as HTMLDivElement).scrollTo({
              //     left: ele.offsetLeft,
              //     behavior: "smooth"
              //   });
              // }
              setTimeout(() => {
                ele.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center"
                });
              }, 100);
            }
          }
        );
      }
      if (
        prevState.currentCity != "" &&
        prevState.currentCity !== this.state.currentCity
      ) {
        const banner = document.getElementById("page-banner") as HTMLDivElement;
        const description = document.getElementById(
          "page-description"
        ) as HTMLDivElement;
        const mainHeaderHeight = document.getElementById(
          "myHeader"
        ) as HTMLDivElement;
        const h1 = banner.clientHeight;
        const h2 = description.clientHeight;
        const h3 = mainHeaderHeight.clientHeight;
        const total = h1 + h2 + h3;
        window.scrollTo({ top: total, left: 0 });
      }
      if (prevState.shopData !== this.state.shopData) {
        this.checkScrollPosition();
      }
    }, 500);
  }

  componentWillUnmount(): void {
    const container = (this.containerRef as React.RefObject<HTMLDivElement>)
      .current;
    if (container) {
      window.removeEventListener("resize", this.checkScrollPosition);
      container.removeEventListener("scroll", this.checkScrollPosition);
    }
  }

  render() {
    const { shopData, currentCity } = this.state;
    const { saleTimer, mobile, tablet } = this.props;

    return (
      <div
        className={cs(styles.pageContainer, {
          [styles.saleTimerMargin]: this.props.saleTimer
        })}
      >
        <div
          className={cs(styles.banner, { [styles.tabletBanner]: tablet })}
          id="page-banner"
        >
          {/* <div className={styles.bannerText}>Find us near you</div> */}
        </div>
        <div className={styles.pageDescription} id="page-description">
          <div className={styles.text}>
            Our stores reflect inspirations from the city where they’re located,
            telling tales of tradition, design, and culture through a uniquely
            Good Earth lens. With signature playlists, custom service, and daily
            incense rituals, we invite you into our world.
          </div>
        </div>
        <div
          className={cs(styles.headerBox, {
            [styles.withTimer]: saleTimer,
            [globalStyles.flexGutterCenter]: !mobile && !tablet
          })}
          id="header-box"
        >
          {!mobile && (
            <img
              src={prevIcon}
              onClick={() =>
                this.state.canScrollLeft && this.horizontalScroll("left")
              }
              className={cs(styles.prevIcon, {
                [globalStyles.cursorNotAllowed]: !this.state.canScrollLeft,
                [globalStyles.opacity50]: !this.state.canScrollLeft
              })}
              alt="prevIcon"
            />
          )}

          <div
            className={cs(styles.header, {
              [styles.leftFade]: this.state.canScrollLeft && !mobile && !tablet,
              [styles.rightFade]:
                this.state.canScrollRight && !mobile && !tablet
            })}
            ref={this.containerRef}
          >
            {Object.keys(shopData).map((data, i) => (
              <div
                className={cs(styles.item, {
                  [styles.active]: data === currentCity
                })}
                key={i}
                onClick={() => this.onHeaderItemClick(data)}
                id={data}
                tabIndex={i}
              >
                {data?.replace(/-/g, " ")}
              </div>
            ))}
          </div>
          {!mobile && (
            <img
              src={nextIcon}
              onClick={() =>
                this.state.canScrollRight && this.horizontalScroll("right")
              }
              className={cs(styles.nextIcon, {
                [globalStyles.cursorNotAllowed]: !this.state.canScrollRight,
                [globalStyles.opacity50]: !this.state.canScrollRight
              })}
              alt="nextIcon"
            />
          )}
        </div>
        <div className={styles.pageBody}>
          {shopData[currentCity]?.map((data: any, i: number) => {
            const len = shopData[currentCity]?.length;
            const showAnarBorder = len > 1 && i != len - 1;

            // get accordion sections
            const section = [
              {
                header: (
                  <div className={styles.cafeHeader}>
                    <img
                      className={cs(styles.icon, styles.store)}
                      src={cafeIcon}
                      alt="Store Icon"
                    />
                    <div className={styles.name}>
                      {data.cafeHeading2}, {data.place}
                    </div>
                    <div className={styles.location}>{data.city}</div>
                  </div>
                ),
                body: (
                  <div className={styles.shopBlock}>
                    <div className={styles.info}>
                      <div className={styles.desc}>{data.cafeContent}</div>
                      <div className={styles.openDays}>{data.cafeOpendays}</div>
                      {data.cafeTime && (
                        <div className={styles.time}>{data.cafeTime}</div>
                      )}
                      {data.cafeAddress ? (
                        <div className={styles.addressBlock}>
                          <div className={styles.address}>
                            {data.cafeAddress}
                          </div>
                          <div className={styles.phone}>
                            {data.cafeTel1.map((item: any, i: number) => {
                              return (
                                <p key={`cafeTel1_${i}`}>
                                  <a href={`tel:${item}`}>{item}</a>
                                </p>
                              );
                            })}
                            <h1>
                              {data.cafeEmail?.map((item: any, i: number) => {
                                return (
                                  <a
                                    key={`cafeEmail1_${i}`}
                                    href={`mailto:${item}`}
                                  >
                                    {item}
                                  </a>
                                );
                              })}
                            </h1>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.phoneBlock}>
                          {data.cafeTel1.map((item: any, i: number) => {
                            return (
                              <p key={`cafeTel1_${i}`}>
                                <a href={`tel:${item}`}>{item}</a>
                              </p>
                            );
                          })}

                          <h1>
                            {data?.cafeEmail?.map((item: string, i: number) => {
                              return (
                                <a
                                  key={`cafeEmail1_${i}`}
                                  href={`mailto:${item}`}
                                >
                                  {item}
                                </a>
                              );
                            })}
                          </h1>
                        </div>
                      )}
                      <div className={styles.getDirections}>
                        <div className={styles.cafeMenuBlock}>
                          {data.cafeQrCodeImage ? (
                            <img
                              src={data.cafeQrCodeImage}
                              alt="qrCode"
                              className={styles.qrImage}
                            />
                          ) : (
                            ""
                          )}

                          <div>
                            <p className={styles.cafeLabel}>
                              {data.cafeQrCodeLabel}
                            </p>
                            <a
                              href={data.cafeQrCodeLink}
                              target="_blank"
                              className={styles.cafeTitle}
                              rel="noopener noreferrer"
                            >
                              {data.cafeQrCodeTitle}
                            </a>
                          </div>
                        </div>
                        <a
                          href={data.cafeDirection}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cs(styles.cafeDirection, {
                            [styles.cafeDirectionReverse]:
                              !data.cafeQrCodeImage &&
                              !data.cafeQrCodeTitle &&
                              !data.cafeQrCodeLabel
                          })}
                        >
                          DIRECTIONS
                        </a>
                      </div>
                    </div>
                    <div
                      className={cs(styles.slider, "shopLocatorSlider")}
                      id={`cafe_${i}`}
                    >
                      <Slider {...settings}>
                        {data?.bannerCafe?.length &&
                          data?.bannerCafe
                            ?.filter((e: any) => {
                              if (mobile) {
                                return e.imageType == 2 || e.imageType == 3;
                              } else {
                                return e.imageType == 1 || e.imageType == 3;
                              }
                            })
                            .map((item: any) => {
                              return (
                                <div
                                  className={styles.imgContainer}
                                  key={`cafe_${i}`}
                                >
                                  <div>
                                    <img
                                      key={`cafe_${i}`}
                                      src={item.image}
                                      alt="cafe"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                      </Slider>
                    </div>
                  </div>
                ),
                id: "cafe",
                alwaysOpen: false
              }
            ];
            return (
              <div
                className={cs(styles.locationsContainer, {
                  [styles.border]: showAnarBorder
                })}
                key={`${data.place}_${i}`}
              >
                {showAnarBorder && (
                  <img
                    className={cs(styles.anar)}
                    src={anarIcon}
                    alt="border"
                  />
                )}
                {/* Shop Block */}
                <div
                  className={cs(styles.shopBlock, {
                    [styles.border]: data.cafeHeading2
                  })}
                >
                  <div className={styles.info}>
                    <img
                      className={cs(styles.icon, styles.store)}
                      src={storeIcon}
                      alt="Store Icon"
                    />
                    <div className={styles.name}>{data.place}</div>
                    <div className={styles.location}>{data.city}</div>
                    <div className={styles.desc}>{data.shopContent}</div>
                    <div className={styles.openDays}>{data.opendays}</div>
                    <div className={styles.time}>{data.time}</div>
                    <div className={styles.addressBlock}>
                      <div className={styles.address}>{data.address}</div>
                      <div className={styles.phone}>
                        {data.tel1.map((item: any, i: number) => {
                          return (
                            <p key={`tel1_${i}`}>
                              <a href={`tel:${item}`}>{item}</a>
                            </p>
                          );
                        })}
                        <h1>
                          {data.storeEmail?.map((item: any, i: number) => {
                            return (
                              <a key={i} href={`mailto:${item}`}>
                                {item}
                              </a>
                            );
                          })}
                        </h1>
                      </div>
                    </div>
                    {data.shopper_details.length > 0 && (
                      <div className={styles.shopperTitle}>
                        Personal Shopper
                      </div>
                    )}
                    {data.shopper_details.length > 0 && (
                      <div className={styles.shopperBlock}>
                        <div className={styles.shopperName}>
                          {data.shopper_details.map((item: any, i: number) => {
                            return (
                              <p key={`shopper_${i}`}>
                                {item.name}
                                {item.deppartment
                                  ? `(${item.deppartment})`
                                  : null}
                              </p>
                            );
                          })}
                        </div>
                        <div className={styles.phone}>
                          {data.shopper_details.map((item: any, i: number) => {
                            return (
                              <p key={`shopper_phone${i}`}>
                                <a href={`tel:${item.phone}`}>{item.phone}</a>
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div className={styles.getDirections}>
                      <a
                        href={data.direction}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.storeDirection}
                      >
                        DIRECTIONS
                      </a>
                    </div>
                  </div>
                  <div
                    className={cs(styles.slider, "shopLocatorSlider")}
                    id={`shop${i}`}
                  >
                    <Slider {...settings}>
                      {data?.bannerShop
                        ?.filter((e: any) => {
                          if (mobile) {
                            return e.imageType == 2 || e.imageType == 3;
                          } else {
                            return e.imageType == 1 || e.imageType == 3;
                          }
                        })
                        .map((item: any) => {
                          return (
                            <div
                              className={styles.imgContainer}
                              key={`shope_image${i}`}
                            >
                              <div>
                                <img src={item.image} alt="shope image" />
                              </div>
                            </div>
                          );
                        })}
                    </Slider>
                  </div>
                </div>
                {/* Cafe Block */}
                {data.cafeHeading2 && (
                  <Accordion
                    sections={section}
                    className={styles.cafeAccordion}
                    sectionClassName={styles.accordionSection}
                    mainBodyClassName={styles.accordionBody}
                    mainBodyOpenClassName={styles.accordionBodyOpen}
                    closedIconClassName={cs(styles.arrow, styles.close)}
                    openIconClassName={cs(styles.arrow, styles.open)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const ShopLocatorRoute = withRouter(ShopLocator);

export default connect(mapStateToProps, mapActionsToProps)(ShopLocatorRoute);
