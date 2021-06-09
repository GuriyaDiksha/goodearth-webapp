import React, { useEffect, useState } from "react";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import Loader from "components/Loader";
import * as valid from "utils/validate";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import mubaarakDesktop from "../../images/mubaarakDesktop.jpg";
import mubaarakMobile from "../../images/mubaarakMobile.jpg";
import secondaryHeaderStyles from "components/SecondaryHeader/styles.scss";
import { Link, useHistory } from "react-router-dom";
import LazyImage from "components/LazyImage";
import HeaderService from "services/headerFooter";

const NotificationForm: React.FC = () => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const { showTimer } = useSelector((state: AppState) => state.info);
  const currency = useSelector((state: AppState) => state.currency);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [enableSubmit, setEnableSubmit] = useState(false);
  const history = useHistory();
  useEffect(() => {
    if (currency != "INR") {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    if (currency != "INR") {
      history.push("/");
    }
  }, [currency]);

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
      const errorList = valid.getErrorList(globalStyles.errorMsg, "job-form");
      if (errorList && errorList.length) {
        valid.errorTracking(errorList, location.href);
      }
    }, 0);
  };
  const dispatch = useDispatch();
  const saveData = (
    formData: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    setIsLoading(true);
    setSuccessMsg("");
    HeaderService.saveMubaarak(dispatch, formData)
      .then(data => {
        setSuccessMsg(data.message);
        resetForm();
        setEnableSubmit(false);
      })
      .catch(err => {
        console.log(err.response.data);
        const errors = err.response.data.errors;
        if (typeof errors[0] == "string") {
          setSuccessMsg(errors[0]);
        } else {
          updateInputsWithError(errors[0]);
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
    const { email, firstName, lastName, phone } = model;
    formData.append("email", email ? email.toString().toLowerCase() : "");
    formData.append("firstName", firstName || "");
    formData.append("lastName", lastName || "");
    phone ? formData.append("phone", `+91${phone}`) : "";

    return formData;
  };

  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    if (!enableSubmit) {
      return;
    }
    const { email, phone } = model;
    if (!email && !phone) {
      setSuccessMsg("Please provide at least one mode of communication.");
      return;
    }
    const formData = prepareFormData(model);
    saveData(formData, resetForm, updateInputsWithError);
  };

  const formContent = (
    <div
      className={cs(
        styles.jobApplication,
        { [styles.jobApplicationMobile]: mobile },
        styles.loginForm
      )}
    >
      <h4>
        Indulge in an extra hour of Sale celebrations from 8-9 PM. With new
        products added everyday at FLAT 25% OFF. Sign up below to get a daily
        reminder!
      </h4>
      <Formsy
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
              label="First Name*"
              placeholder="First Name*"
              name="firstName"
              validations={{
                maxLength: 30,
                isAlpha: true
              }}
              handleChange={event => {
                event.target.value
                  ? setEnableSubmit(true)
                  : setEnableSubmit(false);
              }}
              validationErrors={{
                maxLength: "Max limit reached.",
                isAlpha: "Only alphabets are allowed."
              }}
            />
          </div>
          <div>
            <FormInput
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              validations={{
                maxLength: 30,
                isAlpha: true
              }}
              validationErrors={{
                maxLength: "Max limit reached.",
                isAlpha: "Only alphabets are allowed."
              }}
            />
          </div>
          <div>
            <FormInput
              // required
              name="email"
              label="Email Address"
              className="input-field"
              placeholder="Email Address"
              validations={{
                isEmail: true
              }}
              validationErrors={{
                isEmail: "Please enter a valid email"
              }}
            />
          </div>
          <div
            className={cs(styles.countryCode, {
              [styles.countryCodeMobile]: mobile
            })}
          >
            <div>
              <input
                type="text"
                value="+91"
                placeholder="Code"
                disabled={true}
                className={styles.codeInput}
              />
            </div>
            <FormInput
              // required
              name="phone"
              label="Contact Number"
              placeholder="Contact Number"
              validations={{
                matchRegexp: /^[0-9\-/]+$/,
                isNumeric: true
              }}
              validationErrors={{
                matchRegexp: "Please enter valid a phone number",
                isNumeric: "Phone should contain numbers"
              }}
            />
          </div>
          <div className={styles.label}>
            {[
              "By signing up for alerts, you agree to receive e-mails, calls and text messages from Goodearth. To know more how we keep your data safe, refer to our ",
              <Link
                key="terms"
                to="/customer-assistance/privacy-policy"
                target="_blank"
              >
                Privacy Policy*
              </Link>
            ]}
          </div>
          <div className={styles.subText}>
            {"*Please note that this notification is for India users only."}
          </div>
          <p className={cs(styles.successMessage, globalStyles.errorMsg)}>
            {successMsg}
          </p>
          <input
            type="submit"
            formNoValidate={true}
            className={cs(
              globalStyles.ceriseBtn,
              globalStyles.marginT10,
              styles.jobApplicationSubmit,
              { [globalStyles.disabledBtn]: !enableSubmit }
            )}
            value="Remind me"
          />
        </div>
      </Formsy>
    </div>
  );

  return (
    <div className={secondaryHeaderStyles.careers}>
      <div className={styles.jobForm}>
        {
          <div
            className={cs(styles.careersContent, {
              [styles.careersContentTimer]: showTimer
            })}
          >
            <div className={styles.careersImage}>
              <LazyImage
                src={mobile ? mubaarakMobile : mubaarakDesktop}
                className={globalStyles.imgResponsive}
                aspectRatio={mobile ? "0.96:1" : "3.77:1"}
              />
            </div>
          </div>
        }
        {formContent}
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default NotificationForm;
