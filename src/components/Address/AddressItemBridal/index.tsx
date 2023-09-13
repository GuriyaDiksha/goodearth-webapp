import React, { useContext } from "react";
import { AddressData } from "../typings";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import bridalRing from "../../../images/bridal/rings.svg";
import { AddressContext } from "../AddressMain/context";

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
  return (
    <div
      className={
        addressType !== "BILLING"
          ? cs(
              bootstrapStyles.col12,
              bootstrapStyles.colMd6,
              globalStyles.voffset5,
              styles.checkoutAddress,
              "address-container"
            )
          : ""
      }
      id={`address-item-${addressData?.id}`}
      onClick={() => markAsDefault(addressData, addressData?.id)}
    >
      {addressData && (
        <div className={cs(styles.addressItemContainer, styles.defaultAddress)}>
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
                    checked={true}
                    type="radio"
                  />
                  <span className={styles.checkmark}></span>
                </div>
                <div
                  className={cs(
                    styles.lineHead,
                    styles.titleWidth,
                    globalStyles.textCapitalize
                  )}
                >
                  {title}
                  {addressData.registrantName}&nbsp; &{" "}
                  {addressData.coRegistrantName}&#39;s {addressData.occasion}{" "}
                  Registry
                </div>

                <div
                  className={cs(styles.defaultAddressDiv, styles.bridalAddress)}
                >
                  <svg
                    viewBox="0 5 40 40"
                    width="35"
                    height="35"
                    preserveAspectRatio="xMidYMid meet"
                    x="0"
                    y="0"
                    className={styles.ceriseBridalRings}
                  >
                    <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                  </svg>
                </div>
              </div>

              <div
                className={cs(
                  globalStyles.marginT10,
                  globalStyles.marginB20,
                  styles.bridalPredefined
                )}
              >
                Address predefined by registrant
              </div>

              <div className={styles.addressMain}>
                <div className={styles.text}>
                  {addressData.line1}
                  {addressData.line2 && ","}
                  {addressData.line2},
                </div>

                <div className={styles.text}>
                  {addressData.city},{addressData.state} -{" "}
                  {addressData.postCode},
                </div>
                <div className={styles.text}>{addressData.countryName}</div>
              </div>
              <p className={styles.phone}>
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
