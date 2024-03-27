import React, { useEffect, useState } from "react";
import { Props } from "./typings";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";

const InputField: React.FC<Props> = props => {
  const [placeholder, setPlaceholder] = useState(props.placeholder || "");
  const [focused, setFocused] = useState(false);
  // const [readOnly, setReadOnly] = useState(true);

  const handleClick = (
    event: React.MouseEvent | React.FocusEvent | React.TouchEvent
  ) => {
    if (placeholder !== "") {
      setPlaceholder("");
    }
  };

  const handleClickFocus = (event: React.FocusEvent) => {
    setFocused(true);
    handleClick(event);
  };

  const handleClickBlur = (event: React.FocusEvent) => {
    if (!props.value) {
      setFocused(false);
    }

    if (placeholder === "") {
      setPlaceholder(props.placeholder);
    }
    props.blur ? props.blur(event) : "";
  };

  useEffect(() => {
    if (props.isPlaceholderVisible && placeholder === "") {
      setPlaceholder(props.placeholder);
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
        onPaste={e => props.handlePaste?.(e)}
        autoComplete="new-password"
        onClick={e => handleClick(e)}
        onBlur={e => handleClickBlur(e)}
        onFocus={e => handleClickFocus(e)}
        onTouchStart={e => handleClick(e)}
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
        min={props.min || ""}
        max={props.max || ""}
        ref={props.inputRef || null}
        disabled={props.disable || false}
      />
      <label
        className={cs({ [globalStyles.hidden]: !props.showLabel || !focused })}
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
