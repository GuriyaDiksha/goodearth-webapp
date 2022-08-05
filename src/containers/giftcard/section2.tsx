import React, { useState, useEffect, useRef } from "react";
import cs from "classnames";
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
import HeaderService from "services/headerFooter";
import Api from "services/api";
import WishlistService from "services/wishlist";
import { AppState } from "reducers/typings";
import { Cookies } from "typings/cookies";
import { MESSAGE } from "constants/messages";
import * as valid from "utils/validate";

const Section2: React.FC<Section2Props> = ({
  productData,
  countryData,
  mobile,
  currency,
  selectedCountry,
  setSelectedCountry,
  next,
  goback,
  setData
}) => {
  const code = currencyCode[currency as Currency];
  const sku = "I00121125";
  const [selectcurrency, setSelectcurrency] = useState(
    countryData[selectedCountry]
  );
  const [countrymsg, setCountrymsg] = useState("");
  const [selectvalue, setSelectvalue] = useState("");
  const [numhighlight, setNumhighlight] = useState(false);
  const [nummsg, setNummsg] = useState("");
  const [errorBorder, setErrorBorder] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const dispatch = useDispatch();
  const GiftSection = React.useRef<Formsy>(null);
  const [country, setCountry] = useState(selectedCountry);
  const { customerGroup } = useSelector((state: AppState) => state.user);
  const { tablet } = useSelector((state: AppState) => state.device);

  const gcValueRef = useRef();

  useEffect(() => {
    const form = GiftSection.current;
    if (form) {
      let newCountry = country;
      if (currency == "INR") {
        newCountry = "India";
      } else if (currency == "GBP") {
        newCountry = "United Kingdom";
      } else if (currency == "AED") {
        newCountry = "United Arab Emirates";
      } else if (currency == "SGD") {
        newCountry = "Singapore";
      } else if (currency == "USD") {
        if (countryData[country] != currency && country) {
          newCountry = "";
        }
      }
      (country || newCountry) &&
        form.updateInputsWithValue({
          country: newCountry
        });
      setCountry(newCountry);
      setSelectcurrency(currency);
      setSelectedCountry(newCountry);
      setCountrymsg("");
      setNummsg("");
      setErrorBorder(false);
    }
    window.scrollTo(0, 0);
  }, [currency]);

  const setValue = (id: string) => {
    const elem = document.getElementById(selectvalue) as HTMLInputElement;
    elem ? (elem.value = "") : "";
    setIsCustom(false);
    setSelectvalue(id);
    setErrorBorder(false);
    setNumhighlight(false);
    setNummsg("");
  };
  const { cookies } = useSelector((state: AppState) => state);

  const reloadPage = (
    cookies: Cookies,
    currency: Currency,
    customerGroup: string
  ) => {
    HeaderService.fetchHeaderDetails(dispatch, currency, customerGroup).catch(
      err => {
        console.log("HEADER API ERROR ==== " + err);
      }
    );
    HeaderService.fetchFooterDetails(dispatch).catch(err => {
      console.log("FOOTER API ERROR ==== " + err);
    });
    Api.getAnnouncement(dispatch).catch(err => {
      console.log("Announcement API ERROR ==== " + err);
    });
    Api.getSalesStatus(dispatch).catch(err => {
      console.log("Sale status API error === " + err);
    });
    Api.getPopups(dispatch).catch(err => {
      console.log("Popups Api ERROR === " + err);
    });
    WishlistService.updateWishlist(dispatch);
    MetaService.updateMeta(dispatch, cookies);
    BasketService.fetchBasket(dispatch);
    valid.showGrowlMessage(dispatch, MESSAGE.CURRENCY_CHANGED_SUCCESS, 7000);
  };

  const changeCurrency = (newCurrency: Currency) => {
    if (currency != newCurrency) {
      const data: any = { currency: newCurrency };
      LoginService.changeCurrency(dispatch, data).then(response => {
        reloadPage(cookies, currency, customerGroup);
      });
    }
  };

  const onCountrySelect = (e: any) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setCountry(country);
    const data: any = { selectedCountry: country };
    setData(data, "amount");
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

    //TODO: To generate data. Can be fetched from an API
    const currencyList = ["INR", "USD", "GBP", "AED", "SGD"];
    const minLimits = ["5,000", "50", "50", "100", "100"];
    const maxLimits = ["5,00,000", "8,000", "5,500", "25,000", "10,000"];

    let limitsList: any = {};
    currencyList.map((curr, i) => {
      const limit = {
        [currencyList[i]]: {
          min: minLimits[i],
          max: maxLimits[i]
        }
      };
      limitsList = Object.assign(limitsList, limit);
    });
    // =======================================================//

    const minString = (currency: string) => {
      return `Sorry, the minimum value of Gift Card is ${String.fromCharCode(
        currencyCode[currency]
      )} ${
        limitsList[currency].min
      }. Please enter a value greater than or equal to ${String.fromCharCode(
        currencyCode[currency]
      )} ${limitsList[currency].min}.`;
    };

    const maxString = (currency: string) => {
      return `Sorry, the maximum value of Gift card is ${String.fromCharCode(
        currencyCode[currency]
      )} ${
        limitsList[currency].max
      }. Please enter a value less than or equal to ${String.fromCharCode(
        currencyCode[currency]
      )} ${limitsList[currency].max}.`;
    };

    if (+value < +limitsList[currency].min.replaceAll(",", "")) {
      status = true;
      msg = minString(currency);
    } else if (+value > +limitsList[currency].max.replaceAll(",", "")) {
      status = true;
      msg = maxString(currency);
    }

    return { sta: status, message: msg };
  };

  const gotoNext = () => {
    const data: any = {};
    if (selectcurrency != "INR" && !selectedCountry) {
      // GiftSection.current?.validateForm();
      const select = document.getElementsByName("country")[0];
      select.scrollIntoView(false);
      return false;
    } else if (isCustom) {
      const element: any = document.getElementById(selectvalue);
      const value = element.value;
      if (value == "") {
        setNummsg(
          "Please enter a value or choose one of the default values from above"
        );
        valid.errorTracking(
          [
            "Please enter a value or choose one of the default values from above"
          ],
          location.href
        );
        return false;
      } else if (currValue(value).sta) {
        setNummsg(currValue(value).message);
        valid.errorTracking([currValue(value).message], location.href);
        return false;
      } else {
        data["productId"] = selectvalue;
        data["customPrice"] = value;
        data["selectedCountry"] = country;
      }
    } else {
      if (selectvalue == "") {
        setNumhighlight(true);
        setNummsg(
          "Please enter a value or choose one of the default values from above"
        );
        valid.errorTracking(
          [
            "Please enter a value or choose one of the default values from above"
          ],
          location.href
        );
        return false;
      } else {
        const element: any = document.getElementById(selectvalue);
        const value = element.getAttribute("data-value");
        data["customPrice"] = value;
        data["productId"] = selectvalue;
        data["selectedCountry"] = country;
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

  const compare = (a: any, b: any) => {
    return (
      parseInt(b.priceRecords[currency]) - parseInt(a.priceRecords[currency])
    );
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
          { [styles.gcNoPad]: mobile || tablet }
        )}
      >
        <div className={cs(bootstrapStyles.row, globalStyles.voffset6)}>
          <div
            className={cs(
              bootstrapStyles.col10,
              { [bootstrapStyles.offset3]: !mobile },
              { [bootstrapStyles.offset1]: mobile },
              globalStyles.textLeft
            )}
          >
            <p
              className={styles.backGc}
              onClick={() => {
                goback("card");
              }}
            >
              {`<`} Back To Design
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
        <Formsy ref={GiftSection}>
          <div>
            <div className={cs(bootstrapStyles.row, styles.nobg)}>
              <div
                className={cs(
                  bootstrapStyles.col10,
                  bootstrapStyles.offset1,
                  bootstrapStyles.colLg4,
                  bootstrapStyles.offsetLg4,
                  globalStyles.textCenter,
                  styles.dropDiv2
                )}
              >
                <div className={styles.selectGroup}>
                  <FormSelect
                    required
                    label=""
                    value={selectedCountry}
                    options={list}
                    handleChange={onCountrySelect}
                    placeholder="Select Country"
                    name="country"
                    validations={{
                      isExisty: true
                    }}
                    validationErrors={{
                      isExisty: "This field is required"
                    }}
                  />
                </div>
                <p className={cs(globalStyles.voffset2, styles.clrNote)}>
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
                {productData.sort(compare).map((pro: any) => {
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
                      {String.fromCharCode(...code) +
                        " " +
                        pro.priceRecords[currency]}
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
                  styles.priceBlock,
                  { [styles.tabPriceBlock]: tablet }
                )}
              >
                <p>(or choose your own value)</p>
                <div
                  className={cs(
                    bootstrapStyles.col10,
                    bootstrapStyles.offset1,
                    bootstrapStyles.colLg2,
                    bootstrapStyles.offsetLg5,
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
                            ref={gcValueRef.current}
                            className={
                              errorBorder ? globalStyles.errorBorder : ""
                            }
                            placeholder="Enter Custom Value"
                            onKeyPress={e => {
                              const invalidChars = ["-", "+", "e"];
                              if (invalidChars.includes(e.key)) {
                                e.preventDefault();
                                return false;
                              } else {
                                setValuetext(e);
                              }
                            }}
                            onPaste={e => {
                              e.preventDefault();
                              return false;
                            }}
                          />
                          <div className={styles.curr}>
                            {" "}
                            {String.fromCharCode(...code)}{" "}
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
                    bootstrapStyles.colLg4,
                    bootstrapStyles.offsetLg4,
                    globalStyles.voffset2
                  )}
                >
                  {numhighlight ? (
                    <p className={cs(styles.errorMsg, globalStyles.textCenter)}>
                      {nummsg}
                    </p>
                  ) : (
                    <p className={styles.errorMsg}></p>
                  )}
                </div>
              </div>
            </div>
            <div
              className={cs(bootstrapStyles.col12, styles.buttonRow, {
                [styles.buttonSticky]: mobile
              })}
            >
              <div className={cs(styles.imageSelectBtnContainer)}>
                <button
                  className={cs(
                    styles.imageSelectBtn,
                    {
                      [styles.section2FullWidth]: mobile
                    },
                    {
                      [styles.errorBtn]: numhighlight
                    }
                  )}
                  onClick={gotoNext}
                >
                  proceed to filling details&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </Formsy>
      </section>
    </div>
  );
};

export default Section2;
