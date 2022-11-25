import React, { useEffect, useState } from "react";
import MakerEnhance from "components/maker";
import styles from "./styles.scss";
import ceriseTulip from "./../../images/loyalty/ceriseTulip.svg";
import sitaraGold from "./../../images/loyalty/sitaraGold.svg";
import cs from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import LoyaltyService from "services/loyalty";
import { Landing } from "reducers/loyalty/typings";
import LandingTable from "./landingTable";
import { updateLoyaltyLanding } from "actions/loyalty";

const LoyaltyLanding = () => {
  const [data, setData] = useState<Landing[]>([]);
  const [showMaker, setShowMaker] = useState(false);

  const {
    device: { mobile },
    info: { showTimer }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    setShowMaker(true);
    LoyaltyService.getLoyaltyLanding(dispatch)
      .then(res => {
        setData(res);
        dispatch(updateLoyaltyLanding(res));
      })
      .catch(e => {
        console.log("e======", e);
      });
  }, []);

  return (
    <div
      className={cs(styles.loyaltyConatiner, {
        [styles.loyaltyContainerTimer]: showTimer
      })}
    >
      {showMaker && (
        <MakerEnhance
          user="goodearth"
          href={`${window.location.origin}${location.pathname}?${location.search}`}
        />
      )}
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

        <LandingTable mobile={mobile} data={data} />
      </div>

      <p className={styles.footer}>
        For further information, please refer to
        <br />
        <a
          href={`/customer-assistance/terms`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms &#38; Conditions
        </a>
        &nbsp;and{" "}
        <a
          href={`/customer-assistance/terms#faq`}
          target="_blank"
          rel="noopener noreferrer"
        >
          FAQs.
        </a>
      </p>
    </div>
  );
};

export default LoyaltyLanding;
