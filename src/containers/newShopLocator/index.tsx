import React, { Component } from "react";
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

import Accordion from "components/Accordion";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true
};

const mapStateToProps = (state: AppState) => {
  return {
    mobile: state.device.mobile,
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
};

class ShopLocator extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      shopData: {},
      currentCity: "",
      currentCityData: {}
    };
  }

  onHeaderItemClick = (data: any) => {
    this.setState({
      currentCity: data
    });
    window.history.pushState("", "", data);
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
              this.setState({ currentCity: this.props.city });
            } else {
              // change this
              this.setState({
                currentCity: Object.keys(this.state.shopData)[0]
              });
            }
          }
        );
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  render() {
    const { shopData, currentCity } = this.state;
    const { saleTimer } = this.props;

    return (
      <div
        className={cs(styles.pageContainer, {
          [styles.saleTimerMargin]: this.props.saleTimer
        })}
      >
        <div className={styles.banner}>
          <div className={styles.bannerText}>Find us near you</div>
        </div>
        <div className={styles.pageDescription}>
          <div className={styles.text}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren,.
          </div>
        </div>
        <div
          className={cs(styles.headerBox, { [styles.withTimer]: saleTimer })}
        >
          <div className={styles.header}>
            {Object.keys(shopData).map((data: any, i: number) => {
              return (
                <div
                  className={cs(styles.item, {
                    [styles.active]: data == currentCity
                  })}
                  key={i}
                  onClick={() => this.onHeaderItemClick(data)}
                >
                  {data}
                </div>
              );
            })}
          </div>
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
                              return <p key={`cafeTel1_${i}`}>{item}</p>;
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className={styles.phoneBlock}>
                          {data.cafeTel1.map((item: any, i: number) => {
                            return <p key={`cafeTel1_${i}`}>{item}</p>;
                          })}
                        </div>
                      )}
                      <div className={styles.getDirections}>
                        <a
                          href={data.cafeDirection}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GET DIRECTIONS
                        </a>
                      </div>
                    </div>
                    <div className={cs(styles.slider, "shopLocatorSlider")}>
                      <Slider {...settings}>
                        {data.bannerCafe.map((item: any) => {
                          return (
                            <div
                              className={styles.imgContainer}
                              key={`cafe_${i}`}
                            >
                              <div>
                                <img key={`cafe_${i}`} src={item.image} />
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
                  <img className={cs(styles.anar)} src={anarIcon} />
                )}
                {/* Shop Block */}
                <div
                  className={cs(styles.shopBlock, {
                    [styles.border]: data.cafeDirection
                  })}
                >
                  <div className={styles.info}>
                    <img
                      className={cs(styles.icon, styles.store)}
                      src={storeIcon}
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
                          return <p key={`tel1_${i}`}>{item}</p>;
                        })}
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
                                {item.name}({item.department})
                              </p>
                            );
                          })}
                        </div>
                        <div className={styles.phone}>
                          {data.shopper_details.map((item: any, i: number) => {
                            return (
                              <p key={`shopper_phone${i}`}>{item.phone}</p>
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
                      >
                        GET DIRECTIONS
                      </a>
                    </div>
                  </div>
                  <div className={cs(styles.slider, "shopLocatorSlider")}>
                    <Slider {...settings}>
                      {data.bannerShop.map((item: any) => {
                        return (
                          <div
                            className={styles.imgContainer}
                            key={`shope_image${i}`}
                          >
                            <div>
                              <img src={item.image} />
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
