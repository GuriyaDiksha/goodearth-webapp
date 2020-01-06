import React from "react";
import styles from "./styles.scss";
import { ButtonProps } from "./typings";

class Button extends React.Component<ButtonProps> {
  constructor(props: ButtonProps) {
    super(props);
  }
  render() {
    const props = this.props;
    return (
      <div>
        <button
          className={props.disable ? styles.buttondisable : styles.cerisebtn}
        >
          {props.label}
        </button>
      </div>
    );
  }
}

export default Button;
