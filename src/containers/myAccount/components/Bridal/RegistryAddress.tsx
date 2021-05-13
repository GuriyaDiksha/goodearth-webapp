import React, { useContext, useEffect } from "react";

// import {render} from 'react-dom';
// import * as mapper from "mappers/header"
// import {connect} from 'react-redux'
// import InputField from 'components/common/signin/inputField'
// import axios from 'axios';
// import Config from 'components/config'
// import AddressMainComponent from '../../components/common/address/addressMain';
// import { Props } from "./typings";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import BridalContext from "./context";
import { AddressContext } from "components/Address/AddressMain/context";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import AddressService from "services/address";
import { updateAddressList } from "actions/address";

const RegistryAddress: React.FC<{ children: React.ReactNode }> = props => {
  // const [ showAddresses, setShowAddresses ] = useState(true);
  const { mobile } = useSelector((state: AppState) => state.device);
  // data: [],
  // showAddresses: true,
  // newAddressMode: false,
  // editMode: false

  const { isBridal, setCurrentModule } = useContext(BridalContext);
  const {
    mode,
    currentCallBackComponent,
    openAddressForm,
    closeAddressForm
  } = useContext(AddressContext);
  const dispatch = useDispatch();
  useEffect(() => {
    AddressService.fetchAddressList(dispatch).then(addressList => {
      dispatch(updateAddressList(addressList));
    });
  }, []);

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

  // const setBridalStep = () => {
  // setCurrentModule("address");

  // setAddressModeProfile({showAddresses: true, editMode: false, newAddressMode: false, addressesAvailable: false});
  // };

  // const renderActions = function() {
  //   if (isActive && isLoggedIn) {
  //     const clickAction =
  //       mode == "list" ? openNewAddressForm : backToAddressList;
  //     const fullText =
  //       mode == "new" || mode == "edit"
  //         ? "< BACK TO SAVED ADDRESSES"
  //         : "[+] ADD NEW ADDRESS";
  //     const mobileText =
  //       mode == "new" || mode == "edit" ? "< BACK" : "[+] ADD ADDRESS";
  //     if (isBridal && activeStep == Steps.STEP_SHIPPING) return "";
  //     return (
  //       <div
  //         className={cs(
  //           bootstrapStyles.col6,
  //           bootstrapStyles.colMd6,
  //           styles.small,
  //           globalStyles.textRight
  //         )}
  //       >
  //         <div
  //           className={cs(styles.formSubheading, globalStyles.pointer)}
  //           onClick={clickAction}
  //         >
  //           {mobile ? <span>{mobileText}</span> : <span>{fullText}</span>}
  //         </div>
  //       </div>
  //     );
  //   }
  // };

  return (
    <>
      {isBridal && mode == "list" ? (
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
              onClick={() => setCurrentModule("details")}
            ></i>
            <p
              className={styles.backGc}
              onClick={() => setCurrentModule("details")}
            >
              <a>Back To Your Details</a>
            </p>
          </div>
        </div>
      ) : (
        ""
      )}

      {(mode == "new" || mode == "edit") &&
        currentCallBackComponent == "bridal" && (
          <div
            className={cs(
              globalStyles.textLeft,
              globalStyles.voffset4,
              styles.letterSpacing1
            )}
          >
            <span
              className={cs(
                bootstrapStyles.col10,
                bootstrapStyles.offset1,
                bootstrapStyles.colMd8,
                bootstrapStyles.offsetMd2,
                globalStyles.pointer
              )}
              onClick={closeAddressForm}
            >
              &lt; &nbsp;SAVED ADDRESSES
            </span>
          </div>
        )}
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          {
            [cs(bootstrapStyles.colMd8, bootstrapStyles.offsetMd2)]:
              mobile || mode == "edit" || mode == "new"
          },
          {
            [cs(bootstrapStyles.colMd10, bootstrapStyles.offsetMd1)]:
              !mobile && mode == "list"
          }
        )}
      >
        {isBridal && mode == "list" && (
          <div className={cs(styles.gcHead, globalStyles.voffset4)}>
            {" "}
            4. SHIPPING ADDRESS
          </div>
        )}
        {!isBridal && (
          <div
            className={cs(globalStyles.c22AI, globalStyles.spMobileVoffset6)}
          >
            {" "}
            Manage Your Addresses
          </div>
        )}
        {(mode == "edit" || mode == "new") && isBridal && (
          <div className={cs(globalStyles.textCenter, globalStyles.c22AI)}>
            Manage Shipping Address
          </div>
        )}
        {isBridal ? (
          ""
        ) : (
          <div className={globalStyles.c10LR}>
            Add multiple billing and shipping addresses.
          </div>
        )}

        {isBridal && mode == "list" && (
          <div
            className={cs(
              styles.formSubheading,
              styles.formHeading,
              globalStyles.pointer
            )}
            onClick={() => {
              openAddressForm();
            }}
          >
            {mobile ? (
              <span>[+] ADD ADDRESS</span>
            ) : (
              <span>[+] ADD NEW ADDRESS</span>
            )}
          </div>
        )}

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

      {isBridal && mode == "list" && (
        <div
          className={cs(
            bootstrapStyles.row,
            globalStyles.textCenter,
            globalStyles.voffset4
          )}
        >
          <div className={bootstrapStyles.col12}>
            <i className={styles.arrowDown}></i>
          </div>
        </div>
      )}
      {(mode == "edit" || mode == "new") &&
        currentCallBackComponent == "bridal" && (
          <div
            className={cs(
              globalStyles.textCenter,
              globalStyles.cerise,
              globalStyles.voffset4,
              styles.letterSpacing1
            )}
          >
            <span className={globalStyles.pointer} onClick={closeAddressForm}>
              {" "}
              &lt; &nbsp;SAVED ADDRESSES
            </span>
          </div>
        )}
    </>
  );
};

export default RegistryAddress;
