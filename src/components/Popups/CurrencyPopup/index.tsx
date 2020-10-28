import React, { useContext, useState }  from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import whitelogo from "images/gelogoWhite.svg"
import desktopImg from "images/desktopImg.jpg"
// import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context.ts";
// import MakerEnhance from "components/maker";
// import { currencyCodes } from "constants/currency";
// import { useSelector } from "react-redux";
// import { AppState } from "reducers/typings";
import Autosuggest from "react-autosuggest";

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
const [suggestions, setSuggestions] = useState<string[]>(['inr','usd','gbp']);
  const { closeModal } = useContext(Context);
  const onChangeCurrency  = ()=> {
    closeModal();
  }

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  const getSuggestions = (value: any) => {
    const inputLength = value.length;
    const inputValue = isNaN(Number(value))
      ? value.trim().toLowerCase()
      : Number(value);

    if (inputLength == 0) {
      return ['inr','usd','gbp'];
    } else {
      return inputLength === 0
        ? []
        : ['inr','usd','gbp'].filter(pincode => {
            return pincode.slice(0, inputLength) == inputValue;
          });
    }
  };
  //   const currency = useSelector((state: AppState) => state.currency);

  return (
    <div>
        <div className={cs(styles.introPage,globalStyles.textCenter ,styles.introTransition)}>
            <img src={desktopImg} className={globalStyles.imgResponsive}/>
                <div className={styles.content}>
                    <div className={globalStyles.textCenter}>
                        <img src={whitelogo} className={styles.logoWhite}/>
                    </div>
                    <ul className={cs(styles.introlist)}>
                        {/* {this.createCategory()} */}
                        <li>Welcome to Good Earth</li>
                    </ul>
                    <ul className={styles.subHeading}>
                        Please select a location to continue
                    </ul>
                    <ul>
                    <div
                    className={}
                    >
                    <Autosuggest
                        suggestions={['inr','usd','gbp']}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={() => setSuggestions([])}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        onSuggestionSelected={onSuggestionSelected}
                        inputProps={inputProps}
                        id={'currencyid'}
                    />
                    <label
                        className={cs({
                        [globalStyles.hidden]: !(labelClass && !props.disable)
                        })}
                    >
                        {props.label}
                    </label>
                    {errorMessage && (
                        <p className={cs(globalStyles.errorMsg, globalStyles.txtnormal)}>
                        {errorMessage}
                        </p>
                    )}
                    </div>
  
                    </ul>
                    <div className={styles.discover} onClick = {() => { onChangeCurrency() }}>
                        shop
                    </div>
                </div>
                <div className={cs(styles.textSkip,styles.categorylabel)}>
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
