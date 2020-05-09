import Autosuggest from "react-autosuggest";
import React, { useState, useEffect } from "react";
import globalStyles from "../../styles/global.scss";
import styles from "./styles.scss";
import "../../styles/autosuggest.css";
import cs from "classnames";
import { withFormsy } from "formsy-react";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import Axios from "axios";
// import Config from "components/config";
type Props = {
  code?: string;
  error?: string;
  setCode: (data: string) => void;
  blur?: () => void;
  border?: boolean;
  id: string;
  className?: string;
  label?: string;
  disable?: boolean;
  placeholder: string;
  value: string;
};

type country = {
  id: number;
  nameAscii: string;
  code2: string;
  regionSet: [
    {
      id: number;
      nameAscii: string;
    }
  ];
  isdCode?: string;
};

const CountryCode: React.FC<Props & InjectedProps<string | null>> = (
  props: Props & InjectedProps<string | null>
) => {
  const [suggestions, setSuggestions] = useState<country[]>([]);
  const [countryList, setCountryList] = useState<country[]>([]);
  const [labelClass, setLabelClass] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder || "");

  useEffect(() => {
    Axios.get("http://api.goodearth.in/myapi/address/countries_state").then(
      res => {
        setSuggestions(res.data);
        setCountryList(res.data);
      }
    );
  }, []);

  const getSuggestions = (value: any) => {
    const inputLength = value.length;
    const inputValue = isNaN(Number(value))
      ? value.trim().toLowerCase()
      : value;
    if (isNaN(Number(value)) && value !== "+") {
      return inputLength === 0
        ? []
        : countryList.filter(lang => {
            return (
              lang.nameAscii.toLowerCase().slice(0, inputLength) === inputValue
            );
          });
    } else {
      return inputLength === 0
        ? []
        : countryList.filter(lang => {
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

  const renderSuggestion = (suggestion: country) => {
    return (
      <div>
        {suggestion.nameAscii} ({suggestion.isdCode})
      </div>
    );
  };

  const onChange = (event: any, { newValue }: { newValue: string }) => {
    props.setValue(newValue);
    props.setCode && props.setCode(newValue);
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

  let cls = props.errorMessage ? globalStyles.errorBorder : "";
  cls += props.disable ? styles.disabledInput : "";
  const inputProps = {
    placeholder: placeholder,
    value: props.value,
    onChange: onChange,
    disabled: props.disable,
    autoComplete: "new-password",
    className: cls,
    onBlur: props.blur
  };

  return (
    <div
      onBlur={e => handleClickBlur(e)}
      onFocus={e => handleClick(e)}
      className={props.className ? props.className : ""}
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
      />
      <label
        className={labelClass && !props.disable ? "" : globalStyles.hidden}
      >
        {props.label}
      </label>
      {props.errorMessage ? (
        <p className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}>
          {props.errorMessage}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default withFormsy(CountryCode);
