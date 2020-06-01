import React, { useState } from "react";
import cs from "classnames";
import OnlineOrders from "./onlineOrders";
// import InShopOrders from "./InShopOrders";
import Loader from "components/Loader";

import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { Link } from "react-router-dom";
import { useStore } from "react-redux";

const PastOrders: React.FC = () => {
  const [hasShoppedOnlineitems, setHasShoppedOnlineitems] = useState(true);
  const [hasShoppedAtStore, setHasShoppedAtStore] = useState(false);
  const [hasShopped, setHasShopped] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const store = useStore();
  const { mobile } = store.getState();

  const switchToStoreOrders = () => {
    setHasShoppedOnlineitems(false);
    setHasShoppedAtStore(true);
    setHasShopped(true);
    setIsLoading(false);
  };

  const switchToOnlineOrders = () => {
    setHasShoppedOnlineitems(true);
    setHasShoppedAtStore(false);
    setHasShopped(true);
    setIsLoading(false);
  };
  const mainContent = (
    <>
      <div className={styles.orderTabs}>
        <a
          className={cs(styles.formSubheading, styles.orders, {
            [styles.active]: hasShoppedOnlineitems
          })}
          onClick={switchToOnlineOrders}
        >
          ONLINE
        </a>
        <span className={styles.hrLine}>|</span>
        <a
          className={cs(styles.formSubheading, styles.orders, {
            [styles.active]: hasShoppedAtStore
          })}
          onClick={switchToStoreOrders}
        >
          IN-SHOP
        </a>
      </div>
      {!hasShopped && !isLoading && (
        <div
          className={cs(
            styles.formSubheading,
            globalStyles.op2,
            styles.noPurchasesMessage,
            globalStyles.voffset4
          )}
        >
          <em>{"You haven't made any purchases yet"}</em>
        </div>
      )}
      {hasShoppedOnlineitems && (
        <OnlineOrders hasShopped={setHasShopped} isLoading={setIsLoading} />
      )}
      {/* {hasShoppedAtStore && (
        <InShopOrders hasShopped={setHasShopped} isLoading={setIsLoading} />
      )} */}
      {!hasShopped && !isLoading && (
        <div className={styles.browseButton}>
          <Link to="/">
            <input
              type="button"
              className={globalStyles.ceriseBtn}
              value="Browse"
            />
          </Link>
        </div>
      )}
    </>
  );
  return (
    <div className={bootstrapStyles.row}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          bootstrapStyles.colMd12
        )}
      >
        <div className={bootstrapStyles.row}>
          <div
            className={cs(
              bootstrapStyles.col10,
              { [bootstrapStyles.offset1]: mobile },
              bootstrapStyles.colMd10
            )}
          >
            <div className={styles.formHeading}>My Orders</div>
            <div className={styles.formSubheading}>
              View all your past orders.
            </div>
            {mainContent}
          </div>
        </div>
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default PastOrders;
