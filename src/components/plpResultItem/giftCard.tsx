import React, { memo } from "react";
import styles from "./styles.scss";
import { Link } from "react-router-dom";

const GiftcardItem: React.FC<{}> = memo(() => {
  return (
    <div className={styles.plpMain}>
      <div className={styles.imageBoxnew} id="1">
        <Link to="/giftcard">
          <img
            src="https://ge-website-staging.s3.ap-south-1.amazonaws.com/static/email/giftcard/gift-card-plp-tile.jpg"
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
