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
  const { inputRef, name, disable, id, label, value } = props;
  return (
    <>
      <input
        ref={inputRef}
        name={name}
        disabled={disable}
        onChange={handleChange}
        type="checkbox"
        id={id}
        checked={value || false}
      />
      <label htmlFor={id}>{label}</label>
    </>
  );
};
export default withFormsy(FormCheckbox);
