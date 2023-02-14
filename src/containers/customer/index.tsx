import React, { useState, useEffect } from "react";
import SecondaryHeader from "components/SecondaryHeader";
import {
  NavLink,
  Switch,
  Route,
  useRouteMatch,
  useHistory
  // useLocation
} from "react-router-dom";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import cs from "classnames";
import iconStyles from "styles/iconFonts.scss";
import { useStore, useSelector, useDispatch } from "react-redux";
import CookieService from "services/cookie";
import { AccountMenuItem } from "./typings";
import { AppState } from "reducers/typings";
import SaleTncAug2020 from "./components/Static/saleTncAug2020";
import StaticService from "services/static";
import * as util from "utils/validate";
import Cust from "./components/Static/cust";

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
  const { showTimer } = useSelector((state: AppState) => state.info);
  const { footerList } = useSelector((state: AppState) => state.footer.data);
  const { path } = useRouteMatch();
  const [currentSection, setCurrentSection] = useState("");
  const history = useHistory();

  useEffect(() => {
    bridalId = CookieService.getCookie("bridalId");
    window.scrollTo(0, 0);
    util.pageViewGTM("Static");
  }, []);

  useEffect(() => {
    if (
      !footerList.filter(
        eleList =>
          eleList.filter(
            ele =>
              ele?.name === "HELP" &&
              ele?.value.filter(
                e => e?.link === "/customer-assistance/sales-conditions"
              ).length
          ).length
      ).length &&
      window.location.pathname === "/customer-assistance/sales-conditions"
    ) {
      history?.push("/error-page");
    }
  }, [footerList]);

  const dispatch = useDispatch();
  const fetchTerms = async (link: string) => {
    const res = await StaticService.fetchTerms(dispatch, link);
    return res;
  };

  const accountMenuItems: AccountMenuItem[] = [];
  footerList?.map(itemsList => {
    itemsList?.map(items => {
      items.value?.map(item => {
        if (
          item.link.includes("/customer-assistance") &&
          !item.link.includes("safety-measures")
        ) {
          accountMenuItems.push({
            label: item.text,
            href: item.link,
            title: item.text
          });
        }
      });
    });
  });

  let bgClass = cs(globalStyles.colMd10, globalStyles.col12);
  bgClass +=
    slab && path == "/account/cerise"
      ? slab.toLowerCase() == "cerise" || slab.toLowerCase() == "ff10"
        ? cs(styles.ceriseClub, styles.ceriseLoyalty)
        : cs(styles.ceriseSitaraClub, styles.ceriseLoyalty)
      : "";
  return (
    <div
      className={cs(globalStyles.containerStart, {
        [globalStyles.containerStartTimer]: showTimer
      })}
    >
      <SecondaryHeader>
        <div className={cs(bootstrapStyles.colMd11, bootstrapStyles.offsetMd1)}>
          <span className={styles.heading}>CUSTOMER ASSISTANCE</span>
        </div>
      </SecondaryHeader>
      <div className={bootstrapStyles.row}>
        {mobile ? (
          <div className={cs(styles.cSort, styles.subheaderAccount)}>
            <div className={cs(bootstrapStyles.col12, styles.productNumber)}>
              <div
                id="sortHeaderCust"
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
                <div
                  className={cs(styles.mobileFilterHeader, {
                    [styles.mobileFilterHeaderTimer]: showTimer
                  })}
                >
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
                      styles.mobileFilterMenu,
                      { [styles.mobileFilterMenuTimer]: showTimer }
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
            <div className={cs(styles.menuContainer)}>
              <ul>
                {accountMenuItems.map(item => {
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
                    href,
                    label,
                    title,
                    currentCallBackComponent,
                    pageTitle
                  }) => {
                    return (
                      <Route key={label} exact path={href}>
                        <Cust
                          setCurrentSection={() => setCurrentSection(title)}
                          mobile={mobile}
                          fetchTerms={() => fetchTerms(href || "")}
                          path={history?.location?.pathname}
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
                    fetchTerms={() => fetchTerms("sales-term")}
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
