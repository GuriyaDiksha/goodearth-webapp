import React, { RefObject } from "react";
import cs from "classnames";

import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";

import { ProfileProps, State, ProfileResponse } from "./typings";
import FormInput from "../../../../components/Formsy/FormInput";
import FormSelect from "../../../../components/Formsy/FormSelect";
import CountryCode from "../../../../components/Formsy/CountryCode";

import moment from "moment";
import Formsy from "formsy-react";
import FormCheckbox from "components/Formsy/FormCheckbox";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import mapDispatchToProps from "./mapper/actions";
import SignedIn from "../SignedIn";

const mapStateToProps = () => {
  return {};
};

type Props = ProfileProps & ReturnType<typeof mapDispatchToProps>;
class MyProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: {},
      newsletter: false,
      uniqueId: "",
      abandonedCartNotification: false,
      user: 0,
      updateProfile: false,
      subscribe: false,
      showerror: "",
      panHighlight: false,
      panmsg: "",
      dateOfBirth: "",
      code: "",
      loginVia: "email",
      showDOBLabel: false,
      nmsg: "",
      phoneNumber: "",
      phonecodeError: "",
      highlightCode: false,
      numHighlight: false,
      genderOptions: [
        { value: "Female", label: "Female" },
        { value: "Male", label: "Male" },
        { value: "Others", label: "Others" }
      ],
      minDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 110)
      ).format("YYYY-MM-DD"),
      maxDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 15)
      ).format("YYYY-MM-DD"),
      errorDob: "",
      hightlightDob: false
    };
    // this.todaydate = moment();
    props.setCurrentSection();
  }
  ProfileFormRef: RefObject<Formsy> = React.createRef();

  componentDidMount() {
    this.props
      .fetchProfileData()
      .then(data => {
        this.setApiResponse(data);
      })
      .catch(err => {
        // this.refs.emailRef.state.value = window.user.email;
        // this.setState({});
      });
  }

  setApiResponse = (data: ProfileResponse) => {
    const {
      user,
      uniqueId,
      abandonedCartNotification,
      newsletter,
      loginVia,
      ...formData
    } = data;
    formData.dateOfBirth = formData.dateOfBirth
      ? moment(formData.dateOfBirth).format("YYYY-MM-DD")
      : "";
    const modifiedData = Object.assign({}, data);
    modifiedData.dateOfBirth = "";
    modifiedData.firstName = "";
    modifiedData.lastName = "";
    modifiedData.gender = "";
    this.setState({
      user,
      uniqueId,
      abandonedCartNotification,
      newsletter,
      updateProfile: false,
      data: modifiedData
    });
    this.ProfileFormRef.current &&
      this.ProfileFormRef.current.updateInputsWithValue(formData);
  };

  handleSubmit = (model: any, resetForm: any, updateIwithError: any) => {
    if (!this.state.updateProfile) return false;
    const {
      phoneCountryCode,
      phoneNumber,
      gender,
      panPassportNumber,
      dateOfBirth,
      subscribe
    } = model;
    const formData: any = {};
    formData["phoneCountryCode"] = phoneCountryCode || "";
    formData["phoneNumber"] = phoneNumber || "";
    formData["gender"] = gender || "";
    formData["panPassportNumber"] = panPassportNumber || "";
    formData["dateOfBirth"] = dateOfBirth
      ? moment(dateOfBirth).format("YYYY-MM-DD")
      : "";
    formData["subscribe"] = subscribe;

    this.setState({
      showerror: ""
    });

    // const previousResponse = this.state.data;
    this.props
      .updateProfileData(formData)
      .then(data => {
        this.setApiResponse(data);
        this.setState({
          updateProfile: false
          // showerror: data.message
        });
      })
      .catch(err => {
        if (err) {
          this.setState({
            showerror: err
          });
        } else {
          this.setState({
            showerror: "Something went Wrong"
          });
        }
      });
  };

  handleClick(event: React.MouseEvent) {
    // this.state.subscribe = event.target.checked;
    // this.setState({
    //     subscribe: event.target.checked
    // }, this.myBlur())
  }

  myBlur() {
    // let change = false;
    // if (this.refs.Fname.state.value !== this.state.data.firstName) {
    //     change = true;
    // }
    // if (this.refs.Lname.state.value !== this.state.data.lastName) {
    //     change = true;
    // }
    // if(this.refs.phoneref.state.value && this.refs.countryref.state.value || !this.refs.phoneref.state.value && !this.refs.countryref.state.value) {
    //     if (this.refs.phoneref.state.value !== this.state.data.phone) {
    //         change = true;
    //     }
    //     if (this.refs.countryref.state.value != this.state.data.code) {
    //         change=true;
    //     }
    // }
    // if (this.refs.panref.state.value !== this.state.data.panPassportNumber) {
    //     change = true;
    // }
    // if (this.state.subscribe !== this.state.data.subscribe) {
    //     change = true;
    // }
    // if (this.refs.genderRef.state.selectedGender != this.state.data.gender) {
    //     change=true;
    // }
    // if (this.pickerRef.props.selected  && (this.pickerRef.props.selected != this.state.data.dateOfBirth)) {
    //     change=true;
    // }
    // if (change) {
    //     this.setState({
    //         updateProfile: true
    //     })
    // } else {
    //     this.setState({
    //         updateProfile: false
    //     })
    // }
  }

  setGender(gender: string) {
    // this.setState({
    //     gender: gender,
    //     highlightGender: false,
    //     msgGender: ""
    // }, () => {
    //     this.myBlur();
    // });
  }

  onClickCalendar() {
    // this.pickerRef.setOpen(true);
  }

  setCode(data: string) {
    // this.setState({
    //     code: data,
    //     codemsg: ""
    // }, () => {
    //     this.myBlur();
    // })
  }

  onChange(date: Date) {
    // this.setState({
    //     dateOfBirth: date,
    //     errorMessage: ""
    // }, () => {
    //     this.myBlur();
    //     // this.setState({
    //     //     updateProfile: true
    //     // })
    // })
  }

  handleDOBFocus(showDOBLabel: boolean) {
    this.setState({
      showDOBLabel
    });
  }

  handleInvalidSubmit = () => {
    // const elem = this.subscribeRef.current;
    // if (elem && elem.checked == false) {
    //   this.setState({
    //     message: "Please accept the terms & conditions"
    //   });
    // } else {
    //   this.setState({
    //     message: ""
    //   });
    // }
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 0);
  };

  myPhoneBlur() {
    // if (this.state.code.trim().length == 0 && this.refs.phoneref.state.value.trim().length > 0) {
    //     this.setState({
    //         phonecodeError: "Required",
    //         highlightCode: true,
    //         nmsg: "",
    //         numHighlight: false
    //     })
    // }
    // else if ((this.refs.phoneref.state.value.trim().length == 0 && this.state.code.trim().length > 0)) {
    //     this.setState({
    //         nmsg: "This field is required",
    //         numHighlight: true,
    //         phonecodeError: "",
    //         highlightCode: false
    //     })
    // }
    // else {
    //     this.setState({
    //         phonecodeError: "",
    //         highlightCode: false,
    //         nmsg: "",
    //         numHighlight: false
    //     })
    // }
    this.myBlur();
  }

  render() {
    const { fetchCountryData } = this.props;
    const formContent = (
      <div className={cs(styles.loginForm, globalStyles.voffset4)}>
        <div>
          <Formsy
            ref={this.ProfileFormRef}
            onValidSubmit={this.handleSubmit}
            onInvalidSubmit={this.handleInvalidSubmit}
          >
            <div className={styles.categorylabel}>
              <div>
                <FormInput
                  name="emailId"
                  placeholder={"Email Address"}
                  label={"Email"}
                  // border={this.state.highlight}
                  // error={this.state.msg}
                  disable={true}
                  className={styles.disabledInput}
                />
              </div>
              <div>
                <FormInput
                  // ref="Fname"
                  name="firstName"
                  placeholder={"First Name"}
                  label={"First Name"}
                  // border={this.state.f_highlight}
                  // keyup={this.myBlur}
                  keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
                  required
                  blur={this.myBlur}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  disable={this.state.data.firstName == "" ? false : true}
                  className={
                    this.state.data.firstName == "" ? "" : styles.disabledInput
                  }
                  // error={this.state.fmsg}
                />
              </div>
              <div>
                <FormInput
                  // ref="Lname"
                  name="lastName"
                  placeholder={"Last Name"}
                  label={"Last Name"}
                  keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  // border={this.state.l_highlight}
                  // keyup={this.myBlur}
                  blur={this.myBlur}
                  disable={this.state.data.lastName == "" ? false : true}
                  className={
                    this.state.data.lastName == "" ? "" : styles.disabledInput
                  }
                  // error={this.state.lmsg}
                />
              </div>
              <div className={styles.userGenderPicker}>
                <FormSelect
                  // ref="genderRef"
                  name="gender"
                  required
                  options={this.state.genderOptions}
                  label="Select Gender"
                  placeholder="Select Gender"
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  // setGender={this.setGender}
                  // msgGender={this.state.msgGender}
                  // gender={this.state.gender}
                  // highlightGender={this.state.highlightGender}
                  disable={this.state.data.gender == "" ? false : true}
                  className={
                    this.state.data.gender == "" ? "" : styles.disabledInput
                  }
                />
              </div>
              <div className={styles.calendarIconContainer}>
                <FormInput
                  name="dateOfBirth"
                  type="date"
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  // onChange={(e) => this.onChange(e)}
                  value={this.state.data.dateOfBirth}
                  disable={this.state.data.dateOfBirth == "" ? false : true}
                  className={
                    this.state.data.dateOfBirth == ""
                      ? ""
                      : styles.disabledInput
                  }
                  // ref="dobRef"
                  id="dateOfBirth"
                  placeholder="YYYY/MM/DD"
                  label="Date of Birth"
                  min={moment(
                    new Date().setFullYear(new Date().getFullYear() - 110)
                  ).format("YYYY-MM-DD")}
                  max={moment(
                    new Date().setFullYear(new Date().getFullYear() - 15)
                  ).format("YYYY-MM-DD")}
                  // error={this.state.errorDob}
                  // border={this.state.highlightDob}
                  validations={{
                    isValidDate: (values, value) => {
                      if (value && this.state.data.dateOfBirth) {
                        return moment(value).isValid();
                      } else return true;
                    },
                    isMinAllowedDate: (values, value) => {
                      if (value && this.state.data.dateOfBirth) {
                        return (
                          new Date(value).getTime() >
                          new Date(this.state.minDate).getTime()
                        );
                      } else return true;
                    },
                    isMaxAllowedDate: (values, value) => {
                      if (value && this.state.data.dateOfBirth) {
                        return (
                          new Date(value).getTime() <
                          new Date(this.state.maxDate).getTime()
                        );
                      } else return true;
                    }
                  }}
                  validationErrors={{
                    isValidDate: "Please enter valid date oof birth",
                    isMinAllowedDate: "Please enter valid date of birth",
                    isMaxAllowedDate: "Age should be at least 15 years"
                  }}
                />
                {/* {this.state.showDOBLabel ? "label" : "label hidden" ? <label htmlFor="dateOfBirth">Date of Birth</label> : ""} */}
                {/* {this.state.errorDob || ""?<p className="error-msg txtnormal" >{this.state.errorDob}</p>:""}
                        <label htmlFor="dateOfBirth">Date of Birth</label> */}
              </div>
              <div
                className={cs(styles.countryCode, styles.countryCodeProfile)}
              >
                <CountryCode
                  // ref='countryref'
                  fetchCountryData={fetchCountryData}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  name="phoneCountryCode"
                  placeholder="Code"
                  label="Code"
                  value=""
                  // setCode={this.setCode}
                  // codemsg={this.state.codemsg}
                  // code={this.state.code}
                  disable={
                    this.state.data.phoneCountryCode == "" ? false : true
                  }
                  // error={this.state.phonecodeError}
                  // blur={this.myPhoneBlur}
                  // border={this.state.highlightCode}
                  id="isd_code"
                  validations={{
                    isCodeValid: (values, value) => {
                      return !(values.phone && value == "");
                    }
                  }}
                  validationErrors={{
                    isCodeValid: "Required"
                  }}
                />

                <FormInput
                  // ref="phoneref"
                  name="phoneNumber"
                  placeholder={"Contact Number"}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  type="number"
                  label={"Contact Number"}
                  // border={this.state.numHighlight}
                  disable={this.state.data.phoneNumber == "" ? false : true}
                  className={
                    this.state.data.phoneNumber == ""
                      ? ""
                      : styles.disabledInput
                  }
                  // keyup={this.myPhoneBlur}
                  // blur={this.myPhoneBlur}
                  // error={this.state.nmsg}
                  validations={{
                    isPhoneValid: (values, value) => {
                      return !(values.code && value == "");
                    }
                  }}
                  validationErrors={{
                    isPhoneValid: "This field is Required."
                  }}
                  keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                />
              </div>
              <div>
                <FormInput
                  // ref="panref"
                  name="panPassportNumber"
                  placeholder={"Pan/Passport"}
                  label={"Pan/Passport"}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  // border={this.state.panHighlight}
                  disable={
                    this.state.data.panPassportNumber == "" ? false : true
                  }
                  className={
                    this.state.data.panPassportNumber == ""
                      ? ""
                      : styles.disabledInput
                  }
                  // keyup={this.myPhoneBlur}
                  // blur={this.myPhoneBlur}
                  // error={this.state.panmsg}
                />
              </div>
              <div className={styles.subscribe}>
                <FormCheckbox
                  // type="checkbox"
                  name="subscribe"
                  disable={false}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  id="subscribe"
                  // inputRef={this.subscribeRef}
                  // onChange={this.handleClick}
                  // checked={this.state.subscribe}
                  label={[
                    "I agree to receiving e-mails, calls and text messages for service related information. To know more how we keep your data safe, refer to our ",
                    <Link
                      key="terms"
                      to="/customer-assistance/privacy-policy"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                  ]}
                />
              </div>
              <div>
                {this.state.showerror ? (
                  <p className="common-error-msg profile">
                    {this.state.showerror}
                  </p>
                ) : (
                  ""
                )}
                <input
                  type="submit"
                  disabled={!this.state.updateProfile}
                  className={
                    this.state.updateProfile
                      ? globalStyles.ceriseBtn
                      : cs(globalStyles.disabledBtn, globalStyles.ceriseBtn)
                  }
                  value={
                    this.state.updateProfile ? "Update Details" : "Updated"
                  }
                  // onClick={this.handleSubmit.bind(this)}
                />
              </div>
            </div>
          </Formsy>
        </div>
        <SignedIn loginVia={this.state.loginVia} />
      </div>
    );
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
          <div className={styles.formHeading}>My Profile</div>
          <div className={styles.formSubheading}>
            Manage your personal information and edit your email settings.
          </div>
          {formContent}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
