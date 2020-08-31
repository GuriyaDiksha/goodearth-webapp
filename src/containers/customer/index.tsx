import React, { useState, useEffect } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import {
  NavLink,
  Switch,
  Route,
  useRouteMatch
  // useLocation
} from "react-router-dom";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import cs from "classnames";
import iconStyles from "styles/iconFonts.scss";
import { useStore, useSelector } from "react-redux";
import CookieService from "services/cookie";
import { AccountMenuItem } from "./typings";
import { AppState } from "reducers/typings";
import Returns from "./components/Static";
import Shipping from "./components/Static/shipping";
import Terms from "./components/Static/terms";
import CeriseTerms from "./components/Static/ceriseterms";
import Cookie from "./components/Static/cookie";
import Privacy from "./components/Static/privacy";
import SaleTnc from "./components/Static/saletnc";
import SaleTncAug2020 from "./components/Static/saleTncAug2020";

type Props = {
  isbridal: boolean;
  mobile: boolean;
  updateCeriseClubAccess: () => void;
};

// type State = {
//     isCeriseClubMember: boolean;
//     showregistry: boolean;
// }

const StaticPage: React.FC<Props> = props => {
  let bridalId = "";
  const [accountListing, setAccountListing] = useState(false);
  const [slab] = useState("");
  const { mobile } = useStore().getState().device;
  const { isLoggedIn } = useSelector((state: AppState) => state.user);
  const { path } = useRouteMatch();

  const [currentSection, setCurrentSection] = useState("");

  // const location = useLocation();

  useEffect(() => {
    bridalId = CookieService.getCookie("bridalId");
    window.scrollTo(0, 0);
  }, []);

  const accountMenuItems: AccountMenuItem[] = [
    {
      label: "Shipping & Payment",
      href: "/customer-assistance/shipping-payment",
      component: Shipping,
      title: "Shipping & Payment",
      loggedInOnly: false
    },
    {
      label: "Returns & Exchanges",
      href: "/customer-assistance/returns-exchanges",
      component: Returns,
      title: "Returns & Exchanges",
      loggedInOnly: false
    },
    {
      label: "Terms of Use",
      href: "/customer-assistance/terms-conditions",
      component: Terms,
      title: "Terms of Use",
      loggedInOnly: false
    },
    {
      label: "Cerise: Terms of Use",
      href: "/customer-assistance/terms",
      component: CeriseTerms,
      title: "Cerise: Terms of Use",
      loggedInOnly: false
    },
    {
      label: "Joy Store Terms of Use",
      href: "/customer-assistance/sales-conditions",
      component: SaleTnc,
      title: "Joy Store Terms of Use",
      loggedInOnly: false
    },
    {
      label: "Privacy Policy",
      href: "/customer-assistance/privacy-policy",
      component: Privacy,
      title: "Privacy Policy",
      loggedInOnly: false
    },
    {
      label: "Cookie Policy",
      href: "/customer-assistance/cookie-policy",
      component: Cookie,
      title: "Cookie Policy",
      loggedInOnly: false
    }
  ];
  let bgClass = cs(globalStyles.colMd10, globalStyles.col12);
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
          <span className={styles.heading}>CUSTOMER ASSISTANCE</span>
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
                              onClick={() => {
                                setAccountListing(false);
                              }}
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
              </ul>
            </div>
          </div>
        )}
        <div className={bgClass}>
          <div className={bootstrapStyles.row}>
            <div
              className={cs(
                bootstrapStyles.colMd10,
                bootstrapStyles.offsetMd1,
                bootstrapStyles.col10,
                bootstrapStyles.offset1
                // { [styles.accountFormBg]: !mobile },
                // { [styles.accountFormBgMobile]: mobile }
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
                          mobile={mobile}
                          currentCallBackComponent={currentCallBackComponent}
                        />
                      </Route>
                    );
                  }
                )}
                <Route
                  key={"Sale Terms of Use"}
                  exact
                  path={"/customer-assistance/sales-terms"}
                >
                  <SaleTncAug2020
                    setCurrentSection={() =>
                      setCurrentSection("Sale Terms of Use")
                    }
                    mobile={mobile}
                  />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
