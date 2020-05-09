import React, { useEffect, useState } from "react";
import { withFormsy } from "formsy-react";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import { InjectedProps } from "formsy-react/dist/Wrapper";

const FormInput: React.FC<Props & InjectedProps<string | null>> = (
  props: Props & InjectedProps<string | null>
) => {
  const [labelClass, setLabelClass] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder || "");

  const handleClick = (event: React.MouseEvent | React.FocusEvent) => {
    if (!labelClass || placeholder !== "") {
      setLabelClass(true);
      setPlaceholder("");
    }
  };

  const handleClickBlur = (event: React.FocusEvent) => {
    if (!labelClass || placeholder !== "") {
      setLabelClass(true);
      setPlaceholder("");
    }
    props.blur && props.isValid ? props.blur(event) : "";
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setValue(event.currentTarget.value);
    if (props.handleChange) {
      props.handleChange(event);
    }
  };

  useEffect(() => {
    if (props.isPlaceholderVisible && placeholder === "") {
      setPlaceholder(props.placeholder);
      setLabelClass(false);
    }
  });
  const getRequiredErrorMessage = (name: string) => {
    switch (name) {
      case "email":
        return "";
      case "first_name":
        return "Please Enter First Name";
      case "last_name":
        return "Please Enter Last Name";
      case "dateOfBirth":
        return "Please enter valid date of birth";
      case "phone_no":
        return "";
      case "password1":
        return "Please enter at least 6 characters for the password";
      case "password2":
        return "Please enter at least 6 characters for the password";
    }
  };
  const errorMessage = props.errorMessage
    ? props.errorMessage
    : !props.isPristine && !props.isValid
    ? getRequiredErrorMessage(props.name)
    : "";
  return (
    <div className={props.className ? props.className : ""}>
      <input
        type={props.type || "text"}
        id={
          props.id ||
          Math.random()
            .toString(36)
            .substring(7)
        }
        name={props.name}
        className={
          errorMessage || false
            ? globalStyles.errorBorder
            : props.inputClass || ""
        }
        value={props.value || ""}
        placeholder={placeholder}
        onChange={e => handleChange(e)}
        autoComplete="new-password"
        onBlur={e => handleClickBlur(e)}
        onFocus={e => handleClick(e)}
        onKeyPress={e => (props.keyPress ? props.keyPress(e) : null)}
        onKeyUp={e => (props.isValid && props.keyUp ? props.keyUp(e) : null)}
        onDrop={
          props.isDrop
            ? e => {
                e.preventDefault();
              }
            : undefined
        }
        onPaste={
          props.isPaste
            ? e => {
                e.preventDefault();
              }
            : undefined
        }
        min={props.min || ""}
        max={props.max || ""}
        ref={props.inputRef || null}
        disabled={props.disable || false}
      />
      <label
        className={
          (labelClass && !props.disable) || false ? "" : globalStyles.hidden
        }
        id={
          props.id ||
          Math.random()
            .toString(36)
            .substring(7)
        }
      >
        {props.label || ""}
      </label>
      {errorMessage || "" ? (
        <p className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}>
          {errorMessage}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default withFormsy(FormInput);
