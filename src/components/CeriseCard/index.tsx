import React, { useEffect } from "react";
import { Props } from "./typings";
import styles from "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import LoyaltyService from "services/loyalty";
import { updateLoyaltyPoints } from "actions/loyalty";
import CeriseCardDetail from "./CeriseCardDetail";

type StateData = { user: { slab: string; email: string } };

const CeriseCard: React.FC<Props> = () => {
  const {
    user: { slab, email }
  }: StateData = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (email && slab) {
      LoyaltyService.getLoyaltyPoints(dispatch, { email })
        .then(res => {
          dispatch(updateLoyaltyPoints(res?.CustomerPointInformation));
        })
        .catch(e => {
          console.log("error===", e);
        });
    }
  }, [email, slab]);

  return (
    <div className={styles.ceriseCardLeftContainer}>
      {slab ? (
        <CeriseCardDetail isViewDashboard={true} />
      ) : (
        <img
          src={"https://d3qn6cjsz7zlnp.cloudfront.net/ceries_pic.png"}
          width={322}
        />
      )}
    </div>
  );
};

export default CeriseCard;
