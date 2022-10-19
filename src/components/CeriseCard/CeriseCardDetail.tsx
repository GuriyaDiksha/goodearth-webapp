import React, { useEffect, useState } from "react";
import { Props } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { Link, NavLink } from "react-router-dom";
import LoyaltyService from "services/loyalty";
import { updateLoyaltyPoints } from "actions/loyalty";
import moment from "moment";
import { LoyaltyPoints } from "reducers/loyalty/typings";

type StateData = {
  user: {
    slab: string;
    email: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
  };
  loyalty: { loyaltyPoints: LoyaltyPoints };
};

const CeriseCardDetail: React.FC<Props> = ({ isViewDashboard }) => {
  const [active, setActive] = useState(false);
  const {
    user: { slab, email, firstName, lastName, phoneNumber },
    loyalty: { loyaltyPoints }
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
      className={cs(styles.ceriseCardLeftWrp, styles.mobileWidth, {
        [styles.goldBackground]:
          loyaltyPoints?.MembershipClub === "Cerise Sitara",
        [styles.leftMaxWidth]: isViewDashboard
      })}
    >
      <div className={styles.header}>
        <p className={styles.heading}>{loyaltyPoints?.MembershipClub}</p>
        {isViewDashboard ? (
          <NavLink to={"/account/cerise"} className={styles.subHeading}>
            View My Dashboard
          </NavLink>
        ) : null}
      </div>
      <div className={styles.nameHeader}>
        <p className={styles.greeting}>Hello!</p>
        <p className={styles.name}>
          {firstName} {lastName}
        </p>
        <p className={styles.email}>
          {email} {phoneNumber ? "|" : ""} {phoneNumber}
        </p>
      </div>
      <div className={styles.ceriseTable}>
        <div className={styles.ceriseRow}>
          <p>Cerise points available</p>
          <p>{loyaltyPoints?.AvailablePoint}</p>
        </div>
        <div className={styles.ceriseRow}>
          <p>Membership Expires</p>
          <p>
            {moment(loyaltyPoints?.ExpiryDate, "DD/MM/YYYY").format(
              "DD MMMM YYYY"
            )}
          </p>
        </div>
      </div>

      <div className={styles.infoWrp}>
        <div
          className={cs(
            styles.progressbarWrpContainer,
            active ? styles.inactive : ""
          )}
        >
          <div className={styles.progressbarWrp}>
            <div
              className={styles.progressbar}
              style={{
                height: "7px",
                width: `${loyaltyPoints?.NextSlabProgress}%`
              }}
            ></div>
          </div>
        </div>
        <div className={cs(styles.info, active ? styles.active : "")}>
          <div
            className={cs(styles.infoIcon, active ? styles.inactive : "", {
              [styles.goldColor]:
                loyaltyPoints?.MembershipClub === "Cerise Sitara"
            })}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setActive(true);
            }}
          >
            <p>i</p>
            <span className={cs(styles.infoText, active ? styles.active : "")}>
              {loyaltyPoints?.AdditionalSpend} additional spends needed to
              become a{" "}
              <Link to="/account/cerise">
                {loyaltyPoints?.NextUpgradeMembershipClub}
              </Link>
              <span
                className={cs(styles.close, {
                  [styles.goldColor]:
                    loyaltyPoints?.MembershipClub === "Cerise Sitara"
                })}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActive(false);
                }}
              >
                X
              </span>
            </span>
          </div>
        </div>
      </div>
      <p className={styles.footer}>
        {loyaltyPoints?.ExpiryPoints} points are due to expire on{" "}
        {moment(loyaltyPoints?.ExpiryDate, "DD/MM/YYYY").format("Do MMMM YYYY")}
        .
      </p>
    </div>
  );
};

export default CeriseCardDetail;
