import React, { useState, useCallback } from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import globalStyles from "../../../styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { Props } from "./typings";
import { currencyCodes } from "constants/currency";

const FormSelect: React.FC<Props & InjectedProps<string | null>> = props => {
  const [labelClass, setLabelClass] = useState(false);

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
        return "Please select your Gender";
      case "country":
        return "Please select your Country";
      case "state":
        return "Please select your State";
      case "preferredContact":
        return "Please choose a preferred mode of contact";
      default:
        return "Please Select option";
    }
  }, []);

  const errorMessage =
    props.errorMessage && !!props.disable
      ? props.errorMessage
      : (!props.isPristine || props.errWithIsPristine) &&
        !props.isValid &&
        !props.disable
      ? getDefaultError()
      : "";
  const options = props.options
    ? props.options.map((option, index) => {
        return (
          <option key={option.label} value={option.value}>
            {option.label}
            {props.countryData && props.countryData[option.label]
              ? ` (${props.countryData[option.label]} ${
                  props.currencyCharCode
                    ? String.fromCharCode(
                        ...currencyCodes[
                          props.countryData[
                            option.label
                          ] as keyof typeof currencyCodes
                        ]
                      )
                    : ""
                })`
              : ""}
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
          { [styles.default]: !props.value },
          { [styles.black]: props.value },
          { [styles.disabledInput]: props.disable },
          { [globalStyles.pointer]: !props.disable }
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
        className={cs({
          [globalStyles.hidden]: props.showLabel
            ? false
            : props.value
            ? false
            : labelClass
            ? false
            : true
        })}
      >
        {props.label}
      </label>
      {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>}
      <span
        className={cs(
          { [styles.arrow]: true },
          { [styles.disabledArrow]: props.disable },
          { [globalStyles.pointer]: !props.disable }
        )}
      ></span>
    </div>
  );
};

export default withFormsy(FormSelect);
