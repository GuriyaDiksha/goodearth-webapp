import React from "react";
import styles from "./styles.scss";
import { QuantityItem } from "./typings";

interface State {
  showerror: boolean;
}

class Quantity extends React.Component<QuantityItem, State> {
  constructor(props: QuantityItem) {
    super(props);
    this.state = {
      showerror: false
    };
  }
  render() {
    const value = this.props.currentvalue;
    const props = this.props;
    const error = props.errormsg ? props.errormsg + props.maxvalue : "";
    return (
      <div className={styles.quantityWrap}>
        <span
          className={styles.minusQuantity}
          onClick={(): void => {
            if (value > props.minvalue) {
              props.onChange(value - 1);
              this.setState({ showerror: false });
            } else {
              this.setState({ showerror: true });
            }
          }}
        >
          -
        </span>
        <input type="text" value={value} readOnly />
        <span
          className={styles.plusQuantity}
          onClick={(): void => {
            if (value <= props.maxvalue) {
              props.onChange(value + 1);
              this.setState({ showerror: false });
            } else {
              this.setState({ showerror: true });
            }
          }}
        >
          +
        </span>
        <p className={styles.errorMsg}>{this.state.showerror ? error : ""}</p>
      </div>
    );
  }
}

export default Quantity;
