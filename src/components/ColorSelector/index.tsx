import React, { memo } from "react";

import { Props } from "./typings";

import cs from "classnames";

import styles from "./styles.scss";
import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

const ColorSelector: React.FC<Props> = ({ products, onClick }) => {
  const location = useLocation();
  const colors = products
    .sort((a, b) => b.id - a.id)
    .map(({ url, id, images, color }) => {
      const [image] = images;
      const [colorString] = color;
      if (!image || !colorString) {
        return;
      }

      const { productImage } = image;
      const colorName = colorString.split("-")[1];

      return (
        <Link
          key={id}
          to={location.pathname.includes(url) ? "#" : url}
          className={cs(styles.link, {
            [styles.disabled]: location.pathname.includes(url)
          })}
          onClick={onClick}
        >
          <img src={productImage} className={styles.imgResponsive} />
          {/* <div className={styles.text}>{colorName}</div> */}
        </Link>
      );
    });
  return <div className={styles.container}>{colors}</div>;
};

export default memo(ColorSelector);
