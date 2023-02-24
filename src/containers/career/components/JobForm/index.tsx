import React, { RefObject } from "react";
import { Job } from "../../typings";
import styles from "../../styles.scss";
import globalStyles from "../../../../styles/global.scss";
import cs from "classnames";
import newCareers from "../../../../images/careers/newCareers.jpg";
import newCareersMobile from "../../../../images/careers/newCareersMobile.jpg";
import Formsy from "formsy-react";
import shareFb from "../../../../images/careers/shareFb.svg";
import shareLinkedin from "../../../../images/careers/shareLinkedin.svg";
import shareIcon from "../../../../images/careers/shareIcon.svg";
import LoginService from "services/login";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import CareerService from "services/career";
import ReCAPTCHA from "react-google-recaptcha";
import Loader from "components/Loader";
import { errorTracking, getErrorList } from "utils/validate";
import ReactHtmlParser from "react-html-parser";
import { updateCountryData } from "actions/address";
import { AppState } from "reducers/typings";

const mapStateToProps = (state: AppState) => {
  return {
    showTimer: state.info.showTimer
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    fetchCountryData: async () => {
      const countryData = await LoginService.fetchCountryData(dispatch);
      dispatch(updateCountryData(countryData));
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
  states: {
    value: string;
    label: string;
  }[];
  errorMessage: string;
  fileNameTobeShown: string;
  errorMessageCaptcha: string;
  isVerified: boolean;
  formSubmit: boolean;
  successMessage: string;
  isLoading: boolean;
  captchaDemo: string;
  fileSizeErrorMessage: string;
  fileName: string;
  file: File | null;
};

class JobForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      countries: [],
      states: [],
      errorMessage: "",
      fileSizeErrorMessage: "",
      fileNameTobeShown: "",
      errorMessageCaptcha: "Please verify that you are a human.",
      isVerified: false,
      formSubmit: false,
      successMessage: "",
      isLoading: false,
      captchaDemo: "",
      fileName: "",
      file: null
    };
  }
  captchaRef = React.createRef<typeof ReCAPTCHA>();

  componentDidMount() {
    window.scrollTo(0, 0);
    this.initializeCountries();
    this.onLoadRecaptcha();
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

  handleFileChangeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event) {
      this.setState({
        fileSizeErrorMessage: ""
      });
      const fileName = event.target.value;
      const file = event.target.files && event.target.files[0];
      const fileSize = file && file.size;
      if (fileSize && Math.abs(fileSize / 1000000) > 10) {
        this.setState(
          {
            fileSizeErrorMessage: "Upload limit is 10MB"
          },
          () => {
            errorTracking([this.state.fileSizeErrorMessage], location.href);
          }
        );
        return;
      }
      const fileNameTobeShown =
        fileName.substring(fileName.lastIndexOf("\\") + 1).trim() ||
        fileName.substring(fileName.lastIndexOf("//") + 1).trim();

      this.setState({
        fileNameTobeShown,
        fileName,
        file
      });
    }
  };

  removeFile = () => {
    this.setState({
      fileNameTobeShown: "",
      fileName: "",
      file: null,
      fileSizeErrorMessage: ""
    });
  };

  verifyCallback = () => {
    this.setState({
      isVerified: true
    });
  };

  handleInvalidSubmit = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLInputElement | HTMLSelectElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = getErrorList(globalStyles.errorMsg, "job-form");
      if (errorList && errorList.length) {
        errorTracking(errorList, location.href);
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
      email,
      firstName,
      lastName,
      currentEmployer,
      yearOfExperience,
      highestQualification,
      country,
      state,
      city,
      isd,
      phoneNo,
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
    formData.append("email", email);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    const countryCode = country;
    const countryName = this.state.countries.filter(
      country => country.value == countryCode
    )[0].label;
    formData.append("country", countryName);
    formData.append("state", state);
    formData.append("phoneNumber", `${isd}-${phoneNo}`);
    formData.append("aboutUser", aboutUser);
    formData.append("city", city);
    formData.append("currentEmployer", currentEmployer || "");
    formData.append("yearOfExperience", yearOfExperience || 0);
    formData.append("highest_Qualification", highestQualification || "");
    if (this.state.file && this.state.fileName) {
      formData.append("resume", this.state.file, this.state.fileName);
    }
    this.props
      .saveJobApplication(formData)
      .then(data => {
        if (data.success) {
          this.setState(
            {
              successMessage: data.message,
              isLoading: false,
              fileSizeErrorMessage: ""
            },
            () => {
              this.resetFormData();
            }
          );
        } else {
          this.setState(
            {
              successMessage: "Something went wrong. Please try again.",
              isLoading: false
            },
            () => {
              errorTracking([this.state.successMessage], location.href);
            }
          );
        }
      })
      .catch(err => {
        if (typeof err.response.data == "object") {
          const key = Object.keys(err.response.data)[0];
          let errorMsg = err.response.data[key];
          if (errorMsg == "MaxRetries") {
            errorMsg =
              "You have exceeded max attempts, please try after some time.";
          }
          this.setState({
            successMessage: errorMsg
          });
        }
      })
      .finally(() => {
        this.setState({
          isLoading: false
        });
      });
  };

  resetFormData = () => {
    const form = this.jobForm.current;
    if (form) {
      form.reset();
      // reset state
      const { state } = form.getModel();
      if (state) {
        form.updateInputsWithValue(
          {
            state: "",
            country: ""
          },
          false
        );
      }
    }
    this.removeFile();
    this.onLoadRecaptcha();
    this.setState({ formSubmit: false });
  };

  onInputClick(event: React.MouseEvent<HTMLInputElement>) {
    event.currentTarget.value = "";
  }

  onLoadRecaptcha = () => {
    const captcha = this.captchaRef.current;
    if (captcha) {
      captcha.reset();
      captcha.execute();
    }
  };

  render() {
    const { job, mobile } = this.props;

    return (
      <div className={styles.jobForm}>
        {!job ? (
          <div
            className={cs(styles.careersContent, {
              [styles.careersContentTimer]: this.props.showTimer
            })}
          >
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
            <div
              className={cs(styles.longJobDescription, {
                [styles.longJobDescriptionMobile]: mobile
              })}
            >
              <h5 className={cs(globalStyles.op2, styles.jobLocation)}>
                JOB DESCRIPTION
              </h5>
              <h6>{job.jobTitle}</h6>
              <div className={cs(styles.jdInfo, globalStyles.op2)}>
                {ReactHtmlParser(job.jobLongDescription)}
              </div>
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
                          <img src={shareIcon} width="35" />
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
                            "https://www.linkedin.com/shareArticle?mini=true&url=" +
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
        <div className={cs(globalStyles.ceriseBtn, styles.applyCta)}>
          <a href={__CAREERS_FORM__} target="_blank" rel="noopener noreferrer">
            Apply
          </a>
        </div>
        {this.state.isLoading && <Loader />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobForm);
