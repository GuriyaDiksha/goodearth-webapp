import React, { useEffect, useState } from "react";
import rewardIcons from "./iconRewards";
import styles from "./styles.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";

type Props = {
  slab: string;
};

const RewardsComponent: React.FC<Props> = props => {
  const [ceriseClubRewards, setCeriseClubRewards]: any[] = useState([]);

  useEffect(() => {
    if (props.slab.toLowerCase() == "cerise") {
      const rewardIconsClub = rewardIcons.filter(
        reward => reward.isCeriseAdv && !reward.ceriseSitara
      );
      setCeriseClubRewards(rewardIconsClub);
    } else {
      const rewardIconsSitara = rewardIcons.filter(
        reward => reward.ceriseSitara
      );
      setCeriseClubRewards(rewardIconsSitara);
    }
  }, [props.slab]);

  return (
    <div className={styles.ceriseRewards}>
      <h4 className={globalStyles.cerise}>My Rewards</h4>
      <div className={styles.rewardsSection}>
        {ceriseClubRewards.map((myRewards: any) => {
          return (
            <div className={styles.rewardsDiv} key={myRewards.key}>
              <div className={styles.icon}>
                <img src={myRewards.iconPath} />
              </div>
              <div className={styles.rewardInfo}>
                <p className={cs(styles.rewardName, globalStyles.cerise)}>
                  {myRewards.iconHeader}
                </p>
                <p className={cs(styles.rewardDesc, globalStyles.op2)}>
                  {myRewards.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cs(globalStyles.voffset3, styles.termsConditions)}>
        <div className={globalStyles.txtNormal}>
          For further information, please refer to{" "}
          <a
            href="/customer-assistance/terms"
            target="_blank"
            className={cs(globalStyles.cerise, globalStyles.linkTextUnderline)}
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/customer-assistance/faq"
            target="_blank"
            className={cs(globalStyles.cerise, globalStyles.linkTextUnderline)}
          >
            FAQs
          </a>
          .
        </div>
      </div>
    </div>
  );
};
export default RewardsComponent;
