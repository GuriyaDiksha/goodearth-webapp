import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { List, FooterList, FooterState } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import { ShopLocator } from "./ShopLocator";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import CookieService from "services/cookie";
import { checkBlank, checkMail, showErrors, footerGTM } from "utils/validate";
import { Dispatch } from "redux";
import HeaderFooterService from "services/headerFooter";
import {
  updateShowCookie,
  updateCookiePrefrence,
  updateOpenCookiePopup
} from "actions/info";
import CookiePolicy from "./CookiePolicy";
import MakerSmartNav from "containers/base/MakerSmartNav";
import ReactHtmlParser from "react-html-parser";
import { OLD_COOKIE_SETTINGS } from "constants/cookieConsent";
import EarthLogo from "./../../icons/earth.svg";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import NewsletterModal from "./NewsletterModal";
import Newsletter from "./Newsletter";
import { isAEDDisabled } from "typings/currency";
import LoginService from "services/login";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.footer.data,
    mobile: state.device.mobile,
    isLoggedIn: state.user.email ? true : false,
    saleStatus: false,
    isSale: state.info.isSale,
    showCookie: state.info.showCookie,
    mobileMenuOpenState: state.header.mobileMenuOpenState,
    currency: state.currency,
    showCookiePref: state.info.showCookiePref,
    openCookiePopup: state.info.openCookiePopup,
    country: state.widget.country
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    newsletterSignup: async (formData: any) => {
      const res = await HeaderFooterService.makeNewsletterSignupRequest(
        dispatch,
        formData
      );
      return res;
    },
    hideCookies: () => {
      dispatch(updateShowCookie(false));
    },
    showCookiePrefs: () => {
      dispatch(updateCookiePrefrence(false));
    },
    closePopup: () => {
      dispatch(updateOpenCookiePopup(false));
    },
    openPoup: (mobile: boolean) => {
      dispatch(
        updateComponent(
          POPUP.COUNTRYPOPUP,
          { initSection: 2 },
          mobile ? false : true
        )
      );
      dispatch(updateModal(true));
    },
    getClientIpCurrency: () => {
      LoginService.getClientIpCurrency(dispatch);
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class Footer extends React.Component<Props, FooterState> {
  observer?: IntersectionObserver;
  container: HTMLDivElement | null = null;
  private interval: number | undefined;
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpened: false,
      currentIndex: -1,
      dropdown: false,
      hideImage: false,
      newsletterEmail: "",
      newsletterMessage: "",
      newsletterError: false,
      isInViewport: false,
      isConsentSave: false,
      headingHoverArray: [],
      subheadingHoverArray: [],
      smartNav: ["/", "/homepage"],
      country: "",
      showPopUp: false,
      isPromoPopupVisible: false
    };
  }

  handleScroll = () => {
    if (this.state.hideImage == true) {
      this.setState({
        hideImage: false
      });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    // Cleanup the interval when component unmounts
    clearInterval(this.interval);
  }

  onFooterInViewport: IntersectionObserverCallback = entries => {
    if (entries.length) {
      if (entries[0].isIntersecting) {
        this.setState({
          isInViewport: true
        });
      }
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.location.pathname != nextProps.location.pathname) {
      this.setState(
        {
          newsletterEmail: "",
          newsletterMessage: ""
        },
        () => {
          const news = document.getElementById(
            "newsletter"
          ) as HTMLInputElement;
          news.value = "";
        }
      );
    }
  }

  //Utility function For Heading Fonts
  indexOfHeading(i: number, j: number) {
    let temp = 0;
    for (let k = 0; k < i; k++) {
      temp += this.props.data.footerList[k].length;
    }
    return temp + j;
  }

  indexOfSubHeading(i: number, j: number, k: number) {
    let subHeadingLength = 0;
    for (let I = 0; I < i; I++) {
      for (let J = 0; J < this.props.data.footerList[I].length; J++) {
        subHeadingLength += this.props.data.footerList[I][J].value.length;
      }
    }
    for (let J = 0; J < j; J++) {
      subHeadingLength += this.props.data.footerList[i][J].value.length;
    }
    return subHeadingLength + k;
  }

  componentDidMount() {
    console.log("country===", this.props.country, this.state.country);
    let headingLength = 0;
    let subHeadingLength = 0;
    this.props.data.footerList.map(e => {
      headingLength += e.length;
      e.map(ele => {
        subHeadingLength += ele.value.length;
      });
    });
    this.setState({
      headingHoverArray: new Array<boolean>(headingLength),
      subheadingHoverArray: new Array<boolean>(subHeadingLength)
    });

    if (!window.IntersectionObserver) {
      this.setState({
        isInViewport: true
      });
    } else {
      if (this.container) {
        this.observer = new IntersectionObserver(this.onFooterInViewport);
        this.observer.observe(this.container);
      }
    }
    this.setState({
      isConsentSave: CookieService.getCookie("consent") !== "",
      // country: CookieService.getCookie("country"),
      country:
        isAEDDisabled &&
        CookieService.getCookie("country").toLowerCase() ===
          "united arab emirates" &&
        CookieService.getCookie("countryCode") == "AE"
          ? "United States"
          : CookieService.getCookie("country")
    });
    this.checkPopupVisibility();
    // Optional: Check visibility every minute
    this.interval = window.setInterval(this.checkPopupVisibility, 60000);

    setTimeout(() => {
      if (
        isAEDDisabled &&
        this.state?.country?.toLowerCase() === "united arab emirates"
      ) {
        this.props.getClientIpCurrency();
      }
    }, 1000);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<FooterState>,
    snapshot?: any
  ): void {
    if (prevProps.data.footerList != this.props.data.footerList) {
      let headingLength = 0;
      let subHeadingLength = 0;
      this.props.data.footerList.map(e => {
        headingLength += e.length;
        e.map(ele => {
          subHeadingLength += ele.value.length;
        });
      });
      this.setState({
        headingHoverArray: new Array<boolean>(headingLength),
        subheadingHoverArray: new Array<boolean>(subHeadingLength)
      });
    }
  }

  subMenu = (index: number) => {
    if (this.state.currentIndex == index) {
      this.setState({ isOpened: !this.state.isOpened, currentIndex: index });
    } else {
      this.setState({ isOpened: true, currentIndex: index });
    }
  };

  setConsent = (isHide: boolean) => {
    this.setState({
      isConsentSave: isHide
        ? !isHide
        : CookieService.getCookie("consent") !== ""
    });
  };

  showDropdown(value: boolean) {
    this.setState({
      dropdown: value
    });
  }

  goToShopLocator = (
    e: React.MouseEvent,
    data: { label: string; value: string } | null
  ) => {
    const city = data ? (data.value ? data.value : "Delhi") : "Delhi";
    if (e.metaKey || e.ctrlKey) {
      // do nothing
    } else {
      // location.href = "/Cafe-Shop/" + city;
      this.props.history.push(`/Cafe-Shop/${city}`);
      e.preventDefault();
    }
  };

  onChangeText(event: React.KeyboardEvent) {
    // on change text
  }

  SetNewsletterEmail = (e: React.KeyboardEvent) => {
    if (this.myBlur(e) && e.keyCode == 13) {
      this.makeNewsletterSignupRequest();
    }
  };

  myBlur = (e: any) => {
    let update = true;
    if (checkBlank(e.target.value)) {
      this.setState({
        newsletterEmail: e.target.value,
        newsletterError: true,
        newsletterMessage: "Please enter your Email ID"
      });
      update = false;
    } else if (!checkMail(e.target.value)) {
      this.setState({
        newsletterEmail: e.target.value,
        newsletterError: true,
        newsletterMessage: "Please enter a valid Email ID"
      });
      update = false;
    } else if (e.target.value.length > 75) {
      this.setState({
        newsletterError: true,
        newsletterMessage: "You are allowed to enter upto 75 characters only"
      });
      update = false;
    } else {
      this.setState({
        newsletterEmail: e.target.value,
        newsletterError: false,
        newsletterMessage: ""
      });
    }

    return update;
  };

  makeNewsletterSignupRequest = () => {
    if (!this.myBlur({ target: { value: this.state.newsletterEmail } }))
      return false;
    const emailInput = document.getElementById(
      "newsletter"
    ) as HTMLInputElement;
    if (emailInput) {
      const SignUpformData = new FormData();
      SignUpformData.append("email", emailInput.value);
      SignUpformData.append("source", "Footer");
      this.props
        .newsletterSignup(SignUpformData)
        .then(data => {
          if (data.status) {
            const msg = showErrors(data.message);
            // this.setState({newsletter_email: ""});
            this.setState({ newsletterError: false, newsletterMessage: msg });
            console.log(data.status, msg);
            this.setState(prevState => ({
              showPopUp: !prevState.showPopUp
            }));
          } else {
            const msg = showErrors(data.message);
            this.setState({ newsletterError: false, newsletterMessage: msg });
          }
        })
        .catch(error => {
          if (error.response.data.error_message) {
            let errorMsg = error.response.data.error_message[0];
            if (errorMsg == "MaxRetries") {
              errorMsg =
                "You have exceeded max attempts, please try after some time.";
            }
            this.setState({
              newsletterError: true,
              newsletterMessage: errorMsg
            });
          } else {
            const msg = showErrors(error.response.data.message);
            this.setState({ newsletterError: true, newsletterMessage: msg });
          }
        });
    }
  };

  acceptCookies = () => {
    //CookieService.setCookie("goodearth", "show", 365);
    this.props.hideCookies();
    this.props.closePopup();
  };

  openCountryPopup = () => {
    this.props.openPoup(this.props.mobile);
  };

  checkPopupVisibility = () => {
    const now = new Date();
    const startDate = new Date("2025-01-14T09:00:00"); // 14th Jan, 9 AM
    const endDate = new Date("2025-01-23T10:00:00"); // 23th Jan, 10 Am

    // Convert current date (now) to UTC
    const nowUtc = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    );

    // Convert startDate to UTC
    const startDateUtc = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate(),
        startDate.getUTCHours(),
        startDate.getUTCMinutes(),
        startDate.getUTCSeconds()
      )
    );

    // Convert endDate to UTC
    const endDateUtc = new Date(
      Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate(),
        endDate.getUTCHours(),
        endDate.getUTCMinutes(),
        endDate.getUTCSeconds()
      )
    );

    // Check if the current date and time is between 14th Jan, 9 AM and 21th Jan, 10 Am
    if (nowUtc >= startDateUtc && nowUtc <= endDateUtc) {
      this.setState({ isPromoPopupVisible: false }); // Hide popup during the specified date range
    } else {
      this.setState({ isPromoPopupVisible: true }); // Show popup outside the specified date range
    }
  };

  render() {
    const desktopPlp =
      this.props.location.pathname.includes("/catalogue/category/") &&
      !this.props.mobile;
    const {
      footerImages: {
        footerImageDeskTop,
        footerImageMobile,
        // footerImageSubsDeskTop,
        // footerImageSubsMobile,
        footerBgColorMobile,
        footerHeadingFontColor,
        footerSubHeadingFontColor,
        footerHeadingHoverColor,
        footerSubHeadingHoverColor,
        sectionContent,
        sectionFontColor,
        newsletterBgImage,
        newsletterBgColor
      },
      findUsOnData
    } = this.props.data;
    const mobileFooterList: FooterList = [];
    this.props.data.footerList.map(item => {
      mobileFooterList.push(...item);
    });
    const cookiCheck =
      this.props.location.pathname !== "/customer-assistance/cookie-policy" &&
      this.props.location.pathname !== "/customer-assistance/privacy-policy" &&
      this.props.showCookie &&
      !this.props.mobileMenuOpenState;

    return (
      <div
        className={cs(
          bootstrap.containerFluid,
          globalStyles.minimumWidth,
          styles.mainFooterContainer
        )}
        ref={ele => (this.container = ele)}
      >
        <div id="footer-start" className={bootstrap.row}>
          <div
            className={`${
              this.state.hideImage
                ? ""
                : cs(styles.footerTop, bootstrap.colMd12, bootstrap.py4, {
                    [styles.footerTopBackground]: this.state.isInViewport
                  })
            } ${this.props.saleStatus ? cs(styles.footerTopSale20) : ""}`}
            style={{
              backgroundImage: this.state.isInViewport
                ? `url(${newsletterBgImage})`
                : "none",
              backgroundColor: `${newsletterBgColor}`
            }}
          >
            <div className={bootstrap.row}>
              <div className={cs(bootstrap.col1, bootstrap.colMd3)}></div>
              <div className={cs(bootstrap.col10, bootstrap.colMd6)}>
                <div
                  className={cs(
                    styles.ftrHeadingWhite,
                    styles.ftrHeadingWhite2
                  )}
                  style={{ color: footerHeadingFontColor }}
                >
                  be in the know
                </div>
                <div className={cs(styles.ftrCopyWhiteDesktop)}>
                  {ReactHtmlParser(sectionContent)}
                </div>
                <div
                  className={cs(
                    globalStyles.voffset3,
                    bootstrap.colMd6,
                    bootstrap.offsetMd3
                  )}
                >
                  <div className={cs(styles.formFooter)}>
                    <input
                      type="text"
                      className={cs(styles.backgroundWhite)}
                      placeholder="enter email address"
                      autoComplete="new-password"
                      id="newsletter"
                      onKeyUp={this.SetNewsletterEmail}
                    />
                    <div
                      className={cs(styles.arrowRight)}
                      onClick={() => this.makeNewsletterSignupRequest()}
                    ></div>
                  </div>
                  <div className={cs(globalStyles.voffset1)}>
                    <div
                      className={cs(
                        { [styles.errorMsg]: this.state.newsletterError },
                        {
                          [styles.subscribeSuccess]: !this.state.newsletterError
                        }
                      )}
                      style={{
                        color: sectionFontColor
                      }}
                    >
                      {this.state.newsletterMessage}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className={cs(bootstrap.col1, bootstrap.colMd3)}></div>
            </div>
          </div>
          <div
            className={`${
              this.state.hideImage
                ? ""
                : cs(styles.footer, bootstrap.colMd12, {
                    [styles.footerBackground]: this.state.isInViewport
                  })
            } ${this.props.saleStatus ? cs(styles.footerSale20) : ""}`}
            style={{
              backgroundImage: this.state.isInViewport
                ? `url(${
                    this.props.mobile ? footerImageMobile : footerImageDeskTop
                  })`
                : "none",
              backgroundColor: `${footerBgColorMobile}`
            }}
          >
            <div>
              <div className={cs(bootstrap.row)}>
                {this.props.mobile ? (
                  <div className={cs(bootstrap.col12)}>
                    <div className={bootstrap.row}>
                      <div className={cs(bootstrap.col10, bootstrap.offset1)}>
                        <ul
                          className={
                            this.props.saleStatus
                              ? cs(styles.mainMenuFooterSale)
                              : cs(styles.mainMenuFooter)
                          }
                        >
                          {mobileFooterList?.map((list, i: number) => {
                            // console.log("########### LIST:", list);
                            return (
                              <li key={i}>
                                {list.value.length > 0 ? (
                                  <span
                                    className={`${
                                      this.state.isOpened &&
                                      this.state.currentIndex == i
                                        ? cs(styles.detailShow)
                                        : cs(styles.detail)
                                    } ${
                                      this.props.saleStatus
                                        ? cs(styles.cerise)
                                        : ""
                                    }`}
                                    onClick={() => {
                                      this.subMenu(i);
                                    }}
                                    style={{
                                      color: footerHeadingFontColor
                                    }}
                                  >
                                    {" "}
                                    {list.name}{" "}
                                  </span>
                                ) : (
                                  <Link
                                    to={list.link || "#"}
                                    className={
                                      this.props.saleStatus
                                        ? cs(styles.cerise)
                                        : ""
                                    }
                                    target={list.openInNewTab ? "_blank" : ""}
                                    rel={
                                      list.openInNewTab
                                        ? "noopener noreferrer"
                                        : ""
                                    }
                                    style={{
                                      color: footerHeadingFontColor
                                    }}
                                    onClick={() => {
                                      if (
                                        this.props.location.pathname ==
                                        list.link
                                      ) {
                                        window.scrollTo(0, 0);
                                      }
                                      footerGTM(list.name);
                                    }}
                                  >
                                    {list.name}
                                  </Link>
                                )}
                                <ul
                                  className={
                                    this.state.isOpened &&
                                    this.state.currentIndex == i
                                      ? ""
                                      : cs(globalStyles.hidden)
                                  }
                                  key={i}
                                >
                                  {list.value.map(
                                    (currentValue: List, j: number) => {
                                      if (this.props.saleStatus == true) {
                                        return false;
                                      }
                                      return (
                                        <li
                                          className={cs(
                                            globalStyles.txtNormal,
                                            {
                                              [globalStyles.voffset2]:
                                                j == 2 &&
                                                list.name.toLowerCase() ==
                                                  "connect"
                                            }
                                          )}
                                          key={j}
                                          style={{
                                            color: footerSubHeadingFontColor
                                          }}
                                        >
                                          {currentValue.iconImage && (
                                            <img
                                              className={
                                                styles.footerConnectIcon
                                              }
                                              src={currentValue.iconImage}
                                              width="200"
                                            />
                                          )}
                                          {currentValue.link ? (
                                            currentValue.text.toLowerCase() ==
                                              "good earth registry" &&
                                            this.props.isLoggedIn ? (
                                              <Link
                                                to={"/the-good-earth-registry"}
                                                onClick={() => {
                                                  if (
                                                    this.props.location
                                                      .pathname == list.link ||
                                                    currentValue.text.toLowerCase() ==
                                                      "good earth registry"
                                                  ) {
                                                    window.scrollTo(0, 0);
                                                  }
                                                  footerGTM(
                                                    currentValue.text,
                                                    this.props.isLoggedIn,
                                                    `${window?.location?.origin}/the-good-earth-registry`
                                                  );
                                                }}
                                                key={j}
                                                style={{
                                                  color: footerSubHeadingFontColor
                                                }}
                                              >
                                                {currentValue.text}
                                              </Link>
                                            ) : (
                                              <a
                                                href={currentValue.link}
                                                onClick={() => {
                                                  if (
                                                    this.props.location
                                                      .pathname == list.link ||
                                                    currentValue.text.toLowerCase() ==
                                                      "good earth registry"
                                                  ) {
                                                    window.scrollTo(0, 0);
                                                  }
                                                  footerGTM(
                                                    currentValue.text,
                                                    this.props.isLoggedIn,
                                                    `${currentValue.link}`
                                                  );
                                                }}
                                                key={j}
                                                style={{
                                                  color: footerSubHeadingFontColor
                                                }}
                                              >
                                                {currentValue.text}
                                              </a>
                                            )
                                          ) : currentValue.newTabLink ? (
                                            <a
                                              href={currentValue.newTabLink}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={() =>
                                                footerGTM(currentValue.text)
                                              }
                                              key={j}
                                              style={{
                                                color: footerSubHeadingFontColor
                                              }}
                                            >
                                              {currentValue.text}
                                            </a>
                                          ) : (
                                            currentValue.text
                                          )}{" "}
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {this.props.mobile ? (
                  ""
                ) : (
                  <div
                    className={
                      this.props.saleStatus
                        ? cs(
                            globalStyles.voffset5,
                            styles.mainMenuFooterSale,
                            bootstrap.colMd12
                          )
                        : cs(
                            globalStyles.voffset5,
                            styles.mainMenuFooter,
                            bootstrap.colMd12
                          )
                    }
                  >
                    <div
                      className={cs(
                        bootstrap.row,
                        styles.px3,
                        styles.footerColumnsContainer
                      )}
                    >
                      <div
                        className={cs(bootstrap.colMd3, bootstrap.px2)}
                        key={"first-column"}
                      >
                        <ul key={0} className={styles.column}>
                          <li
                            key={0}
                            style={{
                              color: footerHeadingFontColor
                            }}
                          >
                            find us on
                          </li>
                          <li className={cs(styles.footerSocialicons)} key={1}>
                            {findUsOnData &&
                              findUsOnData.map(({ link, iconImage }, index) => {
                                return (
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={index}
                                  >
                                    <img
                                      src={iconImage}
                                      className={styles.findUsOnIcon}
                                      width="200"
                                    />
                                  </a>
                                );
                              })}
                          </li>
                        </ul>
                        <div className={styles.countryWrp}>
                          <img
                            src={EarthLogo}
                            alt={"earth"}
                            width={20}
                            onClick={this.openCountryPopup}
                          />
                          <p
                            style={{
                              color: footerHeadingFontColor
                            }}
                            onClick={this.openCountryPopup}
                            className={styles.country}
                          >
                            {this.props.country || this.state?.country}
                          </p>
                        </div>
                        <ShopLocator
                          goToShopLocator={this.goToShopLocator}
                          saleStatus={this.props.saleStatus}
                          onChangeText={this.onChangeText}
                          shopLocations={this.props.data.shopLocations}
                          mobile={this.props.mobile}
                          footerHeadingFontColor={footerHeadingFontColor}
                          footerHeadingHoverColor={footerHeadingHoverColor}
                        />
                        {this.props.isSale ||
                        !this.props.data.footerPlaylistData?.ctaText ? (
                          ""
                        ) : (
                          <ul
                            className={cs(styles.footerPlaylist, styles.column)}
                            key={1}
                          >
                            <li>
                              {" "}
                              {this.props.data.footerPlaylistData?.ctaText}
                            </li>
                            <li>
                              <a
                                href={
                                  this.props.data.footerPlaylistData?.ctaUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {" "}
                                <img
                                  alt="goodearth-playlist-icon"
                                  src={
                                    this.state.isInViewport
                                      ? this.props.data.footerPlaylistData
                                          ?.ctaImage
                                      : ""
                                  }
                                  width="200"
                                  className={cs(styles.imgResponsive)}
                                />{" "}
                              </a>
                            </li>
                          </ul>
                        )}
                      </div>
                      {this.props.data.footerList?.map((footerItems, i) => {
                        let res: any = "";
                        res = (
                          <div
                            key={i}
                            className={cs(
                              i == 3 ? bootstrap.colMd3 : bootstrap.colMd2,
                              bootstrap.px2,
                              styles.footerColumn
                            )}
                          >
                            {footerItems.map((item, j) => {
                              return (
                                <ul key={j} className={styles.column}>
                                  <li
                                    style={{
                                      color:
                                        this.state.headingHoverArray[
                                          this.indexOfHeading(i, j)
                                        ] && item.link
                                          ? footerHeadingHoverColor
                                          : footerHeadingFontColor
                                    }}
                                    onMouseEnter={() => {
                                      const items = [
                                        ...this.state.headingHoverArray
                                      ].fill(false);

                                      items[this.indexOfHeading(i, j)] = true;
                                      this.setState({
                                        headingHoverArray: items
                                      });
                                    }}
                                    onMouseLeave={() => {
                                      const items = [
                                        ...this.state.headingHoverArray
                                      ];
                                      items[this.indexOfHeading(i, j)] = false;
                                      this.setState({
                                        headingHoverArray: items
                                      });
                                    }}
                                  >
                                    {item.link ? (
                                      <Link
                                        to={item.link || "#"}
                                        target={
                                          item.openInNewTab ? "_blank" : ""
                                        }
                                        rel={
                                          item.openInNewTab
                                            ? "noopener noreferrer"
                                            : ""
                                        }
                                        onClick={() => {
                                          if (
                                            this.props.location.pathname ==
                                            item.link
                                          ) {
                                            window.scrollTo(0, 0);
                                          }
                                          footerGTM(item.name);
                                        }}
                                        style={{
                                          color:
                                            this.state.headingHoverArray[
                                              this.indexOfHeading(i, j)
                                            ] && item.link
                                              ? footerHeadingHoverColor
                                              : footerHeadingFontColor
                                        }}
                                        onMouseEnter={() => {
                                          const items = [
                                            ...this.state.headingHoverArray
                                          ].fill(false);

                                          items[
                                            this.indexOfHeading(i, j)
                                          ] = true;
                                          this.setState({
                                            headingHoverArray: items
                                          });
                                        }}
                                        onMouseLeave={() => {
                                          const items = [
                                            ...this.state.headingHoverArray
                                          ].fill(false);
                                          items[
                                            this.indexOfHeading(i, j)
                                          ] = false;
                                          this.setState({
                                            headingHoverArray: items
                                          });
                                        }}
                                      >
                                        {item.name}
                                      </Link>
                                    ) : (
                                      item.name
                                    )}
                                  </li>
                                  {item.value.map((child, k) => (
                                    <li
                                      key={k}
                                      style={{
                                        color:
                                          this.state.subheadingHoverArray[
                                            this.indexOfSubHeading(i, j, k)
                                          ] && child.link
                                            ? footerSubHeadingHoverColor
                                            : footerSubHeadingFontColor
                                      }}
                                      onMouseEnter={() => {
                                        const items = [
                                          ...this.state.subheadingHoverArray
                                        ].fill(false);

                                        items[
                                          this.indexOfSubHeading(i, j, k)
                                        ] = true;
                                        this.setState({
                                          subheadingHoverArray: items
                                        });
                                      }}
                                      onMouseLeave={() => {
                                        const items = [
                                          ...this.state.subheadingHoverArray
                                        ].fill(false);

                                        items[
                                          this.indexOfSubHeading(i, j, k)
                                        ] = false;
                                        this.setState({
                                          subheadingHoverArray: items
                                        });
                                      }}
                                    >
                                      {child.iconImage && (
                                        <img
                                          className={styles.footerConnectIcon}
                                          src={child.iconImage}
                                          width="200"
                                        />
                                      )}
                                      {child.link ? (
                                        item.name == "CONNECT" ? (
                                          <a
                                            className={globalStyles.txtNormal}
                                            href={child.link}
                                            style={{
                                              color:
                                                this.state.subheadingHoverArray[
                                                  this.indexOfSubHeading(
                                                    i,
                                                    j,
                                                    k
                                                  )
                                                ] && child.link
                                                  ? footerSubHeadingHoverColor
                                                  : footerSubHeadingFontColor
                                            }}
                                            onMouseEnter={() => {
                                              const items = [
                                                ...this.state
                                                  .subheadingHoverArray
                                              ].fill(false);

                                              items[
                                                this.indexOfSubHeading(i, j, k)
                                              ] = true;
                                              this.setState({
                                                subheadingHoverArray: items
                                              });
                                            }}
                                            onMouseLeave={() => {
                                              const items = this.state
                                                .subheadingHoverArray;
                                              items[
                                                this.indexOfSubHeading(i, j, k)
                                              ] = false;
                                              this.setState({
                                                subheadingHoverArray: items
                                              });
                                            }}
                                            onClick={() => {
                                              if (
                                                this.props.location.pathname ==
                                                child.link
                                              ) {
                                                window.scrollTo(0, 0);
                                              }
                                              footerGTM(child.text);
                                            }}
                                          >
                                            {child.text}
                                          </a>
                                        ) : (
                                          <Link
                                            to={
                                              child.text.toLowerCase() ==
                                                "good earth registry" &&
                                              this.props.isLoggedIn
                                                ? "/the-good-earth-registry"
                                                : child.link
                                            }
                                            onClick={() => {
                                              if (
                                                this.props.location.pathname ==
                                                  child.link ||
                                                child.text.toLowerCase() ==
                                                  "good earth registry"
                                              ) {
                                                window.scrollTo(0, 0);
                                              }

                                              footerGTM(
                                                child.text,
                                                this.props.isLoggedIn,
                                                `${window?.location?.origin}/the-good-earth-registry`
                                              );
                                            }}
                                            style={{
                                              color: this.state
                                                .subheadingHoverArray[
                                                this.indexOfSubHeading(i, j, k)
                                              ]
                                                ? footerSubHeadingHoverColor
                                                : footerSubHeadingFontColor
                                            }}
                                            onMouseEnter={() => {
                                              const items = [
                                                ...this.state
                                                  .subheadingHoverArray
                                              ].fill(false);

                                              items[
                                                this.indexOfSubHeading(i, j, k)
                                              ] = true;

                                              this.setState({
                                                subheadingHoverArray: items
                                              });
                                            }}
                                            onMouseLeave={() => {
                                              const items = [
                                                ...this.state
                                                  .subheadingHoverArray
                                              ].fill(false);

                                              items[
                                                this.indexOfSubHeading(i, j, k)
                                              ] = false;

                                              this.setState({
                                                subheadingHoverArray: items
                                              });
                                            }}
                                          >
                                            {child.text}
                                          </Link>
                                        )
                                      ) : child.newTabLink ? (
                                        <a
                                          className={globalStyles.txtNormal}
                                          href={child.newTabLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={() => footerGTM(child.text)}
                                          style={{
                                            color: this.state
                                              .subheadingHoverArray[
                                              this.indexOfSubHeading(i, j, k)
                                            ]
                                              ? footerSubHeadingHoverColor
                                              : footerSubHeadingFontColor
                                          }}
                                          onMouseEnter={() => {
                                            const items = [
                                              ...this.state.subheadingHoverArray
                                            ].fill(false);

                                            items[
                                              this.indexOfSubHeading(i, j, k)
                                            ] = true;

                                            this.setState({
                                              subheadingHoverArray: items
                                            });
                                          }}
                                          onMouseLeave={() => {
                                            const items = this.state
                                              .subheadingHoverArray;
                                            items[
                                              this.indexOfSubHeading(i, j, k)
                                            ] = false;
                                            this.setState({
                                              subheadingHoverArray: items
                                            });
                                          }}
                                        >
                                          {child.text}
                                        </a>
                                      ) : (
                                        child.text
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              );
                            })}
                          </div>
                        );
                        return res;
                      })}
                    </div>
                  </div>
                )}
              </div>
              {this.props.mobile && (
                <div className={cs(bootstrap.row)} key={1}>
                  <div className={cs(bootstrap.col1)} key={2}></div>
                  <div className={cs(bootstrap.col10)} key={3}>
                    <ShopLocator
                      goToShopLocator={this.goToShopLocator}
                      saleStatus={this.props.saleStatus}
                      onChangeText={this.onChangeText}
                      shopLocations={this.props.data.shopLocations}
                      mobile={this.props.mobile}
                      footerHeadingFontColor={footerHeadingFontColor}
                      footerHeadingHoverColor={footerHeadingHoverColor}
                    />
                    {this.props.mobile ? (
                      <div
                        className={cs(
                          {
                            [styles.footerSocialiconsSale]: this.props
                              .saleStatus
                          },
                          { [styles.footerSocialicons]: !this.props.saleStatus }
                        )}
                      >
                        <div
                          className={cs(styles.mobileFindUsOn)}
                          style={{
                            color: footerHeadingFontColor
                          }}
                        >
                          find us on
                        </div>
                        <div
                          className={cs(
                            styles.ftrHeadingWhite,
                            styles.negMargin
                          )}
                        >
                          {findUsOnData &&
                            findUsOnData.map(({ link, iconImage }, index) => {
                              return (
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  key={index}
                                >
                                  <img
                                    src={iconImage}
                                    className={styles.findUsOnIcon}
                                    width="200"
                                  />
                                </a>
                              );
                            })}
                        </div>
                        {this.props.isSale ||
                        !this.props.data.footerPlaylistData?.ctaText ? (
                          ""
                        ) : (
                          <div>
                            <div
                              className={
                                this.props.saleStatus
                                  ? cs(styles.ftrHeading80blkSale)
                                  : cs(styles.ftrHeadingWhite)
                              }
                            >
                              {" "}
                              {this.props.data.footerPlaylistData?.ctaText}
                            </div>
                            <div className={cs(styles.textCenter)}>
                              <a
                                href={
                                  this.props.data.footerPlaylistData?.ctaUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {" "}
                                <img
                                  src={
                                    this.props.data.footerPlaylistData?.ctaImage
                                  }
                                  className={cs(globalStyles.width250)}
                                  width="200"
                                />{" "}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className={styles.countryWrp}>
                      <img
                        src={EarthLogo}
                        alt={"earth"}
                        width={20}
                        onClick={this.openCountryPopup}
                      />
                      <p
                        style={{
                          color: footerHeadingFontColor
                        }}
                        onClick={this.openCountryPopup}
                        className={styles.country}
                      >
                        {this.props.country || this.state?.country}
                      </p>
                    </div>
                  </div>

                  <div className={cs(bootstrap.col1)} key={4}></div>
                </div>
              )}
            </div>
          </div>

          <div
            className={cs(
              this.props.mobile
                ? cs(styles.footerBottomMobile, bootstrap.colMd12)
                : cs(styles.footerBottom, bootstrap.colMd12),
              {
                [styles.filterOnBottom]: this.props.location.pathname.includes(
                  "/careers/list"
                )
                // Product team has decided to temporarily remove the smart nav
                // [styles.paddingBottom]:
                //   (this.state.smartNav.indexOf(this.props.location.pathname) >
                //     -1 ||
                //     this.props.location.pathname.includes(
                //       "/category_landing/"
                //     ) ||
                //     desktopPlp) &&
                //   ["INR", "USD"].includes(this.props.currency)
              }
            )}
          >
            <div className={cs(bootstrap.row)}>
              <div className={cs(bootstrap.col12, globalStyles.textCenter)}>
                All rights reserved | &copy;{" "}
                {new Date().getFullYear().toString()} Goodearth Design Studio
                Private Limited
              </div>
            </div>
          </div>
        </div>

        {/* Product team has decided to temporarily remove the smart nav */}
        {/* {(this.state.smartNav.indexOf(this.props.location.pathname) > -1 ||
          this.props.location.pathname.includes("/category_landing/") ||
          desktopPlp) &&
          ["INR", "USD"].includes(this.props.currency) && (
            <MakerSmartNav
              id="TDEHYqQNA"
              inline={false}
              currency={this.props.currency == "INR" ? "INR" : "USD"}
            />
          )} */}
        {(OLD_COOKIE_SETTINGS
          ? cookiCheck && this.props.openCookiePopup
          : ((cookiCheck && !this.state.isConsentSave) ||
              this.props?.showCookiePref) &&
            this.props.openCookiePopup) && (
          // || !this.state.isConsentSave)
          <CookiePolicy
            hideCookies={this.props.hideCookies}
            acceptCookies={this.acceptCookies}
            setConsent={this.setConsent}
            showCookiePref={this.props?.showCookiePref}
            showCookiePrefs={this.props?.showCookiePrefs}
          />
        )}
        {/* DO NOT REMOVE THIS CODE : Commented this code as per product requirement  css for both NewsletterModal and Newsletter are written separately depend upon requirement you can uncomment*/}
        {/* {!(OLD_COOKIE_SETTINGS
          ? cookiCheck
          : (cookiCheck && !this.state.isConsentSave) ||
            this.props?.showCookiePref) && (
          <NewsletterModal
            title={"Find Out First!"}
            subTitle={
              "Be the first to know about new launches and the latest updates from the brand, delivered straight to your inbox!"
            }
          />)} */}

        {/* DO NOT REMOVE THIS CODE : Commented this code as per product requirement  */}
        {this.state.isPromoPopupVisible &&
          !(OLD_COOKIE_SETTINGS
            ? cookiCheck
            : (cookiCheck && !this.state.isConsentSave) ||
              this.props?.showCookiePref) && (
            <Newsletter
              title={"Sign up and save 10%"}
              subTitle={
                "Ideas on style, design, and entertaining await you, along with a sweet discount on your first purchase."
              }
            />
          )}
      </div>
    );
  }
}
const FooterRouter = withRouter(Footer);
export default connect(mapStateToProps, mapDispatchToProps)(FooterRouter);
