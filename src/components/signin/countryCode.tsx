import Autosuggest from "react-autosuggest";
import React, { RefObject } from "react";
import globalStyles from "../../styles/global.scss";
import styles from "./styles.scss";
import cs from "classnames";
// import Axios from 'axios';
// import Config from "components/config";
type Props = {
  ref: RefObject<CountryCode>;
  code?: string;
  error: string;
  setCode?: (data: string) => void;
  blur?: () => void;
  border: boolean;
  id: string;
  className?: string;
  disabled: boolean;
  placeholder: string;
};

type country = {
  id: number;
  name_ascii: string;
  code2: string;
  region_set: [
    {
      id: number;
      name_ascii: string;
    }
  ];
  isd_code?: string;
};
type State = {
  value: string;
  suggestions: country[];
  countryList: country[];
  labelClass: boolean;
};
class CountryCode extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.code || "",
      suggestions: [],
      countryList: [],
      labelClass: false
    };
    // this.onChange = this.onChange.bind(this);
    // this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    // this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    // this.getSuggestions = this.getSuggestions.bind(this);
    // this.renderSuggestion = this.renderSuggestion.bind(this);
  }

  componentDidMount() {
    // axios.get(Config.hostname + 'myapi/countries-state/')
    //     .then(res => {
    //         this.setState({
    //             suggestions: res.data,
    //             countryList: res.data
    //         })
    //     });
  }

  getSuggestions(value: any) {
    // const inputLength = value.length;
    // const inputValue = isNaN(Number(value)) ? value.trim().toLowerCase() : value;
    // if (isNaN(Number(value)) && value !== "+") {
    //     return inputLength === 0 ? [] : this.state.countryList.filter(lang => {
    //         return lang.name_ascii.toLowerCase().slice(0, inputLength) === inputValue
    //     });
    // } else {
    //     return inputLength === 0 ? [] : this.state.countryList.filter(lang => {
    //         if (lang.isd_code) {
    //             if (value.slice(0, 1) == "+") {
    //                 return lang.isd_code.slice(0, inputLength) === inputValue;
    //             } else {
    //                 return lang.isd_code.slice(1, lang.isd_code.length).slice(0, inputLength) === inputValue;
    //             }
    //         } else {
    //             return false;
    //         }
    //     });
    // }
  }

  // componentWillReceiveProps(props) {
  //     if (props.code) {
  //         this.setState({
  //             value: props.code
  //         })
  //     }

  // }

  getSuggestionValue(suggestion: country) {
    return suggestion.isd_code || "";
  }

  renderSuggestion(suggestion: country) {
    return (
      <div>
        {suggestion.name_ascii} ({suggestion.isd_code})
      </div>
    );
  }

  onChange(event: any, { newValue }: any) {
    //     this.setState({
    //         value: newValue
    //     }, () => {
    //         this.props.setCode(newValue)
    //     });
  }

  onSuggestionsFetchRequested() {
    // this.setState({
    //     suggestions: this.getSuggestions(value)
    // });
  }

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  handleClickBlur(event: React.FocusEvent) {
    // if (this.state.value.length == 0) {
    //     this.setState({
    //         labelclass: true,
    //         placeholder: ''
    //     });
    // } else {
    //     this.setState({
    //         labelclass: true
    //     });
    // }
    // this.props.blur ? this.props.blur() : "";
  }

  render() {
    const { value, suggestions } = this.state;
    let cls = this.props.border ? globalStyles.errorBorder : "";
    cls += this.props.disabled ? styles.disabledInput : "";
    const inputProps = {
      placeholder: this.props.placeholder,
      value,
      onChange: this.onChange,
      disabled: this.props.disabled,
      autoComplete: "new-password",
      className: cls,
      onBlur: this.props.blur
    };

    return (
      <div
        onBlur={e => this.handleClickBlur(e)}
        className={this.props.className ? this.props.className : ""}
      >
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={c => this.getSuggestionValue(c)}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          id={this.props.id}
        />
        {this.props.error ? (
          <p
            className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}
            dangerouslySetInnerHTML={{ __html: this.props.error }}
          ></p>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default CountryCode;
