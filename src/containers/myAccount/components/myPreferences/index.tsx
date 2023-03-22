import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import WhatsappSubscribe from "components/WhatsappSubscribe";
import AccountService from "services/account";
import LoginService from "services/login";
import FormCheckbox from "components/Formsy/FormCheckbox";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import Formsy from "formsy-react";
import { updateCountryData } from "actions/address";
import { AppState } from "reducers/typings";
import { showGrowlMessage } from "utils/validate";
import { updatePreferenceData } from "actions/user";

const MyPreferences = () => {
  const { countryData } = useSelector((state: AppState) => state.address);
  const { user } = useSelector((state: AppState) => state);
  const [subscribe, setSubscribe] = useState(false);
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
      dispatch(updatePreferenceData(data));
      setSubscribe(data.subscribe);
    });
  }, []);

  useEffect(() => {
    const isdList = countryData.map(list => {
      return list.isdCode;
    });
    setIsdList(isdList);
  }, [countryData]);

  const onSubmit = (model: any) => {
    const {
      subscribe,
      whatsappSubscribe,
      whatsappNo,
      whatsappNoCountryCode
    } = model;
    const data = {
      subscribe: subscribe,
      whatsappNo: whatsappNo,
      whatsappNoCountryCode: whatsappNoCountryCode,
      whatsappSubscribe: whatsappSubscribe
    };

    AccountService.updateAccountPreferences(dispatch, data).then((res: any) => {
      dispatch(updatePreferenceData(data));
      showGrowlMessage(dispatch, "Your preferences have been updated!", 5000);
    });
  };

  return (
    <div className={cs(styles.myPrefContainer, styles.loginForm)}>
      <div className={styles.formHeading}>My Preferences</div>
      <div className={styles.formSubheading}>
        Manage your communication preferences.
      </div>
      <Formsy onSubmit={onSubmit}>
        <div className={cs(styles.content, styles.categorylabel)}>
          <WhatsappSubscribe
            data={user.preferenceData}
            innerRef={whatsappCheckRef}
            isdList={isdList}
            showPhone={true}
            whatsappClass={styles.whatsapp}
            countryCodeClass={styles.countryCode}
            checkboxLabelClass={styles.checkboxLabel}
          />
          <div className={styles.newsletters}>
            <FormCheckbox
              id="subscribe"
              name="subscribe"
              disable={false}
              label={["Subscribe me to Emailers & Newsletters"]}
              value={subscribe}
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
