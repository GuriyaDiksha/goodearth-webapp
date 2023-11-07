import React from "react";
import styles from "./styles.scss";
import { ButtonProps } from "./typings";
import cs from "classnames";

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  className,
  variant,
  type = "button",
  ref = null,
  stopHover = false
}) => (
  <button
    type={type}
    className={cs(className, styles[`${variant}`], {
      [styles.stopHover]: stopHover
    })}
    onClick={(event): void => {
      if (onClick) {
        onClick(event);
      }
    }}
    disabled={disabled}
    ref={ref}
  >
    {label}
  </button>
);

export default Button;
