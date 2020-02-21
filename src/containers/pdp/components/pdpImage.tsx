import React, { memo, useCallback } from "react";

import { ProductImage } from "typings/image";

import globalStyles from "styles/global.scss";

type Props = ProductImage & {
  onClick: (index: number, id: number) => void;
  index: number;
};

const PDPImage: React.FC<Props> = ({ id, productImage, index, onClick }) => {
  const src = productImage.replace(/Micro|Large/i, "Medium");
  const onImageClick = useCallback(() => {
    onClick && onClick(index, id);
  }, [id]);

  return (
    <img
      className={globalStyles.imgResponsive}
      src={src}
      onClick={onImageClick}
    />
  );
};

export default memo(PDPImage);
