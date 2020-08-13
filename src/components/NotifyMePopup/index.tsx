import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  EventHandler,
  MouseEvent,
  useEffect
} from "react";
import { useStore } from "react-redux";
import cs from "classnames";
// components
import CloseButton from "components/Modal/components/CloseButton";
import SizeSelector from "components/SizeSelector";
import Quantity from "components/quantity";
import InputField from "components/InputField";
import Button from "components/Button";
//actions
import { showMessage } from "actions/growlMessage";
// services
import BasketService from "services/basket";
import ProductService from "services/product";
// contexts
import UserContext from "contexts/user";
import { Context as ModalContext } from "components/Modal/context";
// styles
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { ChildProductAttributes } from "typings/product";
import { ADD_TO_BAG_SUCCESS } from "constants/messages";
import { Currency } from "typings/currency";
import { currencyCodes } from "constants/currency";

type Props = {
  price: number;
  currency: Currency;
  title: string;
  childAttributes: ChildProductAttributes[];
  collection?: string;
  selectedIndex?: number;
  changeSize?: (size: string, quantity?: number) => void;
};

const NotifyMePopup: React.FC<Props> = ({
  currency,
  price,
  collection,
  childAttributes,
  title,
  selectedIndex,
  changeSize
}) => {
  const { dispatch } = useStore();

  const user = useContext(UserContext);

  const { closeModal } = useContext(ModalContext);
  const [
    selectedSize,
    setSelectedSize
  ] = useState<ChildProductAttributes | null>(
    selectedIndex !== undefined ? childAttributes[selectedIndex] : null
  );

  const minQuantity = 1;
  const maxQuantity = selectedSize ? selectedSize.stock : 1;

  const [quantity, setQuantity] = useState<number>(1);

  const onQuantityChange = useCallback(
    value => {
      setQuantity(value);
    },
    [selectedSize]
  );

  const onSizeSelect = useCallback(
    selected => {
      setSelectedSize(selected);
      setQuantity(1);

      changeSize?.(selected.size);
    },
    [childAttributes, selectedSize]
  );

  const userExists = !!(user && user.email);

  const [msg, setMsg] = useState("");
  const [sizeErrorMsg, setSizeErrorMsg] = useState("");

  const [email, setEmail] = useState(userExists ? user.email : "");
  const [emailError, setEmailError] = useState("");

  const onEmailChange = (value: string, error: string) => {
    setEmail(value);
    setEmailError(error);
  };

  const validator = (value: string) => {
    let valid = true,
      message = "";
    const re = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    if (!value) {
      valid = false;
      message = "This field is required";
    } else if (!re.test(value)) {
      valid = false;
      message = "Enter valid email";
    }

    return {
      valid,
      message
    };
  };
  const gtmPushAddToBag = () => {
    dataLayer.push({
      event: "addToCart",
      ecommerce: {
        currencyCode: currency,
        add: {
          products: [
            {
              name: title,
              id: childAttributes[0].sku,
              price: price,
              brand: "Goodearth",
              category: collection,
              variant: null,
              // 'variant': this.props.wishlist_product.ga_variant,
              quantity: quantity,
              list: localStorage.getItem("list")
            }
          ]
        }
      }
    });
  };

  const addToBasket = async () => {
    if (selectedSize) {
      await BasketService.addToBasket(dispatch, selectedSize.id, quantity);
      dispatch(showMessage(ADD_TO_BAG_SUCCESS));
      gtmPushAddToBag();
      closeModal();
    } else {
      setSizeErrorMsg("Please select size");
    }
  };

  const onNotifyClick = async () => {
    const { valid, message } = validator(email);

    if (!valid) {
      setEmailError(message);
    } else {
      if (selectedSize) {
        const { successful, message } = await ProductService.notifyMe(
          dispatch,
          selectedSize.id,
          email
        );

        if (!successful) {
          setEmailError(message);
        } else {
          setMsg(message);
        }
      } else {
        setSizeErrorMsg("Please select size");
      }
    }
  };

  const button = useMemo(() => {
    let buttonText: string, action: EventHandler<MouseEvent>;
    let allOutOfStock = true;

    childAttributes.forEach(({ stock }) => {
      if (stock > 0) {
        allOutOfStock = false;
      }
    });
    if (allOutOfStock || (selectedSize && selectedSize.stock == 0)) {
      buttonText = "Notify Me";
      action = onNotifyClick;
    } else {
      buttonText = "Add to Bag";
      action = addToBasket;
    }

    return (
      <Button label={buttonText} onClick={action} className={styles.button} />
    );
  }, [selectedSize, email, quantity]);

  useEffect(() => {
    setMsg("");
    setEmailError("");
    setSizeErrorMsg("");
  }, [selectedSize]);

  return (
    <div className={cs(styles.container)}>
      <div className={styles.header}>
        <CloseButton className={styles.closeBtn} />
      </div>
      <div className={globalStyles.textCenter}>
        {msg && <div className={styles.successMsg}>{msg}</div>}
        <div className={styles.collection}>{collection}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.price}>
          {String.fromCharCode(currencyCodes[currency])}&nbsp;
          {selectedSize ? selectedSize.priceRecords[currency] : price}
        </div>
        <div className={cs(styles.label, styles.sizeLabel)}>SELECT SIZE</div>
        <SizeSelector
          sizes={childAttributes}
          onChange={onSizeSelect}
          sizeClassName={styles.sizeBox}
          selected={selectedSize ? selectedSize.id : undefined}
        />
        {sizeErrorMsg && (
          <span className={styles.sizeError}>{sizeErrorMsg}</span>
        )}
        <div className={cs(styles.label, styles.qtyLabel)}>SELECT QUANTITY</div>

        <div className={styles.qtyContainer}>
          <Quantity
            source="notifyme"
            id={selectedSize ? selectedSize.id : 0}
            minValue={minQuantity}
            maxValue={maxQuantity}
            currentValue={quantity}
            onChange={onQuantityChange}
            errorMsg={selectedSize ? "Available qty in stock is" : ""}
            disabled={(selectedSize && selectedSize.stock == 0) || false}
            className={styles.quantityWrapper}
            inputClass={styles.inputQuantity}
          />
        </div>
        {selectedSize && selectedSize.stock === 0 && (
          <div className={cs(styles.emailInput, globalStyles.textLeft)}>
            <InputField
              id="width"
              value={email}
              onChange={onEmailChange}
              validator={validator}
              className={styles.field}
              label="Email"
              placeholder="Email Address"
              errorMsg={emailError}
              disabled={userExists}
            />
          </div>
        )}
        {button}
      </div>
    </div>
  );
};

export default NotifyMePopup;
