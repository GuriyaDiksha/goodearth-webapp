import React from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";

type Props = {
  id: string;
  name: string;
  disable: boolean;
  handleChange?: (event: React.ChangeEvent) => void;
  label: (string | JSX.Element)[];
};
const FormCheckbox: React.FC<Props & InjectedProps<string | boolean | null>> = (
  props: Props & InjectedProps<string | boolean | null>
) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setValue(event.currentTarget.checked);
    props.handleChange && props.handleChange(event);
  };
  return (
    <>
      <input
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
