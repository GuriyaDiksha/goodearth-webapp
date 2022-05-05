import React from "react";
import styles from "./styles.scss";
import { ButtonProps } from "./typings";
import cs from "classnames";
import globalStyles from "../../styles/global.scss";

class PdpButton extends React.Component<ButtonProps> {
  render() {
    const props = this.props;
    return (
      <button
        className={cs(styles.pdpPrimaryButton, props.className, {
          [globalStyles.disabled]: props.disabled,
          [globalStyles.ceriseBtn]: !props.disabled,
          [styles.notifyMeCta]: props.label == "Notify Me"
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

export default PdpButton;
