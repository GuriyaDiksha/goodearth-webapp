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
import Slider from "react-slick";
import "./slick.css";

// import rawData from "./data.json"

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  prevArrow: <div>prev</div>,
  nextArrow: <div>next</div>
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
    // console.log(rawData)
    // this.setState({
    //   shopData: rawData,
    //   currentCity: Object.keys(rawData)[0],
    //   currentCityData: rawData[Object.keys(rawData)[0]]
    // })
  }

  render() {
    const { shopData, currentCity } = this.state;
    console.log(shopData[currentCity]);
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
        <div className={styles.headerBox}>
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
                    <div className={styles.name}>Khan Market</div>
                    <div className={styles.location}>Delhi</div>
                    <div className={styles.desc}>
                      An urban haven of contemporary Indian design and lifestyle
                      luxury in the midst of Delhi’s busiest marketplace.
                      Meandering paths of discovery through a dynamically edited
                      Good Earth Home universe and 2600 sq.ft. of Sustain
                      apparel.
                    </div>
                    <div className={styles.openDays}>OPEN 7 DAYS A WEEK</div>
                    <div className={styles.time}> 11:00 am - 8:00 pm IST</div>
                    <div className={styles.addressBlock}>
                      <div className={styles.address}>
                        Shop No.9 A.B.C. Ground 1st & 2nd Floor, Khan Market New
                        Delhi - 110003
                      </div>
                      <div className={styles.phone}>
                        <p>+91-11-24647179</p>
                        <p>+91-11-24647179</p>
                        <p>+91-11-24647179</p>
                      </div>
                    </div>
                    <div className={styles.shopperBlock}>
                      <div className={styles.shopperName}>
                        <div className={styles.title}>Personal Shopper</div>
                        <p>Shikha(Home)</p>
                        <p>Sadhna(Apparel)</p>
                      </div>
                      <div className={styles.phone}>
                        <p>+91-95825-59308</p>
                        <p>+91-72919-11112</p>
                      </div>
                    </div>
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
                  <div className={styles.slider}>
                    {/* <div className={styles.inner}>
                        <img src={data.bannerShop[0].image} />
                      </div> */}
                    <Slider {...settings}>
                      {data.bannerShop.map((item: any) => {
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
                {/* Cafe Block */}
                <div className={styles.shopBlock}>
                  <div className={styles.info}>
                    <img
                      className={cs(styles.icon, styles.store)}
                      src={cafeIcon}
                    />
                    <div className={styles.name}>Latitude 28, Khan Market</div>
                    <div className={styles.location}>Delhi</div>
                    <div className={styles.desc}>
                      ALatitude 28 Café and Wine Bar is it perfect place for a
                      power lunch or an afternoon shopping date for a spot of
                      tea with friends. Celebrity chef Ritu Dalmia’s wine paired
                      menu is as delightful as it is dynamic. Café is open till
                      11pm daily.
                    </div>
                    <div className={styles.openDays}>OPEN 7 DAYS A WEEK</div>
                    <div className={styles.time}> 11:00 am - 8:00 pm IST</div>
                    <div className={styles.addressBlock}>
                      <div className={styles.address}>
                        Shop No.9 A.B.C. Ground 1st & 2nd Floor, Khan Market New
                        Delhi - 110003
                      </div>
                      <div className={styles.phone}>
                        <p>+91-11-24647179</p>
                        <p>+91-11-24647179</p>
                        <p>+91-11-24647179</p>
                      </div>
                    </div>
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
                  <div className={styles.slider}>
                    {/* <Slider {...settings}>
                        {
                          data.bannerCafe.map((item: any) => {
                            return(
                              <div className={styles.imageContainer} key={`cafe_${i}`}>
                                <img src={item.image}/>
                              </div>
                            )
                          })
                        }
                      </Slider> */}
                  </div>
                </div>
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
