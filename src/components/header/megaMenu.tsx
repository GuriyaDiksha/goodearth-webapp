import React from "react";
import { Link } from "react-router-dom";
import { MenuState, MegaMenuProps, MegaMenuData } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";
import { AppState } from "reducers/typings";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";

const mapStateToProps = (state: AppState) => {
  return {
    isSale: state.info.isSale
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
    this.props.onMouseOver({ show: false, activeIndex: index });
  };

  mouseOver = (index: number): void => {
    this.props.onMouseOver({ show: true, activeIndex: index });
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

  render() {
    const { data, location } = this.props;
    return (
      <ul className={styles.menuContainer}>
        {data?.map((data: MegaMenuData, i: number) => {
          const isBridalRegistryPage =
            location.pathname.indexOf("/bridal/") > -1;
          const disbaleClass =
            location.pathname.indexOf("/bridal/") > -1
              ? styles.iconStyleDisabled
              : "";
          const highlightStories =
            data.text.toLowerCase() == "stories" ? true : false;

          return (
            <li
              key={i + "header"}
              className={cs(styles.menuItem, disbaleClass)}
              onMouseOver={(): void => {
                this.props.ipad || highlightStories || isBridalRegistryPage
                  ? ""
                  : this.mouseOver(i);
              }}
              onMouseLeave={(): void => {
                this.props.ipad || highlightStories || isBridalRegistryPage
                  ? ""
                  : this.mouseLeave(i);
              }}
            >
              {highlightStories ? (
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
                  <a
                    className={cs(disbaleClass, styles.hoverStories, {
                      [styles.cerise]: !this.props.isSale
                    })}
                    href={isBridalRegistryPage ? "" : data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ReactHtmlParser(data.text)}
                  </a>
                )
              ) : (
                <Link
                  to={isBridalRegistryPage ? "#" : data.url}
                  className={
                    this.state.selectedCategory == i ||
                    (highlightStories && this.props.ipad)
                      ? cs(disbaleClass, styles.hoverA)
                      : cs(disbaleClass, styles.hoverB)
                  }
                >
                  {ReactHtmlParser(
                    this.props.isSale && data.text ? data.text : data.text
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default connect(mapStateToProps)(MegaMenu);
