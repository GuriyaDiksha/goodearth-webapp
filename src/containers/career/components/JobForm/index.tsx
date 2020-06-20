import React, { RefObject } from "react";
// import Formsy, { addValidationRule } from 'formsy-react';

// import Loader from 'components/Loader';
import { Job } from "../../typings";
import styles from "../../styles.scss";
import globalStyles from "../../../../styles/global.scss";
// import { Link } from 'react-router-dom';
import cs from "classnames";
import newCareers from "../../../../images/careers/newCareers.jpg";
import newCareersMobile from "../../../../images/careers/newCareersMobile.jpg";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import FormSelect from "components/Formsy/FormSelect";
import shareFb from "../../../../images/careers/shareFb.svg";
import shareLinkedin from "../../../../images/careers/shareLinkedin.svg";
import FormTextArea from "components/Formsy/FormTextArea";
import uploadResume from "../../../../images/careers/uploadResume.svg";
import LoginService from "services/login";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import CareerService from "services/career";
// import { updateCountryData } from 'actions/address';

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchCountryData: async () => {
      const countryData = await LoginService.fetchCountryData(dispatch);
      return countryData;
    },
    saveJobApplication: async (formData: any) => {
      const data = await CareerService.saveJobApplication(dispatch, formData);
      return data;
    }
  };
};

type Props = {
  job?: Job;
  mobile: boolean;
  applyAllJob?: Job;
  mode: string;
} & ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  countries: {
    value: string;
    label: string;
    states: {
      value: string;
      label: string;
    }[];
    isd: string | undefined;
  }[];
  // country: "";
  states: {
    value: string;
    label: string;
  }[];
  errorMessage: string;
  // isd: null;
  fileNameTobeShown: string;
  errorMessageCaptcha: string;
  isVerified: boolean;
  formSubmit: boolean;
  successMessage: string;
  isLoading: boolean;
  captchaDemo: string;
  // isApplyAll: boolean;
  fileSizeErrorMessage: string;
  fileName: string;
  file: File | null;
};

class JobForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // jobDetails: props.jobDetails,
      countries: [],
      // country: "",
      states: [],
      errorMessage: "",
      fileSizeErrorMessage: "",
      // isd: null,
      fileNameTobeShown: "",
      errorMessageCaptcha: "Please verify that you are a human.",
      isVerified: false,
      formSubmit: false,
      successMessage: "",
      isLoading: false,
      captchaDemo: "",
      // isApplyAll: false,
      fileName: "",
      file: null
      // formData: {
      //     cv_for_job: "",
      //     email: "",
      //     first_name: "",
      //     last_name: "",
      //     city: "",
      //     phone_number: "",
      //     state: "",
      //     country: "",
      //     about_user: "",
      //     fileName: "",
      //     current_employeer : "",
      //     year_of_experience: "",
      //     highest_qualification : "",
      //     file: {}
      // }
    };
    // this.handleChange  = this.handleChange.bind(this);
    // this.verifyCallback = this.verifyCallback.bind(this);
    // this.handleFileChangeUpload = this.handleFileChangeUpload.bind(this);
    // this.removeFile = this.removeFile.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
    // this.prepareFormData = this.prepareFormData.bind(this);
    // this.resetFormData = this.resetFormData.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.initializeCountries();

    //     const isApplyAll = this.props.mode == "applyAll";
    //     if(!isApplyAll && window.location.pathname.replace('/careers/', '').split("/")[1] === 'all') {
    //         this.setState({
    //             isApplyAll: true
    //         });
    //     }
    //     CommonApi.fetchCountries().then(res => {
    //         let states;
    //         let countries = res.data.map((country) => {
    //             states = country.region_set.map((state) => {
    //                 return Object.assign({}, {
    //                     label: state.name_ascii,
    //                     value: state.name_ascii
    //                 })
    //             });
    //             return Object.assign({}, {
    //                 value: country.code2,
    //                 label: country.name_ascii,
    //                 states: states,
    //                 isd: country.isd_code
    //             })
    //         });
    //         this.setState({countries: countries}, this.setState({states: states}));
    //     });
    //     addValidationRule('decimal', (values, value) => {
    //         return /(^\d*\.?\d*[0-9]+\d*$)|(^[0-9]+\d*\.\d*$)/.test(value);
    //     });
    //     this.captcha.onLoadRecaptcha();
  }

  jobForm: RefObject<Formsy> = React.createRef();
  initializeCountries = () => {
    this.props.fetchCountryData().then(countryData => {
      let states;
      const countries = countryData.map(country => {
        states = country.regionSet.map(state => {
          return Object.assign(
            {},
            {
              label: state.nameAscii,
              value: state.nameAscii
            }
          );
        });
        return Object.assign(
          {},
          {
            value: country.code2,
            label: country.nameAscii,
            states: states,
            isd: country.isdCode
          }
        );
      });
      this.setState({ countries });
    });
  };

  // setStates(value, countries, load) {
  //     let states = "", isd_code = "", countryName = "";
  //     countries = countries ? countries : this.state.countries;
  //     countries.map((country) => {
  //         if (country.value == value) {
  //             states = country.states;
  //             isd_code = country.isd
  //         }
  //     });
  //     this.setState({states: states, isd: isd_code});
  // }

  onCountrySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.currentTarget.value;
    const { states, isd } = this.state.countries.filter(
      country => country.value == selectedCountry
    )[0];

    const form = this.jobForm.current;
    if (form) {
      // reset state
      const { state } = form.getModel();
      if (state) {
        form.updateInputsWithValue(
          {
            state: ""
          },
          false
        );
      }
      form.updateInputsWithValue({
        isd: isd
      });
    }
    this.setState({ states });
  };
  // handleChange(event) {
  //     const formData = this.state.formData;
  //     if (event.target.name == "country") {
  //         const countryCode = event.target.value;
  //         const country = this.state.countries.filter((country) => country.value == countryCode)[0].label;
  //         formData['country'] = country;
  //         this.setStates(countryCode, this.state.countries);
  //     } else if (event.target.name == "state") {
  //         formData["state"] = event.target.value;
  //     } else {
  //         formData[event.target.name] = event.target.value;
  //     }
  //     this.setState({
  //         formData
  //     });
  //     this.setState({successMessage: ""})
  // }

  handleFileChangeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      this.setState({
        fileSizeErrorMessage: ""
      });
      const fileName = event.target.value;
      const file = event.target.files && event.target.files[0];
      const fileSize = file && file.size;
      if (fileSize && Math.abs(fileSize / 1000000) > 10) {
        this.setState({
          fileSizeErrorMessage: "Upload limit is 10MB"
        });
        return;
      }
      const fileNameTobeShown =
        fileName.substring(fileName.lastIndexOf("\\") + 1).trim() ||
        fileName.substring(fileName.lastIndexOf("//") + 1).trim();
      // const formData = this.state.formData;
      // formData["fileName"] = fileName;
      // formData["file"] = file;

      this.setState({
        fileNameTobeShown,
        fileName,
        file
        // formData: formData
      });
    }
  };

  removeFile = () => {
    // const formData = this.state.formData;
    // formData["fileName"] = "";
    // formData["file"] = {};
    this.setState({
      fileNameTobeShown: "",
      fileName: "",
      file: null,
      fileSizeErrorMessage: ""
      // formData: formData
    });
  };

  // verifyCallback(recaptchaToken) {
  //     if (recaptchaToken) {
  //         this.setState({
  //             isVerified: true
  //         })
  //     }
  // }

  handleInvalidSubmit = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLInputElement | HTMLSelectElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 0);
  };

  handleSubmit = (model: any, resetModel: any, updateInputsWithError: any) => {
    this.setState({
      formSubmit: true
    });
    if (this.state.isVerified) {
      this.setState({
        isLoading: true
      });
      this.prepareFormData(model);
    }
  };

  prepareFormData = (model: any) => {
    const formData = new FormData();
    const {
      cvForJob,
      emailId,
      firstName,
      lastName,
      currentEmployer,
      yearOfExperience,
      highestQualification,
      country,
      state,
      city,
      isd,
      phoneNumber,
      aboutUser
    } = model;
    const { job, mode, applyAllJob } = this.props;
    if (mode == "applyAll" && applyAllJob) {
      formData.append("jobId", applyAllJob.jobId.toString());
      formData.append("location", applyAllJob.locationName);
      formData.append("cvForJob", cvForJob);
    } else if (job) {
      formData.append("cvForJob", job.jobTitle || "");
      formData.append("jobId", job.jobId.toString());
      formData.append("location", job.locationName);
    }
    // common fields
    formData.append("email", emailId);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    const countryCode = country;
    const countryName = this.state.countries.filter(
      country => country.value == countryCode
    )[0].label;
    formData.append("country", countryName);
    formData.append("state", state);
    formData.append("phoneNumber", `${isd}-${phoneNumber}`);
    formData.append("aboutUser", aboutUser);
    formData.append("city", city);
    formData.append("currentEmployer", currentEmployer || "");
    formData.append("yearOfExperience", yearOfExperience || 0);
    formData.append("highest_Qualification", highestQualification || "");
    if (this.state.file && this.state.fileName) {
      formData.append("resume", this.state.file, this.state.fileName);
    }
    this.props.saveJobApplication(formData).then(data => {
      if (data.success) {
        this.setState(
          {
            successMessage: data.message,
            isLoading: false
          },
          () => {
            this.resetFormData();
          }
        );
      } else {
        this.setState({
          successMessage: "Something went wrong. Please try again.",
          isLoading: false
        });
      }
    });
  };

  resetFormData = () => {
    this.jobForm.current && this.jobForm.current.reset();
    this.removeFile();
    // this.captcha.onLoadRecaptcha();
    this.setState({ formSubmit: false });
  };

  onInputClick(event: React.MouseEvent<HTMLInputElement>) {
    event.currentTarget.value = "";
  }

  render() {
    const isExistyError = "This field is required";
    const isExistyCode = "Required";
    const { job } = this.props;
    const formContent = (
      <div className={cs(styles.jobApplication, styles.loginForm)}>
        <h4>APPLY</h4>
        <Formsy
          onValidSubmit={this.handleSubmit}
          onInvalidSubmit={this.handleInvalidSubmit}
          ref={this.jobForm}
        >
          <div
            className={cs(
              styles.form,
              styles.jobFormFields,
              styles.categorylabel
            )}
          >
            {this.props.mode == "applyAll" ? (
              <div className="margin-t-30">
                <FormInput
                  required
                  label="Job Title"
                  placeholder="Job Title"
                  // onChange={this.handleChange}
                  name="cvForJob"
                  // value={this.state.formData.cv_for_job}
                  validations={{
                    isExisty: true,
                    maxLength: 100,
                    matchRegexp: /[A-Za-z -_]+/
                  }}
                  validationErrors={{
                    isExisty: isExistyError,
                    maxLength: "Max limit reached.",
                    matchRegexp: "Job Title should contain only alphabets."
                  }}
                  // ref="cv_for_job"
                />
              </div>
            ) : (
              ""
            )}
            <div className="margin-t-30">
              <FormInput
                required
                name="emailId"
                label="Email Address"
                className="input-field"
                placeholder="Email Address"
                // onChange={this.handleChange}
                // value={this.state.formData.email}
                validations={{
                  isExisty: true,
                  //   matchRegexp: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  isEmail: true
                }}
                validationErrors={{
                  isExisty: isExistyError,
                  //   matchRegexp: "Please enter a valid email"
                  isEmail: "Please enter a valid email"
                }}
                // ref="email"
              />
            </div>
            <div className="margin-t-30">
              <FormInput
                required
                label="First Name"
                placeholder="First Name"
                // onChange={this.handleChange}
                name="firstName"
                // value={this.state.formData.first_name}
                validations={{
                  isExisty: true,
                  maxLength: 30,
                  isAlpha: true
                }}
                validationErrors={{
                  isExisty: isExistyError,
                  maxLength: "Max limit reached.",
                  isAlpha: "Name Should contain only alphabets."
                }}
                // ref="first_name"
              />
            </div>
            <div className="margin-t-30">
              <FormInput
                required
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                // onChange={this.handleChange}
                // value={this.state.formData.last_name}
                validations={{
                  isExisty: true,
                  maxLength: 30,
                  isAlpha: true
                }}
                validationErrors={{
                  isExisty: isExistyError,
                  maxLength: "Max limit reached.",
                  isAlpha: "Name Should contain only alphabets."
                }}
                // ref="last_name"
              />
            </div>

            <div className="margin-t-30">
              <FormInput
                name="currentEmployer"
                label="Current Employer"
                placeholder="Current Employer"
                // onChange={this.handleChange}
                // value={this.state.formData.current_employeer}
                validations={{
                  maxLength: 20
                }}
                validationErrors={{
                  maxLength: "Max limit reached."
                }}
                // ref="current_employeer"
              />
            </div>

            <div className="margin-t-30">
              <FormInput
                name="yearOfExperience"
                label="Experience"
                placeholder="Experience"
                // onChange={this.handleChange}
                // value={this.state.formData.year_of_experience}
                validations={{
                  isNumeric: true,
                  maxLength: 5,
                  matchRegexp: /^\d{1,2}(?:[.,]\d{1,3})?$/
                }}
                validationErrors={{
                  isNumeric: "Please enter valid years of experience",
                  maxLength: "Please enter upto 2 decimal places",
                  matchRegexp: "Please enter valid years of experience"
                }}
                // ref="year_of_experience"
              />
            </div>

            <div className="margin-t-30">
              <FormInput
                name="highestQualification"
                label="Highest Qualification"
                placeholder="Highest Qualification"
                // onChange={this.handleChange}
                // value={this.state.formData.highest_qualification}
                validations={{
                  maxLength: 20
                }}
                validationErrors={{
                  maxLength: "Max limit reached."
                }}
                // ref="highest_qualification"
              />
            </div>

            <div className="margin-t-30 select-group">
              <FormSelect
                required
                name="country"
                label="Your Country"
                options={this.state.countries}
                // innerRef={(c) => { this.countryInput = c; }}
                // options={this.state.countries}
                // value={this.state.country}
                handleChange={this.onCountrySelect}
                placeholder="Your Country"
                validations={{ isExisty: true }}
                validationErrors={{
                  isExisty: isExistyError,
                  isEmptyString: isExistyError
                }}
                // ref="country"
              />
              <span className="arrow"></span>
            </div>
            <div className="margin-t-30 select-group">
              <FormSelect
                required
                name="state"
                label="Your State"
                placeholder="Your State"
                // innerRef={(c) => { this.stateInput = c; }}
                options={this.state.states}
                // value={this.state.formData.state}
                validations={{ isExisty: true }}
                validationErrors={{
                  isExisty: isExistyError,
                  isEmptyString: isExistyError
                }}
                // ref="state"
              />
              <span className="arrow"></span>
            </div>
            <div className="margin-t-30">
              <FormInput
                required
                name="city"
                label="City"
                placeholder="City"
                // onChange={this.handleChange}
                // value={this.state.formData.city}
                validations={{
                  isExisty: true,
                  maxLength: 30
                }}
                validationErrors={{
                  isExisty: isExistyError,
                  maxLength: "Max Limit Reached"
                }}
                // ref="city"
              />
            </div>
            <div className={styles.countryCode}>
              <FormInput
                // ref="isd"
                name="isd"
                label="Code"
                placeholder="Code"
                // value={this.state.isd}
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: isExistyCode
                }}
                disable={true}
              />
              <FormInput
                required
                name="phoneNumber"
                label="Contact Number"
                placeholder="Contact Number"
                // value={this.state.formData.phone_number}
                validations={{
                  isExisty: true,
                  matchRegexp: /^[0-9\-/]+$/,
                  isNumeric: true
                }}
                validationErrors={{
                  isExisty: isExistyError,
                  matchRegexp: "Please enter valid a phone number",
                  isNumeric: "Phone should contain numbers"
                }}
                // ref="phone_number"
              />
            </div>
            <div className="margin-t-30">
              <FormTextArea
                className="more-about-applicant"
                // type="textarea"
                name="aboutUser"
                label="More About You(Optional)"
                placeholder="More About You (Optional)"
                validations={{
                  maxLength: 500
                }}
                validationErrors={{
                  maxLength: "Max limit reached"
                }}
                // value={this.state.formData.about_user}
                // onChange={this.handleChange}
                // ref="about_user"
              />
            </div>
            <div
              className={
                // this.state.formData.fileName
                this.state.fileName ? styles.resumeUploadSection : ""
              }
            >
              <div className={styles.uploadButton}>
                <label htmlFor="inputUpload" className={styles.uploadResume}>
                  <img src={uploadResume} height="80px" />
                  <label
                    htmlFor="inputUpload"
                    className={styles.customFileUpload}
                  >
                    Upload Resume
                  </label>
                  <input
                    id="inputUpload"
                    type="file"
                    accept="application/pdf, .doc, .docx"
                    onChange={this.handleFileChangeUpload}
                    onClick={this.onInputClick}
                  />
                </label>
              </div>
              <div className={styles.fileUploadSection}>
                {// this.state.formData.fileName
                this.state.fileName && (
                  <span className={styles.fileUploaded}>
                    {this.state.fileNameTobeShown}{" "}
                    <span
                      className={styles.fileDelete}
                      onClick={this.removeFile}
                    >
                      &#x2715;
                    </span>
                  </span>
                )}
              </div>
            </div>
            {this.state.fileSizeErrorMessage ? (
              <p
                className={cs(
                  styles.reCaptchaErrorMessage,
                  globalStyles.errorMsg
                )}
              >
                {this.state.fileSizeErrorMessage}
              </p>
            ) : (
              ""
            )}
            <div className={styles.reCaptcha}>
              {/* <RecaptchaComponent ref={(captcha) => { this.captcha = captcha}} verifyCallback={this.verifyCallback}/> */}
              {!this.state.isVerified && this.state.formSubmit && (
                <p
                  className={cs(
                    styles.reCaptchaErrorMessage,
                    globalStyles.errorMsg
                  )}
                >
                  {this.state.errorMessageCaptcha}
                </p>
              )}
            </div>
            <input
              type="submit"
              formNoValidate={true}
              className={cs(
                globalStyles.ceriseBtn,
                globalStyles.marginT30,
                styles.jobApplicationSubmit
              )}
              value="Submit"
            />
            <p className={cs(styles.successMessage, globalStyles.errorMsg)}>
              {this.state.successMessage}
            </p>
          </div>
        </Formsy>
      </div>
    );

    return (
      <div className={styles.jobForm}>
        {!job ? (
          <div className={cs(styles.careersContent, styles.newcareersContent)}>
            <div className={styles.careersImage}>
              <img
                src={this.props.mobile ? newCareersMobile : newCareers}
                className={globalStyles.imgResponsive}
              />
            </div>
            <div className={styles.careersImageCaption}>
              <h3>{`Can't find a role you are looking for?`}</h3>
              <h5>{`Send us your resume and we'll get back to you!`}</h5>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.jobDesignationHeader}>
              <h4 className={styles.jobDesignation}>{job.jobTitle}</h4>
              <h5 className={cs(styles.jobLocation, globalStyles.op2)}>
                {job.locationName}
              </h5>
            </div>
            <div className={styles.longJobDescription}>
              <h5 className={cs(globalStyles.op2, styles.jobLocation)}>
                JOB DESCRIPTION
              </h5>
              <h6>{job.jobTitle}</h6>
              <div
                className={cs(styles.jdInfo, globalStyles.op2)}
                dangerouslySetInnerHTML={{ __html: job.jobLongDescription }}
              ></div>
              {this.props.mode == "applyAll" ? (
                ""
              ) : (
                <div>
                  <h5
                    className={cs(
                      globalStyles.op2,
                      styles.jobLocation,
                      globalStyles.voffset1
                    )}
                  >
                    job id: {job.jobId}
                  </h5>
                  <div className={styles.socialIconsShare}>
                    <ul className={globalStyles.voffset2}>
                      <li>
                        {this.props.mobile ? (
                          <img
                            src="/static/img/social-icons/icons_share.svg"
                            width="35"
                          />
                        ) : (
                          <div
                            className={cs(globalStyles.op2, styles.jobLocation)}
                          >
                            Share this job opening
                          </div>
                        )}
                      </li>
                      <li>
                        <a
                          href={
                            "https://www.linkedin.com/sharing/share-offsite/?url=" +
                            location.href
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={shareLinkedin} width="35" />
                        </a>
                      </li>
                      <li>
                        <div data-href={location.href}>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={
                              "https://www.facebook.com/sharer/sharer.php?u=" +
                              location.href +
                              "&utm_source=Website-Shared&utm_medium=Facebook;src=sdkpreparse"
                            }
                            className="fb-xfbml-parse-ignore"
                          >
                            <img src={shareFb} width="35" />
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {formContent}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobForm);
