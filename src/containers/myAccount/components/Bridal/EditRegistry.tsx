import React, { useState, useContext, useRef } from "react";
// import { CalendarIcon, ClearIcon } from 'components/common/form/Calendar';
import DatePicker from "react-datepicker";
// import DatePicker from 'react-date-picker';
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import BridalService from "services/bridal";
import BridalContext from "./context";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import styles from "./styles.scss";
// import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
// import popupStyles from "../../../../components/ThirdPartyEnquiryPopup/styles.scss";
import cs from "classnames";
import CloseButton from "components/Modal/components/CloseButton";
import calendarIcon from "../../../../images/bridal/icons_bridal-registry-calendar.svg";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../styles/reactDatepicker.css";
import { updateModal } from "actions/modal";

type Props = {
  eventDate: string;
  bridalId: number;
  changeDate: (date: string) => void;
  changeName: (data: {
    registrantName: string;
    registryName: string;
    coRegistrantName: string;
  }) => void;
  clickType: string;
};

const EditRegistry: React.FC<Props> = props => {
  const [date, setDate] = useState(moment(props.eventDate, "DD MMM, YYYY"));
  const [apiDate, setApiDate] = useState(
    moment(props.eventDate, "DD MMM, YYYY")
  );
  const [updateProfile, setUpdateProfile] = useState(false);

  const { bridalProfile } = useContext(BridalContext);

  const { mobile } = useSelector((state: AppState) => state.device);

  let pickerRef: any = null;

  const onChange = (date: Date) => {
    setDate(moment(date));
    setApiDate(moment(date));
  };

  // changeScreen() {
  // props.close_popup();
  // props.update_address();
  // }

  const dispatch = useDispatch();

  const saveDate = () => {
    const currentDate = moment(date).format("DD MMM, YYYY");
    const currentApiDate = moment(apiDate).format("DD-MM-YYYY");
    const data = {
      eventDate: currentApiDate,
      bridalId: props.bridalId
    };

    BridalService.updateBridalEventDate(dispatch, data)
      .then(res => {
        props.changeDate(currentDate);
        dispatch(updateModal(false));
      })
      .catch(error => {
        console.log(error);
      });
  };

  // fnamevalidate() {
  //     myBlur();
  //     if (valid.checkBlank(refs.Fname.value)) {
  //         setState({
  //             f_highlight: true,
  //             fmsg: "Please enter registrant's name"
  //         })
  //     } else {
  //         setState({
  //             f_highlight: false,
  //             fmsg: ''
  //         })
  //     }
  // }

  // lnamevalidate() {
  //     myBlur();
  //     if (valid.checkBlank(refs.Lname.value)) {
  //         setState({
  //             l_highlight: true,
  //             lmsg: "Please enter co-registrant's name"
  //         })
  //     } else {
  //         setState({
  //             l_highlight: false,
  //             lmsg: ''
  //         })
  //     }
  // }

  // myBlur() {

  //     let change = false;
  //     if (valid.checkBlank(refs.Fname.value)) {
  //         change = true;
  //     }

  //     if (valid.checkBlank(refs.Lname.value)) {
  //         change = true;
  //     }

  //     if (change) {
  //         setState({
  //             updateProfile: false
  //         })
  //     } else {
  //         setState({
  //             updateProfile: true
  //         })
  //     }
  //     return change;
  // }
  const BridalNameFormRef = useRef<Formsy>(null);

  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    // const { registrantName, coRegistrantName, registryName } = model;
    if (!updateProfile) return false;
    const data = {
      bridalId: props.bridalId,
      ...model
    };
    BridalService.updateBridalNames(dispatch, data)
      .then(res => {
        props.changeName(model);
      })
      .catch(error => {
        // console.log(error);
      });
  };

  // componentDidMount() {
  //     if (props.clickType == 'name') {
  //         refs.Fname.value = props.bridal_detail.registrant_name || "";
  //         refs.Lname.value = props.bridal_detail.co_registrant_name || "";
  //         refs.regname.value = props.bridal_detail.registry_name || "";
  //         forceUpdate();
  //     }

  // }
  const registrantNameRef = useRef<HTMLInputElement>(null);
  const coRegistrantNameRef = useRef<HTMLInputElement>(null);
  const regName = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const registrantName = registrantNameRef.current?.value;
    const coRegistrantName = coRegistrantNameRef.current?.value;

    if (registrantName && coRegistrantName && !updateProfile) {
      setUpdateProfile(true);
    } else if ((!registrantName || !coRegistrantName) && updateProfile) {
      setUpdateProfile(false);
    }
  };

  const OnOutsideClick = () => {
    pickerRef.setOpen(true);
  };

  const formContent = (clickType: string) => {
    switch (clickType) {
      case "date":
        return (
          <>
            <div className={styles.heading}>Edit Date</div>
            <div
              className={cs(
                styles.loginForm,
                globalStyles.voffset4,
                globalStyles.textCenter
              )}
            >
              <form>
                <ul>
                  <li className={globalStyles.relative}>
                    <DatePicker
                      startOpen={true}
                      minDate={new Date()}
                      selected={date.toDate()}
                      onChange={onChange}
                      ref={(node: any) => {
                        pickerRef = node;
                      }}
                      onClickOutside={OnOutsideClick}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                    />
                    <div
                      className={styles.calendarIcon}
                      onClick={OnOutsideClick}
                    >
                      <img src={calendarIcon} width="45" height="45" />
                    </div>
                  </li>
                  <li className={styles.blank}></li>
                  <li>
                    <input
                      type="button"
                      className={globalStyles.ceriseBtn}
                      value="SAVE DATE"
                      onClick={saveDate}
                    />
                  </li>
                </ul>
              </form>
            </div>
          </>
        );

      case "name":
        return (
          <>
            <div className={styles.heading}>Edit Details</div>
            <div className={styles.loginForm}>
              <div>
                <Formsy
                  ref={BridalNameFormRef}
                  onValidSubmit={handleSubmit}
                  // onInvalidSubmit={handleInvalidSubmit}
                >
                  <div className={styles.categorylabel}>
                    <div>
                      <FormInput
                        name="registrantName"
                        placeholder="Registrant’s  Name"
                        label={"Registrant’s Name"}
                        inputRef={registrantNameRef}
                        validations="isExisty"
                        required
                        value={bridalProfile?.registrantName || ""}
                        handleChange={handleChange}
                      />
                    </div>
                    <div>
                      <FormInput
                        name="coRegistrantName"
                        placeholder="Co-registrant’s  Name"
                        label={"Co-registrant’s  Name"}
                        inputRef={coRegistrantNameRef}
                        validations="isExisty"
                        required
                        value={bridalProfile?.coRegistrantName || ""}
                        handleChange={handleChange}
                      />
                    </div>
                    <div>
                      <FormInput
                        name="registryName"
                        inputRef={regName}
                        placeholder="Registry Name (optional)"
                        value={bridalProfile?.registryName || ""}
                        label={"Registry Name"}
                      />
                    </div>
                    <div>
                      <input
                        type="submit"
                        disabled={!updateProfile}
                        className={cs(globalStyles.ceriseBtn, {
                          [globalStyles.disabledBtn]: !updateProfile
                        })}
                        value="SAVE"
                      />
                    </div>
                  </div>
                </Formsy>
              </div>
            </div>
          </>
        );
      default:
    }
  };

  // return (
  //   <div
  //     className={
  //       mobile
  //         ? "size-block-bridal text-center"
  //         : "size-block-bridal centerpage-desktop text-center"
  //     }
  //   >
  //     <div className="cross">
  //       <i className="icon icon_cross" onClick={closePopup}></i>
  //     </div>
  //     <div className="scrolly">
  //       <div className="col-xs-10 col-xs-offset-1">{currentScreen()}</div>
  //     </div>
  //   </div>
  // );
  return (
    <div className={cs(styles.container)}>
      <div className={styles.header}>
        <CloseButton className={styles.closeBtn} />
      </div>
      <div
        className={cs(styles.innerContainer, globalStyles.textCenter, {
          [styles.innerContainerMobile]: mobile
        })}
      >
        <div>{formContent(props.clickType)}</div>
      </div>
    </div>
  );
};
export default EditRegistry;
