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
import AccountService from "services/account";
import { updatePreferenceData } from "actions/user";
import { showGrowlMessage } from "utils/validate";

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
  whatsappClass?: string;
  countryCodeClass?: string;
  checkboxLabelClass?: string;
  onlyCheckbox?: boolean;
  allowUpdate?: boolean;
  uniqueKey: string;
};

const WhatsappSubscribe: React.FC<Props> = ({
  data,
  innerRef,
  showTermsMessage = true,
  showPhone = true,
  showManageMsg = false,
  isdList,
  showTooltip = false,
  codeRef,
  phoneRef,
  whatsappClass,
  countryCodeClass,
  checkboxLabelClass,
  onlyCheckbox = false,
  allowUpdate = false,
  uniqueKey
}) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (data) {
      setChecked(data.whatsappSubscribe);
      setCode(data.whatsappNoCountryCode);
      setPhone(data.whatsappNo);
      if (!data.whatsappSubscribe) {
        setUpdated(false);
      }
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

  const submitPreferenceData = () => {
    console.log(checked, phone, code);
    const subscribe = data.subscribe,
      whatsappSubscribe = checked,
      whatsappNo = phone,
      whatsappNoCountryCode = code;

    let formdata = {
      subscribe: subscribe,
      whatsappNo: whatsappNo,
      whatsappNoCountryCode: whatsappNoCountryCode,
      whatsappSubscribe: whatsappSubscribe
    };

    if (!whatsappSubscribe) {
      formdata = {
        subscribe: subscribe,
        whatsappNo: data.whatsappNo,
        whatsappNoCountryCode: data.whatsappNoCountryCode,
        whatsappSubscribe: whatsappSubscribe
      };
    }

    AccountService.updateAccountPreferences(dispatch, formdata)
      .then((res: any) => {
        setUpdated(true);
        dispatch(updatePreferenceData(res));
        showGrowlMessage(dispatch, "Your preferences have been updated!", 5000);
      })
      .catch((err: any) => {
        const errdata = err.response?.data;
        console.log(errdata);
        // Object.keys(data).map(key => {
        //   switch (key) {
        //     case "whatsappNo":
        //       updateInputsWithError(
        //         {
        //           [key]: data[key][0]
        //         },
        //         true
        //       );
        //       break;
        //   }
        // });
      });
  };

  //If update from component is allowed but user already subscribed
  if (allowUpdate && !updated) {
    if (data.whatsappSubscribe) {
      return (
        <div className={styles.showPopupMsg} key={uniqueKey}>
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
  }

  //all other cases
  return (
    <div className={cs(styles.whatsapp, whatsappClass)} key={uniqueKey}>
      <div
        className={cs({
          [styles.flexForTooltip]: showTooltip
        })}
      >
        <FormCheckbox
          id={uniqueKey}
          name="whatsappSubscribe"
          disable={allowUpdate && updated}
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
      {showManageMsg && checked && !updated && (
        <div className={styles.manageMsg}>
          Manage your preference from My Preference section under Profile
        </div>
      )}
      {allowUpdate && updated && (
        <div className={cs(styles.showPopupMsg, styles.manageMsg)}>
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
      )}
      {!onlyCheckbox && !updated && (
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
            id={uniqueKey}
            showLabel={true}
            innerRef={codeRef}
          />
          <div className={styles.numberInput}>
            <FormInput
              name="whatsappNo"
              value={phone}
              placeholder={"Contact Number"}
              type="number"
              label={"Contact Number"}
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
            {allowUpdate && (
              <div className={styles.updateBtn} onClick={submitPreferenceData}>
                Update
              </div>
            )}
          </div>
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
