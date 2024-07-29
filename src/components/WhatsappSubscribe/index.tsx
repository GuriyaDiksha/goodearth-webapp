import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import FormCheckbox from "components/Formsy/FormCheckbox";
import styles from "./styles.scss";
// import CountryCode from "components/Formsy/CountryCode";
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
import Button from "components/Button";
import SelectDropdown from "components/Formsy/SelectDropdown";
import { AppState } from "reducers/typings";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";

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
  whatsappNoErr?: string;
  countryData?: any;
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
  whatsappFormRef,
  whatsappNoErr = "",
  countryData
}) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [phone, setPhone] = useState(data.whatsappNo);
  const [code, setCode] = useState(data.whatsappNoCountryCode || "");
  const [showTip, setShowTip] = useState(false);
  // const [updated, setUpdated] = useState(false);
  const [numberError, setNumberError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [objEqual, setObjEqual] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const formRef = whatsappFormRef || useRef<Formsy>(null);
  const locationtext = location.pathname.includes("/my-preferences")
    ? "save_preferences"
    : location.pathname.includes("/checkout")
    ? "Checkout"
    : "registry_popup";
  const impactRef = useRef<HTMLInputElement>(null);
  const {
    device: { mobile }
  } = useSelector((state: AppState) => state);

  const handleClickOutside = (evt: any) => {
    if (impactRef.current && !impactRef.current.contains(evt.target)) {
      setShowTip(false);
      //Do what you want to handle in the callback
      // this.props.closePopup(evt);
    }
  };

  useEffect(() => {
    setNumberError("");
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (whatsappNoErr) {
      setError(whatsappNoErr);
      setNumberError("");
      setCodeError("");
    }
  }, [whatsappNoErr]);

  useEffect(() => {
    if (!whatsappNoErr && (codeError || numberError)) {
      setError("");
    }
  }, [codeError, numberError]);

  useEffect(() => {
    if (data) {
      setChecked(data.whatsappSubscribe);
      setSubscribe(data.subscribe);
      // if (!data.whatsappSubscribe) {
      //   setUpdated(false);
      // }
      if (data.whatsappNo) {
        setPhone(data.whatsappNo);
      }
      if (data.whatsappNoCountryCode) {
        setCode(data.whatsappNoCountryCode);
      }
    }
  }, [data]);

  const onCheckChange = (e: any) => {
    setChecked(e.target.checked);
    if (!countryData || countryData.length == 0) {
      LoginService.fetchCountryData(dispatch).then(countryData => {
        dispatch(updateCountryData(countryData));
      });
    }
  };

  const onPhoneChange = (e: any) => {
    const value = e.target.value;
    setPhone(value);
    setNumberError("");
    setError("");
  };

  const onCodeChange = (e: any, newValue?: string) => {
    //const value = e.target.value;
    setCode(e?.value);
    setNumberError("");
    setError("");
  };

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
        { data: data, isdList: isdList, closePopup, countryData },
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
    let cloneObjEqual = objEqual;
    if (data) {
      const prefData = data;
      if (
        whatsappSubscribe == prefData.whatsappSubscribe &&
        whatsappNoCountryCode == prefData.whatsappNoCountryCode &&
        whatsappNo == prefData.whatsappNo
      ) {
        cloneObjEqual = true;
        setObjEqual(true);
      } else {
        cloneObjEqual = false;
        setObjEqual(false);
      }
    }
    if (cloneObjEqual || codeError != "" || numberError != "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }

    setError("");
  };

  useEffect(() => {
    if (objEqual || codeError != "" || numberError != "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [objEqual, numberError, codeError]);

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
        dataLayer.push({
          event: "Whatsapp_optin",
          Location: locationtext,
          Checkbox: reqData.whatsappSubscribe
            ? "Whatsapp Opt-in"
            : "Whatsapp Opt-out"
        });
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
            className={cs(styles.text, styles.whatsUpText, {
              [styles.oneline]: oneLineMessage
            })}
          >
            <p className={styles.info}>
              Whatsapp updates will be sent on {data.whatsappNoCountryCode}{" "}
              {data.whatsappNo}.&nbsp;
            </p>
            <p className={styles.cta}>
              <a onClick={openPopup}>Click here</a> to update this number or
              unsubscribe.
            </p>
          </div>
        </div>
      );
    }
  }

  const getCountryCodeObject = () => {
    const arr: any[] = [];
    countryData?.map(({ nameAscii, isdCode }: any) => {
      arr.push({ label: `${nameAscii}(${isdCode})`, value: isdCode });
    });
    return arr;
  };

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
      <div
        className={cs(styles.whatsapp, whatsappClass, styles.whatsappCheckout)}
      >
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
        <div
          className={countryCodeClass}
          style={
            !(checked && showPhone)
              ? { display: "none" }
              : !onlyCheckbox
              ? {}
              : { display: "none" }
          }
        >
          {isdList?.length ? (
            // <CountryCode
            //   name="whatsappNoCountryCode"
            //   placeholder="Code"
            //   label="Country Code"
            //   value={code}
            //   id={uniqueKey}
            //   showLabel={true}
            //   innerRef={codeRef}
            //   validations={{
            //     isCodeValid: (values, value) => {
            //       const bool = !(values.whatsappNo && value == "");
            //       if (!bool) {
            //         setCodeError("Required");
            //         return false;
            //       } else {
            //         setCodeError("");
            //         return true;
            //       }
            //     },
            //     isValidCode: (values, value) => {
            //       let bool = true;

            //       if (value && isdList.length > 0) {
            //         bool = isdList.indexOf(value ? value : "") > -1;
            //       }
            //       if (!bool) {
            //         setCodeError("Enter valid code");
            //       } else {
            //         if (value?.length > 0) {
            //           setCodeError("");
            //         }
            //       }
            //       return bool;
            //     }
            //   }}
            //   validationErrors={{
            //     isCodeValid: "Required",
            //     isValidCode: "Enter valid code"
            //   }}
            //   autocomplete="off"
            //   handleChange={onCodeChange}
            //   hideArrow={true}
            // />
            <SelectDropdown
              name="whatsappNoCountryCode"
              placeholder="Code"
              label="Country Code"
              options={getCountryCodeObject()}
              value={code}
              handleChange={onCodeChange}
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
              allowFilter={true}
              showLabel={true}
              optionsClass={styles.isdCode}
              aquaClass={styles.aquaText}
              searchIconClass={styles.countryCodeSearchIcon}
              searchInputClass={styles.countryCodeSearchInput}
              inputRef={codeRef}
              className={styles.countryCodeWrp}
            />
          ) : null}

          <div className={cs(styles.numberInput, styles.contactNum)}>
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
                    setNumberError("Please enter your Contact Number");
                    return false;
                  } else {
                    setNumberError("");
                    return true;
                  }
                }
              }}
              validationErrors={{
                compulsory: "Please enter your Contact Number"
              }}
              handleChange={onPhoneChange}
              showLabel={true}
              inputRef={phoneRef}
              noErrOnPristine={true}
            />
          </div>
        </div>

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
            <Button
              type="submit"
              label="Save Preferences"
              className={cs(buttonClass)}
              disabled={isDisabled}
              variant="mediumMedCharcoalCta366"
            />
          </div>
        )}
      </div>
      {error && (
        <p className={styles.whatsappNoErr}>
          {" "}
          <span>{error}</span>
        </p>
      )}
    </Formsy>
  );
};

export default WhatsappSubscribe;
