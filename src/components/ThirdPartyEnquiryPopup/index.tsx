import React, { useState, useContext, useRef } from "react";
import { useStore } from "react-redux";
import cs from "classnames";
// components
import CloseButton from "components/Modal/components/CloseButton";
// services
import ProductService from "services/product";
// contexts
import { Context as ModalContext } from "components/Modal/context";
// styles
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
// typings
import { ProductID } from "typings/id";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import FormTextArea from "components/Formsy/FormTextArea";
import FormSelect from "components/Formsy/FormSelect";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

type Props = {
  id: ProductID;
  quantity: number;
};

const CorporateEnquiryPopup: React.FC<Props> = ({ id, quantity }) => {
  const { dispatch } = useStore();

  const { closeModal } = useContext(ModalContext);

  const [submitted, setSubmitted] = useState(false);

  const [enquiryMessage, setEnquiryMessage] = useState<
    string | (string | JSX.Element)[]
  >("");

  const [error, setError] = useState("");
  const [radioType, setRadioType] = useState("");

  const stateOptions = useSelector((state: AppState) =>
    state.address.countryData
      .filter(country => country.code2 == "IN")[0]
      .regionSet.map(state => {
        return Object.assign({}, state, {
          value: state.nameAscii,
          label: state.nameAscii
        });
      })
  );

  const { isLoggedIn, firstName, lastName, email, phoneNumber } = useSelector(
    (state: AppState) => state.user
  );
  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    if (submitted) {
      closeModal();
    }
    if (radioType == "") {
      setError("Please choose preferred mode of contact");
      return false;
    }

    const { name, state, query, email, phoneNo } = model;
    const formData: any = {};
    formData["productId"] = id;
    formData["name"] = name;
    formData["state"] = state;
    formData["query"] = query;
    if (radioType == "email") {
      formData["email"] = email;
    } else if (radioType == "number") {
      formData["contactNo"] = "+91" + phoneNo;
    }
    ProductService.thirdPartyEnquire(dispatch, formData).then(data => {
      setSubmitted(true);
      setEnquiryMessage([
        "Thank you for this enquiry. Your mail has been received and our personal shopper will be in touch with you soon for the same. Please let us know if we may assist you with something else. Mail us at ",
        <a href="mailto:customercare@goodearth.in" key="email">
          customercare@goodearth.in
        </a>,
        " or dial in on ",
        <>
          <br />
          <a href="tel:+91 9582 999 555" key="phone1">
            +91 9582 999 555
          </a>
        </>,
        " / ",
        <>
          <a href="tel:+91 9582 999 888" key="phone2">
            +91 9582 999 888
          </a>
          <br />
        </>,
        " Monday - Saturday 9:00 am - 5:00 pm IST"
      ]);
    });
  };

  const onClickRadio = (event: any) => {
    setRadioType(event.target.value);
    setError("");
  };

  const handleInvalidSubmit = () => {
    if (submitted) {
      closeModal();
    }
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

  const EnquiryFormRef = useRef<Formsy>(null);

  const inputClass = submitted ? styles.disabledInput : "";
  const formContent = (
    <Formsy
      ref={EnquiryFormRef}
      onValidSubmit={handleSubmit}
      onInvalidSubmit={handleInvalidSubmit}
    >
      <div className={styles.categorylabel}>
        <div>
          <FormInput
            name="name"
            placeholder={"Name*"}
            label={"Name*"}
            value={isLoggedIn ? firstName + " " + lastName : ""}
            disable={submitted}
            className={inputClass}
            required
          />
        </div>
        <div>
          <div className="select-group text-left">
            <FormSelect
              required
              name="state"
              label="State"
              placeholder="Select State"
              disable={submitted}
              options={stateOptions}
              value=""
              validations={{
                isExisty: true
              }}
            />
          </div>
        </div>
        <div>
          <FormTextArea
            name="query"
            placeholder={"Query*"}
            label={"Query*"}
            rows={3}
            disable={submitted}
            inputClass={inputClass}
            required
          />
        </div>
        <p className={cs(styles.msg)}>Preferred mode of contact</p>
        <div className={cs(styles.radiobtn1, styles.xradio, styles.radioInput)}>
          <label className={styles.radio1}>
            <input
              type="radio"
              name={"inputType"}
              value="email"
              disabled={submitted}
              className={inputClass}
              onClick={e => {
                onClickRadio(e);
              }}
            />
            <span className={styles.checkmark}></span>
          </label>
          <FormInput
            name="email"
            placeholder={"Email*"}
            label={"Email*"}
            className={cs(globalStyles.relative, inputClass)}
            disable={submitted}
            value={isLoggedIn ? email : ""}
            validations={
              radioType == "email"
                ? {
                    isEmail: true,
                    maxLength: 75
                  }
                : {}
            }
            validationErrors={{
              isEmail: "Enter valid email",
              maxLength: "You are allowed to enter upto 75 characters only"
            }}
            required={radioType != "email" ? "isFalse" : true}
          />
        </div>
        <div
          className={cs(
            styles.countryCode,
            styles.countryCodeGc,
            styles.xradio,
            styles.radioInput
          )}
        >
          <label className={styles.radio1}>
            <input
              type="radio"
              name={"inputType"}
              value="number"
              disabled={submitted}
              className={inputClass}
              onClick={e => {
                onClickRadio(e);
              }}
            />
            <span className={styles.checkmark}></span>
          </label>
          <div className={styles.flex}>
            <div>
              <input
                type="text"
                value="+91"
                placeholder="Code"
                disabled={true}
                className={styles.codeInput}
              />
            </div>
            <div className={styles.contactNumber}>
              <FormInput
                name="phoneNo"
                value={isLoggedIn && phoneNumber ? phoneNumber : ""}
                placeholder={"Contact No.*"}
                type="number"
                disable={submitted}
                className={inputClass}
                label={"Contact No.*"}
                validations={
                  radioType == "number"
                    ? {
                        isLength: 10
                      }
                    : {}
                }
                validationErrors={{
                  isLength: "Phone number should be 10 digit"
                }}
                required={radioType != "number" ? "isFalse" : true}
              />
            </div>
          </div>
        </div>
        <div className={styles.marginBottom50}>
          {error ? <p className={globalStyles.errorMsg}>{error}</p> : ""}
          {enquiryMessage && (
            <p className={styles.enquireError}>{enquiryMessage}</p>
          )}
          <input
            type="submit"
            formNoValidate
            className={globalStyles.ceriseBtn}
            value={submitted ? "close" : "submit"}
          />
        </div>
      </div>
    </Formsy>
  );
  return (
    <div className={cs(styles.container)}>
      <div className={styles.header}>
        <CloseButton className={styles.closeBtn} />
      </div>
      <div className={cs(styles.innerContainer, globalStyles.textCenter)}>
        <div>
          <div className={styles.heading}>{"Product Enquiry Form"}</div>
          <div className={styles.subheading}>
            {"Please fill in the fields below."}
          </div>
          <div className={styles.loginForm}>{formContent}</div>
        </div>
      </div>
    </div>
  );
};

export default CorporateEnquiryPopup;
