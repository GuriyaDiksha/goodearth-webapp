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
    const { disabled } = this.props;
    const error = props.errorMsg ? props.errorMsg + " " + props.maxValue : "";

    return (
      <>
        <div className={cs(styles.quantityWrap, props.className)}>
          <span
            className={cs(styles.minusQuantity, styles.quantity, props.class)}
            onClick={(): void => {
              if (disabled) {
                return;
              }
              if (value > props.minValue) {
                props.onChange(value - 1);
                this.setState({ showError: false });
              }
            }}
          >
            -
          </span>
          <input type="text" value={value} readOnly className={styles.input} />
          <span
            className={cs(styles.plusQuantity, styles.quantity, props.class)}
            onClick={(): void => {
              if (disabled) {
                return;
              }
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
        </div>
        <p className={styles.errorMsg}>{this.state.showError ? error : ""}</p>
      </>
    );
  }
}

export default Quantity;
