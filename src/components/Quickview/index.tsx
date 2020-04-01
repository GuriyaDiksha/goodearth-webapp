import React from "react";
import styles from "./styles.scss";
import { QuickviewProps } from "./typings";
// import cs from "classnames";

class Quickview extends React.Component<QuickviewProps, {}> {
  constructor(props: QuickviewProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className={styles.quantityWrap}>hello</div>;
  }
}

export default Quickview;
