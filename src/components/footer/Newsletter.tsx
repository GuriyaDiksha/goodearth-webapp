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
import AccountService from "services/account";
import leftTopImage from "../../images/newsLetterPoUp/b2.png";
import leftMidImage from "../../images/newsLetterPoUp/palmmm@2x.png";
import rightTopImage from "../../images/newsLetterPoUp/palmmm.png";
import bottomLeftImage from "../../images/newsLetterPoUp/leafddw.png";
import rightBottomImage from "../../images/newsLetterPoUp/yellow2.png.png";
import { useHistory, useLocation } from "react-router-dom";

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

const Newsletter: React.FC<Props> = ({ title, subTitle }) => {
  const {
    user: { email },
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);

  const [successMsg, setSuccessMsg] = useState("");
  const [enableSubmit, setEnableSubmit] = useState(isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [displayPopUp, setDisplayPopUp] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const EnquiryFormRef = useRef<Formsy>(null);
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
        errorTracking(errorList, location?.pathname);
      }
    }, 0);
  };

  const onClose = () => {
    localStorage.setItem("seeNewLetters", "123#");
    setDisplayPopUp(false);
    document?.body.classList.remove(globalStyles.noScroll);
  };

  useEffect(() => {
    const handlePopUpDisplay = () => {
      if (localStorage.getItem("seeNewLetters") === "123#") {
        setDisplayPopUp(false);
      } else {
        const returningUser = localStorage.getItem("123#");
        setDisplayPopUp(!returningUser);
        if (!returningUser) {
          document?.body.classList.add(globalStyles.noScroll);
        } else {
          document?.body.classList.remove(globalStyles.noScroll);
        }
      }
    };

    const timer = setTimeout(() => {
      handlePopUpDisplay();
    }, 10000);

    return () => clearTimeout(timer);
  }, [history?.location?.pathname]);

  useEffect(() => {
    setTimeout(() => {
      const focus = document?.getElementById("first_input");
      focus?.focus();
    }, 11000);
  }, []);

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
    HeaderService.makeNewsletterSignupRequest(dispatch, formData)
      .then(data => {
        if (
          data.message === "You are successfully subscribed to our Newsletter"
        ) {
          setSuccessMsg(data.message);
          setIsSubscribed(true);
          const subscribeCta = document?.getElementById("subscribe-cta");
          if (subscribeCta) {
            subscribeCta.hidden = true;
          }
        } else {
          setSuccessMsg(data.message);
          setEnableSubmit(false);
          const input = document?.querySelector<HTMLElement>("#job-form input");

          if (input) {
            (input as HTMLInputElement).style.border = "1px solid #ab1e56"; // Set border style
          }
        }
      })
      .catch(err => {
        const errors = err.response.data.errors;
        if (errors && typeof errors[0] == "string") {
          setSuccessMsg(errors[0]);
        } else {
          setSuccessMsg("Please try again.");
          const input = document?.querySelector<HTMLElement>("#job-form input");

          if (input) {
            (input as HTMLInputElement).style.border = "1px solid #ab1e56";
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = () => {
    setEnableSubmit(true);
  };

  const prepareFormData = (model: any) => {
    const formData = new FormData();
    const { email } = model;
    formData.append("email", email ? email.toString().toLowerCase() : "");
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
          <div className={cs(styles.formField)}></div>
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
              handleChange={() => setSuccessMsg("")}
              validationErrors={{
                isEmail: "Please enter a valid email"
              }}
            />
          </div>

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
            <a
              href="/customer-assistance/privacy-policy"
              target="_blank"
              className={styles.popupLink}
            >
              Privacy Policy.
            </a>{" "}
            and{" "}
            <a
              href="/customer-assistance/terms-conditions"
              target="_blank"
              className={styles.popupLink}
            >
              Terms of Service.
            </a>
          </div>
          <div className={cs(styles.subscribeBtn, globalStyles.marginT10)}>
            <input
              id="subscribe-cta"
              type="submit"
              formNoValidate={true}
              disabled={!enableSubmit}
              className={cs(globalStyles.marginT10, styles.communityBtn)}
              style={{
                backgroundColor: !enableSubmit ? "#9F9F9F" : "#4C4C4C",
                cursor: !enableSubmit ? "default" : "pointer",
                maxWidth: "226px",
                textAlign: "center",
                color: "white",
                padding: "10px",
                border: "1px solid #D8D8D8",
                margin: "0 auto",
                lineHeight: "20px",
                letterSpacing: "0.36px",
                fontWeight: 400
              }}
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
          *Exclusive for 1st time subscribers on the first purchase.
        </div>
      </div>
    </div>
  ) : null;
};

export default Newsletter;
