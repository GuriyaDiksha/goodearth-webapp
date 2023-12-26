import React, { FC } from "react";
import styles from "./styles.scss";
import { CheckboxProps } from "./typings";
import cs from "classnames";

const CheckboxWithLabel: FC<CheckboxProps> = ({
  inputClassName,
  onChange,
  inputRef,
  id,
  name,
  disabled,
  checked,
  label,
  className,
  value
}) => {
  return (
    <div className={cs(styles.aquaWhiteCheckbox, className)}>
      <input
        ref={inputRef}
        name={name}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
        id={id}
        checked={checked}
        className={cs(inputClassName)}
        value={value}
      />
      {label}
    </div>
  );
};

export default CheckboxWithLabel;
