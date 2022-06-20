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
  const [data, setData] = useState([]);
  // const [hasShopped, setHasShopped] = useState(false);
  const [isOpenAddressIndex, setIsOpenAddressIndex] = useState(-1);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    props.isLoading(true);
    AccountService.fetchMyOrders(dispatch)
      .then(data => {
        setData(data.results.slice(0, 14));
        // setHasShopped(data.results.length > 0);
        props.hasShopped(data.results.length > 0);
        props.isDataAvaliable(data.results.length > 0);
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
  }, []);

  const showDetails = (index: number, id: string): any => {
    setIsOpenAddressIndex(index);
    setTimeout(() => {
      const orderElem = id && document.getElementById(id);
      if (orderElem) {
        orderElem.scrollIntoView({ block: "start", behavior: "auto" });
      }
    }, 300);
  };

  const trackOrder = (e: React.MouseEvent) => {
    localStorage.setItem("orderNum", e.currentTarget.id);
    history.push("/account/track-order");
    // props.setAccountPage(e);
  };

  const closeAddress = (data: any, index: number) => {
    const html = [];
    const orderData = new Date(data.datePlaced);
    const todayDate = new Date();

    let totalItem = 0;
    for (let i = 0; i < data.lines.length; i++) {
      totalItem += data.lines[i].quantity;
    }
    todayDate.setMonth(todayDate.getMonth() - 1);
    // now today date is one month less
    const isHide = orderData >= todayDate;
    const shippingAddress = data.shippingAddress[0];
    html.push(
      <div className={bootstrapStyles.col12}>
        <div className={styles.add} id={data.number}>
          <address className={styles.orderBlock}>
            <label>order # {data.number}</label>
            <div className={bootstrapStyles.row}>
              <div className={bootstrapStyles.col8}>
                <p>{moment(data.datePlaced).format("D MMM,YYYY")}</p>
                <p>
                  <span className={styles.op2}> Status: </span> &nbsp;{" "}
                  <span className={styles.orderStatus}>{data.status}</span>
                </p>
                <p>
                  <span className={styles.op2}> Items: </span> &nbsp;{" "}
                  {totalItem}
                </p>
              </div>
              <div className={bootstrapStyles.col4}>
                <p>
                  <span className={styles.op2}>Order Total</span>
                </p>
                <p className={cs(styles.bold, styles.price)}>
                  {String.fromCharCode(
                    ...currencyCode[data.currency as Currency]
                  )}
                  &nbsp;{data.totalInclTax}
                </p>
              </div>
            </div>
            <div className={bootstrapStyles.row}>
              <div className={bootstrapStyles.col8}>
                <p className={styles.editView}>
                  <a
                    className={globalStyles.cerise}
                    onClick={() => showDetails(index, data.number)}
                  >
                    {" "}
                    view{" "}
                  </a>
                </p>
              </div>
              <div className={bootstrapStyles.col4}>
                <p className={styles.editTrack}>
                  {isHide && !shippingAddress?.isTulsi ? (
                    <a
                      className={globalStyles.cerise}
                      onClick={e => {
                        trackOrder(e);
                      }}
                      data-name="track"
                      id={data.number}
                    >
                      {" "}
                      TRACK ORDER{" "}
                    </a>
                  ) : (
                    ""
                  )}
                </p>
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
                      if (!data.invoiceFileName) {
                        return false;
                      }

                      const filename = data.invoiceFileName.split(
                        "ge-invoice-test/"
                      )[1];
                      fetch(data.invoiceFileName).then(function(t) {
                        return t.blob().then(b => {
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

  const closeDetails = (orderNum?: string) => {
    setIsOpenAddressIndex(-1);
    setTimeout(() => {
      const orderElem = orderNum && document.getElementById(orderNum);
      if (orderElem) {
        orderElem.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 300);
  };

  const openAddress = (data: any, index: number) => {
    const html = [],
      shippingAddress = data.shippingAddress[0],
      billingAddress = data.billingAddress[0];
    let totalItem = 0;

    for (let i = 0; i < data.lines.length; i++) {
      totalItem += data.lines[i].quantity;
    }
    html.push(
      <div className={bootstrapStyles.col12}>
        <div className={styles.add} id={data.number}>
          <address>
            <label>order # {data.number}</label>
            <div className={styles.orderBlock}>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <p>{moment(data.datePlaced).format("D MMM,YYYY")}</p>
                <p>
                  <span className={styles.op2}>Status</span>: &nbsp;
                  <span className={styles.orderStatus}>{data.status}</span>
                </p>
                <p>
                  <span className={styles.op2}>Items</span>: &nbsp;{totalItem}
                </p>
              </div>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <p>
                  <span className={styles.op2}>Order Total</span>
                </p>
                <p>
                  {String.fromCharCode(
                    ...currencyCode[data.currency as Currency]
                  )}{" "}
                  &nbsp;{data.totalInclTax}
                </p>
              </div>
              <p className={styles.edit}>
                <a
                  className={globalStyles.cerise}
                  onClick={() => closeDetails(data.number)}
                >
                  {" "}
                  close{" "}
                </a>
              </p>
            </div>
            <div className={cs(bootstrapStyles.row, styles.borderAdd)}>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                {data.isBridalOrder ? (
                  <div className={styles.add}>
                    {shippingAddress ? (
                      <address>
                        <label>shipping address</label>
                        <p>
                          {data.registrantName}
                          &nbsp; & &nbsp;{data.coRegistrantName}
                          {"'s "}
                          {data.occasion} Registry
                        </p>
                        <p className={styles.light}>
                          {" "}
                          Address predefined by registrant{" "}
                        </p>
                      </address>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <div className={styles.add}>
                    {shippingAddress ? (
                      <address>
                        <label>shipping address</label>
                        <p>
                          {shippingAddress.firstName}
                          &nbsp; {shippingAddress.lastName}
                          <br />
                        </p>
                        <p className={styles.light}>
                          {shippingAddress.line1}
                          <br />
                          {shippingAddress.line2}{" "}
                          {shippingAddress.line2 && <br />}
                          {shippingAddress.state}, {shippingAddress.postcode}{" "}
                          <br />
                          {shippingAddress.countryName}
                          <br />
                        </p>
                        <p> {shippingAddress.phoneNumber}</p>
                      </address>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <div className={styles.add}>
                  {billingAddress ? (
                    <address>
                      <label>billing address</label>
                      <p>
                        {billingAddress.firstName}
                        &nbsp; {billingAddress.lastName}
                        <br />
                      </p>
                      <p className={styles.light}>
                        {billingAddress.line1}
                        <br />
                        {billingAddress.line2} {billingAddress.line2 && <br />}
                        {billingAddress.state}, {billingAddress.postcode} <br />
                        {billingAddress.countryName}
                        <br />
                      </p>
                      <p> {billingAddress.phoneNumber}</p>
                    </address>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            {data.lines.map((item: any) => {
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
            <div className={styles.edit}>
              <a
                className={globalStyles.cerise}
                onClick={() => closeDetails(data.number)}
              >
                {" "}
                close{" "}
              </a>
            </div>
          </address>
        </div>
      </div>
    );
    return html;
  };
  return (
    <div>
      {data.map((item: any, i: number) => {
        return (
          <div
            className={cs(bootstrapStyles.row, globalStyles.voffset4)}
            key={item.number}
          >
            {isOpenAddressIndex == i
              ? openAddress(item, i)
              : closeAddress(item, i)}
          </div>
        );
      })}
    </div>
  );
};

export default OnlineOrders;
