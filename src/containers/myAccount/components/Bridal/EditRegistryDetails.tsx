import React, { useState, useRef, useContext } from "react";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import BridalService from "services/bridal";
import Formsy from "formsy-react";
import FormInput from "components/Formsy/FormInput";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../styles/reactDatepicker.css";
import { BridalProfileData } from "./typings";
import BridalContext from "./context";

type Props = {
  bridalProfile?: BridalProfileData;
  bridalId: number;
  eventDate: string;
  changeDate: (date: string) => void;
  changeName: (data: {
    registrantName: string;
    registryName: string;
    coRegistrantName: string;
  }) => void;
  showManageRegistry: any;
};

const EditRegistryDetails: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const { setCurrentScreenValue, setCurrentModule } = useContext(BridalContext);
  const [updateProfile, setUpdateProfile] = useState(false);

  function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    setCurrentScreenValue("manage");
    setCurrentModule("created");
  }

  const BridalNameFormRef = useRef<Formsy>(null);

  const handleSubmit = (model: any) => {
    if (!updateProfile) return false;
    const data = {
      bridalId: props.bridalId,
      ...model
    };
    BridalService.updateBridalNames(dispatch, data)
      .then(res => {
        props.changeName(model);
        props.showManageRegistry();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const registrantNameRef = useRef<HTMLInputElement>(null);
  const coRegistrantNameRef = useRef<HTMLInputElement>(null);
  const regName = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // const registrantName = registrantNameRef.current?.value;
    // const coRegistrantName = coRegistrantNameRef.current?.value;
    // const registryName = regName.current?.value;

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

    if (
      registrantName && coRegistrantName
        ? coRegistrantName
        : "" && registryName && !updateProfile
    ) {
      setUpdateProfile(true);
    } else if (
      (!registrantName || coRegistrantName
        ? !coRegistrantName
        : "" || !registryName) &&
      updateProfile
    ) {
      setUpdateProfile(false);
    }
  };

  return (
    <div className={cs(bootstrapStyles.row, styles.bridalBlock)}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          bootstrapStyles.colMd10,
          bootstrapStyles.offsetMd1
        )}
      >
        <div className={cs(styles.backHead)}>
          <div className={cs(styles.backBtnTop)} onClick={() => scrollToTop()}>
            &lt; &nbsp;BACK
          </div>
          <div className={cs(styles.registryFormHeading)}>
            Edit Registry Details
          </div>
        </div>
        <div className={cs(styles.registryFormSubheading)}>
          Manage & edit your Registry details
        </div>
        <div
          id="edit-rdetails-form"
          className={cs(styles.loginForm, globalStyles.voffset6)}
        >
          <div>
            <Formsy
              ref={BridalNameFormRef}
              onValidSubmit={handleSubmit}
              // onInvalidSubmit={handleInvalidSubmit}
            >
              <div className={styles.categorylabel}>
                <div>
                  <FormInput
                    name="occasion"
                    placeholder="Occasion*"
                    label={"Occasion*"}
                    value={props.bridalProfile?.occasion}
                    disable={true}
                    className={cs(styles.disabledInput)}
                  />
                </div>
                <div>
                  <FormInput
                    name="registryName"
                    placeholder="Registry Name*"
                    label={"Registry Name*"}
                    inputRef={regName}
                    validations={{
                      maxLength: 50,
                      isExisty: true
                    }}
                    validationErrors={{
                      maxLength: "You can not enter more than 50 characters"
                    }}
                    required
                    value={props.bridalProfile?.registryName || ""}
                    handleChange={handleChange}
                  />
                </div>
                <div>
                  <FormInput
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
                    value={props.bridalProfile?.registrantName || ""}
                    handleChange={handleChange}
                  />
                </div>
                <div>
                  <FormInput
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
                    value={props.bridalProfile?.coRegistrantName || ""}
                    handleChange={handleChange}
                  />
                </div>
                {/* <div className={cs(styles.datePicker)}>
                    <DatePicker
                        startOpen={true}
                        minDate={new Date()}
                        selected={date.toDate()}
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
                </div> */}
                <div>
                  <input
                    type="submit"
                    // onClick={props.showManageRegistry}
                    disabled={!updateProfile}
                    className={cs(globalStyles.charcoalBtn, {
                      [globalStyles.disabledBtn]: !updateProfile
                    })}
                    value="UPDATE DETAILS"
                  />
                </div>
              </div>
            </Formsy>
            <div className={cs(styles.GoBackCta)} onClick={() => scrollToTop()}>
              CANCEL & GO BACK
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditRegistryDetails;
