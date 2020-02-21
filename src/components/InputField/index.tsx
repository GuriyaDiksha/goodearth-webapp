import React from "react";
import cs from "classnames";

import { Props, State } from "./typings";

import globalStyles from "styles/global.scss";

export default class InputField extends React.Component<Props, State> {
  state: State = {
    labelclass: false
  };
  // constructor(props: Props) {
  //     super(props);
  //     this.state = {
  //         // type: this.props.type || 'text',
  //         value: this.props.value || '',
  //         labelclass: false,
  //         // label: this.props.label || "",
  //         // error: this.props.error || "",
  //         placeholder: this.props.placeholder || "",
  //         // border: this.props.border || false,
  //         // disable: this.props.disable || false,
  //         // classes: this.props.class || "",
  //         // id:this.props.id ||  Math.random().toString(36).substring(7)
  //     };
  //     this.handleClick = this.handleClick.bind(this);
  // }

  // handleClick = (event: React.MouseEvent) => {
  //     if(!this.state.labelclass || this.state.placeholder !== '') {
  //         this.setState({
  //             labelclass: true,
  //             placeholder:''
  //         });
  //     }
  // }

  // handleClickBlur(event) {
  //     // if (this.state.value.length == 0) {
  //     //     this.setState({
  //     //         labelclass: true,
  //     //         placeholder: ''
  //     //     });
  //     // } else {
  //     //     this.setState({
  //     //         labelclass: true
  //     //     });
  //     // }
  //     if(!this.state.labelclass || this.state.placeholder !== '') {
  //         this.setState({
  //             labelclass: true,
  //             placeholder:''
  //         });
  //     }
  //     this.props.blur ? this.props.blur() : "";
  // }

  // handleChange(event) {
  //     this.setState({
  //         value: event.target.value

  //     })
  //     if(this.props.disablePassword) {
  //         this.props.disablePassword();
  //     }
  //     if(this.props.handleChange) {
  //         this.props.handleChange(event);
  //     }
  // }

  // handleKeyUp(e) {
  //     this.props.keyup ? this.props.keyup(e) : "";
  // }

  // handleKeyPress(e) {
  //     this.props.keypress ? this.props.keypress(e) : "";
  // }

  // // checkEquality(nextProps) {
  // //     for(let propName in nextProps) {
  // //         if(this.state.)
  // //     }
  // //     return true;
  // // }
  // componentWillReceiveProps(nextProps) {
  //     if(nextProps.isPlaceholderVisible && this.state.placeholder === "") {

  //             this.setState({
  //                 placeholder: this.props.placeholder,
  //                 value: "",
  //                 labelclass: false
  //             })

  //     }
  //     else if(nextProps.value && this.state.value !== nextProps.value){
  //         this.setState({
  //             value: nextProps.value || this.state.value,
  //             // error: nextProps.error,
  //             // errorBorder: nextProps.border || false,
  //             // classes: nextProps.class? nextProps.class:'',
  //             // disable: nextProps.disable
  //         })
  //     }
  // }

  render() {
    const { className, type, id, value, placeholder } = this.props;

    return (
      <div className={cs(globalStyles.formFieldContainer, className)}>
        <input
          className={globalStyles.formField}
          id={
            id ||
            Math.random()
              .toString(36)
              .substring(7)
          }
          type={type || "text"}
          value={value}
          placeholder={placeholder}
          // onChange={this.handleChange}
          // autoComplete="new-password"
          // onClick={this.handleClick} onBlur={this.handleClickBlur}
          // onFocus={this.handleClick}
          // onKeyPress={this.handleKeyPress.bind(this)}
          // onKeyUp={this.handleKeyUp.bind(this)}
          // onDrop={this.props.isdrop?(e) => {e.preventDefault();}:''}
          // onPaste={this.props.ispaste?(e) => {e.preventDefault();}:''}
          // ref={this.props.inputRef || ""}
          // disabled={this.props.disable || false}
        />
        {/* <label className={this.state.labelclass && !this.props.disable || false ? "label" : "label hidden" }
                       id={this.props.id ||  Math.random().toString(36).substring(7)}>{this.props.label || ""}</label> */}
        {/* {this.props.error || ""?<p className="error-msg txtnormal" >{this.props.error}</p>:""} */}
      </div>
    );
  }
}
