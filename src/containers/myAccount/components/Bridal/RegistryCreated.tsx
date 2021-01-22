import React, { useContext } from "react";

// import moment from 'moment';
import BridalContext from "./context";
import { Props } from "./typings";

import styles from "./styles.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import bridalRing from "../../../../images/bridal/rings.svg";

const RegistryCreated: React.FC<Props> = props => {
  // data: [],
  // const [updateDate, setUpdateDate ] = useState(false);
  // const [subscribe, setSubscribe ] = useState(false);

  // const [date, setDate ] = useState(moment());
  const {
    setCurrentModule,
    // setCurrentModuleData,
    data
  } = useContext(BridalContext);

  // const onChange = (date: Date) => {
  //         setDate(moment(date));
  //         setUpdateDate(true);
  // }

  const saveBridalDate = () => {
    props.createRegistry();
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
        >
          <i
            className={cs(styles.arrowUp, globalStyles.pointer)}
            onClick={() => setCurrentModule("address")}
          ></i>
          <p
            className={styles.backGc}
            onClick={() => setCurrentModule("address")}
          >
            Back To Shipping Address
          </p>
        </div>
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
                  <input
                    type="button"
                    className={globalStyles.ceriseBtn}
                    value="start adding to registry"
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
