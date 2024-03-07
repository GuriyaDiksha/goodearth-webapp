import React, { useState, useContext, useEffect } from "react";
import BridalItemsList from "./BridalItemsList";
import { useDispatch, useSelector } from "react-redux";
import { updateComponent, updateModal } from "actions/modal";
import { BridalItemData, BridalProfileData } from "./typings";
import BridalService from "services/bridal";
import { AddressData } from "components/Address/typings";
import BridalContext from "./context";
import cs from "classnames";
import globalStyles from "../../../../styles/global.scss";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import { AppState } from "reducers/typings";
import { POPUP } from "constants/components";
import gift_icon from "../../../../images/registery/gift_icon.svg";

type Props = {
  showManageAddressComponent: any;
  openShareLinkPopup: () => void;
  editRegistryForm: () => void;
};

const RegistryCreatedNew: React.FC<Props> = ({
  showManageAddressComponent,
  openShareLinkPopup,
  editRegistryForm
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
        POPUP.BRIDALMOBILEPRODUCTUPDATE,
        {
          itemData: bridalItems && bridalItems[mobileIndex],
          bridalId: bridalProfileData ? bridalProfileData.bridalId : 0,
          fetchBridalItems: fetchBridalItems
        },
        true
      )
    );
    dispatch(updateModal(true));
  };

  const handleMobileAdd = (mIndex: number) => {
    setMobileIndex(mIndex);
    openMobileProductUpdatePopup();
  };

  useEffect(() => {
    if (bridalProfile) {
      fetchBridalItems();
    }
  }, [bridalProfile]);

  return (
    <div className={cs(bootstrapStyles.row, styles.bridalBlock, styles.m_40)}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          bootstrapStyles.colMd10,
          bootstrapStyles.offsetMd1
        )}
      >
        <div className={cs(styles.giftIcon)}>
          <img src={gift_icon} width="50px" height="50px" />
        </div>
        <div className={cs(styles.registryFormHeading, globalStyles.voffset6)}>
          Good Earth Registry
        </div>
        <div className={bootstrapStyles.row}>
          <div className={cs(bootstrapStyles.col12, styles.mobileHeadSpace)}>
            <div className={styles.add}>
              <address className={cs(styles.orderBlock, styles.manageAdd)}>
                <hr />
                <div className={cs(styles.flexHeader)}>
                  <div className={cs(styles.topRegisteryName)}>
                    {registryName ? (
                      <span>
                        {registrantName}
                        &#39;s&nbsp;
                        {registryName}
                      </span>
                    ) : (
                      <span className="">
                        {" "}
                        {registrantName}
                        &#39;s&nbsp;
                        {occasion}
                      </span>
                    )}
                  </div>
                  <div className={cs(styles.editLink)}>
                    <a className="" onClick={editRegistryForm}>
                      EDIT DETAILS
                    </a>
                  </div>
                </div>
                <hr />
                <div
                  className={cs(
                    bootstrapStyles.row,
                    styles.manageDataContainer
                  )}
                >
                  <div
                    className={cs(
                      styles.detailField,
                      bootstrapStyles.colLg6,
                      bootstrapStyles.colMd6,
                      bootstrapStyles.colSm12
                    )}
                  >
                    <p className="ocaasion_name">
                      <span className={cs(styles.light, styles.manageLabel)}>
                        Occasion:
                      </span>
                      <br />
                      <span className={cs(styles.manageValue)}>{occasion}</span>
                      <br />
                    </p>
                    <p className={cs(styles.manageValue)}>
                      <span className={cs(styles.light, styles.manageLabel)}>
                        Registry&apos;s Name
                      </span>
                      <br />
                      {registryName ? (
                        <span className={cs(styles.manageValue)}>
                          {registrantName}
                          &#39;s&nbsp;
                          {registryName}
                        </span>
                      ) : (
                        <span className={cs(styles.manageValue)}>
                          {" "}
                          {registrantName}
                          &#39;s&nbsp;
                          {occasion}
                        </span>
                      )}
                      <br />
                    </p>
                    <p className="occasion_date">
                      <span className={cs(styles.light, styles.manageLabel)}>
                        Special Occasion Date:
                      </span>
                      <br />
                      <span className={cs(styles.manageValue)}>
                        {currentEventDate}
                      </span>
                    </p>
                  </div>
                  <div
                    className={cs(
                      styles.detailField,
                      bootstrapStyles.colLg6,
                      bootstrapStyles.colMd6,
                      bootstrapStyles.colSm12
                    )}
                  >
                    <p className="registrant_name">
                      <span className={cs(styles.light, styles.manageLabel)}>
                        Registrant Name:
                      </span>
                      <br />
                      <span className={cs(styles.manageValue)}>
                        {registrantName}
                      </span>
                      <br />
                    </p>
                    <p className="co_registrant_name">
                      <span className={cs(styles.light, styles.manageLabel)}>
                        Co-Registrant Name:
                      </span>
                      <br />
                      <span className={cs(styles.manageValue)}>
                        {coRegistrantName}
                      </span>
                      <br />
                    </p>
                  </div>
                </div>
                <hr />
                <div className={cs(styles.shippingAddress)}>
                  <div className={cs(styles.flexHeader)}>
                    <div className={cs(styles.light, styles.manageLabel)}>
                      SHIPPING ADDRESS
                    </div>
                    <div
                      className={cs(globalStyles.pointer, styles.editLink)}
                      onClick={showManageAddressComponent}
                    >
                      {" "}
                      EDIT ADDRESS
                    </div>
                  </div>
                  <p className={cs(styles.fullName)}>
                    {firstName}
                    &nbsp; {lastName}
                    <br />
                  </p>
                  <p className={cs(styles.addressDetail)}>
                    {line1 ? (
                      <span>
                        {line1} <br />
                      </span>
                    ) : (
                      ""
                    )}
                    {line2 ? (
                      <span>
                        {line2} <br />
                      </span>
                    ) : (
                      ""
                    )}
                    {city}, {postCode}
                    <br />
                    {state}, {countryName}
                    <br />
                  </p>
                  <p className={cs(styles.phoneNo)}>
                    {" "}
                    {`${phoneCountryCode} ${phoneNumber}`}
                  </p>
                  <p className={styles.shareLink}>
                    <a
                      className={cs(styles.shareBtn, styles.black)}
                      onClick={openShareLinkPopup}
                    >
                      <button>SHARE REGISTRY LINK</button>
                    </a>
                  </p>
                </div>
                <hr />
                <div
                  className={cs(
                    styles.bridalItemsContainer,
                    "bridalItemsContainer"
                  )}
                >
                  {bridalItems.length == 0 ? (
                    <div className={cs(styles.noBridalItem)}>
                      <div className={cs(styles.noBridalItemHeading)}>
                        Products added to Registry
                      </div>
                      <div className={cs(styles.noBridalItemContent)}>
                        You have not saved <br />
                        any products yet.
                      </div>
                    </div>
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
                </div>
              </address>
            </div>
          </div>
        </div>
      </div>
      <div className={cs(styles.needAssistance)}>
        <div className={cs(styles.assistanceHeading)}>NEED ASSISTANCE?</div>
        <div className={cs(styles.assistanceContent)}>
          For any assistance, enquiries or feedback, please reach out to us on:{" "}
          <br />
          <a href="tel:(+91 9582 999 555)">+91 9582 999 555</a>/{" "}
          <a href="tel:(+91 9582 999 888)">+91 9582 999 888</a> <br />
          Monday through Saturday 9:00 am - 5:00 pm IST <br />
          <a href="mailto:customercare@goodearth.in">
            customercare@goodearth.in
          </a>
        </div>
        <div className={cs(styles.assistanceLink)}>
          <a
            href="https://www.goodearth.in/customer-assistance/terms-conditions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gifting Registry Terms & Conditions
          </a>
        </div>
      </div>
    </div>
  );
};
export default RegistryCreatedNew;
