import { Context } from "components/Modal/context";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import cs from "classnames";
import iconStyles from "styles/iconFonts.scss";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import LazyImage from "components/LazyImage";
import noPlpImage from "../../../images/noimageplp.png";
import PDPLooksItem from "components/pairItWith/PDPLooksItem";
type PopupProps = {
  data: any;
  currency: any;
  notifyMeClick: () => void;
  onEnquireClick: () => void;
};

const ShopTheLookPopup: React.FC<PopupProps> = ({
  data,
  currency,
  notifyMeClick,
  onEnquireClick
}) => {
  console.log(data, data?.altText, currency, "props");
  const { mobile } = useSelector((state: AppState) => state.device);
  const { closeModal } = useContext(Context);
  const filteredLooksProducts = data.looksProducts?.filter(
    (item: any) => item.priceRecords?.[currency] !== 0
  );
  console.log("pop");
  return (
    <div className={styles.shopTheLook}>
      <div onClick={closeModal} className={cs(styles.titleWrapper)}>
        <div className={cs(globalStyles.textCenter, styles.shopTitle)}>
          Shop The Look
        </div>
        <i
          className={cs(
            iconStyles.icon,
            iconStyles.iconCrossNarrowBig,
            styles.closeIcon
          )}
        ></i>
      </div>
      {data?.categories?.[0] === "Home" && (
        <div className={bootstrap.row}>
          <div className={bootstrap.col12}>
            <LazyImage
              aspectRatio="100:59"
              alt={data?.altText}
              src={
                data?.lookImageUrl ||
                (data?.images?.[0]
                  ? data?.images?.[0]?.productImage
                  : "/static/img/noimageplp.png")
              }
              onError={(e: any): void => {
                e.target.onerror = null;
                e.target.src = noPlpImage;
              }}
            />
          </div>
        </div>
      )}
      {
        <div className={bootstrap.row}>
          {filteredLooksProducts &&
            filteredLooksProducts?.map((item: any, i: number) => {
              return (
                <div
                  key={item.id}
                  className={cs(styles.looksItemContainer, bootstrap.col6)}
                >
                  <PDPLooksItem
                    page="ShopByLook"
                    position={i}
                    product={item}
                    addedToWishlist={false}
                    currency={currency || "INR"}
                    key={item.id}
                    mobile={mobile || false}
                    isCorporate={false}
                    notifyMeClick={notifyMeClick}
                    onEnquireClick={onEnquireClick}
                  />
                </div>
              );
            })}
        </div>
      }
    </div>
  );
};
export default ShopTheLookPopup;
