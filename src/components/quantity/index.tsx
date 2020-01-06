import React from "react";
import styles from "./styles.scss";
import { QuantityItem } from "./typings";

class Quantity extends React.Component<QuantityItem> {
  constructor(props: QuantityItem) {
    super(props);
  }

  render() {
    const value = this.props.currentvalue;
    return (
      <div className={styles.quantitywrap}>
        <span
          className={styles.minusquantity}
          onClick={e => {
            this.props.onChange;
          }}
        >
          -
        </span>
        <input type="text" value={value} readOnly />
        <span className={styles.plusquantity}>+</span>
      </div>
    );
  }
}

export default Quantity;
