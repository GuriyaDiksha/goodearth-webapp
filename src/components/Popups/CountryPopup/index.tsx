import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { Context } from "components/Modal/context";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import GELogo from "./../../../images/geLogo.png";
import Button from "components/Button";
import SelectDropdown from "components/Formsy/SelectDropdown";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";
import { Country } from "components/Formsy/CountryCode/typings";
import Formsy from "formsy-react";
import CookieService from "services/cookie";
import { countryCurrencyCode } from "constants/currency";
import { updateOpenCookiePopup } from "actions/info";
import { updateRegion } from "actions/widget";
import { useHistory } from "react-router";
import { isAEDDisabled } from "typings/currency";

type CountryOptions = {
  value: string;
  label: string;
  code2: string;
  isd: string | undefined;
};

const CountryPopup: React.FC<{ initSection: number }> = ({ initSection }) => {
  const history = useHistory();
  const { closeModal } = useContext(Context);
  const dispatch = useDispatch();
  const [countryOptions, setCountryOptions] = useState<CountryOptions[]>([]);
  const [selectedCountry, setSelectedCountry] = useState({
    country: "India",
    code: "IN"
  });
  const [currentSection, setCurrentSection] = useState(1);
  const countryRef: RefObject<HTMLInputElement> = useRef(null);
  const [containerHeightFixed, setContainerHeighFixed] = useState<boolean>(
    false
  );

  const {
    device: { mobile },
    address: { countryData },
    user: { customerGroup },
    widget: { ip, region }
  } = useSelector((state: AppState) => state);
  const country = CookieService.getCookie("country");
  const countryCode = CookieService.getCookie("countryCode");

  const changeCountryData = (countryData: Country[]) => {
    const countryOptions = countryData.map(country => {
      return Object.assign(
        {},
        {
          value: country.nameAscii,
          label: country.nameAscii,
          code2: country.code2,
          isd: country.isdCode
        }
      );
    });
    setCountryOptions(countryOptions);
  };

  useEffect(() => {
    if (!countryData || countryData?.length == 0) {
      LoginService.fetchCountryData(dispatch).then(countryData => {
        dispatch(updateCountryData(countryData));
        changeCountryData(countryData);
      });
    }

    if (countryOptions?.length === 0 && countryData) {
      changeCountryData(countryData);
    }

    if (currentSection !== initSection) {
      setCurrentSection(initSection);
    }
  }, []);

  useEffect(() => {
    setSelectedCountry({ country, code: countryCode });
  }, [country, countryCode]);

  const setCurrency = async (isCancel?: boolean) => {
    const currency =
      countryCurrencyCode[isCancel ? countryCode : selectedCountry?.code] ||
      "USD";
    const data: any = {
      currency
    };
    LoginService.changeCurrency(dispatch, data).then(res => {
      CookieService.setCookie(
        "country",
        isCancel ? country : selectedCountry?.country,
        365
      );
      CookieService.setCookie("currency", currency, 365);
      dispatch(
        updateRegion({
          region: region,
          ip: ip,
          country: isCancel ? country : selectedCountry?.country
        })
      );
      LoginService.reloadPage(dispatch, data?.currency, customerGroup);
      dispatch(updateOpenCookiePopup(true));
    });
    closeModal();
  };

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          { [styles.centerpageDesktopFs]: !mobile },
          globalStyles.textCenter,
          { [styles.centerpageDesktopFsWidth]: mobile }
        )}
      >
        <div
          className={cs(
            styles.gcTnc,
            containerHeightFixed
              ? styles["fixed-height"]
              : styles["flexible-height"]
          )}
        >
          {currentSection === 1 ? (
            <div className={styles.countryFirstSection}>
              <img src={GELogo} alt="logo" width={50} />
              <p>It seems you’re shopping from</p>
              <h3>{country}</h3>
              <Button
                variant="mediumMedCharcoalCta366"
                label={"CONTINUE"}
                onClick={() => setCurrency(false)}
              />
              <p className={styles.link} onClick={() => setCurrentSection(2)}>
                CHANGE COUNTRY
              </p>
            </div>
          ) : (
            <div className={styles.countrySecondSection}>
              <p>CHANGE COUNTRY</p>
              <Formsy>
                <div
                  className={cs(
                    styles.form,
                    styles.loginForm,
                    styles.dropdownWrp
                  )}
                >
                  <SelectDropdown
                    required
                    name="country"
                    handleChange={option =>
                      setSelectedCountry({
                        country: option?.value,
                        code: option?.code2
                      })
                    }
                    label="Country*"
                    options={countryOptions}
                    allowFilter={true}
                    inputRef={countryRef}
                    // value={selectedCountry?.country}
                    value={
                      isAEDDisabled &&
                      selectedCountry?.country.toLowerCase() ===
                        "united arab emirates"
                        ? "United States"
                        : selectedCountry?.country
                    }
                    onInputClick={flag => setContainerHeighFixed(flag)}
                  />
                </div>
              </Formsy>

              <Button
                variant="mediumMedCharcoalCta366"
                label={"CHANGE COUNTRY SELECTION"}
                onClick={() => setCurrency(false)}
                disabled={selectedCountry?.country === country}
              />
              <p className={styles.link} onClick={() => setCurrency(true)}>
                CANCEL
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryPopup;
