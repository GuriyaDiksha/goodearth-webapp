import React, { useState, useEffect } from "react";
import moment from "moment";
import { OrdersProps } from "./typings";
import AccountService from "services/account";
import { Currency, currencyCode } from "typings/currency";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { useDispatch } from "react-redux";
// import InShopOrderDetails from "./InShopOrderDetails";
import noPlpImage from "images/noimageplp.png";
import invoice from "../../../../images/invoice.svg";
import invoiceDisabled from "../../../../images/invoiceDisabled.svg";
import { displayPriceWithCommas } from "utils/utility";

const InShopOrder: React.FC<OrdersProps> = props => {
  const [data, setData] = useState<any>([]);
  const [orderdata, setOrderData] = useState<any>({});
  const [allData, setAllData] = useState<any>([]);
  const [isOpenAddressIndex, setIsOpenAddressIndex] = useState(-1);
  const dispatch = useDispatch();
  // const history = useHistory();

  useEffect(() => {
    props.isLoading(true);
    AccountService.fetchInshopOrder(dispatch, props.email || "")
      .then((result: any) => {
        setData(result.slice(0, 10));
        setAllData(result);
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

  const backToTop = () => {
    if (props.mobile) {
      const ele = document.getElementById("my-orders-head");
      if (ele) {
        ele.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const loadMore = () => {
    setData([...data, ...allData.slice(data.length, data.length + 10)]);
  };

  const showDetails = (index: number, id: string): any => {
    AccountService.fetchshopOrderDetails(dispatch, id)
      .then((result: any) => {
        if (result != "error") {
          console.log(result);
          setOrderData(result);
        }
        props.isLoading(false);
      })
      .catch(err => {
        props.isLoading(false);
        console.error("Axios Error: ", err);
      });
    setIsOpenAddressIndex(index);
    setTimeout(() => {
      const orderElem = id && document.getElementById(id);
      if (orderElem) {
        orderElem.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 300);
  };

  const renderOrder = (item: any, index: number) => {
    const html = [];
    const shippingAddress = data.shipping_address;
    const billingAddress = data.billing_address;
    if (shippingAddress || billingAddress) {
      html.push(
        <div className={styles.addressBlock}>
          {shippingAddress ? (
            <div className={styles.address}>
              <div className={styles.title}>shipping address</div>
              <div className={cs(styles.row, styles.name)}>
                PURCHASED (SHOP)
              </div>
              <div className={cs(styles.row, styles.name)}>ECOM</div>
            </div>
          ) : (
            ""
          )}
          {billingAddress ? (
            <div className={styles.address}>
              <div className={styles.title}>billing address</div>
              <div className={cs(styles.row, styles.name)}>
                {billingAddress.firstName}
                &nbsp; {billingAddress.lastName}
              </div>
              <div className={styles.row}>{billingAddress.line1}</div>
              <div className={styles.row}>{billingAddress.line2}</div>
              <div className={styles.row}>
                {billingAddress.state},&nbsp;{billingAddress.postcode}
              </div>
              <div className={styles.row}>{billingAddress.countryName}</div>
              <div className={cs(styles.row, styles.phoneNumber)}>
                {billingAddress.phoneNumber}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      );
    }
    {
      orderdata?.order_lines?.map((item: any) => {
        const charCurrency = String.fromCharCode(
          ...currencyCode["INR" as Currency]
        );
        html.push(
          <div className={cs(styles.product)} key={item.sku}>
            <div className={cs(styles.imageContainer)}>
              <img src={noPlpImage} />
            </div>
            <div className={cs(styles.productInfo)}>
              <p className={styles.title}>{item.title}</p>
              <p className={cs(styles.price)}>
                <span className={cs(styles.amountPaid)}>
                  {`${charCurrency} ${displayPriceWithCommas(
                    item.price,
                    "INR"
                  )}`}
                </span>
              </p>
            </div>
          </div>
        );
      });
    }

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
          <div className={styles.myOrderBlock}>
            <label>order # {data.number}</label>
            {/* Info */}
            <div
              className={cs(styles.orderData, {
                [styles.singleOrder]: isOpenAddressIndex == index
              })}
            >
              <div className={styles.info}>
                <div className={styles.row}>
                  <div className={cs(styles.data, styles.date)}>
                    {moment(data.date_placed).format("D MMM,YYYY")}
                  </div>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}> Status: </span> &nbsp;{" "}
                  <span className={styles.data}>
                    {data.quantity > 0 ? "Processed" : "Returned"}
                  </span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}> Items: </span> &nbsp;{" "}
                  <span className={styles.data}>{data.quantity}</span>
                </div>
              </div>
              <div className={styles.amountPaid}>
                <span className={styles.label}>Amount Paid</span>
                <span className={styles.data}>
                  {String.fromCharCode(...currencyCode["INR" as Currency])}
                  &nbsp;{displayPriceWithCommas(data.total, "INR")}
                </span>
              </div>
            </div>
            {isOpenAddressIndex == index ? renderOrder(data, index) : null}
            {/* Actions */}
            <div className={styles.actions}>
              <p className={styles.action}>
                {isOpenAddressIndex == index ? (
                  <a onClick={() => closeDetails(index, data.number)}>close</a>
                ) : (
                  <a
                    onClick={() =>
                      isHide ? "" : showDetails(index, data.number)
                    }
                  >
                    view
                  </a>
                )}
              </p>
              <p
                className={cs(styles.action, {
                  [styles.disabled]: data.invoiceFileName == ""
                })}
              >
                <a
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
                      cursor: data?.invoiceFileName ? "pointer" : "not-allowed",
                      marginLeft: "-8px"
                    }}
                  />{" "}
                  INVOICE{" "}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
    return html;
  };

  return (
    <div>
      {data?.map((item: any, i: number) => {
        return (
          <div
            className={cs(bootstrapStyles.row, globalStyles.voffset4)}
            key={item.number}
          >
            {// isOpenAddressIndex == i ? (
            //   <InShopOrderDetails
            //     data={item}
            //     closeDetails={closeDetails}
            //     hasShopped={props.hasShopped}
            //     isLoading={props.isLoading}
            //     isDataAvaliable={props.isDataAvaliable}
            //   />
            // ) : (
            closeAddress(item, i)
            // )
            }
          </div>
        );
      })}

      {data?.length ? (
        <div className={styles.btnWrp}>
          {data?.length !== allData?.length ? (
            <button className={styles.loadMoreBtn} onClick={() => loadMore()}>
              Load More
            </button>
          ) : data.length >= 3 ? (
            <button className={styles.backToTopBtn} onClick={() => backToTop()}>
              Back to top
            </button>
          ) : (
            ""
          )}
        </div>
      ) : null}
    </div>
  );
};

export default InShopOrder;
