import React, { useCallback } from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import styles from "../styles.scss";

const FormTime: React.FC<Props &
  InjectedProps<string | boolean | null>> = props => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setValue(event.target.value);
      props.handleChange && props.handleChange(event);
    },
    [props.handleChange]
  );
  const { inputRef, name, disable, id, label } = props;

  const errorMessage =
    props.errorMessage && !!props.disable
      ? props.errorMessage
      : !props.isPristine && !props.isValid && !props.disable
      ? "This field is required"
      : "";
  console.log(props.errorMessage, props.isPristine, props.isRequired);
  return (
    <>
      <input
        ref={inputRef}
        name={name}
        disabled={disable}
        onChange={handleChange}
        type="time"
        id={id}
        className={cs(
          { [globalStyles.errorBorder]: errorMessage },
          { [styles.disabledInput]: props.disable }
        )}
      />
      <label htmlFor={id}>{label}</label>
      {errorMessage && (
        <p className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}>
          {errorMessage}
        </p>
      )}
    </>
  );
};
export default withFormsy(FormTime);
