import React, { useContext } from "react";
// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
// import DatePicker from 'react-datepicker';
// import moment from 'moment';
import BridalContext from "./context";
import { Props } from "./typings";
// import 'react-datepicker/dist/react-datepicker.css';
// import axios from 'axios';
// import Config from 'components/config'

const RegistryCreated: React.FC<Props> = props => {
  // data: [],
  // const [updateDate, setUpdateDate ] = useState(false);
  // const [subscribe, setSubscribe ] = useState(false);

  // const [date, setDate ] = useState(moment());
  const {
    setCurrentModule,
    // setCurrentModuleData,
    data
  } = useContext(BridalContext);

  // const onChange = (date: Date) => {
  //         setDate(moment(date));
  //         setUpdateDate(true);
  // }

  const onClickBack = () => {
    setCurrentModule("address");
  };

  const saveBridalDate = () => {
    props.createRegistry();
  };

  return (
    <section className="gc paddTop-80">
      <div className="row rc">
        <div className="col-md-6 col-md-offset-3 col-xs-12 text-center popup-form-bg">
          <div className="row voffset5">
            <div className="col-xs-10 col-xs-offset-1 text-center">
              <i className="arrow-up cursor-pointer" onClick={onClickBack}></i>
              <p className="back-gc" onClick={onClickBack}>
                Back To Shipping Address
              </p>
            </div>
          </div>
          <div className="row voffset6">
            <div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
              <div className="text-center">
                <svg
                  viewBox="-3 -3 46 46"
                  width="80"
                  height="80"
                  preserveAspectRatio="xMidYMid meet"
                  x="0"
                  y="0"
                  className="bridal-ring"
                >
                  <use xlinkHref="/static/img/bridal/rings.svg#bridal-ring"></use>
                </svg>
              </div>
              <div
                className={
                  data.registryName ? "c22-A-I lh40" : "c22-A-I lh40 txt-cap"
                }
              >
                {data.registryName
                  ? data.registryName
                  : data.registrantName +
                    " & " +
                    data.coRegistrantName +
                    "'s"}{" "}
                {data.registryName ? (
                  ""
                ) : (
                  <span className="txt-cap"> {data.occasion} Registry </span>
                )}{" "}
              </div>
              <div className="c10-L-R voffset2">
                Congratulations, your registry has been successfully created!
                Now you can start adding items to your list.
              </div>
              <div className="login-form voffset4 text-center">
                <form>
                  <ul className="categorylabel">
                    <li>
                      <input
                        type="button"
                        className="cerise-btn"
                        value="start adding to registry"
                        onClick={saveBridalDate}
                      />
                    </li>
                  </ul>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistryCreated;
