import React, { useState, useCallback, useEffect } from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import globalStyles from "../../../styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { Props } from "./typings";

const FormSelect: React.FC<Props & InjectedProps<string | null>> = props => {
  const [labelClass, setLabelClass] = useState(false);

  useEffect(() => {
    !labelClass && props.value && setLabelClass(true);
  }, [props.isPristine]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      props.setValue(event.currentTarget.value);
      if (props.handleChange) {
        props.handleChange(event);
      }
    },
    [props.handleChange]
  );

  const getDefaultError = useCallback(() => {
    switch (props.name) {
      case "gender":
        return "Please Select your gender";
      case "country":
        return "Please Select Country";
      case "state":
        return "Please Select State";
    }
  }, []);

  const errorMessage =
    props.errorMessage && !!props.disable
      ? props.errorMessage
      : !props.isPristine && !props.isValid && !props.disable
      ? getDefaultError()
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
    <div className={props.className}>
      <select
        ref={props.ref}
        name={props.name}
        onChange={handleChange}
        value={props.value}
        className={cs(
          { [globalStyles.errorBorder]: errorMessage },
          { [styles.disabledInput]: props.disable }
        )}
        disabled={props.disable}
        onFocus={() => setLabelClass(true)}
      >
        {!props.value && (
          <option key={props.placeholder}>{props.placeholder}</option>
        )}
        {options}
      </select>
      <label
        className={cs({ [globalStyles.hidden]: !labelClass || props.disable })}
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
