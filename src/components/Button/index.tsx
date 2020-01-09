import React from "react";
import styles from "./styles.scss";
import { ButtonProps } from "./typings";
import cs from "classnames";

class Button extends React.Component<ButtonProps> {
  render() {
    const props = this.props;
    return (
      <div>
        <button
          className={
            props.disable
              ? cs(styles.buttonDisable, styles.primaryButton)
              : cs(styles.ceriseBtn, styles.primaryButton)
          }
          onClick={(event): void => {
            if (props.onClick) {
              props.onClick(event);
            }
          }}
        >
          {props.label}
        </button>
      </div>
    );
  }
}

export default Button;
