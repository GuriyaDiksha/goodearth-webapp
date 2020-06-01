import React, { useState, useEffect, useRef } from "react";
import cs from "classnames";
import InputSelect from "../InputSelect";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";
import { Props } from "./typings";

const GenderPicker: React.FC<Props> = ({
  gender,
  disable,
  msgGender,
  highlightGender,
  setGender,
  onFocus,
  onBlur
}) => {
  const options = ["Female", "Male", "Others"];
  const [selectedGender, setSelectedGender] = useState(gender || "");
  const mydrop = useRef(null);
  useEffect(() => {
    setSelectedGender(gender);
    // window.guestUserGender = gender;
  }, [gender]);
  //   const mydrop = useRef(null);
  const onSelect = (event: React.ChangeEvent) => {
    if (disable) {
      return false;
    }
    if (event.target.nodeValue) {
      setGender(event.target.nodeValue);
      // setSelectedGender(event.target.nodeValue);
    }
    //         window.guestUserGender = event.target.value;
  };
  return (
    <div className={cs(styles.selectGroup, globalStyles.textLeft)}>
      <InputSelect
        selectRef={mydrop}
        required
        name="gender"
        label="Select Gender*"
        disabled={disable}
        placeholder="Select Gender*"
        onChange={e => onSelect(e)}
        options={options}
        value={selectedGender}
        errorMessage={msgGender}
        className={cs(
          { [styles.disabledInput]: disable },
          { [globalStyles.errorBorder]: highlightGender }
        )}
      />
      <span className={styles.arrow}></span>
    </div>
  );
};

export default GenderPicker;
