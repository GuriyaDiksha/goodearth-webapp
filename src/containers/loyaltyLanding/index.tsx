import React, { useState } from "react";
import MakerEnhance from "components/maker";
import styles from "./styles.scss";
import ceriseTulip from "./../../images/loyalty/ceriseTulip.svg";
import sitaraGold from "./../../images/loyalty/sitaraGold.svg";
import cerisePoint from "./../../images/loyalty/cerisePoint.svg";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const LoyaltyLanding = () => {
  const [openStateId, setOpenStateId] = useState({ id: 0, state: true });
  const {
    device: { mobile },
    info: { showTimer }
  } = useSelector((state: AppState) => state);

  return (
    <div
      className={cs(styles.loyaltyConatiner, {
        [styles.loyaltyContainerTimer]: showTimer
      })}
    >
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
            <p
              className={cs(
                mobile ? bootstrap.col8 : bootstrap.col10,
                styles.tableHeading
              )}
            >
              {mobile ? "" : "Benefits"}
            </p>
            <p
              className={cs(
                mobile ? bootstrap.col2 : bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText
              )}
            >
              Club
            </p>
            <p
              className={cs(
                mobile ? bootstrap.col2 : bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText
              )}
            >
              Sitara
            </p>
          </div>
          <div
            className={cs(bootstrap.row, styles.tableRow, styles.tableFirstRow)}
          >
            <div
              className={cs(
                mobile ? bootstrap.col8 : bootstrap.col10,
                styles.tableRowWrp
              )}
            >
              <img src={cerisePoint} />
              <p className={cs(styles.tableRowHead)}>Cerise Points</p>
            </div>
            <p
              className={cs(
                mobile ? bootstrap.col2 : bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText
              )}
            >
              10%
            </p>
            <p
              className={cs(
                mobile ? bootstrap.col2 : bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText
              )}
            >
              15%
              <span
                className={
                  openStateId["id"] === 0 && openStateId["state"]
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setOpenStateId({
                    id: 0,
                    state:
                      openStateId["id"] === 0 ? !openStateId["state"] : true
                  })
                }
              ></span>
            </p>
          </div>
          <div
            className={cs(
              bootstrap.row,
              styles.tableRow,
              styles.tableSecondRow,
              openStateId["id"] === 0 && openStateId["state"]
                ? styles.active
                : styles.inactive
            )}
          >
            <div className={cs(bootstrap.col8)}>
              <p>
                Earn Cerise points on the value of your purchases. 1 point is
                equivalent 1 ₹.
              </p>
            </div>
          </div>
          <div
            className={cs(bootstrap.row, styles.tableRow, styles.tableFirstRow)}
          >
            <div
              className={cs(
                mobile ? bootstrap.col8 : bootstrap.col10,
                styles.tableRowWrp
              )}
            >
              <img src={cerisePoint} />
              <p className={cs(styles.tableRowHead)}>Cerise Points</p>
            </div>
            <p
              className={cs(
                mobile ? bootstrap.col2 : bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText
              )}
            >
              <img src={ceriseTulip} />
            </p>
            <p
              className={cs(
                mobile ? bootstrap.col2 : bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText
              )}
            >
              <img src={sitaraGold} />
              <span
                className={
                  openStateId["id"] === 1 && openStateId["state"]
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setOpenStateId({
                    id: 1,
                    state:
                      openStateId["id"] === 1 ? !openStateId["state"] : true
                  })
                }
              ></span>
            </p>
          </div>
          <div
            className={cs(
              bootstrap.row,
              styles.tableRow,
              styles.tableSecondRow,
              openStateId["id"] === 1 && openStateId["state"]
                ? styles.active
                : styles.inactive
            )}
          >
            <div className={cs(bootstrap.col8)}>
              <p>
                Earn Cerise points on the value of your purchases. 1 point is
                equivalent 1 ₹.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.footer}>
        For further information, please refer to&nbsp;
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
