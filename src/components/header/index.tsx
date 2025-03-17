import loadable from "@loadable/component";
import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import goodearth from "fonts/goodearth.woff2";
import styles from "./styles.scss";
import cs from "classnames";
import SideMenu from "./sidemenu";
// import MainMenu from "./menu";
// import { MenuList } from "./menulist";
import GrowlMessage from "../GrowlMessage";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import gelogoCerise from "../../images/gelogoCerise.svg";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import { State } from "./typings";
import UserContext from "contexts/user";
import mapDispatchToProps from "./mapper/actions";
import { DropdownItem } from "components/dropdown/baseDropdownMenu/typings";
import Search from "./search";
import fabicon from "images/favicon.ico";
import MakerUtils from "../../utils/maker";
import BottomMenu from "./bottomMenu";
import {
  announcementBarGTM,
  headerClickGTM,
  footerClickGTM,
  getInnerText,
  megaMenuNavigationGTM,
  menuNavigationGTM
} from "../../utils/validate";
const Bag = loadable(() => import("../Bag/index"));
const StoreDetails = loadable(() => import("../StoreDetails/index"));
const CushionBag = loadable(() => import("../Cushion"));
const Mobilemenu = loadable(() => import("./mobileMenu"));
import MegaMenu from "./megaMenu";
import CountdownTimer from "./CountdownTimer";
import AnnouncementBar from "./AnnouncementBar";
// import { CUST } from "constants/util";
import Loader from "components/Loader";
import Sizechart from "components/Sizechart";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const mapStateToProps = (state: AppState) => {
  return {
    megaMenuData: state.header.megaMenuData,
    announcement: state.header.announcementData,
    currency: state.currency,
    currencyList: state.info.currencyList,
    mobile: state.device.mobile,
    tablet: state.device.tablet,
    wishlistData: state.wishlist.items,
    // wishlistCountData: state.wishlist.count,
    // sortBy: state.wishlist.sortBy,
    cart: state.basket,
    message: state.message,
    location: state.router.location,
    meta: state.meta,
    isLoggedIn: state.user.isLoggedIn,
    bridalId: state.user.bridalId,
    bridalCount: state.bridal.count,
    slab: state.user.slab,
    cookies: state.cookies,
    showTimer: state.info.showTimer,
    timerData: state.header.timerData,
    customerGroup: state.user.customerGroup,
    showStock: state.header.storeData.visible,
    showSizeChart: state.header.sizeChartData.show,
    mobileMenuOpenState: state.header.mobileMenuOpenState,
    filler: state.filler,
    openModal: state.modal.openModal,
    scrollDown: state.info.scrollDown,
    user: state.user,
    showmobileSort: state.header.showmobileSort,
    isShared: state.router.location.pathname.includes("shared-wishlist"),
    isLoader: state.info.isLoading
  };
};

export type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
      showMenu: false,
      showSearch: false,
      showC: false,
      showP: false,
      activeIndex: -1,
      urlParams: new URLSearchParams(props.location.search.slice(1)),
      selectedPincode: "",
      showPincodePopup: false,
      showBag: false,
      isLoading: false,
      reloadAnnouncementBar: true,
      showCartMobile:
        (this.props.location.pathname.includes("/catalogue/") &&
          !this.props.location.pathname.includes("/catalogue/category")) ||
        (this.props.location.pathname.includes("/registry/") &&
          !this.props.location.pathname.includes("/account/")),
      isPlpPage:
        this.props.location.pathname.indexOf("/catalogue/category") > -1 ||
        this.props.location.pathname.includes("/search/")
    };
  }
  static contextType = UserContext;

  onhover = (data: { show: boolean; activeIndex: number }) => {
    // if is for ipad
    // if (false) {
    //   this.setState({
    //     show:
    //       data.activeIndex == this.state.activeIndex && this.state.show == true
    //         ? false
    //         : data.show,
    //     activeIndex: data.activeIndex
    //   });
    // } else {
    this.setState({
      show: data.show,
      activeIndex: data.activeIndex
    });
    // }
  };

  listenAnnouncementBarClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", event => {
        const elem = event.target as HTMLAnchorElement;
        announcementBarGTM(
          elem.dataset.text || "",
          elem.getAttribute("href") || ""
        );
      });
    }
  };

  componentDidMount() {
    const { user } = this.props;
    const isBridalPublicPage =
      this.props.location.pathname.includes("/registry/") &&
      !this.props.location.pathname.includes("/account/");
    let bridalKey = "";
    document.addEventListener("scroll", this.onScroll);
    if (isBridalPublicPage) {
      const pathArray = this.props.location.pathname.split("/");
      bridalKey = pathArray[pathArray.length - 1];
    }
    this.setState({ isLoading: true });
    this.props
      .onLoadAPiCall(
        this.props?.cookies,
        this.props.bridalId,
        bridalKey,
        // this.props.sortBy,
        this.props.history?.location?.pathname
      )
      .then(() => {
        this.setState({ isLoading: false });
      })
      .catch(e => {
        this.setState({ isLoading: false });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
    // if (
    //   typeof document != "undefined" &&
    //   user.email &&
    //   (!user.gender || !user.country || !user.lastName || !user.firstName)
    // ){
    //  this.props.updateProfile();
    // }
    const queryString = this.props.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("loginpopup");
    if (id == "abandoncart") {
      if (!this.props.isLoggedIn) {
        this.props.goLogin();
      }
      this.props.history.push("/cart");
    }
    if (id == "cerise") {
      if (!this.props.isLoggedIn) {
        this.props.goLogin();
      } else {
        this.props.history.push("/");
        // this.props.showCerisePopup();
      }
    }
    this.setState({
      selectedPincode: localStorage.getItem("selectedPincode")
    });

    if (this.props.location.pathname.includes("/send-giftcard")) {
      const lineId = urlParams.get("line_id");
      if (lineId) {
        this.props
          .resendGcEmail(lineId)
          .catch(err => {
            console.log("resend gc error!!");
          })
          .finally(() => {
            this.props.history.push("/");
          });
      }
    }

    // to fetch announcement bar in case user navigates away from bridal public link without adding bridal products to basket
    if (
      this.props.announcement.isBridalActive &&
      !this.props.cart.bridal &&
      !isBridalPublicPage
    ) {
      this.props.fetchAnnouncement();
    }

    // add click listener for announcement bar
    this.listenAnnouncementBarClick("bar1");
    this.listenAnnouncementBarClick("bar2");

    //Close Mini bag after URL Change
    const that = this;
    let previousPath = "/";
    const observer = new MutationObserver(function(mutations) {
      if (location.pathname !== previousPath) {
        previousPath = location.pathname;
        that.setState({ showBag: false });
        if (that.props.showSizeChart) {
          that.props.closeSizeChart();
        }
        // if (that.props.openModal) {
        //   that.props.closeModal();
        // }
        if (that.props.showStock) {
          that.props.closeInShopAvailability();
        }
        if (that.props.filler.show) {
          that.props.closeFillerPurchase();
        }
      }
    });
    const config = { subtree: true, childList: true };
    observer.observe(document, config);
    this.onScroll();
    if (
      typeof document != "undefined" &&
      user.email &&
      (!user.gender || !user.country || !user.lastName || !user.firstName)
      // || (!user.phoneNumber && !updateProfilePhoneNo)
    ) {
      document?.body?.classList?.add(globalStyles.noScroll);
    } else {
      document?.body?.classList?.remove(globalStyles.noScroll);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.announcement.data.length != nextProps.announcement.data.length
    ) {
      this.setState({
        reloadAnnouncementBar: false
      });
    }
    if (this.props.showTimer != nextProps.showTimer) {
      this.onScroll(null, nextProps.showTimer);
    }
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({
        isPlpPage:
          nextProps.location.pathname.indexOf("/catalogue/category") > -1 ||
          nextProps.location.pathname.indexOf("/search/") > -1
      });
    }
  }
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.announcement.data.length != prevProps.announcement.data.length
    ) {
      this.setState({
        reloadAnnouncementBar: true
      });
    }
    if (this.props.location.pathname != prevProps.location.pathname) {
      const isPDP =
        this.props.location.pathname.includes("/catalogue/") &&
        !this.props.location.pathname.includes("/catalogue/category");
      const isBridalPublicPage =
        this.props.location.pathname.includes("/registry/") &&
        !this.props.location.pathname.includes("/account/");
      if (isPDP || isBridalPublicPage) {
        if (!this.state.showCartMobile) {
          this.setState({
            showCartMobile: true
          });
        }
      } else {
        if (this.state.showCartMobile) {
          this.setState({
            showCartMobile: false
          });
        }
      }

      // to fetch announcement bar in case user navigates away from bridal public link without adding bridal products to basket
      if (
        this.props.announcement.isBridalActive &&
        !this.props.cart.bridal &&
        !isBridalPublicPage
      ) {
        this.props.fetchAnnouncement();
      }
    }
    this.onScroll();
  }

  // mouseOut(data: { show: boolean }) {
  //   this.setState({ show: data.show });
  // }

  onScroll = (event?: any, timer?: boolean) => {
    const windowScroll = window?.pageYOffset;
    const menuOverlay = document?.getElementById("menu_overlay");
    const annBar = document?.getElementById("announcement_bar");
    const annHeight = (annBar as HTMLElement)?.clientHeight;
    let annBarHeight;
    if (annHeight) {
      annBarHeight = annHeight - windowScroll;
    }
    const header = document.getElementById("myHeader");
    const headerHeight = (header as HTMLElement)?.clientHeight;
    const timerDiv = document.getElementById("ge-timer");
    const timerDivHeight = (timerDiv as HTMLElement)?.clientHeight;
    const mainNavHeader = document.getElementById("main-nav-header");
    const mainNavHeaderHeight = (mainNavHeader as HTMLElement)?.clientHeight;
    const istimer = timerDiv != null ? true : false;
    const sticky = (header as HTMLElement)?.offsetTop;
    const secondaryHeader = document.getElementById("secondaryHeader");
    const sortHeader = document.getElementById("sortHeader");
    const sortHeader2 = document.getElementById("sortHeaderCust");
    const sortHeaderMobile = document.getElementById("sortHeaderMobile");
    const gridList = document.getElementById("gridList");
    const accountFilterHeader = document.getElementById("accountFilterHeader");
    const mobileFilter = document.getElementById("mobileFilter");
    const filterHeader = document.getElementById("filterHeader");
    const mobileFilterMenu = document.getElementById("mobileFilterMenu");
    const dropdownFilterHeader = document.getElementById(
      "dropdownFilterHeader"
    );
    const dropdownFilterHeaderMenu = document.getElementById(
      "dropdownFilterHeaderMenu"
    );
    const shopLocatorDropdown = document.getElementById("shopLocatorDropdown");
    const shopLocatorDropdownMenu = document.getElementById(
      "shopLocatorDropdownMenu"
    );
    const ceriseHeader = document.getElementById("ceriseHeader");
    const { scrollDown } = this.props;

    const filterMenu = document.getElementById("filter_by");
    const filterMenuHeader = document.getElementById("filter-menu-header");

    const pressSortHeader = document.getElementById("pressSortHeader");
    const pressSortHeaderMenu = document.getElementById("pressSortHeaderMenu");
    const pressSortHeaderMenuDropdown = document.getElementById(
      "pressSortHeaderMenuDropdown"
    );
    const pressInternal = document.getElementById("pressinternal");
    const pressinternalHeader = document.getElementById("pressinternalHeader");
    const isAnnouncementBarAvailable = annBar ?? false;

    if (window?.pageYOffset > sticky) {
      // When announcement bar is hidden
      (header as HTMLElement).style.position = "fixed";
      (header as HTMLElement).style.marginBottom = "0px";
      const tim = timer !== undefined ? timer : this.props.showTimer;

      if (menuOverlay) {
        if (istimer) {
          const timerHeight = (timerDiv as HTMLElement)?.clientHeight;
          menuOverlay.style.top = `${timerHeight + headerHeight + 5}px`;
          // menuOverlay.style.height = `calc(100vh - ${timerHeight +
          //   headerHeight +
          //   5}px)`;
        } else {
          menuOverlay.style.top = `${headerHeight + 4}px`;
          // menuOverlay.style.height = `calc(100vh - ${headerHeight + 5}px)`;
        }
      }
      if (gridList) {
        if (scrollDown || window?.pageYOffset != 0) {
          (gridList as HTMLElement).style.top = "0px";
          // console.log("top 0");
        } else {
          if (tim) {
            // console.log(tim);
            (gridList as HTMLElement).style.top = "93px";
            // console.log("top 93");
          } else {
            (gridList as HTMLElement).style.top = "53px";
            // console.log("top 53");
          }
        }
      }

      /**
       * secondary header is now not available on mobile devices, so change the condition below
       */
      if (secondaryHeader || this.props.mobile) {
        let requiredHeight; // calculate the required height for the secondary header based on availability of timer
        if (tim) {
          requiredHeight = `${mainNavHeaderHeight + timerDivHeight}px`;
        } else {
          requiredHeight = `${mainNavHeaderHeight}px`;
        }

        if (requiredHeight) {
          if (secondaryHeader) {
            (secondaryHeader as HTMLElement).style.top = requiredHeight;
          }
          if (sortHeader) {
            (sortHeader as HTMLElement).style.top = requiredHeight;
          }
          if (sortHeader2) {
            (sortHeader2 as HTMLElement).style.top = requiredHeight;
          }
          if (sortHeaderMobile) {
            (sortHeaderMobile as HTMLElement).style.top = requiredHeight;
          }
        }
        // (secondaryHeader as HTMLElement).style.transition = "all 0.5s linear";
      }
      if (filterMenu) {
        const tim = timer !== undefined ? timer : this.props.showTimer;

        if (tim) {
          (filterMenu as HTMLElement).style.top = "160px"; // before 150px;
        } else {
          (filterMenu as HTMLElement).style.top = "120px";
        }
      }
      if (filterMenuHeader) {
        const tim = timer !== undefined ? timer : this.props.showTimer;

        if (tim) {
          (filterMenuHeader as HTMLElement).style.top = "90px";
        } else {
          (filterMenuHeader as HTMLElement).style.top = "50px";
        }
      }

      if (accountFilterHeader) {
        if (tim) {
          (accountFilterHeader as HTMLElement).style.top = "90px";
        } else {
          (accountFilterHeader as HTMLElement).style.top = "50px";
        }
      }

      if (mobileFilter) {
        if (tim) {
          (mobileFilter as HTMLElement).style.top = "140px";
        } else {
          (mobileFilter as HTMLElement).style.top = "100px";
        }
      }

      if (filterHeader) {
        if (tim) {
          (filterHeader as HTMLElement).style.top = "90px";
        } else {
          (filterHeader as HTMLElement).style.top = "50px";
        }
      }

      if (mobileFilterMenu) {
        if (tim) {
          (mobileFilterMenu as HTMLElement).style.top = "140px";
        } else {
          (mobileFilterMenu as HTMLElement).style.top = "100px";
        }
      }

      if (dropdownFilterHeader) {
        if (tim) {
          (dropdownFilterHeader as HTMLElement).style.top = "90px";
        } else {
          (dropdownFilterHeader as HTMLElement).style.top = "60px";
        }
      }

      if (dropdownFilterHeaderMenu) {
        if (tim) {
          (dropdownFilterHeaderMenu as HTMLElement).style.top = "130px";
        } else {
          (dropdownFilterHeaderMenu as HTMLElement).style.top = "100px";
        }
      }

      if (shopLocatorDropdown) {
        if (tim) {
          (shopLocatorDropdown as HTMLElement).style.top = "90px";
        } else {
          (shopLocatorDropdown as HTMLElement).style.top = "50px";
        }
      }

      if (shopLocatorDropdownMenu) {
        if (tim) {
          (shopLocatorDropdownMenu as HTMLElement).style.top = "92px";
        } else {
          (shopLocatorDropdownMenu as HTMLElement).style.top = "52px";
        }
      }
      if (ceriseHeader) {
        if (tim) {
          (ceriseHeader as HTMLElement).style.top = "90px";
        } else {
          (ceriseHeader as HTMLElement).style.top = "50px";
        }
      }

      if (pressSortHeader) {
        if (tim) {
          (pressSortHeader as HTMLElement).style.top = "90px";
        } else {
          (pressSortHeader as HTMLElement).style.top = "50px";
        }
      }

      if (pressSortHeaderMenu) {
        if (tim) {
          (pressSortHeaderMenu as HTMLElement).style.top = "90px";
        } else {
          (pressSortHeaderMenu as HTMLElement).style.top = "50px";
        }
      }

      if (pressSortHeaderMenuDropdown) {
        if (tim) {
          (pressSortHeaderMenuDropdown as HTMLElement).style.top = "138px";
        } else {
          (pressSortHeaderMenuDropdown as HTMLElement).style.top = "100px";
        }
      }

      if (pressInternal) {
        if (tim) {
          (pressInternal as HTMLElement).style.marginTop = "50px";
        } else {
          (pressInternal as HTMLElement).style.marginTop = "14px";
        }
      }

      if (pressinternalHeader && this.props.mobile) {
        if (tim) {
          (pressinternalHeader as HTMLElement).style.top = "95px";
        } else {
          (pressinternalHeader as HTMLElement).style.top = "55px";
        }
      }
    } else {
      (header as HTMLElement).style.position = "relative";
      (header as HTMLElement).style.marginBottom = "0px";
      const tim = timer !== undefined ? timer : this.props.showTimer;

      if (menuOverlay) {
        if (istimer) {
          const timerHeight = (timerDiv as HTMLElement)?.clientHeight;
          const topPosWithTimer =
            (annBarHeight ? annBarHeight : 0) + headerHeight + timerHeight;
          menuOverlay.style.top = `${topPosWithTimer + 5}px`;
          // menuOverlay.style.height = `calc(100vh - ${topPosWithTimer + 5}px)`;
        } else {
          const topPosition = (annBarHeight ? annBarHeight : 0) + headerHeight;
          menuOverlay.style.top = `${topPosition + 2}px`;
          // menuOverlay.style.height = `calc(100vh - ${topPosition + 5}px)`;
        }
      }
      if (gridList) {
        if (scrollDown && window?.pageYOffset != 0) {
          (gridList as HTMLElement).style.top = "0px";
        } else {
          if (tim) {
            (gridList as HTMLElement).style.top = `${133 -
              window?.pageYOffset}px`;
          } else {
            (gridList as HTMLElement).style.top = `${93 -
              window?.pageYOffset}px`;
          }
        }
      }

      /**
       * secondary header is now not available on mobile devices, so change the condition below
       */
      if (secondaryHeader || this.props.mobile) {
        let requiredHeight;
        if (isAnnouncementBarAvailable && !tim) {
          requiredHeight = `${annHeight + mainNavHeaderHeight}px`;
        } else if (!isAnnouncementBarAvailable && tim) {
          requiredHeight = `${timerDivHeight + mainNavHeaderHeight}px`;
        } else if (isAnnouncementBarAvailable && tim) {
          requiredHeight = `${timerDivHeight +
            annHeight +
            mainNavHeaderHeight}px`;
        } else {
          requiredHeight = `${mainNavHeaderHeight}px`;
        }

        if (requiredHeight) {
          if (secondaryHeader) {
            (secondaryHeader as HTMLElement).style.top = requiredHeight;
          }
          if (sortHeader) {
            (sortHeader as HTMLElement).style.top = requiredHeight;
          }
          if (sortHeader2) {
            (sortHeader2 as HTMLElement).style.top = requiredHeight;
          }
          if (sortHeaderMobile) {
            (sortHeaderMobile as HTMLElement).style.top = requiredHeight;
          }
        }
        // (secondaryHeader as HTMLElement).style.transition = "all 0.5s linear";
      }
      if (filterMenu) {
        const tim = timer !== undefined ? timer : this.props.showTimer;

        if (tim) {
          (filterMenu as HTMLElement).style.top = "200px";
        } else {
          (filterMenu as HTMLElement).style.top = "160px";
        }
      }
      if (filterMenuHeader) {
        const tim = timer !== undefined ? timer : this.props.showTimer;

        if (tim) {
          (filterMenuHeader as HTMLElement).style.top = "130px";
        } else {
          (filterMenuHeader as HTMLElement).style.top = "90px";
        }
      }

      if (accountFilterHeader) {
        if (tim) {
          (accountFilterHeader as HTMLElement).style.top = `${130 -
            window?.pageYOffset}px`;
        } else {
          (accountFilterHeader as HTMLElement).style.top = `${90 -
            window?.pageYOffset}px`;
        }
      }

      if (mobileFilter) {
        if (tim) {
          (mobileFilter as HTMLElement).style.top = `${180 -
            window?.pageYOffset}px`;
        } else {
          (mobileFilter as HTMLElement).style.top = `${140 -
            window?.pageYOffset}px`;
        }
      }

      if (filterHeader) {
        if (tim) {
          (filterHeader as HTMLElement).style.top = `${130 -
            window?.pageYOffset}px`;
        } else {
          (filterHeader as HTMLElement).style.top = `${90 -
            window?.pageYOffset}px`;
        }
      }

      if (mobileFilterMenu) {
        if (tim) {
          (mobileFilterMenu as HTMLElement).style.top = `${180 -
            window?.pageYOffset}px`;
        } else {
          (mobileFilterMenu as HTMLElement).style.top = `${140 -
            window?.pageYOffset}px`;
        }
      }

      if (dropdownFilterHeader) {
        if (tim) {
          (dropdownFilterHeader as HTMLElement).style.top = `${130 -
            window?.pageYOffset}px`;
        } else {
          (dropdownFilterHeader as HTMLElement).style.top = `${100 -
            window?.pageYOffset}px`;
        }
      }

      if (dropdownFilterHeaderMenu) {
        if (tim) {
          (dropdownFilterHeaderMenu as HTMLElement).style.top = `${180 -
            window?.pageYOffset}px`;
        } else {
          (dropdownFilterHeaderMenu as HTMLElement).style.top = `${145 -
            window?.pageYOffset}px`;
        }
      }

      if (shopLocatorDropdown) {
        if (tim) {
          (shopLocatorDropdown as HTMLElement).style.top = `${130 -
            window?.pageYOffset}px`;
        } else {
          (shopLocatorDropdown as HTMLElement).style.top = `${90 -
            window?.pageYOffset}px`;
        }
      }

      if (shopLocatorDropdownMenu) {
        if (tim) {
          (shopLocatorDropdownMenu as HTMLElement).style.top = `${132 -
            window?.pageYOffset}px`;
        } else {
          (shopLocatorDropdownMenu as HTMLElement).style.top = `${92 -
            window?.pageYOffset}px`;
        }
      }

      if (ceriseHeader) {
        if (tim) {
          (ceriseHeader as HTMLElement).style.top = `${130 -
            window?.pageYOffset}px`;
        } else {
          (ceriseHeader as HTMLElement).style.top = `${90 -
            window?.pageYOffset}px`;
        }
      }
      if (pressSortHeader) {
        if (tim) {
          (pressSortHeader as HTMLElement).style.top = `${130 -
            window?.pageYOffset}px`;
        } else {
          (pressSortHeader as HTMLElement).style.top = `${90 -
            window?.pageYOffset}px`;
        }
      }

      if (pressSortHeaderMenu) {
        if (tim) {
          (pressSortHeaderMenu as HTMLElement).style.top = `${130 -
            window?.pageYOffset}px`;
        } else {
          (pressSortHeaderMenu as HTMLElement).style.top = `${90 -
            window?.pageYOffset}px`;
        }
      }

      if (pressSortHeaderMenuDropdown) {
        if (tim) {
          (pressSortHeaderMenuDropdown as HTMLElement).style.top = `${180 -
            window?.pageYOffset}px`;
        } else {
          (pressSortHeaderMenuDropdown as HTMLElement).style.top = `${140 -
            window?.pageYOffset}px`;
        }
      }

      if (pressInternal) {
        if (tim) {
          (pressInternal as HTMLElement).style.marginTop = "80px";
        } else {
          (pressInternal as HTMLElement).style.marginTop = "50px";
        }
      }

      if (pressinternalHeader && this.props.mobile) {
        if (tim) {
          (pressinternalHeader as HTMLElement).style.top = `${135 -
            window?.pageYOffset}px`;
        } else {
          (pressinternalHeader as HTMLElement).style.top = `${95 -
            window?.pageYOffset}px`;
        }
      }
    }
    // (header as HTMLElement).style.transition = "all 0.5s ease-in-out";
  };

  componentWillUnmount() {
    document.removeEventListener("scroll", this.onScroll);
  }

  showCurrency = () => {
    this.setState({
      showC: !this.state.showC,
      showP: false
    });
  };

  changeCurrency = (cur: any) => {
    const { changeCurrency, reloadPage, history, currency } = this.props;
    const data: any = {
      currency: cur
    };
    if (!this.state.isLoading && this.props.currency != data.currency) {
      this.setState({
        isLoading: true
      });
      changeCurrency(data)
        .then((response: any) => {
          // if (data.currency == "INR") {
          //   history.push("/maintenance");
          // }
          this.setState({
            activeIndex: -1 // default value -1 not 0
          });
          if (history.location.pathname.indexOf("/catalogue/category/") > -1) {
            const path =
              history.location.pathname +
              history.location.search.replace(currency, response.currency);
            history.replace(path);
          }
          reloadPage(
            this.props.cookies,
            response.currency,
            this.props.customerGroup,
            history.location.pathname,
            this.props.isLoggedIn
            // this.props.sortBy
          );
        })
        .finally(() => {
          this.setState({
            isLoading: false
          });
        });
    }
  };

  onSideMenuClick = (clickType: string) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS) && clickType === "Search") {
      dataLayer.push({
        event: "search_bar_click"
      });
    }

    headerClickGTM(clickType, "Top", this.props.mobile, this.props.isLoggedIn);
  };

  onBottomMenuClick = (clickType: string) => {
    // util.headerClickGTM(
    //   clickType,
    //   "Bottom",
    //   this.props.mobile,
    //   this.props.isLoggedIn
    // );
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS) && clickType === "Search") {
      dataLayer.push({
        event: "search_bar_click"
      });
    }
    footerClickGTM(clickType, "Bottom", this.props.isLoggedIn);
  };

  gtmPushWishlistClick = () => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "eventsToSend",
        eventAction: "wishListClick",
        eventCategory: "Click",
        eventLabel: this.props.location.pathname
      });
    }
  };

  onMenuClick = ({
    l1,
    l2,
    l3,
    clickUrl1,
    clickUrl2,
    clickUrl3
  }: {
    [x: string]: string;
  }) => {
    menuNavigationGTM({
      l1: getInnerText(l1) || "",
      l2: getInnerText(l2) || "",
      l3: getInnerText(l3) || "",
      clickUrl1: clickUrl1 || "",
      clickUrl2: clickUrl2 || "",
      clickUrl3: clickUrl3 || "",
      mobile: this.props.mobile,
      isLoggedIn: this.props.isLoggedIn
    });
  };

  onMegaMenuClick = ({
    l1,
    l2,
    l3,
    clickUrl1,
    clickUrl2,
    clickUrl3,
    template,
    img2,
    img3,
    cta,
    subHeading
  }: {
    [x: string]: string;
  }) => {
    const obj = {
      l1: getInnerText(l1) || "",
      l2: getInnerText(l2) || "",
      l3: getInnerText(l3) || "",
      clickUrl1: clickUrl1 || "",
      clickUrl2: clickUrl2 || "",
      clickUrl3: clickUrl3 || "",
      template: template || "",
      img2: img2 || "",
      img3: img3 || "",
      cta: getInnerText(cta) || "",
      subHeading: subHeading || "",
      mobile: this.props.mobile || false,
      isLoggedIn: this.props.isLoggedIn || false
    };
    megaMenuNavigationGTM(obj);
  };

  showSearch = () => {
    if (
      this.props.history.location.pathname.indexOf("/registry/") > 0 &&
      !this.props.location.pathname.includes("/account/")
    ) {
      return false;
    }
    this.setState({
      showSearch: true,
      // showSearch: true,
      showMenu: false
    });
    this.props.updateShowSearchPopup(true);
  };

  hideSearch = () => {
    if (this.state.showSearch) {
      this.setState({
        showSearch: false
      });
      this.props.updateShowSearchPopup(false);
    }
  };
  hideMenu = () => {
    this.state.showMenu &&
      this.setState({
        showMenu: false
      });
  };

  clearBridalSession = async (source: string) => {
    await this.props.clearBridalSession();
    this.props.history.push("/");
    this.props.reloadAfterBridal(this.props.cookies, source);
  };

  clickToggle = () => {
    const isMobileMenuOpen = !this.state.showMenu;
    this.props.updateMobileMenuOpenState(!this.props.mobileMenuOpenState);

    if (isMobileMenuOpen) {
      document.body.classList.add(globalStyles.noScroll);
    } else {
      document.body.classList.remove(globalStyles.noScroll);
    }

    // if (onClickClose) {
    //   document.body.classList.remove(globalStyles.noScroll);
    // }

    this.setState({
      showMenu: !this.state.showMenu,
      showSearch: false
    });
    this.props.updateShowSearchPopup(false);
    //window.scrollTo(0, 0);
  };

  gtmPushLogoClick = () => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "eventsToSend",
        eventAction: "logo",
        eventCategory: "Click",
        eventLabel: location.pathname
      });
    }
  };

  setShowBag = (showBag: boolean) => {
    this.setState({
      showBag
    });
  };

  handleLogoClick = () => {
    this.gtmPushLogoClick();
    headerClickGTM("Logo", "Top", this.props.mobile, this.props.isLoggedIn);
    this.setState({
      showC: false,
      showMenu: false,
      showSearch: false
    });
    this.props.updateShowSearchPopup(false);
    if (document.body.classList.contains(globalStyles.noScroll)) {
      document.body.classList.remove(globalStyles.noScroll);
    }
    window.scrollTo(0, 0);
  };

  showPincode = () => {
    this.setState({ showPincodePopup: true });
    this.props.showPincodePopup(this.setPincode);
  };
  setPincode = (pincode: string) => {
    this.setState({ selectedPincode: pincode });
  };

  render() {
    const { isPlpPage } = this.state;
    const { isLoggedIn } = this.context;
    const {
      wishlistData,
      bridalCount,
      // wishlistCountData,
      meta,
      goLogin,
      handleLogOut,
      location,
      mobile,
      tablet,
      isShared
      // slab,
      // customerGroup
    } = this.props;

    const wishlistProductData = wishlistData.map(({ products }) => products);
    const flattenedArray = wishlistProductData.flat();
    const wishlistCount = flattenedArray.length;

    // const wishlistCount = wishlistData.length;
    // const wishlistCount = wishlistCountData;

    const bridalCountData = bridalCount;
    let bagCount = 0;
    const item = this.props.cart.lineItems;
    for (let i = 0; i < item.length; i++) {
      bagCount = bagCount + item[i].quantity;
    }
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
          href: "/account/my-orders",
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
        label: "Activate Gift Card",
        href: "/account/giftcard-activation",
        type: "link",
        value: "Activate Gift Card"
      },
      {
        label: isLoggedIn ? "Gift Card & Credit Note" : "Check Balance",
        href: isLoggedIn
          ? "/account/gift-card-credit-notes"
          : "/account/check-balance",
        type: "link",
        value: isLoggedIn ? "Gift Card & Credit Note" : "Check Balance"
      },
      {
        label: `Good Earth Registry ${
          isLoggedIn && bridalCountData > 0 ? "(" + bridalCountData + ")" : ""
        }`,
        href: isLoggedIn ? "/account/registry" : "/the-good-earth-registry",
        type: "link",
        value: "Good Earth Registry"
      }
      // {
      //   label: "Cerise Program",
      //   href: isLoggedIn && this.props.slab ? "/account/cerise" : "/cerise",
      //   type: "link",
      //   value: "Cerise Program"
      // },
      // {
      //   label: "Good Earth Registry",
      //   href: isLoggedIn ? "/account/bridal" : "",
      //   onClick: isLoggedIn
      //     ? () => null
      //     : () => this.props.goLogin(undefined, "/account/bridal"),
      //   type: isLoggedIn ? "link" : "button",
      //   value: "Good Earth Registry"
      // }
    );
    const loginItem: DropdownItem = {
      label: isLoggedIn ? "Logout" : "Login",
      onClick: isLoggedIn
        ? () =>
            handleLogOut(
              this.props.history,
              this.props.currency,
              this.props.customerGroup
            )
        : goLogin,
      type: "button",
      value: isLoggedIn ? "Logout" : "Login"
    };

    const isBridalRegistryPage =
      this.props.location.pathname.indexOf("/registry/") > -1 &&
      !(this.props.location.pathname.indexOf("/account/") > -1);

    const isCartPage = this.props.location.pathname.indexOf("/cart") > -1;

    const { showMenu } = this.state;
    const { showmobileSort } = this.props;
    // const isCeriseCustomer = slab
    //   ? slab.toLowerCase() == "cerise" ||
    //     slab.toLowerCase() == "cerise sitara" ||
    //     customerGroup == CUST.CERISE ||
    //     customerGroup == CUST.CERISE_SITARA
    //   : false;
    return (
      <div className="">
        {meta.h1Tag && (
          <h1
            style={mobile ? { height: "0px", maxHeight: "0px" } : {}}
            className={styles.titleH1}
          >
            {meta.h1Tag}
          </h1>
        )}
        <Helmet defer={false}>
          <title>
            {meta.titleTag
              ? meta.titleTag
              : "Good Earth – Stylish Sustainable Luxury Retail | Goodearth.in"}
          </title>
          <meta
            name="description"
            content={
              meta.description
                ? meta.description
                : "Good Earth – Luxury Indian Design House Explore handcrafted designs that celebrate style from an Indian perspective"
            }
          />
          {__DOMAIN__ != "https://www.goodearth.in" && (
            <meta name="robots" content="noindex" />
          )}
          <link
            rel="canonical"
            href={`${__DOMAIN__}${location.pathname}${
              location.search ? "?" + location.search : ""
            }`}
            data-defer={false}
          ></link>
          <link rel="icon" href={fabicon} data-defer={false}></link>
          {meta.keywords && <meta name="keywords" content={meta.keywords} />}
          {meta.ogTitle && (
            <meta property="og:title" content={`Goodearth | ${meta.ogTitle}`} />
          )}
          {
            <meta
              property="og:description"
              content={meta.ogDescription ? meta.ogDescription : ""}
            />
          }
          {<meta property="og:image" content={meta.ogImage || ""} />}
          {meta.ogUrl && <meta property="og:url" content={meta.ogUrl} />}
          {meta.ogType && <meta property="og:type" content={meta.ogType} />}
          {meta.ogSiteName && (
            <meta property="og:site_name" content={meta.ogSiteName} />
          )}
          {
            <meta
              property="og:image:width"
              content={meta.ogImageWidth ? meta.ogImageWidth : "948"}
            />
          }
          {
            <meta
              property="og:image:height"
              content={meta.ogImageHeight ? meta.ogImageHeight : "632"}
            />
          }

          {meta.twitterCard && (
            <meta name="twitter:card" content={meta.twitterCard} />
          )}
          {meta.twitterTitle && (
            <meta
              name="twitter:title"
              content={`Goodearth | ${meta.twitterTitle}`}
            />
          )}
          {meta.twitterUrl && (
            <meta name="twitter:url" content={meta.twitterUrl} />
          )}
          {
            <meta
              name="twitter:description"
              content={meta.twitterDescription ? meta.twitterDescription : ""}
            />
          }
          {meta.twitterImage && (
            <meta name="twitter:image" content={meta.twitterImage} />
          )}
          {meta.twitterDomain && (
            <meta name="twitter:domain" content={meta.twitterDomain} />
          )}
          {meta.twitterCreator && (
            <meta name="twitter:creator" content={meta.twitterCreator} />
          )}
          {meta.twitterSite && (
            <meta name="twitter:site" content={meta.twitterSite} />
          )}
          <meta httpEquiv="X-Frame-Options" content="deny" />
          <link
            rel="preload"
            href={goodearth}
            as="font"
            crossOrigin="crossorigin"
          />
        </Helmet>
        <div data-currency="USD">
          <div data-testid="pdp-product-price-prefix"></div>
          <div data-testid="pdp-product-price-suffix"></div>
        </div>
        {this.state.reloadAnnouncementBar && (
          <AnnouncementBar
            clearBridalSession={this.clearBridalSession}
            isBridalRegistryPage={isBridalRegistryPage}
          />
        )}
        <div
          id="myHeader"
          className={cs(
            {
              [styles.headerIndex]: showMenu,
              [styles.showSortHeaderIndex]: showmobileSort,
              [styles.plpIndex]: isPlpPage && !mobile,
              [styles.plpIndexMobile]: isPlpPage && mobile && !showmobileSort
            },
            styles.headerContainer
          )}
        >
          {!isBridalRegistryPage &&
            this.props.showTimer &&
            this.props.timerData && <CountdownTimer />}
          {this.state.showSearch && (
            <Search
              ipad={false}
              toggle={this.showSearch}
              hideSearch={this.hideSearch}
              hideMenu={this.hideMenu}
              closePopup={e => {
                if (e.target?.id != "searchIcon") {
                  this.setState({
                    showSearch: false,
                    showMenu: false
                  });
                  this.props.updateShowSearchPopup(false);
                }
              }}
            />
          )}
          <div
            className={cs(styles.minimumWidth, styles.headerBg)}
            id="main-nav-header"
          >
            <div className={cs(bootstrap.row, styles.menuForTablet)}>
              {mobile || tablet ? (
                <div
                  className={cs(
                    bootstrap.col3,
                    bootstrap.colLg3,
                    styles.hamburger
                  )}
                >
                  <i
                    className={
                      showMenu
                        ? styles.hidden
                        : cs(
                            iconStyles.icon,
                            iconStyles.iconLibraryMenu,
                            styles.iconStyle,
                            styles.iconFont
                          )
                    }
                    onClick={() => {
                      this.clickToggle();
                      headerClickGTM("Mobile Menu", "Top", true, isLoggedIn);
                    }}
                  ></i>
                  <i
                    className={
                      showMenu
                        ? cs(
                            iconStyles.icon,
                            iconStyles.iconCrossNarrowBig,
                            styles.iconStyle,
                            styles.iconCrossFont
                          )
                        : styles.hidden
                    }
                    onClick={() => {
                      this.clickToggle();
                    }}
                  ></i>
                </div>
              ) : (
                ""
              )}
              <div
                className={cs(
                  bootstrap.col6,
                  bootstrap.colLg3,
                  styles.logoContainer
                )}
              >
                <Link to="/" onClick={this.handleLogoClick}>
                  <img
                    alt="goodearth-logo"
                    src={gelogoCerise}
                    style={{
                      width: "111px",
                      cursor: "pointer"
                    }}
                  />
                </Link>
              </div>
              {mobile || tablet ? (
                ""
              ) : (
                <div
                  className={cs(
                    bootstrap.colLg6,
                    bootstrap.col3,
                    globalStyles.static
                  )}
                >
                  <MegaMenu
                    show={this.state.show}
                    activeIndex={this.state.activeIndex}
                    ipad={false}
                    hideSearch={this.hideSearch}
                    onMegaMenuClick={this.onMegaMenuClick}
                    mouseOver={(data: {
                      show: boolean;
                      activeIndex: number;
                    }): void => {
                      this.setState(
                        {
                          show: data.show,
                          activeIndex: data.show ? data.activeIndex : -1
                        },
                        () => {
                          const elem = document.getElementById(
                            `mega-menu-list-${data.activeIndex}`
                          );
                          if (data.show) {
                            if (elem) {
                              elem.style.maxHeight = elem.scrollHeight + "px";
                            }
                          } else {
                            if (elem) {
                              elem.style.removeProperty("max-height");
                            }
                          }
                        }
                      );
                    }}
                    data={this.props.megaMenuData}
                    location={this.props.location}
                  />
                </div>
              )}
              <div
                className={cs(
                  bootstrap.colLg3,
                  bootstrap.col3,
                  styles.sideMenuWrapper
                )}
              >
                {!(mobile || tablet) && (
                  <SideMenu
                    onSideMenuClick={this.onSideMenuClick}
                    showBag={this.state.showBag}
                    setShowBag={this.setShowBag}
                    showSearch={this.state.showSearch}
                    hideSearch={this.hideSearch}
                    toggleSearch={this.showSearch}
                    mobile={mobile}
                    // wishlistData={wishlistData}
                    wishlistCountData={wishlistCount}
                    currency={this.props.currency}
                    sidebagData={this.props.cart}
                    bridalCountData={bridalCountData}
                  />
                )}
                {(mobile || tablet) && (
                  <ul className={cs(bootstrap.row)}>
                    <li
                      className={cs(
                        styles.mobileSearch,
                        bootstrap.col,
                        globalStyles.textCenter
                      )}
                    >
                      <div
                        onClick={() => {
                          !this.state.showSearch &&
                            this.onSideMenuClick("Search");
                          if (this.state.showSearch) {
                            this.hideSearch();
                          } else {
                            this.showSearch();
                          }
                        }}
                      >
                        <i
                          id="searchIcon"
                          className={
                            this.state.showSearch
                              ? cs(
                                  iconStyles.icon,
                                  iconStyles.iconCrossNarrowBig,
                                  styles.iconStyleCross,
                                  styles.iconDefaultColor
                                )
                              : cs(
                                  iconStyles.icon,
                                  iconStyles.iconSearch,
                                  styles.iconStyle,
                                  styles.iconDefaultColor
                                )
                          }
                        ></i>
                        {mobile || tablet ? "" : <span>Search</span>}
                      </div>
                    </li>
                    <li className={cs(styles.topBagItem, bootstrap.col)}>
                      <i
                        className={cs(
                          iconStyles.icon,
                          iconStyles.iconCart,
                          styles.iconStyle,
                          styles.topBagIconStyle,
                          {
                            [styles.cartGold]: this.props.location.pathname.includes(
                              "/cart"
                            )
                          }
                        )}
                        onClick={(): void => {
                          // this.setShowBag(true);
                          this.props.history.push("/cart");
                          this.onBottomMenuClick("Cart");
                          if (this.state.showMenu) {
                            this.clickToggle();
                          }
                        }}
                      ></i>
                      <span
                        className={cs(styles.topBadge, {
                          [styles.cartGold]: this.props.location.pathname.includes(
                            "/cart"
                          )
                        })}
                        onClick={(): void => {
                          this.props.history.push("/cart");
                          this.onBottomMenuClick("Cart");
                          if (this.state.showMenu) {
                            this.clickToggle();
                          }
                        }}
                      >
                        {bagCount}
                      </span>
                    </li>
                    {/* {this.state.showCartMobile && (
                      <>
                        {tablet && (
                          <li
                            className={cs(styles.mobileSearch, bootstrap.col)}
                          >
                            <div
                              className={cs(
                                styles.iconStyle,
                                styles.innerWishContainer
                              )}
                            >
                              <Link
                                to={isBridalRegistryPage ? "#" : "/wishlist"}
                                onClick={() => {
                                  this.gtmPushWishlistClick();
                                  this.onSideMenuClick("Wishlist");
                                  this.hideSearch();
                                }}
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
                              </Link>
                            </div>
                          </li>
                        )}
                      </>
                    )} */}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className={cs(bootstrap.row)}>
              <div
                id="menu_overlay"
                className={
                  showMenu
                    ? cs(bootstrap.col12, styles.mobileList, styles.menuOverlay)
                    : bootstrap.col12
                }
              >
                {mobile || tablet ? (
                  <div
                    className={
                      showMenu
                        ? styles.menuSliderAnimate
                        : cs(styles.menuSlider, styles.mobileList)
                    }
                  >
                    <Mobilemenu
                      onMobileMenuClick={this.onMenuClick}
                      onHeaderMegaMenuClick={this.onMegaMenuClick}
                      megaMenuData={this.props.megaMenuData}
                      location={this.props.location}
                      clickToggle={this.clickToggle}
                      wishlistCount={wishlistCount}
                      changeCurrency={this.changeCurrency}
                      showCurrency={this.showCurrency}
                      showC={this.state.showC}
                      profileItems={profileItems}
                      loginItem={loginItem}
                      goLogin={this.props.goLogin}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <GrowlMessage />
        <MakerUtils />
        {/* {this.props.currency.toString().toUpperCase() == "INR" &&
          !(
            this.props.location.pathname.includes("/search") ||
            this.props.location.pathname.includes("/catalogue") ||
            isBridalRegistryPage
          ) && (
            <div className={styles.fixedPincodeBar} id="pincode-bar">
              <div>
                <span>
                  Due to the current restrictions on movement, please enter your
                  Pincode to check if your location is serviceable.
                </span>
                <a
                  className={styles.pincodeBarBtn}
                  onClick={() => this.showPincode()}
                >
                  <span className={cs(styles.location)}>
                    <i
                      className={cs(
                        // { [styles.iconClass]: menuOpen },
                        iconStyles.icon,
                        iconStyles.iconLocation,
                        styles.iconStore
                      )}
                    ></i>
                  </span>
                  <span>
                    {this.state.selectedPincode
                      ? this.state.selectedPincode
                      : "Pincode"}
                  </span>
                </a>
              </div>
            </div>
          )} */}
        {(mobile || tablet) && !isBridalRegistryPage && !isCartPage && (
          <BottomMenu
            onBottomMenuClick={this.onBottomMenuClick}
            showBag={this.state.showBag}
            showSearch={this.showSearch}
            isSearch={this.state.showSearch}
            setShowBag={this.setShowBag}
            wishlistCount={wishlistCount}
            showMenu={this.state.showMenu}
            clickToggle={this.clickToggle}
            isLoggedIn={isLoggedIn}
            bagCount={bagCount}
            currency={this.props.currency}
          />
        )}
        {this.props.filler.show && <CushionBag />}

        {this.props.showStock && (
          <StoreDetails
            showShipping={this.props.showShipping}
            cart={this.props.cart}
            currency={this.props.currency}
            active={this.props.showStock}
          />
        )}
        {this.props.showSizeChart && (
          <Sizechart active={this.props.showSizeChart} />
        )}
        {this.state.isLoading && !this.props.isLoader && <Loader />}
        {this.state.showBag && (
          <Bag
            showShipping={this.props.showShipping}
            cart={this.props.cart}
            currency={this.props.currency}
            active={this.state.showBag}
            toggleBag={(): void => {
              this.setState(prevState => {
                return { showBag: !prevState.showBag };
              });
            }}
          />
        )}
      </div>
    );
  }
}

const HeaderRouter = withRouter(Header);
export default connect(mapStateToProps, mapDispatchToProps)(HeaderRouter);
