import React, { memo, useCallback, EventHandler, SyntheticEvent } from "react";

import { ProductImage } from "typings/image";
import LazyImage from "components/LazyImage";
import mobile3d from "images/3d/3DButton.svg";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { useDispatch } from "react-redux";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";
import { Product } from "typings/product";
import { Currency } from "typings/currency";

type Props = ProductImage & {
  data?: Product;
  selectedSizeId?: number | undefined;
  corporatePDP?: boolean;
  currency?: Currency;
  buttoncall?: JSX.Element | null | undefined;
  onClick: (index: number, id: number) => void;
  index: number;
  onLoad?: EventHandler<SyntheticEvent<HTMLImageElement>>;
  alt: string;
};

const PDPImage: React.FC<Props> = ({
  data,
  selectedSizeId,
  corporatePDP,
  currency,
  buttoncall,
  id,
  alt,
  productImage,
  index,
  onClick,
  onLoad,
  icon,
  code,
  iconAll,
  codeAll
}) => {
  const src = productImage?.replace(/Micro|Large/i, "Medium");
  const onImageClick = useCallback(() => {
    onClick && onClick(index, id);
  }, [id]);
  const dispatch = useDispatch();

  const onClick3dButton = (e: any, code: any) => {
    if (data && currency) {
      const selectedSize = data?.childAttributes?.filter(
        item => item.id == selectedSizeId
      )[0];

      const price = corporatePDP
        ? data?.priceRecords[currency]
        : selectedSize && selectedSize?.priceRecords
        ? selectedSize?.priceRecords[currency]
        : data?.priceRecords[currency];

      const discountPrices =
        selectedSize && selectedSize?.discountedPriceRecords
          ? selectedSize?.discountedPriceRecords[currency]
          : data?.discountedPriceRecords[currency];

      dispatch(
        updateComponent(
          POPUP.HELLOARPOPUP,
          {
            code,
            data,
            buttoncall,
            showPrice:
              data.invisibleFields &&
              data.invisibleFields.indexOf("price") > -1,
            price,
            discountPrices
          },
          true
        )
      );
    } else {
      dispatch(
        updateComponent(
          POPUP.HELLOARPOPUP,
          {
            code
          },
          true
        )
      );
    }

    dispatch(updateModal(true));
  };

  return (
    <div className={globalStyles.relative}>
      <LazyImage
        className={globalStyles.imgResponsive}
        src={src}
        alt={alt}
        aspectRatio="155:232"
        onClick={onImageClick}
        onLoad={onLoad}
        isVisible={index < 2 ? true : undefined}
      />
      {iconAll && (
        <img
          src={mobile3d}
          className={styles.helloimageButton}
          onClick={(e: any) => onClick3dButton(e, codeAll)}
        ></img>
      )}
    </div>
  );
};

export default memo(PDPImage);
