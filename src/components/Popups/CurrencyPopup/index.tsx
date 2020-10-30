import React, { useContext, useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import whitelogo from "images/gelogoWhite.svg";
import desktopImg from "images/desktopImg.jpg";
import "styles/autosuggest.css";
import LoginService from "services/login";
// import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context.ts";
import { AppState } from "reducers/typings";
import Autosuggest from "react-autosuggest";
import CookieService from "services/cookie";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useHistory } from "react-router";
type PopupProps = {};
const CurrencyPopup: React.FC<PopupProps> = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currencyList = useSelector(
    (state: AppState) => state.info.currencyList
  );
  const currency = useSelector((state: AppState) => state.currency);
  const curryList = currencyList.map(data => {
    return data.currencyCode;
  });
  const [suggestions, setSuggestions] = useState<any[]>(currencyList);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const { closeModal } = useContext(Context);

  useEffect(() => {
    currencyList.map((suggestion: any) => {
      if (suggestion.currencyCode == currency) {
        setSelectedCurrency(suggestion.currencyCode);
        setInputValue(
          `${suggestion.countryName} (${suggestion.currencyCode} ${suggestion.currencySymbol})`
        );
      }
    });
  }, []);

  const getSuggestions = (value: string) => {
    const inputLength = value?.length || 0;
    return inputLength === 0
      ? currencyList
      : currencyList.filter(data => {
          const text = `${data.countryName} (${data.currencyCode} ${data.currencySymbol})`;
          return text.indexOf(value.toUpperCase()) > -1;
        });
  };

  const onChangeCurrency = () => {
    if (
      currency != selectedCurrency &&
      curryList.indexOf(selectedCurrency) > -1
    ) {
      const data: any = {
        currency: selectedCurrency
      };
      LoginService.changeCurrency(dispatch, data).then(() => {
        history.push("/");
      });
      const cookieString =
        "currencypopup=true; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
      document.cookie = cookieString;
      CookieService.setCookie("currencypopup", "true", 365);
      closeModal();
    } else if (selectedCurrency == currency) {
      const cookieString =
        "currencypopup=true; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
      document.cookie = cookieString;
      CookieService.setCookie("currencypopup", "true", 365);
      closeModal();
    } else {
      setErrorMessage("please select correct currency");
    }
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  //   const currency = useSelector((state: AppState) => state.currency);
  const renderSuggestion = (data: any) => {
    return (
      <div>
        <span>{data.countryName}</span>
        <span>({data.currencyCode + " " + data.currencySymbol})</span>
      </div>
    );
  };

  const getSuggestionValue = (suggestion: any) => {
    return `${suggestion.countryName} (${suggestion.currencyCode} ${suggestion.currencySymbol})`;
  };

  const onSuggestionSelected = (
    event: any,
    { suggestion, suggestionValue }: { suggestion: any; suggestionValue: any }
  ) => {
    setSelectedCurrency(suggestion.currencyCode);
  };

  const onChange = (event: any, { newValue }: { newValue: string }) => {
    setInputValue(newValue);
    setSelectedCurrency(newValue);
    event.stopPropagation();
  };

  const inputProps = {
    placeholder: "Select Your Currency",
    value: inputValue,
    onChange: onChange,
    disabled: false,
    autoComplete: "new-password",
    className: "currencylist"
  };

  const shouldRenderSuggestions = () => {
    return true;
  };

  return (
    <div>
      <div
        className={cs(
          styles.introPage,
          globalStyles.textCenter,
          styles.introTransition
        )}
      >
        <img src={desktopImg} className={globalStyles.imgResponsive} />
        <div className={styles.content}>
          <div className={globalStyles.textCenter}>
            <img src={whitelogo} className={styles.logoWhite} />
          </div>
          <ul className={cs(styles.introlist)}>
            {/* {this.createCategory()} */}
            <li>Welcome to Good Earth</li>
          </ul>
          <ul className={styles.subHeading}>
            Please select a location to continue
          </ul>
          <ul>
            <div className={styles.suggestDropdown}>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={() => setSuggestions([])}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                onSuggestionSelected={onSuggestionSelected}
                shouldRenderSuggestions={shouldRenderSuggestions}
                inputProps={inputProps}
                id={"currencyid"}
              />
              {/* <label
                        className={cs({
                        [globalStyles.hidden]: false
                        })}
                    >
                        {'hello'}
                    </label> */}
              {errorMessage && (
                <p
                  className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}
                >
                  {errorMessage}
                </p>
              )}
            </div>
          </ul>
          <div className={styles.discover}>
            <input
              type="button"
              className={globalStyles.ceriseBtn}
              value="SHOP"
              onClick={() => {
                onChangeCurrency();
              }}
            />
          </div>
        </div>
        <div className={cs(styles.textSkip, styles.categorylabel)}>
          {/* <ul>
                        <li className="subscribe">
                            <input type="checkbox" id="subscribe" value="on" checked={this.state.ischecked}
                                   onChange={this.saveIntropage.bind(this)}/>
                            <label htmlFor="subscribe">
                                Skip this next time </label></li>
                        <li className="pull-right"><img
                            src={this.state.muted?"/static/img/icons_mute.svg":"/static/img/icons_no_mute.svg"}
                            width="50" onClick={this.soundToggle}/></li>
                    </ul> */}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default CurrencyPopup;
