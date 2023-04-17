import React, { useEffect, useState, useRef } from "react";
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
import globalStyles from "../../styles/global.scss";
import Formsy from "formsy-react";

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
  showSubscribe?: boolean;
  uniqueKey: string;
  newsletterClass?: string;
  buttonClass?: string;
  oneLineMessage?: boolean;
  whatsappFormRef?: React.RefObject<Formsy>;
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
  uniqueKey,
  showSubscribe = false,
  newsletterClass,
  buttonClass,
  oneLineMessage = false,
  whatsappFormRef
}) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [showTip, setShowTip] = useState(false);
  // const [updated, setUpdated] = useState(false);
  const [numberError, setNumberError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [objEqual, setObjEqual] = useState(true);

  const formRef = whatsappFormRef || useRef<Formsy>(null);

  const impactRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (evt: any) => {
    if (impactRef.current && !impactRef.current.contains(evt.target)) {
      setShowTip(false);
      //Do what you want to handle in the callback
      // this.props.closePopup(evt);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setChecked(data.whatsappSubscribe);
      setCode(data.whatsappNoCountryCode);
      setPhone(data.whatsappNo);
      setSubscribe(data.subscribe);
      // if (!data.whatsappSubscribe) {
      //   setUpdated(false);
      // }
    }
  }, [data]);

  const onCheckChange = (e: any) => {
    setChecked(e.target.checked);
  };

  const onPhoneChange = (e: any) => {
    const value = e.target.value;
    setPhone(value);
  };

  // const onCodeChange = (e: any) => {
  //   const value = e.target.value;
  //   setCode(value);
  // };

  const onSubscribeChange = (e: any) => {
    const value = e.target.checked;
    setSubscribe(value);
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

  // const submitPreferenceData = () => {
  //   if (codeError != "" || numberError != "") {
  //     return;
  //   }

  //   const subscribe = data.subscribe,
  //     whatsappSubscribe = checked,
  //     whatsappNo = phone,
  //     whatsappNoCountryCode = formRef.current?.getCurrentValues()
  //       .whatsappNoCountryCode;

  //   let formdata = {
  //     subscribe: subscribe,
  //     whatsappNo: whatsappNo,
  //     whatsappNoCountryCode: whatsappNoCountryCode,
  //     whatsappSubscribe: whatsappSubscribe
  //   };

  //   if (!whatsappSubscribe) {
  //     formdata = {
  //       subscribe: subscribe,
  //       whatsappNo: data.whatsappNo,
  //       whatsappNoCountryCode: data.whatsappNoCountryCode,
  //       whatsappSubscribe: whatsappSubscribe
  //     };
  //   }

  //   AccountService.updateAccountPreferences(dispatch, formdata)
  //     .then((res: any) => {
  //       // setUpdated(true);
  //       dispatch(updatePreferenceData(res));
  //       showGrowlMessage(dispatch, "Your preferences have been updated!", 5000);
  //     })
  //     .catch((err: any) => {
  //       const errdata = err.response?.data;

  //       Object.keys(errdata).map(key => {
  //         switch (key) {
  //           case "whatsappNo":
  //             formRef.current?.updateInputsWithError(
  //               {
  //                 [key]: errdata[key][0]
  //               },
  //               true
  //             );
  //             setNumberError(errdata[key][0]);
  //             break;
  //         }
  //       });
  //     });
  // };

  const onFormChange = (model: any, isChanged: any) => {
    //If show subscribe is enabled in future add case for subscribe checkbox
    const { whatsappSubscribe, whatsappNo, whatsappNoCountryCode } = model;
    if (data) {
      const prefData = data;
      if (
        whatsappSubscribe == prefData.whatsappSubscribe &&
        whatsappNoCountryCode == prefData.whatsappNoCountryCode &&
        whatsappNo == prefData.whatsappNo
      ) {
        setObjEqual(true);
      } else {
        setObjEqual(false);
      }
    }
    if (objEqual || codeError != "" || numberError != "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  const onSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const {
      subscribe,
      whatsappSubscribe,
      whatsappNo,
      whatsappNoCountryCode
    } = model;

    let reqData = {
      subscribe: subscribe || data.subscribe,
      whatsappNo: whatsappNo,
      whatsappNoCountryCode: whatsappNoCountryCode,
      whatsappSubscribe: whatsappSubscribe
    };

    if (!whatsappSubscribe) {
      reqData = {
        subscribe: subscribe || data.subscribe,
        whatsappNo: data.whatsappNo,
        whatsappNoCountryCode: data.whatsappNoCountryCode,
        whatsappSubscribe: whatsappSubscribe
      };
    }

    AccountService.updateAccountPreferences(dispatch, reqData)
      .then((res: any) => {
        setIsDisabled(true);
        dispatch(updatePreferenceData(res));
        showGrowlMessage(dispatch, "Your preferences have been updated!", 5000);
        setNumberError("");
        dispatch(updateModal(false));
      })
      .catch((err: any) => {
        const errData = err.response?.data;
        Object.keys(errData).map(key => {
          switch (key) {
            case "whatsappNo":
              updateInputsWithError(
                {
                  [key]: errData[key][0]
                },
                true
              );
              setNumberError(errData[key][0]);
              break;
          }
        });
      });
  };

  //If update from component is allowed but user already subscribed
  if (allowUpdate) {
    if (data.whatsappSubscribe) {
      return (
        <div className={styles.showPopupMsg} key={uniqueKey}>
          <img src={waIcon} />
          <div
            className={cs(styles.text, { [styles.oneline]: oneLineMessage })}
          >
            <div className={styles.info}>
              Whatsapp updates will be sent on {data.whatsappNoCountryCode}{" "}
              {data.whatsappNo}.&nbsp;
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
    // Improve this form by disabling enabling state using onValid and onInvalid
    // codeError and numberError states can be removed
    <Formsy
      onSubmit={onSubmit}
      onChange={onFormChange}
      ref={formRef}
      key={uniqueKey}
    >
      <div className={cs(styles.whatsapp, whatsappClass)}>
        <div
          className={cs({
            [styles.flexForTooltip]: showTooltip
          })}
        >
          <FormCheckbox
            id={uniqueKey}
            name="whatsappSubscribe"
            label={labelElements}
            value={checked}
            labelClassName={checkboxLabelClass}
            handleChange={onCheckChange}
            inputRef={innerRef}
            disable={false}
          />
          {showTooltip && (
            <div className={styles.tooltip} ref={impactRef}>
              <img
                src={showTip ? tooltipOpenIcon : tooltipIcon}
                onClick={() => {
                  setShowTip(!showTip);
                }}
              />
              <div
                className={cs(styles.tooltipMsg, { [styles.show]: showTip })}
              >
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
        {/* {(allowUpdate && !checked) && (
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
        )} */}
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
              id={uniqueKey}
              showLabel={true}
              innerRef={codeRef}
              validations={{
                isCodeValid: (values, value) => {
                  const bool = !(values.whatsappNo && value == "");
                  if (!bool) {
                    setCodeError("Required");
                    return false;
                  } else {
                    setCodeError("");
                    return true;
                  }
                },
                isValidCode: (values, value) => {
                  let bool = true;
                  if (value && isdList.length > 0) {
                    bool = isdList.indexOf(value ? value : "") > -1;
                  }
                  if (!bool) {
                    setCodeError("Enter valid code");
                  } else {
                    if (value?.length > 0) {
                      setCodeError("");
                    }
                  }
                  return bool;
                }
              }}
              validationErrors={{
                isCodeValid: "Required",
                isValidCode: "Enter valid code"
              }}
              autocomplete="off"
              // handleChange={onCodeChange}
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
                validations={{
                  compulsory: (values, value) => {
                    if (values.whatsappSubscribe && value == "") {
                      setNumberError("Please enter your contact number");
                      return false;
                    } else {
                      setNumberError("");
                      return true;
                    }
                  }
                }}
                validationErrors={{
                  compulsory: "Please enter your contact number"
                }}
                handleChange={onPhoneChange}
                showLabel={true}
                inputRef={phoneRef}
                noErrOnPristine={true}
              />
              {/* {allowUpdate && (
                <div
                  className={styles.updateBtn}
                  onClick={submitPreferenceData}
                >
                  Update
                </div>
              )} */}
            </div>
          </div>
        )}
        {showTermsMessage && (
          <span className={styles.termsMsg}>
            By checking this, you agree to receiving Whatsapp messages for order
            & profile related information. To know more how we keep your data
            safe, refer to our&nbsp;
          </span>
        )}
        {showTermsMessage && (
          <Link
            key="privacy"
            to="/customer-assistance/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy.
          </Link>
        )}
        {showSubscribe && (
          <div
            className={newsletterClass}
            style={!showSubscribe ? { display: "none" } : {}}
          >
            <FormCheckbox
              id="subscribe"
              name="subscribe"
              disable={false}
              label={["Subscribe me to Emailers & Newsletters"]}
              value={subscribe}
              labelClassName={checkboxLabelClass}
              handleChange={onSubscribeChange}
            />
            By checking this, you agree to receiving e-mails, newsletters, calls
            and text messages for service related information. To know more how
            we keep your data safe, refer to our &nbsp;
            <Link
              key="privacy"
              to="/customer-assistance/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy .
            </Link>
          </div>
        )}
        {!(onlyCheckbox || allowUpdate) && (
          <div className={styles.savePrefBtn}>
            <input
              type="submit"
              value="Save Preferences"
              className={cs(
                globalStyles.charcoalBtn,
                {
                  [globalStyles.disabledBtn]: isDisabled
                },
                buttonClass
              )}
              disabled={isDisabled}
            />
          </div>
        )}
      </div>
    </Formsy>
  );
};

export default WhatsappSubscribe;
