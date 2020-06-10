import Autosuggest from "react-autosuggest";
import React, { useState, useEffect } from "react";
import globalStyles from "../../../styles/global.scss";
import styles from "../styles.scss";
import "../../../styles/autosuggest.css";
import cs from "classnames";
import { InjectedProps } from "formsy-react/dist/Wrapper";
import { withFormsy } from "formsy-react";
import { Props } from "./typings";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const PinCode: React.FC<Props & InjectedProps<string | null>> = props => {
  const { pinCodeList } = useSelector((state: AppState) => state.address);

  const [suggestions, setSuggestions] = useState<string[]>(pinCodeList);

  const [labelClass, setLabelClass] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder || "");

  // errortxt: props.error || "",
  // classes: props.class || "",
  // isLabel: props.getValue()  ? true : false,

  const getSuggestions = (value: any) => {
    const inputLength = value.length;
    const inputValue = isNaN(Number(value))
      ? value.trim().toLowerCase()
      : Number(value);
    if (isNaN(inputValue)) {
      return [];
    } else {
      return inputLength === 0
        ? []
        : pinCodeList.filter(pincode => {
            return pincode.slice(0, inputLength) == inputValue;
          });
    }
  };
  // componentWillReceiveProps(nextProps) {
  //     if (nextProps.code != this.state.value) {
  //         this.setState({
  //             value: nextProps.code
  //         })
  //     }
  //     if(nextpinCodeList !== pinCodeList) {
  //         this.setState({
  //             suggestions: nextpinCodeList,
  //         })
  //     }
  // }

  useEffect(() => {
    setSuggestions(pinCodeList);
  }, [pinCodeList]);

  const getSuggestionValue = (suggestion: string) => {
    // props.changeState(props.data[suggestion.toString()]);
    // props.setPostcodeError("");
    return suggestion;
  };

  const renderSuggestion = (suggestion: string) => {
    return (
      <div>
        {/* {suggestion.name_ascii} ({suggestion.isd_code}) */}
        {suggestion}
      </div>
    );
  };

  const onChange = (event: any, { newValue }: { newValue: string }) => {
    props.setValue(newValue);
    if (props.handleChange) {
      props.handleChange(event);
    }
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionSelected = (
    event: any,
    { suggestion, suggestionValue }: { suggestion: any; suggestionValue: any }
  ) => {
    props.changeState && props.changeState(suggestionValue);
  };

  const handleClickBlur = (event: React.FocusEvent) => {
    setLabelClass(true);
    setPlaceholder("");
    // this.isBlur = true;
  };

  const handleClick = (event: React.MouseEvent | React.FocusEvent) => {
    if (!labelClass || placeholder !== "") {
      setLabelClass(true);
      setPlaceholder("");
    }
  };
  // const {value, suggestions} = this.state;
  const isError = !props.isPristine && !props.isValid;
  //  || (!props.isValid && props.editMode && props.error);

  let cls = isError ? globalStyles.errorBorder : props.className || "";
  // const isError = true;
  cls += props.disable ? styles.disabledInput : "";
  let errorMessage = isError ? props.errorMessage || props.error : null;
  errorMessage =
    isError && errorMessage == null ? "This field is required" : errorMessage;
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
      className={props.className ? props.className : ""}
      onBlur={e => handleClickBlur(e)}
      onFocus={e => handleClick(e)}
    >
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={onSuggestionSelected}
        inputProps={inputProps}
        id={props.id}
      />
      <label
        className={cs({
          [globalStyles.hidden]: !(labelClass && !props.disable)
        })}
      >
        {props.label}
      </label>
      {errorMessage && (
        <p className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default withFormsy(PinCode);
