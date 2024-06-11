import React from "react";
import {
  Link,
  NavLink,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import {
  MobileListProps,
  MobileState,
  HeaderData,
  MegaMenuData,
  InnerMenuData,
  L2MenuData,
  MenuComponentTitleData,
  MenuComponentImageData,
  MenuComponentL2L3Data
} from "./typings";
import { currencyCodes } from "constants/currency";
import styles from "./styles.scss";
import fontStyles from "styles/iconFonts.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import ReactHtmlParser from "react-html-parser";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import ImageWithSideSubheadingMobile from "./templates/ImageWithSideSubheadingMobile";
import TitleHeadingMobile from "./templates/TitleHeadingMobile";
import * as util from "../../utils/validate";
import CeriseCard from "components/CeriseCard";
import { headerClickGTM } from "../../utils/validate";

const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale,
    currency: state.currency,
    isLoggedIn: state.user.isLoggedIn,
    slab: state.user.slab,
    currencyList: state.info.currencyList,
    isLoading: state.info.isLoading
  };
};
type Props = MobileListProps &
  ReturnType<typeof mapStateToProps> &
  RouteComponentProps;

class Mobilemenu extends React.Component<Props, MobileState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeindex: -1,
      showmenulevel1: false,
      showmenulevel2: false,
      activeindex2: -1,
      activeindex3: -1,
      showmenulevel3: false,
      showInnerMenu: false
    };
  }

  Clickmenulevel1(index: number) {
    if (
      this.props.location.pathname.indexOf("/bridal/") > 0 &&
      !this.props.location.pathname.includes("/account/")
    ) {
      return false;
    }
    index == this.state.activeindex
      ? this.setState({
          activeindex: index,
          showmenulevel1: !this.state.showmenulevel1,
          showInnerMenu: !this.state.showInnerMenu
        })
      : this.setState({
          activeindex: index,
          showmenulevel1: true,
          showInnerMenu: true
        });
  }

  closeInnerMenu = () => {
    this.setState({
      activeindex: -1,
      showInnerMenu: false,
      showmenulevel2: false,
      showmenulevel3: false
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.currency != this.props.currency) {
      this.closeInnerMenu();
    }
    const { pathname } = nextProps.location;
    if (pathname != this.props.location.pathname) {
      if (this.state.showInnerMenu) {
        const collapseMenuPaths = [
          "/",
          "/gifting",
          "/corporate-gifts-catalogue",
          "/cerise",
          "/careers",
          "/about-us",
          "/search"
        ];
        if (
          pathname.includes("/category_landing/") ||
          pathname.includes("/account/") ||
          pathname.includes("/customer-assistance/")
        ) {
          setTimeout(() => {
            this.closeInnerMenu();
          }, 1000);
        } else if (collapseMenuPaths.indexOf(pathname) != -1) {
          setTimeout(() => {
            this.closeInnerMenu();
          }, 1000);
        }
      }
    }
  }

  Clickmenulevel2(index: number) {
    if (index == this.state.activeindex2) {
      this.setState({
        activeindex2: index,
        activeindex3: -1,
        showmenulevel3: false,
        showmenulevel2: !this.state.showmenulevel2
      });
    } else {
      // close previous opened element if any
      const oldElem = document.getElementById(
        `menulevel2-${this.state.activeindex2}`
      ) as HTMLParagraphElement;
      if (oldElem) {
        if (oldElem.style.maxHeight) {
          oldElem.style.removeProperty("max-height");
        }
      }
      this.setState({
        activeindex2: index,
        showmenulevel2: true,
        activeindex3: -1,
        showmenulevel3: false
      });
    }
    // toggle clicked element
    const elem = document.getElementById(
      `menulevel2-${index}`
    ) as HTMLParagraphElement;
    if (elem) {
      if (elem.style.maxHeight) {
        elem.style.removeProperty("max-height");
      } else {
        elem.style.maxHeight = elem.scrollHeight + "px";
        // elem.scrollBy(0, 180 - elem.getBoundingClientRect().top);
        const scrollY = 180 - elem.getBoundingClientRect().top;
        const parent = elem.parentElement as HTMLLIElement;
        parent.scrollTop += scrollY;
        // console.log(`scrolled by ${180 - elem.getBoundingClientRect().top}`);
      }
    }
  }

  ClickmenuLeft(index: number) {
    index == this.state.activeindex3
      ? this.setState({
          activeindex3: index,
          activeindex2: -1,
          showmenulevel2: false,
          showmenulevel3: !this.state.showmenulevel3
        })
      : this.setState({
          activeindex2: -1,
          showmenulevel2: false,
          activeindex3: index,
          showmenulevel3: true
        });
  }

  createInnerMenuData(megaMenuData: MegaMenuData) {
    const innerMenuData: InnerMenuData = {
      text: megaMenuData.text,
      url: megaMenuData.url,
      l2MenuData: [],
      templates: []
    };
    megaMenuData.columns.map((column, index) => {
      column.templates.map((template, index) => {
        if (template.publishOnMobile) {
          innerMenuData.templates.push(template);
        } else {
          const l2MenuData: L2MenuData = {
            text: "",
            link: "",
            children: [],
            templateType: template.templateType
          };
          if (
            [
              "IMAGE",
              "CONTENT",
              "VERTICALIMAGE",
              "IMAGEWITHSIDESUBHEADING",
              "TITLEHEADING"
            ].includes(template.templateType)
          ) {
            const componentData = template.templateData
              .componentData as MenuComponentTitleData;
            const children = template.templateData.children;

            const { title, link, ctaName, openInNewTab } = componentData;
            l2MenuData.text = title;
            l2MenuData.link = link;
            l2MenuData.ctaName = ctaName || "";
            l2MenuData.openInNewTab = openInNewTab;
            children &&
              children.length > 0 &&
              children.map((child, index) => {
                const childComponentData = child.componentData as MenuComponentImageData;
                const l3MenuData: L2MenuData = {
                  text: childComponentData.heading,
                  link: childComponentData.link,
                  ctaName: childComponentData.ctaName,
                  openInNewTab: childComponentData.openInNewTab
                };
                l2MenuData.children && l2MenuData.children.push(l3MenuData);
              });
          } else if (["L2L3"].includes(template.templateType)) {
            const componentData = template.templateData
              .componentData as MenuComponentL2L3Data;
            const children = template.templateData.children;

            const {
              text,
              link,
              ctaMobile,
              viewAllLink,
              openInNewTab
            } = componentData;
            l2MenuData.text = text;
            l2MenuData.link = link;
            l2MenuData.ctaMobile = ctaMobile;
            l2MenuData.viewAllLink = viewAllLink;
            l2MenuData.hideViewAllOnMobile = template.hideViewAllOnMobile;
            l2MenuData.openInNewTab = openInNewTab;
            children &&
              children.length > 1 &&
              children.map((child, index) => {
                const childComponentData = child.componentData as MenuComponentL2L3Data;
                const l3MenuData: L2MenuData = {
                  text: childComponentData.text,
                  link: childComponentData.link,
                  ctaName: childComponentData.ctaName,
                  openInNewTab: childComponentData.openInNewTab
                };
                l2MenuData.children && l2MenuData.children.push(l3MenuData);
              });
          } else if (["TITLEHEADING"].includes(template.templateType)) {
            const componentData = template.templateData
              .componentData as MenuComponentTitleData;
            const children = template.templateData.children;
            const { title, link } = componentData;
            l2MenuData.text = title;
            l2MenuData.link = link;
            children &&
              children.length > 1 &&
              children.map((child, index) => {
                const childComponentData = child.componentData as MenuComponentImageData;
                const l3MenuData: L2MenuData = {
                  text: childComponentData.heading,
                  link: childComponentData.link,
                  ctaName: childComponentData.ctaName,
                  openInNewTab: childComponentData.openInNewTab
                };
                l2MenuData.children && l2MenuData.children.push(l3MenuData);
              });
          }
          innerMenuData.l2MenuData.push(l2MenuData);
        }
      });
    });
    return innerMenuData;
  }

  createMegaListElement(megaMenuData: MegaMenuData) {
    const html = [];
    const innerMenuData: InnerMenuData = this.createInnerMenuData(megaMenuData);
    const l2MenuData = innerMenuData.l2MenuData || [];
    const isStories = innerMenuData.text.toLowerCase() == "stories";
    const isEmpty = innerMenuData.l2MenuData.length == 0;
    const templates = innerMenuData.templates || [];
    const currentUrl =
      this.props.location.pathname + this.props.location.search;
    isStories || isEmpty
      ? ""
      : html.push(
          <li key={`l2-0`}>
            <div className={cs(styles.innerMenuHeading, bootstrap.row)}>
              <span
                className={cs(styles.back, bootstrap.col3)}
                onClick={this.closeInnerMenu}
              >
                back
              </span>
              <span className={cs(styles.title, bootstrap.col6)}>
                {innerMenuData.text?.includes("Our World") ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={innerMenuData.url}
                    onClick={() => {
                      this.props.onMobileMenuClick({
                        l1: innerMenuData.text,
                        clickUrl1: innerMenuData.url
                      });
                      this.props.clickToggle();
                    }}
                  >
                    {ReactHtmlParser(innerMenuData.text)}
                  </a>
                ) : (
                  <Link
                    to={innerMenuData.url}
                    onClick={() => {
                      this.props.onMobileMenuClick({
                        l1: innerMenuData.text,
                        clickUrl1: innerMenuData.url
                      });
                      this.props.clickToggle();
                    }}
                  >
                    {ReactHtmlParser(innerMenuData.text)}
                  </Link>
                )}
              </span>
              <span className={cs(bootstrap.col3, globalStyles.textRight)}>
                {innerMenuData.text?.includes("Our World") ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={innerMenuData.url}
                    onClick={() => {
                      this.props.onMobileMenuClick({
                        l1: innerMenuData.text,
                        clickUrl1: innerMenuData.url
                      });
                      this.props.clickToggle();
                    }}
                  >
                    <i
                      className={cs(
                        fontStyles.icon,
                        fontStyles.iconDoubleArrowRight,
                        styles.doubleArrow
                      )}
                    ></i>
                  </a>
                ) : (
                  <Link
                    to={innerMenuData.url}
                    onClick={() => {
                      this.props.onMobileMenuClick({
                        l1: innerMenuData.text,
                        clickUrl1: innerMenuData.url
                      });
                      this.props.clickToggle();
                    }}
                  >
                    <i
                      className={cs(
                        fontStyles.icon,
                        fontStyles.iconDoubleArrowRight,
                        styles.doubleArrow
                      )}
                    ></i>
                  </Link>
                )}
              </span>
            </div>
          </li>
        );
    let k = 0;
    l2MenuData.map((data, j) => {
      let spanClass =
        this.state.showmenulevel2 && this.state.activeindex2 == k
          ? cs(styles.menulevel2, styles.menulevel2Open)
          : styles.menulevel2;
      data.text.toLowerCase() == "winter velvets"
        ? (spanClass += ` ${styles.subheadingImg}`)
        : "";
      spanClass +=
        data.text.toLowerCase().indexOf("sale") > -1
          ? ` ${styles.menucolor}`
          : "";
      html.push(
        data.link && data.children && data.children.length == 0 ? (
          <li key={j + "leftData"} onClick={this.props.clickToggle}>
            <Link
              to={data.link}
              onClick={() => {
                this.props.onMobileMenuClick({
                  l1: innerMenuData.text,
                  clickUrl1: innerMenuData.url
                });
              }}
              className={cs(styles.menulevel2Link, {
                [styles.highlight]: currentUrl == data.link
              })}
            >
              <span>{ReactHtmlParser(data.ctaName || data.text)}</span>
            </Link>
          </li>
        ) : (
          <li key={`l2-${data.text}`}>
            <span
              className={spanClass}
              onClick={this.Clickmenulevel2.bind(this, k)}
            >
              <span>{ReactHtmlParser(data.text)}</span>
            </span>
            <div
              id={`menulevel2-${k}`}
              className={
                styles.l3Animation
                // this.state.showmenulevel2 && this.state.activeindex2 == k
                //   ? styles.expanded
                //   : styles.hidden
              }
            >
              {data.children ? (
                <ul key={data.link}>
                  {data.link && data.children.length > 0 ? (
                    data.templateType == "L2L3" ? (
                      <>
                        {console.log("data====", data)}
                        {!data.hideViewAllOnMobile && (
                          <li
                            onClick={this.props.clickToggle}
                            key={"firstChild"}
                          >
                            <Link
                              to={data.viewAllLink || ""}
                              className={cs({
                                [styles.highlight]:
                                  currentUrl == data.viewAllLink
                              })}
                              onClick={() => {
                                this.props.onMobileMenuClick({
                                  l1: innerMenuData.text,
                                  l2: data.text,
                                  clickUrl2: data.viewAllLink || ""
                                });
                              }}
                              target={data.openInNewTab ? "_blank" : ""}
                            >
                              View All
                            </Link>
                          </li>
                        )}
                        {data.ctaMobile && (
                          <li
                            onClick={this.props.clickToggle}
                            key={"secondChild"}
                          >
                            <Link
                              to={data.link || ""}
                              className={cs({
                                [styles.highlight]: currentUrl == data.link
                              })}
                              onClick={() => {
                                this.props.onMobileMenuClick({
                                  l1: innerMenuData.text,
                                  l2: data.text,
                                  clickUrl2: data.link || ""
                                });
                              }}
                            >
                              {ReactHtmlParser(data.ctaMobile)}
                            </Link>
                          </li>
                        )}
                      </>
                    ) : (
                      <li onClick={this.props.clickToggle} key={"firstchild"}>
                        {console.log("data 222====", data)}
                        <Link
                          to={data.link}
                          className={cs({
                            [styles.highlight]: currentUrl == data.link
                          })}
                          onClick={() => {
                            this.props.onMobileMenuClick({
                              l1: innerMenuData.text,
                              l2: data.text,
                              clickUrl2: data.link
                            });
                          }}
                          target={data.openInNewTab ? "_blank" : ""}
                        >
                          {ReactHtmlParser(data.ctaName || "View All")}
                        </Link>
                      </li>
                    )
                  ) : (
                    ""
                  )}
                  {data.children.map((innerdata, i) => {
                    return (
                      <li
                        key={i + "mobileChildren"}
                        onClick={this.props.clickToggle}
                      >
                        <Link
                          to={innerdata.link}
                          target={innerdata.openInNewTab ? "_blank" : ""}
                          onClick={() => {
                            this.props.onMobileMenuClick({
                              l1: innerMenuData.text,
                              l2: data.text,
                              l3: innerdata.text,
                              clickUrl3: innerdata.link
                            });
                          }}
                          className={cs(
                            innerdata.text.toLowerCase().indexOf("sale") > -1
                              ? styles.menucolor
                              : "",
                            { [styles.highlight]: currentUrl == innerdata.link }
                          )}
                        >
                          {ReactHtmlParser(
                            innerdata.ctaName || innerdata.text.toLowerCase()
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                ""
              )}
            </div>
          </li>
        )
      );
      k++;
    });
    const isPublishOnMobile =
      templates.filter(template => template.publishOnMobile).length > 0;
    if (isPublishOnMobile) {
      html.push(<div className={styles.hr} />);
    }
    templates.map(template => {
      if (template.publishOnMobile) {
        if (template.templateType == "TITLEHEADING") {
          html.push(
            <div onClick={() => this.props.clickToggle()}>
              <TitleHeadingMobile
                data={template.templateData}
                templateType={template.templateType}
                l1={megaMenuData.text}
                onHeaderMegaMenuClick={this.props.onHeaderMegaMenuClick}
              />
            </div>
          );
        } else {
          html.push(
            <div onClick={() => this.props.clickToggle()}>
              <ImageWithSideSubheadingMobile
                data={template.templateData}
                templateType={template.templateType}
                l1={megaMenuData.text}
                onHeaderMegaMenuClick={this.props.onHeaderMegaMenuClick}
              />
            </div>
          );
        }
      }
    });
    return html;
  }

  createListElement(headerData: HeaderData) {
    const html = [];
    const leftData = headerData.leftMenu || [];
    const rightData = headerData.rightMenu || [];
    const isStories = headerData.name.toLowerCase() == "stories";
    // const templates = headerData.templates || [];
    isStories
      ? ""
      : html.push(
          <li>
            <div className={cs(styles.innerMenuHeading, bootstrap.row)}>
              <span
                className={cs(styles.back, bootstrap.col3)}
                onClick={this.closeInnerMenu}
              >
                back
              </span>
              <span className={cs(styles.title, bootstrap.col6)}>
                <Link
                  to={headerData.catLandingUrl}
                  onClick={() => {
                    // this.props.onMobileMenuClick(headerData.name, "", "");
                    this.props.clickToggle();
                  }}
                >
                  {headerData.name}
                </Link>
              </span>
              <span className={cs(bootstrap.col3, globalStyles.textRight)}>
                <Link
                  to={headerData.catLandingUrl}
                  onClick={() => {
                    // this.props.onMobileMenuClick(headerData.name, "", "");
                    this.props.clickToggle();
                  }}
                >
                  <i
                    className={cs(
                      fontStyles.icon,
                      fontStyles.iconDoubleArrowRight,
                      styles.doubleArrow
                    )}
                  ></i>
                </Link>
              </span>
            </div>
          </li>
        );
    let k = 0;
    leftData.map((data, j) => {
      let spanClass =
        this.state.showmenulevel2 && this.state.activeindex2 == k
          ? cs(styles.menulevel2, styles.menulevel2Open)
          : styles.menulevel2;
      data.name.toLowerCase() == "winter velvets"
        ? (spanClass += ` ${styles.subheadingImg}`)
        : "";
      spanClass +=
        data.name.toLowerCase().indexOf("sale") > -1
          ? ` ${styles.menucolor}`
          : "";
      html.push(
        data.url && data.children.length == 0 ? (
          <li key={j + "leftData"} onClick={this.props.clickToggle}>
            <Link
              to={data.url}
              onClick={() => {
                // this.props.onMobileMenuClick(headerData.name, data.name, "");
              }}
              className={styles.menulevel2Link}
            >
              <span>
                {ReactHtmlParser(
                  data.labelMobile ? data.labelMobile : data.name
                )}
              </span>
            </Link>
          </li>
        ) : (
          <li>
            <span
              className={spanClass}
              onClick={this.Clickmenulevel2.bind(this, k)}
            >
              <span>
                {ReactHtmlParser(
                  data.labelMobile ? data.labelMobile : data.name
                )}
              </span>
            </span>
            <p
              className={
                this.state.showmenulevel2 && this.state.activeindex2 == k
                  ? styles.showheader2
                  : styles.hidden
              }
            >
              {data.children ? (
                <ul key={data.url}>
                  {data.url && data.children.length > 1 ? (
                    <li onClick={this.props.clickToggle}>
                      <Link
                        to={data.url}
                        onClick={() => {
                          // this.props.onMobileMenuClick(
                          //   headerData.name,
                          //   data.name,
                          //   ""
                          // );
                        }}
                      >
                        View All
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                  {data.children.map((innerdata, i) => {
                    return (
                      <li
                        key={i + "mobileChildren"}
                        onClick={this.props.clickToggle}
                      >
                        <Link
                          to={innerdata.url}
                          onClick={() => {
                            // this.props.onMobileMenuClick(
                            //   headerData.name,
                            //   data.name,
                            //   innerdata.name
                            // );
                          }}
                          className={
                            innerdata.name.toLowerCase().indexOf("sale") > -1
                              ? styles.menucolor
                              : ""
                          }
                        >
                          <p>
                            {ReactHtmlParser(
                              innerdata.labelMobile
                                ? innerdata.labelMobile
                                : innerdata.name
                            )}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                ""
              )}
            </p>
          </li>
        )
      );
      k++;
    });

    rightData.map((column, j) => {
      column.map((data, i) => {
        let spanClass =
          this.state.showmenulevel2 && this.state.activeindex2 == k
            ? cs(styles.menulevel2, styles.menulevel2Open)
            : styles.menulevel2;
        data.name.toLowerCase() == "winter velvets"
          ? (spanClass += ` ${styles.subheadingImg}`)
          : "";
        spanClass +=
          data.name.toLowerCase().indexOf("sale") > -1
            ? ` ${styles.menucolor}`
            : "";
        html.push(
          data.url && data.children.length == 0 ? (
            <li key={data.id} onClick={this.props.clickToggle}>
              <Link
                to={data.url}
                onClick={() => {
                  // this.props.onMobileMenuClick(headerData.name, data.name, "");
                }}
                className={styles.menulevel2Link}
              >
                <span>
                  {ReactHtmlParser(
                    data.labelMobile ? data.labelMobile : data.name
                  )}
                </span>
              </Link>
            </li>
          ) : (
            <li key={data.id}>
              <span
                className={spanClass}
                onClick={this.Clickmenulevel2.bind(this, k)}
              >
                <span>
                  {ReactHtmlParser(
                    data.labelMobile ? data.labelMobile : data.name
                  )}
                </span>
              </span>
              <p
                className={
                  this.state.showmenulevel2 && this.state.activeindex2 == k
                    ? styles.showheader2
                    : styles.hidden
                }
              >
                {data.children ? (
                  <ul key={data.url}>
                    {data.url && data.children.length > 1 ? (
                      <li onClick={this.props.clickToggle}>
                        <Link
                          to={data.url}
                          onClick={() => {
                            // this.props.onMobileMenuClick(
                            //   headerData.name,
                            //   data.name,
                            //   ""
                            // );
                          }}
                        >
                          View All
                        </Link>
                      </li>
                    ) : (
                      ""
                    )}
                    {data.children.map((innerdata, i) => {
                      return (
                        <li
                          key={i + "data-children"}
                          onClick={this.props.clickToggle}
                        >
                          <Link
                            to={innerdata.url}
                            onClick={() => {
                              // this.props.onMobileMenuClick(
                              //   headerData.name,
                              //   data.name,
                              //   innerdata.name
                              // );
                            }}
                            className={
                              innerdata.name.toLowerCase().indexOf("sale") > -1
                                ? styles.menucolor
                                : ""
                            }
                          >
                            <p>
                              {ReactHtmlParser(
                                innerdata.labelMobile
                                  ? innerdata.labelMobile
                                  : innerdata.name
                              )}
                            </p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  ""
                )}
              </p>
            </li>
          )
        );
        k++;
      });
    });
    // templates.map(template => {
    //   if (template.publishOnMobile) {
    //     html.push(
    //       <div onClick={() => this.props.clickToggle()}>
    //         <ImageWithSideSubheadingMobile data={template.templateData} />
    //       </div>
    //     );
    //   }
    // });
    return html;
  }

  render() {
    const curryList = this.props.currencyList.map(data => {
      // return data.currencyCode
      const abc = data.currencySymbol ? "(" + data.currencySymbol + ")" : "";
      return {
        label: `${data.countryName} | ${data.currencyCode}` + abc,
        value: data.currencyCode
      };
    });

    const {
      isLoggedIn,
      clickToggle,
      wishlistCount,
      showCurrency,
      changeCurrency,
      showC,
      profileItems,
      loginItem
    } = this.props;
    // const wishlistIcon = wishlistCount > 0;
    const lowerMenu = (
      <div
        className={cs(this.props.slab, styles.lowerMenu, {
          [styles.lowerMenuNonInrHeight]: this.props.currency !== "INR"
          // [styles.lowerMenuNonInrHeight]:
          //   showC
          //   this.props.slab.toLowerCase() != "cerise" &&
          //   this.props.slab.toLowerCase() != "cerise club" &&
          //   this.props.slab.toLowerCase() != "cerise sitara"
        })}
      >
        <ul>
          {loginItem.label == "Login" && (
            <li
              key={loginItem.label}
              onClick={e => {
                loginItem.onClick && loginItem.onClick(e);
                clickToggle();
              }}
              className={cs(styles.lowerMenuLoginLogout)}
            >
              {loginItem.type == "button" ? (
                <span
                  onClick={() => {
                    headerClickGTM("Profile Item", "Top", true, isLoggedIn);
                  }}
                >
                  {loginItem.label}
                </span>
              ) : (
                <NavLink
                  key={loginItem.label}
                  to={loginItem.href as string}
                  onClick={() => {
                    headerClickGTM("Profile Item", "Top", true, isLoggedIn);
                  }}
                >
                  {loginItem.label}
                </NavLink>
              )}
            </li>
          )}
          <ul className={styles.adding}>
            {profileItems.slice(0, 2).map(item => {
              return (
                <li
                  key={item.label}
                  onClick={e => {
                    item.onClick && item.onClick(e);
                    clickToggle();
                  }}
                >
                  {item.type == "button" ? (
                    <span
                      onClick={() => {
                        util.headerClickGTM(
                          "Profile Item",
                          "Top",
                          true,
                          isLoggedIn
                        );
                      }}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <NavLink
                      key={item.label}
                      to={item.href as string}
                      onClick={() => {
                        util.headerClickGTM(
                          "Profile Item",
                          "Top",
                          true,
                          isLoggedIn
                        );
                      }}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
          <li>
            <Link
              to="/wishlist"
              className={styles.wishlistLink}
              onClick={() => {
                clickToggle();
                headerClickGTM("Wishlist", "Top", true, isLoggedIn);
              }}
            >
              {/* <i
                className={cs(
                  styles.wishlistIcon,
                  { [styles.wishlistGold]: wishlistIcon },
                  {
                    [iconStyles.iconWishlistAdded]: wishlistIcon
                  },
                  {
                    [iconStyles.iconWishlist]: !wishlistIcon
                  },
                  iconStyles.icon
                )}
              /> */}
              {/* <span>
                {" "} */}
              saved items {wishlistCount ? `(${wishlistCount})` : ""}
              {/* </span> */}
            </Link>
          </li>
          <li
            className={
              showC
                ? cs(styles.currency, styles.before)
                : this.props.location.pathname.indexOf("/bridal/") > 0 &&
                  !this.props.location.pathname.includes("/account/")
                ? cs(styles.currency, styles.op3)
                : styles.currency
            }
            onClick={showCurrency}
          >
            {" "}
            change currency: {this.props.currency}
            {this.props.currency != "AED" && (
              <>
                {" "}
                ({String.fromCharCode(...currencyCodes[this.props.currency])})
              </>
            )}
          </li>
          <li className={showC ? "" : styles.hidden}>
            <ul className={cs(styles.noMargin, styles.lowerMenuCurrencyList)}>
              {curryList.map(item => {
                return (
                  <li
                    key={item.value}
                    data-name={item.value}
                    className={cs(
                      this.props.currency == item.value
                        ? styles.lowerMenuSelectedCurrency
                        : "",
                      styles.lowerMenuCurrency
                    )}
                    onClick={() => {
                      if (this.props.isLoading) {
                        return false;
                      }
                      changeCurrency(item.value);
                      headerClickGTM("Currency", "Top", true, isLoggedIn);
                      clickToggle();
                    }}
                  >
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </li>

          <ul className={styles.adding}>
            {profileItems.slice(2, profileItems?.length).map(item => {
              return (
                <li
                  key={item.label}
                  onClick={e => {
                    item.onClick && item.onClick(e);
                    clickToggle();
                  }}
                >
                  {item.type == "button" ? (
                    <span
                      onClick={() => {
                        headerClickGTM("Profile Item", "Top", true, isLoggedIn);
                      }}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <NavLink
                      key={item.label}
                      to={item.href as string}
                      onClick={() => {
                        headerClickGTM("Profile Item", "Top", true, isLoggedIn);
                      }}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              );
            })}
            {loginItem.label == "Logout" && (
              <li
                key={loginItem.label}
                onClick={e => {
                  loginItem.onClick && loginItem.onClick(e);
                  clickToggle();
                }}
                className={cs(styles.lowerMenuLoginLogout)}
              >
                {loginItem.type == "button" ? (
                  <span
                    onClick={() => {
                      headerClickGTM("Profile Item", "Top", true, isLoggedIn);
                    }}
                  >
                    {loginItem.label}
                  </span>
                ) : (
                  <NavLink
                    key={loginItem.label}
                    to={loginItem.href as string}
                    onClick={() => {
                      headerClickGTM("Profile Item", "Top", true, isLoggedIn);
                    }}
                  >
                    {loginItem.label}
                  </NavLink>
                )}
              </li>
            )}
          </ul>
        </ul>
      </div>
    );
    const outerMenu = (
      <ul className={styles.mobileMainMenu}>
        {this.props.megaMenuData.map((data, i) => {
          return (
            <li
              key={i}
              className={cs(
                this.props.location.pathname.indexOf("/bridal/") > 0 &&
                  !this.props.location.pathname.includes("/account/")
                  ? styles.iconStyleDisabled
                  : "",
                styles.outerMenuItem
              )}
            >
              {data.columns[0]?.templates.length > 0 ? (
                <>
                  <span
                    className={
                      this.state.activeindex == i && this.state.showmenulevel1
                        ? cs(styles.menulevel1, styles.menulevel1Open)
                        : cs(styles.menulevel1)
                    }
                    onClick={this.Clickmenulevel1.bind(this, i)}
                  >
                    {ReactHtmlParser(data.text)}
                  </span>
                  <p
                    className={
                      this.state.activeindex == i && this.state.showmenulevel1
                        ? styles.showheader1
                        : styles.hidden
                    }
                  ></p>
                </>
              ) : (
                <Link
                  className={styles.menulevel1Stories}
                  to={data.url}
                  onClick={() => {
                    this.props.onMobileMenuClick({
                      l1: data.text,
                      clickUrl1: data.url
                    });
                    this.props.clickToggle();
                  }}
                  // target="_blank"
                  // rel="noopener noreferrer"
                >
                  {ReactHtmlParser(data.text)}
                </Link>
              )}
            </li>
          );
        })}
        {/* <li
          key="gifting"
          className={cs(
            this.props.location.pathname.indexOf("/bridal/") > 0 &&
              !this.props.location.pathname.includes("/account/")
              ? styles.iconStyleDisabled
              : "",
            styles.outerMenuItem
          )}
          onClick={this.props.clickToggle}
        >
          <>
            <Link
              className={styles.menulevel1Stories}
              onClick={() => {
                this.props.onMobileMenuClick({
                  l1: "gifting",
                  clickUrl1: "/gifting"
                });
              }}
              to="/gifting"
            >
              {ReactHtmlParser("gifting")}
            </Link>
          </>
        </li> */}
        {/* <li
          key="stories"
          className={cs(
            this.props.location.pathname.indexOf("/bridal/") > 0 &&
              !this.props.location.pathname.includes("/account/")
              ? styles.iconStyleDisabled
              : "",
            styles.outerMenuItem
          )}
          onClick={this.props.clickToggle}
        >
          <a
            className={cs(styles.menulevel1Stories, {
              [styles.cerise]: !this.props.isSale
            })}
            href={"/stories"}
            onClick={() => {
              this.props.onMobileMenuClick({
                l1: "stories",
                clickUrl1: "/stories"
              });
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ReactHtmlParser("stories")}
          </a>
        </li> */}
      </ul>
    );
    const innerMenu = (
      <div className={styles.mobileMainMenu}>
        <ul className={styles.innerMenuMobile} key="innermenu">
          {this.state.activeindex > -1 &&
            // this.createListElement(this.props.menudata[this.state.activeindex])}
            this.createMegaListElement(
              this.props.megaMenuData[
                this.state.activeindex < this.props.megaMenuData.length
                  ? this.state.activeindex
                  : 0
              ]
            )}
        </ul>
      </div>
    );
    return (
      <div
        className={cs(styles.mobileMainMenuContainer, {
          [styles.active]: this.state.showInnerMenu
        })}
      >
        {outerMenu}
        {innerMenu}
        {lowerMenu}
        {/* <NavLink
          to={"/cerise"}
          onClick={e => {
            if ((e.target as HTMLInputElement)?.id === "dashboard") {
              e.preventDefault();
              this.props.history.push("/account/cerise");
              clickToggle();
            } else {
              clickToggle();
            }
          }}
        > */}
        {(this.props.currency === "INR" ||
          this.props.slab.toLowerCase() === "cerise club" ||
          this.props.slab.toLowerCase() === "cerise sitara") && (
          <CeriseCard
            clickToggle={clickToggle}
            showInnerMenu={this.state.showInnerMenu}
          />
        )}
        {/* </NavLink> */}
      </div>
    );
  }
}

const MobilemenuRouter = withRouter(Mobilemenu);
export default React.memo(connect(mapStateToProps)(MobilemenuRouter));
