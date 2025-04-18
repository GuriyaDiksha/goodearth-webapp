import Autosuggest from "react-autosuggest";
import React, { useState } from "react";
import globalStyles from "../../../styles/global.scss";
import styles from "../styles.scss";
import "../../../styles/autosuggest.css";
import cs from "classnames";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import { Props, Country } from "./typings";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

const CountryCode: React.FC<Props & InjectedProps<string | null>> = props => {
  const { countryData } = useSelector((state: AppState) => state.address);
  const [suggestions, setSuggestions] = useState<Country[]>(countryData);

  // const [countryList, setCountryList] = useState<Country[]>(countryData);
  const [labelClass, setLabelClass] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder || "");

  // useEffect(() => {
  //   const { countryData } = props;
  //   if(countryData) {
  //     setSuggestions(countryData);
  //     setCountryList(countryData);
  //   }
  // }, [props.countryData]);

  const getSuggestions = (value: any) => {
    const inputLength = value.length;
    const inputValue = isNaN(Number(value))
      ? value?.trim().toLowerCase()
      : value;
    if (isNaN(Number(value)) && value !== "+") {
      return inputLength === 0
        ? []
        : countryData.filter(lang => {
            return (
              lang.nameAscii.toLowerCase().slice(0, inputLength) === inputValue
            );
          });
    } else {
      return inputLength === 0
        ? []
        : countryData.filter(lang => {
            if (lang.isdCode) {
              if (value.slice(0, 1) == "+") {
                return lang.isdCode.slice(0, inputLength) === inputValue;
              } else {
                return (
                  lang.isdCode
                    .slice(1, lang.isdCode.length)
                    .slice(0, inputLength) === inputValue
                );
              }
            } else {
              return false;
            }
          });
    }
  };

  const renderSuggestion = (suggestion: Country) => {
    return (
      <div>
        {suggestion.nameAscii} ({suggestion.isdCode})
      </div>
    );
  };

  const onChange = (event: any, { newValue }: { newValue: string }) => {
    props.setValue(newValue);
    props.onCountrySelect(newValue);
    if (props.handleChange) {
      props.handleChange(event, newValue);
    }
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleClickBlur = (event: React.FocusEvent) => {
    setLabelClass(true);
    setPlaceholder("");
  };

  const handleClick = (event: React.MouseEvent | React.FocusEvent) => {
    if (!labelClass || placeholder !== "") {
      setLabelClass(true);
      setPlaceholder("");
    }
  };

  const cls = cs(
    { [globalStyles.errorBorder]: props.errorMessage },
    {
      [styles.disabledInput]: props.disable
    }
  );
  const inputProps = {
    placeholder: placeholder,
    value: props.value || "",
    onChange: onChange,
    disabled: props.disable,
    autoComplete: props.autocomplete || "new-password",
    className: cls,
    onBlur: props.blur,
    name: props.name
  };

  const errorMessage = props.disable
    ? ""
    : props.error
    ? props.error
    : props.errorMessage
    ? props.errorMessage
    : "";

  return (
    <div
      onBlur={e => handleClickBlur(e)}
      onFocus={e => handleClick(e)}
      className={props.className}
    >
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={suggestion => {
          return suggestion.isdCode || "";
        }}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        id={props.id}
        ref={props.innerRef}
      />
      {props?.hideArrow ? null : <span className={styles.arrow}></span>}
      <label
        className={cs({
          [globalStyles.hidden]: props.showLabel
            ? false
            : props.value
            ? false
            : labelClass
            ? false
            : true
        })}
      >
        {props.label}
      </label>
      {errorMessage && <p className={styles.errorMsg}>{errorMessage}</p>}
      {props.value?.length > 0 && !props?.hideArrow ? (
        <span
          className={
            props.disable
              ? cs(styles.arrow, styles.disabledArrow)
              : styles.arrow
          }
        ></span>
      ) : (
        ""
      )}
    </div>
  );
};

export default withFormsy(CountryCode);
