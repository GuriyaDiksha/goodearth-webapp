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
import { CartItems } from "components/Bag/typings";
import LoginService from "services/login";

interface State {
  showc: boolean;
  showp: boolean;
  showBag: boolean;
  cartCount: number;
  showSearch: boolean;
  openProfile: boolean;
}

export default class SideMenu extends React.Component<SideMenuProps, State> {
  constructor(props: SideMenuProps) {
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

  handleLogout(): void {
    //   Axios.post(Config.hostname + 'rest-auth/logout/')
    //     .then((response) => {
    //         if (response.status === 200) {
    //             document.cookie = "key=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    //             document.cookie = "bridal_id=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    //             document.cookie = "bridal_currency=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    //             document.cookie = "giftcard_image=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    //             document.cookie = "giftcard_country=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    //             this.props.loggedIn(false);
    //             document.location.reload();
    //         }
    //     }).catch(function (error) {
    //     console.log(error);
    // })
    alert("logged out");
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
          ? LoginService.showLogin
          : LoginService.showLogin,
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

    const bagitem: CartItems = this.props.sidebagData;
    const bagCount: number = bagitem.products.length;
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
