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
              styles.checkoutFix,
              styles.checkoutHeightFix
            )}
          >
            <div>
              {
                <svg
                  viewBox="-3 -3 46 46"
                  width="60"
                  height="60"
                  preserveAspectRatio="xMidYMid meet"
                  x="0"
                  y="0"
                  className={styles.ceriseBridalRings}
                >
                  <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
                </svg>
              }
              <div className={cs(styles.lineHead, styles.checkoutFix)}>
                {title}
                {addressData.registrantName}&nbsp; &{" "}
                {addressData.coRegistrantName}&#39;s {addressData.occasion}{" "}
                Registry
              </div>

              <div className={cs(globalStyles.marginT20, globalStyles.c10LR)}>
                Address predefined by registrant
              </div>
            </div>
          </div>
          {/* <div
            className={cs(
              styles.shipToThisBtn,
              globalStyles.ceriseBtn,
              globalStyles.cursorPointer
            )}
            onClick={() => onSelectAddress(addressData)}
          >
            SHIP&nbsp;TO THIS ADDRESS
          </div> */}
        </div>
      )}
    </div>
  );
};

export default AddressItemBridal;
