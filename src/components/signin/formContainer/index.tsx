import React from "react";
import styles from "../styles.scss";

const FormContainer: React.FC<{
  heading: string;
  subheading: string;
  formContent: JSX.Element;
  footer?: JSX.Element;
}> = ({ heading, subheading, formContent, footer }) => {
  return (
    <div>
      <div className={styles.formHeading}>{heading}</div>
      <div className={styles.formSubheading}>{subheading}</div>
      <div className={styles.loginForm}>{formContent}</div>
      {footer}
    </div>
  );
};
export default FormContainer;
