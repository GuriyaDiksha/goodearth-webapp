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
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentSection: this.props.shopname ? "details" : "shop",
      showmobileSort: false
    };
  }

  setSelectedSection = () => {
    switch (this.state.currentSection) {
      case "shop":
        return (
          <ShopPage
            mobile={this.props.device.mobile}
            data={this.props.shopData}
          />
        );
      case "details":
        return (
          <ShopDetail
            mobile={this.props.device.mobile}
            data={this.props.shopData}
          />
        );
      default:
        return "";
    }
  };

  onChangeFilterState = (state: boolean, cross?: boolean) => {
    if (cross) {
      this.setState({
        showmobileSort: true
      });
    } else {
      this.setState({
        showmobileSort: false
      });
    }
  };

  onchangeFilter = (data: any): void => {
    // this.child.changeValue(null, data);
    const {
      device: { mobile }
    } = this.props;
    if (mobile) {
      // this.child.clickCloseFilter();
    }
  };

  render() {
    const {
      device: { mobile }
    } = this.props;
    const items: DropdownItem[] = [
      {
        label: "Delhi",
        value: "Delhi"
      },
      {
        label: "Mumbai",
        value: "Mumbai"
      }
    ];

    return (
      <div className={styles.pageBody}>
        {mobile ? (
          <ShopDropdownMenu
            list={items}
            onChange={this.onchangeFilter}
            showCaret={true}
            open={false}
            value="delhi"
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
                  value="Delhi"
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
