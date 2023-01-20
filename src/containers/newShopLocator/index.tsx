import React, { Component } from "react";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
import mapActionsToProps from "./actions";
import { withRouter, RouteComponentProps } from "react-router-dom";
import cs from "classnames";
import styles from "./styles.scss";

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
};

class ShopLocator extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      shopData: {},
      currentCity: ""
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
  }

  render() {
    const { shopData, currentCity } = this.state;
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
        <div className={styles.pageBody}>
          {
            // shopData[currentCity].map((data: any, i: number) => {
            //   return (
            //     <div className={styles.locationsContainer} key={`${data.place}_${i}`}>
            //       {/* Shop Block */}
            //       asdf
            //       {/* Cafe Block */}
            //     </div>
            //   )
            // })
          }
        </div>
      </div>
    );
  }
}

const ShopLocatorRoute = withRouter(ShopLocator);

export default connect(mapStateToProps, mapActionsToProps)(ShopLocatorRoute);
