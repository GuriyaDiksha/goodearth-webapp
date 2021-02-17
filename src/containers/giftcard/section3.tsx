import React, { useState, useEffect } from "react";
import cs from "classnames";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Section3Props } from "./typings";
import Formsy from "formsy-react";
import FormInput from "../../components/Formsy/FormInput";
import FormTextArea from "components/Formsy/FormTextArea";
// import { Currency, currencyCode } from "typings/currency";
import * as valid from "utils/validate";
import Button from "./button";

const Section3: React.FC<Section3Props> = ({ next, data, goback, mobile }) => {
  const RegisterFormRef = React.useRef<Formsy>(null);
  const emailInput = React.useRef<HTMLInputElement>(null);
  const lastNameInput = React.useRef<HTMLInputElement>(null);
  const [textarea, setTextarea] = useState("");
  const englishandSpace = /^[a-zA-Z\s]+$/;
  // const [ehighlight, setEhighlight] = useState(false);
  // const [emsg, setEmsg] = useState("");

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
      const errorList = valid.getErrorList(
        globalStyles.errorMsg,
        "giftcard-section3-form"
      );
      if (errorList && errorList.length) {
        valid.errorTracking(errorList, location.href);
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
          }
        )}
      >
        <div className={cs(bootstrapStyles.row, globalStyles.voffset6)}>
          <div
            className={cs(
              bootstrapStyles.col10,
              bootstrapStyles.offset1,
              globalStyles.textCenter
            )}
          >
            <i className={styles.arrowUp}></i>
            <p
              className={styles.backGc}
              onClick={() => {
                goback("amount");
              }}
            >
              Back To Value
            </p>
          </div>
        </div>
        <div className={bootstrapStyles.row}></div>
        <div className={cs(bootstrapStyles.row, styles.nobg, styles.loginForm)}>
          <Formsy
            ref={RegisterFormRef}
            onValidSubmit={handleSubmit}
            onInvalidSubmit={handleInvalidSubmit}
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
                    label={"Name"}
                    value={data["recipientName"]}
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
                      isEnglish: "Only alphabets are allowed"
                    }}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    name="recipientEmail"
                    placeholder={"Recipient's Email"}
                    label={"Email"}
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
                    label={"Confirm Email"}
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
                      equalsField: "The Email ID entered doesn't match"
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
                  <div className={globalStyles.textLeft}>
                    Character Limit:{" "}
                    {250 - (textarea.trim() == "" ? 0 : textarea.length)}
                  </div>
                  {/* {emsg ? (
                    <p className={globalStyles.errorMsg}>
                      Please enter message
                    </p>
                  ) : (
                    <p className={globalStyles.errorMsg}></p>
                  )} */}
                </div>
                <div>
                  <FormInput
                    name="senderName"
                    placeholder={"Sender's Name"}
                    label={"Sender's Name"}
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
                      isEnglish: "Only alphabets are allowed"
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            <div
              className={cs(
                bootstrapStyles.col12,
                bootstrapStyles.colLg4,
                bootstrapStyles.offsetLg4,
                globalStyles.textCenter,
                styles.buttonBg
              )}
            >
              <Button value="" onClick={gotoNext}>
                <input
                  type="submit"
                  className={styles.inputButton}
                  value="proceed to preview card"
                />
              </Button>
            </div>
            <div
              className={cs(
                bootstrapStyles.row,
                bootstrapStyles.col12,
                globalStyles.textCenter,
                globalStyles.voffset4
              )}
            >
              <div className={bootstrapStyles.col12}>
                <i className={styles.arrowDown}></i>
              </div>
            </div>
          </Formsy>
        </div>
      </section>
    </div>
  );
};

export default Section3;
