import React, { RefObject } from "react";
import cs from "classnames";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import InputField from "../InputField";
import Loader from "components/Loader";
import SocialLogin from "../socialLogin";
import Popup from "../popup/Popup";
import FormContainer from "../formContainer";
import * as valid from "utils/validate";
import { Context } from "components/Modal/context.ts";
import { ForgotPasswordState } from "./typings";
import { connect } from "react-redux";
import { mapDispatchToProps } from "./mapper/actions";

const mapStateToProps = () => {
  return {};
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class ForgotPasswordForm extends React.Component<Props, ForgotPasswordState> {
  constructor(props: Props) {
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
  }

  static contextType = Context;

  emailInput: RefObject<HTMLInputElement> = React.createRef();

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!this.state.email) {
      this.setState({
        err: true,
        msg: "Please Enter Email",
        disableSelectedbox: false
      });
    } else {
      const formData = new FormData();
      formData.append("email", this.state.email || "");
      this.setState({ disableSelectedbox: true });
      this.props
        .resetPassword(formData)
        .then(data => {
          this.setState({
            err: false,
            msg: "",
            forgotSuccess: true,
            successMsg: data.success,
            disableSelectedbox: false
          });
          const email = document.getElementById("email") as HTMLInputElement;
          email.disabled = true;
        })
        .catch(err => {
          // console.log("err: " + err.response.data.email[0]);
          this.setState({
            err: true,
            msg: err.response.data.email[0],
            disableSelectedbox: false
          });
        });
    }
  };

  componentDidMount() {
    if (this.emailInput.current) {
      this.emailInput.current.focus();
    }
    const email = localStorage.getItem("tempEmail");
    this.setState({
      email
    });
    localStorage.removeItem("tempEmail");
  }

  handleEmailBlur = (event: React.FocusEvent) => {
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
  };

  onChange = (event: React.KeyboardEvent) => {
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
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.currentTarget.value });
  };

  render() {
    const { goRegister } = this.props;
    const formContent = (
      <form onSubmit={this.handleSubmit}>
        <div className={styles.categorylabel}>
          <div>
            <InputField
              id="email"
              blur={this.handleEmailBlur}
              placeholder={"Email"}
              label={"Email"}
              value={this.state.email}
              keyUp={this.onChange}
              handleChange={this.handleChange}
              inputRef={this.emailInput}
              error={this.state.msg}
              border={this.state.err}
            />
          </div>
          <div>
            <input
              type="submit"
              className={globalStyles.ceriseBtn}
              value="reset password"
            />
          </div>
        </div>
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
            onClick={e => {
              goRegister(
                e,
                (this.emailInput.current && this.emailInput.current.value) || ""
              );
            }}
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm);
