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
import secondaryHeaderStyles from "components/SecondaryHeader/styles.scss";
import { Link, useHistory } from "react-router-dom";
import HeaderService from "services/headerFooter";
import LoginService from "services/login";
import MakerEnhance from "components/maker";
import { updateCountryData } from "actions/address";
import FormSelect from "components/Formsy/FormSelect";
import { Country } from "components/Formsy/CountryCode/typings";

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

const NotificationForm: React.FC = () => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const { showTimer } = useSelector((state: AppState) => state.info);
  const currency = useSelector((state: AppState) => state.currency);
  const [countryOptions, setCountryOptions] = useState<CountryOptions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [enableSubmit, setEnableSubmit] = useState(false);
  const history = useHistory();
  const location = history.location;
  const { countryData } = useSelector((state: AppState) => state.address);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currency == "INR") {
      history.push("/");
    } else {
      if (!countryData || countryData.length == 0) {
        LoginService.fetchCountryData(dispatch).then(countryData => {
          // changeCountryData(countryData);
          dispatch(updateCountryData(countryData));
        });
      }
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

  useEffect(() => {
    if (currency == "INR") {
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
        valid.errorTracking(errorList, location.pathname);
      }
    }, 0);
  };

  const saveData = (
    formData: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    setIsLoading(true);
    setSuccessMsg("");
    HeaderService.saveHFH(dispatch, formData)
      .then(data => {
        setSuccessMsg(
          "Thank you for signing up. You will be reminded once Good Earth's Home For the Holidays sale will be live!"
        );
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
    const { email, firstName, lastName, country, city } = model;
    formData.append("email", email ? email.toString().toLowerCase() : "");
    formData.append("firstName", firstName || "");
    formData.append("lastName", lastName || "");
    formData.append("country", country || "");
    formData.append("city", city || "");

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
              required
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
              required
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
          <div className="select-group text-left">
            <FormSelect
              label="Country"
              options={countryOptions}
              // handleChange={onCountrySelect}
              placeholder="Select Country"
              name="country"
              // validations={{
              //   isExisty: true
              // }}
              // validationErrors={{
              //   isExisty: "Please select your Country",
              //   isEmptyString: isExistyError
              // }}
            />
            <span className="arrow"></span>
          </div>
          <div>
            <FormInput
              name="city"
              label="City"
              placeholder="City"
              validations={{
                maxLength: 50,
                isAlpha: true
              }}
              validationErrors={{
                maxLength: "Max limit reached.",
                isAlpha: "Only alphabets are allowed."
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
            value="Sign Up"
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
              <MakerEnhance
                user="goodearth"
                index="1"
                href={`${location.pathname}?${location.search}`}
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
