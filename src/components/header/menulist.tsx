import React from "react";
import { MenuListProps, HeaderData, MenuData } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";

class MenuList extends React.Component<MenuListProps> {
  constructor(props: MenuListProps) {
    super(props);
  }

  // Create a 2D array for which represent no of Columns
  createDataForHeader() {
    const data: HeaderData = this.props.menudata[this.props.activeIndex || 0];
    if (!data) return false;
    const rightData: MenuData[][] = data.rightMenu ? data.rightMenu : [[]];
    const leftData: MenuData[] = data.leftMenu ? data.leftMenu : [];
    if (!data) return false;
    return this.createListElement(
      rightData,
      leftData,
      data,
      data.image ? data.image : ""
    );
  }

  mouseLeave = () => {
    this.props.mouseOut({
      show: false
    });
  };

  mouseEnter = () => {
    this.props.mouseOut({ show: true });
  };

  onMenuClick(e: React.MouseEvent, url: string) {
    location.href = url;
    e.preventDefault();
  }

  createListElement(
    headerData: MenuData[][],
    leftMenu: MenuData[],
    imageurl: HeaderData,
    bigimage: string
  ) {
    if (headerData.length == 0) return false;
    const html = [];

    // code for first column has to be written below
    if (
      this.props.ipad &&
      !this.props.mobile &&
      leftMenu[0].name != "Featured "
    ) {
      leftMenu.splice(0, 0, {
        children: [],
        id: 100,
        labelDesktop: "",
        labelMobile: "",
        name: "Featured ",
        url: imageurl.catLandingUrl
      });
    }
    if (leftMenu.length > 0) {
      html.push(
        <ul className={bootstrap.colMd2}>
          {leftMenu.map((column, j) => {
            const spanClass =
              column.name.toLowerCase().indexOf("sale") > -1
                ? cs(styles.subheading, styles.menucolor)
                : styles.subheading;
            const columnUrlClass = column.url ? "" : styles.linkWithoutUrl;
            return (
              <div key={j}>
                <li>
                  <a
                    className={spanClass + columnUrlClass}
                    onClick={e => {
                      this.onMenuClick(e, column.url);
                    }}
                    href={column.url ? column.url : "#"}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: column.labelDesktop
                          ? column.labelDesktop
                          : column.name
                      }}
                    />
                  </a>
                </li>
                {column.children
                  ? column.children.map((data1, index) => {
                      return (
                        <li key={index}>
                          <a
                            href={data1.url}
                            onClick={e => {
                              this.onMenuClick(e, data1.url);
                            }}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: data1.labelDesktop
                                  ? data1.labelDesktop
                                  : data1.name
                              }}
                            />
                          </a>
                        </li>
                      );
                    })
                  : ""}
              </div>
            );
          })}
        </ul>
      );
    } else {
      html.push(<ul className={bootstrap.colMd2}></ul>);
    }
    headerData.map((data, i) => {
      html.push(
        <ul
          key={i}
          className={
            headerData.length - 1 == i ? bootstrap.colMd2 : bootstrap.colMd2
          }
        >
          {data.map((column, j) => {
            const class1 =
              column.name.toLowerCase().indexOf("sale") > -1
                ? cs(styles.menucolor, styles.subheading, styles.subheadingImg)
                : cs(styles.subheading, styles.subheadingImg);
            const class2 =
              column.name.toLowerCase().indexOf("sale") > -1
                ? cs(styles.menucolor, styles.subheading)
                : styles.subheading;
            return (
              <div key={j}>
                <li>
                  <a
                    className={
                      column.name.toLowerCase() == "winter velvets"
                        ? class1
                        : class2
                    }
                    href={column.url}
                    onClick={(e: React.MouseEvent): void => {
                      this.onMenuClick(e, column.url);
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: column.labelDesktop
                          ? column.labelDesktop
                          : column.name
                      }}
                    />
                  </a>
                </li>
                {column.children.map((data1, index) => {
                  const isSale =
                    data1.name.toLowerCase().indexOf("sale") > -1
                      ? true
                      : false;
                  return (
                    <li key={index}>
                      <a
                        href={data1.url}
                        onClick={(e: React.MouseEvent): void => {
                          this.onMenuClick(e, data1.url);
                        }}
                        className={isSale ? styles.menucolor : ""}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: data1.labelDesktop
                              ? data1.labelDesktop
                              : data1.name
                          }}
                        />
                      </a>
                    </li>
                  );
                })}
              </div>
            );
          })}
        </ul>
      );
    });

    bigimage
      ? html.push(
          <ul
            className={cs(
              bootstrap.voffSet4,
              bootstrap.colMd2,
              styles.imgHeader
            )}
          >
            <li>
              <div>
                <a
                  href={
                    imageurl.categoryImageUrl
                      ? imageurl.categoryImageUrl
                      : "JavaScript:Void(0);"
                  }
                >
                  <img src={bigimage} className={styles.imgResponsive} />
                </a>
              </div>
            </li>
          </ul>
        )
      : "";
    imageurl.categoryLogoImage
      ? html.push(
          <div className={styles.innerLogo}>
            <img
              src={imageurl.categoryLogoImage}
              className={styles.imgResponsive}
            />
          </div>
        )
      : "";
    return html;
  }

  render() {
    if (!this.props.menudata) return false;
    const data: HeaderData = this.props.menudata[this.props.activeIndex || 0];
    const emptyMenuHide =
      data && data.rightMenu && data.leftMenu
        ? data.rightMenu.length == 0 && data.leftMenu.length == 0
          ? true
          : false
        : false;
    return (
      <div
        className={
          emptyMenuHide
            ? styles.hidden
            : cs(bootstrap.colMd12, styles.innerMenu, bootstrap.row)
        }
        onMouseLeave={(): void => {
          this.mouseLeave();
        }}
        onMouseEnter={(): void => {
          this.mouseEnter();
        }}
      >
        {this.createDataForHeader()}
      </div>
    );
  }
}

export { MenuList };
