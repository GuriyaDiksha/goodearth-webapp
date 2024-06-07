import React, { FC } from "react";
import styles from "./styles.scss";
import { CheckboxProps } from "./typings";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

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
  value,
  itemCount
}) => {
  const { mobile } = useSelector((state: AppState) => state.device);
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
      {label} {mobile && <span className={styles.itemCount}>{itemCount}</span>}
    </div>
  );
};

export default CheckboxWithLabel;
