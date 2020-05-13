import React from "react";
import { currencyCode } from "../../typings/currency";
import { SideMenuProps } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import SelectableDropdownMenu from "../dropdown/selectableDropdownMenu";
import { DropdownItem } from "../dropdown/baseDropdownMenu/typings";
import storyStyles from "../../styles/stories.scss";
import DropdownMenu from "../dropdown/dropdownMenu";
import Bag from "../Bag/index";
import LoginService from "services/login";
import { Basket } from "typings/basket";
import { Dispatch } from "redux";
import { connect } from "react-redux";

interface State {
  showc: boolean;
  showp: boolean;
  showBag: boolean;
  cartCount: number;
  showSearch: boolean;
  openProfile: boolean;
}

const mapStateToProps = () => {
  return {};
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    goLogin: (event: React.MouseEvent) => {
      LoginService.showLogin(dispatch);
      event.preventDefault();
    },
    handleLogOut: () => {
      LoginService.logout(dispatch);
    }
  };
};

type Props = SideMenuProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class SideMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showc: false,
      showp: false,
      showBag: false,
      cartCount: 0,
      openProfile: false,
      showSearch: false
    };
  }

  render() {
    const items: DropdownItem[] = [
      {
        label: "INR" + " " + String.fromCharCode(currencyCode["INR"]),
        value: "INR"
      },
      {
        label: "USD" + " " + String.fromCharCode(currencyCode["USD"]),
        value: "USD"
      },
      {
        label: "GBP" + " " + String.fromCharCode(currencyCode["GBP"]),
        value: "GBP"
      }
    ];

    const profileItems: DropdownItem[] = [
      {
        label: "Track Order",
        href: "/about",
        type: "link"
      },
      {
        label: "Good Earth Registry",
        href: "/about",
        type: "link",
        value: "Good Earth Registry"
      },
      {
        label: "Activate Gift Card",
        href: "/about",
        type: "link",
        value: "Activate Gift Card"
      },
      {
        label: "Cerise Program",
        href: "/about",
        type: "link",
        value: "Cerise Program"
      },
      {
        label: "Check Balance",
        href: "/about",
        type: "link",
        value: "Check Balance"
      },
      {
        label: this.props.isLoggedIn ? "Sign Out" : "Sign In",
        href: "",
        onClick: this.props.isLoggedIn
          ? this.props.handleLogOut
          : this.props.goLogin,
        type: "link",
        value: this.props.isLoggedIn ? "Sign Out" : "Sign In"
      }
    ];
    const selectClass = this.state.showp
      ? cs(
          iconStyles.icon,
          iconStyles.iconProfile,
          styles.iconStyle,
          styles.cerise
        )
      : cs(iconStyles.icon, iconStyles.iconProfile, styles.iconStyle);

    const bagitem: Basket = this.props.sidebagData;
    const wishlistCount = this.props.wishlistData.length;
    let bagCount = 0;
    const item = bagitem.lineItems;
    for (let i = 0; i < item.length; i++) {
      bagCount = bagCount + item[i].quantity;
    }
    return (
      <ul className={styles.sideMenuContainer}>
        {this.props.mobile ? (
          ""
        ) : (
          <li
            className={cs(
              styles.sideMenuItem,
              styles.curr,
              styles.currencyMenu
            )}
          >
            <SelectableDropdownMenu
              align="right"
              className={storyStyles.greyBG}
              items={items}
              value="INR"
              showCaret={true}
            ></SelectableDropdownMenu>
          </li>
        )}
        {this.props.mobile ? (
          ""
        ) : (
          <li
            className={
              this.state.showp
                ? cs(
                    styles.sideMenuItem,
                    styles.curr,
                    styles.hiddenXs,
                    styles.hiddenSm
                  )
                : cs(styles.sideMenuItem, styles.hiddenXs, styles.hiddenSm)
            }
          >
            <div className={styles.innerProfileContainer}>
              <DropdownMenu
                display={<i className={selectClass}></i>}
                className={storyStyles.greyBG}
                align="right"
                items={profileItems}
              ></DropdownMenu>
            </div>
          </li>
        )}
        {this.props.mobile ? (
          ""
        ) : (
          <li
            className={cs(
              styles.sideMenuItem,
              styles.hiddenXs,
              styles.hiddenSm
            )}
          >
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconWishlist,
                styles.iconStyle
              )}
            ></i>
            <span className={styles.badge}>
              {wishlistCount > 0 ? wishlistCount : ""}
            </span>
          </li>
        )}
        <li className={cs(styles.sideMenuItem)}>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCart,
              styles.iconStyle
            )}
            onClick={(): void => {
              this.setState({
                showBag: true
              });
            }}
          ></i>
          <span className={styles.badge}>{bagCount}</span>
          <Bag
            cart={this.props.sidebagData}
            currency={this.props.currency}
            active={this.state.showBag}
            toggleBag={(): void => {
              this.setState(prevState => ({
                showBag: !prevState.showBag
              }));
            }}
          />
        </li>
        {this.props.mobile ? (
          <li className={cs(styles.sideMenuItem)}>
            <i
              className={
                this.state.showSearch
                  ? cs(
                      iconStyles.icon,
                      iconStyles.iconNarrowBig,
                      styles.iconStyle
                    )
                  : cs(iconStyles.icon, iconStyles.iconSearch, styles.iconStyle)
              }
            ></i>
          </li>
        ) : (
          <li className={cs(styles.sideMenuItem)}>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconSearch,
                styles.iconStyle
              )}
            ></i>
          </li>
        )}
      </ul>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
