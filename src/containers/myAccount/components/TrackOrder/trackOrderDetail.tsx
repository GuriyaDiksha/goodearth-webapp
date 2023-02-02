import React, { useState } from "react";
import moment from "moment";
import { OrdersProps } from "./typings";
import { currencyCode, Currency } from "typings/currency";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";

const TrackDetails: React.FC<OrdersProps> = props => {
  const [data] = useState(props.orderData || []);
  const [trackData] = useState(props.trackingData || {});

  const received = (data: any, text: string, status: number) => {
    const html = [];
    const mydata = data.filter((a: any) => {
      return a.status == "Order Received";
    });
    if (status == 1) {
      html.push(
        <div className={cs(styles.mainBlock, styles.inactive)}>
          <div className={cs(styles.circle, styles.active)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            <p className={styles.date}>
              {mydata[0]?.date
                ? moment(mydata[0]?.date).format("D-MMM-YYYY")
                : ""}
            </p>
          </div>
        </div>
      );
    } else {
      const date = moment(mydata[0] ? mydata[0]?.date : new Date()).format(
        "D-MMM-YYYY"
      );

      html.push(
        <div className={cs(styles.mainBlock, styles.active)}>
          <div className={cs(styles.circle, styles.active)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            <p className={styles.date}>{date}</p>
          </div>
        </div>
      );
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
        <div className={cs(styles.mainBlock, styles.inactive)}>
          <div className={cs(styles.circle, styles.active)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            <p className={styles.date}>
              {mydata[0]?.date
                ? moment(mydata[0]?.date).format("D-MMM-YYYY")
                : ""}
            </p>
          </div>
        </div>
      );
    } else {
      html.push(
        <div
          className={cs(
            styles.mainBlock,
            status > 2 ? styles.active : styles.inactive
          )}
        >
          <div
            className={cs(
              styles.circle,
              status > 2 ? styles.active : styles.inactive
            )}
          ></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            <p className={styles.date}>
              {mydata[0]?.date
                ? moment(mydata[0]?.date).format("D-MMM-YYYY")
                : ""}
            </p>
          </div>
        </div>
      );
    }

    return html;
  };

  const shipped = (data: any, text: string, status: number) => {
    console.log(status, data);
    const mydata = data.filter((a: any) => {
      return a.status == "Shipped";
    });
    const html = [];
    if (status == 3) {
      html.push(
        <div className={cs(styles.mainBlock, styles.inactive)}>
          <div className={cs(styles.circle, styles.active)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            <p className={styles.date}>
              {mydata[0]?.date
                ? moment(mydata[0]?.date).format("D-MMM-YYYY")
                : ""}
            </p>
          </div>
        </div>
      );
    } else if (status > 3) {
      html.push(
        <div className={cs(styles.mainBlock, styles.active)}>
          <div className={cs(styles.circle, styles.active)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            <p className={styles.date}>
              {mydata[0]?.date
                ? moment(mydata[0]?.date).format("D-MMM-YYYY")
                : ""}
            </p>
          </div>
        </div>
      );
    } else {
      html.push(
        <div className={cs(styles.mainBlock, styles.inactive)}>
          <div className={cs(styles.circle, styles.inactive)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
          </div>
        </div>
      );
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
        <div className={cs(styles.mainBlock, styles.active)}>
          <div className={cs(styles.circle, styles.active)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            <p className={styles.date}>
              {mydata[0]?.date
                ? moment(mydata[0]?.date).format("D-MMM-YYYY")
                : ""}
            </p>
          </div>
        </div>
      );
    } else if (status == 4) {
      html.push(
        <div className={cs(styles.mainBlock, styles.inactive)}>
          <div className={cs(styles.circle, styles.active)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            <p className={styles.date}>
              {mydata[0]?.date
                ? moment(mydata[0]?.date).format("D-MMM-YYYY")
                : ""}
            </p>
            <div className={cs(styles.liveLocation)}>
              {`Live Status Update: ${mydata[0].location}`}
            </div>
          </div>
        </div>
      );
    } else {
      html.push(
        <div className={cs(styles.mainBlock, styles.inactive)}>
          <div className={cs(styles.circle, styles.inactive)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
          </div>
        </div>
      );
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
        <div className={cs(styles.mainBlock, styles.delivered)}>
          <div className={cs(styles.circle, styles.active)}></div>
          <div className={styles.textBlock}>
            <p className={styles.text}>{text}</p>
            <p className={styles.date}>
              {mydata[0]?.date
                ? moment(mydata[0]?.date).format("D-MMM-YYYY")
                : ""}
            </p>
          </div>
        </div>
      );
    } else {
      html.push(
        <div className={cs(styles.mainBlock, styles.delivered)}>
          <div className={cs(styles.circle, styles.inactive)}></div>
          <div className={styles.textBlock}>
            <p style={{ lineHeight: "35px;" }} className={styles.text}>
              {text}
            </p>
          </div>
        </div>
      );
    }

    return html;
  };

  const trackTrail = () => {
    if (!trackData.order_statuses) return false;
    const order = [
        "Order Received",
        "Ready to Pick",
        "Shipped",
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

  const renderOrderWithTrackTrail = (data: any, index: number) => {
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
          <div className={styles.myOrderBlock}>
            <label>order # {data.number}</label>
            <div className={cs(styles.orderData)}>
              <div className={styles.info}>
                <div className={styles.row}>
                  <div className={styles.data}>
                    {moment(data.datePlaced).format("D MMM,YYYY")}
                  </div>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}> Status: </span> &nbsp;{" "}
                  <span className={styles.data}>{data.status}</span>
                </div>
                <div className={styles.row}>
                  <span className={styles.label}> Items: </span> &nbsp;{" "}
                  <span className={styles.data}>{totalItem}</span>
                </div>
              </div>
              <div className={styles.amountPaid}>
                <span className={styles.label}>Amount Paid</span>
                <span className={styles.data}>
                  {String.fromCharCode(
                    ...currencyCode[data.currency as Currency]
                  )}
                  &nbsp;{data.totalInclTax}
                </span>
              </div>
            </div>
            <div className={cs(bootstrapStyles.row, styles.borderAdd)}>
              {trackTrail()}
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
                  <div className={styles.row}>{billingAddress.countryName}</div>
                  <div className={cs(styles.row, styles.phoneNumber)}>
                    {billingAddress.phoneNumber}
                  </div>
                </div>
              )}
            </div>
            {data?.lines.map((item: any) => {
              const isDiscount =
                +item.priceInclTax - +item.priceExclTaxExclDiscounts != 0;

              const amountPaid =
                +parseFloat(item.priceInclTax).toFixed(2) / +item.quantity;
              const price =
                +parseFloat(item.priceExclTaxExclDiscounts).toFixed(2) /
                +item.quantity;

              const charCurrency = String.fromCharCode(
                ...currencyCode[item.priceCurrency as Currency]
              );

              return (
                <div className={cs(styles.product)} key={item.product.id}>
                  <div className={cs(styles.imageContainer)}>
                    <img
                      src={
                        item.product.images[0]
                          ? item.product.images[0].productImage
                          : ""
                      }
                    />
                  </div>
                  <div className={cs(styles.productInfo)}>
                    {item.product.collection && (
                      <p className={cs(styles.collection)}>
                        {item.product.collection}
                      </p>
                    )}
                    <p className={styles.title}>{item.title}</p>
                    <p className={cs(styles.price)}>
                      <span
                        className={cs(styles.amountPaid, {
                          [styles.gold]: isDiscount
                        })}
                      >
                        {`${charCurrency} ${amountPaid}`}
                      </span>
                      {isDiscount && (
                        <span className={styles.originalPrice}>
                          {`${charCurrency} ${price}`}
                        </span>
                      )}
                    </p>
                    {item.product.size && (
                      <div className={styles.size}>
                        {`Size: ${item.product.size}`}
                      </div>
                    )}
                    <div
                      className={styles.quantity}
                    >{`Qty: ${item.quantity}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
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
            {renderOrderWithTrackTrail(item, i)}
          </div>
        );
      })}
    </div>
  );
};

export default TrackDetails;
