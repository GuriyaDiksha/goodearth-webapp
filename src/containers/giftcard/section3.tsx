import React, { useState, useEffect } from "react";
import cs from "classnames";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Section3Props } from "./typings";
import { useSelector } from "react-redux";
import Formsy from "formsy-react";
import FormInput from "../../components/Formsy/FormInput";
import FormTextArea from "components/Formsy/FormTextArea";
import { AppState } from "reducers/typings";
// import { Currency, currencyCode } from "typings/currency";
import { getErrorList, errorTracking } from "utils/validate";

const Section3: React.FC<Section3Props> = ({ next, data, goback, mobile }) => {
  const RegisterFormRef = React.useRef<Formsy>(null);
  const emailInput = React.useRef<HTMLInputElement>(null);
  const lastNameInput = React.useRef<HTMLInputElement>(null);
  const { tablet } = useSelector((state: AppState) => state.device);
  const [textarea, setTextarea] = useState("");
  const englishandSpace = /^[a-zA-Z\s]+$/;
  // const [ehighlight, setEhighlight] = useState(false);
  // const [emsg, setEmsg] = useState("");
  const [isErr, setIsErr] = useState(false);

  const gotoNext = () => {
    // document.cookie = "giftcard_image=" + this.state.giftimages[this.state.selectindex] + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    RegisterFormRef.current?.submit();
  };

  // const myBlurText = (event: any) => {
  //   if (event.target.value != "") {
  //     if (textarea.length <= 120) {
  //       setTextarea(event.target.value.slice(0, 120));
  //       setEhighlight(false);
  //       setEmsg("");
  //     }
  //   } else {
  //     setEmsg("Please Enter Message");
  //     setEhighlight(true);
  //   }
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
    setTextarea(data["message"] || "");
  }, []);

  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    const {
      recipientEmail,
      recipientEmailConfirm,
      recipientName,
      senderName,
      message
    } = model;
    const data: any = {};
    // if (textarea == "") {
    // setEmsg("Please Enter Message");
    // setEhighlight(true);
    // return false;
    // }
    data["recipientEmail"] = recipientEmail;
    data["recipientEmailConfirm"] = recipientEmailConfirm;
    data["recipientName"] = recipientName;
    data["senderName"] = senderName;
    data["message"] = message.trim();
    next(data, "preview");
  };

  const handleInvalidSubmit = () => {
    setTimeout(() => {
      const firstErrorField = document.getElementsByClassName(
        globalStyles.errorBorder
      )[0] as HTMLInputElement | HTMLSelectElement;
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      // for error Tracking
      const errorList = getErrorList(
        globalStyles.errorMsg,
        "giftcard-section3-form"
      );
      if (errorList && errorList.length) {
        errorTracking(errorList, location.href);
      }
    }, 0);
  };

  return (
    <div className={bootstrapStyles.row}>
      <section
        className={cs(
          globalStyles.paddTop60,
          styles.gc,
          bootstrapStyles.col12,
          {
            [styles.gcMobile]: mobile
          },
          { [styles.gcNoPad]: mobile }
        )}
      >
        <div
          className={cs(
            bootstrapStyles.col12,
            bootstrapStyles.colLg4,
            bootstrapStyles.offsetLg4,
            globalStyles.textCenter
          )}
        >
          <div className={cs(bootstrapStyles.row)}>
            <div className={cs(bootstrapStyles.col10, globalStyles.textLeft)}>
              <p
                className={styles.backGc}
                onClick={() => {
                  goback("amount");
                }}
              >
                {`<`}Back To Value
              </p>
            </div>
          </div>
        </div>
        <div className={cs(bootstrapStyles.row, styles.nobg, styles.loginForm)}>
          <Formsy
            ref={RegisterFormRef}
            onValidSubmit={handleSubmit}
            onInvalidSubmit={handleInvalidSubmit}
            onValid={() => {
              setIsErr(false);
            }}
            onInvalid={() => {
              setIsErr(true);
            }}
          >
            <div
              className={cs(
                bootstrapStyles.col12,
                bootstrapStyles.colLg4,
                bootstrapStyles.offsetLg4,
                globalStyles.textCenter,
                styles.formBg
              )}
            >
              <div className={styles.categorylabel} id="giftcard-section3-form">
                <p className={styles.gcHead}> 3. Fill in the details</p>
                <div>
                  <FormInput
                    name="recipientName"
                    placeholder={"Recipient's Name"}
                    label={"Recipient's Name *"}
                    value={data["recipientName"]}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={lastNameInput}
                    validations={{
                      isEnglish: (values, value) => {
                        if (value) {
                          const bool = englishandSpace.test(value);
                          return bool;
                        } else return true;
                      }
                    }}
                    validationErrors={{
                      isEnglish: "Please enter only alphabetic characters"
                    }}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    name="recipientEmail"
                    placeholder={"Recipient's Email"}
                    label={"Recipient's Email *"}
                    value={data["recipientEmail"]}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={emailInput}
                    validations={{
                      isEmail: true,
                      maxLength: 75
                    }}
                    validationErrors={{
                      isEmail: "Please enter a valid Email ID",
                      maxLength:
                        "You are allowed to enter upto 75 characters only"
                    }}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    name="recipientEmailConfirm"
                    placeholder={"Confirm Recipient's Email"}
                    label={"Confirm Recipient's Email *"}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={emailInput}
                    value={data["recipientEmail"]}
                    isDrop={true}
                    isPaste={true}
                    validations={{
                      isEmail: true,
                      maxLength: 75,
                      equalsField: "recipientEmail"
                    }}
                    validationErrors={{
                      isEmail: "Please enter a valid Email ID",
                      maxLength:
                        "You are allowed to enter upto 75 characters only",
                      equalsField: "The entered Email ID does not match"
                    }}
                    required
                  />
                </div>
                <div>
                  <FormTextArea
                    placeholder=""
                    maxLength={250}
                    name="message"
                    rows={5}
                    value={data["message"]}
                    id="sender_msg"
                    handleChange={e => {
                      setTextarea(e.currentTarget.value);
                    }}
                    required
                    validations={{
                      isEmpty: (values, value) => {
                        return value?.trim() ? true : false;
                      }
                    }}
                    validationErrors={{
                      isEmpty: "Please enter your message"
                    }}
                    // value={textarea}
                    // className={ehighlight ? "error-border" : ""}
                  ></FormTextArea>
                  <div className={cs(globalStyles.textLeft, styles.limit)}>
                    Character Limit:{" "}
                    {250 - (textarea.trim() == "" ? 0 : textarea.length)} / 250
                  </div>
                  {/* {emsg ? (
                    <p className={globalStyles.errorMsg}>
                      Please enter message
                    </p>
                  ) : (
                    <p className={globalStyles.errorMsg}></p>
                  )} */}
                </div>
                <div style={{ paddingTop: "10px" }}>
                  <FormInput
                    name="senderName"
                    placeholder={"Sender's Name"}
                    label={"Sender's Name *"}
                    value={data["senderName"]}
                    // className={showFieldsClass}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={lastNameInput}
                    validations={{
                      isEnglish: (values, value) => {
                        if (value) {
                          return englishandSpace.test(value);
                        } else return true;
                      }
                    }}
                    validationErrors={{
                      isEnglish: "Please enter only alphabetic characters"
                    }}
                    required
                  />
                </div>
                {tablet && (
                  <div className={cs(bootstrapStyles.col12, styles.buttonRow)}>
                    <div className={cs(styles.imageSelectBtnContainer)}>
                      <button
                        className={cs(styles.imageSelectBtn, {
                          [styles.errorBtn]: isErr
                        })}
                        onClick={gotoNext}
                      >
                        Confirm & Preview
                        Card&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span></span>
                      </button>
                    </div>
                  </div>
                )}
                {!mobile && (
                  <div className={cs(bootstrapStyles.col12, styles.buttonRow)}>
                    <div className={cs(styles.imageSelectBtnContainer)}>
                      <button
                        className={cs(styles.imageSelectBtn, {
                          [styles.errorBtn]: isErr
                        })}
                        onClick={gotoNext}
                      >
                        Confirm & Preview
                        Card&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span></span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Formsy>
          {mobile && !tablet && (
            <div
              className={cs(
                bootstrapStyles.col12,
                styles.buttonRow,
                {
                  [styles.buttonSticky]: mobile && !tablet
                },
                {
                  [styles.section3ButtonPositioningFix]: mobile && !tablet
                }
              )}
            >
              <div className={cs(styles.imageSelectBtnContainer)}>
                <button
                  className={cs(
                    styles.imageSelectBtn,
                    {
                      [styles.section2FullWidth]: mobile && !tablet
                    },
                    {
                      [styles.errorBtn]: isErr
                    }
                  )}
                  onClick={gotoNext}
                >
                  Confirm & Preview Card&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span></span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Section3;
