import React, { useState } from "react";
import moment from "moment";
import { OrdersProps } from "./typings";
import { currencyCode, Currency } from "typings/currency";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import liveImg from "../../../../images/track/live.svg";

const TrackDetails: React.FC<OrdersProps> = props => {
  const [data] = useState(props.orderData || []);
  const [trackData] = useState(props.trackingData || {});
  // const [hasShopped, setHasShopped] = useState(false);
  // const [isOpenAddressIndex, setIsOpenAddressIndex] = useState(-1);

  const received = (data: any, text: string, status: number) => {
    const html = [];
    const mydata = data.filter((a: any) => {
      return a.status == "Order Received";
    });
    if (status == 1) {
      html.push(
        <div className={cs(styles.mainBlock, styles.cerisebg)}>
          <p>{text}</p>
          <p>
            {mydata[0]?.date
              ? moment(mydata[0]?.date).format("D-MMM-YYYY")
              : ""}
          </p>
        </div>
      );
      html.push(<hr />);
    } else {
      const date = moment(mydata[0] ? mydata[0]?.date : new Date()).format(
        "D-MMM-YYYY"
      );
      html.push(
        <div className={cs(styles.mainBlock, styles.cerisebg)}>
          <p>{text}</p>
          <p>{date}</p>
        </div>
      );
      html.push(<hr className={styles.cerisehr} />);
    }

    return html;
  };

  const readyTopick = (data: any, text: string, status: number) => {
    const html = [];
    const mydata = data.filter((a: any) => {
      return a.status == "Ready to Pick";
    });
    if (status == 2) {
      // const date = moment(new Date());
      html.push(
        <div className={cs(styles.mainBlock, styles.cerisebg)}>
          <p>{text}</p>
          <p>
            {mydata[0]?.date
              ? moment(mydata[0]?.date).format("D-MMM-YYYY")
              : ""}
          </p>
        </div>
      );
      html.push(<hr />);
    } else {
      html.push(
        <div className={cs(styles.mainBlock, styles.cerisebg)}>
          <p>{text}</p>
          <p>
            {mydata[0]?.date
              ? moment(mydata[0]?.date).format("D-MMM-YYYY")
              : ""}
          </p>
        </div>
      );
      html.push(<hr className={styles.cerisehr} />);
    }

    return html;
  };

  const shipped = (data: any, text: string, status: number) => {
    const mydata = data.filter((a: any) => {
      return a.status == "Shipped";
    });
    const html = [];
    if (status == 3) {
      html.push(
        <div className={cs(styles.mainBlock, styles.whitebg)}>
          <p>{text}</p>
          <p>
            {mydata[0]?.date
              ? moment(mydata[0]?.date).format("D-MMM-YYYY")
              : ""}
          </p>
        </div>
      );
      html.push(<hr />);
    } else if (status > 3) {
      html.push(
        <div className={cs(styles.mainBlock, styles.cerisebg)}>
          <p>{text}</p>
          <p>
            {mydata[0]?.date
              ? moment(mydata[0]?.date).format("D-MMM-YYYY")
              : ""}
          </p>
        </div>
      );
      html.push(<hr className={styles.cerisehr} />);
    } else {
      html.push(
        <div className={cs(styles.mainBlock, styles.grayborder)}>
          <p>{text}</p>
        </div>
      );
      html.push(<hr />);
    }
    return html;
  };

  const transit = (data: any, text: string, status: number) => {
    const html = [];
    const mydata = data.filter((a: any) => {
      return a.status == "Intransit";
    });

    if (status == 5) {
      html.push(
        <div className={cs(styles.mainBlock, styles.cerisebg)}>
          <p>{text}</p>
          <p>
            {mydata[0]?.date
              ? moment(mydata[0]?.date).format("D-MMM-YYYY")
              : ""}
          </p>
        </div>
      );
      html.push(<hr className={styles.cerisehr} />);
    } else if (status == 4) {
      html.push(
        <div className={styles.relative}>
          <div className={cs(styles.mainBlock, styles.whitebg)}>
            <p>{text}</p>
            <p>
              {mydata[0]?.date
                ? moment(mydata[0]?.date).format("D-MMM-YYYY")
                : ""}
            </p>
          </div>
          <div className={styles.txtRight}>
            <img src={liveImg} width="30" /> Live Status Update:{" "}
            {mydata[0].location}
          </div>
        </div>
      );
      html.push(<hr />);
    } else {
      html.push(
        <div className={cs(styles.mainBlock, styles.grayborder)}>
          <p>{text}</p>
        </div>
      );
      html.push(<hr />);
    }
    return html;
  };

  const delivered = (data: any, text: string, status: number) => {
    const html = [];
    const mydata = data.filter((a: any) => {
      return a.status == "Delivered";
    });
    if (status == 5) {
      html.push(
        <div className={cs(styles.mainBlock, styles.cerisebg)}>
          <p>{text}</p>
          <p>
            {mydata[0]?.date
              ? moment(mydata[0]?.date).format("D-MMM-YYYY")
              : ""}
          </p>
        </div>
      );
    } else {
      html.push(
        <div className={cs(styles.mainBlock, styles.grayborder)}>
          <p style={{ lineHeight: "35px;" }}>{text}</p>
        </div>
      );
    }

    return html;
  };

  const shippingTrack = () => {
    if (!trackData.order_statuses) return false;
    const order = [
        "Order Received",
        "Ready to Pick",
        "Order Shipped",
        "Intransit",
        "Delivered"
      ],
      html = [],
      child = [];
    const value = trackData.order_statuses
      .map((data: any) => {
        return order.indexOf(data.status);
      })
      .sort();
    const status = value.slice(-1)[0] + 1;
    for (let i = 0; i < 5; i++) {
      switch (true) {
        case i == 0:
          child.push(received(trackData.order_statuses, order[i], status));
          break;
        case i == 1:
          child.push(readyTopick(trackData.order_statuses, order[i], status));
          break;
        case i == 2:
          child.push(shipped(trackData.order_statuses, order[i], status));
          break;
        case i == 3:
          child.push(transit(trackData.order_statuses, "In Transit", status));
          break;
        case i == 4:
          child.push(delivered(trackData.order_statuses, order[i], status));
          break;
        default:
          break;
      }
    }
    html.push(<div className={styles.trailTrack}>{child}</div>);
    return html;
  };

  // const showDetails = (index: number): any => {
  //   setIsOpenAddressIndex(index);
  // };

  // const trackOrder = (e: React.MouseEvent) => {
  //   localStorage.setItem("orderNum", e.currentTarget.id);
  //   // props.setAccountPage(e);
  // };

  // const closeDetails = () => {
  //   // setIsOpenAddressIndex(-1);
  // };

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
                <p className={styles.orderStatus}>
                  <span className={styles.op2}>Status:</span> &nbsp;
                  <span className={styles.status}>{data.status}</span>
                </p>
                <p className={styles.orderItems}>
                  <span className={styles.op2}>Items:</span> &nbsp;{totalItem}
                </p>
              </div>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                <p>
                  <span className={styles.op2}>Order Total</span>
                </p>
                <p className={styles.orderTotal}>
                  {String.fromCharCode(
                    ...currencyCode[data.currency as Currency]
                  )}{" "}
                  &nbsp;{data.totalInclTax}
                </p>
              </div>
            </div>
            <div className={cs(bootstrapStyles.row, styles.borderAdd)}>
              <div
                className={cs(bootstrapStyles.col12, bootstrapStyles.colMd6)}
              >
                {shippingTrack()}
              </div>
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
                      <div className={styles.trackOrderAddress}>
                        <div className={styles.title}>Shipping Address</div>
                        <div className={styles.name}>
                          {shippingAddress.firstName}
                          &nbsp; {shippingAddress.lastName}
                        </div>
                        <div className={styles.address}>
                          <div className={cs(styles.addressLine, styles.line1)}>
                            {shippingAddress.line1}
                          </div>
                          <div className={cs(styles.addressLine, styles.line2)}>
                            {shippingAddress.line2}
                          </div>
                          <div className={cs(styles.addressLine)}>
                            {shippingAddress.state}, {shippingAddress.postcode}
                          </div>
                          <div className={cs(styles.addressLine)}>
                            {shippingAddress.countryName}
                          </div>
                          <div className={styles.phone}>
                            M: {shippingAddress.phoneNumber}
                          </div>
                        </div>
                      </div>
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
                    <div className={styles.trackOrderAddress}>
                      <div className={styles.title}>Billing Address</div>
                      <div className={styles.name}>
                        {billingAddress.firstName}
                        &nbsp; {billingAddress.lastName}
                      </div>
                      <div className={styles.address}>
                        <div className={cs(styles.addressLine, styles.line1)}>
                          {billingAddress.line1}
                        </div>
                        <div className={cs(styles.addressLine, styles.line2)}>
                          {billingAddress.line2}
                        </div>
                        <div className={cs(styles.addressLine)}>
                          {billingAddress.state}, {billingAddress.postcode}
                        </div>
                        <div className={cs(styles.addressLine)}>
                          {billingAddress.countryName}
                        </div>
                      </div>
                      <div className={styles.phone}>
                        M: {billingAddress.phoneNumber}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            {data.lines.map((item: any) => {
              const isdisCount =
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
                    <div className={cs(styles.orderContent, styles.textLeft)}>
                      <p className={cs(styles.collection, styles.itemPadding)}>
                        {item.product.collection}
                      </p>
                      <p className={cs(styles.productN, styles.itemPadding)}>
                        {item.title}
                      </p>
                      <p className={cs(styles.price, styles.itemPadding)}>
                        {isdisCount ? (
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
                        {isdisCount ? (
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
                            className={
                              item.product.badgeType == "B_flat"
                                ? globalStyles.cerise
                                : ""
                            }
                          >
                            {String.fromCharCode(
                              ...currencyCode[item.priceCurrency as Currency]
                            )}
                            &nbsp;{" "}
                            {Number.isSafeInteger(+price3)
                              ? price3
                              : price3.toFixed(2) + ""}
                            &nbsp;{" "}
                          </span>
                        )}
                      </p>
                      {item.product.size ? (
                        <div className={styles.size}>
                          Size:&nbsp; {item.product.size}
                        </div>
                      ) : (
                        ""
                      )}
                      <div className={styles.quantity}>
                        Qty:&nbsp; {item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
            {openAddress(item, i)}
          </div>
        );
      })}
    </div>
  );
};

export default TrackDetails;
