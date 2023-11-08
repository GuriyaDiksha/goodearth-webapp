import React, { useCallback } from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import { Props } from "./typings";
import CheckboxWithLabel from "components/CheckboxWithLabel";

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
    <CheckboxWithLabel
      inputRef={inputRef}
      name={name}
      disabled={disable}
      onChange={handleChange}
      id={id}
      checked={value || false}
      inputClassName={inputClassName}
      className={className}
      label={[
        <label key={id} htmlFor={id} className={labelClassName}>
          {label}
        </label>
      ]}
    />
  );
};
export default withFormsy(FormCheckbox);
