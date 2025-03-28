import React, { useEffect, useState, useRef, RefObject } from "react";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import cs from "classnames";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import Loader from "components/Loader";
import { errorTracking, getErrorList } from "utils/validate";
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
import Button from "components/Button";
import SelectDropdown from "components/Formsy/SelectDropdown";

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

const SignUps25: React.FC = () => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const { showTimer } = useSelector((state: AppState) => state.info);
  const [countryOptions, setCountryOptions] = useState<CountryOptions[]>([]);
  const [stateOptions, setStateOptions] = useState<StateOptions[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [maker, setMaker] = useState(false);
  const history = useHistory();
  const location = history.location;
  const { countryData } = useSelector((state: AppState) => state.address);
  const countryRef: RefObject<HTMLInputElement> = useRef(null);
  const isAlphaError = "Please enter only alphabetic characters";
  const isExistyError = "This field is required";
  const dispatch = useDispatch();

  useEffect(() => {
    if (!countryData || countryData.length == 0) {
      LoginService.fetchCountryData(dispatch).then(countryData => {
        dispatch(updateCountryData(countryData));
      });
    }
    setMaker(true);
    const firstField = document.getElementById("first-field") as HTMLDivElement;
    firstField && firstField.focus();
    setIsLoading(false);
  }, []);

  // *************** Open State option **************
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

      const { states, isd } = countryOptions.filter(
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
          countrycode: isd,
          country: selectedCountry
        });
      }
      setStateOptions(states);
      setEnableSubmit(true);
    }
  };
  // *************** Closed State option **************

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

  const saveData = (
    formData: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    setIsLoading(true);
    setSuccessMsg("");
    HeaderService.makeNewsletterSignupRequest(dispatch, formData)
      .then(data => {
        if (data.status) {
          setSuccessMsg("Thank you for signing up!");
        } else {
          setSuccessMsg(data.message);
        }
        // resetForm();
        setEnableSubmit(false);
      })
      .catch(err => {
        const errors = err.response.data.errors;
        if (errors && typeof errors[0] == "string") {
          setSuccessMsg(errors[0]);
        } else {
          setSuccessMsg("You have already signed up.");
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
    const { email, name, country, state, city } = model;
    formData.append("email", email ? email.toString().toLowerCase() : "");
    formData.append("name", name || "");
    formData.append("country", country || "");
    formData.append("state", state || "");
    formData.append("city", city || "");
    formData.append("source", "SignUps25");

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
      <h4 className={styles.signupTitle}>
        Sign up to our weekly newsletter and get exclusive preview to new
        collections, stories of style and inspiration, and special offers in
        store and online!
      </h4>
      <Formsy
        onValidSubmit={handleSubmit}
        onInvalidSubmit={handleInvalidSubmit}
        ref={EnquiryFormRef}
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
              placeholder="Name*"
              name="name"
              validations={{
                maxLength: 100,
                isWords: true
              }}
              handleChange={event => {
                event.target.value
                  ? setEnableSubmit(true)
                  : setEnableSubmit(false);
              }}
              validationErrors={{
                maxLength: "Max limit reached.",
                isWords: isAlphaError
              }}
            />
          </div>
          <div>
            <FormInput
              required
              name="email"
              label="Email Address*"
              className="input-field"
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
            <SelectDropdown
              required
              label={"Country*"}
              options={countryOptions}
              handleChange={onCountrySelect}
              placeholder="Select Country*"
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
          <div className="select-group text-left">
            <FormSelect
              name="state"
              label={"State"}
              placeholder={"Select State"}
              options={stateOptions}
              value=""
            />
          </div>
          <div>
            <FormInput
              label="City"
              placeholder="City"
              name="city"
              validations={{
                maxLength: 40,
                isWords: true
              }}
              handleChange={event => {
                event.target.value
                  ? setEnableSubmit(true)
                  : setEnableSubmit(false);
              }}
              validationErrors={{
                maxLength: "Max limit reached.",
                isWords: isAlphaError
              }}
            />
          </div>
          <div className={styles.label}>
            {[
              "By signing up for alerts, you agree to receive e-mails, newsletters, calls and text messages for service related information. To know more how we keep your data safe, refer to our ",
              <Link
                key="terms"
                to="/customer-assistance/privacy-policy"
                target="_blank"
              >
                Privacy Policy.
              </Link>
            ]}
          </div>
          <p
            className={cs(
              successMsg == "Thank you for signing up!"
                ? styles.successMessage
                : styles.errorMsg
            )}
          >
            {successMsg}
          </p>
          <Button
            type="submit"
            disabled={!enableSubmit}
            className={cs(globalStyles.btnFullWidth, globalStyles.marginT10)}
            label="Sign Up"
            variant="largeAquaCta"
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
            {maker && (
              <MakerEnhance
                user="goodearth"
                index="1"
                href={`${window.location.origin}${location.pathname}`}
              />
            )}
          </div>
        }
        {formContent}
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default SignUps25;
