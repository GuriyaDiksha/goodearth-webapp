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
import { updateModal } from "actions/modal";
type Props = {
  data: any;
  isdList: any;
  closePopup: () => void;
};

const WhatsappPopup: React.FC<Props> = props => {
  const dispatch = useDispatch();

  const [isDisabled, setIsDisabled] = useState(true);
  const [numberValidation, setNumberValidation] = useState("");
  const [codeValidation, setCodeValidation] = useState("");

  const whatsappSubscribeRef = useRef<HTMLInputElement>();

  const onSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const { whatsappSubscribe, whatsappNo, whatsappNoCountryCode } = model;

    let formdata = {
      subscribe: props.data.subscribe,
      whatsappNo: whatsappNo,
      whatsappNoCountryCode: whatsappNoCountryCode,
      whatsappSubscribe: whatsappSubscribe
    };

    if (!whatsappSubscribe) {
      formdata = {
        subscribe: props.data.subscribe,
        whatsappNo: props.data.whatsappNo,
        whatsappNoCountryCode: props.data.whatsappNoCountryCode,
        whatsappSubscribe: whatsappSubscribe
      };
    }

    AccountService.updateAccountPreferences(dispatch, formdata)
      .then((res: any) => {
        dispatch(updatePreferenceData(res));
        setIsDisabled(true);
        showGrowlMessage(dispatch, "Your preferences have been updated!", 5000);
        dispatch(updateModal(false));
      })
      .catch((err: any) => {
        console.log("here, ", err);
        const data = err.response?.data;
        Object.keys(data).map(key => {
          switch (key) {
            case "whatsappNo":
              updateInputsWithError(
                {
                  [key]: data[key][0]
                },
                true
              );
              break;
          }
        });
      });
  };

  const onFormChange = (model: any, isChanged: any) => {
    //For Disabling Button
    let objEqual = false;
    const data = Object.assign({}, props.data);
    delete data.subscribe;

    const obj1Keys = Object.keys(model).sort();
    const obj2Keys = Object.keys(data).sort();
    if (obj1Keys.length !== obj2Keys.length) {
    } else {
      const areEqual = obj1Keys.every((key, index) => {
        const objValue1 = model[key].toString();
        const objValue2 = data[obj2Keys[index]].toString();
        return objValue1 === objValue2;
      });
      if (areEqual) {
        objEqual = true;
      } else {
        objEqual = false;
      }
    }

    const { whatsappSubscribe, whatsappNoCountryCode, whatsappNo } = model;
    if (whatsappSubscribe) {
      if (whatsappNoCountryCode == "") {
        setCodeValidation("Required");
      } else {
        const idx = props.isdList.indexOf(whatsappNoCountryCode);
        if (idx > -1) {
          setCodeValidation("");
        } else {
          setCodeValidation("Enter valid code");
        }
      }

      if (whatsappNo == "") {
        setNumberValidation("Please Enter your Contact Number");
      } else {
        setNumberValidation("");
      }
    } else {
      setCodeValidation("");
      setNumberValidation("");
    }

    if (objEqual || codeValidation != "" || numberValidation != "") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
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
            <Formsy
              onSubmit={onSubmit}
              onChange={onFormChange}
              validationErrors={{
                whatsappNoCountryCode: codeValidation,
                whatsappNo: numberValidation
              }}
            >
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
                    [globalStyles.disabledBtn]: isDisabled
                  })}
                  disabled={isDisabled}
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
