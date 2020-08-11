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

const OnlineOrders: React.FC<OrdersProps> = props => {
  const [data, setData] = useState([]);
  // const [hasShopped, setHasShopped] = useState(false);
  const [isOpenAddressIndex, setIsOpenAddressIndex] = useState(-1);
  const dispatch = useDispatch();
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

  const showDetails = (index: number): any => {
    setIsOpenAddressIndex(index);
  };

  const trackOrder = (e: React.MouseEvent) => {
    localStorage.setItem("orderNum", e.currentTarget.id);
    // props.setAccountPage(e);
  };

  const closeAddress = (data: any, index: number) => {
    const html = [],
      orderData = new Date(data.datePlaced),
      todayDate = new Date();

    let totalItem = 0;
    for (let i = 0; i < data.lines.length; i++) {
      totalItem += data.lines[i].quantity;
    }
    todayDate.setMonth(todayDate.getMonth() - 1);
    // now today date is one month less
    const isHide = orderData >= todayDate;

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
                  {String.fromCharCode(currencyCode[data.currency as Currency])}
                  &nbsp;{data.totalInclTax}
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
                <p className={styles.editTrack}>
                  {isHide ? (
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
            <div className={cs(bootstrapStyles.row, styles.orderBlock)}>
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
                  {String.fromCharCode(currencyCode[data.currency as Currency])}{" "}
                  &nbsp;{data.totalInclTax}
                </p>
              </div>
              <p className={styles.edit}>
                <a className={globalStyles.cerise} onClick={closeDetails}>
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
                          {data.registrant_name}
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
                        {String.fromCharCode(
                          currencyCode[item.priceCurrency as Currency]
                        )}
                        &nbsp; {item.priceInclTax}
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
              <a className={globalStyles.cerise} onClick={() => closeDetails()}>
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
