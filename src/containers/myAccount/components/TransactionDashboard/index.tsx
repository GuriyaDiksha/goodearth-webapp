import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { AppState } from "reducers/typings";
import Header from "../CeriseDashboard/Components/header";
import Rewards from "../CeriseDashboard/Components/rewards";
import styles from "./styles.scss";
import TransactionTable from "./TransactionTable";

const TransactionDashboard = () => {
  const {
    device: { mobile },
    loyalty: { transaction }
  } = useSelector((state: AppState) => state);

  return (
    <div className={styles.transactionDashWrp}>
      {mobile ? null : (
        <div className={styles.backWrp}>
          <NavLink to={"/account/cerise"} className={styles.back}>
            &#60; BACK TO CERISE DASHBOARD
          </NavLink>
        </div>
      )}
      <Header />
      <div className={styles.transactionWrp}>
        <p className={styles.heading} id="transaction">
          My Transaction Statement
        </p>
        <div className={styles.pointsWrp}>
          <div className={styles.points}>
            <p className={styles.name}>TOTAL POINTS EARNED</p>
            <p className={styles.point}>{transaction?.EarnPoints}</p>
          </div>
          <div className={styles.points}>
            <p className={styles.name}>TOTAL POINTS REDEEMED</p>
            <p className={styles.point}>{transaction?.RedeemPoints}</p>
          </div>
          <div className={styles.points}>
            <p className={styles.name}>TOTAL POINTS EXPIRED</p>
            <p className={styles.point}>{transaction?.ExpiredPoints}</p>
          </div>
          <div className={styles.points}>
            <p className={styles.name}>BALANCE POINTS</p>
            <p className={styles.point}>{transaction?.BalancePoints}</p>
          </div>
        </div>
      </div>
      <TransactionTable mobile={mobile} />
      <Rewards />
    </div>
  );
};

export default TransactionDashboard;
