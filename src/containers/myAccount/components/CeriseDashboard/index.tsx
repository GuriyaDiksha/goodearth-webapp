import React from "react";
import styles from "./styles.scss";
import Header from "./Components/header";
import Rewards from "./Components/rewards";
import { useHistory } from "react-router";
// import Address from "./Components/address";
import Button from "components/Button";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

const CeriseDashboard = () => {
  const history = useHistory();

  const handleViewStatement = (): void => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "view_statement"
      });
    }
    history.push("/account/cerise/transaction");
  };

  return (
    <div className={styles.ceriseDashboard}>
      <Header />
      <div className={styles.transactionWrp}>
        <p className={styles.heading}>My Transaction Statement</p>
        <p className={styles.description}>
          View your in-shop and web boutique transactions along with the current
          Cerise Points balance here.
        </p>
        <Button
          variant="smallMedCharcoalCta"
          onClick={handleViewStatement}
          label={"VIEW STATEMENT"}
        />
      </div>
      <Rewards />
      {/* Temporary hide this section as per product team */}
      {/* <Address /> */}
    </div>
  );
};

export default CeriseDashboard;
