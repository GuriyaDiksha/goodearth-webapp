import React from "react";
import styles from "./styles.scss";
import { QuantityItem } from "./typings";

class Quantity extends React.Component<QuantityItem> {
  constructor(props: QuantityItem) {
    super(props);
  }

  render() {
    const value = this.props.currentvalue;
    const props = this.props;
    return (
      <div className={styles.quantitywrap}>
        <span
          className={styles.minusquantity}
          onClick={(event): void => {
            props.onChange;
          }}
        >
          -
        </span>
        <input type="text" value={value} readOnly />
        <span
          className={styles.plusquantity}
          onClick={(event): void => {
            props.onChange;
          }}
        >
          +
        </span>
      </div>
    );
  }
}

export default Quantity;
