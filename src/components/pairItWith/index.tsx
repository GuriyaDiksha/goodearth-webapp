import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
import cs from "classnames";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/myslick.css";
import "./slick.css";
import { PairItWithSliderProps } from "./typings";
import Slider from "react-slick";
import ModalStyles from "components/Modal/styles.scss";
// import * as valid from "utils/validate";
import { ChildProductAttributes, PLPProductItem } from "typings/product";
import PDPLooksItem from "./PDPLooksItem";
import { POPUP } from "constants/components";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { updateComponent, updateModal } from "actions/modal";

const PairItWithSlider: React.FC<PairItWithSliderProps> = (
  props: PairItWithSliderProps
) => {
  const { data, setting, mobile, currency } = props;
  useEffect(() => {
    // valid.MoreFromCollectionProductImpression(
    //   data,
    //   "MoreFromCollection",
    //   currency || "INR"
    // );
  }, []);
  const dispatch = useDispatch();
  const { isSale } = useSelector((state: AppState) => state.info);

  const onEnquireClick = (id: number) => {
    // const { updateComponentModal, changeModalState } = this.props;
    // const mobile = this.props.device.mobile;
    dispatch(
      updateComponent(
        // <CorporateEnquiryPopup id={id} quantity={quantity} />,
        POPUP.THIRDPARTYENQUIRYPOPUP,
        {
          id
        },
        mobile ? true : false,
        mobile ? ModalStyles.bottomAlign : undefined
      )
    );
    dispatch(updateModal(true));
  };

  const notifyMeClick = (product: PLPProductItem) => {
    const {
      categories,
      collections,
      priceRecords,
      discountedPriceRecords,
      childAttributes,
      title,
      discount,
      badgeType
    } = product;
    const selectedIndex = childAttributes?.length == 1 ? 0 : undefined;
    // childAttributes?.map((v, i) => {
    //   if (v.id === selectedSize?.id) {
    //     selectedIndex = i;
    //   }
    // });
    const index = categories.length - 1;
    let category = categories[index]
      ? categories[index].replace(/\s/g, "")
      : "";
    category = category.replace(/>/g, "/");
    dispatch(
      updateComponent(
        POPUP.NOTIFYMEPOPUP,
        {
          collection:
            collections && collections.length > 0 ? collections[0] : "",
          category: category,
          price: priceRecords[currency],
          currency: currency,
          childAttributes: childAttributes as ChildProductAttributes[],
          title: title,
          selectedIndex: selectedIndex,
          discount: discount,
          badgeType: badgeType,
          isSale: isSale,
          discountedPrice: discountedPriceRecords[currency],
          list: "plp"
        },
        false,
        ModalStyles.bottomAlign
      )
    );
    dispatch(updateModal(true));
  };
  return (
    <div
      className={cs(bootstrapStyles.colMd12, "more-collection", {
        "mobile-slider": mobile
      })}
    >
      <div className={bootstrapStyles.row}>
        <h2 className={cs(styles.header, globalStyles.voffset5)}>
          Pair It With
        </h2>

        <div className={cs(bootstrapStyles.col12, styles.sliderContainer)}>
          <Slider {...setting} className="pdp-slider recommend-block">
            {(data as PLPProductItem[])?.map(
              (item: PLPProductItem, i: number) => {
                return (
                  // <div key={item.id} className={styles.slide}>
                  //   {item.salesBadgeImage ? (
                  //     <div className={styles.saleBanner}>
                  //       <img src={item.salesBadgeImage} />
                  //     </div>
                  //   ) : (
                  //     ""
                  //   )}
                  //   <Link
                  //     to={item.url}
                  //     className={styles.link}
                  //     onClick={() =>
                  //       valid.MoreFromCollectionProductClick(
                  //         item,
                  //         "MoreFromCollection",
                  //         currency || "INR",
                  //         i
                  //       )
                  //     }
                  //   >
                  //     <LazyImage
                  //       aspectRatio="62:93"
                  //       src={item.plpImages?.[0] || "/static/img/noimageplp.png"}
                  //       className={cs(globalStyles.imgResponsive)}
                  //     />
                  //   </Link>
                  //   <div className={styles.moreBlock}>
                  //     {/* <p className={styles.productH}>{item.collection}</p> */}
                  //     <p className={styles.productN}>
                  //       <Link
                  //         to={item.url}
                  //         onClick={() =>
                  //           valid.MoreFromCollectionProductClick(
                  //             item,
                  //             "MoreFromCollection",
                  //             currency || "INR",
                  //             i
                  //           )
                  //         }
                  //       >
                  //         {" "}
                  //         {item.title}{" "}
                  //       </Link>
                  //     </p>
                  //   </div>
                  // </div>
                  <div key={item.id} className={styles.slide}>
                    <PDPLooksItem
                      page="PLP"
                      position={i}
                      product={item}
                      addedToWishlist={false}
                      currency={currency || "INR"}
                      key={item.id}
                      mobile={mobile || false}
                      // isVisible={index < 3 ? true : undefined}
                      // onClickQuickView={onClickQuickView}
                      isCorporate={false}
                      notifyMeClick={notifyMeClick}
                      onEnquireClick={onEnquireClick}
                    />
                  </div>
                );
              }
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default PairItWithSlider;
