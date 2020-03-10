import React from "react";
import styles from "./styles.scss";
import { QuantityItem, State } from "./typings";
import cs from "classnames";

class Quantity extends React.Component<QuantityItem, State> {
  constructor(props: QuantityItem) {
    super(props);
    this.state = {
      showError: false
    };
  }

  componentDidUpdate(prevProps: QuantityItem) {
    if (this.props.id !== prevProps.id) {
      this.setState({
        showError: false
      });
    }
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
            }
          }}
        >
          -
        </span>
        <input type="text" value={value} readOnly className={styles.input} />
        <span
          className={cs(styles.plusQuantity, styles.quantity)}
          onClick={(): void => {
            if (value < props.maxValue) {
              props.onChange(value + 1);
              this.setState({ showError: false });
            } else {
              props.onChange(value);
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
