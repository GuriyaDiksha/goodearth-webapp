import React, { useEffect, useState, useCallback } from "react";
import { withFormsy } from "formsy-react";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { InjectedProps } from "formsy-react/dist/Wrapper";

const FormInput: React.FC<Props & InjectedProps<string | null>> = props => {
  const [labelClass, setLabelClass] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder || "");
  const [focused, setFocused] = useState(false);

  const handleClick = useCallback(
    (event: React.MouseEvent | React.FocusEvent) => {
      if (!labelClass || placeholder !== "") {
        setLabelClass(true);
        setPlaceholder("");
      }
      props.onFocus && props.onFocus(event as React.FocusEvent);
    },
    []
  );

  const handleClickFocus = (event: React.FocusEvent) => {
    setFocused(true);
    handleClick(event);
  };

  useEffect(() => {
    !labelClass && props.value && setLabelClass(true);
  }, [props.isPristine]);

  const handleClickBlur = useCallback((event: React.FocusEvent) => {
    if (!props.value) {
      setFocused(false);
    }
    if (!placeholder) {
      setPlaceholder(props.placeholder);
    }

    if (!labelClass) {
      setLabelClass(true);
    }
    props.blur && props.isValid ? props.blur(event) : "";
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (props.maxlength) {
        if (value.toString().length <= props.maxlength) {
          props.setValue(value);
        }
      } else {
        props.setValue(event.currentTarget.value);
      }
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
    if (props.type == "date") {
      setLabelClass(true);
    }
  }, []);
  const getRequiredErrorMessage = useCallback((name: string) => {
    switch (name) {
      case "email":
        return "Please enter your Email ID";
      case "firstName":
        return "Please enter your First Name";
      case "name":
        return "Please enter your Name";
      case "lastName":
        return "Please enter your Last Name";
      case "dateOfBirth":
        return "Please enter a valid Date of Birth";
      case "phoneNo":
      case "phoneNumber":
        return "Please enter your Contact Number";
      case "password1":
      case "newPassword":
      case "newPassword1":
        return "Please enter at least 6 characters for the Password";
      case "password2":
        return "Please enter at least 6 characters for the Password";
      case "occassion_choice":
        return "Please enter Occasion's Name";
      case "registrantName":
        return "Please enter Registrant's Name";
        return "Please enter Registrant's Name";
      case "coRegistrantName":
        return "Please enter Co-registrant's Name";
      case "registryName":
        return "Please enter Registry Name";
      case "recipientName":
        return "Please enter Recipient's Name";
      case "recipientEmailConfirm":
      case "recipientEmail":
        return "Please enter Recipient's Email";
      case "message":
        return "Please enter your message";
      case "senderName":
        return "Please enter Sender's Name";
      case "giftCardCode":
        return "Please enter a valid Gift Card Code";
      case "orderNumber":
        return "Please enter a valid Order Number";
      case "city":
        return "Please enter your City";
      case "postCode":
        return "Please enter a valid Pin/Zip code";
      case "line1":
        return "Please enter your Address";
      case "publication":
        return "Please enter publication name";
      case "whatsappNo":
        return "";
      default:
        return "This field is required";
    }
  }, []);
  let errorMessage = props.disable
    ? ""
    : props.errorMessage
    ? props.errorMessage
    : !props.isPristine && !props.isValid
    ? getRequiredErrorMessage(props.name)
    : props.error
    ? props.error
    : "";

  if (props.noErrOnPristine) {
    if (props.isPristine) {
      errorMessage = "";
    }
  }

  return (
    <div className={props.className}>
      <input
        type={props.type || "text"}
        id={props.id}
        name={props.name}
        className={cs(
          errorMessage || false
            ? globalStyles.errorBorder
            : props.inputClass || "",
          props.value ? styles.black : props.defaultClass || styles.default
        )}
        value={props.value || ""}
        placeholder={props?.value || focused ? undefined : props.placeholder}
        onChange={e => handleChange(e)}
        autoComplete="off"
        onBlur={e => handleClickBlur(e)}
        onFocus={e => handleClickFocus(e)}
        onKeyPress={e => (props.keyPress ? props.keyPress(e) : null)}
        onKeyUp={e => (props.isValid && props.keyUp ? props.keyUp(e) : null)} // use Key up if you want change only if input is valid
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
            : props?.onPaste
            ? e => (props.onPaste ? props.onPaste(e) : null)
            : undefined
        }
        min={props.min || ""}
        max={props.max || ""}
        ref={props.inputRef || null}
        disabled={props.disable || false}
        onKeyDown={e => (props.keyDown ? props.keyDown(e) : null)}
      />
      {focused && (
        <label
          className={cs({
            [globalStyles.hidden]: labelClass
              ? false
              : props.showLabel
              ? false
              : true
          })}
          id={props.id}
        >
          {props.label || ""}
        </label>
      )}
      {errorMessage && (
        <p
          className={cs(
            styles.errorMsg,
            globalStyles.txtnormal,
            globalStyles.textLeft
          )}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default withFormsy(FormInput);
