import loadable from "@loadable/component";
import React, { Fragment } from "react";
import { currencyCode } from "../../typings/currency";
import { SideMenuProps } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import SelectableDropdownMenu from "../dropdown/selectableDropdownMenu";
import { DropdownItem } from "../dropdown/baseDropdownMenu/typings";
import storyStyles from "../../styles/stories.scss";
import DropdownMenu from "../dropdown/dropdownMenu";
import { Basket } from "typings/basket";
import { connect } from "react-redux";
import UserContext from "contexts/user";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { AppState } from "reducers/typings";
import mapDispatchToProps from "./mapper/actions";

const Bag = loadable(() => import("../Bag/index"));

interface State {
  showc: boolean;
  showp: boolean;
  showBag: boolean;
  cartCount: number;
  showSearch: boolean;
  openProfile: boolean;
}

const mapStateToProps = (state: AppState) => {
  return {
    cookies: state.cookies
  };
};

type Props = SideMenuProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

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
  static contextType = UserContext;

  changeCurrency = (cur: any) => {
    const { changeCurrency, reloadPage, history, currency } = this.props;
    const data: any = {
      currency: cur
    };
    if (this.props.currency != data) {
      changeCurrency(data).then((response: any) => {
        if (history.location.pathname.indexOf("/catalogue/category/") > -1) {
          const path =
            history.location.pathname +
            history.location.search.replace(currency, response.currency);
          history.replace(path);
        }
        reloadPage(this.props.cookies);
      });
    }
  };
  render() {
    const { isLoggedIn } = this.context;
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

    const profileItems: DropdownItem[] = [];
    isLoggedIn &&
      profileItems.push(
        {
          label: "My Profile",
          href: "/account/profile",
          type: "link"
        },
        {
          label: "My Orders",
          href: "/account/orders",
          type: "link"
        }
      );
    profileItems.push(
      {
        label: "Track Order",
        href: "/account/track-order",
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
        href: "/account/giftcard-activation",
        type: "link",
        value: "Activate Gift Card"
      },
      {
        label: "Cerise Program",
        href: "/account/cerise",
        type: "link",
        value: "Cerise Program"
      },
      {
        label: "Check Balance",
        href: "/account/check-balance",
        type: "link",
        value: "Check Balance"
      },
      {
        label: isLoggedIn ? "Sign Out" : "Sign In",
        onClick: isLoggedIn ? this.props.handleLogOut : this.props.goLogin,
        type: "button",
        value: isLoggedIn ? "Sign Out" : "Sign In"
      }
    );
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
    const { mobile } = this.props;
    return (
      <Fragment>
        <ul className={styles.sideMenuContainer}>
          {mobile ? (
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
                value={this.props.currency}
                showCaret={true}
                onChange={this.changeCurrency}
              ></SelectableDropdownMenu>
            </li>
          )}
          {mobile ? (
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
          {mobile ? (
            ""
          ) : (
            <li
              className={cs(
                styles.sideMenuItem,
                styles.hiddenXs,
                styles.hiddenSm
              )}
            >
              <div className={cs(styles.iconStyle, styles.innerWishContainer)}>
                {isLoggedIn ? (
                  <Link to="/wishlist">
                    <i
                      className={cs(
                        iconStyles.icon,
                        iconStyles.iconWishlist,
                        styles.iconStyle
                      )}
                    ></i>
                  </Link>
                ) : (
                  <div onClick={this.props.goLogin}>
                    <i
                      className={cs(
                        iconStyles.icon,
                        iconStyles.iconWishlist,
                        styles.iconStyle
                      )}
                    ></i>
                  </div>
                )}
              </div>
              <span className={styles.badge}>
                {wishlistCount > 0 ? wishlistCount : ""}
              </span>
            </li>
          )}
          <li
            className={cs(styles.sideMenuItem, {
              [styles.sideMenuItemMobile]: mobile
            })}
          >
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
            {this.state.showBag && (
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
            )}
          </li>
        </ul>
        <ul>
          {mobile ? (
            <li className={cs(styles.firstMenu)}>
              <p className={styles.searchText}>
                <i
                  className={
                    this.state.showSearch
                      ? cs(
                          iconStyles.icon,
                          iconStyles.iconNarrowBig,
                          styles.iconStyle
                        )
                      : cs(
                          iconStyles.icon,
                          iconStyles.iconSearch,
                          styles.iconStyle
                        )
                  }
                ></i>
                <span>Search</span>
              </p>
            </li>
          ) : (
            <li className={cs(styles.firstMenu)}>
              <p className={styles.searchText}>
                <i
                  className={cs(
                    iconStyles.icon,
                    iconStyles.iconSearch,
                    styles.iconStyle
                  )}
                ></i>
                <span>Search</span>
              </p>
            </li>
          )}
        </ul>
      </Fragment>
    );
  }
}
const SideMenuWithRouter = withRouter(SideMenu);
export default connect(mapStateToProps, mapDispatchToProps)(SideMenuWithRouter);
