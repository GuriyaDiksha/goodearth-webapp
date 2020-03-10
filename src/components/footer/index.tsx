import React from "react";
import { List, FooterList, FooterState } from "./typings";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../styles/iconFonts.scss";
import { ShopLocator } from "./ShopLocator";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";

const mapStateToProps = (state: AppState) => {
  return {
    data: state.footer.data,
    mobile: state.device.mobile,
    isLoggedIn: state.user.email ? true : false,
    saleStatus: false
  };
};

type Props = ReturnType<typeof mapStateToProps>;

class Footer extends React.Component<Props, FooterState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpened: false,
      currentIndex: -1,
      dropdown: false,
      hideImage: false,
      newsletterEmail: "",
      newsletterMessage: ""
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
    // const city = data ? (data.value ? data.value : "Delhi") : "Delhi";
    if (e.metaKey || e.ctrlKey) {
      // do nothing
    } else {
      // location.href = "/Cafe-Shop/" + city;
      e.preventDefault();
    }
  };

  onChangeText(event: React.KeyboardEvent) {
    // on change text
  }

  SetNewsletterEmail = (e: React.KeyboardEvent) => {
    // api call
  };

  makeNewsletterSignupRequest = () => {
    // api call
  };

  render() {
    return (
      <div id="footer-start" className={cs(bootstrap.row)}>
        <div
          className={`${
            this.state.hideImage
              ? ""
              : cs(styles.footerTop, bootstrap.colMd12, bootstrap.py4)
          } ${this.props.saleStatus ? cs(styles.footerTopSale20) : ""}`}
        >
          <div className={cs(globalStyles.minimumWidth, bootstrap.row)}>
            <div className={cs(bootstrap.col1, bootstrap.colSm3)}></div>
            <div className={cs(bootstrap.col10, bootstrap.colSm6)}>
              <div className={cs(styles.ftrHeadingWhite)}>be in the know</div>
              <div className={cs(styles.ftrCopyWhiteDesktop)}>
                By signing up for alerts, you agree to receive e-mails, calls
                and text messages from Goodearth. To know more how we keep your
                data safe, refer to our{" "}
                <a href="/customer-assistance/privacy-policy">Privacy Policy</a>
              </div>
              <div
                className={cs(
                  bootstrap.colSm6,
                  bootstrap.offsetSm3,
                  styles.voffset3
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
                    onClick={this.makeNewsletterSignupRequest}
                  ></div>
                </div>
              </div>
              <div
                className={cs(
                  bootstrap.colSm6,
                  bootstrap.offsetSm3,
                  styles.voffset1
                )}
              >
                <div className={cs(styles.errorMsg)}>
                  {this.state.newsletterMessage}{" "}
                </div>
              </div>
            </div>
            <div className={cs(bootstrap.col1, bootstrap.colSm3)}></div>
          </div>
        </div>
        <div
          className={`${
            this.state.hideImage ? "" : cs(styles.footer, bootstrap.colMd12)
          } ${this.props.saleStatus ? cs(styles.footerSale20) : ""}`}
        >
          <div className={cs(globalStyles.minimumWidth)}>
            <div className={cs(bootstrap.row)}>
              {this.props.mobile ? (
                <div
                  className={cs(
                    bootstrap.col12,
                    styles.hiddenLg,
                    styles.hiddenMd
                  )}
                >
                  <div className={cs(bootstrap.col10, bootstrap.offset1)}>
                    <ul
                      className={
                        this.props.saleStatus
                          ? cs(styles.mainMenuFooterSale)
                          : cs(styles.mainMenuFooter)
                      }
                    >
                      {this.props.data.footerList.map(
                        (list: FooterList, i: number) => {
                          return (
                            <li key={i}>
                              <span
                                className={`${
                                  this.state.isOpened &&
                                  this.state.currentIndex == i
                                    ? cs(styles.detailShow)
                                    : cs(styles.detail)
                                } ${
                                  this.props.saleStatus ? cs(styles.cerise) : ""
                                }`}
                                onClick={() => {
                                  this.subMenu(i);
                                }}
                              >
                                {" "}
                                {list.name}{" "}
                              </span>
                              <ul
                                className={
                                  this.state.isOpened &&
                                  this.state.currentIndex == i
                                    ? ""
                                    : cs(styles.hidden)
                                }
                              >
                                {list.value.map(
                                  (currentValue: List, j: number) => {
                                    if (this.props.saleStatus == true) {
                                      return false;
                                    }
                                    if (
                                      list.name == "Help" ||
                                      list.name == "Services"
                                    ) {
                                      return (
                                        <li key={j}>
                                          <a href={currentValue.link}>
                                            {currentValue.text}
                                          </a>
                                        </li>
                                      );
                                    } else {
                                      return (
                                        <li key={j}> {currentValue.text} </li>
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
                          styles.voffset5,
                          styles.mainMenuFooterSale,
                          styles.hiddenXs,
                          styles.hiddenSm,
                          bootstrap.colMd12
                        )
                      : cs(
                          styles.voffset5,
                          styles.mainMenuFooter,
                          styles.hiddenXs,
                          styles.hiddenSm,
                          bootstrap.colMd12
                        )
                  }
                >
                  <div className={cs(bootstrap.row, bootstrap.px5)}>
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
                          <li> {this.props.data.footerPlaylistData.ctaText}</li>
                          <li>
                            <a
                              href={this.props.data.footerPlaylistData.ctaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {" "}
                              <img
                                src={
                                  this.props.data.footerPlaylistData.ctaImage
                                }
                                className={cs(styles.imgResponsive)}
                              />{" "}
                            </a>
                          </li>
                        </ul>
                      )}
                    </div>
                    {this.props.data.footerList.map((footerItems, index) => (
                      <div
                        key={index}
                        className={cs(bootstrap.colMd3, bootstrap.px2)}
                      >
                        <ul>
                          <li>{footerItems.name}</li>
                          {footerItems.value.map((Item, index) => (
                            <li key={index}>
                              {Item.link !== "" ? (
                                <a href={Item.link}>{Item.text}</a>
                              ) : (
                                Item.text
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
                      { [styles.footerSocialiconsSale]: this.props.saleStatus },
                      { [styles.footerSocialicons]: !this.props.saleStatus }
                    )}
                  >
                    <div
                      className={cs(
                        { [styles.ftrHeadingWhiteSale]: this.props.saleStatus },
                        { [styles.ftrHeadingWhite]: !this.props.saleStatus }
                      )}
                    >
                      find us on
                    </div>
                    <div className={cs(styles.ftrHeadingWhite)}>
                      <a
                        href="http://www.facebook.com/goodearthindia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon icon_footer-fb"
                      ></a>
                      <a
                        href="http://www.instagram.com/goodearthindia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon icon_footer-instagram"
                      ></a>
                      <a
                        href="http://pinterest.com/goodearthindia/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon icon_footer-pinterest"
                      ></a>
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
                          {this.props.data.footerPlaylistData.ctaText}
                        </div>
                        <div className={cs(styles.textCenter)}>
                          <a
                            href={this.props.data.footerPlaylistData.ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            <img
                              src={this.props.data.footerPlaylistData.ctaImage}
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
          <div className={cs(globalStyles.minimumWidth, bootstrap.row)}>
            <div className={cs(bootstrap.colSm12, styles.textCenter)}>
              All rights reserved | &copy; {new Date().getFullYear().toString()}{" "}
              Goodearth Design Studio Private Limited
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Footer);
