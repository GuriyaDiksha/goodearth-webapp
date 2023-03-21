import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormCheckbox from "components/Formsy/FormCheckbox";
import styles from "../../containers/myAccount/components/styles.scss";
import styles2 from "./styles.scss";
import CountryCode from "components/Formsy/CountryCode";
import FormInput from "components/Formsy/FormInput";
import waIcon from "images/wa-icon.svg";
import tooltipIcon from "images/tooltip.svg";
import cs from "classnames";

type Props = {
  innerRef: any;
  showTermsMessage?: boolean;
  data?: any;
  showPhone?: boolean;
  showTooltip?: boolean;
  showManageMsg?: boolean;
  isdList?: any;
};

const WhatsappSubscribe: React.FC<Props> = ({
  data,
  innerRef,
  showTermsMessage = true,
  showPhone = true,
  showManageMsg = false,
  isdList,
  showTooltip = false
}) => {
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

  const labelElements = [];

  labelElements.push(<span key="1">Subscribe me for Whatsapp updates.</span>);

  // if (showTooltip) {
  //   labelElements.push(
  //     <img
  //       key="2"
  //       src={tooltipIcon}
  //       onClick={e => {
  //         setShowTip(true);
  //       }}
  //     />
  //   );
  // }
  if (!showTooltip) {
    labelElements.push(<img key="3" src={waIcon} />);
  }

  if (showManageMsg && checked) {
    labelElements.push(
      <div>Manage your preference from My Preference section under Profile</div>
    );
  }

  return (
    <div
      className={cs(styles.whatsapp, styles2.whatsapp, {
        [styles2.flexForTooltip]: showTooltip
      })}
    >
      <FormCheckbox
        id="whatsappSubscribe"
        name="whatsappSubscribe"
        disable={false}
        label={labelElements}
        value={checked}
        labelClassName={styles.checkboxLabel}
        inputRef={innerRef}
        handleChange={onCheckChange}
      />
      {showTooltip && (
        <div className={styles2.tooltip}>
          <img
            src={tooltipIcon}
            onClick={() => {
              setShowTip(!showTip);
            }}
          />
          <div className={cs(styles2.tooltipMsg, { [styles2.show]: showTip })}>
            By checking this, you agree to receiving Whatsapp messages for order
            & profile related information
          </div>
        </div>
      )}
      {checked && showPhone && (
        <div className={styles.countryCode}>
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
