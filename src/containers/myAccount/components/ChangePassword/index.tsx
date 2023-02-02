import React, { useEffect, useRef, useState } from "react";
import cs from "classnames";
import { useDispatch, useSelector } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import FormInput from "../../../../components/Formsy/FormInput";
import Formsy from "formsy-react";
import * as valid from "utils/validate";
import show from "../../../../images/show.svg";
import hide from "../../../../images/hide.svg";
import { Link } from "react-router-dom";
import AccountService from "services/account";
import { PasswordProps } from "./typings";
import { AppState } from "reducers/typings";

const ChangePassword: React.FC<PasswordProps> = ({ setCurrentSection }) => {
  const dispatch = useDispatch();
  const mobile = useSelector((state: AppState) => state?.device?.mobile);
  const ProfileFormRef = useRef<Formsy>(null);

  const [additionalInfo, setAdditionalInfo] = useState({
    showerror: "",
    updatePassword: false,
    passValidLength: false,
    passValidUpper: false,
    passValidLower: false,
    passValidNum: false,
    showPassRules: false,
    shouldValidatePass: false,
    showPassword: false,
    showSuccess: false
  });

  useEffect(() => {
    setCurrentSection();
  }, []);

  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    const { newPassword, oldPassword, newPassword1 } = model;
    const data: any = {
      oldPassword: oldPassword,
      newPassword1: newPassword,
      newPassword2: newPassword1
    };
    AccountService.changePassword(dispatch, data)
      .then(res => {
        if (res.success) {
          resetForm();
          setAdditionalInfo({
            ...additionalInfo,
            showSuccess: true
          });
          setTimeout(() => {
            window.location.replace(window.location.origin);
          }, 3000);
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

  const handleValid = () => {
    setAdditionalInfo({
      ...additionalInfo,
      updatePassword: true
    });
  };

  const handleInvalid = () => {
    if (additionalInfo?.updatePassword == true) {
      setAdditionalInfo({ ...additionalInfo, updatePassword: false });
    }
  };

  const togglePassword = () => {
    setAdditionalInfo({
      ...additionalInfo,
      showPassword: !additionalInfo.showPassword
    });
  };

  const handleBackClick = () => {
    setAdditionalInfo({
      ...additionalInfo,
      showSuccess: false
    });
  };

  const {
    updatePassword,
    showSuccess,
    showPassword,
    passValidLength,
    passValidLower,
    passValidUpper,
    passValidNum,
    shouldValidatePass,
    showPassRules,
    showerror
  } = additionalInfo;
  return (
    <div className={cs(bootstrapStyles.row, styles.loginForm)}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          bootstrapStyles.colMd8,
          bootstrapStyles.offsetMd2
        )}
      >
        {showSuccess ? (
          <>
            <div className={cs(styles.formHeading, styles.formHeadingMulti)}>
              Password Changed
              <br />
              Successfully!
            </div>
            <div className={cs(styles.loginForm, globalStyles.voffset4)}>
              <div className={styles.categorylabel}>
                <Link to="/">
                  <button className={globalStyles.ceriseBtn}>
                    {mobile ? "SHOP NOW" : "CONTINUE SHOPPING"}
                  </button>
                </Link>
                <div className={styles.backBtn} onClick={handleBackClick}>
                  &lt; Back
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.formHeading}>Change Password</div>
            <div className={styles.formSubheading}>
              Manage your personal information and edit your email settings.
            </div>
            <div className={cs(styles.loginForm, globalStyles.voffset4)}>
              <div>
                <Formsy
                  ref={ProfileFormRef}
                  onValidSubmit={handleSubmit}
                  onValid={handleValid}
                  onInvalid={handleInvalid}
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
                        // validationErrors={{
                        //   minLength:
                        //     "Please enter at least 6 characters for the password"
                        // }}
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
                        type={showPassword ? "text" : "password"}
                        onFocus={() => {
                          setAdditionalInfo({
                            ...additionalInfo,
                            showPassRules: true
                          });
                        }}
                        blur={() => {
                          const value =
                            ProfileFormRef?.current &&
                            ProfileFormRef?.current?.getModel().newPassword;
                          if (value) {
                            const res =
                              value.length >= 6 &&
                              value.length <= 20 &&
                              /[a-z]/.test(value) &&
                              /[0-9]/.test(value) &&
                              /[A-Z]/.test(value);
                            if (res) {
                              setAdditionalInfo({
                                ...additionalInfo,
                                showPassRules: false
                              });
                            } else {
                              ProfileFormRef?.current?.updateInputsWithError({
                                newPassword:
                                  "Please verify that your password follows all rules displayed"
                              });
                            }
                          }
                          setAdditionalInfo({
                            ...additionalInfo,
                            shouldValidatePass: true
                          });
                        }}
                        validations={{
                          isValid: (values, value) => {
                            if (value) {
                              const validLength = passValidLength;
                              const validLower = passValidLower;
                              const validUpper = passValidUpper;
                              const validNum = passValidNum;

                              value.length >= 6 && value.length <= 20
                                ? !validLength &&
                                  setAdditionalInfo({
                                    ...additionalInfo,
                                    passValidLength: true
                                  })
                                : validLength &&
                                  setAdditionalInfo({
                                    ...additionalInfo,
                                    passValidLength: false
                                  });

                              /[a-z]/.test(value)
                                ? !validLower &&
                                  setAdditionalInfo({
                                    ...additionalInfo,
                                    passValidLower: true
                                  })
                                : validLower &&
                                  setAdditionalInfo({
                                    ...additionalInfo,
                                    passValidLower: false
                                  });

                              /[0-9]/.test(value)
                                ? !validNum &&
                                  setAdditionalInfo({
                                    ...additionalInfo,
                                    passValidNum: true
                                  })
                                : validNum &&
                                  setAdditionalInfo({
                                    ...additionalInfo,
                                    passValidNum: false
                                  });

                              /[A-Z]/.test(value)
                                ? !validUpper &&
                                  setAdditionalInfo({
                                    ...additionalInfo,
                                    passValidUpper: true
                                  })
                                : validUpper &&
                                  setAdditionalInfo({
                                    ...additionalInfo,
                                    passValidUpper: false
                                  });
                            } else {
                              setAdditionalInfo({
                                ...additionalInfo,
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
                        onClick={togglePassword}
                      >
                        <img src={showPassword ? show : hide} />
                      </span>
                    </div>
                    <div
                      className={cs(
                        { [styles.show]: showPassRules },
                        styles.passwordValidation
                      )}
                    >
                      <p>Your password must contain</p>
                      <ul>
                        <li
                          className={cs({
                            [styles.correct]: passValidLength
                          })}
                        >
                          6 to 20 characters
                        </li>
                        <li
                          className={cs({
                            [styles.correct]: passValidUpper
                          })}
                        >
                          1 uppercase
                        </li>
                        <li
                          className={cs({
                            [styles.correct]: passValidNum
                          })}
                        >
                          1 numeric digit
                        </li>
                        <li
                          className={cs({
                            [styles.correct]: passValidLower
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
                        type={showPassword ? "text" : "password"}
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
                          equalsField: "The password entered doesn't match",
                          isValid:
                            "Please verify that your password follows all rules displayed"
                        }}
                        required
                      />
                    </div>
                    <div>
                      {showerror ? (
                        <p className={styles.loginErrMsg}>{showerror}</p>
                      ) : (
                        ""
                      )}
                      <input
                        type="submit"
                        disabled={!updatePassword}
                        className={
                          updatePassword ? styles.updateDetails : styles.updated
                        }
                        value={updatePassword ? "Update Details" : "Updated"}
                      />
                    </div>
                  </div>
                </Formsy>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// class ChangePassword extends React.Component<Props, State> {
//   constructor(props: Props) {
//     super(props);
//     props.setCurrentSection();
//     this.state = {
//       showerror: "",
//       updatePassword: false,
//       passValidLength: false,
//       passValidUpper: false,
//       passValidLower: false,
//       passValidNum: false,
//       showPassRules: false,
//       shouldValidatePass: false,
//       showPassword: false,
//       showSuccess: false
//     };
//   }
//   ProfileFormRef: RefObject<Formsy> = React.createRef();

//   handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
//     const { newPassword, oldPassword, newPassword1 } = model;
//     const data: any = {
//       oldPassword: oldPassword,
//       newPassword1: newPassword,
//       newPassword2: newPassword1
//     };

//     this.props
//       .changePassword(data)
//       .then(res => {
//         if (res.success) {
//           resetForm();
//           this.setState({
//             showSuccess: true
//           });
//           setTimeout(() => {
//             window.location.replace(window.location.origin);
//           }, 3000);
//         }
//       })
//       .catch(err => {
//         const errorMessage = err.response.data.message;
//         Object.keys(errorMessage).map(data => {
//           switch (data) {
//             case "oldPassword":
//               updateInputsWithError(
//                 {
//                   [data]: errorMessage[data]
//                 },
//                 true
//               );
//               break;
//             case "newPassword1":
//             case "newPassword2":
//               updateInputsWithError(
//                 {
//                   newPassword: errorMessage[data]
//                 },
//                 true
//               );
//               break;
//           }
//         });
//         const errors = Object.entries(errorMessage).map(
//           ([key, value]) => (value as string[])[0]
//         );
//         valid.errorTracking(errors as string[], location.href);
//       });
//   };

//   handleValid = () => {
//     this.setState({
//       updatePassword: true
//     });
//   };

//   handleInvalid = () => {
//     if (this.state.updatePassword == true) {
//       this.setState({ updatePassword: false });
//     }
//   };

//   togglePassword = () => {
//     this.setState(prevState => {
//       return {
//         showPassword: !prevState.showPassword
//       };
//     });
//   };

//   handleBackClick = () => {
//     this.setState({
//       showSuccess: false
//     });
//   };

//   render() {
//     const { updatePassword } = this.state;
//     return (
//       <div className={cs(bootstrapStyles.row, styles.loginForm)}>
//         <div
//           className={cs(
//             bootstrapStyles.col10,
//             bootstrapStyles.offset1,
//             bootstrapStyles.colMd8,
//             bootstrapStyles.offsetMd2
//           )}
//         >
//           {this.state.showSuccess ? (
//             <>
//               <div className={cs(styles.formHeading, styles.formHeadingMulti)}>
//                 Password Changed
//                 <br />
//                 Successfully!
//               </div>
//               <div className={cs(styles.loginForm, globalStyles.voffset4)}>
//                 <div className={styles.categorylabel}>
//                   <Link to="/">
//                     <button className={globalStyles.ceriseBtn}>
//                       {this.props.mobile ? "SHOP NOW" : "CONTINUE SHOPPING"}
//                     </button>
//                   </Link>
//                   <div
//                     className={styles.backBtn}
//                     onClick={this.handleBackClick}
//                   >
//                     &lt; Back
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className={styles.formHeading}>Change Password</div>
//               <div className={styles.formSubheading}>
//                 Manage your personal information and edit your email settings.
//               </div>
//               <div className={cs(styles.loginForm, globalStyles.voffset4)}>
//                 <div>
//                   <Formsy
//                     ref={this.ProfileFormRef}
//                     onValidSubmit={this.handleSubmit}
//                     onValid={this.handleValid}
//                     onInvalid={this.handleInvalid}
//                   >
//                     <div className={styles.categorylabel}>
//                       <div>
//                         <FormInput
//                           name="oldPassword"
//                           placeholder={"Old Password"}
//                           label={"Old Password"}
//                           keyPress={e =>
//                             e.key == "Enter" ? e.preventDefault() : ""
//                           }
//                           type={"password"}
//                           validations={{
//                             minLength: 6
//                           }}
//                           // validationErrors={{
//                           //   minLength:
//                           //     "Please enter at least 6 characters for the password"
//                           // }}
//                           required
//                         />
//                       </div>
//                       <div>
//                         <FormInput
//                           name="newPassword"
//                           placeholder={"New Password"}
//                           label={"New Password"}
//                           keyPress={e =>
//                             e.key == "Enter" ? e.preventDefault() : ""
//                           }
//                           type={this.state.showPassword ? "text" : "password"}
//                           onFocus={() => {
//                             this.setState({
//                               showPassRules: true
//                             });
//                           }}
//                           blur={() => {
//                             const value =
//                               this.ProfileFormRef.current &&
//                               this.ProfileFormRef.current.getModel()
//                                 .newPassword;
//                             if (value) {
//                               const res =
//                                 value.length >= 6 &&
//                                 value.length <= 20 &&
//                                 /[a-z]/.test(value) &&
//                                 /[0-9]/.test(value) &&
//                                 /[A-Z]/.test(value);
//                               if (res) {
//                                 this.setState({
//                                   showPassRules: false
//                                 });
//                               } else {
//                                 this.ProfileFormRef.current?.updateInputsWithError(
//                                   {
//                                     newPassword:
//                                       "Please verify that your password follows all rules displayed"
//                                   }
//                                 );
//                               }
//                             }
//                             this.setState({
//                               shouldValidatePass: true
//                             });
//                           }}
//                           validations={{
//                             isValid: (values, value) => {
//                               const {
//                                 passValidLength,
//                                 passValidLower,
//                                 passValidUpper,
//                                 passValidNum,
//                                 shouldValidatePass
//                               } = this.state;
//                               if (value) {
//                                 const validLength = passValidLength;
//                                 const validLower = passValidLower;
//                                 const validUpper = passValidUpper;
//                                 const validNum = passValidNum;

//                                 value.length >= 6 && value.length <= 20
//                                   ? !validLength &&
//                                     this.setState({
//                                       passValidLength: true
//                                     })
//                                   : validLength &&
//                                     this.setState({
//                                       passValidLength: false
//                                     });

//                                 /[a-z]/.test(value)
//                                   ? !validLower &&
//                                     this.setState({
//                                       passValidLower: true
//                                     })
//                                   : validLower &&
//                                     this.setState({
//                                       passValidLower: false
//                                     });

//                                 /[0-9]/.test(value)
//                                   ? !validNum &&
//                                     this.setState({
//                                       passValidNum: true
//                                     })
//                                   : validNum &&
//                                     this.setState({
//                                       passValidNum: false
//                                     });

//                                 /[A-Z]/.test(value)
//                                   ? !validUpper &&
//                                     this.setState({
//                                       passValidUpper: true
//                                     })
//                                   : validUpper &&
//                                     this.setState({
//                                       passValidUpper: false
//                                     });
//                               } else {
//                                 this.setState({
//                                   passValidLength: false,
//                                   passValidLower: false,
//                                   passValidUpper: false,
//                                   passValidNum: false
//                                 });
//                               }
//                               return shouldValidatePass
//                                 ? value &&
//                                     value.length >= 6 &&
//                                     value.length <= 20 &&
//                                     /[a-z]/.test(value) &&
//                                     /[0-9]/.test(value) &&
//                                     /[A-Z]/.test(value)
//                                 : true;
//                             }
//                           }}
//                           validationErrors={{
//                             isValid:
//                               "Please verify that your password follows all rules displayed"
//                           }}
//                           required
//                         />
//                         <span
//                           className={styles.togglePasswordBtn}
//                           onClick={this.togglePassword}
//                         >
//                           <img src={this.state.showPassword ? show : hide} />
//                         </span>
//                       </div>
//                       <div
//                         className={cs(
//                           { [styles.show]: this.state.showPassRules },
//                           styles.passwordValidation
//                         )}
//                       >
//                         <p>Your password must contain</p>
//                         <ul>
//                           <li
//                             className={cs({
//                               [styles.correct]: this.state.passValidLength
//                             })}
//                           >
//                             6 to 20 characters
//                           </li>
//                           <li
//                             className={cs({
//                               [styles.correct]: this.state.passValidUpper
//                             })}
//                           >
//                             1 uppercase
//                           </li>
//                           <li
//                             className={cs({
//                               [styles.correct]: this.state.passValidNum
//                             })}
//                           >
//                             1 numeric digit
//                           </li>
//                           <li
//                             className={cs({
//                               [styles.correct]: this.state.passValidLower
//                             })}
//                           >
//                             1 lowercase
//                           </li>
//                         </ul>
//                       </div>
//                       <div>
//                         <FormInput
//                           name="newPassword1"
//                           placeholder={"Confirm Password"}
//                           label={"Confirm Password"}
//                           isDrop={true}
//                           isPaste={true}
//                           keyPress={e =>
//                             e.key == "Enter" ? e.preventDefault() : ""
//                           }
//                           type={this.state.showPassword ? "text" : "password"}
//                           validations={{
//                             equalsField: "newPassword",
//                             isValid: (values, value) => {
//                               return (
//                                 values.newPassword1 &&
//                                 value &&
//                                 value.length >= 6 &&
//                                 /[a-z]/.test(value) &&
//                                 /[0-9]/.test(value) &&
//                                 /[A-Z]/.test(value)
//                               );
//                             }
//                           }}
//                           validationErrors={{
//                             equalsField: "The password entered doesn't match",
//                             isValid:
//                               "Please verify that your password follows all rules displayed"
//                           }}
//                           required
//                         />
//                       </div>
//                       <div>
//                         {this.state.showerror ? (
//                           <p className={styles.loginErrMsg}>
//                             {this.state.showerror}
//                           </p>
//                         ) : (
//                           ""
//                         )}
//                         <input
//                           type="submit"
//                           disabled={!updatePassword}
//                           className={
//                             updatePassword
//                               ? styles.updateDetails
//                               : styles.updated
//                           }
//                           value={updatePassword ? "Update Details" : "Updated"}
//                         />
//                       </div>
//                     </div>
//                   </Formsy>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }
// }

export default ChangePassword;
