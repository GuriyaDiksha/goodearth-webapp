import React, { useRef } from "react";
import WhatsappSubscribe from "components/WhatsappSubscribe";
import styles from "./styles.scss";
import Formsy from "formsy-react";
import crossIcon from "images/cross.svg";

type Props = {
  data: any;
  isdList: any;
  closePopup: () => void;
};

const WhatsappPopup: React.FC<Props> = props => {
  const whatsappSubscribeRef = useRef<HTMLInputElement>();
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
            <Formsy>
              <WhatsappSubscribe
                data={props.data}
                innerRef={whatsappSubscribeRef}
                isdList={props.isdList}
                whatsappClass={styles.whatsapp}
                countryCodeClass={styles.countryCode}
                checkboxLabelClass={styles.checkboxLabel}
              />
            </Formsy>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappPopup;
