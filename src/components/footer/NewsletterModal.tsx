import React, { useState, useEffect, useRef, RefObject } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import { Country } from "components/Formsy/CountryCode/typings";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import globalStyles from "styles/global.scss";
import { errorTracking, getErrorList } from "utils/validate";
import HeaderService from "services/headerFooter";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";
import butterfly from "../../images/news_bf_img.png";
import crossIcon from "../../images/cross.svg";
// import SelectDropdown from "../Formsy/SelectDropdown";
import AccountService from "services/account";
import leftTopImage from "../../images/newsLetterPoUp/b2.png";
import leftMidImage from "../../images/newsLetterPoUp/palmmm@2x.png";
import rightTopImage from "../../images/newsLetterPoUp/palmmm.png";
import bottomLeftImage from "../../images/newsLetterPoUp/leafddw.png";
import rightBottomImage from "../../images/newsLetterPoUp/yellow2.png.png";
import FormSelect from "components/Formsy/FormSelect";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  subTitle: string;
};

type StateOptions = {
  value: string;
  label: string;
  id: number;
  nameAscii: string;
  source: string;
};

type CountryOptions = {
  value: string;
  label: string;
  code2: string;
  isd: string | undefined;
  states: StateOptions[];
};

const NewsletterModal: React.FC<Props> = ({ title, subTitle }) => {
  const {
    user: { isLoggedIn },
    user: { firstName },
    user: { email }
  } = useSelector((state: AppState) => state);

  const [countryOptions, setCountryOptions] = useState<CountryOptions[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [enableSubmit, setEnableSubmit] = useState(false);
  const { countryData } = useSelector((state: AppState) => state.address);
  const [isLoading, setIsLoading] = useState(false);
  const [displayPopUp, setDisplayPopUp] = useState(false);
  const isAlphaError = "Only alphabets are allowed";
  const isExistyError = "This field is required";
  const countryRef: RefObject<HTMLInputElement> = useRef(null);
  const [usercountry, setUsercountry] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!countryData || countryData.length == 0) {
      LoginService.fetchCountryData(dispatch).then(countryData => {
        dispatch(updateCountryData(countryData));
      });
    }
  }, []);

  const EnquiryFormRef = useRef<Formsy>(null);
  const onCountrySelect = (option: any, defaultCountry?: string) => {
    if (countryOptions.length > 0) {
      const form = EnquiryFormRef.current;
      let selectedCountry = "";
      if (option?.value) {
        selectedCountry = option?.value;
        form &&
          form.updateInputsWithValue(
            {
              state: "",
              country: selectedCountry
            },
            false
          );
      }

      if (defaultCountry) {
        selectedCountry = defaultCountry;
        // need to set defaultCountry explicitly
        if (form && selectedCountry) {
          form.updateInputsWithValue({
            country: selectedCountry
          });
        }
      }

      const { isd } = countryOptions.filter(
        country => country.value == selectedCountry
      )[0];

      if (form) {
        // reset state
        form.updateInputsWithValue({
          countrycode: isd,
          country: selectedCountry
        });
      }
      setEnableSubmit(true);
    }
  };

  const changeCountryData = (countryData: Country[]) => {
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
    setCountryOptions(countryOptions);
  };

  useEffect(() => {
    changeCountryData(countryData);
  }, [countryData]);

  const handleInvalidSubmit = () => {
    if (!enableSubmit) {
      return;
    }
    setSuccessMsg("");
    setTimeout(() => {
      const firstErrorField = document?.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLInputElement | HTMLSelectElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = getErrorList(globalStyles.errorMsg, "job-form");
      if (errorList && errorList.length) {
        errorTracking(errorList, location.pathname);
      }
    }, 0);
  };

  const onClose = () => {
    localStorage.setItem("seenPopUp", "true");
    setDisplayPopUp(false);
    document?.body.classList.remove(globalStyles.noScroll);
  };

  // fetch country is user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      AccountService.fetchProfileData(dispatch)
        .then(data => {
          setUsercountry(data.country_name);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) {
        HeaderService.checkSignup(dispatch, email).then((res: any) => {
          if (res.already_signedup) {
            setDisplayPopUp(false);
          } else {
            setDisplayPopUp(true);
            const returningUser = localStorage.getItem("seenPopUp");
            setDisplayPopUp(!returningUser);
            if (!returningUser) {
              document?.body.classList.add(globalStyles.noScroll);
            } else {
              document?.body.classList.remove(globalStyles.noScroll);
            }
          }
        });
      } else {
        setDisplayPopUp(true);
        const returningUser = localStorage.getItem("seenPopUp");
        setDisplayPopUp(!returningUser);
        if (!returningUser) {
          document?.body.classList.add(globalStyles.noScroll);
        } else {
          document?.body.classList.remove(globalStyles.noScroll);
        }
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [location.pathname, email ? email : ""]);

  useEffect(() => {
    setTimeout(() => {
      const focus = document?.getElementById("first_input");
      focus?.focus();
    }, 11000);
  }, []);

  //  start close modal on ESC keyword
  useEffect(() => {
    const close = (e: any) => {
      if (e.keyCode === 27) {
        onClose();
      }
    };
    if (typeof window != "undefined") {
      window.addEventListener("keydown", close);
      return () => window.removeEventListener("keydown", close);
    }
  }, []);
  //  end close modal on ESC keyword

  // start close modal on outsideClick
  // useEffect(() => {
  //   const handleOutsideClick = (event: any) => {
  //     if (displayPopUp && event.target.id == "newsletter-modal-container") {
  //       onClose();
  //     }
  //   };
  //   // Attach the event listener when the component mounts
  //   document.addEventListener("click", handleOutsideClick);
  //   // Remove the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("click", handleOutsideClick);
  //   };
  // }, [displayPopUp]);
  // end close modal on outsideClick
  const saveData = (formData: any, updateInputsWithError: any) => {
    setIsLoading(false);
    setSuccessMsg("");

    const email = formData.get("email");
    const isGEEmployee = email.toLowerCase().endsWith("@goodearth.in");

    HeaderService.makeNewsletterSignupRequest(dispatch, formData)
      .then(data => {
        if (
          data.message ===
          "This offer is not applicable for GE employees. You are successfully subscribed to our newsletter"
        ) {
          setSuccessMsg(data.message);
          // setIsSubscribed(true);

          const input = document?.querySelectorAll<HTMLElement>(
            "#job-form input"
          );
          if (input) {
            for (let i = 0; i < input.length; i++) {
              input[i].style.color = "#9F9F9F";
              input[i].style.backgroundColor = "#E5E5E526";
            }
          }
        }
        if (data.message === "You are already subscribed.") {
          setSuccessMsg(data.message);

          const input = document?.querySelectorAll<HTMLElement>(
            "#job-form input"
          );
          if (input) {
            for (let i = 0; i < input.length; i++) {
              input[i].style.color = "#9F9F9F";
              input[i].style.backgroundColor = "#E5E5E526";
            }
          }
        }
        if (
          data.message === "You are successfully subscribed to our Newsletter"
        ) {
          setSuccessMsg("You have subscribed successfully.");
          setIsSubscribed(true);
          const subscribeCta = document?.getElementById("subscribe-cta");
          if (subscribeCta) {
            subscribeCta.hidden = true;
          }
          const input = document?.querySelectorAll<HTMLElement>(
            "#job-form input"
          );
          if (input) {
            for (let i = 0; i < input.length; i++) {
              input[i].style.color = "#9F9F9F";
              input[i].style.backgroundColor = "#E5E5E526";
            }
          }
          setTimeout(() => {
            onClose();
          }, 400000);
        }
      })
      .catch(err => {
        const errors = err.response.data.errors;
        if (errors && typeof errors[0] == "string") {
          setSuccessMsg(errors[0]);
        } else {
          setSuccessMsg("Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    // }
  };

  const handleChange = () => {
    setEnableSubmit(true);
  };

  const prepareFormData = (model: any) => {
    // const formData = new FormData();
    // const { email, name, country } = model;
    // formData.append("email", email ? email.toString().toLowerCase() : "");
    // formData.append("name", name || "");
    // formData.append("country", country || "");
    // formData.append("status", "subscribed");
    // formData.append("email", email ? email.toString().toLowerCase() : "");
    const formData = new FormData();
    const { email } = model;
    formData.append("email", email ? email.toString().toLowerCase() : "");
    // formData.append("status", "subscribed");
    formData.append("source", "subscription_popup");
    return formData;
  };

  const handleSubmit = (model: any, updateInputsWithError: any) => {
    if (!enableSubmit) {
      return;
    }
    const formData = prepareFormData(model);

    saveData(formData, updateInputsWithError);
  };

  const formContent = (
    <div className={cs(styles.jobApplication, styles.loginForm)}>
      <Formsy
        onValidSubmit={handleSubmit}
        onInvalidSubmit={handleInvalidSubmit}
        onChange={handleChange}
        ref={EnquiryFormRef}
      >
        <div
          className={cs(
            styles.form,
            styles.jobFormFields,
            styles.categorylabel
          )}
          id="job-form"
        >
          <div className={cs(styles.formField)}>
            {/* <FormInput
              id="first_input"
              required
              label="Name*"
              className="input-field"
              value={isLoggedIn ? firstName : ""}
              placeholder="Name*"
              name="name"
              validations={{
                maxLength: 100,
                isWords: true
              }}
              handleChange={event => {
                event.target.value;
              }}
              validationErrors={{
                maxLength: "Max limit reached.",
                isWords: isAlphaError
              }}
            /> */}
          </div>
          <div className={cs(styles.formField)}>
            <FormInput
              required
              name="email"
              label="Email Address*"
              className="input-field"
              value={isLoggedIn ? email : ""}
              placeholder="Email Address*"
              validations={{
                isEmail: true
              }}
              validationErrors={{
                isEmail: "Please enter a valid email"
              }}
            />
          </div>
          {/* <div className={cs(styles.formField)}>
            <div className="select-group text-left">
              <FormSelect
                required
                label={"Country*"}
                options={countryOptions}
                placeholder={"Select Country*"}
                value={isLoggedIn ? country : ""}
                name="country"
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: "Please select your Country"
                }}
              />
              <span className="arrow"></span>
              <SelectDropdown
                required
                label={"Country*"}
                options={countryOptions}
                handleChange={onCountrySelect}
                placeholder="Select Country*"
                value={isLoggedIn ? usercountry : ""}
                name="country"
                validations={{
                  isExisty: true
                }}
                validationErrors={{
                  isExisty: "Please select your Country",
                  isEmptyString: isExistyError
                }}
                allowFilter={true}
                inputRef={countryRef}
              />
            </div>
          </div> */}
          <p
            className={cs(
              successMsg == "You have subscribed successfully."
                ? styles.successMessage
                : styles.errorMsgPopUp
            )}
          >
            {successMsg}
          </p>
          <div className={styles.popupDescription}>
            By submitting your email address, you consent to receiving marketing
            communications from Good Earth, on inspiration, exclusive offers,
            and new arrivals. View our{" "}
            <Link
              to={"/customer-assistance/privacy-policy"}
              target="_blank"
              className={styles.popupLink}
            >
              Privacy Policy.
            </Link>{" "}
            and{" "}
            <Link
              to={"/customer-assistance/terms-conditions"}
              target="_blank"
              className={styles.popupLink}
            >
              Terms of Service.
            </Link>
          </div>
          <div className={cs(styles.subscribeBtn, globalStyles.marginT10)}>
            <input
              id="subscribe-cta"
              type="submit"
              formNoValidate={true}
              disabled={!enableSubmit}
              className={cs(
                globalStyles.aquaBtn,
                globalStyles.marginT10,
                styles.jobApplicationSubmit,
                { [globalStyles.disabledBtn]: !enableSubmit }
              )}
              value="JOIN THE COMMUNITY"
            />
          </div>
        </div>
      </Formsy>
    </div>
  );

  return displayPopUp ? (
    <div id="newsletter-modal-container" className={cs(styles.container)}>
      <div
        className={cs(styles.modalWrapper, {
          [styles.subscribedTop]: isSubscribed
        })}
      >
        <div className={cs(styles.modalOverlay)}></div>
        <div
          className={cs(styles.newsletterModal, {
            [styles.subscribedTop]: isSubscribed
          })}
        >
          <div className={cs(styles.modalBox)}>
            <button
              className={cs(styles.modalCloseBtn)}
              onClick={onClose}
              data-dismiss="modal"
            >
              <img src={crossIcon} width="12" height="12" />
            </button>
            <div className={cs(styles.modalContent)}>
              <div
                className={cs(styles.modalHeader, {
                  [styles.subscribedHeader]: isSubscribed
                })}
              >
                <div className={cs(styles.modalTitle)}>
                  {!isSubscribed ? title : "Thank You For Subscribing!"}
                </div>
                <div className={cs(styles.modalSubTitle)}>
                  {!isSubscribed
                    ? subTitle
                    : "Your unique discount code has been sent to your email ID and can be availed at checkout!"}
                </div>
              </div>
              {!isSubscribed && (
                <div className={cs(styles.modalBottom)}>{formContent}</div>
              )}
            </div>
          </div>
          <div className={cs(styles.newsLeftImg)}>
            <img src={leftTopImage} className={cs(styles.flowerTopLeft)} />
          </div>
          <div className={cs(styles.newsRightBottomImg)}>
            <img
              src={rightBottomImage}
              className={cs(styles.flowerRightBottom)}
            />
          </div>
          <div
            className={cs(styles.newsButterflyImg, {
              [styles.topAlign]: isSubscribed
            })}
          >
            <img src={butterfly} className={cs(styles.butterfly)} />
          </div>
        </div>

        <div className={cs(styles.newsRightTopImg)}>
          <img src={rightTopImage} className={cs(styles.flowerTopRight)} />
        </div>
        <div className={cs(styles.newsBottomLeftImg)}>
          <img src={bottomLeftImage} className={cs(styles.flowerBottomLeft)} />
        </div>
        <div className={cs(styles.newsLeftMidImg)}>
          <img src={leftMidImage} className={cs(styles.flowerLeftMid)} />
        </div>
        <div className={cs(styles.exclusiveText, globalStyles.textCenter)}>
          *Exclusive for 1st time subscribers.
        </div>
      </div>
    </div>
  ) : null;
};

export default NewsletterModal;
