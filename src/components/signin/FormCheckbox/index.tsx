import React from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import { Props } from "./typings";

const FormCheckbox: React.FC<Props &
  InjectedProps<string | boolean | null>> = props => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setValue(event.currentTarget.checked);
    props.handleChange && props.handleChange(event);
  };
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
