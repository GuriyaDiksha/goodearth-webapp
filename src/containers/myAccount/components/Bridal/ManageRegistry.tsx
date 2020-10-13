import React, { useContext } from "react";
import BridalContext from "./context";
import { AddressData } from "components/Address/typings";
import cs from "classnames";
import globalStyles from "../../../../styles/global.scss";
import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import bridalRing from "../../../../images/bridal/rings.svg";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
// import { BridalProfileData } from "./typings";

type Props = {
  // bridalAddress: AddressData;
  // bridalProfile: BridalProfileData;
  openShareLinkPopup: () => void;
  showRegistryFull: () => void;
};

const ManageRegistry: React.FC<Props> = props => {
  const { data, bridalAddress } = useContext(BridalContext);
  const {
    occasion,
    registryName,
    registrantName,
    coRegistrantName,
    // userAddress,
    eventDate
  } = data;
  const {
    line1,
    line2,
    city,
    postCode,
    state,
    countryName,
    phoneNumber
  } = bridalAddress as AddressData;
  const { mobile } = useSelector((state: AppState) => state.device);
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

        <div className={cs(globalStyles.c22AI, globalStyles.voffset2)}>
          Manage Your Registries
        </div>
        <div className={bootstrapStyles.row}>
          <div className={cs(bootstrapStyles.col12, globalStyles.voffset5)}>
            <div className={styles.add}>
              <address className={cs(styles.orderBlock, styles.manageAdd)}>
                <label>{occasion}</label>
                <p>
                  {registryName ? (
                    registryName
                  ) : (
                    <span className="">
                      {" "}
                      {registrantName} & &nbsp;{coRegistrantName}
                      &#39;s&nbsp;
                      {occasion}&nbsp; Registry
                    </span>
                  )}
                  <br />
                </p>
                <p className={cs(styles.light, globalStyles.voffset2)}>
                  {line1}{" "}
                  {!mobile && (
                    <span className={styles.lane2}>date: {eventDate}</span>
                  )}
                  <br />
                  {line2} <br />
                  {city}, {postCode}
                  <br />
                  {state}, {countryName}
                  <br />
                </p>
                <p className={styles.light}> {phoneNumber}</p>
                {mobile && (
                  <p className={globalStyles.voffset3}>date : {eventDate}</p>
                )}
                <p className={styles.edit}>
                  <a
                    className={globalStyles.cerise}
                    onClick={props.showRegistryFull}
                  >
                    view details | edit
                  </a>{" "}
                  <a
                    className={cs(styles.lane2, styles.black)}
                    onClick={props.openShareLinkPopup}
                  >
                    share link
                  </a>
                </p>
              </address>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRegistry;
