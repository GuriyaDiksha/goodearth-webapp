import React, { memo, useCallback, EventHandler, SyntheticEvent } from "react";

import { ProductImage } from "typings/image";
import LazyImage from "components/LazyImage";

import globalStyles from "styles/global.scss";

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
  onLoad
}) => {
  const src = productImage.replace(/Micro|Large/i, "Medium");
  const onImageClick = useCallback(() => {
    onClick && onClick(index, id);
  }, [id]);

  return (
    <LazyImage
      className={globalStyles.imgResponsive}
      src={src}
      alt={alt}
      aspectRatio="155:232"
      onClick={onImageClick}
      onLoad={onLoad}
      isVisible={index < 2 ? true : undefined}
    />
  );
};

export default memo(PDPImage);
