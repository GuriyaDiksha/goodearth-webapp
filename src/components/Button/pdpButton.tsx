import React from "react";
import { ButtonProps } from "./typings";
import Button from ".";
import cs from "classnames";
import globalStyles from "../../styles/global.scss";

const PdpButton: React.FC<ButtonProps> = ({
  label,
  disabled = false,
  onClick,
  className,
  variant
}) => (
  <Button
    className={cs(globalStyles.btnFullWidth, className)}
    label={label}
    onClick={onClick}
    variant={variant}
    disabled={disabled}
  />
);

export default PdpButton;
