import React, { RefObject, Fragment } from "react";
import cs from "classnames";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
// import show from "../../../images/showPass.svg";
// import hide from "../../../images/hidePass.svg";
import { Context } from "components/Modal/context";
import moment from "moment";
import Formsy from "formsy-react";
import FormInput from "../../Formsy/FormInput";
import FormSelect from "../../Formsy/FormSelect";
import FormCheckbox from "../../Formsy/FormCheckbox";
import { Link } from "react-router-dom";
import { registerState } from "./typings";
import mapDispatchToProps from "./mapper/actions";
import { connect } from "react-redux";
import { checkMail } from "utils/validate";
import { AppState } from "reducers/typings";
import SocialLogin from "../socialLogin";
import { RegisterProps } from "./typings";
import { genderOptions } from "constants/profile";
import { errorTracking, getErrorList } from "utils/validate";
import { Country } from "components/Formsy/CountryCode/typings";
import EmailVerification from "../emailVerification";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import SelectDropdown from "components/Formsy/SelectDropdown";
// import CountryCode from "components/Formsy/CountryCode";
import FormContainer from "../formContainer";
import tooltipIcon from "images/tooltip.svg";
import tooltipOpenIcon from "images/tooltip-open.svg";
import { CONFIG } from "constants/util";
import Button from "components/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/reactDatepicker.css";
import calendarIcon from "../../../images/bridal/icons_bridal-registry-calendar.svg";
import globalstyles from "styles/global.scss";

const mapStateToProps = (state: AppState) => {
  const isdList = state.address.countryData.map(list => {
    return list.isdCode;
  });
  return {
    location: state.router.location,
    basket: state.basket,
    currency: state.currency,
    isdList: isdList,
    countryData: state.address.countryData,
    // sortBy: state.wishlist.sortBy,
    mobile: state.device.mobile
  };
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RegisterProps;

class CheckoutRegisterForm extends React.Component<Props, registerState> {
  public static defaultProps = {
    isCheckout: false
  };
  private datePickerRef: React.RefObject<DatePicker>;
  constructor(props: Props) {
    super(props);
    this.state = {
      disableButton: false,
      msgt: "",
      url: props.location.pathname + props.location.search,
      showerror: "",
      showFields: true,
      successMsg: "",
      showPassword: false,
      minDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 110)
      ).format("YYYY-MM-DD"),
      maxDate: moment(
        new Date().setFullYear(new Date().getFullYear() - 15)
      ).format("YYYY-MM-DD"),
      showDOBLabel: false,
      passValidLength: false,
      passValidUpper: false,
      passValidLower: false,
      passValidNum: false,
      showPassRules: false,
      shouldValidatePass: false,
      countryOptions: [],
      stateOptions: [],
      isIndia: false,
      showEmailVerification: false,
      email: "",
      showTip: false,
      whatsappChecked: false,
      selectedCountry: "",
      phoneNo: "",
      newsLetterChecked: false,
      selectedDate: null,
      validationErrors: {
        isValidDate: "",
        isMinAllowedDate: "",
        isMaxAllowedDate: ""
      }
    };
    this.datePickerRef = React.createRef();
  }
  static contextType = Context;
  emailRef: RefObject<typeof FormInput> = React.createRef();
  RegisterFormRef: RefObject<Formsy> = React.createRef();
  emailInput: RefObject<HTMLInputElement> = React.createRef();
  subscribeRef: RefObject<HTMLInputElement> = React.createRef();
  firstNameInput: RefObject<HTMLInputElement> = React.createRef();
  lastNameInput: RefObject<HTMLInputElement> = React.createRef();
  countryRef: RefObject<HTMLInputElement> = React.createRef();
  countryCodeRef: RefObject<HTMLInputElement> = React.createRef();
  genderRef: RefObject<HTMLInputElement> = React.createRef();
  whatsappCheckRef: RefObject<HTMLInputElement> = React.createRef();

  componentDidMount() {
    const email = localStorage.getItem("tempEmail") || this.props.email;
    const isSubscribed: boolean =
      localStorage.getItem("isNewsSubscribed") === "true";
    this.setState({
      newsLetterChecked: isSubscribed
    });
    localStorage.removeItem("isNewsSubscribed");
    if (email && this.emailInput.current) {
      this.RegisterFormRef.current &&
        this.RegisterFormRef.current.updateInputsWithValue({
          email: email,
          code: ""
        });
      this.firstNameInput.current?.focus();
      // this.emailInput.current.value = email;
    }
    localStorage.removeItem("tempEmail");
    this.emailInput.current && this.emailInput.current.focus();
    this.props.fetchCountryData();
    this.changeCountryData(this.props.countryData);
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<registerState>,
    snapshot?: any
  ): void {
    if (this.state.successMsg) {
      this.props.setIsSuccessMsg?.(true);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.countryData.length != this.props.countryData.length) {
      this.changeCountryData(nextProps.countryData);
    }
  }
  gtmPushRegister = () => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "eventsToSend",
        eventAction: "signup",
        eventCategory: "formSubmission",
        eventLabel: location.pathname
      });
    }
  };

  handleSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const {
      email,
      // password1,
      // password2,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      country,
      state,
      phone,
      code,
      terms,
      whatsappSubscribe
    } = model;
    const formData: any = {};
    formData["username"] = email;
    formData["email"] = email;
    // formData["password1"] = "Test@123";
    // formData["password2"] = "Test@123";
    formData["firstName"] = firstName;
    formData["lastName"] = lastName;
    formData["gender"] = gender;
    // formData["dateOfBirth"] = dateOfBirth
    //   ? moment(dateOfBirth).format("YYYY-MM-DD")
    //   : null;
    formData["dateOfBirth"] = this.state.selectedDate
      ? moment(this.state.selectedDate).format("YYYY-MM-DD")
      : null;
    const countryCode = this.state.countryOptions.filter(
      countryOption => countryOption.value == country
    )[0].code2;
    formData["country"] = countryCode;
    if (countryCode == "IN") {
      formData["state"] = state || "";
    }

    if (code && phone) {
      formData["phoneNo"] = phone;
      formData["phoneCountryCode"] = code;
    }
    formData["whatsappSubscribe"] = whatsappSubscribe;
    formData["subscribe"] = terms;

    this.setState({
      disableButton: true
    });
    this.props
      .register(formData, "checkout")
      .then(data => {
        const userConsent = CookieService.getCookie("consent").split(",");

        if (userConsent.includes(GA_CALLS)) {
          Moengage.track_event("Registered", {
            "First Name": firstName,
            "Last Name": lastName,
            Country: country,
            State: state,
            Gender: gender,
            "Date of birth": moment(dateOfBirth).format("YYYY-MM-DD"),
            "Contact Number": code + phone
          });
          Moengage.add_first_name(firstName);
          Moengage.add_last_name(lastName);
          Moengage.add_email(email);
          Moengage.add_mobile(code + phone);
          Moengage.add_gender(gender);
          Moengage.add_birthday(moment(dateOfBirth).format("YYYY-MM-DD"));
          Moengage.add_unique_user_id(email);
          dataLayer.push({
            event: "Whatsapp_optin",
            Location: "sign_up",
            Checkbox: formData.whatsappSubscribe
              ? "Whatsapp Opt-in"
              : "Whatsapp Opt-out"
          });
          dataLayer.push({
            event: "newsletter_subscribe",
            click_type: " Sign in"
          });
          // dataLayer.push({
          //   event: "sign_up",
          //   user_status: "logged in", //'Pass the user status ex. logged in OR guest',
          //   login_method: "", //Pass Email or Google as per user selection',
          //   user_id: data?.userId
          // });
        }
        this.gtmPushRegister();
        // this.props.nextStep?.();
        this.setState({
          showEmailVerification: true,
          email,
          phoneNo: data?.phoneNo
        });
      })
      .catch(error => {
        const data = error.response?.data;
        this.setState(
          {
            disableButton: false
          },
          () => {
            this.handleInvalidSubmit();
          }
        );
        Object.keys(data).map(key => {
          switch (key) {
            case "firstName":
            case "lastName":
            // case "password1":
            // case "password2":
            case "gender":
            case "dateOfBirth":
              updateInputsWithError(
                {
                  [key]: data[key][0]
                },
                true
              );
              break;
            case "phoneNo":
              updateInputsWithError(
                {
                  phone: data[key][0]
                },
                true
              );
              break;
            case "email":
              if (data[key].length == 2) {
                this.setState({
                  showerror:
                    "This account already exists <a class='error' href=" +
                    data[key][0] +
                    "> please set a new password</a>"
                });
              } else {
                this.setState({
                  showerror: ""
                });
                updateInputsWithError(
                  {
                    email: data[key][0]
                  },
                  true
                );
              }
              break;
            default:
              if (typeof data == "object") {
                let errorMsg: string = data[key][0];
                if (errorMsg == "MaxRetries") {
                  errorMsg =
                    "You have exceeded max registration attempts, please try after some time";
                }
                this.setState({
                  showerror: errorMsg
                });
              }
          }
        });
      });
  };

  // onCountrySelect = (
  //   event: React.ChangeEvent<HTMLSelectElement> | null,
  //   defaultCountry?: string
  // ) => {
  //   const { countryOptions } = this.state;
  //   if (countryOptions.length > 0) {
  //     const form = this.RegisterFormRef.current;
  //     let selectedCountry = "";
  //     if (event) {
  //       selectedCountry = event.currentTarget.value;
  //       // setIsAddressChanged(true);
  //       // setIsCountryChanged(true);
  //       form &&
  //         form.updateInputsWithValue(
  //           {
  //             state: ""
  //           },
  //           false
  //         );
  //     } else if (defaultCountry) {
  //       selectedCountry = defaultCountry;
  //       // need to set defaultCountry explicitly
  //       if (form && selectedCountry) {
  //         form.updateInputsWithValue({
  //           country: selectedCountry
  //         });
  //       }
  //     }

  //     const { states, isd, value } = countryOptions.filter(
  //       country => country.value == selectedCountry
  //     )[0];

  //     if (form) {
  //       // reset state
  //       const { state } = form.getModel();
  //       if (state) {
  //         form.updateInputsWithValue({
  //           state: ""
  //         });
  //       }
  //       form.updateInputsWithValue({
  //         code: isd
  //       });
  //     }
  //     this.setState({
  //       isIndia: value == "India",
  //       stateOptions: states
  //     });
  //   }
  // };

  onCountryCodeSelect = (option: any) => {
    const form = this.RegisterFormRef.current;
    const selectedCountryCode = option?.value;

    form &&
      form.updateInputsWithValue({
        code: selectedCountryCode
      });
  };

  onCountrySelect = (option: any, defaultCountry?: string) => {
    const { countryOptions } = this.state;
    if (countryOptions.length > 0) {
      const form = this.RegisterFormRef.current;
      let selectedCountry = "";

      selectedCountry = option.value;
      this.setState({ selectedCountry: selectedCountry });
      form &&
        form.updateInputsWithValue(
          {
            state: "",
            country: selectedCountry
          },
          false
        );
      if (defaultCountry) {
        selectedCountry = defaultCountry;
        // need to set defaultCountry explicitly
        if (form && selectedCountry) {
          form.updateInputsWithValue({
            country: selectedCountry
          });
        }
      }

      const { states, isd, value } = countryOptions.filter(
        country => country.value == selectedCountry
      )[0];

      if (form) {
        // reset state
        const { state } = form.getModel();
        if (state) {
          form.updateInputsWithValue({
            state: ""
          });
        }
        form.updateInputsWithValue({
          code: isd
        });
      }

      this.setState({
        isIndia: value == "India",
        stateOptions: states
      });
    }
  };

  onGenderSelect = (option: any) => {
    const form = this.RegisterFormRef.current;
    const gender = option?.value;

    form &&
      form.updateInputsWithValue({
        gender
      });
  };

  changeCountryData = (countryData: Country[]) => {
    const countryOptions = countryData.map(country => {
      const states = country.regionSet.map(state => {
        return Object.assign({}, state, {
          value: state.nameAscii,
          label: state.nameAscii
        });
      });
      return Object.assign(
        {},
        {
          value: country.nameAscii,
          label: country.nameAscii,
          code2: country.code2,
          isd: country.isdCode,
          states: states
        }
      );
    });
    this.setState({
      countryOptions
    });
  };

  getCountryCodeObject = () => {
    const { countryOptions } = this.state;
    const arr: any[] = [];
    countryOptions.map(({ label, isd }: any) => {
      arr.push({ label: `${label}(${isd})`, value: isd });
    });
    return arr;
  };

  handleInvalidSubmit = () => {
    const elem = this.subscribeRef.current;
    if (elem && elem.checked == false) {
      this.setState({
        msgt: "Please accept the terms & conditions"
      });
    } else {
      this.setState({
        msgt: ""
      });
    }

    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      } else if (elem && elem.checked == false) {
        elem.focus();
        elem.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = getErrorList(
        globalStyles.errorMsg,
        "checkout-register-form"
      );
      if (errorList && errorList.length) {
        errorTracking(errorList, location.href);
      }
    }, 0);
  };

  // handleResetPassword = (event: React.MouseEvent) => {
  //   event.preventDefault();

  //   const formData = new FormData();
  //   formData.append(
  //     "email",
  //     (this.RegisterFormRef.current &&
  //       this.RegisterFormRef.current.getModel().email) ||
  //       ""
  //   );

  //   this.props
  //     .resetPassword(formData)
  //     .then(data => {
  //       this.setState({
  //         successMsg: data.success
  //       });
  //     })
  //     .catch(err => {
  //       if (err.response.data.email) {
  //         this.RegisterFormRef.current &&
  //           this.RegisterFormRef.current.updateInputsWithError(
  //             {
  //               email: err.response.data.email[0]
  //             },
  //             true
  //           );
  //         errorTracking(err.response.data.email[0], location.href);
  //       } else if (err.response.data.error_message) {
  //         let errorMsg = err.response.data.error_message[0];
  //         if (errorMsg == "MaxRetries") {
  //           errorMsg =
  //             "You have exceeded max attempts, please try after some time.";
  //         }
  //         this.setState(
  //           {
  //             showerror: errorMsg
  //           },
  //           () => {
  //             errorTracking([this.state.showerror as string], location.href);
  //           }
  //         );
  //       }
  //     });
  // };

  checkMailValidation = async (): Promise<boolean> => {
    let isValid = false;
    const data = await this.props
      .checkUserPassword(
        (this.RegisterFormRef.current &&
          this.RegisterFormRef.current.getModel().email) ||
          ""
      )
      .catch(err => {
        console.log("err: " + err);
        isValid = false;
      });
    if (data && data.emailExist) {
      if (data && data.passwordExist) {
        const error = [
          <span key="email-error">
            This account already exists. Please{" "}
            <span
              className={globalStyles.linkTextUnderline}
              onClick={e =>
                this.props.goLogin(
                  e,
                  (this.emailInput.current && this.emailInput.current.value) ||
                    ""
                )
              }
            >
              Login
            </span>
          </span>
        ];
        this.setState({ showFields: false });
        this.RegisterFormRef.current &&
          this.RegisterFormRef.current.updateInputsWithError(
            {
              email: error
            },
            true
          );
        isValid = false;
      }
      //else {
      // const error = [
      //   <span key="email-error2">
      //     This account already exists. Please{" "}
      //     <span
      //       className={globalStyles.linkTextUnderline}
      //       onClick={this.handleResetPassword}
      //     >
      //       set a new password
      //     </span>
      //   </span>
      // ];
      // this.RegisterFormRef.current &&
      //   this.RegisterFormRef.current.updateInputsWithError(
      //     {
      //       email: error
      //     },
      //     true
      //   );
      // this.setState({ showFields: false });
      // isValid = false;
      // }
    } else {
      this.setState({ showFields: true });
      this.firstNameInput.current && this.firstNameInput.current.focus();
      isValid = true;
    }
    return isValid;
  };

  chkTermsandC = (event: React.ChangeEvent) => {
    const elem = this.subscribeRef.current;
    if (elem && elem.checked == false) {
      this.setState({
        msgt: "Please accept the terms & conditions"
      });
    } else {
      this.setState({
        msgt: ""
      });
    }
  };

  resetSection = () => {
    this.setState({
      showFields: false
    });
  };

  verifyEmail = () => {
    const { email } =
      this.RegisterFormRef.current && this.RegisterFormRef.current.getModel();
    email &&
      checkMail(email) &&
      this.checkMailValidation().then((isValid: boolean) => {
        if (!isValid) {
          this.resetSection();
        }
      });
  };
  onMailChange = (event: React.KeyboardEvent) => {
    if (event.key == "Enter") {
      this.verifyEmail();
    } else {
      this.resetSection();
    }
  };

  changeEmail = (event: any) => {
    this.props.changeEmail?.();
  };

  handleFirstNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      e.preventDefault();
      this.lastNameInput.current && this.lastNameInput.current.focus();
    }
  };

  togglePassword = () => {
    this.setState(prevState => {
      return {
        showPassword: !prevState.showPassword
      };
    });
  };

  onWhatsappCheckChange = (e: any) => {
    this.setState({
      whatsappChecked: e.target.checked
    });
  };

  impactRef = React.createRef<HTMLInputElement>();

  handleClickOutside = (evt: any) => {
    if (
      this.impactRef.current &&
      !this.impactRef.current.contains(evt.target)
    ) {
      this.setState({ showTip: false });
      //Do what you want to handle in the callback
      // this.props.closePopup(evt);
    }
  };

  // Handle date change
  handleDateChange = (date: Date | null) => {
    const { minDate, maxDate } = this.state;
    const newErrors = { ...this.state.validationErrors };

    // Validate date format
    if (date && !moment(date).isValid()) {
      newErrors.isValidDate = "Please enter a valid Date of Birth";
    } else {
      newErrors.isValidDate = "";
    }

    // Validate min allowed date
    // if (date && new Date(date).getTime() <= new Date(minDate).getTime()){
    if (
      date &&
      new Date(moment(date).format("YYYY-MM-DD")).getTime() <=
        new Date(minDate).getTime()
    ) {
      newErrors.isMinAllowedDate = "Please enter a valid Date of Birth";
    } else {
      newErrors.isMinAllowedDate = "";
    }

    // Validate max allowed date
    if (
      date &&
      new Date(moment(date).format("YYYY-MM-DD")).getTime() >=
        new Date(maxDate).getTime()
    ) {
      newErrors.isMaxAllowedDate = "Age should be at least 15 years";
    } else {
      newErrors.isMaxAllowedDate = "";
    }
    this.setState({
      selectedDate: date,
      validationErrors: newErrors
    });
  };

  // Handle button click to manually open the date picker
  handleDateClick = () => {
    if (this.datePickerRef.current) {
      this.datePickerRef.current.setOpen(true); // Open the calendar manually
    }
  };

  render() {
    const showFieldsClass = this.state.showFields ? "" : styles.disabledInput;
    // const { goLogin } = this.props;
    const { countryOptions } = this.state;
    const isExistyError = "This field is required";
    const formContent = (
      <Formsy
        ref={this.RegisterFormRef}
        onValidSubmit={this.handleSubmit}
        onInvalidSubmit={this.handleInvalidSubmit}
      >
        <div className={styles.categorylabel} id="checkout-register-form">
          <div className={styles.emailWrp}>
            <FormInput
              name="email"
              blur={this.verifyEmail}
              placeholder={"Email ID*"}
              label={"Email ID*"}
              keyUp={this.onMailChange}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              inputRef={this.emailInput}
              disable={true}
              validations={{
                isEmail: true,
                maxLength: 75
              }}
              validationErrors={{
                isEmail: "Please enter a valid Email ID",
                maxLength: "You are allowed to enter upto 75 characters only"
              }}
              required
            />
            <p className={styles.loginChange} onClick={this.changeEmail}>
              Change
            </p>
          </div>
          <div>
            <FormInput
              name="firstName"
              placeholder={"First Name*"}
              label={"First Name*"}
              inputRef={this.firstNameInput}
              disable={!this.state.showFields}
              className={showFieldsClass}
              validationErrors={{
                isWords: "Please enter only alphabetic characters"
              }}
              keyPress={this.handleFirstNameKeyPress}
              required
              showLabel={true}
            />
          </div>
          <div>
            <FormInput
              name="lastName"
              placeholder={"Last Name*"}
              label={"Last Name*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              validationErrors={{
                isWords: "Please enter only alphabetic characters"
              }}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              inputRef={this.lastNameInput}
              required
              showLabel={true}
            />
          </div>
          {/* <div className={styles.userGenderPicker}>
            <FormSelect
              required
              name="gender"
              label="Gender*"
              placeholder="Select Gender*"
              options={genderOptions}
              disable={!this.state.showFields}
              className={this.state.showFields ? "" : styles.disabledInput}
              showLabel={true}
            />
          </div> */}
          <div className={styles.userGenderPicker}>
            <SelectDropdown
              required
              name="gender"
              label="Gender*"
              placeholder="Select Gender*"
              options={genderOptions}
              allowFilter={false}
              inputRef={this.genderRef}
              validations={{
                isExisty: true
              }}
              validationErrors={{
                isExisty: "Please select your gender",
                isEmptyString: isExistyError
              }}
              handleChange={this.onGenderSelect}
            />
          </div>
          {/* <div className={styles.calendarIconContainer}>
            <FormInput
              name="dateOfBirth"
              type="date"
              value={null}
              disable={!this.state.showFields}
              className={showFieldsClass}
              id="date_of_birth"
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
                isValidDate: "Please enter a valid Date of Birth",
                isMinAllowedDate: "Please enter a valid Date of Birth",
                isMaxAllowedDate: "Age should be at least 15 years"
              }}
              showLabel={true}
            />
          </div> */}
          <div className={cs(styles.datePicker)}>
            <label className={styles.dateLable}>Date of Birth</label>
            <DatePicker
              ref={this.datePickerRef} // Attach the ref to DatePicker
              id="date_of_birth"
              name="dateOfBirth"
              // dateFormat="dd MMM yyyy"
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              selected={this.state.selectedDate}
              onChange={this.handleDateChange}
              minDate={new Date(this.state.minDate)}
              maxDate={new Date(this.state.maxDate)}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            <div className={cs(styles.calIcon)} onClick={this.handleDateClick}>
              <img src={calendarIcon} width="35" height="35" />
            </div>
            {/* Display validation error messages */}
            {this.state.validationErrors?.isValidDate && (
              <div className={globalstyles.errorMsg}>
                {this.state.validationErrors?.isValidDate}
              </div>
            )}
            {this.state.validationErrors?.isMinAllowedDate && (
              <div className={globalstyles.errorMsg}>
                {this.state.validationErrors?.isMinAllowedDate}
              </div>
            )}
            {this.state.validationErrors?.isMaxAllowedDate && (
              <div className={globalstyles.errorMsg}>
                {this.state.validationErrors?.isMaxAllowedDate}
              </div>
            )}
          </div>
          <div>
            {/* <div className="select-group text-left">
              <FormSelect
                required
                label="Country*"
                options={countryOptions}
                handleChange={this.onCountrySelect}
                placeholder="Select Country*"
                name="country"
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: "Please select your Country",
                  isEmptyString: isExistyError
                }}
                showLabel={true}
              />
              <span className="arrow"></span>
            </div> */}
          </div>
          <SelectDropdown
            required
            name="country"
            handleChange={this.onCountrySelect}
            label="Country*"
            placeholder="Select Country*"
            validations={{
              isExisty: true
            }}
            validationErrors={{
              isExisty: "Please select your Country",
              isEmptyString: isExistyError
            }}
            options={countryOptions}
            allowFilter={true}
            inputRef={this.countryRef}
          />

          {this.state.isIndia && (
            <div>
              <div className="select-group text-left">
                <FormSelect
                  required
                  name="state"
                  label="State*"
                  placeholder="Select State*"
                  options={this.state.stateOptions}
                  value=""
                  validations={{
                    isExisty: true
                  }}
                  validationErrors={{
                    isExisty: isExistyError,
                    isEmptyString: isExistyError
                  }}
                  showLabel={true}
                />
              </div>
            </div>
          )}
          <div className={styles.countryCode}>
            {/* <CountryCode
              name="code"
              placeholder="Code"
              label="Country Code"
              value=""
              id="isdcode"
              validations={{
                isCodeValid: (values, value) => {
                  return !(values.phone && value == "");
                },
                isValidCode: (values, value) => {
                  if (value && this.props.isdList.length > 0) {
                    return this.props.isdList.indexOf(value ? value : "") > -1;
                  } else {
                    return true;
                  }
                }
              }}
              validationErrors={{
                isCodeValid: "Required",
                isValidCode: "Enter valid code"
              }}
              showLabel={true}
            /> */}
            <SelectDropdown
              name="code"
              placeholder="Code"
              label="Code"
              options={this.getCountryCodeObject()}
              handleChange={this.onCountryCodeSelect}
              value=""
              validations={{
                isCodeValid: (values, value) => {
                  return !(values.phone && value == "");
                },
                isValidCode: (values, value) => {
                  if (value && this.props.isdList.length > 0) {
                    return this.props.isdList.indexOf(value ? value : "") > -1;
                  } else {
                    return true;
                  }
                }
              }}
              validationErrors={{
                isCodeValid: "Required",
                isValidCode: "Please enter a valid country code"
              }}
              allowFilter={true}
              showLabel={true}
              optionsClass={styles.isdCode}
              aquaClass={styles.aquaText}
              searchIconClass={styles.countryCodeSearchIcon}
              searchInputClass={styles.countryCodeSearchInput}
              inputRef={this.countryCodeRef}
              className={styles.countryCodeWrp}
            />
            <FormInput
              // required
              name="phone"
              value=""
              placeholder={"Contact Number"}
              type="number"
              disable={!this.state.showFields}
              className={cs(showFieldsClass, styles.contactNum)}
              label={"Contact Number"}
              validations={{
                isExisty: true,
                compulsory: (values, value) => {
                  if (values?.whatsappSubscribe && value == "") {
                    return false;
                  } else {
                    return true;
                  }
                }
              }}
              validationErrors={{
                isExisty: "Please enter your Contact Number",
                compulsory: "Please enter your Contact Number"
              }}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              keyDown={e => (e.which === 69 ? e.preventDefault() : null)}
              onPaste={e =>
                e?.clipboardData.getData("Text").match(/([e|E])/)
                  ? e.preventDefault()
                  : null
              }
              showLabel={true}
            />
          </div>
          {/* <div>
            <FormInput
              name="password1"
              placeholder={"Password*"}
              label={"Password*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              onFocus={() => {
                this.setState({
                  showPassRules: true
                });
              }}
              blur={() => {
                const value =
                  this.RegisterFormRef.current &&
                  this.RegisterFormRef.current.getModel().password1;
                if (value) {
                  const res =
                    value.length >= 6 &&
                    value.length <= 20 &&
                    /[a-z]/.test(value) &&
                    /[0-9]/.test(value) &&
                    /[A-Z]/.test(value);
                  if (res) {
                    setTimeout(() => {
                      this.setState({
                        showPassRules: false
                      });
                    }, 100);
                  } else {
                    this.RegisterFormRef.current?.updateInputsWithError({
                      password1:
                        "Please verify that your password follows all rules displayed"
                    });
                  }
                }
                this.setState({
                  shouldValidatePass: true
                });
              }}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              type={this.state.showPassword ? "text" : "password"}
              validations={{
                // minLength: 6,
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
              showLabel={true}
            />
            <span
              className={styles.togglePasswordBtn}
              onClick={this.state.showFields ? this.togglePassword : () => null}
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
                className={cs({ [styles.correct]: this.state.passValidLength })}
              >
                6 to 20 characters
              </li>
              <li
                className={cs({ [styles.correct]: this.state.passValidUpper })}
              >
                1 uppercase
              </li>
              <li className={cs({ [styles.correct]: this.state.passValidNum })}>
                1 numeric digit
              </li>
              <li
                className={cs({ [styles.correct]: this.state.passValidLower })}
              >
                1 lowercase
              </li>
            </ul>
          </div>
          <div>
            <FormInput
              name="password2"
              placeholder={"Confirm Password*"}
              label={"Confirm Password*"}
              disable={!this.state.showFields}
              className={showFieldsClass}
              keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
              isDrop={true}
              isPaste={true}
              type={this.state.showPassword ? "text" : "password"}
              validations={{
                equalsField: "password1",
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
                equalsField: "The Password entered doesn't match",
                isValid:
                  "Please verify that your password follows all rules displayed"
              }}
              required
              showLabel={true}
            />
          </div> */}
          {CONFIG.WHATSAPP_SUBSCRIBE_ENABLED && !this.props.isCheckout && (
            <div
              className={cs(
                styles.subscribe,
                styles.tooltip,
                styles.registerTooltip,
                {
                  [styles.heightFix]: this.state.whatsappChecked
                }
              )}
            >
              <FormCheckbox
                value={false}
                inputRef={this.whatsappCheckRef}
                id="whatsappSubscribe"
                name="whatsappSubscribe"
                disable={false}
                label={[
                  <span key="1">Subscribe me for Whatsapp updates.</span>
                  //   (this.state.whatsappChecked ? <div className={styles.manageLine}>
                  //   Manage your preference from My Preferences section under
                  //   Profile
                  // </div>: <></>)
                ]}
                handleChange={this.onWhatsappCheckChange}
                required
                className={cs(styles.regWhatsApp, globalStyles.margin0)}
              />
              {this.state.whatsappChecked && (
                <div className={styles.manageLine}>
                  Manage your preference from My Preferences section under
                  Profile
                </div>
              )}
              <div
                className={cs(
                  styles.tooltip,
                  globalStyles.margin0,
                  styles.width30,
                  styles.regWhatsApp
                )}
                ref={this.impactRef}
              >
                <img
                  src={this.state.showTip ? tooltipOpenIcon : tooltipIcon}
                  onClick={() => {
                    this.setState({ showTip: !this.state.showTip });
                  }}
                />
                <div
                  className={cs(styles.tooltipMsg, {
                    [styles.show]: this.state.showTip
                  })}
                >
                  By checking this, you agree to receiving Whatsapp messages for
                  order & profile related information
                </div>
              </div>
            </div>
          )}
          <div className={cs(styles.subscribe, styles.marginFix)}>
            <FormCheckbox
              value={false}
              inputRef={this.subscribeRef}
              id="subscribeemails"
              name="subscribe"
              disable={!this.state.showFields}
              handleChange={this.chkTermsandC}
              label={[
                "I agree to the ",
                <Link
                  key="subscribe"
                  to="/customer-assistance/terms-conditions"
                  target="_blank"
                >
                  Terms and Conditions
                </Link>,
                "*"
              ]}
              validations="isTrue"
              required
            />
          </div>
          <div className={cs(styles.subscribe, styles.newsletters)}>
            <FormCheckbox
              value={
                this.state.selectedCountry == "India" ||
                this.state.newsLetterChecked
              }
              id="subscrib"
              name="terms"
              disable={!this.state.showFields}
              label={[
                "I agree to receiving e-mails, newsletters, calls and text messages for service related information. To know more how we keep your data safe, refer to our ",
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
          {this.state.msgt && (
            <p className={cs(styles.errorMsg, globalStyles.textLeft)}>
              Please accept the Terms & Conditions
            </p>
          )}
          {/* <div>
            <p
              className={
                this.state.msgt
                  ? cs(globalStyles.errorMsg, globalStyles.wordCap)
                  : globalStyles.hiddenEye
              }
            >
              Please accept the Terms & Conditions
            </p>
          </div> */}
          <div>
            {this.state.showerror ? (
              <p className={cs(styles.errorMsg, globalStyles.textLeft)}>
                {this.state.showerror}
              </p>
            ) : (
              ""
            )}
            {!this.props.isCheckout && (
              <Button
                type="submit"
                label="Create My Account & Proceed"
                disabled={this.state.disableButton || !this.state.showFields}
                variant="mediumMedCharcoalCta366"
              />
            )}
            {!this.props.isCheckout && (
              <Button
                type="submit"
                className={cs(styles.changeEmailBtn)}
                label="Go Back"
                onClick={this.changeEmail}
                variant="outlineMediumMedCharcoalCta366"
              />
            )}
            {this.props.isCheckout && (
              <Button
                type="submit"
                label="Continue"
                disabled={this.state.disableButton || !this.state.showFields}
                variant="largeAquaCta"
              />
            )}
          </div>
        </div>
      </Formsy>
    );

    const footer = (
      <>
        <div className={globalStyles.textCenter}>
          <SocialLogin
            closeModel={() => {
              this.props.nextStep?.();
            }}
          />
        </div>
      </>
    );

    return (
      <Fragment>
        {this.state.showEmailVerification ? (
          <EmailVerification
            email={this.state.email}
            successMsg=""
            changeEmail={this.changeEmail}
            goLogin={this.props.goToLogin}
            isCheckout={this.props.isCheckout}
            currency={this.props.currency}
            // sortBy={this.props.sortBy}
            phoneNo={this.state.phoneNo}
            isRegistration={true}
          />
        ) : (
          <>
            {this.state.successMsg && this.props.isCheckout && (
              <div
                className={cs(bootstrapStyles.col10, bootstrapStyles.offset1)}
              >
                <div
                  className={cs(styles.successMsg, {
                    [styles.oldSuccessMsg]: this.props.isCheckout
                  })}
                >
                  {this.state.successMsg}
                </div>
              </div>
            )}
            {this.state.successMsg && !this.props.isCheckout && (
              <div
                className={cs(styles.successMsg, {
                  [styles.oldSuccessMsg]: this.props.isCheckout
                })}
              >
                {this.state.successMsg}
              </div>
            )}
            <div className={cs(bootstrapStyles.col12)}>
              <div className={styles.loginForm}>
                <FormContainer
                  heading={this.props.isCheckout ? "" : "Welcome"}
                  subheading={
                    this.props.isCheckout
                      ? ""
                      : "Register and create an account to continue."
                  }
                  formContent={formContent}
                  // footer={footer}
                />
              </div>
              {footer}
            </div>
          </>
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutRegisterForm);
