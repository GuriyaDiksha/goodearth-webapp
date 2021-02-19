import React, { RefObject } from "react";
import cs from "classnames";
import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import FormInput from "../../../../components/Formsy/FormInput";
import Formsy from "formsy-react";
import { PasswordProps, State } from "./typings";
import mapDispatchToProps from "./mapper/actions";
import * as valid from "utils/validate";

const mapStateToProps = () => {
  return {};
};
type Props = PasswordProps & ReturnType<typeof mapDispatchToProps>;

class ChangePassword extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
    this.state = {
      showerror: "",
      updatePassword: false
    };
  }
  ProfileFormRef: RefObject<Formsy> = React.createRef();

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const { newPassword, oldPassword, newPassword1 } = model;
    const data: any = {
      oldPassword: oldPassword,
      newPassword1: newPassword,
      newPassword2: newPassword1
    };

    this.props
      .changePassword(data)
      .then(res => {
        if (res.success) {
          resetForm();
        }
      })
      .catch(err => {
        const errorMessage = err.response.data.message;
        Object.keys(errorMessage).map(data => {
          switch (data) {
            case "oldPassword":
              updateInputsWithError(
                {
                  [data]: errorMessage[data]
                },
                true
              );
              break;
            case "newPassword1":
            case "newPassword2":
              updateInputsWithError(
                {
                  newPassword: errorMessage[data]
                },
                true
              );
              break;
          }
        });
        const errors = Object.entries(errorMessage).map(
          ([key, value]) => (value as string[])[0]
        );
        valid.errorTracking(errors as string[], location.href);
      });
  };

  handleValid = () => {
    this.setState({
      updatePassword: true
    });
  };

  handleInvalid = () => {
    if (this.state.updatePassword == true) {
      this.setState({ updatePassword: false });
    }
  };

  render() {
    const { updatePassword } = this.state;
    return (
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2
          )}
        >
          <div className={styles.formHeading}>Change Password</div>
          <div className={styles.formSubheading}>
            Manage your personal information and edit your email settings.
          </div>
          <div className={cs(styles.loginForm, globalStyles.voffset4)}>
            <div>
              <Formsy
                ref={this.ProfileFormRef}
                onValidSubmit={this.handleSubmit}
                onValid={this.handleValid}
                onInvalid={this.handleInvalid}
              >
                <div className={styles.categorylabel}>
                  <div>
                    <FormInput
                      name="oldPassword"
                      placeholder={"Old Password"}
                      label={"Old Password"}
                      keyPress={e =>
                        e.key == "Enter" ? e.preventDefault() : ""
                      }
                      type={"password"}
                      validations={{
                        minLength: 6,
                        isValid: (values, value) => {
                          return (
                            values.password1 &&
                            value &&
                            /[a-z]/.test(value) &&
                            /[0-9]/.test(value) &&
                            /[A-Z]/.test(value)
                          );
                        }
                      }}
                      validationErrors={{
                        minLength:
                          "Please enter at least 6 characters for the password",
                        isValid:
                          "Password should be between 6 to 20 characters which should contain at least one numeric digit, one uppercase and one lowercase letter."
                      }}
                      required
                    />
                  </div>
                  <div>
                    <FormInput
                      name="newPassword"
                      placeholder={"New Password"}
                      label={"New Password"}
                      keyPress={e =>
                        e.key == "Enter" ? e.preventDefault() : ""
                      }
                      type={"password"}
                      validations={{
                        minLength: 6,
                        isValid: (values, value) => {
                          return (
                            values.password1 &&
                            value &&
                            /[a-z]/.test(value) &&
                            /[0-9]/.test(value) &&
                            /[A-Z]/.test(value)
                          );
                        }
                      }}
                      validationErrors={{
                        minLength:
                          "Please enter at least 6 characters for the password"
                      }}
                      required
                    />
                  </div>
                  <div>
                    <FormInput
                      name="newPassword1"
                      placeholder={"Confirm Password"}
                      label={"Confirm Password"}
                      isDrop={true}
                      isPaste={true}
                      keyPress={e =>
                        e.key == "Enter" ? e.preventDefault() : ""
                      }
                      type={"password"}
                      validations={{
                        minLength: 6,
                        equalsField: "newPassword",
                        isValid: (values, value) => {
                          return (
                            values.password1 &&
                            value &&
                            /[a-z]/.test(value) &&
                            /[0-9]/.test(value) &&
                            /[A-Z]/.test(value)
                          );
                        }
                      }}
                      validationErrors={{
                        minLength:
                          "Please enter at least 6 characters for the password",
                        equalsField: "Passwords do not match",
                        isValid:
                          "Password should be between 6 to 20 characters which should contain at least one numeric digit, one uppercase and one lowercase letter."
                      }}
                      required
                    />
                  </div>
                  <div>
                    {this.state.showerror ? (
                      <p className={styles.loginErrMsg}>
                        {this.state.showerror}
                      </p>
                    ) : (
                      ""
                    )}
                    <input
                      type="submit"
                      disabled={!updatePassword}
                      className={cs(
                        { [globalStyles.disabledBtn]: !updatePassword },
                        globalStyles.ceriseBtn
                      )}
                      value={updatePassword ? "Update Details" : "Updated"}
                    />
                  </div>
                </div>
              </Formsy>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
