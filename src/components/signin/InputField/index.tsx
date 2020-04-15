import React from "react";
import { Props, State } from "./typings";
// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'

class InputField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: this.props.value || "",
      labelClass: false,
      placeholder: this.props.placeholder || ""
    };
  }

  handleClick(event: React.MouseEvent | React.FocusEvent) {
    if (!this.state.labelClass || this.state.placeholder !== "") {
      this.setState({
        labelClass: true,
        placeholder: ""
      });
    }
  }

  handleClickBlur(event: React.FocusEvent) {
    if (!this.state.labelClass || this.state.placeholder !== "") {
      this.setState({
        labelClass: true,
        placeholder: ""
      });
    }
    this.props.blur ? this.props.blur(event) : "";
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      value: event.target.value
    });
    if (this.props.disablePassword) {
      this.props.disablePassword();
    }
    if (this.props.handleChange) {
      this.props.handleChange(event);
    }
  }

  // componentWillReceiveProps(nextProps: Props) {
  //   if (nextProps.isPlaceholderVisible && this.state.placeholder === "") {
  //     this.setState({
  //       placeholder: this.props.placeholder,
  //       value: "",
  //       labelClass: false
  //     });
  //   } else if (nextProps.value && this.state.value !== nextProps.value) {
  //     this.setState({
  //       value: nextProps.value || this.state.value
  //     });
  //   }
  // }

  render() {
    return (
      <div className={this.props.className ? this.props.className : ""}>
        <input
          type={this.props.type || "text"}
          id={
            this.props.id ||
            Math.random()
              .toString(36)
              .substring(7)
          }
          name={this.props.name}
          className={
            this.props.border || false
              ? "error-border"
              : this.props.inputClass || ""
          }
          value={this.state.value}
          placeholder={this.state.placeholder}
          onChange={e => this.handleChange(e)}
          autoComplete="new-password"
          onClick={e => this.handleClick(e)}
          onBlur={e => this.handleClickBlur(e)}
          onFocus={e => this.handleClick(e)}
          onKeyPress={e =>
            this.props.keyPress ? this.props.keyPress(e) : null
          }
          onKeyUp={e => (this.props.keyUp ? this.props.keyUp(e) : null)}
          onDrop={
            this.props.isDrop
              ? e => {
                  e.preventDefault();
                }
              : undefined
          }
          onPaste={
            this.props.isPaste
              ? e => {
                  e.preventDefault();
                }
              : undefined
          }
          min={this.props.min || ""}
          max={this.props.max || ""}
          ref={this.props.inputRef || ""}
          disabled={this.props.disable || false}
        />
        <label
          className={
            (this.state.labelClass && !this.props.disable) || false
              ? "label"
              : "label hidden"
          }
          id={
            this.props.id ||
            Math.random()
              .toString(36)
              .substring(7)
          }
        >
          {this.props.label || ""}
        </label>
        {this.props.error || "" ? (
          <p className="error-msg txtnormal">{this.props.error}</p>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default InputField;
