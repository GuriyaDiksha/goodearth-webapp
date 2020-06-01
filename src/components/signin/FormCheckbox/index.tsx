import React, { useCallback } from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import { Props } from "./typings";

const FormCheckbox: React.FC<Props &
  InjectedProps<string | boolean | null>> = props => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setValue(event.currentTarget.checked);
      props.handleChange && props.handleChange(event);
    },
    [props.handleChange]
  );
  return (
    <>
      <input
        ref={props.inputRef}
        name={props.name}
        disabled={props.disable}
        onChange={handleChange}
        type="checkbox"
        id={props.id}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </>
  );
};
export default withFormsy(FormCheckbox);
