import React, { useState, useContext, useEffect } from "react";
import EditRegistry from "./EditRegistry";
import BridalItemsList from "./BridalItemsList";
import BridalMobileProductUpdate from "./BridalMobileProductUpdate";
import { useDispatch, useSelector } from "react-redux";
import { updateComponent, updateModal } from "actions/modal";
import { BridalItemData, BridalProfileData } from "./typings";
import BridalService from "services/bridal";
import { AddressData } from "components/Address/typings";
import BridalContext from "./context";
import { useHistory } from "react-router";
// styles
import cs from "classnames";
import globalStyles from "../../../../styles/global.scss";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import bridalRing from "../../../../images/bridal/rings.svg";
import iconEdit from "../../../../images/bridal/iconEdit.svg";
import { AppState } from "reducers/typings";

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
    phoneCountryCode,
    countryName
  } = bridalAddress as AddressData;
  const bridalProfileData = bridalProfile as BridalProfileData;

  // const [ showPopup, setShowPopup ] = useState(false);
  // const [ showMobilePopup, setShowMobilePopup ] = useState(false);
  const [bridalItems, setBridalItems] = useState<BridalItemData[]>([]);
  const [registryName, setRegistryName] = useState("");
  const [coRegistrantName, setCoRegistrantName] = useState("");
  const [registrantName, setRegistrantName] = useState("");
  const [currentEventDate, setCurrentEventDate] = useState("");
  const [mobileIndex, setMobileIndex] = useState(0);
  const [occasion, setOccasion] = useState("");
  const dispatch = useDispatch();
  const { mobile } = useSelector((state: AppState) => state.device);

  useEffect(() => {
    if (bridalProfile) {
      const {
        registryName,
        coRegistrantName,
        registrantName,
        eventDate,
        occasion
      } = bridalProfile as BridalProfileData;
      setRegistryName(registryName);
      setCoRegistrantName(coRegistrantName);
      setRegistrantName(registrantName);
      setCurrentEventDate(eventDate);
      setOccasion(occasion);
    }
  }, [bridalProfile]);

  const fetchBridalItems = () => {
    BridalService.fetchBridalItems(dispatch, bridalProfileData.bridalId).then(
      data => {
        setBridalItems(data.results);
      }
    );
  };

  const openMobileProductUpdatePopup = () => {
    dispatch(
      updateComponent(
        <BridalMobileProductUpdate
          itemData={bridalItems && bridalItems[mobileIndex]}
          // closeMobile={closeMobileAdd}
          bridalId={bridalProfileData ? bridalProfileData.bridalId : 0}
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

  const openEditRegistryPopup = (clickType: string) => {
    dispatch(
      updateComponent(
        <EditRegistry
          // mobile={mobile}
          clickType={clickType}
          eventDate={currentEventDate}
          bridalProfile={bridalProfile}
          changeName={changeName}
          // close_popup={closePopup}
          changeDate={changeDate}
          // update_address={updateAddress}
          bridalId={bridalProfileData ? bridalProfileData.bridalId : 0}
        />,
        mobile ? true : false
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

    openEditRegistryPopup(data);
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

  const history = useHistory();

  useEffect(() => {
    if (bridalProfile) {
      fetchBridalItems();
    }
  }, [bridalProfile]);

  return (
    <div className={cs(bootstrapStyles.row, styles.bridalBlock)}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          bootstrapStyles.colMd10,
          bootstrapStyles.offsetMd1
        )}
      >
        <svg
          viewBox="-5 -15 50 50"
          width="80"
          height="80"
          preserveAspectRatio="xMidYMid meet"
          x="0"
          y="0"
          className={styles.bridalRing}
        >
          <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
        </svg>
        <div
          className={cs(
            globalStyles.c22AI,
            globalStyles.voffset2,
            globalStyles.txtCap
          )}
        >
          {registryName ? (
            registryName
          ) : (
            <span className="">
              {" "}
              {registrantName} &amp; {coRegistrantName}
              <span className={globalStyles.txtSmall}>&#39;s </span>
              {occasion} Registry
            </span>
          )}
        </div>
        <div className={bootstrapStyles.row}>
          <div className={cs(bootstrapStyles.col12, globalStyles.voffset5)}>
            <div className={styles.add}>
              <address className={cs(styles.orderBlock, styles.manageAdd)}>
                <p>
                  <span className={cs(styles.light, styles.letterSpacing1)}>
                    Registry Name
                  </span>
                  :&nbsp;
                  {registryName ? (
                    registryName
                  ) : (
                    <span className="">
                      {" "}
                      {registrantName}&nbsp;&&nbsp;{coRegistrantName}
                      <span className={globalStyles.txtSmall}>&#39;s </span>
                      {occasion}&nbsp;Registry
                    </span>
                  )}
                  <span
                    className={globalStyles.pointer}
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
                      className={styles.bridalRing}
                    >
                      <use xlinkHref={`${iconEdit}#icons_edit`}></use>
                    </svg>
                  </span>
                </p>
                <p>
                  <span className={cs(styles.light, styles.letterSpacing1)}>
                    {occasion}
                    &nbsp;Date
                  </span>
                  : {currentEventDate}
                  <span
                    className={globalStyles.pointer}
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
                      className={styles.bridalRing}
                    >
                      <use xlinkHref={`${iconEdit}#icons_edit`}></use>
                    </svg>
                  </span>
                </p>
                <hr />
                <p className={cs(styles.light, styles.letterSpacing1)}>
                  SHIPPING ADDRESS{" "}
                  <span
                    className={globalStyles.pointer}
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
                      className={styles.bridalRing}
                    >
                      <use xlinkHref={`${iconEdit}#icons_edit`}></use>
                    </svg>
                  </span>
                </p>
                <p className={globalStyles.voffset2}>
                  {firstName}
                  &nbsp; {lastName}
                  <br />
                </p>
                <p className={cs(styles.light, globalStyles.voffset2)}>
                  {line1} <br />
                  {line2} <br />
                  {city}, {postCode}
                  <br />
                  {state}, {countryName}
                  <br />
                </p>
                <p> {`${phoneCountryCode} ${phoneNumber}`}</p>
                <p className={cs(globalStyles.voffset2, styles.letterSpacing1)}>
                  <a
                    className={globalStyles.cerise}
                    onClick={() => showManageRegistry()}
                  >
                    VIEW LESS
                  </a>
                  <a
                    className={cs(styles.lane2, styles.black)}
                    onClick={openShareLinkPopup}
                  >
                    SHARE LINK
                  </a>
                </p>
                <hr />
                {bridalItems.length == 0 ? (
                  <button
                    className={globalStyles.ceriseBtn}
                    onClick={() => {
                      history.push("/");
                    }}
                  >
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
                          mobile={mobile}
                          currency={
                            bridalProfileData
                              ? bridalProfileData.currency
                              : "INR"
                          }
                          bridalId={
                            bridalProfileData ? bridalProfileData.bridalId : 0
                          }
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
  );
};
export default ManageRegistryFull;
