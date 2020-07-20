import React, { useState, useContext } from "react";
// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
// import * as valid from 'components/common/validation/validate'
// import { Props } from "./typings";
import BridalContext from "./context";

const CreateRegistry: React.FC = () => {
  const { setCurrentModule, setCurrentModuleData, data } = useContext(
    BridalContext
  );
  const [selectId, setSelectId] = useState(data.occasion ? data.occasion : "");
  // window.addEventListener("beforeunload", valid.myPpup);

  const setRegistry = (data: string) => {
    setSelectId(data);
  };

  const moveTonext = () => {
    setCurrentModule("date");
    setCurrentModuleData("create", { occasion: selectId });
  };

  return (
    <section className="gc">
      <div className="row bridal-block">
        <div className="col-md-6 col-md-offset-3 col-xs-12 text-center popup-form-bg">
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-md-10 col-md-offset-1">
              <div className="c22-A-I sp-mobile-voffset-6">
                Good Earth Registry
              </div>
              <div className="login-form create">
                <p>
                  We are delighted that you have chosen to register with us.
                </p>
                <p>
                  Please note: Our Good Earth Registry is country specific.
                  Before creating your Good Earth Registry, please select
                  country where you would like your gifts to be shipped.
                </p>
                <p>
                  To change your country please click on the change country
                  button on the header.
                </p>
                <p>
                  Your guests will view the registry in the prices & currency
                  associated with the country selected as the shipping
                  destination.
                </p>
              </div>
            </div>
            <div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 bridal-icons">
              <div className="heading">1. Create a registry</div>
              <ul className="icons bridalicon-pdp">
                <li
                  onClick={e => {
                    setRegistry("wedding");
                  }}
                  className={selectId == "wedding" ? "active" : ""}
                >
                  <svg
                    viewBox="-3 -3 46 46"
                    width="100"
                    height="100"
                    preserveAspectRatio="xMidYMid meet"
                    x="0"
                    y="0"
                    className="bridal-ring"
                  >
                    <use xlinkHref="/static/img/bridal/rings.svg#bridal-ring"></use>
                  </svg>
                </li>
                <li
                  onClick={e => {
                    setRegistry("special occasion");
                  }}
                  className={selectId == "special occasion" ? "active" : ""}
                >
                  <svg
                    viewBox="-3 -3 46 46"
                    width="100"
                    height="100"
                    preserveAspectRatio="xMidYMid meet"
                    x="0"
                    y="0"
                    className="bridal-ring"
                  >
                    <use xlinkHref="/static/img/bridal/glasses.svg#bridal-glasses"></use>
                  </svg>
                </li>
              </ul>
              <ul className="txt">
                <li>wedding</li>
                <li>special occasion</li>
              </ul>
            </div>
            <div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
              <input
                type="button"
                value="PROCEED TO SET THE DATE"
                className={selectId ? "cerise-btn" : "cerise-btn disabled-btn"}
                disabled={selectId ? false : true}
                onClick={moveTonext}
              />
            </div>
          </div>
          <div className="row text-center voffset4">
            <div className="col-xs-12">
              {selectId ? (
                <i
                  className="arrow-down cursor-pointer"
                  onClick={moveTonext}
                ></i>
              ) : (
                <i className="arrow-down"></i>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateRegistry;
