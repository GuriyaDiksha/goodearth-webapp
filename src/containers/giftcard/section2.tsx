import React, { useState } from "react";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Section2Props } from "./typings";
import Formsy from "formsy-react";
import FormSelect from "../../components/Formsy/FormSelect";
import { Currency, currencyCode } from "typings/currency";
const Section2: React.FC<Section2Props> = ({
  productData,
  countryData,
  mobile,
  currency
}) => {
  const code = currencyCode[currency as Currency];
  const sku = "I00121125";
  const [selectcurrency, setSelectcurrency] = useState("");
  const [countrymsg, setCountrymsg] = useState("");
  const [selectvalue, setSelectvalue] = useState("");
  const [numhighlight, setNumhighlight] = useState(false);
  const [nummsg, setNummsg] = useState("");
  const [errorBorder, setErrorBorder] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  const goback = () => {
    return true;
  };

  const setValue = (id: string) => {
    setIsCustom(false);
    setSelectvalue(id);
  };

  const onCountrySelect = (e: any) => {
    if (currency != e.target.value) {
      // setSelectcurrency(e.target.value);
    } else {
      setCountrymsg("");
      setSelectcurrency(e.target.value);
    }
  };

  const setValuetext = (e: any) => {
    setIsCustom(true);
    setNumhighlight(true);
    setErrorBorder(true);
    setSelectvalue(e.target.id);
    // this.setState({
    //     selectvalue: event.target.id,
    //     isCustom: true,
    //     num_highlight: false,
    //     errorBorder: true
    // })
  };

  const currValue = (value: string | number) => {
    let status = false;
    let msg = "";
    switch (currency) {
      case "INR":
        if (+value < 5000) {
          status = true;
          msg =
            "Sorry, the minimum value E-Gift card is 5000. Please enter a custom value greater than or equal to that.";
        } else if (+value > 500000) {
          status = true;
          msg =
            "Sorry, the maximum value E-Gift card is 5,00,000. Please enter a custom value less than or equal to that.";
        }
        break;
      case "USD":
      case "GBP":
        if (+value < 50) {
          status = true;
          msg =
            "Sorry, the minimum value E-Gift card is 50. Please enter a custom value greater than or equal to that.";
        }
        break;
    }
    return { sta: status, message: msg };
  };

  const gotoNext = () => {
    const data: any = {};
    if (!selectcurrency) {
      setCountrymsg(
        "Please choose the country you would like to ship this gift card to"
      );
      const select = document.getElementsByName("country")[0];
      select.scrollIntoView(false);
    } else if (isCustom) {
      const element: any = document.getElementById(selectvalue);
      const value = element.value;
      if (value == "") {
        setCountrymsg(
          "Please enter a value or choose one of the default values listed above"
        );
      } else if (currValue(value).sta) {
        setNummsg(currValue(value).message);
      } else {
        data["id"] = selectvalue;
        data["value"] = value;
      }
    } else {
      if (selectvalue == "") {
        setCountrymsg(
          "Please enter a value or choose one of the default values listed above"
        );
        return false;
      } else {
        data["id"] = selectvalue;
      }
    }

    // document.cookie = "giftcard_image=" + this.state.giftimages[this.state.selectindex] + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    // this.props.next(this.state.giftimages[this.state.selectindex]);
  };

  const list = Object.keys(countryData).map(key => {
    return {
      label: key,
      value: countryData[key]
    };
  });

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
          <Formsy>
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
              <div className={styles.selectGroup}>
                <FormSelect
                  required
                  label="Country"
                  options={list}
                  // value={props.country_name}
                  handleChange={onCountrySelect}
                  placeholder="Select Country"
                  name="country"
                  validations={{
                    isExisty: true
                  }}
                  validationErrors={{
                    isExisty: "This field is required",
                    isEmptyString: "This field is required"
                  }}
                />
                <span className={styles.arrow}></span>
              </div>
              <p className={cs(globalStyles.voffset2, styles.clrP)}>
                Please note: Gift cards can only be redeemed in the currency
                they are bought in, so please choose the country based on your
                recipient`&aposs` address
              </p>
              {countrymsg ? (
                <p className={globalStyles.errorMsg}>{countrymsg}</p>
              ) : (
                <p className={globalStyles.errorMsg}></p>
              )}
            </div>
          </Formsy>
        </div>
        <div className={cs(bootstrapStyles.row, globalStyles.voffset4)}>
          <div
            className={cs(
              bootstrapStyles.col10,
              bootstrapStyles.offset1,
              globalStyles.textCenter,
              styles.priceBlock
            )}
          >
            {productData.map((pro: any) => {
              return pro.sku != sku ? (
                <span
                  onClick={() => {
                    setValue(pro.id);
                  }}
                  data-value={pro.priceRecords[currency]}
                  className={selectvalue == pro.id ? styles.valueHover : ""}
                  id={pro.id}
                >
                  {String.fromCharCode(code) + " " + pro.priceRecords[currency]}
                </span>
              ) : (
                ""
              );
            })}
          </div>
        </div>
        <div className={cs(bootstrapStyles.row, globalStyles.voffset5)}>
          <div
            className={cs(
              bootstrapStyles.col10,
              bootstrapStyles.offset1,
              globalStyles.textCenter,
              styles.priceBlock
            )}
          >
            <p>(or choose your own value)</p>
            <div
              className={cs(
                bootstrapStyles.col10,
                bootstrapStyles.offset1,
                bootstrapStyles.colMd2,
                bootstrapStyles.offsetMd5,
                globalStyles.voffset3
              )}
            >
              <form>
                {productData.map((pro: any) => {
                  return pro.sku == sku ? (
                    <div>
                      <input
                        type="number"
                        id={pro.id}
                        className={errorBorder ? globalStyles.errorBorder : ""}
                        placeholder="enter value"
                        onClick={e => {
                          setValuetext(e);
                        }}
                        onKeyUp={e => {
                          setValuetext(e);
                        }}
                      />
                      <div className={styles.curr}>
                        {" "}
                        {String.fromCharCode(code)}{" "}
                      </div>
                    </div>
                  ) : (
                    ""
                  );
                })}
              </form>
            </div>
            <div
              className={cs(
                bootstrapStyles.col10,
                bootstrapStyles.offset1,
                bootstrapStyles.colMd4,
                bootstrapStyles.offsetMd4,
                globalStyles.voffset2
              )}
            >
              {numhighlight ? (
                <p
                  className={cs(globalStyles.errorMsg, globalStyles.textCenter)}
                >
                  {nummsg}
                </p>
              ) : (
                <p className={globalStyles.errorMsg}></p>
              )}
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
              <span>choose value</span>
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
      </section>
    </div>
  );
};

export default Section2;
