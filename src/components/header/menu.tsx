import React from "react";
import { Link } from "react-router-dom";
import { MenuProps, HeaderData, MenuState } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";

export default class MainMenu extends React.Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
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
        {data.map((data: HeaderData, i: number) => {
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
                this.props.ipad ? "" : this.mouseOver(i);
              }}
              onMouseLeave={(): void => {
                this.props.ipad ? "" : this.mouseLeave(i);
              }}
            >
              {highlightStories ? (
                <a
                  className={
                    this.props.ipad
                      ? cs(disbaleClass + styles.hoverA, styles.cerise)
                      : cs(disbaleClass + styles.hoverB, styles.cerise)
                  }
                  href={data.catLandingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.name}
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
                      ? disbaleClass + styles.hoverA
                      : disbaleClass + styles.hoverB
                  }
                >
                  {data.name}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  }
}
