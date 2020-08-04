import React, { useEffect, useState } from "react";
import { Props } from "./typings";
import globalStyles from "styles/global.scss";
import cs from "classnames";

const InputField: React.FC<Props> = props => {
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
    props.blur ? props.blur(event) : "";
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
      {props.error && (
        <p className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}>
          {props.error}
        </p>
      )}
    </div>
  );
};

export default InputField;
