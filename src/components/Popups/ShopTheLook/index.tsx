import React, { useEffect } from "react";
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
import Slider from "react-slick";
import "./index.css";
import { PLPProductItem } from "typings/product";
type PopupProps = {
  data: any;
  currency: any;
  notifyMeClick: (product: PLPProductItem) => void;
  onEnquireClick: (id: number, partner?: string) => void;
  closeShopLookPopUp: () => void;
  isOpen?: boolean;
};
const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 2.2,
  slidesToScroll: 1,
  arrows: false,
  initialSlides: 0
};

const ShopTheLookPopup: React.FC<PopupProps> = ({
  data,
  currency,
  notifyMeClick,
  onEnquireClick,
  closeShopLookPopUp,
  isOpen
}) => {
  const { mobile, tablet } = useSelector((state: AppState) => state.device);
  const filteredLooksProducts = data.looksProducts?.filter(
    (item: any) => item.priceRecords?.[currency] !== 0
  );
  useEffect(() => {
    if (!mobile) closeShopLookPopUp();
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobile, isOpen, closeShopLookPopUp]);

  return (
    <>
      {mobile && (
        <div className={styles.shopModalContainer}>
          <div className={styles.shopTheLook}>
            <div
              onClick={closeShopLookPopUp}
              className={cs(styles.titleWrapper)}
            >
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
            {data?.lookImageType === "landscape" && (
              <div className={bootstrap.row}>
                <div className={cs(bootstrap.col12, styles.shopLandScape)}>
                  <img
                    alt={data?.altText || data?.title}
                    src={
                      data?.lookImageUrl ||
                      (data?.images?.[0]
                        ? data?.images?.[0]?.productImage
                        : "/static/img/noimageplp.png")
                    }
                    className={cs(globalStyles.imgResponsive)}
                  />
                </div>
              </div>
            )}
            <div className={"sliderContainer"}>
              <Slider {...settings}>
                {filteredLooksProducts &&
                  filteredLooksProducts?.map((item: any, i: number) => {
                    return (
                      <div
                        key={item.id}
                        className={cs(styles.looksItemContainer)}
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
                          closeShopLookPopUp={closeShopLookPopUp}
                        />
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ShopTheLookPopup;
