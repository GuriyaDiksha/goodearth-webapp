import React, { Component, RefObject } from "react";
import cs from "classnames";
import style from "./styles.scss";
import { otpBoxProps } from "./typings";
import globalStyles from "styles/global.scss";

export default class OtpBox extends Component<otpBoxProps, { otp: string }> {
  constructor(props: otpBoxProps) {
    super(props);
    this.state = {
      otp: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  otpInput: RefObject<HTMLInputElement> = React.createRef();

  handleChange(event: any) {
    if (!isNaN(Number(event.target.value))) {
      this.setState(
        {
          otp: event.target.value
        },
        () => {
          this.props.otpValue(this.state.otp);
        }
      );
    }
  }

  componentDidMount() {
    this.otpInput.current && this.otpInput.current.focus();
  }
  render() {
    return (
      <div className={cs(style.redeemOtp, globalStyles.voffset4)}>
        <input
          name="otp"
          ref={this.otpInput}
          value={this.state.otp}
          type="text"
          maxLength={6}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
