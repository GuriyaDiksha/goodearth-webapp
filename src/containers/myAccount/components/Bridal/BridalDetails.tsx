import React, { useState, useRef, useContext } from "react";
// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
import InputField from "components/signin/InputField";
// import axios from 'axios';
// import Config from 'components/config'
import * as valid from "utils/validate";
// import { Props } from "./typings";
import BridalContext from "./context";

const BridalDetails: React.FC = () => {
  // const [ data, setData] = useState<BridalDetailsType>();
  const [updateProfile, setUpdateProfile] = useState(false);
  // const [ subscribe, setSubscribe ] = useState(false);
  const [
    errorMsg
    // setErrorMsg
  ] = useState("");
  const [registrantError, setRegistrantError] = useState("");
  const [coRegistrantError, setCoRegistrantError] = useState("");

  const {
    setCurrentModule
    // setCurrentModuleData,
    // data,
  } = useContext(BridalContext);
  // componentDidMount() {
  //     refs.registrantName.value = data.registrant_name || "";
  //     refs.coRegistrantName.value = data.co_registrant_name || "";
  //     refs.regName.value = data.registry_name || "";
  //     myBlur();
  //     forceUpdate();
  // }

  const saveProfileData = () => {
    if (!updateProfile) return false;
    // setCurrentModuleData('details', {
    //     'registrant_name': refs.registrantName.value,
    //     'co_registrant_name': refs.coRegistrantName.value,
    //     'registry_name': refs.regName.value
    // });
    setCurrentModule("address");
  };

  // const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const subscribe = event.target.checked;
  //     setSubscribe(subscribe);
  //     myBlur();
  // }

  const registrantName = useRef<HTMLInputElement>(null);
  const coRegistrantName = useRef<HTMLInputElement>(null);
  const regName = useRef<HTMLInputElement>(null);

  const myBlur = () => {
    let change = false;
    if (
      valid.checkBlank(registrantName.current && registrantName.current.value)
    ) {
      change = true;
    }

    if (
      valid.checkBlank(
        coRegistrantName.current && coRegistrantName.current.value
      )
    ) {
      change = true;
    }

    if (change) {
      setUpdateProfile(false);
    } else {
      setUpdateProfile(true);
    }
  };

  const fnamevalidate = () => {
    myBlur();
    if (
      valid.checkBlank(registrantName.current && registrantName.current.value)
    ) {
      // f_highlight: true,
      setRegistrantError("Please enter registrant's name");
    } else {
      // f_highlight: false,
      setRegistrantError("");
      // })
    }
  };

  const lnamevalidate = () => {
    myBlur();
    if (
      valid.checkBlank(
        coRegistrantName.current && coRegistrantName.current.value
      )
    ) {
      // l_highlight: true,
      setCoRegistrantError("Please enter co-registrant's name");
    } else {
      // l_highlight: false,
      setCoRegistrantError("");
    }
  };

  const onClickBack = () => {
    setCurrentModule("date");
  };

  return (
    <section className="gc">
      <div className="row">
        <div className="col-md-6 col-md-offset-3 col-xs-12 text-center popup-form-bg">
          <div className="row voffset5">
            <div className="col-xs-10 col-xs-offset-1 text-center">
              <i className="arrow-up cursor-pointer" onClick={onClickBack}></i>
              <p className="back-gc">
                <a onClick={onClickBack}>Back To Set The Date</a>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
              <div className="gc-head voffset4">3. your details</div>
              <div className="login-form voffset4">
                <div>
                  <form>
                    <ul className="categorylabel">
                      <li>
                        <InputField
                          inputRef={registrantName}
                          placeholder="Registrant’s  Name"
                          label={"Registrant’s Name"}
                          value=""
                          handleChange={() => null}
                          // border={f_highlight}
                          keyUp={fnamevalidate}
                          blur={fnamevalidate}
                          error={registrantError}
                        />
                      </li>
                      <li>
                        <InputField
                          inputRef={coRegistrantName}
                          placeholder="Co-registrant’s  Name"
                          label={"Co-registrant’s  Name"}
                          // border={l_highlight}
                          value=""
                          handleChange={() => null}
                          keyUp={lnamevalidate}
                          blur={lnamevalidate}
                          error={coRegistrantError}
                        />
                      </li>
                      <li>
                        <InputField
                          inputRef={regName}
                          placeholder="Registry Name (optional)"
                          handleChange={() => null}
                          value=""
                          label={"Registry Name"}
                        />
                      </li>
                      <li>
                        {errorMsg ? (
                          <p className="common-error-msg">{errorMsg}</p>
                        ) : (
                          ""
                        )}
                        <input
                          type="button"
                          disabled={!updateProfile}
                          className={
                            updateProfile
                              ? "cerise-btn"
                              : "cerise-btn disabled-btn"
                          }
                          value={
                            updateProfile
                              ? "Proceed to add shipping details"
                              : "Proceed to add shipping details"
                          }
                          onClick={saveProfileData}
                        />
                      </li>
                    </ul>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row text-center voffset4">
            <div className="col-xs-12">
              {!updateProfile ? (
                <i className="arrow-down"></i>
              ) : (
                <i
                  className="arrow-down cursor-pointer"
                  onClick={saveProfileData}
                ></i>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BridalDetails;
