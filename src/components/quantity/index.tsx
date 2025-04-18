import React from "react";
import styles from "./styles.scss";
import { QuantityItem, State } from "./typings.d";
import cs from "classnames";

class Quantity extends React.Component<QuantityItem, State> {
  constructor(props: QuantityItem) {
    super(props);
    this.state = {
      showError: false,
      disableButton: false,
      errorMsg: `Only ${props.currentValue} piece${
        props.currentValue > 1 ? "s" : ""
      } available in stock`
    };
  }

  componentDidUpdate(prevProps: QuantityItem) {
    if (this.props.id !== prevProps.id) {
      this.setState({
        showError: false
      });
    }
  }

  // for updating quantity of line item
  onUpdate = (value: number) => {
    this.setState({
      disableButton: true
    });
    this.props.onUpdate &&
      this.props
        .onUpdate(value)
        .then(() => {
          this.setState({ showError: false, disableButton: false });
        })
        .catch(err => {
          this.setState({
            showError: true,
            disableButton: false,
            errorMsg: `Only ${this.props.currentValue} piece${
              this.props.currentValue > 1 ? "s" : ""
            } available in stock`
          });
        });
  };

  render() {
    const value = this.props.currentValue;
    const props = this.props;
    const { disabled, source } = this.props;
    // const error = props.errorMsg ? props.errorMsg + " " + props.maxValue : "";
    // const error

    return (
      <>
        <span
          className={cs(styles.minusQuantity, styles.quantity, props.class)}
          onClick={(): void => {
            if (disabled || this.state.disableButton) {
              return;
            }
            if (value > props.minValue) {
              if (source == "bag" || source == "cartpage") {
                this.onUpdate(value - 1);
              } else {
                props.onChange(value - 1);
                this.setState({ showError: false });
              }
            }
          }}
        >
          -
        </span>
        <span
          className={cs(
            styles.input,
            props.inputClass,
            { [styles.inputPdp]: source == "pdp" },
            { [styles.inputCart]: source == "cartPage" },
            {}
          )}
        >
          {value}
        </span>
        <span
          className={cs(styles.plusQuantity, styles.quantity, props.class)}
          onClick={(): void => {
            if (disabled || this.state.disableButton) {
              return;
            }
            if (value < props.maxValue) {
              if (source == "bag" || source == "cartpage") {
                this.onUpdate(value + 1);
              } else {
                props.onChange(value + 1);
                this.setState({ showError: false });
              }
            } else if (props.maxValue) {
              props.onChange(value);
              if (props.id) {
                this.setState({
                  showError: true,
                  errorMsg: `Only ${props.currentValue} piece${
                    props.currentValue > 1 ? "s" : ""
                  } available in stock`
                });
              }
            }
          }}
        >
          +
        </span>
        {this.state.showError ? (
          source == "bag" || source == "cartpage" ? (
            ""
          ) : (
            <p
              className={cs(
                styles.errorMsg,
                { [styles.left]: source == "pdp" },
                {
                  // [styles.noBottom]: props.source == "cartpage"
                },
                {
                  [styles.fontStyle]: source == "bag" || source == "cartpage"
                },
                {
                  [styles.cartPageFixes]: source == "cartpage"
                }
              )}
            >
              {this.state.errorMsg}
            </p>
          )
        ) : (
          ""
        )}
      </>
    );
  }
}

export default Quantity;
