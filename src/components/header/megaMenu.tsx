import React from "react";
import { Link } from "react-router-dom";
import { MenuState, MegaMenuProps, MegaMenuData } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "../../styles/global.scss";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import * as util from "../../utils/validate";
import { MegaMenuList } from "./megaMenulist";

const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale,
    mobile: state.device.mobile,
    isLoggedIn: state.user.isLoggedIn,
    showTimer: state.info.showTimer
  };
};
type Props = MegaMenuProps & ReturnType<typeof mapStateToProps>;

class MegaMenu extends React.Component<Props, MenuState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedCategory: -1
    };
  }

  mouseLeave = (index: number): void => {
    this.props.mouseOver({ show: false, activeIndex: index });
  };

  mouseOver = (index: number): void => {
    this.props.mouseOver({ show: true, activeIndex: index });
    this.setState({
      selectedCategory: index
    });
  };

  UNSAFE_componentWillReceiveProps(
    nextProps: MegaMenuProps,
    prevState: MenuState
  ) {
    if (!nextProps.show) {
      this.setState({ selectedCategory: -1 });
    }
  }

  onHeaderMenuClick = (name: string, url: string) => {
    const { mobile, isLoggedIn } = this.props;
    util.headerClickGTM("Main Menu", "Top", mobile, isLoggedIn);
    const obj = {
      l1: util.getInnerText(name),
      l2: "",
      l3: "",
      clickUrl1: url,
      clickUrl2: "",
      clickUrl3: "",
      template: "",
      img2: "",
      img3: "",
      cta: "",
      subHeading: "",
      mobile: mobile,
      isLoggedIn: isLoggedIn
    };
    util.megaMenuNavigationGTM(obj);
  };

  render() {
    const { data, location } = this.props;
    const isBridalRegistryPage =
      location.pathname.indexOf("/bridal/") > -1 &&
      !location.pathname.includes("/account/");
    const disbaleClass =
      location.pathname.indexOf("/bridal/") > -1 &&
      !location.pathname.includes("/account/")
        ? styles.iconStyleDisabled
        : "";
    return (
      <ul className={cs(styles.menuContainer, globalStyles.static)}>
        {data?.map((data: MegaMenuData, i: number) => {
          const highlightStories =
            data.text.toLowerCase() == "stories" ? true : false;
          const highlightSale =
            util.getInnerText(data.text.toLowerCase()) == "sale";
          // const isGifting = data.text.toLowerCase() == "gifting" ? true : false;
          const isEmpty = data.columns[0].templates.length == 0;
          return (
            <li
              key={i + "header"}
              className={cs(styles.menuItem, disbaleClass)}
              onMouseEnter={() => {
                this.props.ipad ||
                highlightStories ||
                // isGifting ||
                isEmpty ||
                isBridalRegistryPage
                  ? ""
                  : this.mouseOver(i);
              }}
              onMouseLeave={() => {
                this.props.ipad ||
                highlightStories ||
                // isGifting ||
                isEmpty ||
                isBridalRegistryPage
                  ? ""
                  : this.mouseLeave(i);
              }}
            >
              {highlightStories ||
              // || isGifting
              isEmpty ? (
                isBridalRegistryPage ? (
                  <span
                    className={cs(
                      styles.disabledMenuItemStories,
                      styles.iconStyleDisabled
                    )}
                  >
                    {ReactHtmlParser(data.text)}
                  </span>
                ) : (
                  <Link
                    className={cs(
                      styles.menuItemLink,
                      disbaleClass,
                      styles.hoverStories,
                      {
                        [styles.cerise]: highlightSale
                      }
                    )}
                    to={isBridalRegistryPage ? "" : data.url}
                    onClick={() => this.onHeaderMenuClick(data.text, data.url)}
                    // target="_blank"
                    // rel="noopener noreferrer"
                  >
                    {ReactHtmlParser(data.text)}
                  </Link>
                )
              ) : (
                <Link
                  to={isBridalRegistryPage ? "#" : data.url}
                  onClick={() => this.onHeaderMenuClick(data.text, data.url)}
                  className={cs(
                    styles.menuItemLink,
                    {
                      [styles.cerise]: highlightSale
                    },
                    this.state.selectedCategory == i ||
                      (highlightStories && this.props.ipad)
                      ? cs(disbaleClass, styles.hoverA)
                      : cs(disbaleClass, styles.hoverB)
                  )}
                >
                  {ReactHtmlParser(
                    this.props.isSale && data.text ? data.text : data.text
                  )}
                </Link>
              )}
              <div
                id={`mega-menu-list-${i}`}
                className={cs(
                  styles.mainMenuAnimation,
                  { [styles.mainMenuAnimationTimer]: this.props.showTimer },
                  this.props.show
                    ? cs(styles.dropdownMenuBar, styles.mainMenu, bootstrap.row)
                    : styles.hidden
                )}
              >
                <MegaMenuList
                  ipad={false}
                  onHeaderMegaMenuClick={this.props.onMegaMenuClick}
                  activeIndex={this.props.activeIndex}
                  myIndex={i}
                  mouseOut={(data): void => {
                    this.props.mouseOver({ ...data, activeIndex: i });
                  }}
                  show={this.props.show}
                  menudata={data}
                  mobile={this.props.mobile}
                />
              </div>
            </li>
          );
        })}
        {/* <li key="gifting" className={cs(styles.menuItem, disbaleClass)}>
          {isBridalRegistryPage ? (
            <span
              className={cs(
                styles.disabledMenuItemStories,
                styles.iconStyleDisabled
              )}
            >
              {ReactHtmlParser("gifting")}
            </span>
          ) : (
            <Link
              to="/gifting"
              onClick={() => this.onHeaderMenuClick("gifting", "/gifting")}
              className={cs(
                disbaleClass,
                styles.menuItemLink,
                styles.hoverStories
              )}
            >
              {ReactHtmlParser("gifting")}
            </Link>
          )}
        </li> */}
        <li key="stories" className={cs(styles.menuItem, disbaleClass)}>
          {isBridalRegistryPage ? (
            <span
              className={cs(
                styles.disabledMenuItemStories,
                styles.iconStyleDisabled
              )}
            >
              {ReactHtmlParser("stories")}
            </span>
          ) : (
            <a
              className={cs(
                styles.menuItemLink,
                disbaleClass,
                styles.hoverStories,
                {
                  [styles.cerise]: !this.props.isSale
                }
              )}
              href="/stories"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => this.onHeaderMenuClick("stories", "/stories")}
            >
              {ReactHtmlParser("stories")}
            </a>
          )}
        </li>
      </ul>
    );
  }
}

export default React.memo(connect(mapStateToProps)(MegaMenu));
