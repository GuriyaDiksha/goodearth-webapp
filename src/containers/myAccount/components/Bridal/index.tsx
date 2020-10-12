import React, { useState, useEffect, useContext } from "react";
import { AddressData } from "components/Address/typings";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import CreateRegistry from "./CreateRegistry";
import DateSelect from "./DateSelect";
import BridalDetails from "./BridalDetails";
import AddressMain from "components/Address/AddressMain";
import RegistryCreated from "./RegistryCreated";
import BridalPop from "./BridalPop";
import ManageRegistry from "./ManageRegistry";
import ManageRegistryFull from "./ManageRegistryFull";
// import ManageAddress from './manageaddress'
import ShareLink from "./ShareLink";
import { confirmPopup } from "utils/validate";
import { BridalDetailsType, BridalProfileData } from "./typings";

import BridalContext from "./context";
import { updateComponent, updateModal } from "actions/modal";
import BridalService from "services/bridal";
import AddressService from "services/address";
import { AddressContext } from "components/Address/AddressMain/context";
import { updateAddressList } from "actions/address";
import { updateUser } from "actions/user";

type Props = {
  bridalId: number;
};

const Bridal: React.FC<Props> = props => {
  // const [ addressData, setAddressData ] = useState<AddressData>();
  const [bridalDetails, setBridalDetails] = useState<BridalDetailsType>({
    occasion: "",
    registrantName: "",
    registryName: "",
    coRegistrantName: "",
    userAddress: undefined,
    eventDate: ""
  });
  const [currentSection, setCurrentSection] = useState("create");
  const [currentScreenValue, setCurrentScreenValue] = useState("manage");
  const [bridalAddress, setBridalAddress] = useState<AddressData>();
  const [bridalProfile, setBridalProfile] = useState<BridalProfileData>();
  // const [ showPopup, setShowPopup ] = useState(false);
  const [shareLink, setShareLink] = useState("");
  // const [ showpop, setShowpop ] = useState(false);
  // const { mobile } = useSelector((state: AppState) => state.device);
  const { currency, user } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const getBridalProfileData = () => {
    BridalService.fetchBridalProfile(dispatch, props.bridalId).then(data => {
      if (data) {
        setBridalProfile(data);
        setShareLink(`${__API_HOST__}/${data.shareLink}`);
        dispatch(
          updateUser(
            Object.assign({}, user, {
              bridalId: data.bridalId,
              bridalCurrency: data.currency
            })
          )
        );
      }
    });
  };

  // componentWillMount() {
  // if (props.bridalId != 0) {
  //     axios.get(Config.hostname + `myapi/addressdetails/`)
  //         .then(res => {
  //             let items = res.data.Address;
  //             for (let i = 0; i < items.length; i++) {
  //                 if (items[i].is_bridal) {
  //                     setState({bridalAddress: items[i]});
  //                     break;
  //                 }
  //             }
  //         }).catch((err) => {
  //         console.error('Axios Error: ', err);
  //     });
  //     getBridalProfileData();
  // }

  // }

  useEffect(() => {
    AddressService.fetchAddressList(dispatch).then(addressList => {
      dispatch(updateAddressList(addressList));
      const bridalAddress = addressList.filter(address => address.isBridal)[0];
      if (bridalAddress) {
        setBridalAddress(bridalAddress);
      }
    });
    getBridalProfileData();
    return () => {
      window.removeEventListener("beforeunload", confirmPopup);
    };
  }, []);
  const openBridalPop = () => {
    dispatch(updateComponent(<BridalPop />, true));
    dispatch(updateModal(true));
  };

  const openShareLinkPopup = () => {
    if (shareLink) {
      dispatch(
        updateComponent(
          <ShareLink
            // changeScreen={closePopup}
            shareUrl={shareLink}
            // bridalDetails={bridalDetails}
          />,
          true
        )
      );
      dispatch(updateModal(true));
    }
  };
  const setCurrentModule = (data: string) => {
    setCurrentSection(data);
  };

  const { isAddressValid, openAddressForm } = useContext(AddressContext);

  const changeAddress = () => {
    AddressService.fetchAddressList(dispatch)
      .then(data => {
        const items = data;
        for (let i = 0; i < items.length; i++) {
          if (items[i].isBridal) {
            setBridalAddress(items[i]);
            break;
          }
        }
      })
      .catch(err => {
        console.error("Axios Error: ", err.response.data);
      });
  };

  const setCurrentModuleData = (
    section: string,
    obj: Partial<BridalDetailsType>
  ) => {
    if (bridalDetails) {
      const {
        occasion,
        eventDate,
        registrantName,
        coRegistrantName,
        registryName,
        userAddress
      } = obj;
      const newBridalDetails: BridalDetailsType = bridalDetails;
      switch (section) {
        case "create":
          newBridalDetails["occasion"] = occasion ? occasion : "";
          break;
        case "date":
          newBridalDetails["eventDate"] = eventDate ? eventDate : "";
          break;
        case "details":
          newBridalDetails["registrantName"] = registrantName
            ? registrantName
            : "";
          newBridalDetails["coRegistrantName"] = coRegistrantName
            ? coRegistrantName
            : "";
          newBridalDetails["registryName"] = registryName ? registryName : "";
          break;
        case "address":
          if (userAddress) {
            const isValid =
              userAddress.country == "IN"
                ? isAddressValid(userAddress.postCode, userAddress.state)
                : true;
            if (isValid) {
              // this.props.onSelectAddress(address);
              newBridalDetails["userAddress"] = userAddress;
              setCurrentModule("created");
            } else {
              // this.manageAddressPostcode("edit", address);
              openAddressForm(userAddress);
            }
          }

          break;
      }
      setBridalDetails(newBridalDetails);
    }
  };

  const createRegistry = () => {
    const { userAddress, ...rest } = bridalDetails;
    if (userAddress) {
      const formData = {
        userAddressId: userAddress.id,
        ...rest,
        currency,
        actionType: "create"
      };

      BridalService.saveBridalProfile(dispatch, formData)
        .then(data => {
          if (data) {
            window.removeEventListener("beforeunload", confirmPopup);
            const updatedUser = Object.assign({}, user, {
              bridalId: data.bridalId,
              bridalCurrency: currency
            });
            dispatch(updateUser(updatedUser));
            openBridalPop();
          }
        })
        .catch(err => {
          // setState({
          //     showerror: "Something went Wrong"
          // })
        });
    }
  };

  // const changeScreen = () => {
  // setState({
  //     showPopup: true
  // })
  // }

  // closePopup() {
  //     setState({
  //         showPopup: false
  //     })
  // }

  // closeInsPopup() {
  //     setState({
  //         showpop: false
  //     })
  // }

  const showManageRegistry = () => {
    getBridalProfileData();
    setCurrentScreenValue("manage");
  };

  const showManageAddressComponent = () => {
    setCurrentScreenValue("editRegistryAddress");
  };

  // const setManageRegistryFull = () => {
  //   setCurrentScreenValue("manageregistryfull");
  // };

  const setSelectedSection = () => {
    switch (currentSection) {
      case "create":
        return <CreateRegistry />;
      case "date":
        return <DateSelect />;
      case "details":
        return <BridalDetails />;
      case "address":
        return (
          <AddressMain
            isBridal={true}
            currentCallBackComponent="bridal"
            addressType="SHIPPING"
            error=""
            addresses={[]}
          />
        );
      // return <ManageAddress isbridal={true}
      //                       setCurrentModule={setCurrentModule}
      //                       setCurrentModuleData={setCurrentModuleData}
      //                       currentCallBackComponent="bridal"
      //                       addressType="SHIPPING" case="create"/>
      case "created":
        return <RegistryCreated createRegistry={createRegistry} />;
      default:
    }
  };

  const changeBridalAddress = (addressId: number) => {
    const data = {
      bridalId: props.bridalId,
      addressId
    };
    BridalService.updateBridalAddress(dispatch, data).then(data => {
      setBridalProfile(data);
      setShareLink(`${__API_HOST__}/${data.shareLink}`);
      changeAddress();
      setCurrentScreenValue("manageregistryfull");
    });
  };

  // onEditAddress(data) {
  //     // console.log(data)
  // }

  // setMode(value) {
  //     setState({
  //         editMode: value
  //     })
  // }

  // setAddressModeProfile(modes) {
  //     setState(modes)
  // }

  const currentScreen = () => {
    switch (currentScreenValue) {
      case "manage": {
        // const addressData = bridalAddress;
        // const bridalData = bridalDetail;
        if (bridalAddress && bridalProfile) {
          if (
            Object.keys(bridalAddress).length &&
            Object.keys(bridalProfile).length
          ) {
            return (
              <ManageRegistry
                // bridalAddress={bridalAddress}
                // bridalProfile={bridalProfile}
                openShareLinkPopup={openShareLinkPopup}
                showRegistryFull={() =>
                  setCurrentScreenValue("manageregistryfull")
                }
              />
            );
          }
        }
        break;
      }
      case "manageregistryfull": {
        // let aData = bridalAddress;
        // let bData = bridalDetail;
        if (bridalAddress && bridalProfile) {
          if (
            Object.keys(bridalAddress).length &&
            Object.keys(bridalProfile).length
          ) {
            return (
              <ManageRegistryFull
                // bridalAddress={bridalAddress}
                openShareLinkPopup={openShareLinkPopup}
                // bridalProfile={bridalProfile}
                // bid={props.bridalId}
                // changeAddress={changeAddress}
                key={1}
                // getBridalProfileData={getBridalProfileData}
                showManageRegistry={showManageRegistry}
                // mobile={mobile}
                showManageAddressComponent={showManageAddressComponent}
              />
            );
          }
        }
        break;
      }
      case "editRegistryAddress":
        return (
          <AddressMain
            isBridal={true}
            addressType={"SHIPPING"}
            error=""
            addresses={[]}
            // changeBridalAddress={changeBridalAddress}
            // setAddressModeProfile={setAddressModeProfile}
            // editMode={editMode}
            // setMode={setMode}
            // addressData={addressData}
            // newAddressMode={newAddressMode}
            // addressesAvailable={addressesAvailable}
            // showAddresses={showAddresses}
            // toggleAddressForm={onEditAddress} showAddressInBridalUse={true}
            currentCallBackComponent="bridal-edit"
            // step="manage"
            // shouldShowBackButton={true}
            // showAllAddresses="true"
            key="k123"
          />
        );
      // break;
      default:
        break;
    }
  };
  return (
    <BridalContext.Provider
      value={{
        isBridal: true,
        step: currentSection,
        // bridalItems: bridalItems,
        bridalAddress: bridalAddress,
        data: bridalDetails,
        setCurrentModule: setCurrentModule,
        setCurrentModuleData: setCurrentModuleData,
        setCurrentScreenValue: setCurrentScreenValue,
        changeBridalAddress: changeBridalAddress
      }}
    >
      <div className="bridal-registry">
        {props.bridalId != 0 ? currentScreen() : setSelectedSection()}
      </div>
    </BridalContext.Provider>
  );
};
export default Bridal;
