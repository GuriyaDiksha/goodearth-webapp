import React, { useRef } from "react";
import WhatsappSubscribe from "components/WhatsappSubscribe";
import styles from "./styles.scss";
import crossIcon from "images/cross.svg";
import { makeid } from "utils/utility";
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
            <WhatsappSubscribe
              uniqueKey={"whatsappid123"}
              data={props.data}
              innerRef={whatsappSubscribeRef}
              isdList={props.isdList}
              whatsappClass={styles.whatsapp}
              buttonClass={styles.buttonClass}
              countryCodeClass={styles.countryCode}
              checkboxLabelClass={styles.checkboxLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsappPopup;
