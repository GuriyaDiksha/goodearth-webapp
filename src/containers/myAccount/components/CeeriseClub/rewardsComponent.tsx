import React, { useEffect, useState } from 'react';
import rewardIcons from './iconRewards';

type Props = {
    slab: string;
}

const RewardsComponent:React.FC<Props> = (props) => {

    const [ ceriseClubRewards, setCeriseClubRewards ] : any [] = useState([]);


    useEffect(() => {
        if (props.slab.toLowerCase() == "cerise") {
            const rewardIconsClub = rewardIcons.filter((reward) => reward.isCeriseAdv && !reward.ceriseSitara);
                setCeriseClubRewards(rewardIconsClub);
        } else {
            const rewardIconsSitara = rewardIcons.filter((reward) => reward.ceriseSitara);
                setCeriseClubRewards(rewardIconsSitara);
        }
    }, []);

    return (
        <div className="cerise-rewards">
            <h4 className="cerise">My Rewards</h4>
            <div className="rewards-section">
                {ceriseClubRewards.map((myRewards: any) => {
                    return (
                        <div className="rewards-div" key={myRewards.key}>
                            <div className="icon"><img src={myRewards.iconPath} /></div>
                            <div className="reward-info">
                                <p className="reward-name cerise">{myRewards.iconHeader}</p>
                                <p className="reward-desc op2">{myRewards.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="voffset3 terms-conditions">
                <div className="txt-normal">
                    For further information, please refer to <a href="/customer-assistance/terms" target="_blank" className="cerise txt-underline">Terms & Conditions</a> and <a href="/customer-assistance/faq" target="_blank" className="cerise txt-underline">FAQs</a>.
                </div>
            </div>
        </div>
    );
}
export default RewardsComponent;