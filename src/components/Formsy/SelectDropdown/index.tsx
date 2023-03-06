import React, { useEffect, useState, useCallback } from "react";
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
    const filtered = props.options.filter(i => {
      return (
        i.value?.toLowerCase().includes(e.target.value.toLowerCase()) ||
        i.label?.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setOptions(filtered);
  };

  useEffect(() => {
    setOptions(props.options);
    if (!active) setSearchValue("");
  }, [active]);

  const getDefaultError = useCallback(() => {
    switch (props.name) {
      case "gender":
        return "Please select your Gender";
      case "country":
        return "Please select your Country";
      case "state":
        return "Please select your State";
      case "preferredContact":
        return "Please choose preferred mode of contact";
      default:
        return "Please Select option";
    }
  }, []);

  const errorMessage =
    props.errorMessage && !!props.disable
      ? props.errorMessage
      : !props.isPristine && !props.isValid && !props.disable
      ? getDefaultError()
      : "";

  return (
    <div className={cs(styles.dropdown, props.className)}>
      <input
        type="text"
        className={styles.textBox}
        placeholder={props.placeholder}
        value={value}
        name={props.name}
        readOnly
        onClick={() => setActive(!active)}
        ref={props.inputRef || null}
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
        <div
          className={cs(
            styles.option,
            styles.filter,
            props.searchContainerClass
          )}
        >
          <img
            src={searchIcon}
            className={cs(props.searchIconClass || styles.searchIcon)}
          />
          <input
            type="text"
            placeholder="Search"
            onChange={onSearchValueChange}
            value={searchValue}
            autoFocus
            className={cs(props.searchInputClass || styles.searchField)}
          />
        </div>
      )}
      <div className={cs(styles.options, { [styles.active]: active })}>
        {options.map((option, i) => {
          return (
            <div
              className={cs(props.optionsClass || styles.option)}
              onClick={e => onOptionClick(e, option)}
              key={`${props.name}_${i}`}
            >
              {option.label}
            </div>
          );
        })}
      </div>
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

export default withFormsy(SelectDropdown);
