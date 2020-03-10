import React from "react";
import styles from "./styles.scss";
import { ButtonProps } from "./typings";
import cs from "classnames";
import globalStyles from "../../styles/global.scss";

class Button extends React.Component<ButtonProps> {
  render() {
    const props = this.props;
    return (
      <button
        className={
          props.disabled
            ? cs(globalStyles.disabled, styles.primaryButton)
            : cs(globalStyles.ceriseBtn, styles.primaryButton)
        }
        onClick={(event): void => {
          if (props.onClick) {
            props.onClick(event);
          }
        }}
      >
        {props.label}
      </button>
    );
  }
}

export default Button;
