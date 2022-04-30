import React from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { State } from "./typings";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
import { Dispatch } from "redux";
import BasketService from "services/basket";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";
import LazyImage from "components/LazyImage";
import CartSlider from "components/CartSlider";
// import * as util from "../../utils/validate";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    removeOutOfStockItems: async () => {
      const res = await BasketService.removeOutOfStockItems(dispatch);
      return res;
    }
  };
};
const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale,
    customerGroup: state.user.customerGroup,
    isLoggedIn: state.user.isLoggedIn,
    filler: state.filler
  };
};
type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;
class CushionBag extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stockError: "",
      shipping: false,
      value: 1,
      freeShipping: false, // for all_free_shipping_india
      isSuspended: true, // for is_covid19
      goToIndex: {
        index: -1,
        value: ""
      }
    };
  }

  componentDidMount = () => {
    document.body.classList.add(globalStyles.noScroll);
  };

  componentWillUnmount = () => {
    document.body.classList.remove(globalStyles.noScroll);
  };

  getsection() {
    const images: any[] = this.getProductImagesData();
    let mobileSlides: any[] = [];
    if (images.length > 0) {
      mobileSlides = images?.map((url, i: number) => {
        return (
          <div key={"filler" + i} className={globalStyles.relative}>
            <LazyImage
              aspectRatio="62:93"
              src={url.replace("/Micro/", "/Medium/")}
              className={globalStyles.imgResponsive}
            />
          </div>
        );
      });
    }

    return <CartSlider val={this.state.goToIndex}>{mobileSlides}</CartSlider>;
  }

  getProductImagesData = () => {
    const { data } = this.props.filler;
    let sliderImages;
    if (data) {
      sliderImages = data.plpSliderImages;
    }
    return sliderImages ? sliderImages : [];
  };

  getFooter() {
    if (this.props.filler.show) {
      return (
        <div className={styles.bagFooter}>
          <div
            className={cs(
              globalStyles.flex,
              globalStyles.gutterBetween,
              styles.containerCost
            )}
          ></div>

          <div className={cs(globalStyles.flex, styles.bagFlex)}>
            <div className={cs(styles.iconCart, globalStyles.pointer)}></div>
            <div>
              <button
                className={cs(globalStyles.ceriseBtn, globalStyles.disabledBtn)}
              >
                Add To Bag
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  resetInfoPopupCookie() {
    const cookieString =
      "checkoutinfopopup3=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = cookieString;
  }

  render() {
    const {
      filler: { show }
    } = this.props;
    return (
      <div>
        <div
          className={cs(styles.bagBackdrop, show ? styles.active : "")}
          // onClick={(): void => {

          // }}
        ></div>
        <div
          className={cs(
            styles.bag,
            { [styles.active]: show },
            { [styles.smoothOut]: !show }
          )}
          id="cartslider"
        >
          <div
            className={cs(
              styles.bagHeader,
              globalStyles.flex,
              globalStyles.gutterBetween
            )}
          >
            <div className={styles.heading}></div>
            <div className={styles.heading}>PURCHASE INSERT</div>
            <div
              className={globalStyles.pointer}
              // onClick={() => {}}
            >
              <i
                className={cs(
                  iconStyles.icon,
                  iconStyles.iconCrossNarrowBig,
                  styles.crossfontSize
                )}
              ></i>
            </div>
          </div>
          <div className={styles.bagContents}>{this.getsection()}</div>
          {this.getFooter()}
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CushionBag);
