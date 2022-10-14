import React from "react";
import styles from "./../styles.scss";
import CeriseCardDetail from "components/CeriseCard/CeriseCardDetail";

const Header = () => {
  return (
    <div className={styles.ceriseDashboardHeader}>
      <CeriseCardDetail isViewDashboard={false} />
      <div className={styles.imgWrp}>
        <img src={"https://d3qn6cjsz7zlnp.cloudfront.net/cerise-pic-1.png"} />
      </div>
    </div>
  );
};

export default Header;
