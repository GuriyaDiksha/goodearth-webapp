import React from "react";
import iconStyles from "../../../styles/iconFonts.scss";
import cs from "classnames";
import styles from "./styles.scss";

type Props = {
  value: string;
  onClick: () => void;
  className?: string;
};
const Button: React.FC<Props> = ({ value, onClick, className, children }) => {
  const buttonClass = className
    ? cs(styles.gcButton, className)
    : styles.gcButton;
  return (
    <div className={buttonClass} onClick={onClick}>
      <i className={cs(iconStyles.iconButtoncorners, iconStyles.icon)}></i>
      {value ? <span>{value}</span> : children}
      <i className={cs(iconStyles.iconButtoncorners, iconStyles.icon)}></i>
    </div>
  );
};
export default Button;
