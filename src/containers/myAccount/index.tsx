import React, { useState, useEffect } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import {
  NavLink,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  useHistory
} from "react-router-dom";
import globalStyles from "../../styles/global.scss";
import styles from "./styles.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import loyaltyStyles from "./components/CeriseClub/styles.scss";
import cs from "classnames";
import iconStyles from "styles/iconFonts.scss";
import MyProfile from "./components/MyProfile";
import PastOrders from "./components/MyOrder";
import ChangePassword from "./components/ChangePassword";
import { useStore, useSelector, useDispatch } from "react-redux";
import CookieService from "services/cookie";
import { AccountMenuItem } from "./typings";
import CheckBalance from "./components/Balance";
import AddressMain from "components/Address/AddressMain";
import { AppState } from "reducers/typings";
import ActivateGiftCard from "./components/ActivateGiftCard";
import TrackOrder from "./components/TrackOrder";
import AccountServices from "services/account";
import CeriseClubMain from "./components/CeriseClub/ceriseClubMain";

type Props = {
  isBridal: boolean;
  mobile: boolean;
  updateCeriseClubAccess: () => void;
};

// type State = {
//     showregistry: boolean;
// }

const MyAccount: React.FC<Props> = props => {
  let bridalId = "";
  const [accountListing, setAccountListing] = useState(false);
  const [slab, setSlab] = useState("");
  const { mobile } = useStore().getState().device;
  const { isLoggedIn, email } = useSelector((state: AppState) => state.user);
  const { path } = useRouteMatch();
  // const [ isCeriseClubMember, setIsCeriseClubMember ] = useState(false);

  const [currentSection, setCurrentSection] = useState("Profile");
  const { pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const getLoyaltyTransactions = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("phoneno", "");
    AccountServices.getLoyaltyTransactions(dispatch, formData)
      .then((data: any) => {
        if (data.is_success) {
          // const isCeriseClubMember = data.message.CUSTOMER_DETAILS[0].Slab == "CERISE" || data.message.CUSTOMER_DETAILS[0].Slab == "CERISE SITARA" || data.message.CUSTOMER_DETAILS[0].Slab == "FF10" || data.message.CUSTOMER_DETAILS[0].Slab == "FF15"
          const responseSlab = data.message.CUSTOMER_DETAILS[0].Slab;
          setSlab(responseSlab);
          // setIsCeriseClubMember(isCeriseClubMember);
          // const slab = responseSlab.toLowerCase() == "cerise" || responseSlab.toLowerCase() == "cerise sitara";
          // this.props.updateCeriseClubAccess(slab);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    bridalId = CookieService.getCookie("bridalId");
    const noContentContainerElem = document.getElementById(
      "no-content"
    ) as HTMLDivElement;
    if (
      noContentContainerElem.classList.contains(globalStyles.contentContainer)
    ) {
      noContentContainerElem.classList.remove(globalStyles.contentContainer);
    }
    getLoyaltyTransactions();
    // window.scrollTo(0, 0);
  }, []);

  const accountMenuItems: AccountMenuItem[] = [
    {
      label: "My Profile",
      href: "/account/profile",
      component: MyProfile,
      title: "Profile",
      loggedInOnly: true
    },
    {
      label: "Change Password",
      href: "/account/password",
      component: ChangePassword,
      title: "password",
      loggedInOnly: true
    },
    {
      label: "Addresses",
      href: "/account/address",
      component: AddressMain,
      title: "address",
      currentCallBackComponent: "account",
      loggedInOnly: true
    },
    {
      label: "My Orders",
      href: "/account/my-orders",
      component: PastOrders,
      title: "orders",
      loggedInOnly: true
    },
    {
      label: "Track Order",
      href: "/account/track-order",
      component: TrackOrder,
      title: "track",
      loggedInOnly: false
    }
  ];
  let ceriseClubAccess = false;
  if (slab) {
    ceriseClubAccess =
      slab.toLowerCase() == "cerise" ||
      slab.toLowerCase() == "ff10" ||
      slab.toLowerCase() == "ff15" ||
      slab.toLowerCase() == "cerise sitara";
  }
  ceriseClubAccess &&
    accountMenuItems.push({
      label: "Cerise",
      href: "/account/cerise",
      component: CeriseClubMain,
      title: "Cerise",
      loggedInOnly: true
    });
  accountMenuItems.push(
    {
      label: "Activate Gift Card",
      href: "/account/giftcard-activation",
      component: ActivateGiftCard,
      title: "Activate Gift Card",
      loggedInOnly: false
    },
    {
      label: "Check Balance",
      href: "/account/check-balance",
      component: CheckBalance,
      title: "Check Balance",
      loggedInOnly: false
    }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (
      accountMenuItems.filter(
        item => item.href == pathname && item.loggedInOnly
      ).length > 0 &&
      !isLoggedIn
    ) {
      history.push("/");
    }
  }, [pathname, isLoggedIn]);

  const bgClass = cs(
    globalStyles.colMd10,
    globalStyles.col12,
    styles.bgProfile,

    slab && pathname == "/account/cerise"
      ? slab.toLowerCase() == "cerise" || slab.toLowerCase() == "ff10"
        ? cs(styles.ceriseClub, loyaltyStyles.ceriseLoyalty)
        : cs(styles.ceriseSitaraClub, loyaltyStyles.ceriseLoyalty)
      : ""
  );
  return (
    <div className={globalStyles.containerStart}>
      <SecondaryHeader>
        <div className={cs(bootstrapStyles.colMd11, bootstrapStyles.offsetMd1)}>
          <span className={cs(styles.heading, globalStyles.verticalMiddle)}>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconProfile,
                styles.icon
              )}
            ></i>{" "}
            My Account
          </span>
        </div>
      </SecondaryHeader>
      <div className={bootstrapStyles.row}>
        {mobile ? (
          <div className={cs(styles.cSort, styles.subheaderAccount)}>
            <div className={cs(bootstrapStyles.col12, styles.productNumber)}>
              <div className={styles.cSortHeader}>
                <div
                  className={
                    accountListing
                      ? globalStyles.hidden
                      : styles.collectionHeader
                  }
                  onClick={() => setAccountListing(true)}
                >
                  <span>
                    {path == "/account/bridal"
                      ? bridalId == "0"
                        ? "Create a Registry"
                        : "Manage Registry"
                      : path == "/account/giftcard-activation"
                      ? "Activate Gift Card"
                      : currentSection}
                  </span>
                </div>
              </div>
              <div
                className={
                  accountListing
                    ? cs(bootstrapStyles.col12, styles.productNumber)
                    : globalStyles.hidden
                }
              >
                <div className={styles.mobileFilterHeader}>
                  <div className={styles.filterCross}>
                    <span>
                      {path == "/account/bridal"
                        ? bridalId == "0"
                          ? "Create a Registry"
                          : "Manage Registry"
                        : path == "/account/giftcard-activation"
                        ? "Activate Gift Card"
                        : currentSection}
                    </span>
                    <span onClick={() => setAccountListing(false)}>
                      <i
                        className={cs(
                          iconStyles.icon,
                          iconStyles.iconCrossNarrowBig,
                          styles.icon
                        )}
                      ></i>
                    </span>
                  </div>
                </div>
                <div
                  className={cs(globalStyles.row, globalStyles.minimumWidth)}
                >
                  <div
                    className={cs(
                      bootstrapStyles.col12,
                      bootstrapStyles.col12,
                      styles.mobileFilterMenu
                    )}
                  >
                    <ul className={styles.sort}>
                      {accountMenuItems
                        .filter(item =>
                          isLoggedIn ? true : !item.loggedInOnly
                        )
                        .map(item => {
                          return (
                            <li key={item.label}>
                              <NavLink
                                onClick={() => setAccountListing(false)}
                                key={item.label}
                                to={item.href}
                                activeClassName={globalStyles.cerise}
                              >
                                {item.label}
                              </NavLink>
                            </li>
                          );
                        })}

                      {/* <li>
                        {ceriseClubAccess && 
                            <li>
                                <Link> className={currentSection == "cerise" ? "cerise" : ""} 
                                onClick={this.setAccountPage} name="cerise">
                                    Cerise
                                </Link>
                            </li>}
                        <li className={this.state.showregistry?"bridalleftsec":"bridalleftsec bridalplus"}>
                            <Link> onClick={this.showRegistry.bind(this)}
                                className={this.state.showregistry && currentSection == "bridal"?"cerise":""}
                                name="bridal">
                                Good Earth Registry </Link>
                            {this.state.showregistry ? <ul>{this.state.id}
                                <li>
                                    <Link> onClick={this.setAccountPage} name="bridal"
                                        className={this.state.showregistry && currentSection == "bridal"?"cerise":""}>{bridalId == 0 ? 'Create Registry' : 'Manage Registry'}</Link>
                                </li>
                                <li>
                                    <Link> href="/customer-assistance/terms-conditions?id=bridalregistryterms" target="_blank">Good Earth
                                        Registry Policy</Link>
                                </li>
                            </ul> : ""}
                        </li>
                        */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={cs(styles.fixLeftPane, bootstrapStyles.colMd2)}>
            <div className={globalStyles.voffset5}>
              <ul>
                {accountMenuItems
                  .filter(item => (isLoggedIn ? true : !item.loggedInOnly))
                  .map(item => {
                    return (
                      <li key={item.label}>
                        {" "}
                        <NavLink
                          key={item.label}
                          to={item.href}
                          activeClassName={globalStyles.cerise}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    );
                  })}
                {/* <li>
                    {ceriseClubAccess && <li>
                        <Link> className={currentSection == "cerise" ? "cerise" : ""} 
                        onClick={this.setAccountPage} name="cerise">
                            Cerise
                        </Link>
                    </li>}
                    <li className={this.state.showregistry?"bridalleftsec":"bridalleftsec bridalplus"}>
                        <Link> onClick={this.showRegistry.bind(this)}
                            className={this.state.showregistry && currentSection == "bridal"?"cerise":""}
                            name="bridal">
                            Good Earth Registry </Link>
                        {this.state.showregistry ? <ul>{this.state.id}
                            <li>
                                <Link> onClick={this.setAccountPage} name="bridal"
                                    className={this.state.showregistry && currentSection == "bridal" ? "cerise":""}>{bridalId == 0 ? 'Create a Registry' : 'Manage Registry'}</Link>
                            </li>
                            <li>
                                <Link> href="/customer-assistance/terms-conditions?id=bridalregistryterms" target="_blank">Good Earth
                                    Registry Policy</Link>
                            </li>
                        </ul> : ""}
                    </li>
                */}
              </ul>
            </div>
          </div>
        )}
        {
          <Switch>
            {accountMenuItems.map(
              ({ component, href, label, title, currentCallBackComponent }) => {
                const Component = component;
                if (title.toLowerCase() == "cerise") {
                  return (
                    <Route key={label} exact path={href}>
                      <div className={bgClass}>
                        <div className={bootstrapStyles.row}>
                          <Component
                            setCurrentSection={() => setCurrentSection(title)}
                            currentCallBackComponent={currentCallBackComponent}
                          />
                        </div>
                      </div>
                    </Route>
                  );
                } else {
                  return (
                    <Route key={label} exact path={href}>
                      <div className={bgClass}>
                        <div className={bootstrapStyles.row}>
                          <div
                            className={cs(
                              bootstrapStyles.colMd6,
                              bootstrapStyles.offsetMd3,
                              bootstrapStyles.col12,
                              globalStyles.textCenter,
                              { [styles.accountFormBg]: !mobile },
                              { [styles.accountFormBgMobile]: mobile }
                            )}
                          >
                            <Component
                              setCurrentSection={() => setCurrentSection(title)}
                              currentCallBackComponent={
                                currentCallBackComponent
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </Route>
                  );
                }
              }
            )}
          </Switch>
        }
      </div>
    </div>
  );
};

export default MyAccount;
