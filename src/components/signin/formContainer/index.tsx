import React from "react";
import cs from "classnames";
import styles from "../styles.scss";
import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";

const FormContainer: React.FC<{
  heading: string;
  subheading: string;
  formContent: JSX.Element;
  footer: JSX.Element;
}> = ({ heading, subheading, formContent, footer }) => {
  return (
    <div className={cs(bootstrapStyles.col8, bootstrapStyles.offset2)}>
      <div className={styles.formHeading}>{heading}</div>
      <div className={styles.formSubheading}>{subheading}</div>
      <div className={styles.loginForm}>{formContent}</div>
      {footer}
    </div>
  );
};
export default FormContainer;
