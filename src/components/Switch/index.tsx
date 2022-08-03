import React from "react";
import styles from "./styles.scss";
import cs from "classnames";

type Props = {
  id: any;
  checked: boolean;
  onChange: any;
  small: boolean;
  disabled: boolean;
};

const ToggleSwitch: React.FC<Props> = ({
  id,
  checked,
  onChange,
  small,
  disabled
}) => {
  function handleKeyPress(e: any) {
    if (e.keyCode !== 32) return;

    e.preventDefault();
    onChange(!checked);
  }

  return (
    <div className={cs(styles.toggleSwitch, small ? styles.smallSwitch : "")}>
      <input
        type="checkbox"
        className={styles.toggleSwitchCheckbox}
        id={id}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
      {id ? (
        <label
          className={styles.toggleSwitchLabel}
          tabIndex={disabled ? -1 : 1}
          onKeyDown={e => handleKeyPress(e)}
          htmlFor={id}
        >
          <span
            className={cs(
              disabled
                ? (styles.toggleSwitchInner, styles.toggleSwitchDisabled)
                : styles.toggleSwitchInner
            )}
            // data-yes={optionLabels[0]}
            // data-no={optionLabels[1]}
            tabIndex={-1}
          />
          <span
            className={cs(
              disabled
                ? (styles.toggleSwitchSwitch, styles.toggleSwitchDisabled)
                : styles.toggleSwitchSwitch
            )}
            tabIndex={-1}
          />
        </label>
      ) : null}
    </div>
  );
};

export default ToggleSwitch;
