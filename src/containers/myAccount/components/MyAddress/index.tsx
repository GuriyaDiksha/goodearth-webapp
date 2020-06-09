import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { AddressData } from "../../../../components/Address/typings";
import AddressList from "components/Address/AddressList";
import AddressForm from "../../../../components/Address/AddressForm";
import { AddressContext } from "./context";
import { Props, AddressModes } from "./typings";

// import AddressDataList from "../../../../components/Address/AddressDataList.json";

// import AddressMainComponent from '../../components/common/address/addressMain';

const MyAddress: React.FC<Props> = props => {
  // data: [],
  // showAddresses: true,
  // newAddressMode: false,
  // editMode: false

  const [showDefaultAddressOnly] = useState(false);
  const addressList = useSelector((state: AppState) => state.address);
  const [editAddressData, setEditAddressData] = useState<AddressData | null>(
    null
  );
  const [mode, setMode] = useState<AddressModes>("list");
  // const [ editAddresaData, setEditAddressData ] = useState(null);

  // manageAddress(data, index) {
  //     props.changeMode(data, this.state.data[index]);
  // }

  // onClickBack() {
  //     props.setCurrentModule('details');
  // }

  // isDefaultAddress(address) {
  //     return address.is_default_for_shipping;
  // }

  // setAddressAvailable(data) {
  //     this.setState({
  //         addressesAvailable: data
  //     })
  // }

  // setMode(value) {
  //     this.setState({
  //         editMode: value
  //     })
  // }

  // setAddressModeProfile(modes) {
  //     this.setState(modes)
  // }

  // setBridalStep() {
  //     props.setCurrentModule('address');
  //     this.setAddressModeProfile({showAddresses: true, editMode: false, newAddressMode: false, addressesAvailable: false});
  // }

  const openAddressForm = useCallback((address?: AddressData) => {
    // if (addressMode == "new") {
    //     this.showEditForm({showAddresses: false, addressData: "", editMode: false, newAddressMode: true});
    //     this.props.setAddressModeProfile({showAddresses: false, addressData: "", editMode: false, newAddressMode: true});
    // }
    if (address) {
      setEditAddressData(address);
      setMode("edit");
    } else {
      setMode("new");
      setEditAddressData(null);
    }
  }, []);

  const closeAddressForm = useCallback(() => {
    setMode("list");
    window.scrollTo(0, 0);
  }, []);

  const addressContent = (
    <AddressContext.Provider
      value={{
        setMode: setMode,
        mode: mode,
        editAddressData: editAddressData,
        setEditAddressData: setEditAddressData,
        currentCallBackComponent: "account",
        openAddressForm: openAddressForm,
        closeAddressForm: closeAddressForm
      }}
    >
      <div className="row">
        <div className="row">
          {mode == "list" && (
            <div>
              <AddressList
                addressDataList={addressList}
                openAddressForm={address => null}
                deleteAddress={id => null}
                selectAddress={address => null}
                isValidAddress={() => null}
                currentCallBackComponent="account"
              />

              {!showDefaultAddressOnly && (
                <div className={globalStyles.voffset4}>
                  <ul>
                    <li>
                      <input
                        type="button"
                        className={globalStyles.ceriseBtn}
                        value="add a new address"
                        onClick={() => openAddressForm()}
                      />
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          {mode == "new" && (
            <AddressForm
              addressData={editAddressData}
              currentCallBackComponent="account"
              saveAddress={() => null}
              openAddressList={() => null}
            ></AddressForm>
          )}
          {mode == "edit" && (
            <AddressForm
              addressData={editAddressData}
              currentCallBackComponent="account"
              saveAddress={() => null}
              openAddressList={() => null}
            ></AddressForm>
          )}
        </div>
      </div>
    </AddressContext.Provider>
  );
  return (
    <div className={bootstrapStyles.row}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          bootstrapStyles.colMd10,
          bootstrapStyles.offsetMd1
        )}
      >
        <div className={styles.formHeading}>Manage Your Addresses</div>
        <div className={styles.formSubheading}>
          Add multiple billing and shipping addresses.
        </div>
        {addressContent}
      </div>
    </div>
  );
};
export default MyAddress;
