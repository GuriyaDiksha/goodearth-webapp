import React from "react";
import { Props } from "./typings";
import globalStyles from "../../../styles/global.scss";
import styles from "../styles.scss";

const InputSelect: React.FC<Props> = props => {
  return (
    <div>
      <select
        ref={props.selectRef}
        name={props.name}
        onChange={e => (props.onChange ? props.onChange(e) : null)}
        value={props.value}
        className={props.className}
        disabled={props.disabled}
      >
        {!props.value && <option>{props.placeholder}</option>}
        {props.options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
      {props.value && !props.disabled && (
        <label className={styles.label}>{props.label}</label>
      )}
      {props.errorMessage && (
        <p className={globalStyles.errorMsg}>{props.errorMessage}</p>
      )}
    </div>
  );
};

export default InputSelect;
