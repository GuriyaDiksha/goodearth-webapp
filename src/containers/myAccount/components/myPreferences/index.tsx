import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AccountService from "services/account";
import LoginService from "services/login";
import FormCheckbox from "components/Formsy/FormCheckbox";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import Formsy from "formsy-react";
import CountryCode from "components/Formsy/CountryCode";
import FormInput from "components/Formsy/FormInput";
import { updateCountryData } from "actions/address";
import { AppState } from "reducers/typings";

const WhatsappSubscribe = (data: any, ref: any, isdList: any) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(data.whatsappSubscribe);
  }, [data]);

  const onChange = (e: any) => {
    setChecked(e.target.checked);
  };

  return (
    <div className={styles.whatsapp}>
      <FormCheckbox
        id="whatsappSubscribe"
        name="whatsappSubscribe"
        disable={false}
        label={["Subscribe me for Whatsapp updates"]}
        value={data.whatsappSubscribe}
        labelClassName={styles.checkboxLabel}
        inputRef={ref}
        handleChange={onChange}
      />
      {checked && (
        <div className={styles.countryCode}>
          <CountryCode
            name="code"
            placeholder="Code"
            label="Country Code"
            value=""
            id="isdcode"
            validations={{
              isCodeValid: (values, value) => {
                return !(values.phone && value == "");
              },
              isValidCode: (values, value) => {
                if (value && isdList.length > 0) {
                  return isdList.indexOf(value ? value : "") > -1;
                } else {
                  return true;
                }
              }
            }}
            validationErrors={{
              isCodeValid: "Required",
              isValidCode: "Enter valid code"
            }}
            showLabel={true}
          />
          <FormInput
            // required
            name="phone"
            value=""
            placeholder={"Contact Number"}
            type="number"
            label={"Contact Number"}
            validations={{
              isExisty: true
            }}
            validationErrors={{
              isExisty: "Please enter your Contact Number"
            }}
            keyPress={e => (e.key == "Enter" ? e.preventDefault() : "")}
            keyDown={e => (e.which === 69 ? e.preventDefault() : null)}
            onPaste={e =>
              e?.clipboardData.getData("Text").match(/([e|E])/)
                ? e.preventDefault()
                : null
            }
            showLabel={true}
          />
        </div>
      )}
      By checking this, you agree to receiving Whatsapp messages for order &
      profile related information. To know more how we keep your data safe,
      refer to our &nbsp;
      <Link
        key="privacy"
        to="/customer-assistance/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </Link>
      .
    </div>
  );
};

const MyPreferences = () => {
  const { countryData } = useSelector((state: AppState) => state.address);

  const [preferencesData, setPreferencesData] = useState<any>({});
  const [isdList, setIsdList] = useState<any>([]);
  const whatsappCheckRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const fetchCountryData = async () => {
    const data = await LoginService.fetchCountryData(dispatch);
    dispatch(updateCountryData(data));
  };

  useEffect(() => {
    if (countryData.length == 0) {
      fetchCountryData();
    }

    AccountService.fetchAccountPreferences(dispatch).then((data: any) => {
      setPreferencesData(data);
    });
  }, []);

  useEffect(() => {
    const isdList = countryData.map(list => {
      return list.isdCode;
    });
    setIsdList(isdList);
  }, [countryData]);

  const onSubmit = (model: any) => {
    console.log(model);
    console.log(whatsappCheckRef.current?.checked);
    // const {subscribe}
    // AccountService.updateAccountPreferences({
    //   dispatch,
    //   {
    //     subscribe: subscribe,
    //     whatsappNo: whatsappNo,
    //     whatsappNoCountryCode: whatsappNoCountryCode,
    //     whatsappSubscribe: whatsappSubscribe
    //   }
    // })
  };

  return (
    <div className={cs(styles.myPrefContainer, styles.loginForm)}>
      <div className={styles.formHeading}>My Preferences</div>
      <div className={styles.formSubheading}>
        Manage your communication preferences.
      </div>
      <Formsy onSubmit={onSubmit}>
        <div className={cs(styles.content, styles.categorylabel)}>
          {WhatsappSubscribe(preferencesData, whatsappCheckRef, isdList)}
          <div className={styles.subscribe}>
            <FormCheckbox
              id="subscribe"
              name="subscribe"
              disable={false}
              label={["Subscribe me to Emailers & Newsletters"]}
              value={preferencesData.subscribe}
              labelClassName={styles.checkboxLabel}
            />
            By checking this, you agree to receiving Whatsapp messages for order
            & profile related information. To know more how we keep your data
            safe, refer to our &nbsp;
            <Link
              key="privacy"
              to="/customer-assistance/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            .
          </div>
          <div className={styles.savePrefBtn}>
            <input
              type="submit"
              value="Save Preferences"
              className={cs(globalStyles.charcoalBtn)}
            />
          </div>
        </div>
      </Formsy>
    </div>
  );
};

export default MyPreferences;
