import React, { useContext, useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import whitelogo from "images/gelogoWhite.svg";
import desktopImg from "images/desktopImg.jpg";
import "styles/autosuggest.css";
// import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context.ts";
// import MakerEnhance from "components/maker";
// import { currencyCodes } from "constants/currency";
// import { useSelector } from "react-redux";
// import { AppState } from "reducers/typings";
import Autosuggest from "react-autosuggest";
// import { AppState } from "reducers/typings";
import CookieService from "services/cookie";
type PopupProps = {
  //   remainingAmount: number;
  // closeModal: (data?: any) => any;
  //   acceptCondition: (data?: any) => any;
};
const CurrencyPopup: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [showMaker, setShowMaker] = useState(false);
  //   useEffect(() => {
  //     setShowMaker(true);
  //   }, []);
  const [currencyList] = useState<any[]>([
    {
      currencyCode: "INR",
      currencySymbol: "₹",
      countryName: "India"
    },
    {
      currencyCode: "AED",
      currencySymbol: "د.إ",
      countryName: "United Arab Emirates"
    },
    {
      currencyCode: "GBP",
      currencySymbol: "£",
      countryName: "United Kingdom"
    },
    {
      currencyCode: "USD",
      currencySymbol: "$",
      countryName: "REST OF THE WORLD"
    }
  ]);
  // const currency = useSelector((state: AppState) => state.info.currencyList);
  const [suggestions, setSuggestions] = useState<any[]>(currencyList);
  const [errorMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const { closeModal } = useContext(Context);
  const onChangeCurrency = () => {
    const cookieString =
      "currencypopup=true; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
    document.cookie = cookieString;
    CookieService.setCookie("currencypopup", "true", 365);
    closeModal();
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  const getSuggestions = (value: string) => {
    const inputLength = value?.length || 0;
    return inputLength === 0
      ? currencyList
      : currencyList.filter(data => {
          return data.countryName.indexOf(value.toUpperCase()) > -1;
        });
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
    console.log(suggestion.currencyCode, suggestionValue.currencyCode);

    // props.changeState && props.changeState(suggestionValue);
  };

  const onChange = (event: any, { newValue }: { newValue: string }) => {
    setInputValue(newValue);
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
