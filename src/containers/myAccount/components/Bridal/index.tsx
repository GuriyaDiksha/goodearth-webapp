import React, { useState, useEffect } from "react";
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
// import ManageRegistryAddress from './manageregistryaddress'
// import ManageAddress from './manageaddress'
import ShareLink from "./ShareLink";
import * as valid from "utils/validate";
import { BridalDetailsType, BridalProfileData } from "./typings";

import BridalContext from "./context";
import { updateComponent, updateModal } from "actions/modal";
import BridalService from "services/bridal";
// import AddressService from "services/address";

type Props = {
  id: number;
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
  const [
    bridalAddress
    //  setBridalAddress
  ] = useState<AddressData>();
  const [
    bridalDetail
    // setBridalDetail
  ] = useState<BridalProfileData>();
  // const [ showPopup, setShowPopup ] = useState(false);
  const [
    shareLink
    // setShareLink
  ] = useState("");
  // const [ showpop, setShowpop ] = useState(false);
  // const { mobile } = useSelector((state: AppState) => state.device);
  const { currency } = useSelector((state: AppState) => state);

  // const getBridalProfileData = () => {
  //     BridalService.fetchBridalProfile(dispatch, props.id)
  //         .then(data => {
  //             if (data) {
  //                 setBridalDetail(data);
  //                 setShareLink(`${__API_HOST__}/${data.shareLink}`);
  //             }
  //         });
  // }

  // componentWillMount() {
  //     if (props.id != 0) {
  //         axios.get(Config.hostname + `myapi/addressdetails/`)
  //             .then(res => {
  //                 let items = res.data.Address;
  //                 for (let i = 0; i < items.length; i++) {
  //                     if (items[i].is_bridal) {
  //                         setState({bridalAddress: items[i]});
  //                         break;
  //                     }
  //                 }
  //             }).catch((err) => {
  //             console.error('Axios Error: ', err);
  //         });
  //         getBridalProfileData();
  //     }

  // }
  const dispatch = useDispatch();
  useEffect(() => {
    return window.removeEventListener("beforeunload", valid.myPpup);
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

  // const changeAddress = () => {
  //     AddressService.fetchAddressList(dispatch)
  //         .then(data => {
  //             let items = data;
  //             for (let i = 0; i < items.length; i++) {
  //                 if (items[i].isBridal) {
  //                     setBridalAddress(items[i]);
  //                     break;
  //                 }
  //             }
  //         }).catch((err) => {
  //         console.error('Axios Error: ', err.response.data);
  //     });
  // }

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
          newBridalDetails["userAddress"] = userAddress as AddressData;
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
          if (data.Details[0]) {
            window.removeEventListener("beforeunload", valid.myPpup);
            document.cookie =
              "bridal_id=" +
              data.Details[0].bridal_id +
              "; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
            document.cookie =
              "bridal_currency=" +
              data.Details[0].currency +
              "; expires=Sat, 01 Jan 2050 00:00:01 UTC; path=/";
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

  // const showManageRegistry = () => {
  //     getBridalProfileData();
  //     setCurrentScreenValue("manage");
  // }

  // const showManageAddressComponent = () => {
  //     setCurrentScreenValue("manageAddresses");
  // }

  const setManageRegistry = () => {
    setCurrentScreenValue("manageregistryaddress");
  };

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

  // const changeBridalAddress = (addressId: number) => {
  //     const  data = {
  //         bridalId: props.id,
  //         addressId
  //     }
  //     BridalService.updateBridalAddress(dispatch, data)
  //         .then((data) => {
  //             setBridalDetail(data);
  //             setShareLink(`${__API_HOST__}/${data.shareLink}`);
  //             changeAddress();
  //             setManageRegistry();
  //         })
  // }

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

  // getManageAddress() {
  //     let html = [];
  //     html.push(<div className="row bridal-block">
  //         <div className="col-md-6 col-md-offset-3 col-xs-12 text-center popup-form-bg">
  //             <div className="row sp-mobile-voffset-6">
  //                 <div className={editMode?"col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 checkout":"col-xs-10 col-xs-offset-1 col-md-10 col-md-offset-1 checkout"}>
  //                     <div className="manage-registry text-left voffset4 letter-spacing1"><span
  //                         className="cursor-pointer" onClick={setManageRegistry} dangerouslySetInnerHTML={{__html: editMode?"":'&lt; &nbsp;MANAGE REGISTRY'}}>
  //                         </span></div>
  //                     <div className="text-center c22-A-I">{editMode?"Edit Address":'Saved Addresses'}</div>
  //                     <AddressMainComponent changeBridalAddress={changeBridalAddress}
  //                                           setAddressModeProfile={setAddressModeProfile}
  //                                           editMode={editMode}
  //                                           setMode={setMode}
  //                                           addressData={addressData}
  //                                           newAddressMode={newAddressMode}
  //                                           addressesAvailable={addressesAvailable}
  //                                           showAddresses={showAddresses}
  //                                           toggleAddressForm={onEditAddress} showAddressInBridalUse={true}
  //                                           currentCallBackComponent="bridal" case="manage"
  //                                           shouldShowBackButton={true} showAllAddresses="true" key="k123"/>
  //                     <div className="manage-registry text-center cerise voffset4 letter-spacing1"><span
  //                         className="cursor-pointer" onClick={setManageRegistry} dangerouslySetInnerHTML={{__html: editMode?"":'&lt; &nbsp;MANAGE REGISTRY'}}>
  //                         </span></div>
  //                 </div>
  //             </div>
  //         </div>
  //     </div>);
  //     return html;
  // }

  const currentScreen = () => {
    switch (currentScreenValue) {
      case "manage": {
        const addressData = bridalAddress;
        const bridalData = bridalDetail;
        if (addressData && bridalData) {
          if (
            Object.keys(addressData).length &&
            Object.keys(bridalData).length
          ) {
            return (
              <ManageRegistry
                bridalAddress={addressData}
                bridalDetail={bridalData}
                changeScreen={openShareLinkPopup}
                showRegistry={setManageRegistry}
              />
            );
          }
        }
        break;
      }
      case "manageregistryaddress":
        // let aData = bridalAddress;
        // let bData = bridalDetail;
        // if (Object.keys(aData).length && Object.keys(bData).length) {
        //     return <ManageRegistryAddress bridal_address={aData} change_screen={openShareLinkPopup}
        //                                   bridal_detail={bData} bid={props.id}
        //                                   change_address={changeAddress}
        //                                   key={1}
        //                                   getBridalProfileData={getBridalProfileData}
        //                                   show_manageregistry={showManageRegistry}
        //                                   mobile={mobile}
        //                                   showManageAddressComponent={showManageAddressComponent}/>
        // }
        break;
      case "manageAddresses":
        // return getManageAddress();
        break;
      default:
        break;
    }
  };
  return (
    <BridalContext.Provider
      value={{
        case: currentSection,
        data: bridalDetails,
        setCurrentModule: setCurrentModule,
        setCurrentModuleData: setCurrentModuleData
      }}
    >
      <div className="bridal-registry">
        {props.id != 0 ? currentScreen() : setSelectedSection()}
      </div>
    </BridalContext.Provider>
  );
};
export default Bridal;
