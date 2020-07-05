import React from "react";
import cs from "classnames";
// import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
// import { Link } from "react-router-dom";
import { Props } from "../../typings";

export default class Section extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
  }

  render() {
    return (
      <div
        className={cs(bootstrapStyles.row, styles.hello, globalStyles.hello)}
      >
        hello
      </div>
    );
  }
}
