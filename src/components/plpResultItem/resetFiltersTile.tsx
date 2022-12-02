import React, { memo } from "react";
import styles from "./styles.scss";
import bird from "images/bird.png";
import cs from "classnames";

const ResetFiltersTile: React.FC<{
  resetFilters: (event: any, key: string, ischange?: boolean) => void;
  mobileApply: (st: string) => void;
  mobile?: boolean;
  tablet?: boolean;
  view?: "list" | "grid";
}> = memo(({ resetFilters, mobileApply, view, mobile, tablet }) => {
  return (
    <div className={styles.plpMain}>
      <div className={styles.imageBoxnew} id="gift-card-item">
        <img
          alt="giftcard-tile"
          src="https://djhiy8e1dslha.cloudfront.net/static/email/giftcard/gift-card-plp-tile.jpg"
          className={styles.imageResultnew}
        />
        <div className={styles.overlay}>
          <img
            src={bird}
            className={cs({
              [styles.mobileGrid]: mobile && view == "grid" && !tablet
            })}
          />
          <p className={styles.textContent}>
            <p
              className={cs(styles.msg, {
                [styles.mobileGrid]: mobile && view == "grid" && !tablet
              })}
            >
              Sorry, we cannot find what you are looking for. Reset the filters
              to try again.
            </p>
            <p
              className={cs(styles.byline, {
                [styles.mobileGrid]: mobile && view == "grid" && !tablet
              })}
            >
              Reset the filters to try again.
            </p>
          </p>
          <a
            onClick={e => {
              resetFilters(e, "all");
              mobileApply("load");
              // mobileApply(e);
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
