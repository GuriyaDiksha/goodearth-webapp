import React, { useEffect } from "react";
import styles from "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import LoyaltyService from "services/loyalty";
import { updateLoyaltyPoints } from "actions/loyalty";
import CeriseCardDetail from "./CeriseCardDetail";
import cs from "classnames";
import { Link } from "react-router-dom";
import ceirseImage from "./../../images/ceirseImage.png";

type StateData = { user: { slab: string; email: string } };
type Props = {
  clickToggle?: any;
  isMobileMenu?: boolean;
  showInnerMenu?: boolean;
};

const CeriseCard: React.FC<Props> = ({ clickToggle, showInnerMenu }) => {
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
    <div
      className={cs(styles.ceriseCardLeftContainer, {
        [styles.showInnerMenu]: showInnerMenu,
        [styles.isCeriseUser]:
          slab.toLowerCase() === "cerise" ||
          slab.toLowerCase() === "cerise sitara" ||
          slab.toLowerCase() === "cerise club"
      })}
    >
      {slab.toLowerCase() === "cerise" ||
      slab.toLowerCase() === "cerise sitara" ||
      slab.toLowerCase() === "cerise club" ? (
        <CeriseCardDetail
          isViewDashboard={true}
          clickToggle={clickToggle}
          showInnerMenu={showInnerMenu}
        />
      ) : (
        <Link
          to="/cerise"
          onClick={e => {
            clickToggle && clickToggle();
          }}
        >
          <img src={ceirseImage} width={322} />
        </Link>
      )}
    </div>
  );
};

export default CeriseCard;
