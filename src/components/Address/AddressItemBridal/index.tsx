import React, { useContext } from "react";
import { AddressData } from "../typings";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
// import bridalRing from "../../../images/bridal/rings.svg";
import bridalGiftIcon from "../../../images/registery/addedReg.svg";
import { AddressContext } from "../AddressMain/context";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

type Props = {
  addressData: AddressData;
  addressType: string;
  title?: string;
};

const AddressItemBridal: React.FC<Props> = ({
  addressData,
  addressType,
  title
}) => {
  const { markAsDefault } = useContext(AddressContext);
  const { shippingAddressId } = useSelector((state: AppState) => state.address);

  return (
    <div
      className={
        addressType !== "BILLING"
          ? cs(
              bootstrapStyles.col12,
              bootstrapStyles.colMd6,
              globalStyles.voffset5,
              globalStyles.marginB30,
              styles.checkoutAddress,
              "address-container"
            )
          : ""
      }
      id={`address-item-${addressData?.id}`}
      onClick={() => markAsDefault(addressData, addressData?.id)}
    >
      {addressData && (
        <div
          className={cs(styles.addressItemContainer, styles.checkout, {
            [styles.defaultAddress]: shippingAddressId === addressData?.id
          })}
        >
          <div
            className={cs(
              styles.addressItem,
              styles.addressItemCheckout,
              styles.checkoutHeightFix
            )}
          >
            <div>
              <div className={styles.lineHead}>
                <div className={styles.radio}>
                  <input
                    className={styles.defaultAddressCheckbox}
                    checked={shippingAddressId === addressData?.id}
                    type="radio"
                  />
                  <span className={styles.checkmark}></span>
                </div>
                <div className={styles.displayFlex}>
                  <div
                    className={cs(
                      styles.lineHead,
                      styles.titleWidth,
                      globalStyles.textCapitalize
                    )}
                  >
                    {title}
                    {addressData.registrantName &&
                      !addressData.coRegistrantName && (
                        <span>
                          {addressData.registrantName}&#39;s{" "}
                          {addressData.occasion} Registry
                        </span>
                      )}
                    {addressData.registrantName &&
                      addressData.coRegistrantName && (
                        <span>
                          {addressData.registrantName} &{" "}
                          {addressData.coRegistrantName}&#39;s{" "}
                          {addressData.occasion} Registry
                        </span>
                      )}
                  </div>

                  <div
                    className={cs(
                      styles.defaultAddressDiv,
                      styles.bridalAddress
                    )}
                  >
                    {/* <svg
                      viewBox="0 5 40 40"
                      width="35"
                      height="35"
                      preserveAspectRatio="xMidYMid meet"
                      x="0"
                      y="0"
                      className={styles.ceriseBridalRings}
                    >
                      <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                    </svg> */}
                    <img
                      className={styles.ceriseBridalRings}
                      src={bridalGiftIcon}
                      width="30"
                      alt="gift_reg_icon"
                    />
                  </div>
                </div>
              </div>

              <div className={cs(styles.bridalPredefined)}>
                Address predefined by registrant
              </div>

              <div className={styles.addressMain}>
                <div className={styles.text}>
                  {addressData.line1}
                  {addressData.line2 && ", "}
                  {addressData.line2},
                </div>

                <div className={styles.text}>
                  {addressData.city}, {addressData.state} -{" "}
                  {addressData.postCode},
                </div>
                <div className={styles.text}>{addressData.countryName}</div>
              </div>
              <p className={cs(styles.phone, styles.phoneBridal)}>
                {addressData.phoneCountryCode} {addressData.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressItemBridal;
