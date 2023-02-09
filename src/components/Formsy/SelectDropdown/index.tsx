import React, { useEffect, useState } from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import styles from "../styles.scss";
import globalStyles from "../../../styles/global.scss";
import cs from "classnames";
import { Props } from "./typings";
import searchIcon from "../../../icons/search.svg";

const SelectDropdown: React.FC<Props &
  InjectedProps<string | null>> = props => {
  const [options, setOptions] = useState(props.options);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(props.value || "");
  const [searchValue, setSearchValue] = useState("");

  const onOptionClick = (e: any, option: any) => {
    if (props.handleChange) {
      props.handleChange(option);
    }
    setValue(option.value);
    setActive(false);
  };

  const onSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    const main = props.options;
    const filtered = main.filter(i =>
      i.value.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setOptions(filtered);
  };

  useEffect(() => {
    setOptions(props.options);
    if (!active) setSearchValue("");
  }, [active]);

  return (
    <div className={cs(styles.dropdown, props.className)}>
      <input
        type="text"
        className={styles.textBox}
        placeholder={props.placeholder}
        value={value}
        readOnly
        onClick={() => setActive(!active)}
      />
      <label>{props.label}</label>
      <span
        className={cs(
          { [styles.arrow]: true },
          { [styles.active]: active },
          { [styles.disabledArrow]: props.disable },
          { [globalStyles.pointer]: !props.disable }
        )}
      ></span>
      {props.allowFilter && active && (
        <div className={cs(styles.option, styles.filter)}>
          <img src={searchIcon} />
          <input
            type="text"
            placeholder="Search"
            onChange={onSearchValueChange}
            value={searchValue}
          />
        </div>
      )}
      <div className={cs(styles.options, { [styles.active]: active })}>
        {options.map((option, i) => {
          return (
            <div
              className={styles.option}
              onClick={e => onOptionClick(e, option)}
              key={`${props.name}_${i}`}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default withFormsy(SelectDropdown);
