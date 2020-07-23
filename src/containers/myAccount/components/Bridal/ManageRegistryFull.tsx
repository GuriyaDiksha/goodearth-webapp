import React, { useState, useContext, useEffect } from "react";
import EditRegistry from "./EditRegistry";
import BridalItemsList from "./BridalItemsList";
import BridalMobileProductUpdate from "./BridalMobileProductUpdate";
import { useDispatch } from "react-redux";
import { updateComponent, updateModal } from "actions/modal";
import { BridalItem, BridalProfileData } from "./typings";
import BridalService from "services/bridal";
import { AddressData } from "components/Address/typings";
import BridalContext from "./context";

type Props = {
  // bridalProfile: BridalProfileData;
  // bridalAddress: AddressData;
  showManageAddressComponent: any;
  showManageRegistry: any;
  openShareLinkPopup: () => void;
};

const ManageRegistryFull: React.FC<Props> = ({
  showManageAddressComponent,
  showManageRegistry,
  openShareLinkPopup
}) => {
  const { bridalAddress, bridalProfile } = useContext(BridalContext);
  const {
    firstName,
    lastName,
    line1,
    line2,
    city,
    state,
    postCode,
    phoneNumber,
    countryName
  } = bridalAddress as AddressData;
  const bridalProfileData = bridalProfile as BridalProfileData;

  // const [ showPopup, setShowPopup ] = useState(false);
  // const [ showMobilePopup, setShowMobilePopup ] = useState(false);
  const [clickType, setClickType] = useState("");
  const [bridalItems, setBridalItems] = useState<BridalItem[]>([]);
  const [registryName, setRegistryName] = useState(
    bridalProfileData.registryName
  );
  const [coRegistrantName, setCoRegistrantName] = useState(
    bridalProfileData.coRegistrantName
  );
  const [registrantName, setRegistrantName] = useState(
    bridalProfileData.registrantName
  );
  const [currentEventDate, setCurrentEventDate] = useState(
    bridalProfileData.eventDate
  );
  const [mobileIndex, setMobileIndex] = useState(0);

  const dispatch = useDispatch();

  const fetchBridalItems = () => {
    BridalService.fetchBridalItems(dispatch, bridalProfileData.bridalId).then(
      data => {
        if (data.count) setBridalItems(data.results);
      }
    );
  };

  const openMobileProductUpdatePopup = () => {
    dispatch(
      updateComponent(
        <BridalMobileProductUpdate
          itemData={bridalItems && bridalItems[mobileIndex]}
          // closeMobile={closeMobileAdd}
          bridalId={bridalProfileData.bridalId}
          fetchBridalItems={fetchBridalItems}
        />,
        true
      )
    );
    dispatch(updateModal(true));
  };

  const handleMobileAdd = (mIndex: number) => {
    // setShowMobilePopup(true);
    setMobileIndex(mIndex);
    openMobileProductUpdatePopup();
  };

  // console.log(showPopup, showMobilePopup); // to be removed

  const changeName = (data: {
    registrantName: string;
    coRegistrantName: string;
    registryName: string;
  }) => {
    // setShowPopup(false);
    setRegistrantName(data.registrantName);
    setCoRegistrantName(data.coRegistrantName);
    setRegistryName(data.registryName);
  };

  const changeDate = (date: string) => {
    // setShowPopup(false);
    setCurrentEventDate(date);
  };

  const openEditRegistryPopup = () => {
    dispatch(
      updateComponent(
        <EditRegistry
          // mobile={mobile}
          clickType={clickType}
          eventDate={currentEventDate}
          changeName={changeName}
          // close_popup={closePopup}
          changeDate={changeDate}
          // update_address={updateAddress}
          bridalId={bridalProfileData.bridalId}
        />,
        true
      )
    );
    dispatch(updateModal(true));
  };
  // const closeMobileAdd = () => {
  //     fetchBridalItems();
  //     setShowMobilePopup(false);
  // }

  const changeRData = (data: string) => {
    // setShowPopup(true);

    setClickType(data);
    openEditRegistryPopup();
  };

  // const closePopup = () => {
  //     setShowPopup(false);
  // }

  // const getBridalData = () => {
  // axios.get(Config.hostname + 'myapi/getbridalItems?bridal_id=' + bid)
  //     .then(res => {
  //         if (res) {
  //             console.log(res);
  //         }
  //     });
  // }

  // const updateAddress = () => {
  //     // change_address();
  //     // getBridalProfileData();
  // }

  // const removeItems = () => {
  //     getItemsData()
  // }

  // componentWillMount() {
  //     getItemsData();
  // }

  const goToHome = () => {
    location.href = "/";
  };

  useEffect(() => {
    fetchBridalItems();
  }, []);

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
            <div className="c22-A-I txt-cap voffset2">
              {registryName ? (
                registryName
              ) : (
                <span className="">
                  {" "}
                  {registrantName} &amp; {coRegistrantName}&#39;s{" "}
                  {bridalProfileData.occasion} Registry
                </span>
              )}
            </div>
            <div className="row">
              <div className="col-xs-12 voffset5">
                <div className="add">
                  <address className="order-block manage-add">
                    <p>
                      <span className="light letter-spacing1">
                        Registry Name
                      </span>
                      :&nbsp;
                      {registryName ? (
                        registryName
                      ) : (
                        <span className="">
                          {" "}
                          {registrantName} &&nbsp;{coRegistrantName}&#39;s&nbsp;
                          {bridalProfileData.occasion}&nbsp;Registry
                        </span>
                      )}
                      <span
                        onClick={e => {
                          changeRData("name");
                        }}
                      >
                        <svg
                          viewBox="-5 -15 50 50"
                          width="25"
                          height="25"
                          preserveAspectRatio="xMidYMid meet"
                          x="0"
                          y="0"
                          className="bridal-ring-cerise"
                        >
                          <use xlinkHref="/static/img/bridal/icons_edit.svg#icons_edit"></use>
                        </svg>
                      </span>
                    </p>
                    <p>
                      <span className="light letter-spacing1">
                        {bridalProfileData.occasion}
                        &nbsp;Date
                      </span>
                      : {currentEventDate}
                      <span
                        onClick={e => {
                          changeRData("date");
                        }}
                      >
                        <svg
                          viewBox="-5 -15 50 50"
                          width="25"
                          height="25"
                          preserveAspectRatio="xMidYMid meet"
                          x="0"
                          y="0"
                          className="bridal-ring-cerise"
                        >
                          <use xlinkHref="/static/img/bridal/icons_edit.svg#icons_edit"></use>
                        </svg>
                      </span>
                    </p>
                    <hr />
                    <p className="light letter-spacing1">
                      SHIPPING ADDRESS{" "}
                      <span
                        onClick={e => {
                          showManageAddressComponent();
                        }}
                      >
                        <svg
                          viewBox="-5 -15 50 50"
                          width="25"
                          height="25"
                          preserveAspectRatio="xMidYMid meet"
                          x="0"
                          y="0"
                          className="bridal-ring-cerise"
                        >
                          <use xlinkHref="/static/img/bridal/icons_edit.svg#icons_edit"></use>
                        </svg>
                      </span>
                    </p>
                    <p className="voffset2">
                      {firstName}
                      &nbsp; {lastName}
                      <br />
                    </p>
                    <p className="light voffset2">
                      {line1} <br />
                      {line2} <br />
                      {city}, {postCode}
                      <br />
                      {state}, {countryName}
                      <br />
                    </p>
                    <p> {phoneNumber}</p>
                    <p className="voffset2 letter-spacing1">
                      <a
                        className="cerise"
                        onClick={() => showManageRegistry()}
                      >
                        VIEW LESS
                      </a>
                      <a className="lane2 black" onClick={openShareLinkPopup}>
                        SHARE LINK
                      </a>
                    </p>
                    <hr />
                    {bridalItems.length == 0 ? (
                      <button className="cerise-btn bold" onClick={goToHome}>
                        start adding to registry
                      </button>
                    ) : (
                      ""
                    )}
                    {bridalItems
                      ? bridalItems.map((item, index) => {
                          return (
                            <BridalItemsList
                              product={item}
                              currency={bridalProfileData.currency}
                              bridalId={bridalProfileData.bridalId}
                              mIndex={index}
                              onMobileAdd={handleMobileAdd}
                              key={item.id}
                              fetchBridalItems={fetchBridalItems}
                            />
                          );
                        })
                      : ""}
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
export default ManageRegistryFull;
