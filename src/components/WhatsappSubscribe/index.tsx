import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import FormCheckbox from "components/Formsy/FormCheckbox";
import styles from "./styles.scss";
import CountryCode from "components/Formsy/CountryCode";
import FormInput from "components/Formsy/FormInput";
import waIcon from "images/wa-icon.svg";
import tooltipIcon from "images/tooltip.svg";
import tooltipOpenIcon from "images/tooltip-open.svg";
import cs from "classnames";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";

type Props = {
  innerRef: any;
  codeRef?: any;
  phoneRef?: any;
  showTermsMessage?: boolean;
  data?: any;
  showPhone?: boolean;
  showTooltip?: boolean;
  showManageMsg?: boolean;
  isdList?: any;
  showPopupMsg?: boolean;
  whatsappClass?: string;
  countryCodeClass?: string;
  checkboxLabelClass?: string;
  onlyCheckbox?: boolean;
};

const WhatsappSubscribe: React.FC<Props> = ({
  data,
  innerRef,
  showTermsMessage = true,
  showPhone = true,
  showManageMsg = false,
  isdList,
  showTooltip = false,
  showPopupMsg = false,
  codeRef,
  phoneRef,
  whatsappClass,
  countryCodeClass,
  checkboxLabelClass,
  onlyCheckbox = false
}) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (data) {
      setChecked(data.whatsappSubscribe);
      setCode(data.whatsappNoCountryCode);
      setPhone(data.whatsappNo);
    }
  }, [data]);

  const onCheckChange = (e: any) => {
    setChecked(e.target.checked);
  };

  const onPhoneChange = (e: any) => {
    setPhone(e.target.value);
  };

  const onCodeChange = (e: any) => {
    setCode(e.target.value);
  };

  const closePopup = () => {
    dispatch(updateModal(false));
  };

  const openPopup = () => {
    dispatch(
      updateComponent(
        POPUP.WHATSAPP,
        { data: data, isdList: isdList, closePopup },
        true
      )
    );
    dispatch(updateModal(true));
  };

  const labelElements = [];

  labelElements.push(<span key="1">Subscribe me for Whatsapp updates.</span>);

  if (!showTooltip) {
    labelElements.push(<img key="3" src={waIcon} />);
  }

  //If data already filled and popup msg needs to show
  if (showPopupMsg && data.whatsappSubscribe) {
    return (
      <div className={styles.showPopupMsg}>
        <img src={waIcon} />
        <div className={styles.text}>
          <div className={styles.info}>
            Whatsapp updates will be sent on {data.whatsappNoCountryCode}{" "}
            {data.whatsappNo}.
          </div>
          <div className={styles.cta}>
            <a onClick={openPopup}>Click here</a> to update this number or
            unsubscribe.
          </div>
        </div>
      </div>
    );
  }

  //all other cases
  return (
    <div className={cs(styles.whatsapp, whatsappClass)}>
      <div
        className={cs({
          [styles.flexForTooltip]: showTooltip
        })}
      >
        <FormCheckbox
          id="whatsappSubscribe"
          name="whatsappSubscribe"
          disable={false}
          label={labelElements}
          value={checked}
          labelClassName={checkboxLabelClass}
          inputRef={innerRef}
          handleChange={onCheckChange}
        />
        {showTooltip && (
          <div className={styles.tooltip}>
            <img
              src={showTip ? tooltipOpenIcon : tooltipIcon}
              onClick={() => {
                setShowTip(!showTip);
              }}
            />
            <div className={cs(styles.tooltipMsg, { [styles.show]: showTip })}>
              By checking this, you agree to receiving Whatsapp messages for
              order & profile related information
            </div>
          </div>
        )}
      </div>
      {showManageMsg && checked && (
        <div className={styles.manageMsg}>
          Manage your preference from My Preference section under Profile
        </div>
      )}
      {!onlyCheckbox && (
        <div
          className={countryCodeClass}
          style={!(checked && showPhone) ? { display: "none" } : {}}
        >
          <CountryCode
            name="whatsappNoCountryCode"
            placeholder="Code"
            label="Country Code"
            value={code}
            handleChange={onCodeChange}
            id="isdcode"
            validations={{
              isCodeValid: (values, value) => {
                return !(values.phone && value == "");
              },
              isValidCode: (values, value) => {
                if (value && isdList.length > 0) {
                  return isdList.indexOf(value ? value : "") > -1;
                } else {
                  return true;
                }
              }
            }}
            validationErrors={{
              isCodeValid: "Required",
              isValidCode: "Enter valid code"
            }}
            showLabel={true}
            innerRef={codeRef}
          />
          <FormInput
            // required
            name="whatsappNo"
            value={phone}
            placeholder={"Contact Number"}
            type="number"
            label={"Contact Number"}
            validations={{
              isExisty: true
            }}
            validationErrors={{
              isExisty: "Please enter your Contact Number"
            }}
            keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
            keyDown={e => (e.which === 69 ? e.preventDefault() : null)}
            onPaste={e =>
              e?.clipboardData.getData("Text").match(/([e|E])/)
                ? e.preventDefault()
                : null
            }
            handleChange={onPhoneChange}
            showLabel={true}
            inputRef={phoneRef}
          />
        </div>
      )}
      {showTermsMessage &&
        `By checking this, you agree to receiving Whatsapp messages for order &
          profile related information. To know more how we keep your data safe,
          refer to our
          `}
      {showTermsMessage && (
        <Link
          key="privacy"
          to="/customer-assistance/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy .
        </Link>
      )}
    </div>
  );
};

export default WhatsappSubscribe;
