import React, { RefObject } from "react";
import cs from "classnames";

import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";

import { ProfileProps, State } from "./typings";
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
    // axios.get(Config.hostname + `myapi/customer/`)
    //     .then(res => {
    //         this.setApiResponse(res.data);
    //     }).catch((err) => {
    //     this.refs.emailRef.state.value = window.user.email;
    //     this.setState({});
    // });
  }

  // setApiResponse(data) {
  //     let new_data = Object.assign({}, data);
  //     new_data.phone = new_data.phoneNumber?new_data.phoneNumber.split(' ')[1]?new_data.phoneNumber.split(' ')[1]:new_data.phoneNumber.split(' ')[0]:"";
  //     this.refs.phoneref.state.value = new_data.phone;
  //     this.refs.emailRef.state.value = window.user.email;
  //     this.refs.Fname.state.value = new_data.firstName;
  //     this.refs.Lname.state.value = new_data.lastName;
  //     this.refs.panref.state.value = new_data.panPassportNumber;
  //     let dob = new_data.dateOfBirth ? moment(new_data.dateOfBirth, "YYYY-MM-DD") : "";
  //     new_data.code = new_data.phoneNumber ? new_data.phoneNumber.split(' ').length > 1 ? new_data.phoneNumber.split(' ')[0] : '' : "";
  //     const loginVia = new_data.loginVia ? new_data.loginVia : this.state.loginVia ? this.state.loginVia : this.state.loginVia;
  //     this.setState({
  //         data: new_data,
  //         subscribe: data.subscribe,
  //         code: new_data.code,
  //         updateProfile: false,
  //         gender: data.gender,
  //         loginVia: loginVia,
  //         dateOfBirth: dob
  //     });
  // }

  handleSubmit() {
    // if (!this.state.updateProfile) return false;
    // if(this.state.nmsg || this.state.phonecodeError || this.state.errorDob) {
    //     return false;
    // }
    // this.setState({
    //     nmsg: "",
    //     numHighlight: false
    // })
    // let formData = new FormData();
    // formData.append("subscribe", this.state.subscribe)
    // const phoneNumber = this.state.code && this.refs.phoneref.state.value ?  `${this.state.code} ${this.refs.phoneref.state.value}` :  "";
    // formData.append("phoneNumber", phoneNumber)
    // formData.append("email_id", this.refs.emailRef.state.value)
    // formData.append("firstName", this.refs.Fname.state.value)
    // formData.append("lastName", this.refs.Lname.state.value)
    // formData.append("panPassportNumber", this.refs.panref.state.value)
    // formData.append("gender", this.state.gender || "")
    // const dateOfBirth = this.state.dateOfBirth ? moment(this.state.dateOfBirth).format('YYYY-MM-DD') : "";
    // formData.append("dateOfBirth", dateOfBirth)
    // this.setState({
    //     showerror: ""
    // })
    // const previousResponse = this.state.data;
    // axios.post(Config.hostname + 'myapi/user_profile/', formData
    // ).then((response) => {
    //     if (response.data.is_success) {
    //         this.setApiResponse(response.data);
    //     } else  if(response.data.message){
    //         this.setState({
    //             updateProfile: false,
    //             showerror: response.data.message
    //         }, () => {
    //             this.setApiResponse(previousResponse);
    //         })
    //     } else if (response.data.is_success == false && response.data.phoneNumber) {
    //         this.setState({
    //             nmsg: response.data.phoneNumber,
    //             numHighlight: true
    //         })
    //     }
    // }).catch((err) => {
    //     if (err.message) {
    //         this.setState({
    //             showerror: err.message
    //         })
    //     } else {
    //         this.setState({
    //             showerror: "Something went Wrong"
    //         })
    //     }
    // })
  }

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
    //     msgt: "Please accept the terms & conditions"
    //   });
    // } else {
    //   this.setState({
    //     msgt: ""
    //   });
    // }
    // setTimeout(() => {
    //   const firstErrorField = document.getElementsByClassName(
    //     globalStyles.errorBorder
    //   )[0] as HTMLElement;
    //   if (firstErrorField) {
    //     firstErrorField.focus();
    //     firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
    //   } else if (elem && elem.checked == false) {
    //     elem.focus();
    //     elem.scrollIntoView({ block: "center", behavior: "smooth" });
    //   }
    // }, 0);
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
                  name="Email"
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
                  blur={this.myBlur}
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
                  options={this.state.genderOptions}
                  label="Select Gender"
                  placeholder="Select Gender"
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
                  // onChange={(e) => this.onChange(e)}
                  value={this.state.dateOfBirth}
                  disable={this.state.data.dateOfBirth == "" ? false : true}
                  className={
                    this.state.data.dateOfBirth == ""
                      ? ""
                      : styles.disabledInput
                  }
                  // ref="dobRef"
                  id="dateOfBirth"
                  placeholder="YYYY/MM/DD"
                  // label="Date of Birth"
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
                      if (value) {
                        return moment(value).isValid();
                      } else return true;
                    },
                    isMinAllowedDate: (values, value) => {
                      if (value) {
                        return (
                          new Date(value).getTime() >
                          new Date(this.state.minDate).getTime()
                        );
                      } else return true;
                    },
                    isMaxAllowedDate: (values, value) => {
                      if (value) {
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
                  name="code"
                  placeholder="Code"
                  label="Code"
                  value=""
                  // setCode={this.setCode}
                  // codemsg={this.state.codemsg}
                  code={this.state.code}
                  disable={this.state.data.phoneNumber == "" ? false : true}
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
                  name="phone"
                  placeholder={"Contact Number"}
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
                  name="passport"
                  placeholder={"Pan/Passport"}
                  label={"Pan/Passport"}
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
                  name="terms"
                  disable={false}
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
                {/* <label htmlFor="subscribe">I agree to receiving e-mails, calls and text messages for service related information. To know more how we keep your data safe, refer to our  <a href="/customer-assistance/privacy-policy" target="_blank">Privacy Policy</a> </label> */}
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
                  onClick={this.handleSubmit.bind(this)}
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
