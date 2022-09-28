import React, { useEffect, useState } from "react";
import styles from "./../styles.scss";
import { AppState } from "reducers/typings";
import { useDispatch, useSelector } from "react-redux";
import { Landing } from "reducers/loyalty/typings";
import LoyaltyService from "services/loyalty";
import { updateLoyaltyLanding } from "actions/loyalty";

const Rewards = () => {
  const [showMore, setShowMore] = useState(false);
  const dispatch = useDispatch();
  const {
    loyalty: { landing }
  }: { loyalty: { landing: Landing[] } } = useSelector(
    (state: AppState) => state
  );

  useEffect(() => {
    LoyaltyService.getLoyaltyLanding(dispatch)
      .then(res => {
        dispatch(updateLoyaltyLanding(res));
      })
      .catch(e => {
        console.log("e======", e);
      });
  }, []);

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
        {landing?.slice(0, 4)?.map((ele, ind) => (
          <div className={styles.rewardRow} key={ind}>
            <img src={ele?.uploadIcon} />
            <div className={styles.rewardCol}>
              <p className={styles.rewardHeading}>{ele?.heading}</p>
              <p className={styles.rewardSubHead}>{ele?.shortDescription}</p>
            </div>
          </div>
        ))}

        <div
          id="hiddenRewards"
          className={showMore ? styles.showRewards : styles.hiddenRewards}
        >
          {landing?.slice(4, landing?.length)?.map((ele, ind) => (
            <div className={styles.rewardRow} key={ind}>
              <img src={ele?.uploadIcon} />
              <div className={styles.rewardCol}>
                <p className={styles.rewardHeading}>{ele?.heading}</p>
                <p className={styles.rewardSubHead}>{ele?.shortDescription}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {landing?.length > 4 ? (
        <p className={styles.showMore} onClick={() => handleShowMore()}>
          {showMore ? "SHOW LESS" : "SHOW MORE"}
        </p>
      ) : null}
    </div>
  );
};

export default Rewards;
