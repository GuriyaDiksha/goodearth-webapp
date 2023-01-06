import React, { memo } from "react";
import styles from "./styles.scss";
import { Link } from "react-router-dom";
import giftcardTile from "images/giftcard-tile.png";

const GiftcardItem: React.FC<{
  isCorporateGifting: boolean;
}> = memo(() => {
  return (
    <div className={styles.plpMain}>
      <div className={styles.imageBoxnew} id="gift-card-item">
        <Link to="/giftcard">
          <img
            alt="giftcard-tile"
            src={giftcardTile}
            className={styles.imageResultnew}
          />
        </Link>
      </div>
      <div className={styles.imageContent}>
        <p className={styles.collectionName}></p>
        <p className={styles.productN}>
          <Link to="/giftcard"> Gift Card</Link>
        </p>
      </div>
    </div>
  );
});

export default GiftcardItem;
