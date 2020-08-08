import React, { useState, useEffect } from "react";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Section2Props } from "./typings";
import Formsy from "formsy-react";
import FormSelect from "../../components/Formsy/FormSelect";
import { Currency, currencyCode } from "typings/currency";
import { useDispatch, useSelector } from "react-redux";
import { refreshPage } from "actions/user";
import LoginService from "services/login";
import MetaService from "services/meta";
import BasketService from "services/basket";
import { AppState } from "reducers/typings";
import { Cookies } from "typings/cookies";
import { showMessage } from "actions/growlMessage";
import { CURRENCY_CHANGED_SUCCESS } from "constants/messages";

const Section2: React.FC<Section2Props> = ({
  productData,
  countryData,
  mobile,
  currency,
  next,
  goback,
  data
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
  const dispatch = useDispatch();
  const RegisterFormRef = React.useRef<Formsy>(null);

  useEffect(() => {
    if (currency == "INR") {
      const form = RegisterFormRef.current;
      form &&
        form.updateInputsWithValue({
          country: "India"
        });
      setSelectcurrency("INR");
    }
  }, []);

  const setValue = (id: string) => {
    const elem = document.getElementById(selectvalue) as HTMLInputElement;
    elem ? (elem.value = "") : "";
    setIsCustom(false);
    setSelectvalue(id);
    setErrorBorder(false);
    setNumhighlight(false);
  };
  const { cookies } = useSelector((state: AppState) => state);

  const reloadPage = (cookies: Cookies) => {
    MetaService.updateMeta(dispatch, cookies);
    BasketService.fetchBasket(dispatch);
    dispatch(showMessage(CURRENCY_CHANGED_SUCCESS, 7000));
  };

  const changeCurrency = (newCurrency: Currency) => {
    if (currency != newCurrency) {
      const data: any = { currency: newCurrency };
      LoginService.changeCurrency(dispatch, data).then(response => {
        reloadPage(cookies);
      });
    }
  };

  const onCountrySelect = (e: any) => {
    const country = e.target.value;
    const newCurrency = countryData[country];
    if (currency != newCurrency) {
      dispatch(refreshPage(undefined));
      changeCurrency(newCurrency);
    } else {
      setCountrymsg("");
      setSelectcurrency(newCurrency);
    }
  };

  const setValuetext = (e: any) => {
    setIsCustom(true);
    setNumhighlight(true);
    setErrorBorder(true);
    setSelectvalue(e.target.id);
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
      return false;
    } else if (isCustom) {
      const element: any = document.getElementById(selectvalue);
      const value = element.value;
      if (value == "") {
        setNummsg(
          "Please enter a value or choose one of the default values listed above"
        );
        return false;
      } else if (currValue(value).sta) {
        setNummsg(currValue(value).message);
        return false;
      } else {
        data["productId"] = selectvalue;
        data["customPrice"] = value;
      }
    } else {
      if (selectvalue == "") {
        setNumhighlight(true);
        setNummsg(
          "Please enter a value or choose one of the default values listed above"
        );
        return false;
      } else {
        const element: any = document.getElementById(selectvalue);
        const value = element.getAttribute("data-value");
        data["customPrice"] = value;
        data["productId"] = selectvalue;
      }
    }
    next(data, "form");
    // document.cookie = "giftcard_image=" + this.state.giftimages[this.state.selectindex] + "; expires=Sun, 15 Jul 2020 00:00:01 UTC; path=/";
    // this.props.next(this.state.giftimages[this.state.selectindex]);
  };

  const list = Object.keys(countryData).map(key => {
    return {
      label: key,
      value: key
      // currency: countryData[key]
    };
  });

  return (
    <div className={bootstrapStyles.row}>
      <section className={cs(globalStyles.paddTop60, styles.gc)}>
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
                goback("card");
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
                bootstrapStyles.colMd4,
                bootstrapStyles.offsetMd4,
                globalStyles.textCenter,
                styles.dropDiv2
              )}
            >
              <div className={styles.selectGroup}>
                <FormSelect
                  required
                  label=""
                  options={list}
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
                recipient&apos;s address
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
                  key={pro.sku}
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
                    <div key={sku}>
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
              <span>PROCEED TO FILLING DETAILS</span>
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
