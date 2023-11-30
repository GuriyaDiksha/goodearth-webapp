import React, { useEffect, useState } from "react";
import cs from "classnames";
import OnlineOrders from "./onlineOrders";
import InShopOrder from "./InShopOrders";
import Loader from "components/Loader";

import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { pageViewGTM } from "utils/validate";
import Button from "components/Button";

type Props = {
  setCurrentSection: () => void;
};
const PastOrders: React.FC<Props> = (props: Props) => {
  const [hasShoppedOnlineitems, setHasShoppedOnlineitems] = useState(true);
  const [hasShoppedAtStore, setHasShoppedAtStore] = useState(false);
  const [hasShopped, setHasShopped] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isData, setIsData] = useState(false);
  const {
    user: { email },
    device: { mobile }
  } = useSelector((state: AppState) => state);
  props.setCurrentSection();
  const switchToStoreOrders = () => {
    setHasShoppedOnlineitems(false);
    setHasShoppedAtStore(true);
    setHasShopped(true);
    setIsLoading(false);
    setIsData(false);
    if (!hasShopped) {
      setHasShopped(false);
    }
  };

  useEffect(() => {
    pageViewGTM("MyAccount");
  }, []);

  const isDataAvaliable = (data: boolean) => {
    setIsData(data);
  };

  const switchToOnlineOrders = () => {
    setHasShoppedOnlineitems(true);
    setHasShoppedAtStore(false);
    setHasShopped(true);
    setIsLoading(false);
    setIsData(false);
    if (!hasShopped) {
      setHasShopped(false);
    }
  };
  const startShoppingButton = (
    <div className={styles.startShoppingButton}>
      <Link to="/">
        <Button
          variant="outlineSmallMedCharcoalCta"
          type="button"
          label="Start Shopping"
        />
      </Link>
    </div>
  );
  const mainContent = (
    <>
      <div className={styles.orderTabs}>
        <a
          className={cs(styles.orderTab, {
            [styles.active]: hasShoppedOnlineitems
          })}
          onClick={switchToOnlineOrders}
        >
          ONLINE
        </a>
        <span className={styles.hrLine}>|</span>
        <a
          className={cs(styles.orderTab, {
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
            globalStyles.op2,
            styles.noPurchasesMessage,
            globalStyles.voffset4
          )}
        >
          {isData ? "" : <div>{"You haven't made any purchases yet"}</div>}
        </div>
      )}
      {hasShoppedOnlineitems && (
        <>
          <OnlineOrders
            orderType={"online"}
            hasShopped={setHasShopped}
            isLoading={setIsLoading}
            isDataAvaliable={isDataAvaliable}
            email={email}
            mobile={mobile}
          />
          {!hasShopped && !isLoading && startShoppingButton}
        </>
      )}
      {hasShoppedAtStore && (
        <>
          <InShopOrder
            orderType="inShop"
            hasShopped={setHasShopped}
            isLoading={setIsLoading}
            isDataAvaliable={isDataAvaliable}
            email={email}
            mobile={mobile}
          />
          {!hasShopped && !isLoading && startShoppingButton}
        </>
      )}
    </>
  );
  return (
    <div className={bootstrapStyles.row}>
      <div
        className={cs(
          bootstrapStyles.col10,
          bootstrapStyles.offset1,
          bootstrapStyles.colLg12
        )}
      >
        <div className={bootstrapStyles.row}>
          <div
            className={cs(bootstrapStyles.col12, {
              [bootstrapStyles.colMd10]: !mobile
            })}
          >
            <div id="my-orders-head" className={styles.formHeading}>
              My Orders
            </div>
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
