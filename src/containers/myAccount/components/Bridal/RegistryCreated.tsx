import React, { useContext, useEffect } from "react";

// import moment from 'moment';
import BridalContext from "./context";
import { Props } from "./typings";

import styles from "./styles.scss";
import glasses from "../../../../images/bridal/glasses.svg";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import bridalRing from "../../../../images/bridal/rings.svg";
import Button from "components/Button";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const RegistryCreated: React.FC<Props> = props => {
  const { data } = useContext(BridalContext);

  const { mobile } = useSelector((state: AppState) => state.device);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const saveBridalDate = () => {
    props.openBridalPop();
  };

  return (
    <>
      <div className={cs(bootstrapStyles.row, globalStyles.voffset5)}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            globalStyles.textCenter
          )}
        ></div>
      </div>
      <div className={cs(bootstrapStyles.row, globalStyles.voffset6)}>
        <div
          className={cs(
            bootstrapStyles.col10,
            bootstrapStyles.offset1,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2
          )}
        >
          <div className={globalStyles.textCenter}>
            {data.occasion == "special occasion" ? (
              <svg
                viewBox="-3 -3 46 46"
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid meet"
                x="0"
                y="0"
                className={styles.bridalRing}
              >
                <use xlinkHref={`${glasses}#bridal-glasses`}></use>
              </svg>
            ) : (
              <svg
                viewBox="-3 -3 46 46"
                width="80"
                height="80"
                preserveAspectRatio="xMidYMid meet"
                x="0"
                y="0"
                className={styles.bridalRing}
              >
                <use xlinkHref={`${bridalRing}#bridal-ring`}></use>
              </svg>
            )}
          </div>
          <div
            className={cs(globalStyles.c22AI, globalStyles.lh40, {
              [globalStyles.txtCap]: !data.registryName
            })}
          >
            {data.registryName
              ? data.registryName
              : data.registrantName + " & " + data.coRegistrantName + "'s"}{" "}
            {data.registryName ? (
              ""
            ) : (
              <span className={globalStyles.txtCap}>
                {" "}
                {data.occasion} Registry{" "}
              </span>
            )}{" "}
          </div>
          <div className={cs(globalStyles.c10LR, globalStyles.voffset2)}>
            Congratulations, your registry has been successfully created! Now
            you can start adding items to your list.
          </div>
          <div
            className={cs(
              styles.loginForm,
              globalStyles.voffset4,
              globalStyles.textCenter
            )}
          >
            <form>
              <ul className={styles.categorylabel}>
                <li>
                  <Button
                    type="button"
                    variant="mediumMedCharcoalCta366"
                    label="start adding to registry"
                    onClick={saveBridalDate}
                  />
                </li>
              </ul>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistryCreated;
