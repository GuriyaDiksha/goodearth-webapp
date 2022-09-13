import React, { memo, useState } from "react";
import { Props } from "./typings";
import styles from "./styles.scss";
import cs from "classnames";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { NavLink } from "react-router-dom";

const CeriseCard: React.FC<Props> = memo(() => {
  const [active, setActive] = useState(false);
  const { slab } = useSelector((state: AppState) => state.user);

  return (
    <div className={styles.ceriseCardLeftContainer}>
      {slab ? (
        <div className={styles.ceriseCardLeftWrp}>
          <div className={styles.header}>
            <p className={styles.heading}>Cerise Club</p>
            <NavLink to={"/account/cerise"} className={styles.subHeading}>
              View My Dashboard
            </NavLink>
          </div>
          <div className={styles.nameHeader}>
            <p className={styles.greeting}>Hello!</p>
            <p className={styles.name}>Ansuiya Sablok</p>
          </div>
          <div className={styles.ceriseTable}>
            <div className={styles.ceriseRow}>
              <p>Cerise points available</p>
              <p>4500</p>
            </div>
            <div className={styles.ceriseRow}>
              <p>Cerise points available</p>
              <p>4500</p>
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
                  style={{ height: "7px", width: "75%" }}
                ></div>
              </div>
            </div>
            <div className={cs(styles.info, active ? styles.active : "")}>
              <div
                className={cs(styles.infoIcon, active ? styles.inactive : "")}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActive(true);
                }}
              >
                <p>i</p>
              </div>
              <span
                className={cs(styles.infoText, active ? styles.active : "")}
              >
                A little column extra info. Aaand just a little bit more{" "}
                <span
                  className={styles.close}
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
          <p className={styles.footer}>
            A little column extra info. Aaand just a little bit more
          </p>
        </div>
      ) : (
        <img
          src={"https://d3qn6cjsz7zlnp.cloudfront.net/ceries_pic.png"}
          width={322}
        />
      )}
    </div>
  );
});

export default CeriseCard;
