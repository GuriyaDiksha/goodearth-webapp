import React from "react";
import styles from "./styles.scss";
import { ButtonProps } from "./typings";
import cs from "classnames";

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  className,
  variant
}) => (
  <button
    className={cs(className, styles[`${variant}`])}
    onClick={(event): void => {
      if (onClick) {
        onClick(event);
      }
    }}
    disabled={disabled}
  >
    {label}
  </button>
);

export default Button;
