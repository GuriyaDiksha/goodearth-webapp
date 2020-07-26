import React, { useState, useEffect } from "react";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Section3Props } from "./typings";
import Formsy from "formsy-react";
import FormInput from "../../components/Formsy/FormInput";
import FormTextArea from "components/Formsy/FormTextArea";
// import { Currency, currencyCode } from "typings/currency";
const Section3: React.FC<Section3Props> = ({ next, data, goback }) => {
  const RegisterFormRef = React.useRef<Formsy>(null);
  const emailInput = React.useRef<HTMLInputElement>(null);
  const lastNameInput = React.useRef<HTMLInputElement>(null);
  const [textarea, setTextarea] = useState("");
  // const [ehighlight, setEhighlight] = useState(false);
  // const [emsg, setEmsg] = useState("");

  const gotoNext = () => {
    // document.cookie = "giftcard_image=" + this.state.giftimages[this.state.selectindex] + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    RegisterFormRef.current?.submit();
  };

  useEffect(() => {
    if (data.recipientEmail) {
      const form = RegisterFormRef.current;
      form &&
        form.updateInputsWithValue({
          firstName: data.recipientName,
          email: data.recipientEmail,
          email1: data.recipientEmail,
          senderName: data.senderName
        });
      setTextarea(data.message);
    }
  });
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
    data["email"] = recipientEmail;
    data["email1"] = recipientEmailConfirm;
    data["firtName"] = recipientName;
    data["senderName"] = senderName;
    data["message"] = message;
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
    }, 0);
  };

  return (
    <div className={bootstrapStyles.row}>
      <section className={cs(globalStyles.paddTop60, styles.gc)}>
        <div className={cs(bootstrapStyles.row)}>
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
                bootstrapStyles.colMd4,
                bootstrapStyles.offsetMd4,
                globalStyles.textCenter,
                styles.formBg
              )}
            >
              <div className={styles.categorylabel}>
                <p className={styles.gcHead}> 3. Fill in the details</p>
                <div>
                  <FormInput
                    name="recipientName"
                    placeholder={"Recipient's Name"}
                    label={"Name"}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={lastNameInput}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    name="recipientEmail"
                    placeholder={"Recipient's Email"}
                    label={"Email"}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={emailInput}
                    validations={{
                      isEmail: true,
                      maxLength: 75
                    }}
                    validationErrors={{
                      isEmail: "Enter valid email",
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
                    label={"Email"}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={emailInput}
                    validations={{
                      isEmail: true,
                      maxLength: 75,
                      equalsField: "recipientEmail"
                    }}
                    validationErrors={{
                      isEmail: "Enter valid email",
                      maxLength:
                        "You are allowed to enter upto 75 characters only",
                      equalsField: "Email do not match"
                    }}
                    required
                  />
                </div>
                <div>
                  <FormTextArea
                    placeholder=""
                    name="message"
                    rows={5}
                    id="sender_msg"
                    // onChange={e => {
                    //   myBlurText(e);
                    // }}
                    required
                    value={textarea}
                    // className={ehighlight ? "error-border" : ""}
                  ></FormTextArea>
                  <div>Character Limit: {120 - textarea.length}</div>
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
                    // className={showFieldsClass}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={lastNameInput}
                    required
                  />
                </div>
              </div>
            </div>

            <div
              className={cs(
                bootstrapStyles.col12,
                bootstrapStyles.colMd4,
                bootstrapStyles.offsetMd4,
                globalStyles.textCenter,
                styles.buttonBg
              )}
            >
              <div
                className={cs(styles.bannerBtnLink, iconStyles.icon)}
                onClick={() => {
                  gotoNext();
                }}
              >
                <p>
                  <input
                    type="submit"
                    className={styles.inputButton}
                    value="proceed to preview card"
                  />
                </p>
              </div>
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
