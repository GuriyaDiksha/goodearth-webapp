import React from "react";
import "./styles.css";
import desktopImage from "../../images/sale-maintanance-desktop.jpg";
import mobileImage from "../../images/sale-maintanance-mob.jpg";

const Maintenance = () => {
  return (
    <picture>
      <source media="(min-width: 992px)" srcSet={desktopImage} />
      <source media="(max-width: 992px)" srcSet={mobileImage} />
      <img
        src={mobileImage}
        alt="Will be back shortly"
        style={{ width: "100%", height: "auto" }}
      />
    </picture>
  );
};
export default Maintenance;
