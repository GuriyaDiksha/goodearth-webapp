import React, { useState } from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import globalStyles from "../../../styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { Props } from "./typings";

const FormSelect: React.FC<Props & InjectedProps<string | null>> = props => {
  const [labelClass, setLabelClass] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.setValue(event.currentTarget.value);
    if (props.handleChange) {
      props.handleChange(event);
    }
  };

  const errorMessage = props.errorMessage
    ? props.errorMessage
    : !props.isPristine && !props.isValid
    ? "Please Select your Gender."
    : "";
  const options = props.options
    ? props.options.map((option, index) => {
        return (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        );
      })
    : "";

  return (
    <div className={props.className ? props.className : ""}>
      <select
        ref={props.ref}
        name={props.name}
        onChange={handleChange}
        value={props.value}
        className={errorMessage ? globalStyles.errorBorder : ""}
        disabled={props.disable}
        onFocus={() => setLabelClass(true)}
      >
        {!props.value && (
          <option key={props.placeholder}>{props.placeholder}</option>
        )}
        {options}
      </select>
      <label
        className={labelClass && !props.disable ? "" : globalStyles.hidden}
      >
        {props.label}
      </label>
      {errorMessage && <p className={globalStyles.errorMsg}>{errorMessage}</p>}
      <span
        className={cs(
          { [styles.arrow]: true },
          { [styles.disabledArrow]: props.disable }
        )}
      ></span>
    </div>
  );
};

export default withFormsy(FormSelect);
