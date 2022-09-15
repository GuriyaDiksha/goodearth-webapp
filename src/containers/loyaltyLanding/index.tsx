import React from "react";
import MakerEnhance from "components/maker";
import styles from "./styles.scss";
import ceriseTulip from "./../../images/loyalty/ceriseTulip.svg";
import sitaraGold from "./../../images/loyalty/sitaraGold.svg";
import cerisePoint from "./../../images/loyalty/cerisePoint.svg";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";

const LoyaltyLanding = () => {
  return (
    <div className={styles.loyaltyConatiner}>
      {/* <MakerEnhance
          user="goodearth"
          href={`${window.location.origin}${location.pathname}?${location.search}`}
        /> */}
      <div className={styles.loyaltyWrp}>
        <div className={styles.loyaltyHeader}>
          <p className={styles.heading}>Cerise Membership</p>
          <p className={styles.subHeading}>
            A bespoke experience for our loyal customers who share the vision of
            celebrating Indian craftsmanship and sustainability.
          </p>
        </div>
        <div className={styles.loyaltyInfo}>
          <div className={styles.loyaltyInfoRow}>
            <img src={ceriseTulip} />
            <div className={styles.loyaltyInfoCol}>
              <p className={styles.loyaltyInfoHeading}>Cerise Club</p>
              <p className={styles.loyaltyInfoSubHead}>
                Seamless enrolment on crossing an annual purchase value of ₹ 1
                lakh.
              </p>
            </div>
          </div>
          <div className={styles.loyaltyInfoRow}>
            <img src={sitaraGold} />
            <div className={styles.loyaltyInfoCol}>
              <p className={styles.loyaltyInfoHeading}>Cerise Sitara</p>
              <p className={styles.loyaltyInfoSubHead}>
                Enjoy exclusive privileges on crossing an annual purchase value
                of ₹ 5 lakh.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.loyaltyPointsTable}>
          <div className={cs(bootstrap.row, styles.tableRow)}>
            <p className={cs(bootstrap.col10, styles.tableHeading)}>Benefits</p>
            <p className={cs(bootstrap.col1, styles.tableHeading)}>Club</p>
            <p className={cs(bootstrap.col1, styles.tableHeading)}>Sitara</p>
          </div>
          <div className={cs(bootstrap.row, styles.tableRow)}>
            <img className={cs(bootstrap.col1)} src={cerisePoint} />
            <div className={cs(bootstrap.col9, styles.tableHeading)}>
              <p className={cs(styles.tableHeading)}>Cerise Points</p>
              <p className={cs(styles.tableHeading)}>
                Earn Cerise points on the value of your purchases. 1 point is
                equivalent 1 ₹.
              </p>
            </div>
            <p className={cs(bootstrap.col1, styles.tableHeading)}>10%</p>
            <p className={cs(bootstrap.col1, styles.tableHeading)}>10%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyLanding;
