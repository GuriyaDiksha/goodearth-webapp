import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./../styles.scss";

const Address = () => {
  return (
    <div className={styles.ceriseAddressWrp}>
      <p className={styles.heading}>My Address</p>
      <p className={styles.description}>
        Your selected default address will be used for reward related purposes &
        communication.
      </p>
      <div className={styles.addressContainer}>
        <div className={styles.firstSection}>
          <div className={styles.leftSection}>
            <div className={styles.radioButtonWrp}>
              <input type="radio" className={styles.radioButton} />
              <span></span>
            </div>
            <p className={styles.name}>Tanvi Julka</p>
          </div>
          <p className={styles.defaultAddress}>Default Address</p>
        </div>
        <div className={styles.secondSection}>
          <div className={styles.address}>
            <p>Address Line 1 </p>
            <p> Address Line 2, City</p>
            <p> State, Country - 110017</p>
            <p> M:+91 99999 99999</p>
          </div>
          <NavLink to="/account/address" className={styles.editAddress}>
            Edit
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Address;
