import React, { useState, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();

  const { closeModal } = useContext(ModalContext);

  const [submitted, setSubmitted] = useState(false);

  const [enquiryMessage, setEnquiryMessage] = useState<
    string | (string | JSX.Element)[]
  >("");

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

  const modeOptions = [
    {
      value: "Email",
      label: "Email"
    },
    {
      value: "Phone",
      label: "Phone"
    }
  ];

  const { isLoggedIn, firstName, lastName, email, phoneNumber } = useSelector(
    (state: AppState) => state.user
  );
  const { mobile } = useSelector((state: AppState) => state.device);
  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    if (submitted) {
      closeModal();
    }
    const { name, state, query, email, phoneNo, preferredContact } = model;
    const formData: any = {};
    formData["productId"] = id;
    formData["name"] = name;
    formData["state"] = state;
    formData["query"] = query;
    formData["email"] = email;
    formData["contactNo"] = "+91" + phoneNo;
    formData["preferredContact"] = preferredContact;
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
            validations={{
              isWords: true
            }}
            validationErrors={{
              isWords: "Only alphabets are allowed"
            }}
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
        <div>
          <FormInput
            name="email"
            placeholder={"Email*"}
            label={"Email*"}
            className={cs(globalStyles.relative, inputClass)}
            disable={submitted}
            value={isLoggedIn ? email : ""}
            validations={{
              isEmail: true,
              maxLength: 75
            }}
            validationErrors={{
              isEmail: "Enter valid email",
              maxLength: "You are allowed to enter upto 75 characters only"
            }}
            required
          />
        </div>
        <div className={cs(styles.countryCode, styles.countryCodeGc)}>
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
                validations={{
                  isLength: 10
                }}
                validationErrors={{
                  isLength: "Phone number should be 10 digit"
                }}
                required
              />
            </div>
          </div>
        </div>
        <p className={cs(styles.msg)}>Preferred mode of contact</p>
        <div>
          <div className="select-group text-left">
            <FormSelect
              required
              name="preferredContact"
              label="Preferred mode"
              placeholder="Select Mode"
              disable={submitted}
              options={modeOptions}
              value=""
              validations={{
                isExisty: true
              }}
            />
          </div>
        </div>
        <div className={styles.marginBottom50}>
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
      <div
        className={cs(styles.innerContainer, globalStyles.textCenter, {
          [styles.innerContainerMobile]: mobile
        })}
      >
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
