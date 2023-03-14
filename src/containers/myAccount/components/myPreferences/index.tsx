import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import AccountService from "services/account";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";

const MyPreferences = () => {
  const [preferencesData, setPreferencesData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    AccountService.fetchAccountPreferences(dispatch).then((data: any) => {
      setPreferencesData(data);
    });
  }, []);

  return (
    <div className={styles.myPrefContainer}>
      <div className={styles.formHeading}>My Preferences</div>
      <div className={styles.formSubheading}>
        Manage your communication preferences.
      </div>
      <div className={styles.content}>
        <div></div>
        <div className={styles.whatsapp}>
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
        <div className={styles.subscribe}>
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
        <div className={styles.savePrefBtn}>
          <input
            type="submit"
            value="Save Preferences"
            className={cs(globalStyles.charcoalBtn)}
          />
        </div>
      </div>
    </div>
  );
};

export default MyPreferences;
