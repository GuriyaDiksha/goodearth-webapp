import React, { useEffect, useState, Fragment } from "react";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import { Link } from "react-router-dom";
import logoImage from "images/gelogoCerise.svg";
import birdImage from "images/birdMotif.png";
import AccountServices from "services/account";
import { currencyCode, Currency } from "typings/currency";
import moment from "moment";

const orderConfirmation: React.FC<{ oid: string }> = props => {
  const {
    user: { email }
  } = useSelector((state: AppState) => state);
  const [confirmData, setConfirmData] = useState<any>({});
  const dispatch = useDispatch();

  const fetchData = async () => {
    // debugger
    const data: any = await AccountServices.fetchOrderBy(
      dispatch,
      props.oid,
      email.trim()
    );
    return data;
  };

  const gtmPushOrderConfirmation = (result: any) => {
    const formData = {
      OrderNumber: result.number,
      email: email,
      gaPush: true
    };

    const products = result.lines.map((line: any) => {
      return {
        name: line.title,
        id: line.product.sku,
        price: line.priceInclTax,
        brand: "Good Earth",
        category: line.product.collection,
        variant: line.product.size || "",
        quantity: line.quantity,
        coupon: result.offerDisounts?.[0].name
      };
    });
    if (result.pushToGA == false) {
      dataLayer.push({
        event: "purchase",
        ecommerce: {
          currencyCode: result.currency,
          purchase: {
            actionField: {
              id: result.number,
              affiliation: "Online Store",
              revenue: result.totalInclTax,
              tax: 0,
              shipping: result.shippingInclTax,
              coupon: result.offerDiscounts?.[0]?.name
            },
            products: products
          }
        }
      });
      AccountServices.setGaStatus(dispatch, formData);
    }
  };
  useEffect(() => {
    fetchData().then(response => {
      setConfirmData(response.results?.[0]);
      gtmPushOrderConfirmation(response.results?.[0]);
    });
  }, []);

  let totalItem = 0;
  for (let i = 0; i < confirmData.lines?.length; i++) {
    totalItem += confirmData.lines[i].quantity;
  }
  const shippingAddress = confirmData.shippingAddress?.[0],
    billingAddress = confirmData.billingAddress?.[0];

  return (
    <div>
      <div className={cs(bootstrapStyles.row, styles.subcHeader)}>
        <div
          className={cs(
            bootstrapStyles.col12,
            bootstrapStyles.colMd2,
            styles.logoContainer
          )}
        >
          <Link to="/">
            <img className={styles.logo} src={logoImage} />
          </Link>
        </div>
      </div>

      <div className={cs(bootstrapStyles.row, styles.bgProfile, styles.os)}>
        <div
          className={cs(
            bootstrapStyles.col12,
            bootstrapStyles.colMd6,
            bootstrapStyles.offsetMd3,
            globalStyles.textCenter,
            styles.popupFormBg,
            styles.bgOrder
          )}
        >
          <div className={styles.motif}>
            <img src={birdImage} width="120px" />
          </div>

          <div className={bootstrapStyles.row}>
            <div
              className={cs(
                bootstrapStyles.col10,
                bootstrapStyles.offset1,
                bootstrapStyles.colMd8,
                bootstrapStyles.offsetMd2
              )}
            >
              <div className={styles.heading}>Order Confirmation</div>
              <div className={styles.subHeading}>
                Congratulations, Your order has been placed.
              </div>
            </div>
          </div>

          <div className={cs(bootstrapStyles.row, styles.white)}>
            <div
              className={cs(
                bootstrapStyles.col10,
                bootstrapStyles.offset1,
                bootstrapStyles.colMd8,
                bootstrapStyles.offsetMd2,
                globalStyles.voffset5
              )}
            >
              <div className={styles.add}>
                <address>
                  <label>order # {confirmData.number}</label>
                  <div className={cs(bootstrapStyles.row, styles.orderBlock)}>
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
                    >
                      <p>
                        {moment(confirmData.datePlaced).format("MMM D, YYYY")}
                      </p>

                      <p>
                        <span className={globalStyles.op3}> Items: </span>{" "}
                        {totalItem}
                      </p>
                    </div>
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
                    >
                      <p>
                        <span className={globalStyles.op3}>Order Total</span>
                      </p>

                      <p>
                        {String.fromCharCode(
                          currencyCode[confirmData.currency as Currency]
                        )}
                        &nbsp; {parseFloat(confirmData.totalInclTax).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className={cs(bootstrapStyles.row, styles.borderAdd)}>
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
                    >
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
                              {shippingAddress.state},{" "}
                              {shippingAddress.postcode} <br />
                              {shippingAddress.countryName}
                              <br />
                            </p>
                            <p> {shippingAddress.phoneNumber}</p>
                          </address>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
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
                              {billingAddress.line2}{" "}
                              {billingAddress.line2 && <br />}
                              {billingAddress.state}, {billingAddress.postcode}{" "}
                              <br />
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
                  {confirmData.lines?.map((item: any) => {
                    // according bakwas by gaurav
                    const isdisCount =
                      +item.priceInclTax - +item.priceExclTaxExclDiscounts != 0;
                    return (
                      <div
                        className={cs(
                          bootstrapStyles.row,
                          globalStyles.voffset2,
                          styles.borderAdd
                        )}
                        key={item.order}
                      >
                        <div
                          className={cs(
                            bootstrapStyles.col5,
                            bootstrapStyles.colMd3
                          )}
                        >
                          <img
                            src={item.product.images?.[0]?.productImage}
                            className={globalStyles.imgResponsive}
                          />
                        </div>
                        <div
                          className={cs(
                            bootstrapStyles.col7,
                            bootstrapStyles.colMd9
                          )}
                        >
                          <div
                            className={cs(
                              bootstrapStyles.imageContent,
                              globalStyles.textLeft
                            )}
                          >
                            <p className={cs(styles.productH)}></p>
                            <p className={cs(styles.productN)}>{item.title}</p>
                            <p
                              className={cs(styles.productN, globalStyles.flex)}
                            >
                              {isdisCount ? (
                                <span className={styles.discountprice}>
                                  {String.fromCharCode(
                                    currencyCode[item.priceCurrency as Currency]
                                  )}
                                  {+parseFloat(item.priceInclTax).toFixed(2) /
                                    +item.quantity}
                                  &nbsp;{" "}
                                </span>
                              ) : (
                                ""
                              )}
                              {isdisCount ? (
                                <span className={styles.strikeprice}>
                                  {String.fromCharCode(
                                    currencyCode[item.priceCurrency as Currency]
                                  )}
                                  {+parseFloat(
                                    item.priceExclTaxExclDiscounts
                                  ).toFixed(2) / +item.quantity}
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
                                    currencyCode[item.priceCurrency as Currency]
                                  )}
                                  &nbsp;{" "}
                                  {+parseFloat(
                                    item.priceExclTaxExclDiscounts
                                  ).toFixed(2) / +item.quantity}
                                </span>
                              )}
                            </p>
                            {item.product?.structure == "GiftCard" ? (
                              ""
                            ) : (
                              <Fragment>
                                <div
                                  className={cs(
                                    styles.smallSize,
                                    globalStyles.voffset2
                                  )}
                                >
                                  {item.product.size && (
                                    <>Size:&nbsp; {item.product.size}</>
                                  )}
                                </div>
                                <div className={styles.smallSize}>
                                  Qty:&nbsp; {item.quantity}
                                </div>
                              </Fragment>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </address>
              </div>
            </div>
          </div>

          <div className={bootstrapStyles.row}>
            <div
              className={cs(
                bootstrapStyles.col12,
                bootstrapStyles.colMd8,
                bootstrapStyles.offsetMd2,
                styles.cta,
                globalStyles.voffset2,
                globalStyles.ceriseBtn
              )}
            >
              <div className={globalStyles.ceriseBtn}>
                <Link to={"/"}> continue shopping </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default orderConfirmation;
