import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  EventHandler,
  MouseEvent
} from "react";
import { useStore } from "react-redux";
import cs from "classnames";
// components
import Button from "components/Button";
import CloseButton from "components/Modal/components/CloseButton";
import InputField from "components/InputField";
// services
import ProductService from "services/product";
// contexts
import { Context as ModalContext } from "components/Modal/context";
// styles
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
// typings
import { ProductID } from "typings/id";
import { Fields } from "./typings";

type Props = {
  id: ProductID;
  quantity: number;
};

const CorporateEnquiryPopup: React.FC<Props> = ({ id, quantity }) => {
  const { dispatch } = useStore();

  const { closeModal } = useContext(ModalContext);

  const [submitted, setSubmitted] = useState(false);

  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [values, setValues] = useState<
    {
      [x in Fields]: string;
    }
  >({
    name: "",
    contactNo: "",
    email: "",
    quantity: quantity.toString(),
    query: ""
  });

  const [errors, setErrors] = useState<
    {
      [x in Fields]: string;
    }
  >({
    name: "",
    contactNo: "",
    email: "",
    quantity: "",
    query: ""
  });

  const fields: {
    id: Fields;
    label: string;
    placeholder: string;
  }[] = useMemo(() => {
    return [
      {
        id: "name",
        label: "Name",
        placeholder: "Name"
      },
      {
        id: "contactNo",
        label: "Mobile Number",
        placeholder: "Mobile Number"
      },
      {
        id: "email",
        label: "Email",
        placeholder: "Email"
      },
      {
        id: "quantity",
        label: "Quantity",
        placeholder: "Quantity"
      },
      {
        id: "query",
        label: "Query",
        placeholder: "Query"
      }
    ];
  }, []);

  const filterValue = (value: string, name: string) => {
    if (name == "quantity") {
      if (value && /[^0-9]/.test(value)) {
        return null;
      }
    } else if (name === "number") {
      if (value && /[^+\s0-9]$/.test(value)) {
        return null;
      }
    }
    return value;
  };

  const getChangeHandler = (name: string) => {
    return (value: string, error: string) => {
      const filteredValue = filterValue(value, name);

      if (filteredValue !== null) {
        setValues({
          ...values,
          [name]: value
        });
        setErrors({
          ...errors,
          [name]: error
        });
      }
    };
  };

  const validator = useCallback((value: string, name: string) => {
    let valid = true,
      message = "";
    let re,
      invalidMessage = "";
    switch (name) {
      case "email":
        re = new RegExp(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        invalidMessage = "Please enter a valid Email ID";
        break;
    }

    if (!value) {
      valid = false;
      message = "This field is required";
    } else if (re && !re.test(value)) {
      valid = false;
      message = invalidMessage;
    }

    return {
      valid,
      message
    };
  }, []);

  const getValidator = (name: string) => {
    return (value: string) => {
      return validator(value, name);
    };
  };

  const validateForm = () => {
    let formValid = true;
    let formErrors = errors;
    fields.map(({ id }) => {
      const { valid, message } = validator(values[id], id);
      formErrors = {
        ...formErrors,
        [id]: message
      };

      if (!valid) {
        formValid = false;
      }
    });
    setErrors({
      ...formErrors
    });
    return formValid;
  };
  const submit = async () => {
    const formValid = validateForm();
    if (formValid) {
      const result = await ProductService.enquire(dispatch, {
        ...values,
        productId: id
      });

      if (result.successful) {
        setSubmitted(true);
        setEnquiryMessage(
          "Thank you for sharing your details with us! We'll get back to you shortly.For any further queries, you can reach us at +91 9582 999 555 / +91 9582 999 888 between 9am–5pm IST."
        );
      } else {
        const formErrors = {
          ...errors
        };
        if (result.errors) {
          for (const key in result.errors) {
            const msg = result.errors[key as Fields]![0];
            formErrors[key as Fields] = msg;
          }

          setErrors(formErrors);
        }
        setEnquiryMessage("");
      }
    }
  };

  let buttonText: string, action: EventHandler<MouseEvent>;
  buttonText = "Submit";
  action = submit;

  if (submitted) {
    buttonText = "Close";
    action = closeModal;
  }

  const button = (
    <Button label={buttonText} onClick={action} className={styles.button} />
  );

  return (
    <div className={cs(styles.container)}>
      <div className={styles.header}>
        <CloseButton className={styles.closeBtn} />
      </div>
      <div className={cs(styles.innerContainer, globalStyles.textCenter)}>
        <div className={styles.heading}>Corporate Gifts Enquiry</div>
        <div className={styles.subheading}>
          Please fill in the fields below.
        </div>

        {fields.map(({ id, label, placeholder }) => {
          return (
            <div className={cs(styles.field, globalStyles.textLeft)} key={id}>
              <InputField
                id={id}
                value={values[id]}
                onChange={getChangeHandler(id)}
                validator={getValidator(id)}
                className={styles.field}
                label={label}
                validateAfterBlur
                placeholder={placeholder}
                errorMsg={errors[id]}
                disabled={submitted}
              />
            </div>
          );
        })}
        {enquiryMessage && (
          <p className={styles.enquireError}>{enquiryMessage}</p>
        )}
        {button}
      </div>
    </div>
  );
};

export default CorporateEnquiryPopup;
