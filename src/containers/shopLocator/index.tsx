import React, { Fragment } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import initActionSearch from "./initAction";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect, DispatchProp } from "react-redux";
// import iconStyles from "../../styles/iconFonts.scss";
import styles from "./styles.scss";
// import globalStyles from "styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import SelectableDropdownMenu from "components/dropdown/selectableDropdownMenu";
import { ShopProps } from "./typings";
import ShopDropdownMenu from "components/MobileDropdown/shopLocatorDropdown";
import ShopPage from "./shopPage";
import ShopDetail from "./shopDetails";

const mapStateToProps = (state: AppState) => {
  return {
    currency: state.currency,
    device: state.device,
    shopData: state.shop.shopData
  };
};
type Props = ShopProps & ReturnType<typeof mapStateToProps> & DispatchProp;

class ShopLocator extends React.Component<
  Props,
  {
    currentSection: string;
    showmobileSort: boolean;
    menuList: any;
    city: string;
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentSection: this.props.shopname ? "details" : "shop",
      showmobileSort: false,
      menuList: [],
      city: this.props.city
    };
  }

  setSelectedSection = () => {
    const {
      shopData,
      device: { mobile }
    } = this.props;
    const { city } = this.state;
    switch (this.state.currentSection) {
      case "shop":
        return <ShopPage mobile={mobile} data={shopData[city]} />;
      case "details": {
        const shopname = this.props.shopname?.replace(/_/g, " ");
        const shopdata = shopData[city]?.filter(
          (data: any) => data?.place == shopname
        );
        return <ShopDetail mobile={mobile} data={shopdata} />;
      }
      default:
        return "";
    }
  };

  onchangeFilter = (data: any): void => {
    const {
      device: { mobile }
    } = this.props;
    if (mobile) {
      // this.child.clickCloseFilter();
    } else {
      this.setState({
        city: data
      });
    }
  };

  render() {
    const {
      device: { mobile },
      city,
      shopData
    } = this.props;
    const items: DropdownItem[] = Object.keys(shopData).map(data => {
      return {
        label: data,
        value: data
      };
    });
    return (
      <div className={styles.pageBody}>
        {mobile ? (
          <ShopDropdownMenu
            list={items}
            onChange={this.onchangeFilter}
            showCaret={true}
            open={false}
            value={city}
          />
        ) : (
          <SecondaryHeader>
            <Fragment>
              <div className={cs(bootstrap.colMd3, styles.innerHeader)}>
                <p className={styles.filterText}>Sort</p>
                <SelectableDropdownMenu
                  align="right"
                  className={styles.dropdownRoot}
                  items={items}
                  value={city}
                  onChange={this.onchangeFilter}
                  showCaret={true}
                ></SelectableDropdownMenu>
              </div>
              <div className={cs(bootstrap.colMd7, bootstrap.offsetMd1)}></div>
            </Fragment>
          </SecondaryHeader>
        )}
        <div>{this.setSelectedSection()}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ShopLocator);
export { initActionSearch };
