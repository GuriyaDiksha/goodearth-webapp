import React, { useState, useEffect } from "react";
import moment from "moment";
import { OrdersProps } from "./typings";
import AccountService from "services/account";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import cs from "classnames";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import invoice from "../../../../images/invoice.svg";
import invoiceDisabled from "../../../../images/invoiceDisabled.svg";
import { displayPriceWithCommasFloat } from "utils/utility";
import Button from "components/Button";

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
    AccountService.fetchOrderBy(dispatch, id, props.email || "").then(
      (data: any) => {
        const res = data.results?.[0];
        if (res.voucherDiscounts?.length > 0) {
          for (let i = 0; i < res.voucherDiscounts.length; i++) {
            for (let j = 0; j < res.offerDiscounts.length; j++) {
              if (res.voucherDiscounts[i].name == res.offerDiscounts[j].name) {
                res.offerDiscounts.splice(j, 1);
              }
            }
          }
        }
        setOrderdata(res);
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

  const colorName = (value: string) => {
    let cName = value
      .split("-")
      .slice(1)
      .join();
    if (cName[cName.length - 1] == "s") {
      cName = cName.slice(0, -1);
    }
    return cName;
  };

  const renderOrder = (item: any, index: number) => {
    const data: any = orderdata;
    const html = [],
      shippingAddress = data.shippingAddress[0],
      billingAddress = data.billingAddress[0];

    html.push(
      <div className={cs(styles.addressBlock, styles.myordersAddressblock)}>
        {/* Shipping Address */}
        {shippingAddress && !data?.isOnlyGiftOrder && (
          <div className={styles.address}>
            <div className={styles.title}>shipping address</div>
            {data.isBridalOrder && (
              <div className={styles.row}>
                <p className={styles.bridalInfo}>
                  {data.registrantName && !data.coRegistrantName && (
                    <p className={styles.para}>
                      {data.registrantName}&#39;s&nbsp;<br></br>
                      {data.occasion}&nbsp;Registry&nbsp;
                    </p>
                  )}
                  {data.registrantName && data.coRegistrantName && (
                    <p className={styles.para}>
                      {data.registrantName}&nbsp;&&nbsp;
                      {data.coRegistrantName}
                      &#39;s&nbsp;<br></br>
                      {data.occasion}&nbsp;Registry&nbsp;
                    </p>
                  )}
                </p>
                <p className={styles.bridalMessage}></p>

                <p className={styles.light1}>
                  Address predefined by registrant
                </p>
              </div>
            )}
            {!data.isBridalOrder ? (
              <div className={cs(styles.row, styles.name)}>
                {shippingAddress.firstName}
                &nbsp; {shippingAddress.lastName}
              </div>
            ) : (
              ""
            )}
            {!data.isBridalOrder ? (
              <div className={styles.row}>{shippingAddress.line1}</div>
            ) : (
              ""
            )}
            {!data.isBridalOrder ? (
              <div className={styles.row}>{shippingAddress.line2}</div>
            ) : (
              ""
            )}
            {!data.isBridalOrder ? (
              <div className={styles.row}>
                {shippingAddress.state},&nbsp;{shippingAddress.postcode}
              </div>
            ) : (
              ""
            )}
            {!data.isBridalOrder ? (
              <div className={styles.row}>{shippingAddress.countryName}</div>
            ) : (
              ""
            )}
            {!data.isBridalOrder ? (
              <div className={cs(styles.row, styles.phoneNumber)}>
                {shippingAddress.phoneNumber}
              </div>
            ) : (
              ""
            )}
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
    );

    {
      data?.lines.map((item: any) => {
        const isDiscount =
          +item.priceInclTax - +item.priceExclTaxExclDiscounts != 0;
        const amountPaid =
          +parseFloat(item.priceInclTax).toFixed(2) / +item.quantity;
        const price =
          +parseFloat(item.priceExclTaxExclDiscounts).toFixed(2) /
          +item.quantity;
        html.push(
          <div className={cs(styles.product)} key={item?.product?.id}>
            <div className={cs(styles.imageContainer)}>
              {item?.badge && (
                <img
                  className={cs(styles.badgeImage)}
                  src={item.badge}
                  alt="Badge"
                />
              )}
              {item?.product?.images[0]?.productImage && (
                <img
                  src={item.product.images[0].productImage}
                  alt="product image"
                />
              )}
            </div>
            <div className={cs(styles.productInfo)}>
              {item.product.collection && (
                <p className={cs(styles.collection)}>
                  {item.product.collection}
                </p>
              )}
              <p className={styles.title}>{item.title}</p>
              {item?.product?.badge_text && (
                <div
                  className={cs(
                    globalStyles.badgeContainer,
                    globalStyles.grey,
                    globalStyles.marginB10,
                    globalStyles.marginT5
                  )}
                >
                  {item?.product?.badge_text}
                </div>
              )}
              <p className={cs(styles.price)}>
                {item?.is_free_product ? (
                  <p className={styles.freePrice}>FREE</p>
                ) : (
                  <>
                    <span
                      className={cs(styles.amountPaid, {
                        [styles.gold]:
                          isDiscount || item?.product?.badgeType === "B_flat"
                      })}
                    >
                      {`${displayPriceWithCommasFloat(
                        amountPaid,
                        item.priceCurrency,
                        true,
                        false
                      )}`}
                    </span>
                    {isDiscount && (
                      <span className={styles.originalPrice}>
                        {`${displayPriceWithCommasFloat(
                          price,
                          item.priceCurrency,
                          true,
                          false
                        )}`}
                      </span>
                    )}
                  </>
                )}
              </p>
              {item.product.size && (
                <div className={styles.size}>
                  {`Size: ${item.product.size}`}
                </div>
              )}
              {item?.product?.colors?.length &&
              item?.product?.groupedProductsCount > 0 ? (
                <div className={styles.size}>
                  Color:{colorName(item.product?.colors?.[0])}
                </div>
              ) : null}
              <div className={styles.quantity}>{`Qty: ${item.quantity}`}</div>
            </div>
          </div>
        );
      });
    }

    html.push(
      <div className={styles.prices}>
        {/* Subtotal */}
        {!item?.isOnlyGiftOrder && (
          <div className={cs(styles.price, styles.price1)}>
            <span className={styles.label}>SUBTOTAL</span>
            <span className={styles.value}>
              {`${displayPriceWithCommasFloat(
                item.orderSubTotal,
                item.currency,
                true,
                false
              )}`}
            </span>
          </div>
        )}
        {/* offer discounts */}
        {!item?.isOnlyGiftOrder &&
          data.offerDiscounts?.map(
            (discount: { name: string; amount: string }, index: number) => {
              return (
                <div
                  className={cs(styles.price, styles.price3, styles.discount)}
                  key={index}
                >
                  <span className={styles.label}>{discount.name}</span>
                  <span className={styles.value}>
                    {`(-) ${displayPriceWithCommasFloat(
                      discount.amount,
                      item.currency,
                      true,
                      false
                    )}`}
                  </span>
                </div>
              );
            }
          )}
        {/* shipping and handling */}
        {!item?.isOnlyGiftOrder && (
          <div className={cs(styles.price, styles.price2)}>
            <span className={styles.label}>SHIPPING & HANDLING</span>
            <span className={styles.value}>
              {`(+) ${displayPriceWithCommasFloat(
                item.shippingInclTax,
                item.currency,
                true,
                false
              )}`}
            </span>
          </div>
        )}
        <div className={cs(styles.price, styles.price2)}>
          <span className={styles.label}>TOTAL</span>
          <span className={styles.value}>
            {`${displayPriceWithCommasFloat(
              data?.subTotalWithShipping,
              item.currency,
              true,
              false
            )}`}
          </span>
        </div>
        {/* voucher discounts */}
        {data.voucherDiscounts?.map((vd: any, i: number) => {
          return (
            <div
              className={cs(styles.price, styles.price3, styles.discount)}
              key={i}
            >
              <span className={styles.label}>{vd.name}</span>
              <span className={styles.value}>
                {`(-) ${displayPriceWithCommasFloat(
                  vd.amount,
                  item.currency,
                  true,
                  false
                )}`}
              </span>
            </div>
          );
        })}
        {/* giftcard and credit note */}
        {data.giftVoucherRedeemed?.map((gccn: number, i: number) => {
          return (
            <div
              className={cs(styles.price, styles.price3, styles.discount)}
              key={i}
            >
              <span className={styles.label}>{Object.keys(gccn)?.[0]}</span>
              <span className={styles.value}>
                {`(-) ${displayPriceWithCommasFloat(
                  Object.values(gccn)?.[0],
                  item.currency,
                  true,
                  false
                )}`}
              </span>
            </div>
          );
        })}
        {/* Loyalty Points */}
        {data.loyalityPointsRedeemed?.map((point: number, i: number) => {
          return (
            <div
              className={cs(styles.price, styles.price3, styles.discount)}
              key={i}
            >
              <span className={styles.label}>Cerise Points</span>
              <span className={styles.value}>
                {`(-) ${displayPriceWithCommasFloat(
                  point,
                  item.currency,
                  true,
                  false
                )}`}
              </span>
            </div>
          );
        })}
        {/* amount paid */}
        <div className={cs(styles.price, styles.total)}>
          <span className={styles.label}>
            AMOUNT PAID
            {/* <span className={styles.light}>Incl. Tax</span> */}
          </span>
          <span className={styles.value}>
            {`${displayPriceWithCommasFloat(
              item.totalInclTax,
              item.currency,
              true,
              false
            )}`}
          </span>
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
                  <div
                    className={cs(styles.orderData, {
                      [styles.singleOrder]: isopenOrderIndex == i
                    })}
                  >
                    <div className={styles.info}>
                      <div className={styles.row}>
                        <div className={cs(styles.data, styles.date)}>
                          {moment(item.datePlaced).format("D MMM, YYYY")}
                        </div>
                      </div>
                      <div className={styles.row}>
                        <span className={styles.label}> Status: </span> &nbsp;
                        <span className={styles.data}>
                          {item.status === "Manual Cancelled"
                            ? "Cancelled"
                            : item?.status}
                        </span>
                      </div>
                      <div className={styles.row}>
                        <span className={styles.label}> Items: </span> &nbsp;
                        <span className={styles.data}>{item.itemCount}</span>
                      </div>
                    </div>
                    <div className={styles.amountPaid}>
                      <span className={styles.label}>Amount Paid</span>
                      <span className={styles.data}>
                        {displayPriceWithCommasFloat(
                          item.totalInclTax,
                          item.currency,
                          true,
                          false
                        )}
                      </span>
                    </div>
                  </div>
                  {isopenOrderIndex == i ? renderOrder(item, i) : null}
                  {/* Actions */}
                  <div className={styles.actions}>
                    <p className={styles.action}>
                      {isopenOrderIndex == i ? (
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
            <Button
              variant="outlineSmallMedCharcoalCta"
              label="Load More"
              onClick={() => fetchOrders(pagination?.next)}
            />
          ) : data.length >= 3 ? (
            <Button
              variant="outlineSmallMedCharcoalCta"
              label="Back to top"
              onClick={() => backToTop()}
            />
          ) : (
            ""
          )}
        </div>
      ) : null}
    </div>
  );
};

export default OnlineOrders;
