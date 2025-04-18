import React, { useState, useEffect, useContext, useRef } from "react";
import { AddressData } from "components/Address/typings";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
// import CreateRegistry from "./CreateRegistry";
import CreateRegistryNew from "./CreateRegisteryNew";
// import DateSelect from "./DateSelect";
// import BridalDetails from "./BridalDetails";
import AddressMain from "components/Address/AddressMain";
// import RegistryCreated from "./RegistryCreated";
// import ManageRegistry from "./ManageRegistry";
import ManageRegistryFull from "./ManageRegistryFull";
// import ManageAddress from './manageaddress'
import { confirmPopup } from "utils/validate";
import { BridalDetailsType, BridalProfileData } from "./typings";

import BridalContext from "./context";
import { updateComponent, updateModal } from "actions/modal";
import BridalService from "services/bridal";
import AddressService from "services/address";
import { AddressContext } from "components/Address/AddressMain/context";
import { updateAddressList } from "actions/address";
import { updateUser } from "actions/user";
import { POPUP } from "constants/components";
import { useHistory } from "react-router";
import { showGrowlMessage } from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import AccountService from "services/account";
import LoginService from "services/login";
import { updatePreferenceData } from "actions/user";
import Formsy from "formsy-react";
import { updateNextUrl } from "actions/info";
import NewManageRegistry from "./NewManageRegistry";
// import globalStyles from "styles/global.scss";
import EditRegistryDetails from "./EditRegistryDetails";
import { StringifyOptions } from "querystring";
import moment from "moment";
type Props = {
  bridalId: number;
};

const Bridal: React.FC<Props> = props => {
  const [bridalDetails, setBridalDetails] = useState<BridalDetailsType>({
    occasion: "",
    occassion_choice: "",
    registrantName: "",
    registryName: "",
    coRegistrantName: "",
    userAddress: undefined,
    eventDate: ""
  });
  const [whatsappNoErr, setWhatsappNoErr] = useState("");
  const [currentSection, setCurrentSection] = useState("create");
  const [currentScreenValue, setCurrentScreenValue] = useState("manage");
  const [bridalAddress, setBridalAddress] = useState<AddressData>();
  const [bridalAddressId, setBridalAddressId] = useState<AddressData>();
  const [bridalProfile, setBridalProfile] = useState<BridalProfileData>();
  const bridalProfileData = bridalProfile as BridalProfileData;
  const [registryName, setRegistryName] = useState("");
  const [coRegistrantName, setCoRegistrantName] = useState("");
  const [registrantName, setRegistrantName] = useState("");
  const [currentEventDate, setCurrentEventDate] = useState("");
  // const [ registryCreateError, setRegistryCreateError ] = useState("");
  // const [ showPopup, setShowPopup ] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [lastScreen, setLastScreen] = useState("");
  const history = useHistory();
  // const [ showpop, setShowpop ] = useState(false);
  // const { mobile } = useSelector((state: AppState) => state.device);
  const { currency, user } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const whatsappRef = useRef<HTMLInputElement>(null);
  const whatsappFormRef = useRef<Formsy>(null);
  const getBridalProfileData = async () => {
    const data = await BridalService.fetchBridalProfile(
      dispatch,
      props.bridalId
    );
    if (data) {
      setBridalProfile(data);
      setBridalDetails(Object.assign({}, data, { userAddress: undefined }));
      setShareLink(`${__DOMAIN__}/${data.shareLink}`);
      dispatch(
        updateUser(
          Object.assign({}, user, {
            bridalId: data.bridalId,
            bridalCurrency: data.currency
          })
        )
      );
    }
    return data;
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      AccountService.fetchAccountPreferences(dispatch).then((data: any) => {
        dispatch(updatePreferenceData(data));
      });
    }
  }, [user.isLoggedIn]);

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
    const url = new URLSearchParams(history.location.search);
    const id = url.get("bridalId") || "";
    if (id) {
      BridalService.checkBridalId(dispatch, id)
        .then((data: any) => {
          // user.bridal.
          if (data.isBridalActive == false) {
            showGrowlMessage(
              dispatch,
              `Sorry, Your registry ${data.registryName} has expired`,
              7000
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (!user.isLoggedIn) {
      LoginService.showLogin(dispatch);
      dispatch(updateNextUrl("/account/registry"));
    }

    return () => {
      window.removeEventListener("beforeunload", confirmPopup);
    };
  }, []);

  useEffect(() => {
    if (props.bridalId) {
      getBridalProfileData().then(data => {
        AddressService.fetchAddressList(dispatch).then(addressList => {
          dispatch(updateAddressList(addressList));
          const bridalAddress = addressList.filter(
            address =>
              address.id == (bridalAddressId?.id || data?.userAddressId)
          )[0];
          if (bridalAddress) {
            setBridalAddress(bridalAddress);
          }
        });
      });
    }
  }, [props.bridalId]);

  useEffect(() => {
    setBridalAddressId(bridalAddress);
  }, [bridalAddress]);

  // const openBridalPop = () => {
  //   dispatch(updateComponent(POPUP.BRIDALPOP, null, true));
  //   dispatch(updateModal(true));
  // };

  const openShareLinkPopup = () => {
    if (shareLink) {
      dispatch(
        updateComponent(
          POPUP.SHARELINK,
          {
            // changeScreen={closePopup}
            shareUrl: shareLink,
            bridalProfile: bridalProfile
            // bridalDetails={bridalDetails}
          },
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

  const changeAddress = (newAddressId: number) => {
    getBridalProfileData()
      .then(_data => {
        AddressService.fetchAddressList(dispatch).then(data => {
          // dispatch(updateAddressList(data));
          const items = data;
          for (let i = 0; i < items.length; i++) {
            if (items[i].id == newAddressId) {
              setBridalAddress(items[i]);
              break;
            }
          }
        });
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
        occassion_choice,
        eventDate,
        registrantName,
        coRegistrantName,
        registryName,
        userAddress
      } = obj;
      const newBridalDetails: BridalDetailsType = Object.assign(
        {},
        bridalDetails
      );
      switch (section) {
        case "create":
          newBridalDetails["occasion"] = occasion ? occasion : "";
          newBridalDetails["occassion_choice"] = occassion_choice
            ? occassion_choice
            : "";
          newBridalDetails["eventDate"] = eventDate ? eventDate : "";
          newBridalDetails["registrantName"] = registrantName
            ? registrantName
            : "";
          newBridalDetails["coRegistrantName"] = coRegistrantName
            ? coRegistrantName
            : "";
          newBridalDetails["registryName"] = registryName ? registryName : "";
          break;
        // case "date":
        //   newBridalDetails["eventDate"] = eventDate ? eventDate : "";
        //   break;
        // case "details":
        //   newBridalDetails["registrantName"] = registrantName
        //     ? registrantName
        //     : "";
        //   newBridalDetails["coRegistrantName"] = coRegistrantName
        //     ? coRegistrantName
        //     : "";
        //   newBridalDetails["registryName"] = registryName ? registryName : "";
        //   break;
        case "address":
          if (userAddress) {
            const isValid =
              userAddress.country == "IN" ? isAddressValid(userAddress) : true;
            if (isValid) {
              // this.props.onSelectAddress(address);
              newBridalDetails["userAddress"] = userAddress;
              setTimeout(() => {
                document.getElementById("address_button")?.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "start"
                });
              }, 200);

              // setCurrentModule("address");
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
    const whatsappFormValues = whatsappFormRef.current?.getCurrentValues();
    let whatsappSubscribe = whatsappFormValues?.whatsappSubscribe;
    let whatsappNo = whatsappFormValues?.whatsappNo;
    let whatsappNoCountryCode = whatsappFormValues?.whatsappNoCountryCode;
    const newBridalDetails: BridalDetailsType = Object.assign(
      {},
      bridalDetails
    );
    newBridalDetails["userAddress"] = bridalAddressId;
    if (newBridalDetails?.userAddress) {
      if (!whatsappFormRef.current) {
        whatsappSubscribe = user.preferenceData.whatsappSubscribe;
        whatsappNo = user.preferenceData.whatsappNo;
        whatsappNoCountryCode = user.preferenceData.whatsappNoCountryCode;
      }
      const formData: any = {
        userAddressId: newBridalDetails?.userAddress?.id,
        ...rest,
        currency,
        actionType: "create",
        whatsappSubscribe: whatsappSubscribe
      };

      if (whatsappSubscribe) {
        formData.whatsappNo = whatsappNo;
        formData.whatsappNoCountryCode = whatsappNoCountryCode;
      }
      setLastScreen("start");
      setWhatsappNoErr("");
      BridalService.saveBridalProfile(dispatch, formData)
        .then(data => {
          if (data) {
            window.removeEventListener("beforeunload", confirmPopup);
            const updatedUser = Object.assign({}, user, {
              bridalId: data.bridalId,
              bridalCurrency: currency
            });
            const userConsent = CookieService.getCookie("consent").split(",");
            if (userConsent.includes(GA_CALLS)) {
              dataLayer.push({
                event: "registry",
                "Event Category": "Registry",
                "Event Action": "Registry created",
                "Event Label": formData.occasion
              });
              dataLayer.push({
                event: "Whatsapp_optin",
                Location: "create_registry",
                Checkbox: whatsappSubscribe
                  ? "Whatsapp Opt-in"
                  : "Whatsapp Opt-out"
              });

              dataLayer.push({
                event: "ge_registry_form_step2_submit",
                click_type: formData.occasion,
                cta_name: moment(formData?.eventDate).format("YYYY-MM-DD"),
                wa_checkbox_status: whatsappSubscribe
                  ? "Whatsapp Opt-in"
                  : "Whatsapp Opt-out"
              });
            }

            dispatch(updateUser(updatedUser));
            setCurrentModule("created");
            window.scrollTo(0, 0);
          }
        })
        .catch(err => {
          // setState({
          //     showerror: "Something went Wrong"
          // })
          // if(err.response.data.error_message) {
          //   let errorMsg = err.response.data.error_message[0];
          //   if(errorMsg == "MaxRetries") {
          //     errorMsg = "You have exceeded max attempts, please try after some time."
          //   }
          //   setRegistryCreateError(errorMsg);
          // }
          const errData = err.response?.data;
          Object.keys(errData).map(key => {
            switch (key) {
              case "whatsappNo":
                if (errData[key][0] == "This field may not be blank.") {
                  setWhatsappNoErr("Please enter a Whatsapp Number");
                }
                // whatsappFormRef.current?.updateInputsWithError(
                //   {
                //     [key]: errData[key][0]
                //   },
                //   true
                // );
                // // setNumberError(errData[key][0]);
                break;
              case "non_field_errors":
                // // Invalid Whatsapp number
                setWhatsappNoErr("Please enter a valid Whatsapp Number");
                // //This is not working
                // whatsappFormRef.current?.updateInputsWithError(
                //   {
                //     ["whatsappNo"]: errData[key][0]
                //   },
                //   true
                // );
                break;
            }
          });
        });
    }
  };

  // edit registry detail & adress on currentScreen after refresh
  const showManageRegistry = () => {
    // getBridalProfileData();
    if (props.bridalId) {
      getBridalProfileData().then(data => {
        AddressService.fetchAddressList(dispatch).then(addressList => {
          dispatch(updateAddressList(addressList));
          const bridalAddress = addressList.filter(
            address =>
              address.id == (bridalAddressId?.id || data?.userAddressId)
          )[0];
          if (bridalAddress) {
            setBridalAddress(bridalAddress);
          }
        });
      });
    }
    setCurrentScreenValue("manage");
    window.scrollTo(0, 0);
  };

  const showEditRegistryDetails = () => {
    setCurrentScreenValue("editRegistryDetails");
  };

  const showManageAddressComponent = () => {
    setCurrentScreenValue("editRegistryAddress");
  };

  // edit registry detail & adress on currentModule firstTime
  const showUpdatedRegistryModuleFirst = () => {
    // getBridalProfileData();
    if (props.bridalId) {
      getBridalProfileData().then(data => {
        AddressService.fetchAddressList(dispatch).then(addressList => {
          dispatch(updateAddressList(addressList));
          const bridalAddress = addressList.filter(
            address =>
              address.id == (bridalAddressId?.id || data?.userAddressId)
          )[0];
          if (bridalAddress) {
            setBridalAddress(bridalAddress);
          }
        });
      });
    }
    setCurrentModule("created");
    window.scrollTo(0, 0);
  };

  const showEditRegistryDetailsFirst = () => {
    setCurrentModule("editRegistryDetailsFirst");
  };

  const showManageAddressComponentFirst = () => {
    setCurrentModule("editRegistryAddressFirst");
  };

  const setSelectedSection = () => {
    const changeName = (data: {
      registrantName: string;
      coRegistrantName: string;
      registryName: string;
      eventDate: string;
    }) => {
      setRegistrantName(data.registrantName);
      setCoRegistrantName(data.coRegistrantName);
      setRegistryName(data.registryName);
      setCurrentEventDate(data.eventDate);
    };

    const changeDate = (date: string) => {
      setCurrentEventDate(date);
    };
    switch (currentSection) {
      case "create":
        return <CreateRegistryNew />;
      case "address":
        return (
          <AddressMain
            isBridal={true}
            currentCallBackComponent="bridal"
            addressType="SHIPPING"
            error=""
            addresses={[]}
            createRegistry={createRegistry}
            // createRegistry={showManageRegistry1}
            innerRef={whatsappRef}
            whatsappFormRef={whatsappFormRef}
            whatsappNoError={whatsappNoErr}
            currentStep={0}
          />
        );
      case "created":
        if (bridalAddress && bridalProfile) {
          if (
            Object.keys(bridalAddress).length &&
            Object.keys(bridalProfile).length
          ) {
            return (
              <NewManageRegistry
                openShareLinkPopup={openShareLinkPopup}
                key={1}
                showManageAddressComponent={showManageAddressComponentFirst}
                editRegistryForm={showEditRegistryDetailsFirst}
              />
            );
          }
        }
      case "editRegistryDetailsFirst": {
        return (
          <EditRegistryDetails
            bridalProfile={bridalProfile}
            bridalId={bridalProfileData ? bridalProfileData.bridalId : 0}
            eventDate={bridalProfileData ? bridalProfileData.eventDate : ""}
            changeName={changeName}
            changeDate={changeDate}
            showManageRegistry={showUpdatedRegistryModuleFirst}
          />
        );
        break;
      }
      case "editRegistryAddressFirst":
        return (
          <AddressMain
            isBridal={true}
            addressType={"SHIPPING"}
            error=""
            addresses={[]}
            currentCallBackComponent="bridal-edit"
            currentStep={0}
            editRegistryAddress={showUpdatedRegistryModuleFirst}
          />
        );
      default:
        break;
    }
  };

  const changeBridalAddress = (addressId: number) => {
    const data = {
      bridalId: props.bridalId,
      addressId
    };
    BridalService.updateBridalAddress(dispatch, data).then(res => {
      setBridalProfile(res[0]);
      // setBridalAddress(bridalAddress)
      setShareLink(`${__DOMAIN__}/${res[0].shareLink}`);
      // changeAddress(data.addressId);
      // setCurrentScreenValue("manageregistryfull");
      // setCurrentScreenValue("manage");
    });
  };

  const currentScreen = () => {
    const changeName = (data: {
      registrantName: string;
      coRegistrantName: string;
      registryName: string;
      eventDate: string;
    }) => {
      setRegistrantName(data.registrantName);
      setCoRegistrantName(data.coRegistrantName);
      setRegistryName(data.registryName);
      setCurrentEventDate(data.eventDate);
    };

    const changeDate = (date: string) => {
      setCurrentEventDate(date);
    };
    switch (currentScreenValue) {
      case "manage": {
        if (bridalAddress && bridalProfile) {
          if (
            Object.keys(bridalAddress).length &&
            Object.keys(bridalProfile).length
          ) {
            return (
              <NewManageRegistry
                openShareLinkPopup={openShareLinkPopup}
                key={1}
                showManageAddressComponent={showManageAddressComponent}
                editRegistryForm={showEditRegistryDetails}
              />
            );
          }
        }
        break;
      }
      case "manageregistryfull": {
        if (bridalAddress && bridalProfile) {
          if (
            Object.keys(bridalAddress).length &&
            Object.keys(bridalProfile).length
          ) {
            return (
              <ManageRegistryFull
                openShareLinkPopup={openShareLinkPopup}
                key={1}
                showManageRegistry={showManageRegistry}
                showManageAddressComponent={showManageAddressComponent}
              />
            );
          }
        }
        break;
      }
      case "editRegistryDetails": {
        return (
          <EditRegistryDetails
            bridalProfile={bridalProfile}
            bridalId={bridalProfileData ? bridalProfileData.bridalId : 0}
            // bridalId= {props.bridalId}
            eventDate={bridalProfileData ? bridalProfileData.eventDate : ""}
            changeName={changeName}
            changeDate={changeDate}
            showManageRegistry={showManageRegistry}
          />
        );
        break;
      }
      case "editRegistryAddress":
        return (
          <AddressMain
            isBridal={true}
            addressType={"SHIPPING"}
            error=""
            addresses={[]}
            currentCallBackComponent="bridal-edit"
            currentStep={0}
            editRegistryAddress={showManageRegistry}
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
        bridalProfile: bridalProfile,
        bridalAddress: bridalAddress,
        data: bridalDetails,
        setBridalAddress: setBridalAddress,
        setCurrentModule: setCurrentModule,
        setCurrentModuleData: setCurrentModuleData,
        setCurrentScreenValue: setCurrentScreenValue,
        changeBridalAddress: changeBridalAddress,
        setBridalAddressId: setBridalAddressId,
        bridalAddressId: bridalAddressId
      }}
    >
      <div className="bridal-registry">
        {lastScreen == "start"
          ? setSelectedSection()
          : props.bridalId != 0
          ? currentScreen()
          : setSelectedSection()}
      </div>
    </BridalContext.Provider>
  );
};
export default Bridal;
