import React, { useState } from "react";
import cs from "classnames";

import { Props } from "./typings";

import globalStyles from "styles/global.scss";
import styles from "./styles.scss";

const InputField: React.FC<Props> = ({
  value,
  validator,
  id,
  onChange,
  name,
  label,
  className,
  placeholder,
  errorMsg,
  disabled
}) => {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const onFocus = () => {
    setFocused(true);
  };

  const onValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    let error = "";

    if (validator) {
      const { valid, message } = validator(value);

      if (!valid) {
        error = message || "Please enter valid input";
        setError(error);
      } else {
        setError("");
      }
    }

    onChange && onChange(value, error);
  };

  return (
    <div className={cs(globalStyles.formFieldContainer, className)}>
      <input
        id={
          id ||
          Math.random()
            .toString(36)
            .substring(7)
        }
        disabled={disabled}
        onFocus={onFocus}
        onChange={onValueChange}
        value={value}
        name={name}
        placeholder={!focused && placeholder ? placeholder : ""}
        className={cs(styles.input, {
          [styles.error]: error || errorMsg,
          [styles.disabled]: disabled
        })}
      />
      {focused && <div className={styles.label}>{label}</div>}
      {(error || errorMsg) && (
        <span className={styles.inputError}>{error || errorMsg}</span>
      )}
    </div>
  );
};

export default InputField;
