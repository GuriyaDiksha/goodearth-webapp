import React, { memo, useCallback, EventHandler, SyntheticEvent } from "react";

import { ProductImage } from "typings/image";
import LazyImage from "components/LazyImage";
import mobile3d from "images/3d/3DButton.svg";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { useDispatch } from "react-redux";
import { updateComponent, updateModal } from "actions/modal";
import { POPUP } from "constants/components";

type Props = ProductImage & {
  onClick: (index: number, id: number) => void;
  index: number;
  onLoad?: EventHandler<SyntheticEvent<HTMLImageElement>>;
  alt: string;
};

const PDPImage: React.FC<Props> = ({
  id,
  alt,
  productImage,
  index,
  onClick,
  onLoad,
  icon,
  code
}) => {
  const src = productImage?.replace(/Micro|Large/i, "Medium");
  const onImageClick = useCallback(() => {
    onClick && onClick(index, id);
  }, [id]);
  const dispatch = useDispatch();

  const onClick3dButton = (e: any, code: any) => {
    dispatch(
      updateComponent(
        POPUP.HELLOARPOPUP,
        {
          code
        },
        true
      )
    );
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
      {icon && (
        <img
          src={mobile3d}
          className={styles.helloimageButton}
          onClick={(e: any) => onClick3dButton(e, code)}
        ></img>
      )}
    </div>
  );
};

export default memo(PDPImage);
