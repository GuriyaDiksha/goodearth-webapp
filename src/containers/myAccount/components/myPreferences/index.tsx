import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import AccountService from "services/account";
import FormCheckbox from "components/Formsy/FormCheckbox";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import Formsy from "formsy-react";

const WhatsappSubscribe = (data: any, ref: any) => {
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    if (ref.current?.checked) {
      setShowPhone(true);
    }
    console.log(ref.current?.checked);
  }, [ref.current?.checked]);

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
      />
      {showPhone && <div>Okay!!</div>}
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
  const [preferencesData, setPreferencesData] = useState<any>({});
  const whatsappCheckRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    AccountService.fetchAccountPreferences(dispatch).then((data: any) => {
      setPreferencesData(data);
    });
  }, []);

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
    <div className={styles.myPrefContainer}>
      <div className={styles.formHeading}>My Preferences</div>
      <div className={styles.formSubheading}>
        Manage your communication preferences.
      </div>
      <Formsy onSubmit={onSubmit}>
        <div className={cs(styles.content, styles.categorylabel)}>
          {WhatsappSubscribe(preferencesData, whatsappCheckRef)}
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
