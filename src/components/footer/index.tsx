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
import fontStyles from "styles/iconFonts.scss";
import * as valid from "utils/validate";
import { Dispatch } from "redux";
import HeaderFooterService from "services/headerFooter";
import { updateShowCookie } from "actions/info";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.footer.data,
    mobile: state.device.mobile,
    isLoggedIn: state.user.email ? true : false,
    saleStatus: false,
    isSale: state.info.isSale,
    showCookie: state.info.showCookie
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    newsletterSignup: async (email: string) => {
      const res = await HeaderFooterService.makeNewsletterSignupRequest(
        dispatch,
        email
      );
      return res;
    },
    hideCookies: () => {
      dispatch(updateShowCookie(false));
    }
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

class Footer extends React.Component<Props, FooterState> {
  observer?: IntersectionObserver;
  container: HTMLDivElement | null = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpened: false,
      currentIndex: -1,
      dropdown: false,
      hideImage: false,
      newsletterEmail: "",
      newsletterMessage: "",
      isInViewport: false
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

  componentDidMount() {
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
  }

  subMenu = (index: number) => {
    if (this.state.currentIndex == index) {
      this.setState({ isOpened: !this.state.isOpened, currentIndex: index });
    } else {
      this.setState({ isOpened: true, currentIndex: index });
    }
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
    if (valid.checkBlank(e.target.value)) {
      this.setState({
        newsletterEmail: e.target.value,
        newsletterMessage: "Please enter your Email ID"
      });
      update = false;
    } else if (!valid.checkMail(e.target.value)) {
      this.setState({
        newsletterEmail: e.target.value,
        newsletterMessage: "Please enter a valid Email ID"
      });
      update = false;
    } else if (e.target.value.length > 75) {
      this.setState({
        newsletterMessage: "You are allowed to enter upto 75 characters only"
      });
      update = false;
    } else {
      this.setState({
        newsletterEmail: e.target.value,
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
      this.props
        .newsletterSignup(emailInput.value)
        .then(data => {
          if (data.status) {
            const msg = valid.showErrors(data.message);
            // this.setState({newsletter_email: ""});
            this.setState({ newsletterMessage: msg });
          } else {
            const msg = valid.showErrors(data.message);
            this.setState({ newsletterMessage: msg });
          }
        })
        .catch(error => {
          if (error.response.data.error_message) {
            let errorMsg = error.response.data.error_message[0];
            if (errorMsg == "MaxRetries") {
              errorMsg =
                "You have exceeded max attempts, please try after some time.";
            }
            this.setState({ newsletterMessage: errorMsg });
          } else {
            const msg = valid.showErrors(error.response.data.message);
            this.setState({ newsletterMessage: msg });
            // console.log(error);
          }
        });
    }
  };

  acceptCookies = () => {
    CookieService.setCookie("goodearth", "show", 365);
    this.props.hideCookies();
  };

  render() {
    const {
      footerImages: {
        footerImageDeskTop,
        footerImageMobile,
        footerImageSubsDeskTop,
        footerImageSubsMobile,
        footerBgColorMobile
      },
      findUsOnData
    } = this.props.data;
    const mobileFooterList: FooterList = [];
    this.props.data.footerList.map(item => {
      mobileFooterList.push(...item);
    });

    return (
      <div
        className={cs(bootstrap.containerFluid, globalStyles.minimumWidth)}
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
                ? `url(${
                    this.props.mobile
                      ? footerImageSubsMobile
                      : footerImageSubsDeskTop
                  })`
                : "none"
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
                >
                  be in the know
                </div>
                <div className={cs(styles.ftrCopyWhiteDesktop)}>
                  By signing up for alerts, you agree to receive e-mails, calls
                  and text messages from Goodearth. To know more how we keep
                  your data safe, refer to our{" "}
                  <Link to="/customer-assistance/privacy-policy">
                    Privacy Policy
                  </Link>
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
                    <div className={cs(globalStyles.errorMsg)}>
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
                                    onClick={() => valid.footerGTM(list.name)}
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
                                        >
                                          {currentValue.iconImage && (
                                            <img
                                              className={
                                                styles.footerConnectIcon
                                              }
                                              src={currentValue.iconImage}
                                            />
                                          )}
                                          {currentValue.link ? (
                                            <Link
                                              to={
                                                currentValue.text.toLowerCase() ==
                                                  "good earth registry" &&
                                                this.props.isLoggedIn
                                                  ? "/account/bridal"
                                                  : currentValue.link
                                              }
                                              onClick={() =>
                                                valid.footerGTM(
                                                  currentValue.text
                                                )
                                              }
                                              key={j}
                                            >
                                              {currentValue.text}
                                            </Link>
                                          ) : currentValue.newTabLink ? (
                                            <a
                                              href={currentValue.newTabLink}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={() =>
                                                valid.footerGTM(
                                                  currentValue.text
                                                )
                                              }
                                              key={j}
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
                    <div className={cs(bootstrap.row, styles.px5)}>
                      <div
                        className={cs(bootstrap.colMd3, bootstrap.px2)}
                        key={"first-column"}
                      >
                        <ul key={0} className={styles.column}>
                          <li key={0}>find us on</li>
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
                                    />
                                  </a>
                                );
                              })}
                          </li>
                        </ul>
                        {this.props.isSale ? (
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
                                  className={cs(styles.imgResponsive)}
                                />{" "}
                              </a>
                            </li>
                          </ul>
                        )}
                      </div>
                      {this.props.data.footerList?.map((footerItems, index) => {
                        let res: any = "";
                        res = (
                          <div
                            key={index}
                            className={cs(
                              bootstrap.colMd3,
                              bootstrap.px2,
                              styles.footerColumn
                            )}
                          >
                            {footerItems.map((item, i) => {
                              return (
                                <ul key={i} className={styles.column}>
                                  <li>
                                    {item.link ? (
                                      <Link
                                        to={item.link || "#"}
                                        onClick={() =>
                                          valid.footerGTM(item.name)
                                        }
                                      >
                                        {item.name}
                                      </Link>
                                    ) : (
                                      item.name
                                    )}
                                  </li>
                                  {item.value.map((child, index) => (
                                    <li key={index}>
                                      {child.iconImage && (
                                        <img
                                          className={styles.footerConnectIcon}
                                          src={child.iconImage}
                                        />
                                      )}
                                      {child.link ? (
                                        item.name == "CONNECT" ? (
                                          <a
                                            className={globalStyles.txtNormal}
                                            href={child.link}
                                            onClick={() =>
                                              valid.footerGTM(child.text)
                                            }
                                          >
                                            {child.text}
                                          </a>
                                        ) : (
                                          <Link
                                            to={
                                              child.text.toLowerCase() ==
                                                "good earth registry" &&
                                              this.props.isLoggedIn
                                                ? "/account/bridal"
                                                : child.link
                                            }
                                            onClick={() =>
                                              valid.footerGTM(child.text)
                                            }
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
                                          onClick={() =>
                                            valid.footerGTM(child.text)
                                          }
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
                            {index == 2 && (
                              <ShopLocator
                                goToShopLocator={this.goToShopLocator}
                                saleStatus={this.props.saleStatus}
                                onChangeText={this.onChangeText}
                                shopLocations={this.props.data.shopLocations}
                              />
                            )}
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
                          className={cs(
                            {
                              [styles.ftrHeadingWhiteSale]: this.props
                                .saleStatus
                            },
                            { [styles.ftrHeadingWhite]: !this.props.saleStatus }
                          )}
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
                                  />
                                </a>
                              );
                            })}
                        </div>
                        {this.props.isSale ? (
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
                                />{" "}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className={cs(bootstrap.col1)} key={4}></div>
                </div>
              )}
            </div>
          </div>

          <div
            className={
              this.props.mobile
                ? cs(styles.footerBottomMobile, bootstrap.colMd12)
                : cs(styles.footerBottom, bootstrap.colMd12)
            }
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
        {this.props.showCookie && (
          <div className={styles.cookieclass}>
            <span
              className={cs(
                styles.closePopup,
                fontStyles.icon,
                fontStyles.iconCross
              )}
              onClick={() => {
                this.props.hideCookies();
              }}
            ></span>
            <h3>COOKIES & PRIVACY</h3>
            <p>
              This website uses cookies to ensure you get the best experience on
              our website. Please read our &nbsp;
              <Link to={"/customer-assistance/cookie-policy"}>
                Cookie Policy
              </Link>
              &nbsp; and{" "}
              <Link to={"/customer-assistance/privacy-policy"}>
                Privacy Policy.
              </Link>
            </p>
            <span className={styles.okBtn} onClick={this.acceptCookies}>
              ACCEPT
            </span>
          </div>
        )}
      </div>
    );
  }
}
const FooterRouter = withRouter(Footer);
export default connect(mapStateToProps, mapDispatchToProps)(FooterRouter);
