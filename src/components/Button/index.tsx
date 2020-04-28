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
        className={cs(styles.primaryButton, props.className, {
          [globalStyles.disabled]: props.disabled,
          [globalStyles.ceriseBtn]: !props.disabled
        })}
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
