import React from "react";
import styles from "./styles.scss";
import Header from "./Components/header";
import Rewards from "./Components/rewards";
import { useHistory } from "react-router";
import Address from "./Components/address";
import Button from "components/Button";

const CeriseDashboard = () => {
  const history = useHistory();

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
          onClick={() => history.push("/account/cerise/transaction")}
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
