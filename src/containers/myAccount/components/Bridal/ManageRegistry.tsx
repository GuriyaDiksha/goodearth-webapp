import React, { useContext } from "react";
import BridalContext from "./context";
import { AddressData } from "components/Address/typings";
// import { BridalProfileData } from "./typings";

type Props = {
  // bridalAddress: AddressData;
  // bridalProfile: BridalProfileData;
  openShareLinkPopup: () => void;
  showRegistryFull: () => void;
};

const ManageRegistry: React.FC<Props> = props => {
  const { data, bridalAddress } = useContext(BridalContext);
  const {
    occasion,
    registryName,
    registrantName,
    coRegistrantName,
    // userAddress,
    eventDate
  } = data;
  const {
    line1,
    line2,
    city,
    postCode,
    state,
    countryName,
    phoneNumber
  } = bridalAddress as AddressData;
  return (
    <div className="row bridal-block">
      <div className="col-md-6 col-md-offset-3 col-xs-12 text-center popup-form-bg">
        <div className="row sp-mobile-voffset-6">
          <div className="col-xs-10 col-xs-offset-1 col-md-10 col-md-offset-1">
            <svg
              viewBox="-5 -15 50 50"
              width="80"
              height="80"
              preserveAspectRatio="xMidYMid meet"
              x="0"
              y="0"
              className="bridal-ring-cerise"
            >
              <use xlinkHref="/static/img/bridal/rings.svg#bridal-ring"></use>
            </svg>

            <div className="c22-A-I voffset2">Manage Your Registries</div>
            <div className="row">
              <div className="col-xs-12 voffset5">
                <div className="add">
                  <address className="order-block manage-add">
                    <label>{occasion}</label>
                    <p>
                      {registryName ? (
                        registryName
                      ) : (
                        <span className="">
                          {" "}
                          {registrantName} & &nbsp;{coRegistrantName}
                          &#39;s&nbsp;
                          {occasion}&nbsp; Registry
                        </span>
                      )}
                      <br />
                    </p>
                    <p className="light voffset2">
                      {line1}{" "}
                      <span className="lane2 hidden-xs hidden-sm">
                        date: {eventDate}
                      </span>
                      <br />
                      {line2} <br />
                      {city}, {postCode}
                      <br />
                      {state}, {countryName}
                      <br />
                    </p>
                    <p className="light"> {phoneNumber}</p>
                    <p className="hidden-sm hidden-lg voffset3">
                      date : {eventDate}
                    </p>
                    <p className="edit">
                      <a className="cerise" onClick={props.showRegistryFull}>
                        view details | edit
                      </a>{" "}
                      <a
                        className="lane2 black"
                        onClick={props.openShareLinkPopup}
                      >
                        share link
                      </a>
                    </p>
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRegistry;
