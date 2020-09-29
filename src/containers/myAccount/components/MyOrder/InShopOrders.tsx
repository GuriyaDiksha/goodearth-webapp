import React, { useState, useEffect } from "react";
import moment from "moment";
import { OrdersProps } from "./typings";
import AccountService from "services/account";
import { currencyCode, Currency } from "typings/currency";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { useDispatch } from "react-redux";
import InShopOrderDetails from "./InShopOrderDetails";

const InShopOrder: React.FC<OrdersProps> = props => {
  const [data, setData] = useState<any>([]);
  const [isOpenAddressIndex, setIsOpenAddressIndex] = useState(-1);
  const dispatch = useDispatch();
  // const history = useHistory();

  useEffect(() => {
    props.isLoading(true);
    AccountService.fetchInshopOrder(dispatch, props.email || "")
      .then((result: any) => {
        setData(result.slice(0, 14));
        props.hasShopped(result.length > 0);
        props.isDataAvaliable(result.length > 0);
      })
      .then(() => {
        props.isLoading(false);
      })
      .catch(err => {
        console.error("Axios Error: ", err);
      });
    return () => {
      props.hasShopped(false);
    };
  }, []);

  const showDetails = (index: number): any => {
    setIsOpenAddressIndex(index);
  };

  const closeAddress = (data: any, index: number) => {
    const html = [];
    // const orderData = new Date(data.datePlaced);
    const todayDate = new Date();
    todayDate.setMonth(todayDate.getMonth() - 1);
    // now today date is one month less
    // const isHide = orderData >= todayDate;

    html.push(
      <div className={bootstrapStyles.col12}>
        <div className={styles.add}>
          <address className={styles.orderBlock}>
            <label>order # {data.number}</label>
            <div className={bootstrapStyles.row}>
              <div className={bootstrapStyles.col8}>
                <p>{moment(data.datePlaced).format("D MMM,YYYY")}</p>
                <p>
                  <span className={styles.op2}> Status: </span> &nbsp;{" "}
                  <span className={styles.orderStatus}>{"PROCESSED"}</span>
                </p>
                <p>
                  <span className={styles.op2}> Items: </span> &nbsp;{" "}
                  {data.quantity}
                </p>
              </div>
              <div className={bootstrapStyles.col4}>
                <p>
                  <span className={styles.op2}>Order Total</span>
                </p>
                <p className={cs(styles.bold, styles.price)}>
                  {String.fromCharCode(currencyCode[data.currency as Currency])}
                  &nbsp;{data.total}
                </p>
              </div>
            </div>
            <div className={bootstrapStyles.row}>
              <div className={bootstrapStyles.col8}>
                <p className={styles.editView}>
                  <a
                    className={globalStyles.cerise}
                    onClick={() => showDetails(index)}
                  >
                    {" "}
                    view{" "}
                  </a>
                </p>
              </div>
              <div className={bootstrapStyles.col4}>
                <p className={styles.editTrack}></p>
              </div>
            </div>
          </address>
        </div>
      </div>
    );
    return html;
  };

  const closeDetails = () => {
    setIsOpenAddressIndex(-1);
  };

  return (
    <div>
      {data.map((item: any, i: number) => {
        return (
          <div
            className={cs(bootstrapStyles.row, globalStyles.voffset4)}
            key={item.number}
          >
            {isOpenAddressIndex == i ? (
              <InShopOrderDetails
                data={item}
                closeDetails={closeDetails}
                hasShopped={props.hasShopped}
                isLoading={props.isLoading}
                isDataAvaliable={props.isDataAvaliable}
              />
            ) : (
              closeAddress(item, i)
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InShopOrder;
