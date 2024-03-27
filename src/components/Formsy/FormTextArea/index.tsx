import React, { useEffect, useState, useCallback } from "react";
import { withFormsy } from "formsy-react";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import styles from "../styles.scss";

const FormInput: React.FC<Props & InjectedProps<string | null>> = props => {
  const [labelClass, setLabelClass] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder || "");
  const isSafari =
    typeof window !== "undefined"
      ? /^((?!chrome|android).)*safari/i.test(window.navigator?.userAgent)
      : false;

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
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      props.setValue(
        event.currentTarget.value?.trim() == "" ? "" : event.currentTarget.value
      );
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
        return "";
      case "firstName":
        return "Please enter your First Name";
      case "lastName":
        return "Please enter your Last Name";
      case "dateOfBirth":
        return "Please enter a valid Date of Birth";
      case "phoneNo":
        return "";
      case "password1":
        return "Please enter at least 6 characters for the password";
      case "password2":
        return "Please enter at least 6 characters for the password";
      case "message":
        return "Please enter your message";
      case "query":
        return "Please enter your Query";
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
    : props.error
    ? props.error
    : "";
  return (
    <div className={cs(styles.textareaWrapper, props.className)}>
      <textarea
        rows={props.rows || 3}
        maxLength={props.maxLength}
        cols={60}
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
        <p
          className={cs(
            styles.errorMsg,
            globalStyles.txtnormal,
            globalStyles.textLeft,
            props.additionalErrorClass || ""
          )}
        >
          {errorMessage}
        </p>
      )}
      {props.charLimit && (
        <div className={cs(styles.charLimit)}>
          Character Limit:{" "}
          {props.charLimit -
            (props?.value?.length ||
              0 +
                (isSafari
                  ? props.value?.match(/(\r\n|\n|\r)/g)?.length || 0
                  : 0))}{" "}
          / {props.charLimit}
        </div>
      )}
    </div>
  );
};

export default withFormsy(FormInput);
