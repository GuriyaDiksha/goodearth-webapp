import React from "react";
import styles from "./styles.scss";
import desktopImage from "../../images/sale-maintanance-desktop.jpg";
import mobileImage from "../../images/sale-maintanance-mob.jpg";
import gelogoCerise from "../../images/gelogoCerise.svg";

const Maintenance = () => {
  return (
    <div className={styles.container}>
      <picture>
        <source media="(min-width: 992px)" srcSet={desktopImage} />
        <source media="(max-width: 992px)" srcSet={mobileImage} />
        <img
          src={mobileImage}
          alt="Will be back shortly"
          style={{ width: "100%", height: "auto" }}
        />
      </picture>
      <div className={styles.content}>
        <div className={styles.logo}></div>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <img src={gelogoCerise} />
          </div>
        </div>
        <div className={styles.heading}>
          <h1>We’ll be back shortly!</h1>
        </div>
        <div className={styles.subheading}>
          <h3>Thank you for your patience.</h3>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerContent}>
            +91 9582 999 555 / +91 9582 999 888
            <br />
            <a href="mailto:customercare@goodearth.in">
              customercare@goodearth.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Maintenance;
