import React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { List, FooterList, FooterState } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../styles/iconFonts.scss";
import { ShopLocator } from "./ShopLocator";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import CookieService from "services/cookie";
import fontStyles from "styles/iconFonts.scss";
import * as valid from "utils/validate";
import { Dispatch } from "redux";
import HeaderFooterService from "services/headerFooter";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.footer.data,
    mobile: state.device.mobile,
    isLoggedIn: state.user.email ? true : false,
    saleStatus: false
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
      showCookie: false,
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
  componentDidMount() {
    const cookie = CookieService.getCookie("goodearth");
    if (cookie != "show") {
      this.setState({
        showCookie: true
      });
    }

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
        newsletterMessage: "Please enter email"
      });
      update = false;
    } else if (!valid.checkMail(e.target.value)) {
      this.setState({
        newsletterEmail: e.target.value,
        newsletterMessage: "Enter valid email"
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
          const msg = valid.showErrors(error.response.data.message);
          this.setState({ newsletterMessage: msg });
          // console.log(error);
        });
    }
  };

  acceptCookies = () => {
    CookieService.setCookie("goodearth", "show", 365);
    // document.cookie = cookieString;
    this.setState({
      showCookie: false
    });
  };

  render() {
    const {
      footerImageDeskTop,
      footerImageMobile,
      footerImageSubsDeskTop,
      footerImageSubsMobile,
      footerBgColorMobile
    } = this.props.data.footerImages;
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
              backgroundImage: `url(${
                this.props.mobile
                  ? footerImageSubsMobile
                  : footerImageSubsDeskTop
              })`
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
              backgroundImage: `url(${
                this.props.mobile ? footerImageMobile : footerImageDeskTop
              })`,
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
                          {this.props.data.footerList?.map(
                            (list: FooterList, i: number) => {
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
                                  >
                                    {list.value.map(
                                      (currentValue: List, j: number) => {
                                        if (this.props.saleStatus == true) {
                                          return false;
                                        }
                                        if (
                                          list.name == "HELP" ||
                                          list.name == "SERVICES"
                                        ) {
                                          return (
                                            <li key={j}>
                                              {/* {currentValue.text.toLowerCase() ==
                                            "good earth registry" ? (
                                              <a
                                                href={currentValue.link}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                              >
                                                {currentValue.text}
                                              </a>
                                            ) : ( */}
                                              <Link
                                                to={
                                                  currentValue.text.toLowerCase() ==
                                                    "good earth registry" &&
                                                  this.props.isLoggedIn
                                                    ? "/account/bridal"
                                                    : currentValue.link
                                                }
                                                onClick={() => {
                                                  this.subMenu(i);
                                                }}
                                              >
                                                {currentValue.text}
                                              </Link>
                                              {/* )} */}
                                            </li>
                                          );
                                        } else {
                                          return (
                                            <li
                                              className={cs(
                                                globalStyles.txtNormal,
                                                {
                                                  [globalStyles.voffset2]:
                                                    j == 2
                                                }
                                              )}
                                              key={j}
                                            >
                                              {" "}
                                              {currentValue.link ? (
                                                <a href={currentValue.link}>
                                                  {currentValue.text}
                                                </a>
                                              ) : (
                                                currentValue.text
                                              )}{" "}
                                            </li>
                                          );
                                        }
                                      }
                                    )}{" "}
                                  </ul>
                                </li>
                              );
                            }
                          )}
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
                      <div className={cs(bootstrap.colMd3, bootstrap.px2)}>
                        <ul>
                          <li>find us on</li>
                          <li className={cs(styles.footerSocialicons)}>
                            <a
                              href="http://www.facebook.com/goodearthindia"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i
                                className={cs(
                                  iconStyles.icon,
                                  iconStyles.iconFooterFb,
                                  styles.footerIcon
                                )}
                              ></i>
                            </a>
                            <a
                              href="http://www.instagram.com/goodearthindia"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i
                                className={cs(
                                  iconStyles.icon,
                                  iconStyles.iconFooterInstagram,
                                  styles.footerIcon
                                )}
                              ></i>
                            </a>
                            <a
                              href="http://pinterest.com/goodearthindia/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i
                                className={cs(
                                  iconStyles.icon,
                                  iconStyles.iconFooterPinterest,
                                  styles.footerIcon
                                )}
                              ></i>
                            </a>
                          </li>
                        </ul>
                        {this.props.saleStatus ? (
                          ""
                        ) : (
                          <ul className={cs(styles.footerPlaylist)}>
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
                                  src={
                                    this.props.data.footerPlaylistData?.ctaImage
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
                        if (index == 0) {
                          res = (
                            <div
                              key={index}
                              className={cs(bootstrap.colMd3, bootstrap.px2)}
                            >
                              <ul key="about-us">
                                <li>
                                  {footerItems.link ? (
                                    <Link to={footerItems.link || "#"}>
                                      {footerItems.name}
                                    </Link>
                                  ) : (
                                    footerItems.name
                                  )}
                                </li>
                                {footerItems.value.map((Item, index) => (
                                  <li key={index}>
                                    {Item.link !== "" ? (
                                      <Link to={Item.link}>{Item.text}</Link>
                                    ) : (
                                      Item.text
                                    )}
                                  </li>
                                ))}
                              </ul>
                              <ul key="services">
                                <li>
                                  {this.props.data.footerList[index + 1]?.name}
                                </li>
                                {this.props.data.footerList[
                                  index + 1
                                ]?.value?.map((Item, index) => (
                                  <li key={index}>
                                    {Item.link !== "" ? (
                                      // Item.text.toLowerCase() ==
                                      // "good earth registry" ? (
                                      //   <a
                                      //     href={Item.link}
                                      //     target="_blank"
                                      //     rel="noopener noreferrer"
                                      //   >
                                      //     {Item.text}
                                      //   </a>
                                      // ) : (
                                      <Link
                                        to={
                                          Item.text.toLowerCase() ==
                                            "good earth registry" &&
                                          this.props.isLoggedIn
                                            ? "/account/bridal"
                                            : Item.link
                                        }
                                      >
                                        {Item.text}
                                      </Link>
                                    ) : (
                                      //  )
                                      Item.text
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        } else if (index == 1) {
                          // do nothing
                        } else {
                          res = (
                            <div
                              key={index}
                              className={cs(bootstrap.colMd3, bootstrap.px2)}
                            >
                              <ul>
                                <li>{footerItems.name}</li>
                                {footerItems.value.map((Item, index) => (
                                  <li
                                    key={index}
                                    className={cs({
                                      [globalStyles.voffset2]:
                                        footerItems.name == "CONNECT" &&
                                        index == 2
                                    })}
                                  >
                                    {Item.link !== "" ? (
                                      footerItems.name == "CONNECT" ? (
                                        <a
                                          className={globalStyles.txtNormal}
                                          href={Item.link}
                                        >
                                          {Item.text}
                                        </a>
                                      ) : (
                                        <Link to={Item.link}>{Item.text}</Link>
                                      )
                                    ) : (
                                      Item.text
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        }
                        return res;
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className={cs(bootstrap.row)}>
                <div className={cs(bootstrap.col1)}></div>
                <div className={cs(bootstrap.col10)}>
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
                          [styles.footerSocialiconsSale]: this.props.saleStatus
                        },
                        { [styles.footerSocialicons]: !this.props.saleStatus }
                      )}
                    >
                      <div
                        className={cs(
                          {
                            [styles.ftrHeadingWhiteSale]: this.props.saleStatus
                          },
                          { [styles.ftrHeadingWhite]: !this.props.saleStatus }
                        )}
                      >
                        find us on
                      </div>
                      <div className={cs(styles.ftrHeadingWhite)}>
                        <Link
                          to="http://www.facebook.com/goodearthindia"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i
                            className={cs(
                              iconStyles.icon,
                              iconStyles.iconFooterFb,
                              styles.footerIcon
                            )}
                          ></i>
                        </Link>
                        <Link
                          to="http://www.instagram.com/goodearthindia"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i
                            className={cs(
                              iconStyles.icon,
                              iconStyles.iconFooterInstagram,
                              styles.footerIcon
                            )}
                          ></i>
                        </Link>
                        <Link
                          to="http://pinterest.com/goodearthindia/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i
                            className={cs(
                              iconStyles.icon,
                              iconStyles.iconFooterPinterest,
                              styles.footerIcon
                            )}
                          ></i>
                        </Link>
                      </div>
                      {this.props.saleStatus ? (
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
                              href={this.props.data.footerPlaylistData?.ctaUrl}
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

                <div className={cs(bootstrap.col1)}></div>
              </div>
            </div>
          </div>

          <div className={cs(styles.footerBottom, bootstrap.colMd12)}>
            <div className={cs(bootstrap.row)}>
              <div className={cs(bootstrap.col12, globalStyles.textCenter)}>
                All rights reserved | &copy;{" "}
                {new Date().getFullYear().toString()} Goodearth Design Studio
                Private Limited
              </div>
            </div>
          </div>
        </div>
        {this.state.showCookie && (
          <div className={styles.cookieclass}>
            <span
              className={cs(
                styles.closePopup,
                fontStyles.icon,
                fontStyles.iconCross
              )}
              onClick={() => {
                this.setState({ showCookie: false });
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
