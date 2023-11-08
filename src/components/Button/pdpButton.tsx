import React from "react";
import styles from "./styles.scss";
import { ButtonProps } from "./typings";
import Button from ".";

const PdpButton: React.FC<ButtonProps> = ({ label, disabled, onClick }) => (
  <Button
    className={styles.pdpPrimaryButton}
    label={label}
    onClick={onClick}
    variant={label == "Notify Me" ? "largeLightGreyCta" : "largeAquaCta"}
    disabled={disabled}
  />
);

export default PdpButton;

// <button
//   className={cs(styles.pdpPrimaryButton, props.className, {
//     [globalStyles.disabled]: props.disabled,
//     [globalStyles.ceriseBtn]: !props.disabled,
//     [styles.notifyMeCta]: props.label == "Notify Me"
//   })}
//   onClick={(event): void => {
//     if (props.onClick) {
//       props.onClick(event);
//     }
//   }}
// >
//   {props.label}
// </button>
