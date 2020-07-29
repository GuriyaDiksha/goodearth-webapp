import React, { useState, useEffect } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import { NavLink, Switch, Route, useRouteMatch } from "react-router-dom";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import cs from "classnames";
import iconStyles from "styles/iconFonts.scss";
import MyProfile from "./components/MyProfile";
import PastOrders from "./components/MyOrder";
import ChangePassword from "./components/ChangePassword";
import { useStore, useSelector } from "react-redux";
import CookieService from "services/cookie";
import { AccountMenuItem } from "./typings";
import CheckBalance from "./components/Balance";
import AddressMain from "components/Address/AddressMain";
import { AppState } from "reducers/typings";
import ActivateGiftCard from "./components/ActivateGiftCard";

type Props = {
  isBridal: boolean;
  mobile: boolean;
  updateCeriseClubAccess: () => void;
};

// type State = {
//     isCeriseClubMember: boolean;
//     showregistry: boolean;
// }

const MyAccount: React.FC<Props> = props => {
  let bridalId = "";
  const [accountListing, setAccountListing] = useState(false);
  const [slab] = useState("");
  const { mobile } = useStore().getState().device;
  const { isLoggedIn } = useSelector((state: AppState) => state.user);
  const { path } = useRouteMatch();

  const [currentSection, setCurrentSection] = useState("Profile");

  useEffect(() => {
    bridalId = CookieService.getCookie("bridalId");
    window.scrollTo(0, 0);
  }, []);
  // this.state = {
  //     showregistry: location.search.split('=')[1] == 'bridal' ? true : false,
  //     isCeriseClubMember: false
  // }

  // const setSelectedSection = () => {

  //     switch (currentSection) {
  //         case 'profile':
  //             return <MyProfile/>
  //             break;
  //         case 'password':
  //             return <ChangePassword/>
  //             break;
  //         case 'address':
  //             return <ManageAddress isCeriseClubMember={this.state.isCeriseClubMember} isbridal={this.props.isbridal} currentCallBackComponent="account" id={bridalId}/>
  //             break;
  //         case 'orders':
  //             return <PastOrders setAccountPage={this.setAccountPage}/>
  //             break;
  //         case 'track':
  //             return <Tracking setAccountPage={this.setAccountPage}/>
  //             break;
  //         case 'bridal':
  //             return <MainBridal id={bridalId} mobile={mobile}/>
  //             break;
  //         case 'checkbalance':
  //             return <CheckBalance />
  //             break;
  //         case 'agc':
  //             return <Activate />
  //             break;
  //         case 'cerise':
  //             return <CeriseClubMain mobile={mobile}/>
  //             break;
  //         default:

  //     }
  // }

  // const getLoyaltyTransactions = () => {
  //     const formData = new FormData();
  //     formData.append("email", window.user.email);
  //     formData.append("phoneno", "");
  //     axios.post(`${Config.hostname}mobiquest/showloyaltytransactions/`, formData)
  //     .then(res => {
  //         if (res.data.is_success) {
  //             let isCeriseClubMember = res.data.message.CUSTOMER_DETAILS[0].Slab == "CERISE" || res.data.message.CUSTOMER_DETAILS[0].Slab == "CERISE SITARA" || res.data.message.CUSTOMER_DETAILS[0].Slab == "FF10" || res.data.message.CUSTOMER_DETAILS[0].Slab == "FF15"
  //             this.setState({
  //                 slab: res.data.message.CUSTOMER_DETAILS[0].Slab,
  //                 isCeriseClubMember: isCeriseClubMember
  //             }, () => {
  //                 const slab = slab.toLowerCase() == "cerise" || slab.toLowerCase() == "cerise sitara";
  //                 this.props.updateCeriseClubAccess(slab);
  //             })
  //         }
  //     })
  //     .catch(err => {
  //         console.log(err);
  //     });
  // }

  // const showRegistry = () => {
  //     this.setState({
  //         showregistry: !this.state.showregistry
  //     })
  // }

  // componentDidMount() {
  //     this.getLoyaltyTransactions();
  // }

  // let ceriseClubAccess;
  // if (slab) {
  //     ceriseClubAccess = slab.toLowerCase() == "cerise" || slab.toLowerCase() == "ff10" || slab.toLowerCase() == "ff15" || slab.toLowerCase() == "cerise sitara";
  // }

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
      component: () => <div>Track Order</div>,
      title: "track",
      loggedInOnly: false
    },
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
  ];
  let bgClass = cs(globalStyles.colMd10, globalStyles.col12, styles.bgProfile);
  bgClass +=
    slab && path == "/account/cerise"
      ? slab.toLowerCase() == "cerise" || slab.toLowerCase() == "ff10"
        ? cs(styles.ceriseClub, styles.ceriseLoyalty)
        : cs(styles.ceriseSitaraClub, styles.ceriseLoyalty)
      : "";
  return (
    <div className={globalStyles.containerStart}>
      <SecondaryHeader>
        <div className={cs(bootstrapStyles.colMd11, bootstrapStyles.offsetMd1)}>
          <span className={styles.heading}>
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
                      {accountMenuItems.map(item => {
                        return (
                          <li key={item.label}>
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
              <Switch>
                {accountMenuItems.map(
                  ({
                    component,
                    href,
                    label,
                    title,
                    currentCallBackComponent
                  }) => {
                    const Component = component;
                    return (
                      <Route key={label} exact path={href}>
                        <Component
                          setCurrentSection={() => setCurrentSection(title)}
                          currentCallBackComponent={currentCallBackComponent}
                        />
                      </Route>
                    );
                  }
                )}
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
