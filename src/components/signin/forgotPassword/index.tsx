import React, { RefObject } from "react";
import cs from "classnames";
// import Axios from 'axios';
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
// import iconStyles from "styles/iconFonts.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import InputField from "../InputField";
import Loader from "components/Loader";
import SocialLogin from "../socialLogin";
import Popup from "../popup/Popup";
import FormContainer from "../formContainer";
import LoginService from "services/login";
import * as valid from "utils/validate";
import { Context } from "components/Modal/context.ts";

// import Config from 'components/config'

import { ForgotPasswordProps, ForgotPasswordState } from "./typings";

class ForgotPasswordForm extends React.Component<
  ForgotPasswordProps,
  ForgotPasswordState
> {
  constructor(props: ForgotPasswordProps) {
    super(props);
    this.state = {
      email: "",
      err: false,
      msg: "",
      forgotSuccess: false,
      successMsg: "",
      url: location.pathname + location.search,
      disableSelectedbox: false
    };
    // this.goRegister = this.goRegister.bind(this);
    // this.onChange  = this.onChange.bind(this);
  }
  static contextType = Context;

  // emailRef: RefObject<InputField> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", this.state.email || "");
    this.setState({ disableSelectedbox: true });
    LoginService.resetPassword(formData)
      .then(res => {
        // let element = document.getElementById('email');
        this.setState({
          err: false,
          msg: "",
          forgotSuccess: true,
          successMsg: res.data.success,
          disableSelectedbox: false
        });
        // element.value = "";
        // element.disabled = true;
      })
      .catch(err => {
        console.log("err: " + err.response.data.email[0]);
        this.setState({
          err: true,
          msg: err.response.data.email[0],
          disableSelectedbox: false
        });
      });
  }

  componentDidMount() {
    if (this.emailInput.current) {
      this.emailInput.current.focus();
    }
    // this.state.email = window.email_goodearth || '';
    // this.setState({})
    // window.email_goodearth = '';
  }

  handleEmailBlur(event: React.FocusEvent) {
    if (!valid.checkBlank(this.state.email) || this.state.msg) {
      if (!valid.checkMail(this.state.email)) {
        this.setState({
          msg: "Enter valid email",
          err: true
        });
      } else {
        this.setState({
          msg: "",
          err: false
        });
      }
    }
  }

  onChange(event: React.KeyboardEvent) {
    if (valid.checkBlank(this.state.email)) {
      this.setState({
        msg: "Please Enter Email",
        err: true
      });
    } else if (!valid.checkMail(this.state.email)) {
      this.setState({
        msg: "Enter valid email",
        err: true
      });
    } else {
      this.setState({
        msg: "",
        err: false
      });
    }
  }

  goRegister(event: React.MouseEvent) {
    // window.register_email = this.state.email;
    LoginService.showRegister();
    event.preventDefault();
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.currentTarget.value });
  }

  render() {
    const formContent = (
      <form onSubmit={e => this.handleSubmit(e)}>
        <ul className={styles.categorylabel}>
          <li>
            <InputField
              id="email"
              blur={(e: React.FocusEvent) => this.handleEmailBlur(e)}
              placeholder={"Email"}
              label={"Email"}
              value={this.state.email}
              // ref={this.emailRef}
              keyUp={e => this.onChange(e)}
              handleChange={e => this.handleChange(e)}
              inputRef={this.emailInput}
              error={this.state.msg}
              border={this.state.err}
            />
          </li>
          <li>
            <input
              type="submit"
              className={globalStyles.ceriseBtn}
              value="reset password"
            />
          </li>
        </ul>
      </form>
    );

    const footer = (
      <>
        <SocialLogin />
        <div className={cs(styles.socialLoginText, styles.socialLoginFooter)}>
          {" "}
          Not a member?{" "}
          <span
            className={cs(globalStyles.cerise, globalStyles.pointer)}
            onClick={e => this.goRegister(e)}
          >
            {" "}
            SIGN UP{" "}
          </span>
        </div>
      </>
    );

    return (
      <Popup>
        {this.state.successMsg ? (
          <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
            <div className={globalStyles.successMsg}>
              {this.state.successMsg}
            </div>
          </div>
        ) : (
          ""
        )}
        <FormContainer
          heading="Forgot Password"
          subheading="Enter your email address and click on reset password."
          formContent={formContent}
          footer={footer}
        />
        {this.state.disableSelectedbox && <Loader />}
      </Popup>
    );
  }
}

export default ForgotPasswordForm;
