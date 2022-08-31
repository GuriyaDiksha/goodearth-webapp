import React from "react";
import styles from "./styles.scss";
import cs from "classnames";

type Props = {
  id: any;
  checked: boolean;
  changeValue: any;
  small: boolean;
  disabled: boolean;
};

const ToggleSwitch: React.FC<Props> = ({
  id,
  small,
  disabled,
  checked,
  changeValue
}) => {
  // function handleKeyPress(e: any) {
  //   if (e.keyCode !== 32) return;

  //   e.preventDefault();
  //   onChange(!checked);
  // }

  const onChange = (e: any, id: number) => {
    changeValue(e.target.checked, id);
  };

  return (
    <div className={cs(styles.toggleSwitch, small ? styles.smallSwitch : "")}>
      <input
        type="checkbox"
        className={styles.toggleSwitchCheckbox}
        id={id}
        checked={checked}
        onChange={e => onChange(e, id)}
        disabled={disabled}
      />
      {id ? (
        <label
          className={styles.toggleSwitchLabel}
          tabIndex={1}
          // onKeyDown={e => handleKeyPress(e)}
          htmlFor={id}
        >
          <span
            className={cs(
              styles.toggleSwitchInner,
              disabled ? styles.toggleSwitchDisabled : ""
            )}
            // data-yes={optionLabels[0]}
            // data-no={optionLabels[1]}
            tabIndex={-1}
          />
          <span
            className={cs(
              styles.toggleSwitchSwitch,
              disabled ? styles.toggleSwitchDisabled : ""
            )}
            tabIndex={-1}
          />
        </label>
      ) : null}
    </div>
  );
};

export default ToggleSwitch;
