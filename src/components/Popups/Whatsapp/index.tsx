import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import WhatsappSubscribe from "components/WhatsappSubscribe";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import Formsy from "formsy-react";
import crossIcon from "images/cross.svg";
import AccountService from "services/account";
import { showGrowlMessage } from "utils/validate";
import { updatePreferenceData } from "actions/user";
import cs from "classnames";

type Props = {
  data: any;
  isdList: any;
  closePopup: () => void;
};

const WhatsappPopup: React.FC<Props> = props => {
  const dispatch = useDispatch();

  const [disableBtn, setDisableBtn] = useState(false);

  const whatsappSubscribeRef = useRef<HTMLInputElement>();

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
      setDisableBtn(true);
      showGrowlMessage(dispatch, "Your preferences have been updated!", 5000);
    });
  };

  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <img
          className={styles.cross}
          onClick={props.closePopup}
          src={crossIcon}
        />
        <div className={styles.heading}>My Preferences</div>
        <div className={styles.subheading}>
          Manage your communication preferences.
        </div>
        <div className={styles.loginForm}>
          <div className={styles.categorylabel}>
            <Formsy onSubmit={onSubmit}>
              <WhatsappSubscribe
                data={props.data}
                innerRef={whatsappSubscribeRef}
                isdList={props.isdList}
                whatsappClass={styles.whatsapp}
                countryCodeClass={styles.countryCode}
                checkboxLabelClass={styles.checkboxLabel}
              />
              <div className={styles.savePrefBtn}>
                <input
                  type="submit"
                  value="Save Preferences"
                  className={cs(globalStyles.charcoalBtn, {
                    [globalStyles.disabledBtn]: disableBtn
                  })}
                  disabled={disableBtn}
                />
              </div>
            </Formsy>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappPopup;
