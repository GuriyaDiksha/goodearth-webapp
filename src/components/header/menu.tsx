import React from "react";
import { Link } from "react-router-dom";
import { MenuProps, HeaderData, MenuState } from "./typings";
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
type Props = MenuProps & ReturnType<typeof mapStateToProps>;

class MainMenu extends React.Component<Props, MenuState> {
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

  UNSAFE_componentWillReceiveProps(nextProps: MenuProps, prevState: MenuState) {
    if (!nextProps.show) {
      this.setState({ selectedCategory: -1 });
    }
  }

  render() {
    const { data, location } = this.props;
    return (
      <ul className={styles.menuContainer}>
        {data?.map((data: HeaderData, i: number) => {
          const isBridalRegistryPage =
            location.pathname.indexOf("/bridal/") > 0;
          const disbaleClass =
            location.pathname.indexOf("/bridal/") > 0
              ? styles.iconStyleDisabled
              : "";
          const highlightStories =
            data.name.toLowerCase() == "stories" ? true : false;

          return (
            <li
              key={i + "header"}
              className={styles.menuItem}
              onMouseOver={(): void => {
                this.props.ipad || highlightStories ? "" : this.mouseOver(i);
              }}
              onMouseLeave={(): void => {
                this.props.ipad || highlightStories ? "" : this.mouseLeave(i);
              }}
            >
              {highlightStories ? (
                <a
                  className={cs(disbaleClass, styles.hoverStories, {
                    [styles.cerise]: !this.props.isSale
                  })}
                  href={data.catLandingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ReactHtmlParser(data.name)}
                </a>
              ) : (
                <Link
                  to={
                    isBridalRegistryPage
                      ? "javascript:void(0)"
                      : data.catLandingUrl
                  }
                  className={
                    this.state.selectedCategory == i ||
                    (highlightStories && this.props.ipad)
                      ? cs(disbaleClass, styles.hoverA)
                      : cs(disbaleClass, styles.hoverB)
                  }
                >
                  {ReactHtmlParser(
                    data.labelDesktop ? data.labelDesktop : data.name
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

export default connect(mapStateToProps)(MainMenu);
