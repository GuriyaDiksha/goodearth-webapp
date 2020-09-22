import React, { useState } from "react";
import cs from "classnames";
// components
import CloseButton from "components/Modal/components/CloseButton";
import InputField from "components/InputField";
import Button from "components/Button";

// styles
import bootstrap from "styles/bootstrap/bootstrap-grid.scss";
import styles from "./styles.scss";

type Props = {
  price: number;
  currency: string;
};

const WallpaperPopup: React.FC<Props> = ({ currency, price }) => {
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

  return (
    <div className={cs(styles.container)}>
      <div className={styles.title}>WALLCOVERING CALCULATOR</div>
      <CloseButton className={styles.closeButton} />

      <div className={styles.text}>
        In order to help you with your wallcovering calculations simply measure
        your walls and enter your measurements below to estimate how many
        standard rolls of wallcovering you will need.
      </div>

      <InputField
        id="width"
        value={width}
        onChange={onWidthChange}
        validator={validator}
        className={styles.field}
        label="WIDTH"
        placeholder="WIDTH (in ft)"
        errorMsg={widthError}
      />

      <InputField
        id="height"
        value={height}
        onChange={onHeightChange}
        validator={validator}
        className={styles.field}
        label="HEIGHT"
        placeholder="HEIGHT (in ft)"
        errorMsg={heightError}
      />

      <Button label="Calculate" onClick={calculateQuantity} />
      {numOfRolls ? (
        <div className={cs(bootstrap.row, styles.result)}>
          <div className={cs(bootstrap.col12, bootstrap.colMd6)}>
            {numOfRolls} roll(s) needed
          </div>
          <div className={cs(bootstrap.col12, bootstrap.colMd6)}>
            {currency} {price * numOfRolls}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default WallpaperPopup;
