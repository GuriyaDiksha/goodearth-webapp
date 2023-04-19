import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WhatsappSubscribe from "components/WhatsappSubscribe";
import AccountService from "services/account";
import LoginService from "services/login";
import styles from "../styles.scss";
import cs from "classnames";
import { updateCountryData } from "actions/address";
import { AppState } from "reducers/typings";
import { updatePreferenceData } from "actions/user";
import { makeid } from "utils/utility";

export type Props = {
  setCurrentSection: () => void;
};

const MyPreferences: React.FC<Props> = props => {
  const { countryData } = useSelector((state: AppState) => state.address);
  const { user } = useSelector((state: AppState) => state);
  const [isdList, setIsdList] = useState<any>([]);
  const whatsappCheckRef = useRef<HTMLInputElement>(null);
  const whatsappCodeRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  props.setCurrentSection();

  const fetchCountryData = async () => {
    const data = await LoginService.fetchCountryData(dispatch);
    dispatch(updateCountryData(data));
  };

  useEffect(() => {
    if (!user?.isLoggedIn) {
      return;
    }

    if (countryData.length == 0) {
      fetchCountryData();
    }

    AccountService.fetchAccountPreferences(dispatch).then((data: any) => {
      dispatch(updatePreferenceData(data));
    });
  }, []);

  useEffect(() => {
    const isdList = countryData.map(list => {
      return list.isdCode;
    });
    setIsdList(isdList);
  }, [countryData]);

  return (
    <div className={cs(styles.myPrefContainer, styles.loginForm)}>
      <div className={styles.formHeading}>My Preferences</div>
      <div className={styles.formSubheading}>
        Manage your communication preferences.
      </div>
      <div className={cs(styles.content, styles.categorylabel)}>
        <WhatsappSubscribe
          data={user.preferenceData}
          innerRef={whatsappCheckRef}
          codeRef={whatsappCodeRef}
          isdList={isdList}
          showPhone={true}
          countryCodeClass={styles.countryCode}
          checkboxLabelClass={styles.checkboxLabel}
          newsletterClass={styles.newsletters}
          whatsappClass={styles.whatsapp}
          uniqueKey={"profileid123"}
          showSubscribe={false}
        />
      </div>
    </div>
  );
};

export default MyPreferences;
