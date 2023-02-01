import React, { RefObject } from "react";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import InputField from "../InputField";
import Loader from "components/Loader";
import SocialLogin from "../socialLogin";
import Popup from "../popup/Popup";
import FormContainer from "../formContainer";
import * as valid from "utils/validate";
import { Context } from "components/Modal/context";
import { ForgotPasswordState } from "./typings";
import { connect } from "react-redux";
import { mapDispatchToProps } from "./mapper/actions";
import { RouteComponentProps, withRouter } from "react-router";
import cs from "classnames";

const mapStateToProps = () => {
  return {};
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps;

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
      disableSelectedbox: false,
      isBo: ""
    };
  }

  static contextType = Context;

  emailInput: RefObject<HTMLInputElement> = React.createRef();

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!this.state.email) {
      this.setState(
        {
          err: true,
          msg: "Please enter your Email ID",
          disableSelectedbox: false
        },
        () => {
          valid.errorTracking([this.state.msg as string], location.href);
        }
      );
    } else {
      const formData = new FormData();
      formData.append("email", this.state.email || "");
      formData.append(
        "redirectTo",
        this.props.history.location.pathname +
          this.props.history.location.search || "/"
      );
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
          this.props.showGrowlMessage(
            "Password reset email has been sent. Please follow steps in email to proceed."
          );
          const email = document.getElementById("email") as HTMLInputElement;
          email.disabled = true;
        })
        .catch(err => {
          // console.log("err: " + err.response.data.email[0]);
          if (err.response.data.isNewEmail) {
            const error = [
              "This account does not exist. Please Sign Up"
              // <span
              //   className={globalStyles.linkTextUnderline}
              //   key={2}
              //   onClick={e => {
              //     // this.props.goRegister(
              //     //   e,
              //     //   (this.emailInput.current &&
              //     //     this.emailInput.current.value) ||
              //     //     ""
              //     // );
              //   }}
              // >
              //   Sign Up
              // </span>
            ];
            this.setState({
              err: true,
              msg: error,
              successMsg: "",
              disableSelectedbox: false
            });
            valid.errorTracking(
              ["This account does not exist. Please Sign Up"],
              location.href
            );
          } else if (err.response.data.error_message) {
            let errorMsg = err.response.data.error_message[0];
            if (errorMsg == "MaxRetries") {
              errorMsg =
                "You have exceeded max attempts, please try after some time.";
            }
            this.setState(
              {
                err: true,
                msg: errorMsg,
                successMsg: "",
                disableSelectedbox: false
              },
              () => {
                valid.errorTracking([this.state.msg as string], location.href);
              }
            );
          } else {
            this.setState(
              {
                err: true,
                msg: err.response.data.email[0],
                disableSelectedbox: false
              },
              () => {
                valid.errorTracking([this.state.msg as string], location.href);
              }
            );
          }
        });
    }
  };

  closeModal = () => {
    this.setState({
      err: false,
      msg: "",
      forgotSuccess: true,
      successMsg: "Sucessfully Login",
      disableSelectedbox: false
    });
    const email = document.getElementById("email") as HTMLInputElement;
    email.disabled = true;
  };

  componentDidMount() {
    if (this.emailInput.current) {
      this.emailInput.current.focus();
    }
    const email = localStorage.getItem("tempEmail");
    const isBo = localStorage.getItem("isBo") || "";
    this.setState({
      email: email,
      isBo: isBo
    });
    localStorage.removeItem("tempEmail");
    localStorage.removeItem("isBo");
  }

  handleEmailBlur = (event: React.FocusEvent) => {
    if (valid.checkBlank(this.state.email)) {
      this.setState({
        msg: "Please enter your Email ID",
        err: true
      });
    } else if (!valid.checkMail(this.state.email)) {
      this.setState({
        msg: "Please enter a valid Email ID",
        err: true
      });
    }
  };

  onChange = (event: React.KeyboardEvent) => {
    if (event.keyCode !== 13) {
      if (valid.checkBlank(this.state.email)) {
        this.setState({
          msg: "Please enter your Email ID",
          err: true
        });
      } else if (!valid.checkMail(this.state.email)) {
        this.setState({
          msg: "Please enter a valid Email ID",
          err: true
        });
      } else {
        this.setState({
          msg: "",
          err: false
        });
      }
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.currentTarget.value });
  };

  render() {
    //const { goRegister } = this.props;

    const { forgotSuccess } = this.state;

    const formContent = (
      <form onSubmit={this.handleSubmit}>
        <div className={styles.categorylabel}>
          <div>
            <InputField
              id="email"
              blur={this.handleEmailBlur}
              placeholder={"Email"}
              label={"Email ID*"}
              value={this.state.email}
              keyUp={this.onChange}
              handleChange={this.handleChange}
              inputRef={this.emailInput}
              error={this.state.msg}
              border={this.state.err}
              showLabel={true}
            />
          </div>
          <div>
            <input
              type="submit"
              className={cs(globalStyles.charcoalBtn, {
                [globalStyles.disabledBtn]: forgotSuccess
              })}
              disabled={forgotSuccess}
              value={forgotSuccess ? "Email Sent!" : "reset password"}
            />
          </div>
        </div>
      </form>
    );

    const footer = (
      <>
        <SocialLogin closeModel={this.closeModal} />
        {/* <div className={cs(styles.socialLoginText, styles.socialLoginFooter)}>
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
        </div> */}
      </>
    );

    return (
      <Popup>
        {/* {this.state.successMsg ? (
          <div className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}>
            <div className={globalStyles.successMsg}>
              {this.state.successMsg}
            </div>
          </div>
        ) : (
          ""
        )} */}
        <FormContainer
          heading="Forgot Password"
          subheading="Enter your email address and click on reset password."
          formContent={formContent}
          footer={this.state.isBo ? undefined : footer}
        />
        {this.state.disableSelectedbox && <Loader />}
      </Popup>
    );
  }
}

const ForgotPasswordFormRouter = withRouter(ForgotPasswordForm);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordFormRouter);
