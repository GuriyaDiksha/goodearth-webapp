import React, { memo } from "react";
import styles from "./styles.scss";
import bird from "images/bird.png";

const ResetFiltersTile: React.FC<{
  resetFilters: (event: any, key: string, ischange?: boolean) => void;
}> = memo(({ resetFilters }) => {
  return (
    <div className={styles.plpMain}>
      <div className={styles.imageBoxnew} id="gift-card-item">
        <img
          alt="giftcard-tile"
          src="https://djhiy8e1dslha.cloudfront.net/static/email/giftcard/gift-card-plp-tile.jpg"
          className={styles.imageResultnew}
        />
        <div className={styles.overlay}>
          <img src={bird} />
          <p className={styles.textContent}>
            <p className={styles.msg}>
              Sorry, we cannot find what you are looking for. Reset the filters
              to try again.
            </p>
            <p className={styles.byline}>Reset the filters to try again.</p>
          </p>
          <a
            onClick={e => {
              resetFilters(e, "all");
            }}
          >
            <p className={styles.resetLink}>RESET FILTERS</p>
          </a>
        </div>
      </div>
      <div className={styles.imageContent}>
        <p className={styles.collectionName}></p>
        <p className={styles.productN}></p>
      </div>
    </div>
  );
});

export default ResetFiltersTile;
