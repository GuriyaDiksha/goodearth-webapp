import React, { useState, useContext } from "react";
import cs from "classnames";
// components
import { Context } from "components/Modal/context";
import InputField from "components/InputField";
// styles
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";
import fontStyles from "styles/iconFonts.scss";

type Props = {
  price: number;
  currency: string;
};

const WallpaperPopup: React.FC<Props> = ({ currency, price }) => {
  const { closeModal } = useContext(Context);

  const [numOfRolls, setNumOfRolls] = useState(0);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [widthError, setWidthError] = useState("");
  const [heightError, setHeightError] = useState("");

  const onWidthChange = (value: string, error: string) => {
    setWidth(value);
    setWidthError(error);
  };

  const onHeightChange = (value: string, error: string) => {
    setHeight(value);
    setHeightError(error);
  };

  const validator = (value: string) => {
    let valid = true,
      message = "";

    if (!value || /[^0-9]/.test(value)) {
      valid = false;
      message = "Please enter Number";
    }

    return {
      valid,
      message
    };
  };

  const calculateQuantity = () => {
    let rollsRequired = 0;

    if (!widthError && !heightError) {
      let error = false;
      if (!width) {
        setWidthError("Please enter Number");
        error = true;
      }
      if (!height) {
        setHeightError("Please enter Number");
        error = true;
      }
      if (error) {
        return;
      }
      // note all size are in feet
      const rollWidth = 1.71,
        rollLength = 33;
      const wastage = 1.1; //(1 + 10/100) it is 10%
      const totalRollArea = Math.ceil(rollWidth * rollLength);
      const patterRepeat = 22; // 22 inches
      const wallWidth = Number(width);
      const wallHeight = Number(height);
      const totalConsumptionArea =
        wallWidth * wallHeight * wastage + (wallHeight * patterRepeat) / 12;
      rollsRequired = Math.ceil(totalConsumptionArea / totalRollArea);
      setNumOfRolls(rollsRequired);
    }
  };

  const resetFields = () => {
    setNumOfRolls(0);
    setWidth("");
    setHeight("");
    setWidthError("");
    setHeightError("");
  };

  return (
    <div className={cs(styles.container)}>
      <div className={styles.closeBtnContainer}>
        <span
          className={cs(
            styles.closeButton,
            fontStyles.icon,
            fontStyles.iconCross
          )}
          onClick={closeModal}
        ></span>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.title}>Wallcovering Calculator</div>

        <div className={styles.text}>
          In order to help you with your wallcovering calculations simply
          measure your walls and enter your measurements below to estimate how
          many standard rolls of wallcovering you will need.
        </div>
        {numOfRolls ? (
          <div className={cs(bootstrap.row, styles.resultContainer)}>
            <div className={cs(styles.resultCol)}>
              <span className={styles.label}>Wall Size:</span>
              <span className={styles.result}>
                {height} x {width} ft
              </span>
            </div>
            <div className={cs(styles.resultCol)}>
              <span className={styles.label}>Quantity:</span>
              <span className={styles.result}>
                {numOfRolls} roll{numOfRolls == 1 ? "" : "s"} needed
              </span>
            </div>
            <div className={cs(styles.resultCol)}>
              <span className={styles.label}>Price:</span>
              <span className={styles.result}>
                {currency} {price * numOfRolls}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.fieldsContainer}>
            <InputField
              id="width"
              value={width}
              onChange={onWidthChange}
              validator={validator}
              className={styles.field}
              label="Width*"
              placeholder="Width (in ft)"
              errorMsg={widthError}
              errorMsgClass={styles.errorMsg}
            />

            <InputField
              id="height"
              value={height}
              onChange={onHeightChange}
              validator={validator}
              className={styles.field}
              label="Height*"
              placeholder="Height (in ft)"
              errorMsg={heightError}
              errorMsgClass={styles.errorMsg}
            />
          </div>
        )}
        <div className={cs(styles.btnContainer)}>
          {numOfRolls ? (
            <button className={styles.calculateBtn} onClick={resetFields}>
              Reset Fields
            </button>
          ) : (
            <button className={styles.calculateBtn} onClick={calculateQuantity}>
              Calculate
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallpaperPopup;
