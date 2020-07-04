import React, { useState } from "react";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Section2Props } from "./typings";
import Formsy from "formsy-react";
import FormInput from "../../components/Formsy/FormInput";
// import { Currency, currencyCode } from "typings/currency";
const Section3: React.FC<Section2Props> = ({
  productData,
  countryData,
  mobile,
  currency
}) => {
  // const emailRef = React.useRef<typeof FormInput>(null);
  const RegisterFormRef = React.useRef<Formsy>(null);
  const emailInput = React.useRef<HTMLInputElement>(null);
  // const subscribeRef = React.useRef<HTMLInputElement>(null);
  // const firstNameInput = React.useRef<HTMLInputElement>(null);
  const lastNameInput = React.useRef<HTMLInputElement>(null);
  // const sku = 'I00121125';
  // const [selectcurrency, setSelectcurrency] = useState('');
  const [textarea, setTextarea] = useState("");
  // const [selectvalue, setSelectvalue] = useState('');
  const [ehighlight, setEhighlight] = useState(false);
  const [emsg, setEmsg] = useState("");
  // const [errorBorder, setErrorBorder] = useState(false);
  // const [isCustom, setIsCustom] = useState(false);

  const gotoNext = () => {
    // document.cookie = "giftcard_image=" + this.state.giftimages[this.state.selectindex] + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    // this.props.next(this.state.giftimages[this.state.selectindex]);
  };

  const goback = () => {
    return true;
  };

  const myBlurText = (event: any) => {
    if (event.target.value != "") {
      if (textarea.length <= 120) {
        setTextarea(event.target.value.slice(0, 120));
        setEhighlight(false);
        setEmsg("");
      }
    } else {
      setEmsg("Please Enter Message");
      setEhighlight(true);
    }
  };

  return (
    <div className={bootstrapStyles.row}>
      <section className={cs(globalStyles.paddTop60, styles.gc)}>
        <div className={cs(bootstrapStyles.row, globalStyles.voffset8)}>
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
                goback();
              }}
            >
              Back To Design
            </p>
          </div>
        </div>
        <div className={bootstrapStyles.row}>
          <div
            className={cs(
              bootstrapStyles.col10,
              bootstrapStyles.offset1,
              globalStyles.textCenter,
              globalStyles.paddTop40
            )}
          >
            <div className={styles.gcHead}>
              {" "}
              2. Choose a shipping destination & value
            </div>
          </div>
        </div>
        <div className={cs(bootstrapStyles.row, styles.nobg)}>
          <Formsy ref={RegisterFormRef}>
            <div
              className={cs(
                bootstrapStyles.col10,
                bootstrapStyles.offset1,
                bootstrapStyles.colMd6,
                bootstrapStyles.offsetMd7,
                globalStyles.textCenter,
                styles.dropDiv2
              )}
            >
              <div className={styles.categorylabel}>
                <div>
                  <FormInput
                    name="firstName"
                    placeholder={"First Name*"}
                    label={"First Name*"}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={lastNameInput}
                    required
                  />
                </div>
                <div>
                  <FormInput
                    name="email"
                    placeholder={"Email*"}
                    label={"Email*"}
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
                    name="email1"
                    placeholder={"Email*"}
                    label={"Email*"}
                    keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
                    inputRef={emailInput}
                    validations={{
                      isEmail: true,
                      maxLength: 75,
                      equalsField: "email"
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
                  <textarea
                    data-rows="5"
                    id="sender_msg"
                    onChange={e => {
                      myBlurText(e);
                    }}
                    value={textarea}
                    className={ehighlight ? "error-border" : ""}
                  ></textarea>
                  <div>Character Limit: {120 - textarea.length}</div>
                  {emsg ? (
                    <p className={globalStyles.errorMsg}>
                      Please enter message
                    </p>
                  ) : (
                    <p className={globalStyles.errorMsg}></p>
                  )}
                </div>
                <div>
                  <FormInput
                    name="lastName"
                    placeholder={"Last Name*"}
                    label={"Last Name*"}
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
                bootstrapStyles.row,
                bootstrapStyles.col12,
                globalStyles.textCenter,
                globalStyles.voffset6
              )}
            >
              <div className={bootstrapStyles.col12}>
                <div
                  className={cs(styles.bannerBtnLink, iconStyles.icon)}
                  onClick={() => {
                    gotoNext();
                  }}
                >
                  <span>
                    <input type="submit" value="choose value" />
                  </span>
                </div>
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
