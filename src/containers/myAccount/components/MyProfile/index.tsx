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
        this.setState({
          showerror: "Something went wrong, please try again"
        });
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
    this.setState({
      user,
      uniqueId,
      abandonedCartNotification,
      newsletter,
      updateProfile: false,
      data: data
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
    this.props
      .updateProfileData(formData)
      .then(data => {
        this.setApiResponse(data);
        this.setState({
          updateProfile: false
        });
      })
      .catch(err => {
        if (err) {
          this.setState({
            showerror: "Something went Wrong"
          });
        }
      });
  };

  handleInvalidSubmit = () => {
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

  render() {
    const { fetchCountryData } = this.props;
    const { genderOptions, loginVia } = this.state;
    const {
      firstName,
      lastName,
      phoneCountryCode,
      phoneNumber,
      gender,
      panPassportNumber,
      dateOfBirth,
      subscribe
    } = this.state.data;
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
                  disable={true}
                  className={styles.disabledInput}
                />
              </div>
              <div>
                <FormInput
                  name="firstName"
                  placeholder={"First Name"}
                  label={"First Name"}
                  keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
                  required
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  disable={firstName == "" ? false : true}
                  className={firstName == "" ? "" : styles.disabledInput}
                />
              </div>
              <div>
                <FormInput
                  name="lastName"
                  placeholder={"Last Name"}
                  label={"Last Name"}
                  keyPress={e => (e.key == " Enter" ? e.preventDefault() : "")}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  disable={lastName == "" ? false : true}
                  className={lastName == "" ? "" : styles.disabledInput}
                />
              </div>
              <div className={styles.userGenderPicker}>
                <FormSelect
                  name="gender"
                  required
                  options={genderOptions}
                  label="Select Gender"
                  placeholder="Select Gender"
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  disable={gender == "" ? false : true}
                  className={gender == "" ? "" : styles.disabledInput}
                />
              </div>
              <div className={styles.calendarIconContainer}>
                <FormInput
                  name="dateOfBirth"
                  type="date"
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  value={dateOfBirth}
                  disable={dateOfBirth == "" ? false : true}
                  className={dateOfBirth == "" ? "" : styles.disabledInput}
                  id="dateOfBirth"
                  placeholder="YYYY/MM/DD"
                  label="Date of Birth"
                  min={moment(
                    new Date().setFullYear(new Date().getFullYear() - 110)
                  ).format("YYYY-MM-DD")}
                  max={moment(
                    new Date().setFullYear(new Date().getFullYear() - 15)
                  ).format("YYYY-MM-DD")}
                  validations={{
                    isValidDate: (values, value) => {
                      if (value && !dateOfBirth) {
                        return moment(value).isValid();
                      } else return true;
                    },
                    isMinAllowedDate: (values, value) => {
                      if (value && !dateOfBirth) {
                        return (
                          new Date(value).getTime() >
                          new Date(this.state.minDate).getTime()
                        );
                      } else return true;
                    },
                    isMaxAllowedDate: (values, value) => {
                      if (value && !dateOfBirth) {
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
              </div>
              <div
                className={cs(styles.countryCode, styles.countryCodeProfile)}
              >
                <CountryCode
                  fetchCountryData={fetchCountryData}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  name="phoneCountryCode"
                  placeholder="Code"
                  label="Code"
                  value=""
                  disable={phoneCountryCode == "" ? false : true}
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
                  name="phoneNumber"
                  placeholder={"Contact Number"}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  type="number"
                  label={"Contact Number"}
                  disable={phoneNumber == "" ? false : true}
                  className={phoneNumber == "" ? "" : styles.disabledInput}
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
                  name="panPassportNumber"
                  placeholder={"Pan/Passport"}
                  label={"Pan/Passport"}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  disable={panPassportNumber == "" ? false : true}
                  className={
                    panPassportNumber == "" ? "" : styles.disabledInput
                  }
                />
              </div>
              <div className={styles.subscribe}>
                <FormCheckbox
                  value={subscribe || false}
                  name="subscribe"
                  disable={false}
                  handleChange={() => {
                    this.setState({ updateProfile: true });
                  }}
                  id="subscribe"
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
                  <p className={globalStyles.errorMsg}>
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
                />
              </div>
            </div>
          </Formsy>
        </div>
        <SignedIn loginVia={loginVia} />
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
