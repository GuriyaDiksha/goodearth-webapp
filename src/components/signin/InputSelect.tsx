import React from "react";

type Props = {
  name: string;
  value: string;
  onChange?: (event: React.ChangeEvent) => void;
  className?: string;
  disabled?: boolean;
  placeholder: string;
  errorMessage?: string;
  ref?: string;
  options: string[];
  label: string;
};

const InputSelect: React.FC<Props> = (props: Props) => {
  return (
    <div>
      <select
        ref={props.ref}
        name={props.name}
        onChange={e => (props.onChange ? props.onChange(e) : null)}
        value={props.value}
        className={props.className}
        disabled={props.disabled}
      >
        {!props.value && <option>{props.placeholder}</option>}
        {props.options.map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </select>
      {props.value && !props.disabled && (
        <label className="form-label">{props.label}</label>
      )}
      {props.errorMessage ? (
        <p className="error-msg">{props.errorMessage}</p>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputSelect;
