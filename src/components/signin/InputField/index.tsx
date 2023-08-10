import React, { useEffect, useState } from "react";
import { Props } from "./typings";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";

const InputField: React.FC<Props> = props => {
  const [labelClass, setLabelClass] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder || "");
  const [readOnly, setReadOnly] = useState(true);

  const handleClick = (event: React.MouseEvent | React.FocusEvent) => {
    if (!labelClass || placeholder !== "") {
      setLabelClass(true);
      setPlaceholder("");
    }
    setReadOnly(false);
  };

  const handleClickBlur = (event: React.FocusEvent) => {
    if (!labelClass || placeholder !== "") {
      setLabelClass(true);
      setPlaceholder("");
    }
    props.blur ? props.blur(event) : "";
    setReadOnly(true);
  };

  useEffect(() => {
    if (props.isPlaceholderVisible && placeholder === "") {
      setPlaceholder(props.placeholder);
      setLabelClass(false);
    }
  });

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
          props.border || false
            ? globalStyles.errorBorder
            : props.inputClass || ""
        }
        value={props.value || ""}
        placeholder={placeholder}
        onChange={e => props.handleChange?.(e)}
        autoComplete="new-password"
        onClick={e => handleClick(e)}
        onBlur={e => handleClickBlur(e)}
        onFocus={e => handleClick(e)}
        readOnly={readOnly}
        onKeyPress={e => (props.keyPress ? props.keyPress(e) : null)}
        onKeyDown={e => (props.keyDown ? props.keyDown(e) : null)}
        onKeyUp={e => (props.keyUp ? props.keyUp(e) : null)}
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
        // className={
        //   (labelClass && !props.disable) || false ? "" : globalStyles.hidden
        // }
        className={cs({ [globalStyles.hidden]: !props.showLabel })}
        id={
          props.id ||
          Math.random()
            .toString(36)
            .substring(7)
        }
      >
        {props.label || ""}
      </label>
      {props.error && (
        <p className={cs(styles.errorMsg, globalStyles.textLeft)}>
          {props.error}
        </p>
      )}
    </div>
  );
};

export default InputField;
