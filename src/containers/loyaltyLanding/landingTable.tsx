import React, { useState } from "react";
import cs from "classnames";
import styles from "./styles.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import { Landing } from "reducers/loyalty/typings";
import ceriseTulip from "./../../images/loyalty/ceriseTulip.svg";
import sitaraGold from "./../../images/loyalty/sitaraGold.svg";

type Props = {
  mobile: boolean;
  data: Landing[];
};

const LandingTable: React.FC<Props> = ({ mobile, data }) => {
  const [openStateId, setOpenStateId] = useState({ id: 0, state: true });

  return (
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
      {data?.map((ele, ind) => (
        <div
          key={ind}
          onClick={() =>
            mobile &&
            setOpenStateId({
              id: ind,
              state: openStateId["id"] === ind ? !openStateId["state"] : true
            })
          }
        >
          <div
            className={cs(bootstrap.row, styles.tableRow, styles.tableFirstRow)}
          >
            <div
              className={cs(
                mobile ? bootstrap.col8 : bootstrap.col10,
                styles.tableRowWrp
              )}
            >
              <img src={ele?.uploadIcon} />
              <p className={cs(styles.tableRowHead)}>{ele?.heading}</p>
            </div>
            <p
              className={cs(
                mobile ? bootstrap.col2 : bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText
              )}
            >
              {ind === 0 ? (
                "10%"
              ) : ele?.level.includes("Club") ? (
                <img src={ceriseTulip} />
              ) : null}
            </p>
            <p
              className={cs(
                mobile ? bootstrap.col2 : bootstrap.col1,
                styles.tableHeading,
                styles.alignCenterText
              )}
            >
              {ind === 0 ? (
                "15%"
              ) : ele?.level.includes("Sitara") ? (
                <img src={sitaraGold} />
              ) : null}
              <span
                className={
                  openStateId["id"] === ind && openStateId["state"]
                    ? styles.active
                    : ""
                }
                onClick={() =>
                  setOpenStateId({
                    id: ind,
                    state:
                      openStateId["id"] === ind ? !openStateId["state"] : true
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
              openStateId["id"] === ind && openStateId["state"]
                ? styles.active
                : styles.inactive
            )}
          >
            <div className={cs(bootstrap.col8)}>
              <p>{ele?.shortDescription}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandingTable;
