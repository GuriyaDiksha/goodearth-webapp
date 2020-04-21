import React, { useState, useEffect, useRef } from "react";
import cs from "classnames";
// import Dropdown from 'react-dropdown';
import InputSelect from "../InputSelect";
import styles from "../styles.scss";
import globalStyles from "styles/global.scss";

type Props = {
  gender: string;
  disable: boolean;
  msgGender: string;
  highlightGender: boolean;
  setGender: (gender: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};
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
        // onFocus={onFocus}
        // onBlur={onBlur}
        options={options}
        value={selectedGender}
        errorMessage={msgGender}
        className={`${disable ? styles.disabledInput : ""} ${
          highlightGender ? globalStyles.errorBorder : ""
        }`}
      />
      <span className={styles.arrow}></span>
    </div>
  );
};

export default GenderPicker;
