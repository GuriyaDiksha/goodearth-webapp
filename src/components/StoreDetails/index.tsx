import React, { Fragment } from "react";
import styles from "./styles.scss";
import cs from "classnames";
import { CartProps, State } from "./typings";
import iconStyles from "../../styles/iconFonts.scss";
import globalStyles from "../../styles/global.scss";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppState } from "reducers/typings";
import { updateStoreState } from "actions/header";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import ReactHtmlParser from "react-html-parser";

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    closestock: async () => {
      dispatch(updateStoreState(false));
    }
  };
};
const mapStateToProps = (state: AppState) => {
  return {
    storeData: state.header.storeData
  };
};
type Props = CartProps &
  ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;
class StoreDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      stockError: "",
      shipping: false,
      value: 1,
      freeShipping: false, // for all_free_shipping_india
      isSuspended: true, // for is_covid19
      searchText: ""
    };
  }

  componentDidMount = () => {
    document.body.classList.add(globalStyles.noScroll);
  };
  componentWillUnmount = () => {
    document.body.classList.remove(globalStyles.noScroll);
  };

  hasOutOfStockItems = () => {
    const items = this.props.cart.lineItems;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.product.stockRecords[0].numInStock < 1) {
          return true;
        }
      }
    }
    return false;
  };

  getItems() {
    const {
      storeData: { data }
    } = this.props;

    const filterdata = data.filter(item => {
      return (
        item.city.includes(this.state.searchText) || this.state.searchText == ""
      );
    });
    return (
      <Fragment>
        {filterdata.map((item, index) => {
          return (
            <div
              className={cs(globalStyles.voffset4, styles.blockMargin)}
              key={item.storeName + index}
            >
              <div className={cs(globalStyles.voffset3, styles.city)}>
                <strong>{`${item.storeName}, ${item.city}`}</strong>
              </div>
              <div className={globalStyles.voffset2}>
                <div className={styles.addressLine}>{item.address1}</div>
                <div className={styles.addressLine}>{item.address2}</div>
              </div>
              <div className={cs(globalStyles.voffset2, styles.secondHeading)}>
                <strong>Personal Shopper:</strong>
                <div className={cs(styles.addressLine, globalStyles.voffset1)}>
                  {ReactHtmlParser(item.phoneNumber)}
                </div>
              </div>
              <div className={globalStyles.voffset2}>
                {item.inStock ? (
                  <span className={styles.greenCircle}>In stock</span>
                ) : (
                  <span className={styles.redCircle}>Out of stock!</span>
                )}
              </div>
              <br />
            </div>
          );
        })}
      </Fragment>
    );
  }

  onEnterSearch = (event: any) => {
    this.setState({
      searchText: event.target.value
    });
  };

  render() {
    return (
      <div>
        <div
          className={cs(
            styles.bagBackdrop,
            this.props.active ? styles.active : ""
          )}
          onClick={(): void => {
            this.props.closestock();
          }}
        ></div>
        <div
          className={cs(
            styles.bag,
            { [styles.active]: this.props.active },
            { [styles.smoothOut]: !this.props.active }
          )}
        >
          <div
            className={cs(
              styles.bagHeader,
              globalStyles.flex,
              globalStyles.gutterBetween
            )}
          >
            <div className={styles.heading}></div>
            <div className={styles.heading}>IN SHOP AVAILABILITY</div>

            <div
              className={globalStyles.pointer}
              onClick={this.props.closestock}
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

          <div className={styles.cart}>
            <div className={cs(styles.message, styles.noMargin)}>
              Check the availability of this product at your near shop.
              <div className={cs(bootstrap.colMd11, styles.searchShop)}>
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconSearch,
                    styles.searchbar
                  )}
                  // onClick={() => {}}
                ></i>
                <input
                  type="text"
                  placeholder="Search by City or State"
                  onChange={this.onEnterSearch}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div className={styles.bagContents}>{this.getItems()}</div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(StoreDetails);
