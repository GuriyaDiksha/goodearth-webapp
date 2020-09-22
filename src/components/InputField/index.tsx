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
  disabled,
  validateAfterBlur
}) => {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");
  const [blurred, setBlurred] = useState(false);

  const onFocus = () => {
    setFocused(true);
  };

  const validate = (value: string) => {
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

    return error;
  };

  const onBlur = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    if (value) {
      validate(value);
      setBlurred(true);
    }
  };

  const onValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    let error = "";

    if ((validateAfterBlur && blurred) || !validateAfterBlur) {
      error = validate(value);
    }

    onChange && onChange(value, error);
  };

  return (
    <>
      <div className={cs(globalStyles.formFieldContainer, className)}>
        <input
          id={
            id ||
            Math.random()
              .toString(36)
              .substring(7)
          }
          autoComplete="off"
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onValueChange}
          value={value}
          name={name}
          placeholder={(!focused || disabled) && placeholder ? placeholder : ""}
          className={cs(styles.input, {
            [styles.error]: error || errorMsg,
            [styles.disabled]: disabled
          })}
        />
        {focused && !disabled && <div className={styles.label}>{label}</div>}
      </div>
      {(error || errorMsg) && (
        <span className={styles.inputError}>{error || errorMsg}</span>
      )}
    </>
  );
};

export default InputField;
