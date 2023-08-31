import React, { useState, useEffect, useContext, useRef } from "react";
import { AddressData } from "components/Address/typings";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import CreateRegistry from "./CreateRegistry";
import DateSelect from "./DateSelect";
import BridalDetails from "./BridalDetails";
import AddressMain from "components/Address/AddressMain";
import RegistryCreated from "./RegistryCreated";
import ManageRegistry from "./ManageRegistry";
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
// import globalStyles from "styles/global.scss";
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
  const [whatsappNoErr, setWhatsappNoErr] = useState("");
  const [currentSection, setCurrentSection] = useState("create");
  const [currentScreenValue, setCurrentScreenValue] = useState("manage");
  const [bridalAddress, setBridalAddress] = useState<AddressData>();
  const [bridalProfile, setBridalProfile] = useState<BridalProfileData>();
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
      dispatch(updateNextUrl("/account/bridal"));
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
            address => address.id == data?.userAddressId
          )[0];
          if (bridalAddress) {
            setBridalAddress(bridalAddress);
          }
        });
      });
    }
  }, [props.bridalId]);

  const openBridalPop = () => {
    dispatch(updateComponent(POPUP.BRIDALPOP, null, true));
    dispatch(updateModal(true));
  };

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
          dispatch(updateAddressList(data));
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
              userAddress.country == "IN" ? isAddressValid(userAddress) : true;
            if (isValid) {
              // this.props.onSelectAddress(address);
              newBridalDetails["userAddress"] = userAddress;
              setTimeout(() => {
                document
                  .getElementById("address_button")
                  ?.scrollIntoView({
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

    if (userAddress) {
      if (!whatsappFormRef.current) {
        whatsappSubscribe = user.preferenceData.whatsappSubscribe;
        whatsappNo = user.preferenceData.whatsappNo;
        whatsappNoCountryCode = user.preferenceData.whatsappNoCountryCode;
      }
      const formData: any = {
        userAddressId: userAddress.id,
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
            }

            dispatch(updateUser(updatedUser));
            setCurrentModule("created");
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

  const showManageRegistry = () => {
    getBridalProfileData();
    setCurrentScreenValue("manage");
  };

  const showManageAddressComponent = () => {
    setCurrentScreenValue("editRegistryAddress");
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
            addresses={[]}
            createRegistry={createRegistry}
            innerRef={whatsappRef}
            whatsappFormRef={whatsappFormRef}
            whatsappNoError={whatsappNoErr}
            currentStep={0}
          />
        );
      case "created":
        return (
          <RegistryCreated errorMessage="" openBridalPop={openBridalPop} />
        );
      default:
    }
  };

  const changeBridalAddress = (addressId: number) => {
    const data = {
      bridalId: props.bridalId,
      addressId
    };
    BridalService.updateBridalAddress(dispatch, data).then(res => {
      setBridalProfile(res[0]);
      setShareLink(`${__DOMAIN__}/${res[0].shareLink}`);
      changeAddress(data.addressId);
      setCurrentScreenValue("manageregistryfull");
    });
  };

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
      case "editRegistryAddress":
        return (
          <AddressMain
            isBridal={true}
            addressType={"SHIPPING"}
            error=""
            addresses={[]}
            currentCallBackComponent="bridal-edit"
            currentStep={0}
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
        changeBridalAddress: changeBridalAddress
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
