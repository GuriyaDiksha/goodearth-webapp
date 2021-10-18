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
import show from "../../../../images/show.svg";
import hide from "../../../../images/hide.svg";

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
      updatePassword: false,
      passValidLength: false,
      passValidUpper: false,
      passValidLower: false,
      passValidNum: false,
      showPassRules: false,
      shouldValidatePass: false,
      showPassword: false
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

  togglePassword = () => {
    this.setState(prevState => {
      return {
        showPassword: !prevState.showPassword
      };
    });
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
                        minLength: 6
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
                      name="newPassword"
                      placeholder={"New Password"}
                      label={"New Password"}
                      keyPress={e =>
                        e.key == "Enter" ? e.preventDefault() : ""
                      }
                      type={this.state.showPassword ? "text" : "password"}
                      onFocus={() => {
                        this.setState({
                          showPassRules: true
                        });
                      }}
                      blur={() => {
                        const value =
                          this.ProfileFormRef.current &&
                          this.ProfileFormRef.current.getModel().newPassword;
                        if (value) {
                          const res =
                            value.length >= 6 &&
                            value.length <= 20 &&
                            /[a-z]/.test(value) &&
                            /[0-9]/.test(value) &&
                            /[A-Z]/.test(value);
                          if (res) {
                            this.setState({
                              showPassRules: false
                            });
                          } else {
                            this.ProfileFormRef.current?.updateInputsWithError({
                              newPassword:
                                "Please verify that your password follows all rules displayed"
                            });
                          }
                        }
                        this.setState({
                          shouldValidatePass: true
                        });
                      }}
                      validations={{
                        isValid: (values, value) => {
                          const {
                            passValidLength,
                            passValidLower,
                            passValidUpper,
                            passValidNum,
                            shouldValidatePass
                          } = this.state;
                          if (value) {
                            const validLength = passValidLength;
                            const validLower = passValidLower;
                            const validUpper = passValidUpper;
                            const validNum = passValidNum;

                            value.length >= 6 && value.length <= 20
                              ? !validLength &&
                                this.setState({
                                  passValidLength: true
                                })
                              : validLength &&
                                this.setState({
                                  passValidLength: false
                                });

                            /[a-z]/.test(value)
                              ? !validLower &&
                                this.setState({
                                  passValidLower: true
                                })
                              : validLower &&
                                this.setState({
                                  passValidLower: false
                                });

                            /[0-9]/.test(value)
                              ? !validNum &&
                                this.setState({
                                  passValidNum: true
                                })
                              : validNum &&
                                this.setState({
                                  passValidNum: false
                                });

                            /[A-Z]/.test(value)
                              ? !validUpper &&
                                this.setState({
                                  passValidUpper: true
                                })
                              : validUpper &&
                                this.setState({
                                  passValidUpper: false
                                });
                          } else {
                            this.setState({
                              passValidLength: false,
                              passValidLower: false,
                              passValidUpper: false,
                              passValidNum: false
                            });
                          }
                          return shouldValidatePass
                            ? value &&
                                value.length >= 6 &&
                                value.length <= 20 &&
                                /[a-z]/.test(value) &&
                                /[0-9]/.test(value) &&
                                /[A-Z]/.test(value)
                            : true;
                        }
                      }}
                      validationErrors={{
                        isValid:
                          "Please verify that your password follows all rules displayed"
                      }}
                      required
                    />
                    <span
                      className={styles.togglePasswordBtn}
                      onClick={this.togglePassword}
                    >
                      <img src={this.state.showPassword ? show : hide} />
                    </span>
                  </div>
                  <div
                    className={cs(
                      { [styles.show]: this.state.showPassRules },
                      styles.passwordValidation
                    )}
                  >
                    <p>Your password must contain</p>
                    <ul>
                      <li
                        className={cs({
                          [styles.correct]: this.state.passValidLength
                        })}
                      >
                        6 to 20 characters
                      </li>
                      <li
                        className={cs({
                          [styles.correct]: this.state.passValidUpper
                        })}
                      >
                        1 uppercase
                      </li>
                      <li
                        className={cs({
                          [styles.correct]: this.state.passValidNum
                        })}
                      >
                        1 numeric digit
                      </li>
                      <li
                        className={cs({
                          [styles.correct]: this.state.passValidLower
                        })}
                      >
                        1 lowercase
                      </li>
                    </ul>
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
                      type={this.state.showPassword ? "text" : "password"}
                      validations={{
                        equalsField: "newPassword",
                        isValid: (values, value) => {
                          return (
                            values.newPassword1 &&
                            value &&
                            value.length >= 6 &&
                            /[a-z]/.test(value) &&
                            /[0-9]/.test(value) &&
                            /[A-Z]/.test(value)
                          );
                        }
                      }}
                      validationErrors={{
                        equalsField: "The password entered doesn't match"
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
