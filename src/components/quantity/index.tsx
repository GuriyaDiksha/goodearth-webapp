import React from "react";
import styles from "./styles.scss";
import { QuantityItem } from "./typings";
import cs from "classnames";

interface State {
  showError: boolean;
}

class Quantity extends React.Component<QuantityItem, State> {
  constructor(props: QuantityItem) {
    super(props);
    this.state = {
      showError: false
    };
  }
  render() {
    const value = this.props.currentValue;
    const props = this.props;
    const error = props.errorMsg ? props.errorMsg + " " + props.maxValue : "";
    return (
      <div className={styles.quantityWrap}>
        <span
          className={cs(styles.minusQuantity, styles.quantity)}
          onClick={(): void => {
            if (value > props.minValue) {
              props.onChange(value - 1);
              this.setState({ showError: false });
            } else {
              this.setState({ showError: true });
            }
          }}
        >
          -
        </span>
        <input type="text" value={value} readOnly className={styles.input} />
        <span
          className={cs(styles.plusQuantity, styles.quantity)}
          onClick={(): void => {
            if (value <= props.maxValue) {
              props.onChange(value + 1);
              this.setState({ showError: false });
            } else {
              this.setState({ showError: true });
            }
          }}
        >
          +
        </span>
        <p className={styles.errorMsg}>{this.state.showError ? error : ""}</p>
      </div>
    );
  }
}

export default Quantity;
