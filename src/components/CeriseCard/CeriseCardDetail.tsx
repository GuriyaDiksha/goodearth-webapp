import React, { useState } from "react";
import { Props } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { LoyaltyPoints } from "reducers/loyalty/typings";
import iconStyles from "../../styles/iconFonts.scss";

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

const CeriseCardDetail: React.FC<Props> = ({
  isViewDashboard,
  clickToggle,
  showInnerMenu
}) => {
  const [active, setActive] = useState(false);
  const {
    user: { email, firstName, lastName, phoneNumber },
    loyalty: { loyaltyPoints }
  }: StateData = useSelector((state: AppState) => state);
  const history = useHistory();

  return (
    <div
      className={cs(styles.ceriseCardLeftWrp, styles.mobileWidth, {
        [styles.goldBackground]:
          loyaltyPoints?.MembershipClub === "Cerise Sitara",
        [styles.ceriseBackground]:
          loyaltyPoints?.MembershipClub === "Cerise Club",
        [styles.leftMaxWidth]: isViewDashboard,
        [styles.showInnerMenu]: showInnerMenu
      })}
    >
      <div className={styles.header}>
        <p className={styles.heading}>{loyaltyPoints?.MembershipClub}</p>
        {isViewDashboard ? (
          <div
            //to={"/account/cerise"}
            id="dashboard"
            onClick={e => {
              // e.stopPropagation();
              // onDropDownMenuClick();
              history.push("/account/cerise");
              clickToggle && clickToggle();
            }}
            className={styles.subHeading}
          >
            View My Dashboard
          </div>
        ) : null}
      </div>
      <div className={styles.nameHeader}>
        <p className={styles.greeting}>Hello!</p>
        <p className={styles.name}>
          {firstName?.slice(0, 15)} {lastName?.slice(0, 15)}
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
            {loyaltyPoints?.MembershipExpiryDate
              ? moment(
                  loyaltyPoints?.MembershipExpiryDate,
                  "DD/MM/YYYY"
                ).format("DD MMMM YYYY")
              : null}
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
          <div
            className={cs(styles.progressbarWrp, {
              [styles.goldBackground]:
                loyaltyPoints?.MembershipClub === "Cerise Sitara"
            })}
          >
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
              {loyaltyPoints?.Note}
              {/* {loyaltyPoints?.AdditionalSpend} additional spends needed to
              become a{" "}
              <a
                href="/cerise"
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => {
                  window?.open("/cerise", "_blank");
                }}
              >
                {loyaltyPoints?.NextUpgradeMembershipClub} */}
              {/* </a> */}
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
                <i
                  className={cs(iconStyles.icon, iconStyles.iconCrossNarrowBig)}
                ></i>
              </span>
            </span>
          </div>
        </div>
      </div>
      <p className={styles.footer}>
        {loyaltyPoints?.ExpiryPoints === 0
          ? "No points to expire in 30 days"
          : `${loyaltyPoints?.ExpiryPoints} points are due to expire on
      ${moment(loyaltyPoints?.ExpiryDate, "DD/MM/YYYY").format(
        "Do MMMM YYYY"
      )}`}
        .
      </p>
    </div>
  );
};

export default CeriseCardDetail;
