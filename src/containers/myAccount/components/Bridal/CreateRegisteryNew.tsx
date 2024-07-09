import React, {
  useState,
  useContext,
  useEffect,
  createRef,
  useRef,
  useCallback
} from "react";
// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
// import * as valid from 'components/common/validation/validate'
// import { Props } from "./typings";
import BridalContext from "./context";
import styles from "./styles.scss";
import myAccountStyles from "../styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
// import glasses from "../../../../images/bridal/glasses.svg";
// import bridalRing from "../../../../images/bridal/rings.svg";
import gift_icon from "../../../../images/registery/gift_icon.svg";
import calendarIcon from "../../../../images/bridal/icons_bridal-registry-calendar.svg";
import { confirmPopup } from "utils/validate";
import { pageViewGTM } from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import Formsy from "formsy-react";
import FormInput from "../../../../components/Formsy/FormInput";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../styles/reactDatepicker.css";
import { useDispatch, useSelector } from "react-redux";
import LoginService from "services/login";
import { updateCountryData } from "actions/address";
import Button from "components/Button";
import { AppState } from "reducers/typings";

const CreateRegistryNew: React.FC = () => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const { setCurrentModule, setCurrentModuleData, data } = useContext(
    BridalContext
  );
  const [selectId, setSelectId] = useState(
    data.occasion ? data.occasion : "wedding"
  );
  const occasion = selectId;
  const occasionInCaps = occasion[0].toUpperCase() + occasion.slice(1);
  const [isOpen] = useState(false);
  const [date, setDate] = useState(
    data.eventDate ? moment(data.eventDate, "YYYY-MM-DD").toDate() : undefined
  );
  const [dateErrorMsg, setDateErrorMsg] = useState("");
  const dispatch = useDispatch();
  const [otherChoice, setOtherChoice] = useState("");

  const BridalDetailsFormRef = createRef<Formsy>();
  const occasionChoiceRef = useRef<HTMLInputElement>(null);
  const regName = useRef<HTMLInputElement>(null);
  const registrantNameRef = useRef<HTMLInputElement>(null);
  const coRegistrantNameRef = useRef<HTMLInputElement>(null);

  const setRegistry = (data: string) => {
    setSelectId(data);
  };

  const onInputChange = (e: any) => {
    e.currentTarget.value.trim();
  };

  //************** date picker *****************
  let pickerRef: any = null;
  const OnOutsideClick = () => {
    pickerRef.setOpen(false);
  };

  const onClickCalIcon = () => {
    pickerRef.setOpen(true);
    const dateInput = document.getElementById("datePicker");
    dateInput?.focus();
  };

  const onDateChange = (date: Date) => {
    setDate(date);
    setDateErrorMsg("");
    // pickerRef.attr("autocomplete", "off");
    OnOutsideClick();
  };

  const onCtaClick = () => {
    if (date) {
      setDateErrorMsg("");
    } else {
      setDateErrorMsg("Please enter Occasion Date");
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", confirmPopup);
    LoginService.fetchCountryData(dispatch).then(countryData => {
      dispatch(updateCountryData(countryData));
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      pageViewGTM("MyAccount");
      dataLayer.push({
        event: "registry",
        "Event Category": "Registry",
        "Event Action": "Details page",
        "Event Label": data.occasion
      });
    }
    if (data.occassion_choice == "Others") {
      setSelectId("others");
      setOtherChoice(data.occasion);
    } else {
      setOtherChoice("");
    }
  }, []);

  const handleSubmit = (model: any) => {
    const {
      occassion_choice,
      registrantName,
      coRegistrantName,
      registryName
    } = model;
    const occasion = selectId;
    const occasionInCaps = occasion[0].toUpperCase() + occasion.slice(1);
    setCurrentModuleData("create", {
      occasion: selectId == "others" ? occassion_choice : occasion,
      occassion_choice: occassion_choice ? "Others" : occasionInCaps,
      eventDate: moment(date).format("YYYY-MM-DD"),
      registrantName: registrantName,
      coRegistrantName: coRegistrantName ? coRegistrantName : "",
      registryName: registryName
    });
    if (date) {
      setDateErrorMsg("");
      setCurrentModule("address");
      window.scrollTo(0, 0);
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "ge_registry_form_step1_submit",
          click_type: selectId == "others" ? occassion_choice : occasion,
          cta_name: moment(date).format("YYYY-MM-DD")
        });
      }
    } else {
      setDateErrorMsg("Please enter Occasion Date");
    }
  };

  return (
    <>
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            styles.registeryFormContainer,
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd10,
            bootstrapStyles.offsetMd1
          )}
        >
          <div className={cs(styles.giftIcon)}>
            <img src={gift_icon} width="50px" height="50px" />
          </div>
          <div
            className={cs(styles.registryFormHeading, globalStyles.voffset6)}
          >
            Good Earth Registry
          </div>
          <div
            className={cs(
              styles.registeryFormContent,
              myAccountStyles.loginForm,
              styles.loginForm
            )}
          >
            <p>We are delighted that you have chosen to register with us.</p>
            <p>
              Please note: Our Good Earth Registry is country specific. Before
              creating your Good Earth Registry, please select country where you
              would like your gifts to be shipped.
            </p>
            <p>
              To change your country please click on the change country button
              on the header. Your guests will view the registry in the prices &
              currency associated with the country selected as the shipping
              destination.
            </p>
          </div>
        </div>
        <div className={cs(styles.registeryForm, styles.formDetails)}>
          <div className={cs(styles.regFormHeading)}>1. REGISTRY DETAILS</div>
          <Formsy ref={BridalDetailsFormRef} onValidSubmit={handleSubmit}>
            <div className={styles.categorylabel}>
              <div className={cs(styles.radioBtn)}>
                <ul className="ul">
                  <p className={cs(styles.regFormLabel)}>Occasion*</p>
                  <div
                    onClick={e => {
                      setRegistry("wedding");
                      setOtherChoice("");
                    }}
                    data-value="Wedding"
                    className={cs(styles.radioList, {
                      [styles.active]: selectId == "" || selectId == "wedding"
                    })}
                  >
                    <span
                      className={cs(
                        styles.checkMark,
                        selectId === "wedding" ? styles.markedRegistry : ""
                      )}
                    ></span>
                    <li li-data-value="Wedding">Wedding</li>
                  </div>
                  <div
                    onClick={e => {
                      setRegistry("anniversary");
                      setOtherChoice("");
                    }}
                    data-value="anniversary"
                    className={cs(styles.radioList, {
                      [styles.active]: selectId == "anniversary"
                    })}
                  >
                    <span
                      className={cs(
                        styles.checkMark,
                        selectId === "anniversary" ? styles.markedRegistry : ""
                      )}
                    ></span>
                    <li li-data-value="anniversary">Anniversary</li>
                  </div>
                  <div
                    onClick={e => {
                      setRegistry("birthday");
                      setOtherChoice("");
                    }}
                    data-value="birthday"
                    className={cs(styles.radioList, {
                      [styles.active]: selectId == "birthday"
                    })}
                  >
                    <span
                      className={cs(
                        styles.checkMark,
                        selectId === "birthday" ? styles.markedRegistry : ""
                      )}
                    ></span>
                    <li li-data-value="birthday">Birthday</li>
                  </div>
                  <div
                    onClick={e => {
                      setRegistry("others");
                    }}
                    // onChange={handleChangeLi}
                    data-value="others"
                    className={cs(styles.radioList, {
                      [styles.active]: selectId == "others"
                    })}
                  >
                    <span
                      className={cs(
                        styles.checkMark,
                        selectId === "others" ? styles.markedRegistry : ""
                      )}
                    ></span>
                    <li
                      className={cs(styles.lastLiChild)}
                      data-value={
                        data.occassion_choice
                          ? data.occassion_choice
                          : occasionInCaps
                      }
                    >
                      <FormInput
                        id="other_value"
                        className={cs(styles.otherInput, styles.regFormLabel)}
                        name="occassion_choice"
                        placeholder="Other"
                        label=""
                        inputRef={occasionChoiceRef}
                        validations={{
                          maxLength: 50,
                          isExisty: true
                        }}
                        validationErrors={{
                          maxLength: "You can not enter more than 50 characters"
                        }}
                        required={selectId == "others"}
                        value={otherChoice || ""}
                        handleChange={onInputChange}
                      />
                    </li>
                  </div>
                </ul>
              </div>
              <div className={styles.inputWrp}>
                <FormInput
                  className={cs(styles.regFormLabel)}
                  name="registryName"
                  inputRef={regName}
                  placeholder="Registry Name*"
                  label={"Registry Name*"}
                  validations={{
                    maxLength: 50,
                    isExisty: true
                  }}
                  validationErrors={{
                    maxLength: "You can not enter more than 50 characters"
                  }}
                  required
                  value={data.registryName || ""}
                  handleChange={onInputChange}
                />
              </div>
              <div className={styles.inputWrp}>
                <FormInput
                  className={cs(styles.regFormLabel)}
                  name="registrantName"
                  placeholder="Registrant’s  Name*"
                  label={"Registrant’s Name*"}
                  inputRef={registrantNameRef}
                  validations={{
                    maxLength: 50,
                    isExisty: true
                  }}
                  validationErrors={{
                    maxLength: "You can not enter more than 50 characters"
                  }}
                  required
                  value={data.registrantName || ""}
                  handleChange={onInputChange}
                />
              </div>
              <div className={styles.inputWrp}>
                <FormInput
                  className={cs(styles.regFormLabel)}
                  name="coRegistrantName"
                  placeholder="Co-registrant’s  Name"
                  label={"Co-registrant’s  Name"}
                  inputRef={coRegistrantNameRef}
                  validations={{
                    maxLength: 50,
                    isExisty: true
                  }}
                  validationErrors={{
                    maxLength: "You can not enter more than 50 characters"
                  }}
                  value={data.coRegistrantName || ""}
                  handleChange={onInputChange}
                />
              </div>
              <div className={cs(styles.datePicker, styles.regFormLabel)}>
                <label className={styles.eventLabel}>Occasion Date*</label>
                <DatePicker
                  id="datePicker"
                  name="datePicker"
                  startOpen={isOpen}
                  minDate={new Date()}
                  selected={date}
                  onChange={onDateChange}
                  ref={node => {
                    pickerRef = node;
                  }}
                  autoComplete="off"
                  onClickOutside={OnOutsideClick}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  className={cs(styles.dateWrp, {
                    [globalStyles.errorBorder]: dateErrorMsg
                  })}
                  onKeyDown={e => {
                    e.preventDefault();
                  }}
                />
                <div className={cs(styles.calIcon)} onClick={onClickCalIcon}>
                  <img src={calendarIcon} width="35" height="35" />
                </div>
                {dateErrorMsg && (
                  <p className={cs(styles.dateErrorMsg, styles.errorMsg)}>
                    {dateErrorMsg}
                  </p>
                )}
              </div>
              <div className={globalStyles.textCenter}>
                <Button
                  onClick={onCtaClick}
                  variant="mediumMedCharcoalCta366"
                  type="submit"
                  label={"PROCEED"}
                  className={cs(globalStyles.marginB20)}
                />
              </div>
            </div>
          </Formsy>
        </div>
      </div>
    </>
  );
};

export default CreateRegistryNew;
