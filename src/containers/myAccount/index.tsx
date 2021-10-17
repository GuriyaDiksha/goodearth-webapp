import React, { useState, useEffect } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import {
  NavLink,
  Switch,
  Route,
  useLocation,
  useHistory
} from "react-router-dom";
import LoginService from "services/login";
import globalStyles from "../../styles/global.scss";
import styles from "./styles.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import loyaltyStyles from "./components/CeriseClub/styles.scss";
import cs from "classnames";
import iconStyles from "styles/iconFonts.scss";
import MyProfile from "./components/MyProfile";
import PastOrders from "./components/MyOrder";
import ChangePassword from "./components/ChangePassword";
import { useSelector, useDispatch } from "react-redux";
import { AccountMenuItem } from "./typings";
import CheckBalance from "./components/Balance";
import AddressMain from "components/Address/AddressMain";
import Bridal from "./components/Bridal";
import { AppState } from "reducers/typings";
import ActivateGiftCard from "./components/ActivateGiftCard";
import TrackOrder from "./components/TrackOrder";
import AccountServices from "services/account";
import CeriseClubMain from "./components/CeriseClub/ceriseClubMain";
import * as util from "utils/validate";

type Props = {
  isBridal: boolean;
  mobile: boolean;
  updateCeriseClubAccess: () => void;
};

// type State = {
//     showregistry: boolean;
// }

const MyAccount: React.FC<Props> = props => {
  const { bridalId } = useSelector((state: AppState) => state.user);
  const [accountListing, setAccountListing] = useState(false);
  const [slab, setSlab] = useState("");
  const { mobile } = useSelector((state: AppState) => state.device);
  const { isLoggedIn, email } = useSelector((state: AppState) => state.user);
  const { showTimer } = useSelector((state: AppState) => state.info);
  // const [ isCeriseClubMember, setIsCeriseClubMember ] = useState(false);

  const [currentSection, setCurrentSection] = useState("Profile");
  const location = useLocation();
  const [showRegistry, setShowRegistry] = useState(
    location.pathname.includes("bridal") ? true : false
  );

  useEffect(() => {
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
  //             return <RegistryAddress isCeriseClubMember={this.state.isCeriseClubMember} isbridal={this.props.isbridal} currentCallBackComponent="account" id={bridalId}/>
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
  //             let isCeriseClubMember = res.data.message.Slab == "CERISE" || res.data.message.Slab == "CERISE SITARA" || res.data.message.Slab == "FF10" || res.data.message.Slab == "FF15"
  //             this.setState({
  //                 slab: res.data.message.Slab,
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
          // const isCeriseClubMember = data.message.Slab == "CERISE" || data.message.Slab == "CERISE SITARA" || data.message.Slab == "FF10" || data.message.Slab == "FF15"
          const responseSlab = data.message.Slab;
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
    util.pageViewGTM("MyAccount");
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
      title: "track order",
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
      label: "Good Earth Registry",
      href: "/account/bridal",
      component: Bridal,
      title: "bridal",
      loggedInOnly: true
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
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (
      accountMenuItems.filter(
        item => item.href == pathname && item.loggedInOnly
      ).length > 0 &&
      !isLoggedIn
    ) {
      if (pathname == "/account/bridal") {
        LoginService.showLogin(dispatch);
      } else {
        history.push("/");
      }
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
    <div
      className={cs(globalStyles.containerStart, {
        [globalStyles.containerStartTimer]: showTimer
      })}
    >
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
              <div
                className={cs(styles.cSortHeader, {
                  [styles.cSortHeaderTimer]: showTimer
                })}
              >
                <div
                  className={
                    accountListing
                      ? globalStyles.hidden
                      : styles.collectionHeader
                  }
                  onClick={() => setAccountListing(true)}
                >
                  <span>
                    {pathname == "/account/bridal"
                      ? bridalId == 0
                        ? "Create a Registry"
                        : "Manage Registry"
                      : pathname == "/account/giftcard-activation"
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
                <div
                  className={cs(styles.mobileFilterHeader, {
                    [styles.mobileFilterHeaderTimer]: showTimer
                  })}
                >
                  <div className={styles.filterCross}>
                    <span>
                      {pathname == "/account/bridal"
                        ? bridalId == 0
                          ? "Create a Registry"
                          : "Manage Registry"
                        : pathname == "/account/giftcard-activation"
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
                      styles.mobileFilterMenu,
                      { [styles.mobileFilterMenuTimer]: showTimer }
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
                    return item.title == "bridal" ? (
                      <li
                        key={item.label}
                        className={
                          showRegistry
                            ? styles.bridalleftsec
                            : cs(styles.bridalleftsec, styles.bridalplus)
                        }
                      >
                        <span
                          onClick={() => setShowRegistry(!showRegistry)}
                          className={
                            showRegistry && currentSection == "bridal"
                              ? globalStyles.cerise
                              : ""
                          }
                        >
                          Good Earth Registry{" "}
                        </span>
                        {showRegistry ? (
                          <ul>
                            <li key="create-manage-bridal">
                              <NavLink
                                // name="bridal"

                                to={item.href}
                                activeClassName={globalStyles.cerise}
                                // className={showregistry && currentSection == "bridal" ? "cerise":""}
                              >
                                {bridalId == 0
                                  ? "Create a Registry"
                                  : "Manage Registry"}
                              </NavLink>
                            </li>
                            <li key="bridal-terms">
                              <NavLink
                                to="/customer-assistance/terms-conditions?id=bridalregistryterms"
                                target="_blank"
                              >
                                Good Earth Registry Policy
                              </NavLink>
                            </li>
                          </ul>
                        ) : (
                          ""
                        )}
                      </li>
                    ) : (
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
                            {title.toLowerCase() == "bridal" ? (
                              <Component
                                setCurrentSection={() =>
                                  setCurrentSection(title)
                                }
                                currentCallBackComponent={
                                  currentCallBackComponent
                                }
                                bridalId={bridalId}
                              />
                            ) : (
                              <Component
                                setCurrentSection={() =>
                                  setCurrentSection(title)
                                }
                                currentCallBackComponent={
                                  currentCallBackComponent
                                }
                              />
                            )}
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
