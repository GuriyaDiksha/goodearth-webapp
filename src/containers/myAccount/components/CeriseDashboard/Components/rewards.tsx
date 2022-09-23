import React, { useState } from "react";
import styles from "./../styles.scss";
import cs from "classnames";
import cerisePoint from "./../../../../../images/loyalty/cerisePoint.svg";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import { Landing } from "reducers/loyalty/typings";

const Rewards = () => {
  const [showMore, setShowMore] = useState(false);
  const {
    loyalty: { landing }
  }: { loyalty: { landing: Landing[] } } = useSelector(
    (state: AppState) => state
  );

  const handleShowMore = () => {
    const ele =
      typeof document == "object" &&
      (document.getElementById("hiddenRewards") as HTMLDivElement);
    if (ele) {
      if (!showMore) {
        ele.style.maxHeight = `${
          document.getElementById("hiddenRewards")?.scrollHeight
        }px`;
      } else {
        ele.style.maxHeight = "0px";
      }
    }
    setShowMore(!showMore);
  };

  return (
    <div className={styles.rewardsWrp}>
      <div className={styles.rewardsHeader}>
        <p>My Rewards</p>
        <a
          href={`/customer-assistance/terms`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms & Conditions Apply*
        </a>
      </div>

      <div className={styles.rewardsList}>
        {landing?.slice(0, 4)?.map((ele, ind) => {
          <div className={styles.rewardRow} key={ind}>
            <img src={ele?.uploadIcon} />
            <div className={styles.rewardCol}>
              <p className={styles.rewardHeading}>{ele?.heading}</p>
              <p className={styles.rewardSubHead}>{ele?.shortDescription}</p>
            </div>
          </div>;
        })}

        <div
          id="hiddenRewards"
          className={showMore ? styles.showRewards : styles.hiddenRewards}
        >
          {landing?.slice(4, landing?.length)?.map((ele, ind) => {
            <div className={styles.rewardRow} key={ind}>
              <img src={ele?.uploadIcon} />
              <div className={styles.rewardCol}>
                <p className={styles.rewardHeading}>{ele?.heading}</p>
                <p className={styles.rewardSubHead}>{ele?.shortDescription}</p>
              </div>
            </div>;
          })}
        </div>
      </div>

      <p className={styles.showMore} onClick={() => handleShowMore()}>
        {showMore ? "SHOW LESS" : "SHOW MORE"}
      </p>
    </div>
  );
};

export default Rewards;
