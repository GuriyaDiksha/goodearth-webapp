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
import { useHistory } from "react-router";
import invoice from "../../../../images/invoice.svg";
import invoiceDisabled from "../../../../images/invoiceDisabled.svg";

const OnlineOrders: React.FC<OrdersProps> = props => {
  const [data, setData] = useState<any[]>([]);
  const [orderdata, setOrderdata] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    count: 0,
    prev: null,
    next: null
  });
  // const [hasShopped, setHasShopped] = useState(false);
  const [isopenOrderIndex, setIsopenOrderIndex] = useState(-1);
  const dispatch = useDispatch();
  const history = useHistory();

  const fetchOrders = (url?: string | null) => {
    props.isLoading(true);
    AccountService.fetchOrders(dispatch, url)
      .then((resData: any) => {
        if (resData?.previous) {
          setData([...data, ...resData.results]);
        } else {
          setData(resData.results);
        }

        // setHasShopped(data.results.length > 0);
        props.hasShopped(resData.results.length > 0);
        props.isDataAvaliable(resData.results.length > 0);
        setPagination({
          count: resData?.count,
          prev: resData?.previous,
          next: resData?.next
        });
      })
      .then(() => {
        props.isLoading(false);
        const orderNum = localStorage.getItem("orderNum");
        const orderElem = orderNum && document.getElementById(orderNum);
        if (orderElem) {
          orderElem.scrollIntoView({ block: "center", behavior: "smooth" });
          localStorage.setItem("orderNum", "");
        }
        localStorage.setItem("orderNum", "");
      })
      .catch(err => {
        console.error("Axios Error: ", err);
      });
    return () => {
      props.hasShopped(false);
    };
  };

  useEffect(() => {
    fetchOrders();
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

  const showDetails = (index: number, id: string): any => {
    AccountService.fetchOrderById(dispatch, id, props.email || "").then(
      (data: any) => {
        setOrderdata(data);
        setIsopenOrderIndex(index);
        setTimeout(() => {
          const orderElem = id && document.getElementById(id);
          if (orderElem) {
            orderElem.scrollIntoView({ block: "start", behavior: "auto" });
          }
        }, 300);
      }
    );
  };

  const trackOrder = (e: React.MouseEvent) => {
    localStorage.setItem("orderNum", e.currentTarget.id);
    history.push("/account/track-order");
    // props.setAccountPage(e);
  };

  const closeDetails = (orderNum?: string) => {
    setIsopenOrderIndex(-1);
    setTimeout(() => {
      const orderElem = orderNum && document.getElementById(orderNum);
      if (orderElem) {
        orderElem.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 300);
  };

  const renderOrder = (index: number) => {
    return <div>Order</div>;
  };

  const openOrder = (list: any, index: number) => {
    const data: any = orderdata;
    const html = [],
      shippingAddress = data.shippingAddress[0],
      billingAddress = data.billingAddress[0],
      priceCurrency = list.currency;

    const currencyChar = String.fromCharCode(
      ...currencyCode[priceCurrency as Currency]
    );

    let totalItem = 0;

    for (let i = 0; i < data.lines.length; i++) {
      totalItem += data.lines[i].quantity;
    }

    html.push(
      <div className={bootstrapStyles.col12}>
        <div className={styles.add} id={data.number}>
          <div className={styles.orderBlock}>
            <div className={styles.myOrderBlock}>
              <label className={styles.topLabel}>order # {data.number}</label>
              <div className={cs(styles.orderData, styles.singleOrder)}>
                <div className={styles.info}>
                  <div className={styles.row}>
                    <div className={styles.data}>
                      {moment(list.datePlaced).format("D MMM,YYYY")}
                    </div>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Status</span>: &nbsp;
                    <span className={styles.data}>{data.status}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.label}>Items</span>: &nbsp;
                    <span className={styles.data}>{totalItem}</span>
                  </div>
                </div>
                <div className={styles.amountPaid}>
                  <span className={styles.label}>Amount Paid</span>
                  <span className={styles.data}>
                    {currencyChar} &nbsp;{list.totalInclTax}
                  </span>
                </div>
              </div>
              <div className={styles.addressBlock}>
                {/* Shipping Address */}
                {shippingAddress && (
                  <div className={styles.address}>
                    <div className={styles.title}>shipping address</div>
                    {data.isBridalOrder && (
                      <div className={styles.row}>
                        <span className={styles.bridalInfo}>
                          {data.registrantName}
                          &nbsp; & &nbsp;{data.coRegistrantName}
                          {"'s "}
                          {data.occasion} Registry
                        </span>
                        <span className={styles.bridalMessage}></span>
                      </div>
                    )}
                    <div className={cs(styles.row, styles.name)}>
                      {shippingAddress.firstName}
                      &nbsp; {shippingAddress.lastName}
                    </div>
                    <div className={styles.row}>{shippingAddress.line1}</div>
                    <div className={styles.row}>{shippingAddress.line2}</div>
                    <div className={styles.row}>
                      {shippingAddress.state},&nbsp;{shippingAddress.postcode}
                    </div>
                    <div className={styles.row}>
                      {shippingAddress.countryName}
                    </div>
                    <div className={cs(styles.row, styles.phoneNumber)}>
                      {shippingAddress.phoneNumber}
                    </div>
                  </div>
                )}
                {/* Billing Address */}
                {billingAddress && (
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
                    <div className={styles.row}>
                      {billingAddress.countryName}
                    </div>
                    <div className={cs(styles.row, styles.phoneNumber)}>
                      {billingAddress.phoneNumber}
                    </div>
                  </div>
                )}
              </div>
              {/* Products */}
              {/* Prices */}
              <div className={styles.prices}>
                <div className={cs(styles.price, styles.price1)}>
                  <span className={styles.label}>SUBTOTAL</span>
                  <span className={styles.value}>
                    {currencyChar} &nbsp; 9,000
                  </span>
                </div>
                <div className={cs(styles.price, styles.price2)}>
                  <span className={styles.label}>SHIPPING & HANDLING</span>
                  <span className={styles.value}>
                    {`(+)`}&nbsp;{currencyChar} &nbsp; 100
                  </span>
                </div>
                <div
                  className={cs(styles.price, styles.price3, styles.discount)}
                >
                  <span className={styles.label}>DISCOUNT</span>
                  <span className={styles.value}>
                    {`(-)`}&nbsp;{currencyChar} &nbsp; 400
                  </span>
                </div>
                <div className={cs(styles.price, styles.total)}>
                  <span className={styles.label}>AMOUNT PAID</span>
                  <span className={styles.value}>
                    {currencyChar} &nbsp; 9,600
                  </span>
                </div>
              </div>
              {/* Actions */}
              <div className={styles.actions}>
                <p className={styles.action}>
                  <a onClick={() => closeDetails(data.number)}>close</a>
                </p>
                <p className={styles.action}>
                  <a>TRACK ORDER</a>
                </p>
              </div>
            </div>
            {data?.lines.map((item: any) => {
              const isDiscount =
                +item.priceInclTax - +item.priceExclTaxExclDiscounts != 0;
              const price1 =
                +parseFloat(item.priceInclTax).toFixed(2) / +item.quantity;
              const price2 =
                +parseFloat(item.priceExclTaxExclDiscounts).toFixed(2) /
                +item.quantity;
              const price3 =
                +parseFloat(item.priceExclTaxExclDiscounts).toFixed(2) /
                +item.quantity;
              console.log(price1, price2, price3);
              return (
                <div
                  className={cs(
                    bootstrapStyles.row,
                    styles.borderAdd,
                    globalStyles.voffset4
                  )}
                  key={item.product.id}
                >
                  <div
                    className={cs(bootstrapStyles.col5, bootstrapStyles.colMd3)}
                  >
                    <img
                      src={
                        item.product.images[0]
                          ? item.product.images[0].productImage
                          : ""
                      }
                      className={globalStyles.imgResponsive}
                    />
                  </div>
                  <div
                    className={cs(bootstrapStyles.col7, bootstrapStyles.colMd9)}
                  >
                    <div className={cs(styles.imageContent, styles.textLeft)}>
                      <p className={cs(styles.productH, styles.itemPadding)}>
                        {item.product.collection}
                      </p>
                      <p className={cs(styles.productN, styles.itemPadding)}>
                        {item.title}
                      </p>
                      <p className={cs(styles.productN, styles.itemPadding)}>
                        {isDiscount ? (
                          <span className={styles.discountprice}>
                            {String.fromCharCode(
                              ...currencyCode[item.priceCurrency as Currency]
                            )}
                            {Number.isSafeInteger(+price1)
                              ? price1
                              : price1.toFixed(2) + ""}
                            &nbsp;{" "}
                          </span>
                        ) : (
                          ""
                        )}
                        {isDiscount ? (
                          <span className={styles.strikeprice}>
                            {String.fromCharCode(
                              ...currencyCode[item.priceCurrency as Currency]
                            )}
                            {Number.isSafeInteger(+price2)
                              ? price2
                              : price2.toFixed(2) + ""}
                            &nbsp;{" "}
                          </span>
                        ) : (
                          <span
                            className={cs(
                              {
                                [globalStyles.cerise]:
                                  item.product.badgeType == "B_flat"
                              },
                              styles.price
                            )}
                          >
                            {String.fromCharCode(
                              ...currencyCode[item.priceCurrency as Currency]
                            )}
                            &nbsp;{" "}
                            {Number.isSafeInteger(+price3)
                              ? price3
                              : price3.toFixed(2) + ""}
                          </span>
                        )}
                      </p>
                      {item.product.size ? (
                        <div className={styles.plp_prod_quantity}>
                          Size:&nbsp; {item.product.size}
                        </div>
                      ) : (
                        ""
                      )}
                      <div className={styles.plp_prod_quantity}>
                        Qty:&nbsp; {item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className={cs(styles.edit, styles.close2)}>
              <a
                className={globalStyles.cerise}
                onClick={() => closeDetails(data.number)}
              >
                {" "}
                close{" "}
              </a>
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
        const orderDate = new Date(item.datePlaced);
        const todayDate = new Date();

        todayDate.setMonth(todayDate.getMonth() - 1);
        // now today date is one month less
        const isHide = orderDate >= todayDate;

        const shippingAddress = item.shippingAddress?.[0];
        return (
          <div
            className={cs(bootstrapStyles.row, globalStyles.voffset4)}
            key={item.number}
          >
            <div className={bootstrapStyles.col12}>
              <div className={styles.add} id={item.number}>
                <div className={styles.myOrderBlock}>
                  <label>order # {item.number}</label>
                  {/* Info */}
                  <div className={styles.orderData}>
                    <div className={styles.info}>
                      <div className={styles.row}>
                        <div className={styles.data}>
                          {moment(item.datePlaced).format("D MMM,YYYY")}
                        </div>
                      </div>
                      <div className={styles.row}>
                        <span className={styles.label}> Status: </span> &nbsp;{" "}
                        <span className={styles.data}>{item.status}</span>
                      </div>
                      <div className={styles.row}>
                        <span className={styles.label}> Items: </span> &nbsp;{" "}
                        <span className={styles.data}>{item.itemCount}</span>
                      </div>
                    </div>
                    <div className={styles.amountPaid}>
                      <span className={styles.label}>Amount Paid</span>
                      <span className={styles.data}>
                        {String.fromCharCode(
                          ...currencyCode[item.currency as Currency]
                        )}
                        &nbsp;{item.totalInclTax}
                      </span>
                    </div>
                  </div>
                  {isopenOrderIndex == i ? renderOrder(i) : null}
                  {/* Actions */}
                  <div className={styles.actions}>
                    <p className={styles.action}>
                      {isopenOrderIndex !== -1 ? (
                        <a onClick={() => closeDetails(item.number)}>close</a>
                      ) : (
                        <a onClick={() => showDetails(i, item.number)}>view</a>
                      )}
                    </p>
                    <p className={styles.action}>
                      {isHide && !shippingAddress?.isTulsi ? (
                        <a
                          onClick={e => {
                            trackOrder(e);
                          }}
                          data-name="track"
                          id={item.number}
                        >
                          {" "}
                          TRACK ORDER{" "}
                        </a>
                      ) : (
                        ""
                      )}
                    </p>
                    {item?.status === "Delivered" ? (
                      <p
                        className={cs(
                          styles.action,
                          item.invoiceFileName ? "" : styles.disabled
                        )}
                      >
                        <a
                          onClick={e => {
                            // const filename = data.invoiceFileName.split(
                            //   "ge-invoice-test/"
                            // )[1];
                            const filename = `E-Invoice_Order No. ${item?.number}.pdf`;
                            fetch(item.invoiceFileName).then(function(t) {
                              return t.blob().then(b => {
                                if (!item.invoiceFileName) {
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
                          id={item.number}
                        >
                          <img
                            alt="goodearth-logo"
                            src={
                              item?.invoiceFileName ? invoice : invoiceDisabled
                            }
                            style={{
                              width: "20px",
                              height: "15px",
                              cursor: item?.invoiceFileName
                                ? "pointer"
                                : "not-allowed",
                              marginLeft: "-8px"
                            }}
                          />{" "}
                          INVOICE{" "}
                        </a>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {data?.length ? (
        <div className={styles.btnWrp}>
          {pagination?.next ? (
            <button
              className={styles.loadMoreBtn}
              onClick={() => fetchOrders(pagination?.next)}
            >
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

export default OnlineOrders;
