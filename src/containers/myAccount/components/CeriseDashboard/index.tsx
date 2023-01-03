import React from "react";
import styles from "./styles.scss";
import Header from "./Components/header";
import Rewards from "./Components/rewards";
import { useHistory } from "react-router";
import Address from "./Components/address";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const CeriseDashboard = () => {
  const history = useHistory();
  const {
    user: { slab }
  } = useSelector((state: AppState) => state);

  return (
    <div className={styles.ceriseDashboard}>
      <Header />
      <div className={styles.transactionWrp}>
        <p className={styles.heading}>My Transaction Statement</p>
        <p className={styles.description}>
          View your in-shop and web boutique transactions along with the current
          Cerise Points balance here.
        </p>
        <button
          className={styles.viewStatement}
          onClick={() => history.push("/account/cerise/transaction")}
        >
          VIEW STATEMENT
        </button>
      </div>
      {slab === "Cerise Sitara" ? <Rewards /> : null}
      <Address />
    </div>
  );
};

export default CeriseDashboard;
