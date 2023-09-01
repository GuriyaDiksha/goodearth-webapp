import React, { useState, useEffect, useRef } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import FormSelect from "components/Formsy/FormSelect";
import { Country } from "components/Formsy/CountryCode/typings";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import globalStyles from "styles/global.scss";
import { errorTracking, getErrorList } from "utils/validate";
import HeaderService from "services/headerFooter";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";
import flower_left from "../../images/news_flower_left.png";
import butterfly from "../../images/news_bf_img.png";
import flower_right from "../../images/news_flower_right.png";
import crossIcon from "../../images/cross.svg";

type Props = {
  title: string;
  subTitle: string;
  //   isOpen: boolean;
  //   onClose: () => void;
};

type StateOptions = {
  value: string;
  label: string;
  id: number;
  nameAscii: string;
};

type CountryOptions = {
  value: string;
  label: string;
  code2: string;
  isd: string | undefined;
  states: StateOptions[];
};

const NewsletterModal: React.FC<Props> = ({
  title,
  subTitle
  //   isOpen,
  //   onClose
}) => {
  //   const overlayRef = React.useRef(null);
  // const handleOverlayClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) =>{
  //     console.log(e.target == overlayRef.current);
  //    if(e.target == overlayRef.current){
  //     console.log(e.target == overlayRef.current);
  //      onClose();
  //    }
  // }
  const {
    user: { isLoggedIn },
    user: { firstName },
    user: { country },
    user: { email }
  } = useSelector((state: AppState) => state);

  const [countryOptions, setCountryOptions] = useState<CountryOptions[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [enableSubmit, setEnableSubmit] = useState(true);
  const { countryData } = useSelector((state: AppState) => state.address);
  const [isLoading, setIsLoading] = useState(false);
  const [displayPopUp, setDisplayPopUp] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!countryData || countryData.length == 0) {
      LoginService.fetchCountryData(dispatch).then(countryData => {
        dispatch(updateCountryData(countryData));
      });
    }
  }, []);

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
        errorTracking(errorList, location.pathname);
      }
    }, 0);
  };

  const onClose = () => {
    // console.log("close");
    localStorage.setItem("seenPopUp", "true");
    setDisplayPopUp(false);
  };

  useEffect(() => {
    // console.log("popup----" + displayPopUp);
    setTimeout(() => {
      setDisplayPopUp(true);
      const returningUser = localStorage.getItem("seenPopUp");
      //   console.log("IsUser----" + returningUser);
      setDisplayPopUp(!returningUser);
    }, 3000);
  }, []);

  const saveData = (
    formData: any,
    // resetForm: any,
    updateInputsWithError: any
  ) => {
    setIsLoading(false);
    setSuccessMsg("");
    HeaderService.saveHFH(dispatch, formData)
      .then(data => {
        setSuccessMsg("You have subscribed successfully.");
        // resetForm();
        const subscribeCta = document.getElementById("subscribe-cta");
        if (subscribeCta) {
          subscribeCta.hidden = true;
        }
        const input = document.querySelectorAll<HTMLElement>("#job-form input");
        if (input) {
          for (let i = 0; i < input.length; i++) {
            input[i].style.color = "#9F9F9F";
            input[i].style.backgroundColor = "#E5E5E526";
          }
        }
        setTimeout(() => {
          // var newsletterModal = document.getElementById("newsletter-modal-container");
          // if(newsletterModal){
          //     newsletterModal.hidden = true;
          // }
          onClose();
        }, 10000);
        // setEnableSubmit(false);
      })
      .catch(err => {
        const errors = err.response.data.errors;
        if (errors && typeof errors[0] == "string") {
          setSuccessMsg(errors[0]);
        } else {
          setSuccessMsg("You have already subscribed.");
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
    const { email, name, country } = model;
    formData.append("email", email ? email.toString().toLowerCase() : "");
    formData.append("name", name || "");
    formData.append("country", country || "");
    formData.append("status", "subscribed");
    return formData;
  };

  // const NewsFormRef = useRef<Formsy>(null);
  const handleSubmit = (
    model: any,
    // resetForm: any,
    updateInputsWithError: any
  ) => {
    if (!enableSubmit) {
      return;
    }
    const formData = prepareFormData(model);
    saveData(formData, updateInputsWithError);
    // const form = NewsFormRef.current;
    // if (form) {
    //   form.updateInputsWithValue({
    //     country: ""
    //   });
    // }
    // setCountryOptions(countryOptions);
  };

  const formContent = (
    <div className={cs(styles.jobApplication, styles.loginForm)}>
      <Formsy
        // ref={NewsFormRef}
        onValidSubmit={handleSubmit}
        onInvalidSubmit={handleInvalidSubmit}
        onChange={handleChange}
      >
        <div
          className={cs(
            styles.form,
            styles.jobFormFields,
            styles.categorylabel
          )}
          id="job-form"
        >
          <div>
            <FormInput
              required
              label="Name*"
              className="input-field"
              value={isLoggedIn ? firstName : ""}
              placeholder="Name*"
              name="name"
              validations={{
                maxLength: 60,
                isAlpha: true
              }}
              handleChange={event => {
                event.target.value;
                //   ? setEnableSubmit(true)
                //   : setEnableSubmit(false);
              }}
              validationErrors={{
                maxLength: "Max limit reached.",
                isAlpha: "Only alphabets are allowed."
              }}
            />
          </div>
          <div>
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
          </div>
          <p
            className={cs(
              successMsg == "You have subscribed successfully."
                ? styles.successMessage
                : styles.errorMsg
            )}
          >
            {successMsg}
          </p>
          <div className={cs(styles.subscribeBtn)}>
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
              value="SUBSCRIBE"
            />
          </div>
        </div>
      </Formsy>
    </div>
  );

  return displayPopUp ? (
    <div id="newsletter-modal-container" className={cs(styles.container)}>
      <div
        className={cs(styles.modalOverlay)} /*onClick={handleOverlayClick} */
      ></div>
      <div className={cs(styles.newsletterModal)}>
        <div className={cs(styles.newsLeftImg)}>
          <img src={flower_left} className={cs(styles.flowerLeft)} />
        </div>
        <div className={cs(styles.newsButterflyImg)}>
          <img src={butterfly} className={cs(styles.butterfly)} />
        </div>
        <div className={cs(styles.newsRightImg)}>
          <img src={flower_right} className={cs(styles.flowerRight)} />
        </div>
        <div className={cs(styles.modalBox)}>
          <button
            className={cs(styles.modalCloseBtn)}
            onClick={onClose}
            data-dismiss="modal"
          >
            <img src={crossIcon} />
          </button>
          <div className={cs(styles.modalContent)}>
            <div className={cs(styles.modalHeader)}>
              <div className={cs(styles.modalTitle)}>{title}</div>
              <div className={cs(styles.modalSubTitle)}>{subTitle}</div>
            </div>
            <div className={cs(styles.modalBottom)}>{formContent}</div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default NewsletterModal;
