import React from "react";
import { Link } from "react-router-dom";
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
import styles from "./styles.scss";
import fontStyles from "styles/iconFonts.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import ReactHtmlParser from "react-html-parser";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import ImageWithSideSubheadingMobile from "./templates/ImageWithSideSubheadingMobile";

const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale
  };
};
type Props = MobileListProps & ReturnType<typeof mapStateToProps>;

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
    if (this.props.location.pathname.indexOf("/bridal/") > 0) {
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

  Clickmenulevel2(index: number) {
    index == this.state.activeindex2
      ? this.setState({
          activeindex2: index,
          activeindex3: -1,
          showmenulevel3: false,
          showmenulevel2: !this.state.showmenulevel2
        })
      : this.setState({
          activeindex2: index,
          showmenulevel2: true,
          activeindex3: -1,
          showmenulevel3: false
        });
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

  closeInnerMenu = () => {
    this.setState({
      showInnerMenu: false,
      showmenulevel2: false,
      showmenulevel3: false
    });
  };

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
          const l2MenuData: L2MenuData = { text: "", link: "", children: [] };
          if (
            [
              "IMAGE",
              "CONTENT",
              "VERTICALIMAGE",
              "IMAGEWITHSIDESUBHEADING"
            ].includes(template.templateType)
          ) {
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
                  link: childComponentData.link
                };
                l2MenuData.children && l2MenuData.children.push(l3MenuData);
              });
          } else if (["L2L3"].includes(template.templateType)) {
            const componentData = template.templateData
              .componentData as MenuComponentL2L3Data;
            const children = template.templateData.children;

            const { text, link } = componentData;
            l2MenuData.text = text;
            l2MenuData.link = link;
            children &&
              children.length > 1 &&
              children.map((child, index) => {
                const childComponentData = child.componentData as MenuComponentL2L3Data;
                const l3MenuData: L2MenuData = {
                  text: childComponentData.text,
                  link: childComponentData.link
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
    console.log(innerMenuData);
    const l2MenuData = innerMenuData.l2MenuData || [];
    const isStories = innerMenuData.text.toLowerCase() == "stories";
    const templates = innerMenuData.templates || [];
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
                  to={innerMenuData.url}
                  onClick={() => {
                    this.props.onMobileMenuClick(innerMenuData.text, "", "");
                    this.props.clickToggle();
                  }}
                >
                  {innerMenuData.text}
                </Link>
              </span>
              <span className={cs(bootstrap.col3, globalStyles.textRight)}>
                <Link
                  to={innerMenuData.url}
                  onClick={() => {
                    this.props.onMobileMenuClick(innerMenuData.text, "", "");
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
                this.props.onMobileMenuClick(innerMenuData.text, data.text, "");
              }}
              className={styles.menulevel2Link}
            >
              <span>{ReactHtmlParser(data.text)}</span>
            </Link>
          </li>
        ) : (
          <li>
            <span
              className={spanClass}
              onClick={this.Clickmenulevel2.bind(this, k)}
            >
              <span>{ReactHtmlParser(data.text)}</span>
            </span>
            <p
              className={
                this.state.showmenulevel2 && this.state.activeindex2 == k
                  ? styles.showheader2
                  : styles.hidden
              }
            >
              {data.children ? (
                <ul key={data.link}>
                  {data.link && data.children.length > 1 ? (
                    <li onClick={this.props.clickToggle}>
                      <Link
                        to={data.link}
                        onClick={() => {
                          this.props.onMobileMenuClick(
                            innerMenuData.text,
                            data.text,
                            ""
                          );
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
                          to={innerdata.link}
                          onClick={() => {
                            this.props.onMobileMenuClick(
                              innerMenuData.text,
                              data.text,
                              innerdata.text
                            );
                          }}
                          className={
                            innerdata.text.toLowerCase().indexOf("sale") > -1
                              ? styles.menucolor
                              : ""
                          }
                        >
                          <p>{ReactHtmlParser(innerdata.text)}</p>
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
    templates.map(template => {
      if (template.publishOnMobile) {
        html.push(
          <div onClick={() => this.props.clickToggle()}>
            <ImageWithSideSubheadingMobile data={template.templateData} />
          </div>
        );
      }
    });
    return html;
  }

  createListElement(headerData: HeaderData) {
    const html = [];
    const leftData = headerData.leftMenu || [];
    const rightData = headerData.rightMenu || [];
    const isStories = headerData.name.toLowerCase() == "stories";
    const templates = headerData.templates || [];
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
                    this.props.onMobileMenuClick(headerData.name, "", "");
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
                    this.props.onMobileMenuClick(headerData.name, "", "");
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
                this.props.onMobileMenuClick(headerData.name, data.name, "");
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
                          this.props.onMobileMenuClick(
                            headerData.name,
                            data.name,
                            ""
                          );
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
                            this.props.onMobileMenuClick(
                              headerData.name,
                              data.name,
                              innerdata.name
                            );
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
                  this.props.onMobileMenuClick(headerData.name, data.name, "");
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
                            this.props.onMobileMenuClick(
                              headerData.name,
                              data.name,
                              ""
                            );
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
                              this.props.onMobileMenuClick(
                                headerData.name,
                                data.name,
                                innerdata.name
                              );
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
    templates.map(template => {
      if (template.publishOnMobile) {
        html.push(
          <div onClick={() => this.props.clickToggle()}>
            <ImageWithSideSubheadingMobile data={template.templateData} />
          </div>
        );
      }
    });
    return html;
  }

  render() {
    const outerMenu = (
      <ul className={styles.mobileMainMenu}>
        {this.props.megaMenuData.map((data, i) => {
          return (
            <li
              key={i}
              className={cs(
                this.props.location.pathname.indexOf("/bridal/") > 0
                  ? styles.iconStyleDisabled
                  : "",
                styles.outerMenuItem
              )}
            >
              {data.text.toLowerCase() != "stories" ? (
                <>
                  <span
                    className={
                      this.state.activeindex == i && this.state.showmenulevel1
                        ? cs(styles.menulevel1, styles.menulevel1Open)
                        : styles.menulevel1
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
                <a
                  className={cs(styles.menulevel1Stories, {
                    [styles.cerise]: !this.props.isSale
                  })}
                  href={data.url}
                  onClick={() => {
                    this.props.onMobileMenuClick(data.text, "", "");
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ReactHtmlParser(data.text)}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    );
    const innerMenu = (
      <div className={styles.mobileMainMenu}>
        <ul className={styles.innerMenuMobile}>
          {this.state.activeindex > -1 &&
            // this.createListElement(this.props.menudata[this.state.activeindex])}
            this.createMegaListElement(
              this.props.megaMenuData[this.state.activeindex]
            )}
        </ul>
      </div>
    );
    return this.state.showInnerMenu ? innerMenu : outerMenu;
  }
}
export default connect(mapStateToProps)(Mobilemenu);
