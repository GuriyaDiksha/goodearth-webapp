import React, { useState } from "react";
import { PLPResultItemProps } from "./typings";
// import { PartialChildProductAttributes } from "../../typings/product";
import styles from "./styles.scss";
import cs from "classnames";
import iconStyles from "../../styles/iconFonts.scss";
import bootstyles from "../../styles/bootstrap/bootstrap-grid.scss";

const PlpResultItem: React.FC<PLPResultItemProps> = (
  props: PLPResultItemProps
) => {
  const { product } = props;
  const [primaryimage, setPrimaryimage] = useState(true);

  const onMouseEnter = (): void => {
    setPrimaryimage(false);
  };

  const onMouseLeave = (): void => {
    setPrimaryimage(true);
  };
  const image = primaryimage
    ? product.plpImages
      ? product.plpImages[0]
      : ""
    : product.plpImages
    ? product.plpImages[1]
    : "";
  return (
    <div>
      <div className={styles.imageBoxnew} id={"" + product.id}>
        <a
          href={product.url}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <img src={image} className={styles.imageResultnew} />
        </a>
        <div className={primaryimage ? styles.hidden : styles.combodiv}>
          <div className={styles.imageHover}>
            <span>quickview</span>
          </div>
          <div className={styles.imageHover}>
            <i className={cs(iconStyles.icon, iconStyles.iconWishlist)}></i>
          </div>
          <div className={styles.hidden}>
            <i
              className={cs(iconStyles.icon, iconStyles.iconWishlistAdded)}
            ></i>
          </div>
        </div>
      </div>
      <div className={styles.imageContent}>
        <p className={styles.productN}>
          <a href={product.url}> {product.title} </a>
        </p>
        <p className={styles.productN}></p>
        <div
          className={
            primaryimage
              ? styles.hidden
              : cs(styles.productSizeList, bootstyles.row)
          }
        >
          <div className={styles.productSize}> size</div>
          <div className="">
            <ul>
              <li>p</li>
              <li>1</li>
              <li>2</li>
              <li>3</li>
              {/* {props.product.childAttributes?(props.product.childAttributes).map((data:PartialChildProductAttributes,i:number)=>{
            return <li key={i}>{data.sku}</li>
            }):''} */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlpResultItem;
