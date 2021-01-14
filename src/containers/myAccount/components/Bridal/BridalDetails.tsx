import React, { useState, useRef, useContext, createRef } from "react";
import BridalContext from "./context";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import Formsy from "formsy-react";
import FormInput from "../../../../components/Formsy/FormInput";

const BridalDetails: React.FC = () => {
  const { setCurrentModule, setCurrentModuleData, data } = useContext(
    BridalContext
  );

  const [updateProfile, setUpdateProfile] = useState(
    data.coRegistrantName && data.registrantName ? true : false
  );
  const BridalDetailsFormRef = createRef<Formsy>();

  const handleSubmit = (
    model: any,
    resetForm: any,
    updateInputsWithError: any
  ) => {
    const { registrantName, coRegistrantName, registryName } = model;
    if (!updateProfile) return false;
    setCurrentModuleData("details", {
      registrantName: registrantName.trim(),
      coRegistrantName: coRegistrantName.trim(),
      registryName: registryName.trim()
    });
    setCurrentModule("address");
  };

  const registrantNameRef = useRef<HTMLInputElement>(null);
  const coRegistrantNameRef = useRef<HTMLInputElement>(null);
  const regName = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const registrantName =
      registrantNameRef.current?.value.trim() == ""
        ? ""
        : registrantNameRef.current?.value;
    const coRegistrantName =
      coRegistrantNameRef.current?.value.trim() == ""
        ? ""
        : coRegistrantNameRef.current?.value;

    if (registrantName && coRegistrantName && !updateProfile) {
      setUpdateProfile(true);
    } else if ((!registrantName || !coRegistrantName) && updateProfile) {
      setUpdateProfile(false);
    }
  };

  return (
    <>
      <div className={cs(bootstrapStyles.row, globalStyles.voffset5)}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            globalStyles.textCenter
          )}
        >
          <i
            className={cs(styles.arrowUp, globalStyles.pointer)}
            onClick={() => setCurrentModule("date")}
          ></i>
          <p className={styles.backGc}>
            <a onClick={() => setCurrentModule("date")}>Back To Set The Date</a>
          </p>
        </div>
      </div>
      <div className={bootstrapStyles.row}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2
          )}
        >
          <div className={cs(styles.gcHead, globalStyles.voffset4)}>
            3. your details
          </div>
          <div className={cs(styles.loginForm, globalStyles.voffset4)}>
            <div>
              <Formsy
                ref={BridalDetailsFormRef}
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
                      value={data.registrantName || ""}
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
                      value={data.coRegistrantName || ""}
                      handleChange={handleChange}
                    />
                  </div>
                  <div>
                    <FormInput
                      name="registryName"
                      inputRef={regName}
                      placeholder="Registry Name (optional)"
                      value={data.registryName || ""}
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
                      value="Proceed to add shipping details"
                    />
                  </div>
                </div>
              </Formsy>
            </div>
          </div>
        </div>
      </div>
      <div
        className={cs(
          bootstrapStyles.row,
          globalStyles.textCenter,
          globalStyles.voffset4
        )}
      >
        <div className={bootstrapStyles.col12}>
          {!updateProfile ? (
            <i className={styles.arrowDown}></i>
          ) : (
            <i
              className={cs(styles.arrowDown, globalStyles.pointer)}
              onClick={() => BridalDetailsFormRef.current?.submit()}
            ></i>
          )}
        </div>
      </div>
    </>
  );
};

export default BridalDetails;
