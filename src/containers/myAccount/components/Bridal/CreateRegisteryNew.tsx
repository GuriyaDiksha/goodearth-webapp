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

const CreateRegistryNew: React.FC = () => {
  const { setCurrentModule, setCurrentModuleData, data } = useContext(
    BridalContext
  );
  const [selectId, setSelectId] = useState(
    data.occasion ? data.occasion : "wedding"
  );
  const occasion = selectId;
  const occasionInCaps = occasion[0].toUpperCase() + occasion.slice(1);
  // const [active, setActive] = useState(false);
  const [updateProfile, setUpdateProfile] = useState(
    data.coRegistrantName && data.registrantName && data.eventDate
      ? true
      : false
  );
  const [isOpen] = useState(false);
  const [date, setDate] = useState(
    data.eventDate ? moment(data.eventDate, "YYYY-MM-DD").toDate() : undefined
  );

  // const otherRef = useRef<HTMLInputElement>(null);
  const BridalDetailsFormRef = createRef<Formsy>();

  const setRegistry = (data: string) => {
    setSelectId(data);
    // setActive(false);
    // if (document.activeElement === otherRef.current) {
    //   setActive(true);
    // } else {
    //   setActive(false);
    //   // setOther("");
    // }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", confirmPopup);
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
  }, []);

  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    const {
      occassion_choice,
      registrantName,
      coRegistrantName,
      registryName
    } = model;
    const occasion = selectId;
    const occasionInCaps = occasion[0].toUpperCase() + occasion.slice(1);
    if (!updateProfile) return false;
    setCurrentModuleData("create", {
      occasion: selectId == "others" ? occassion_choice : occasion,
      occassion_choice: occassion_choice ? "Others" : occasionInCaps,
      eventDate: moment(date).format("YYYY-MM-DD"),
      registrantName: registrantName,
      coRegistrantName: coRegistrantName ? coRegistrantName : "",
      registryName: registryName
    });
    setCurrentModule("address");
  };

  const handleChange = () => {
    setUpdateProfile(true);
  };

  const occasionChoiceRef = useRef<HTMLInputElement>(null);
  const registrantNameRef = useRef<HTMLInputElement>(null);
  const coRegistrantNameRef = useRef<HTMLInputElement>(null);
  const regName = useRef<HTMLInputElement>(null);

  const handleUpdateProfileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const occasionChoice =
      occasionChoiceRef.current?.value.trim() == ""
        ? ""
        : registrantNameRef.current?.value;
    const registrantName =
      registrantNameRef.current?.value.trim() == ""
        ? ""
        : registrantNameRef.current?.value;
    const coRegistrantName =
      coRegistrantNameRef.current?.value.trim() == ""
        ? ""
        : coRegistrantNameRef.current?.value;
    const registryName =
      regName.current?.value.trim() == "" ? "" : regName.current?.value;
    if (occasionChoice && registrantName && registryName && !updateProfile) {
      setUpdateProfile(true);
    } else if (
      (!occasionChoice || !registrantName || !registryName) &&
      updateProfile
    ) {
      setUpdateProfile(false);
    }
  };
  //************** date picker *****************
  //   const [updateDate, setUpdateDate] = useState(data.eventDate ? true : false);
  let pickerRef: any = null;
  const OnOutsideClick = () => {
    pickerRef.setOpen(true);
  };
  const onChange = (date: Date) => {
    setDate(date);
    setUpdateProfile(true);
    // setUpdateDate(true);
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
          <div className={cs(styles.registeryForm)}>
            <div className={cs(styles.regFormHeading)}>1. REGISTRY DETAILS</div>
            <Formsy
              ref={BridalDetailsFormRef}
              onValidSubmit={handleSubmit}
              onChange={handleChange}
              // onInvalidSubmit={handleInvalidSubmit}
            >
              <div className={styles.categorylabel}>
                <div className={cs(styles.radioBtn)}>
                  <ul className="ul">
                    <p className={cs(styles.regFormLabel)}>Occasion*</p>
                    <div
                      onClick={e => {
                        setRegistry("wedding");
                      }}
                      data-value="Wedding"
                      className={cs(styles.radioList, {
                        [styles.active]: selectId == "" || selectId == "wedding"
                      })}
                    >
                      <span className={cs(styles.checkMark)}></span>
                      <li li-data-value="Wedding">Wedding</li>
                    </div>
                    <div
                      onClick={e => {
                        setRegistry("anniversary");
                      }}
                      data-value="anniversary"
                      className={cs(styles.radioList, {
                        [styles.active]: selectId == "anniversary"
                      })}
                    >
                      <span className={cs(styles.checkMark)}></span>
                      <li li-data-value="anniversary">Anniversary</li>
                    </div>
                    <div
                      onClick={e => {
                        setRegistry("birthday");
                      }}
                      data-value="birthday"
                      className={cs(styles.radioList, {
                        [styles.active]: selectId == "birthday"
                      })}
                    >
                      <span className={cs(styles.checkMark)}></span>
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
                      <span className={cs(styles.checkMark)}></span>
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
                          className={cs(styles.regFormLabel)}
                          name="occassion_choice"
                          placeholder="Other"
                          label=""
                          inputRef={occasionChoiceRef}
                          validations={{
                            maxLength: 50,
                            isExisty: true
                          }}
                          validationErrors={{
                            maxLength:
                              "You can not enter more than 50 characters"
                          }}
                          value={occasionInCaps ? "" : data.occassion_choice}
                          handleChange={handleUpdateProfileChange}
                        />
                      </li>
                    </div>
                  </ul>
                </div>
                <div>
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
                    handleChange={handleUpdateProfileChange}
                  />
                </div>
                <div>
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
                    handleChange={handleUpdateProfileChange}
                  />
                </div>
                <div>
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
                    handleChange={handleUpdateProfileChange}
                  />
                </div>
                <div className={cs(styles.datePicker)}>
                  <DatePicker
                    startOpen={isOpen}
                    minDate={new Date()}
                    selected={date}
                    onChange={onChange}
                    ref={node => {
                      pickerRef = node;
                    }}
                    onClickOutside={OnOutsideClick}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    required
                  />
                  <div className={cs(styles.calIcon)} onClick={OnOutsideClick}>
                    <img src={calendarIcon} width="35" height="35" />
                  </div>
                </div>
                <div>
                  <input
                    type="submit"
                    // disabled={!updateProfile}
                    className={cs(
                      globalStyles.charcoalBtn
                      // {[globalStyles.disabledBtn]: !updateProfile}
                    )}
                    value="PROCEED"
                  />
                </div>
              </div>
            </Formsy>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRegistryNew;
