import React from "react";
import { MobileListProps, MobileState, HeaderData } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";

class Mobilemenu extends React.Component<MobileListProps, MobileState> {
  constructor(props: MobileListProps) {
    super(props);
    this.state = {
      activeindex: -1,
      showmenulevel1: false,
      showmenulevel2: false,
      activeindex2: -1,
      activeindex3: -1,
      showmenulevel3: false
    };
  }

  Clickmenulevel1(index: number) {
    if (location.href.indexOf("/bridal/") > 0) {
      return false;
    }
    index == this.state.activeindex
      ? this.setState({
          activeindex: index,
          showmenulevel1: !this.state.showmenulevel1
        })
      : this.setState({ activeindex: index, showmenulevel1: true });
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

  createListElement(headerData: HeaderData) {
    const html = [];
    const leftData = headerData.leftMenu || [];
    const rightData = headerData.rightMenu || [];
    headerData.name.toLowerCase() == "stories"
      ? ""
      : html.push(
          <li>
            <a href={headerData.catLandingUrl}>
              {" "}
              <span className="">Featured</span>
            </a>
          </li>
        );
    let k = 0;
    leftData.map((data, j) => {
      let spanClass =
        this.state.showmenulevel2 && this.state.activeindex2 == k
          ? cs(styles.menulevel2, styles.menulevel2Open)
          : styles.menulevel2;
      data.name.toLowerCase() == "winter velvets"
        ? (spanClass += styles.subheadingImg)
        : "";
      spanClass +=
        data.name.toLowerCase().indexOf("sale") > -1 ? styles.menucolor : "";
      html.push(
        data.url && data.children.length == 0 ? (
          <li key={j}>
            <a href={data.url}>
              <span
                dangerouslySetInnerHTML={{
                  __html: data.labelMobile ? data.labelMobile : data.name
                }}
              />
            </a>
          </li>
        ) : (
          <li>
            <span
              className={spanClass}
              onClick={this.Clickmenulevel2.bind(this, k)}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: data.labelMobile ? data.labelMobile : data.name
                }}
              />
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
                    <li>
                      <a href={data.url}>View All</a>
                    </li>
                  ) : (
                    ""
                  )}
                  {data.children.map((innerdata, i) => {
                    return (
                      <li key={i}>
                        <a
                          href={innerdata.url}
                          className={
                            innerdata.name.toLowerCase().indexOf("sale") > -1
                              ? styles.menucolor
                              : ""
                          }
                        >
                          <p
                            dangerouslySetInnerHTML={{
                              __html: innerdata.labelMobile
                                ? innerdata.labelMobile
                                : innerdata.name
                            }}
                          />
                        </a>
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
          ? (spanClass += styles.subheadingImg)
          : "";
        spanClass +=
          data.name.toLowerCase().indexOf("sale") > -1 ? styles.menucolor : "";
        html.push(
          data.url && data.children.length == 0 ? (
            <li key={j}>
              <a href={data.url}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: data.labelMobile ? data.labelMobile : data.name
                  }}
                />
              </a>
            </li>
          ) : (
            <li key={j}>
              <span
                className={spanClass}
                onClick={this.Clickmenulevel2.bind(this, k)}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: data.labelMobile ? data.labelMobile : data.name
                  }}
                />
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
                      <li>
                        <a href={data.url}>View All</a>
                      </li>
                    ) : (
                      ""
                    )}
                    {data.children.map((innerdata, i) => {
                      return (
                        <li key={i}>
                          <a
                            href={innerdata.url}
                            className={
                              innerdata.name.toLowerCase().indexOf("sale") > -1
                                ? styles.menucolor
                                : ""
                            }
                          >
                            <p
                              dangerouslySetInnerHTML={{
                                __html: innerdata.labelMobile
                                  ? innerdata.labelMobile
                                  : innerdata.name
                              }}
                            />
                          </a>
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
    return html;
  }

  render() {
    return (
      <ul className={styles.mobileMainMenu}>
        {this.props.menudata.map((data, i) => {
          return (
            <li
              key={i}
              className={
                location.href.indexOf("/bridal/") > 0
                  ? styles.iconStyleDisabled
                  : ""
              }
            >
              <span
                className={
                  this.state.activeindex == i && this.state.showmenulevel1
                    ? cs(styles.menulevel1, styles.menulevel1Open)
                    : styles.menulevel1
                }
                onClick={this.Clickmenulevel1.bind(this, i)}
              >
                {data.name}
              </span>
              <p
                className={
                  this.state.activeindex == i && this.state.showmenulevel1
                    ? styles.showheader1
                    : styles.hidden
                }
              >
                <ul>{this.createListElement(this.props.menudata[i])}</ul>
              </p>
            </li>
          );
        })}
      </ul>
    );
  }
}
export default Mobilemenu;
