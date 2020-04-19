import React, { memo } from "react";

import { Props } from "./typings";

import styles from "./styles.scss";
import globalStyles from "styles/global.scss";

import { Link } from "react-router-dom";

const ColorSelector: React.FC<Props> = ({ products }) => {
  const colors = products.map(({ url, id, images, color }) => {
    const [image] = images;
    const [colorString] = color;
    if (!image || !colorString) {
      return;
    }

    const { productImage } = image;
    const colorName = colorString.split("-")[1];

    return (
      <Link key={id} to={url} className={styles.link}>
        <img src={productImage} className={globalStyles.imgResponsive} />
        <div className={styles.text}>{colorName}</div>
      </Link>
    );
  });
  return <div className={styles.container}>{colors}</div>;
};

export default memo(ColorSelector);
