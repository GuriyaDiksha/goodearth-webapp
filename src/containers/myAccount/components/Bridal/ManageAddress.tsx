import React, { useContext } from "react";

// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
// import InputField from 'components/common/signin/inputField'
// import axios from 'axios';
// import Config from 'components/config'
// import AddressMainComponent from '../../components/common/address/addressMain';
// import { Props } from "./typings";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import BridalContext from "./context";
import { AddressContext } from "components/Address/AddressMain/context";

const ManageAddress: React.FC<{ children: React.ReactNode }> = props => {
  // const [ showAddresses, setShowAddresses ] = useState(true);
  const { mobile } = useSelector((state: AppState) => state.device);
  // data: [],
  // showAddresses: true,
  // newAddressMode: false,
  // editMode: false

  const { isBridal, setCurrentModule, currentCallBackComponent } = useContext(
    BridalContext
  );
  const { mode } = useContext(AddressContext);
  // const manageAddress = (data, index) => {
  //     props.changeMode(data, state.data[index]);
  // }

  // isDefaultAddress(address) {
  //     return address.is_default_for_shipping;
  // }

  // setAddressAvailable(data) {
  //     setState({
  //         addressesAvailable: data
  //     })
  // }

  // setMode(value) {
  //     setState({
  //         editMode: value
  //     })
  // }

  // setAddressModeProfile(modes) {
  //     setState(modes)
  // }

  const setBridalStep = () => {
    setCurrentModule("address");
    // setAddressModeProfile({showAddresses: true, editMode: false, newAddressMode: false, addressesAvailable: false});
  };

  return (
    <section className={isBridal ? "gc paddTop-80" : ""}>
      <div className="row">
        <div className="col-md-6 col-md-offset-3 col-xs-12 text-center popup-form-bg card card-open checkout">
          {isBridal && mode == "list" ? (
            <div className="row voffset5">
              <div className="col-xs-10 col-xs-offset-1 text-center">
                <i
                  className="arrow-up cursor-pointer"
                  onClick={() => setCurrentModule("details")}
                ></i>
                <p
                  className="back-gc"
                  onClick={() => setCurrentModule("details")}
                >
                  <a>Back To Your Details</a>
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="row">
            {(mode == "new" || mode == "edit") &&
              currentCallBackComponent == "bridal" && (
                <div className="manage-registry text-left voffset4 letter-spacing1">
                  <span
                    className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 cursor-pointer"
                    onClick={setBridalStep}
                  >
                    &lt; &nbsp;SAVED ADDRESSES
                  </span>
                </div>
              )}
            <div
              className={
                mobile
                  ? "col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2"
                  : mode == "edit" || mode == "new"
                  ? "col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2"
                  : "col-xs-10 col-xs-offset-1 col-md-10 col-md-offset-1"
              }
            >
              {isBridal && mode == "list" && (
                <div className="gc-head voffset4"> 4. SHIPPING ADDRESS</div>
              )}
              {!isBridal && (
                <div className="c22-A-I sp-mobile-voffset-6">
                  {" "}
                  Manage Your Addresses
                </div>
              )}
              {(mode == "edit" || mode == "new") && isBridal && (
                <div className="text-center c22-A-I">
                  Manage Shipping Address
                </div>
              )}
              {isBridal ? (
                ""
              ) : (
                <div className="c10-L-R">
                  Add multiple billing and shipping addresses.
                </div>
              )}
              <div className="row">
                {props.children}
                {/* <AddressMain
                                    
                                    // showAllAddresses={state.showAddresses}
                                    // editMode={state.editMode}
                                    // newAddressMode={state.newAddressMode}
                                    // setAddressAvailable={setAddressAvailable}
                                    // setMode={setMode}
                                    // setCurrentModule={setCurrentModule}
                                    // addressesAvailable={state.addressesAvailable}
                                    // setAddressModeProfile={setAddressModeProfile}
                                    // setCurrentModuleData={setCurrentModuleData}
                                    currentCallBackComponent={currentCallBackComponent || ""}
                                    isBridal={isBridal || false}
                                    // isCeriseClubMember={props.isCeriseClubMember}
                                    // addressType={props.addressType}
                                    // isLoggedIn={window.user.email ? true : false} 
                                    /> */}
              </div>
            </div>
          </div>
          {isBridal && mode == "list" && (
            <div className="row text-center voffset4">
              <div className="col-xs-12">
                <i className="arrow-down"></i>
              </div>
            </div>
          )}
          {(mode == "edit" || mode == "new") &&
            currentCallBackComponent == "bridal" && (
              <div className="manage-registry text-center cerise voffset4 letter-spacing1">
                <span className="cursor-pointer" onClick={setBridalStep}>
                  {" "}
                  &lt; &nbsp;SAVED ADDRESSES
                </span>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default ManageAddress;
