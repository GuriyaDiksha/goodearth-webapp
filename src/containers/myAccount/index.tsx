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
import loyaltyStyles from "./components/CeriseDashboard/styles.scss";
import cs from "classnames";
import iconStyles from "styles/iconFonts.scss";
import MyProfile from "./components/MyProfile";
import PastOrders from "./components/MyOrder";
import { useSelector, useDispatch } from "react-redux";
import { AccountMenuItem } from "./typings";
import CheckBalance from "./components/Balance";
import MyPreferences from "./components/myPreferences";
import AddressMain from "components/Address/AddressMain";
import Bridal from "./components/Bridal";
import { AppState } from "reducers/typings";
import ActivateGiftCard from "./components/ActivateGiftCard";
import TrackOrder from "./components/TrackOrder";
import CeriseDashboard from "./components/CeriseDashboard";
import TransactionDashboard from "./components/TransactionDashboard";
import profileIcon from "../../images/dock_profile.svg";
import { CONFIG } from "constants/util";
// import MyCreditNotes from "./components/MyCreditNotes";
import AccountService from "services/account";
import { GA_CALLS } from "constants/cookieConsent";
import CookieService from "services/cookie";
import GiftCardCreditNotes from "./components/MyGiftCardCreditNotes";

type Props = {
  isBridal: boolean;
  mobile: boolean;
  updateCeriseClubAccess: () => void;
};

const MyAccount: React.FC<Props> = props => {
  const { bridalId } = useSelector((state: AppState) => state.user);
  const [accountListing, setAccountListing] = useState(false);
  const { mobile } = useSelector((state: AppState) => state.device);
  const { isLoggedIn, slab } = useSelector((state: AppState) => state.user);
  const { showTimer } = useSelector((state: AppState) => state.info);
  const { currency } = useSelector((state: AppState) => state);
  const [currentSection, setCurrentSection] = useState("Profile");
  // const [creditnoteList, setCreditnoteList] = useState<CreditNote[]>([]);

  // const [isGc, setIsGc] = useState(false);
  // const [gcAmount, setGcAmount] = useState("");
  // const [cnAmount, setCnAmount] = useState("");

  const location = useLocation();
  const [showRegistry, setShowRegistry] = useState(
    location.pathname.includes("registry") ? true : false
  );

  const { pathname } = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  // const fetchCreditNotes = () => {
  //   AccountService.fetchCreditNotes(dispatch, "expiring_date", "asc", 1, false)
  //     .then(response => {
  //       const { results } = response;
  //       setCreditnoteList(results.filter(ele => ele?.type !== "GC"));
  //     })
  //     .catch(e => {
  //       console.log("fetch credit notes API failed =====", e);
  //     });
  // };

  // const fetchGC_CN_Ammount = () =>{
  //   AccountService.fetchGC_CN_Ammount(dispatch)
  //     .then(response=>{
  //       setIsGc(response.hasGC);
  //       setGcAmount(response.availableGCamount);
  //       setCnAmount(response.availableGCamount);
  //    })
  //    .catch(e => {
  //       console.log("fetch credit notes API failed =====", e);
  //     });
  // }

  useEffect(() => {
    if (isLoggedIn) {
      window.scrollTo(0, 0);
      // fetchCreditNotes();
      // fetchGC_CN_Ammount();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const noContentContainerElem = document.getElementById(
      "no-content"
    ) as HTMLDivElement;
    if (
      noContentContainerElem &&
      noContentContainerElem?.classList?.contains(globalStyles.contentContainer)
    ) {
      noContentContainerElem.classList.remove(globalStyles.contentContainer);
    }
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
      slab.toLowerCase() == "cerise club" ||
      slab.toLowerCase() == "ff10" ||
      slab.toLowerCase() == "ff15" ||
      slab.toLowerCase() == "cerise sitara";
  }
  ceriseClubAccess &&
    accountMenuItems.push({
      label: "Cerise",
      href: "/account/cerise",
      component: CeriseDashboard,
      title: "Cerise",
      loggedInOnly: true
    });
  accountMenuItems.push({
    label: "",
    href: "/account/cerise/transaction",
    component: TransactionDashboard,
    title: "",
    loggedInOnly: true
  });
  accountMenuItems.push(
    {
      label: "Good Earth Registry",
      href: "/account/registry",
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
    }
  );

  // currency === "INR" &&
  //   creditnoteList?.length &&
  //   accountMenuItems.push({
  //     label: "My Credit Notes",
  //     href: "/account/credit-notes",
  //     component: MyCreditNotes,
  //     title: "My Credit Notes",
  //     loggedInOnly: true
  //   });

  accountMenuItems.push({
    label: "Gift Card & Credit Note",
    href: "/account/gift-card-credit-notes",
    component: GiftCardCreditNotes,
    title: "Gift Card & Credit Note",
    loggedInOnly: true
  });

  !isLoggedIn &&
    accountMenuItems.push({
      label: "Check Balance",
      href: "/account/check-balance",
      component: CheckBalance,
      title: "Check Balance",
      loggedInOnly: false
    });

  if (CONFIG.WHATSAPP_SUBSCRIBE_ENABLED) {
    accountMenuItems.push({
      label: "My Preferences",
      href: "/account/my-preferences",
      component: MyPreferences,
      title: "My Preferences",
      loggedInOnly: true
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    //const userInfo = JSON.parse(CookieService.getCookie("user") || "{}");
    if (
      accountMenuItems.filter(
        item => item.href == pathname && item.loggedInOnly
      ).length > 0 &&
      !isLoggedIn
    ) {
      if (pathname == "/account/registry") {
        LoginService.showLogin(dispatch);
      } else {
        history.push("/");
      }
    }
  }, [pathname, isLoggedIn]);

  useEffect(() => {
    if (
      currency !== "INR" &&
      isLoggedIn &&
      pathname === "/account/credit-notes"
    ) {
      history.push("/");
    }
  }, [currency]);

  const bgClass = cs(
    globalStyles.colLg10,
    globalStyles.col12,
    styles.bgProfile,

    slab && pathname == "/account/cerise"
      ? slab.toLowerCase() == "cerise" ||
        slab.toLowerCase() == "cerise sitara" ||
        slab.toLowerCase() == "cerise club" ||
        slab.toLowerCase() == "ff10"
        ? cs(styles.ceriseClub, loyaltyStyles.ceriseDashboardContainer)
        : cs(styles.ceriseSitaraClub, loyaltyStyles.ceriseDashboardContainer)
      : "",
    slab && pathname == "/account/cerise/transaction"
      ? cs(styles.ceriseSitaraClub, loyaltyStyles.ceriseDashboardContainer)
      : ""
  );

  useEffect(() => {
    accountListing
      ? document.body.classList.add(globalStyles.noScroll)
      : document.body.classList.remove(globalStyles.noScroll);
  }, [accountListing]);

  const bridalGAcall = (url: string) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "ge_create_my_registry_click",
        user_status: isLoggedIn ? "Logged in" : "Guest",
        click_url: `${window?.location?.origin}${url}`
      });
    }
  };

  return (
    <div
      className={cs(styles.containerStart, {
        [styles.containerStartTimer]: showTimer
      })}
    >
      {!mobile && (
        <SecondaryHeader>
          <div
            className={cs(bootstrapStyles.colMd11, bootstrapStyles.offsetMd1)}
          >
            <span className={cs(styles.heading, globalStyles.verticalMiddle)}>
              {history?.location?.pathname ===
              "/account/cerise/transaction" ? null : (
                <img className={styles.icon} src={profileIcon} />
              )}{" "}
              {history?.location?.pathname === "/account/cerise/transaction"
                ? "Cerise"
                : "My Account"}
            </span>
          </div>
        </SecondaryHeader>
      )}
      <div className={bootstrapStyles.row}>
        {mobile ? (
          <div className={cs(styles.cSort, styles.subheaderAccount)}>
            <div className={cs(bootstrapStyles.col12, styles.productNumber)}>
              <div
                id="sortHeader"
                className={cs(styles.cSortHeader, {
                  // [styles.cSortHeaderTimer]: showTimer
                })}
              >
                <div
                  className={
                    accountListing
                      ? globalStyles.hidden
                      : styles.collectionHeader
                  }
                  onClick={() => {
                    setAccountListing(true);
                    pathname == "/account/registry" &&
                      bridalId == 0 &&
                      bridalGAcall("/account/registry");
                  }}
                >
                  <span>
                    {pathname == "/account/registry"
                      ? bridalId == 0
                        ? "Create a Registry"
                        : "Manage Registry"
                      : pathname == "/account/giftcard-activation"
                      ? "Activate Gift Card"
                      : pathname == "/account/cerise" ||
                        pathname == "/account/cerise/transaction"
                      ? "Cerise"
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
                  id="accountFilterHeader"
                >
                  <div className={styles.filterCross}>
                    <span>
                      {pathname == "/account/registry"
                        ? bridalId == 0
                          ? "Create a Registry"
                          : "Manage Registry"
                        : pathname == "/account/giftcard-activation"
                        ? "Activate Gift Card"
                        : currentSection}
                    </span>
                    <span
                      onClick={() => {
                        setAccountListing(false);
                        pathname == "/account/registry" &&
                          bridalId == 0 &&
                          bridalGAcall("/account/registry");
                      }}
                    >
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
                    id="mobileFilter"
                    className={cs(
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
                          return item.label ? (
                            <li key={item?.label}>
                              <NavLink
                                onClick={() => setAccountListing(false)}
                                key={item?.label}
                                to={item?.href}
                                activeClassName={styles.gold}
                              >
                                {item?.label}
                              </NavLink>
                            </li>
                          ) : null;
                        })}
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
                    return item?.title == "bridal" ? (
                      <li
                        key={item?.label}
                        className={
                          showRegistry
                            ? styles.bridalleftsec
                            : cs(styles.bridalleftsec)
                        }
                      >
                        <span
                          onClick={() => setShowRegistry(!showRegistry)}
                          className={
                            showRegistry && currentSection == "bridal"
                              ? styles.gold
                              : ""
                          }
                        >
                          Good Earth Registry{" "}
                        </span>
                        {showRegistry ? (
                          <ul>
                            <li key="create-manage-bridal">
                              <NavLink
                                to={item?.href}
                                activeClassName={styles.gold}
                                onClick={() => {
                                  pathname == "/account/registry" &&
                                    bridalId == 0 &&
                                    bridalGAcall("/account/registry");
                                }}
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
                      <li key={item?.label}>
                        {" "}
                        <NavLink
                          key={item?.label}
                          to={item?.href}
                          activeClassName={styles.gold}
                        >
                          {item?.label}
                        </NavLink>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        )}
        {
          <Switch>
            {accountMenuItems.map(
              ({ component, href, label, title, currentCallBackComponent }) => {
                const Component = component;
                if (title?.toLowerCase() == "cerise" || title === "") {
                  return (
                    <Route key={label} exact path={href}>
                      <div className={bgClass}>
                        <div className={bootstrapStyles.row}>
                          <Component
                            setCurrentSection={() =>
                              setCurrentSection(title || "Cerise")
                            }
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
                              bootstrapStyles.col12,
                              globalStyles.textCenter,
                              { [styles.accountFormBg]: !mobile },
                              {
                                [styles.accountFormBgMobile]: mobile,
                                // [bootstrapStyles.colLg8]:
                                //   href === "/account/credit-notes"
                                // [bootstrapStyles.offsetLg2]:
                                //   href === "/account/credit-notes"
                                // [bootstrapStyles.colLg6]:
                                //   href !== "/account/credit-notes",
                                // [bootstrapStyles.offsetLg3]:
                                //   href !== "/account/credit-notes",
                                [bootstrapStyles.colLg8]:
                                  href === "/account/gift-card-credit-notes",
                                [bootstrapStyles.offsetLg2]:
                                  href === "/account/gift-card-credit-notes",
                                [bootstrapStyles.colLg6]:
                                  href !== "/account/gift-card-credit-notes",
                                [bootstrapStyles.offsetLg3]:
                                  href !== "/account/gift-card-credit-notes"
                              }
                            )}
                          >
                            {title.toLowerCase() == "bridal" ? (
                              <Component
                                setCurrentSection={() =>
                                  setCurrentSection(title || "Cerise")
                                }
                                currentCallBackComponent={
                                  currentCallBackComponent
                                }
                                bridalId={bridalId}
                              />
                            ) : (
                              <Component
                                setCurrentSection={() =>
                                  setCurrentSection(title || "Cerise")
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
