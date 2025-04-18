import React, { useEffect, useState, useCallback } from "react";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import styles from "../styles.scss";
import globalStyles from "../../../styles/global.scss";
import cs from "classnames";
import { Props } from "./typings";
import searchIcon from "../../../icons/search.svg";
import useOutsideDetection from "hooks/useOutsideDetetion";

const SelectDropdown: React.FC<Props &
  InjectedProps<string | null>> = props => {
  const [options, setOptions] = useState(props.options);
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(props.value || "");
  const [searchValue, setSearchValue] = useState("");

  const onOutsideClick = (event: MouseEvent) => {
    if (active) {
      setActive(false);
      if (props.onInputClick) {
        props.onInputClick(false);
      }
    }
  };

  const { ref } = useOutsideDetection<HTMLDivElement>(onOutsideClick);

  useEffect(() => {
    if (props?.value) setValue(props?.value);
  }, [props?.value]);

  const onOptionClick = (e: any, option: any) => {
    if (props.handleChange) {
      props.handleChange(option);
    }
    setValue(option.value);
    setActive(false);
    if (props.onInputClick) {
      props.onInputClick(false);
    }
  };

  const onSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    const filtered = props.options.filter(i => {
      return (
        i.value?.toLowerCase().startsWith(e.target.value.toLowerCase()) ||
        i.label?.toLowerCase().startsWith(e.target.value.toLowerCase()) ||
        i.value
          ?.split("(+")?.[1]
          ?.toLowerCase()
          .startsWith(e.target.value.toLowerCase()) ||
        i.label
          ?.split("(+")?.[1]
          ?.toLowerCase()
          .startsWith(e.target.value.toLowerCase())
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
        return "Please select your gender";
      case "country":
        return "Please select your Country";
      case "state":
        return "Please select your state";
      case "preferredContact":
        return "Please choose preferred mode of contact";
      case "code":
        return "Please select code";
      case "phoneCountryCode":
        return "Please select code";
      case "whatsappNoCountryCode":
        return "Required";
      default:
        return "Please Select option";
    }
  }, []);

  const errorMessage =
    props.errorMessage && !props.disable
      ? props.errorMessage
      : !props.isPristine && !props.isValid && !props?.disable
      ? getDefaultError()
      : "";

  return (
    <div className={cs(styles.dropdown, props.className)} ref={ref}>
      <input
        type="text"
        className={cs(styles.textBox, {
          [globalStyles.errorBorder]: errorMessage
        })}
        placeholder={props.placeholder}
        value={value}
        name={props.name}
        readOnly
        onClick={() => {
          !props.disable && setActive(!active);
          if (props.onInputClick) {
            props.onInputClick(!active);
          }
        }}
        ref={props.inputRef || null}
        disabled={props.disable}
      />
      {(value || active) && <label>{props.label}</label>}
      <span
        className={cs(
          { [styles.arrow]: true },
          { [styles.active]: active },
          { [styles.disabledArrow]: props.disable },
          { [globalStyles.pointer]: !props.disable }
        )}
      ></span>
      <div className={cs(styles.fixDropDown)}>
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
              width="200"
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
          {options?.map((option, i) => {
            return (
              <div
                className={cs(props.optionsClass || styles.option, {
                  [props.aquaClass || styles.aquaText]:
                    (option.label?.split("(")?.[1]
                      ? option.label
                          ?.split("(")?.[1]
                          ?.substring(
                            0,
                            option.label?.split("(")?.[1]?.length - 1
                          )
                      : option.label?.split("(")?.[0]) === value
                })}
                onClick={e => onOptionClick(e, option)}
                key={`${props.name}_${i}`}
              >
                {/* <div onClick={e => onOptionClick(e, option)}> */}
                {option.label?.split("(")?.[0]}{" "}
                {option.label?.split("(")?.[1]
                  ? "(" + option.label?.split("(")?.[1]
                  : null}
                {/* </div> */}
              </div>
            );
          })}
        </div>
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
