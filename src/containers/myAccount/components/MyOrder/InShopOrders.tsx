import React, { useState, useEffect } from "react";
import moment from "moment";
import { OrdersProps } from "./typings";
import AccountService from "services/account";
import { currencyCode } from "typings/currency";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { useDispatch } from "react-redux";
import InShopOrderDetails from "./InShopOrderDetails";
import invoice from "../../../../images/invoice.svg";
import invoiceDisabled from "../../../../images/invoiceDisabled.svg";

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

  const showDetails = (index: number, id: string): any => {
    setIsOpenAddressIndex(index);
    setTimeout(() => {
      const orderElem = id && document.getElementById(id);
      if (orderElem) {
        orderElem.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 300);
  };

  const closeAddress = (data: any, index: number) => {
    const html = [];
    const orderData = new Date(data.date_placed),
      lastDate = new Date("04-01-2019"),
      isHide = orderData <= lastDate;
    // todayDate.setMonth(todayDate.getMonth() - 1);
    // now today date is one month less
    // const isHide = orderData >= todayDate;

    html.push(
      <div className={bootstrapStyles.col12}>
        <div className={styles.add} id={data.number}>
          <address className={styles.orderBlock}>
            <label>order # {data.number}</label>
            <div className={bootstrapStyles.row}>
              <div className={bootstrapStyles.col8}>
                <p>{moment(data.date_placed).format("D MMM,YYYY")}</p>
                <p>
                  <span className={styles.op2}> Status: </span> &nbsp;{" "}
                  <span className={styles.orderStatus}>
                    {data.quantity > 0 ? "Processed" : "Returned"}
                  </span>
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
                  {String.fromCharCode(...currencyCode["INR"])}
                  &nbsp;{data.total}
                </p>
              </div>
            </div>
            <div className={bootstrapStyles.row}>
              <div className={bootstrapStyles.col8}>
                <p className={styles.editView}>
                  <a
                    className={
                      isHide
                        ? cs(styles.op2, globalStyles.disableCursor)
                        : globalStyles.cerise
                    }
                    onClick={() =>
                      isHide ? "" : showDetails(index, data.number)
                    }
                  >
                    {" "}
                    view{" "}
                  </a>
                </p>
              </div>
              <div className={bootstrapStyles.col4}>
                <p
                  className={cs(
                    styles.editTrack,
                    data.invoiceFileName ? "" : styles.editTrackDisabled
                  )}
                >
                  <a
                    className={cs(
                      data.invoiceFileName
                        ? globalStyles.cerise
                        : globalStyles.ceriseDisabled
                    )}
                    onClick={e => {
                      const filename = data.invoiceFileName.split(
                        "ge-invoice-test/"
                      )[1];
                      fetch(data.invoiceFileName).then(function(t) {
                        return t.blob().then(b => {
                          if (!data.invoiceFileName) {
                            return false;
                          }

                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(b);
                          a.setAttribute("download", filename);
                          a.click();
                        });
                      });
                    }}
                    data-name="track"
                    id={data.number}
                  >
                    <img
                      alt="goodearth-logo"
                      src={data?.invoiceFileName ? invoice : invoiceDisabled}
                      style={{
                        width: "20px",
                        height: "15px",
                        cursor: data?.invoiceFileName
                          ? "pointer"
                          : "not-allowed",
                        marginLeft: "-8px"
                      }}
                    />{" "}
                    INVOICE{" "}
                  </a>
                </p>
              </div>
            </div>
          </address>
        </div>
      </div>
    );
    return html;
  };

  const closeDetails = (index: number, orderNum?: string) => {
    setIsOpenAddressIndex(-1);
    setTimeout(() => {
      const orderElem = orderNum && document.getElementById(orderNum);
      if (orderElem) {
        orderElem.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 300);
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
