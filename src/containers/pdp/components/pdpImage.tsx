import React, { memo, useCallback, EventHandler, SyntheticEvent } from "react";

import { ProductImage } from "typings/image";

import globalStyles from "styles/global.scss";

type Props = ProductImage & {
  onClick: (index: number, id: number) => void;
  index: number;
  onLoad?: EventHandler<SyntheticEvent<HTMLImageElement>>;
};

const PDPImage: React.FC<Props> = ({
  id,
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
    <img
      className={globalStyles.imgResponsive}
      src={src}
      onClick={onImageClick}
      onLoad={onLoad}
    />
  );
};

export default memo(PDPImage);
