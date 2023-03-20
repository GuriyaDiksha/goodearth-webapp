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
  const {
    inputRef,
    name,
    disable,
    id,
    label,
    value,
    labelClassName,
    className,
    inputClassName
  } = props;
  return (
    <div className={className}>
      <input
        ref={inputRef}
        name={name}
        disabled={disable}
        onChange={handleChange}
        type="checkbox"
        id={id}
        checked={value || false}
        className={inputClassName}
      />
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
    </div>
  );
};
export default withFormsy(FormCheckbox);
