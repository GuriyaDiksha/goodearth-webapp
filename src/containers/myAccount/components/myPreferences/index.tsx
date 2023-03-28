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
  const [isDisabled, setIsDisabled] = useState(true);
  const whatsappCheckRef = useRef<HTMLInputElement>(null);
  const [numberValidation, setNumberValidation] = useState("");
  const [codeValidation, setCodeValidation] = useState("");
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

  const onSubmit = (model: any, resetForm: any, updateInputsWithError: any) => {
    const {
      subscribe,
      whatsappSubscribe,
      whatsappNo,
      whatsappNoCountryCode
    } = model;

    let data = {
      subscribe: subscribe,
      whatsappNo: whatsappNo,
      whatsappNoCountryCode: whatsappNoCountryCode,
      whatsappSubscribe: whatsappSubscribe
    };

    if (!whatsappSubscribe) {
      data = {
        subscribe: subscribe,
        whatsappNo: user.preferenceData.whatsappNo,
        whatsappNoCountryCode: user.preferenceData.whatsappNoCountryCode,
        whatsappSubscribe: whatsappSubscribe
      };
    }

    AccountService.updateAccountPreferences(dispatch, data)
      .then((res: any) => {
        setIsDisabled(true);
        dispatch(updatePreferenceData(res));
        showGrowlMessage(dispatch, "Your preferences have been updated!", 5000);
      })
      .catch((err: any) => {
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
    const obj1Keys = Object.keys(model).sort();
    const obj2Keys = Object.keys(user.preferenceData).sort();
    if (obj1Keys.length !== obj2Keys.length) {
    } else {
      const areEqual = obj1Keys.every((key, index) => {
        const objValue1 = model[key].toString();
        const objValue2 = user.preferenceData[obj2Keys[index]].toString();
        return objValue1 === objValue2;
      });
      if (areEqual) {
        objEqual = true;
      } else {
      }
    }

    const { whatsappSubscribe, whatsappNoCountryCode, whatsappNo } = model;
    if (whatsappSubscribe) {
      if (whatsappNoCountryCode == "") {
        setCodeValidation("Required");
      } else {
        const idx = isdList.indexOf(whatsappNoCountryCode);
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
    <div className={cs(styles.myPrefContainer, styles.loginForm)}>
      <div className={styles.formHeading}>My Preferences</div>
      <div className={styles.formSubheading}>
        Manage your communication preferences.
      </div>
      <Formsy
        onSubmit={onSubmit}
        onChange={onFormChange}
        validationErrors={{
          whatsappNoCountryCode: codeValidation,
          whatsappNo: numberValidation
        }}
      >
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
              className={cs(globalStyles.charcoalBtn, {
                [globalStyles.disabledBtn]: isDisabled
              })}
              disabled={isDisabled}
            />
          </div>
        </div>
      </Formsy>
    </div>
  );
};

export default MyPreferences;
