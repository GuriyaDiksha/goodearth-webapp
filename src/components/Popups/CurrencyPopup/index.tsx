import React, { useContext, useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import whitelogo from "images/gelogoWhite.svg";
import desktopImg from "images/desktopImg.jpg";
import mobileImg from "images/mobileImg.jpg";
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
import { updateMakerReloadToggle } from "actions/info";
type PopupProps = {};
const CurrencyPopup: React.FC<PopupProps> = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currencyList = useSelector(
    (state: AppState) => state.info.currencyList
  );
  const {
    currency,
    device: { mobile },
    info: { makerReloadToggle }
  } = useSelector((state: AppState) => state);
  const curryList = currencyList.map(data => {
    return data.currencyCode;
  });
  const [suggestions, setSuggestions] = useState<any[]>(currencyList);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [tempValue, setTempValue] = useState("");
  const { closeModal } = useContext(Context);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    currencyList.map((suggestion: any) => {
      if (suggestion.currencyCode == currency) {
        setSelectedCurrency(suggestion.currencyCode);
        setInputValue(
          `${suggestion.countryName} (${suggestion.currencyCode} ${suggestion.currencySymbol})`
        );
      }
    });
  }, [currency]);

  const getSuggestions = (value: string) => {
    const inputLength = value?.length || 0;
    return inputLength === 0 || focused ? currencyList : currencyList;
    // : currencyList.filter(data => {
    //     const text = `${data.countryName} (${data.currencyCode} ${data.currencySymbol})`;
    //     return text.indexOf(value.toUpperCase()) > -1;
    //   });
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
        CookieService.setCookie("currencypopup", "true", 365);
        closeModal();
      });
    } else if (selectedCurrency == currency) {
      CookieService.setCookie("currency", selectedCurrency);
      CookieService.setCookie("currencypopup", "true", 365);
      const makerToggle = !makerReloadToggle;
      dispatch(updateMakerReloadToggle(makerToggle));
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
      <div className={styles.flowRoot}>
        <div
          className={
            data.currencyCode == selectedCurrency
              ? cs(globalStyles.cerise, styles.left)
              : styles.left
          }
        >
          {data.countryName?.toUpperCase()}
        </div>
        <div
          className={
            data.currencyCode == selectedCurrency
              ? cs(globalStyles.cerise, styles.right)
              : styles.right
          }
        >
          ({data.currencyCode + " " + data.currencySymbol})
        </div>
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
    setTempValue(newValue);
    setSelectedCurrency(newValue);
    event.stopPropagation();
  };

  const onBlur = (event: any) => {
    setFocused(false);
    if (event.target) {
      setInputValue(tempValue);
    }
  };

  const onFocus = () => {
    setFocused(true);
    setTempValue(inputValue);
    setInputValue("");
  };

  const inputProps = {
    placeholder: "Select Your Currency",
    value: inputValue,
    onChange: onChange,
    onFocus: onFocus,
    onBlur: onBlur,
    disabled: false,
    autoComplete: "new-password",
    className: "currencylist"
  };

  const shouldRenderSuggestions = () => {
    return true;
  };

  const handleArrowClick = () => {
    (document.getElementsByClassName(
      "currencylist"
    )[0] as HTMLInputElement)?.focus();
    onFocus();
  };
  return (
    <div
      className={cs(
        styles.introPage,
        globalStyles.textCenter,
        styles.introTransition
      )}
    >
      <img
        src={mobile ? mobileImg : desktopImg}
        className={styles.imgResponsive}
      />
      <div className={styles.content}>
        <div className={globalStyles.textCenter}>
          <img src={whitelogo} className={styles.logoWhite} />
        </div>
        <ul className={cs(styles.introlist)}>
          {/* {this.createCategory()} */}
          <li>Welcome to {mobile && <br />}Good Earth</li>
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
              focusInputOnSuggestionClick={false}
              inputProps={inputProps}
              id={"currencyid"}
            />
            <span
              className={
                focused
                  ? globalStyles.hidden
                  : cs(styles.newcaret, globalStyles.cerise)
              }
              onClick={handleArrowClick}
            ></span>
            {/* <label
                        className={cs({
                        [globalStyles.hidden]: false
                        })}
                    >
                        {'hello'}
                    </label> */}
            {errorMessage && (
              <p className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}>
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
    // </div>
  );
};

export default CurrencyPopup;
