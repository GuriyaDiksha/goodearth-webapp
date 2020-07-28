import React, { useEffect, useState, useCallback } from "react";
import { withFormsy } from "formsy-react";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import { InjectedProps } from "formsy-react/dist/Wrapper";

const FormInput: React.FC<Props & InjectedProps<string | null>> = props => {
  const [labelClass, setLabelClass] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder || "");

  const handleClick = useCallback(
    (event: React.MouseEvent | React.FocusEvent) => {
      if (!labelClass || placeholder !== "") {
        setLabelClass(true);
        setPlaceholder("");
      }
    },
    []
  );

  useEffect(() => {
    !labelClass && props.value && setLabelClass(true);
  }, [props.isPristine]);

  const handleClickBlur = useCallback((event: React.FocusEvent) => {
    if (!labelClass || placeholder !== "") {
      setLabelClass(true);
      setPlaceholder("");
    }
    props.blur && props.isValid ? props.blur(event) : "";
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setValue(event.currentTarget.value);
      if (props.handleChange) {
        props.handleChange(event);
      }
    },
    [props.handleChange]
  );

  useEffect(() => {
    if (props.isPlaceholderVisible && placeholder === "") {
      setPlaceholder(props.placeholder);
      setLabelClass(false);
    }
  });
  const getRequiredErrorMessage = useCallback((name: string) => {
    switch (name) {
      case "email":
        return "Please enter Email";
      case "firstName":
        return "Please enter First Name";
      case "lastName":
        return "Please enter Last Name";
      case "dateOfBirth":
        return "Please enter valid date of birth";
      case "phoneNo":
        return "Please enter Phone Number";
      case "password1":
        return "Please enter at least 6 characters for the password";
      case "password2":
        return "Please enter at least 6 characters for the password";
      case "recipientName":
        return "Please enter Recipient's Name";
      case "recipientEmailConfirm":
      case "recipientEmail":
        return "Please enter Recipient's Email";
      case "message":
        return "Please enter message";
      case "senderName":
        return "Please enter Sender's Name";
      case "giftCardCode":
        return "Please enter Gift Card Code";
      default:
        return "This field is required";
    }
  }, []);
  const errorMessage = props.disable
    ? ""
    : props.errorMessage
    ? props.errorMessage
    : !props.isPristine && !props.isValid
    ? getRequiredErrorMessage(props.name)
    : "";
  return (
    <div className={props.className}>
      <input
        type={props.type || "text"}
        id={props.id}
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
        id={props.id}
      >
        {props.label || ""}
      </label>
      {errorMessage && (
        <p className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default withFormsy(FormInput);
