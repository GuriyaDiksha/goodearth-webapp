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
import * as util from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS, ANY_ADS } from "constants/cookieConsent";

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
      OrderNumber: result?.number,
      email: email,
      gaPush: true
    };
    const categoryname: string[] = [];
    const subcategoryname: string[] = [];
    const productid: string[] = [];
    const productname: string[] = [];
    const productprice: string[] = [];
    const productquantity: number[] = [];
    const items = result.lines.map((line: any, ind: number) => {
      const index = line.product.categories
        ? line.product.categories.length - 1
        : 0;
      const category =
        line.product.categories && line.product.categories[index]
          ? line.product.categories[index].replace(/\s/g, "")
          : "";
      const arr = category.split(">");

      return {
        item_id: line.product.sku, //Pass the product id
        item_name: line.title, // Pass the product name
        affiliation: line.title, // Pass the product name
        coupon: result.offerDisounts?.[0].name, // Pass the coupon if available
        currency: result.currency, // Pass the currency code
        discount: "", // Pass the discount amount
        index: ind,
        item_brand: "Goodearth",
        item_category: arr[arr.length - 2],
        item_category2: arr[arr.length - 1],
        item_category3: line.product.is3DView ? "3d" : "non 3d",
        item_list_id: "",
        item_list_name: "",
        item_variant: line.product.size || "",
        item_category4: "",
        price: line.isEgiftCard
          ? +line.priceExclTax
          : line.product.pricerecords[result.currency],
        quantity: line.quantity
      };
    });
    const products = result.lines.map((line: any) => {
      const index = line.product.categories
        ? line.product.categories.length - 1
        : 0;
      let category =
        line.product.categories && line.product.categories[index]
          ? line.product.categories[index].replace(/\s/g, "")
          : "";
      const arr = category.split(">");
      categoryname.push(arr[arr.length - 2]);
      subcategoryname.push(arr[arr.length - 1]);
      category = category.replace(/>/g, "/");
      productid.push(line.product.sku);
      productname.push(line.title);
      productprice.push(line.product.pricerecords[result.currency]);
      productquantity.push(+line.quantity);

      return {
        name: line.title,
        id: line.product.sku,
        price: line.isEgiftCard
          ? +line.priceExclTax
          : line.product.pricerecords[result.currency],
        dimension8: line.product.is3DView ? "View3d" : "nonView3d",
        brand: "Goodearth",
        category: category,
        variant: line.product.size || "",
        quantity: line.quantity,
        coupon: result.offerDisounts?.[0].name
      };
    });
    const categoryname2: string[] = [];
    const subcategoryname2: string[] = [];
    const productid2: string[] = [];
    const productname2: string[] = [];
    const productprice2: string[] = [];
    const productquantity2: number[] = [];
    const secondproducts = result.lines.map((line: any) => {
      const index = line.product.categories
        ? line.product.categories.length - 1
        : 0;
      let category =
        line.product.categories && line.product.categories[index]
          ? line.product.categories[index].replace(/\s/g, "")
          : "";
      const arr = category.split(">");
      categoryname2.push(arr[arr.length - 2]);
      subcategoryname2.push(arr[arr.length - 1]);
      category = category.replace(/>/g, "/");
      productid2.push(line.product.sku);
      productname2.push(line.title);
      productprice2.push(line.product.pricerecords[result.currency]);
      productquantity2.push(+line.quantity);
      return {
        "Product Name": line.title,
        "Product ID": line.product.sku,
        "Product Brand": "Goodearth",
        "Product Price": +line.priceExclTax,
        "Product Category": category,
        "Product Variant": line.product.size || "",
        "Product Quantity": line.quantity
      };
    });
    const fbProduct = result.lines.map((line: any) => {
      return {
        id: line.product.sku, //Pass the all purchased product object
        quantity: line.quantity
      };
    });
    if (result.pushToGA == false) {
      const userConsent = CookieService.getCookie("consent").split(",");
      if (userConsent.includes(GA_CALLS)) {
        dataLayer.push({
          event: "purchase",
          ecommerce: {
            currencyCode: result.currency,
            paymentMethod: result.paymentMethod,
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
        dataLayer.push({
          event: "customPurchaseSuccess",
          "Transaction ID": result.transactionId,
          Revenue: +result.totalInclTax,
          "Shipping Charges": +result.shippingInclTax,
          "Payment Method": result.paymentMethod,
          "Currency Code": result.currency,
          Products: secondproducts
        });
        dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        dataLayer.push({
          event: "checkout",
          currenyCode: result.currency,
          paymentMethod: result.paymentMethod,
          ecommerce: {
            checkout: {
              actionField: { step: 6, option: "Purchase Success" },
              products: products
            }
          }
        });
        dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
        dataLayer.push({
          event: "GA4_purchase",
          ecommerce: {
            transaction_id: result.transactionId,
            affiliation: "Online Store", // Pass the product name
            value: +result.totalInclTax,
            tax: 0,
            shipping: +result.shippingInclTax,
            currency: result.currency, // Pass the currency code
            coupon: result.offerDiscounts?.[0]?.name,
            items: items
          }
        });

        dataLayer.push({
          event: "fb_purchase",
          revenue: +result.totalInclTax,
          currencyCode: result.currency,
          contents: fbProduct
        });
      }
      if (userConsent.includes(ANY_ADS)) {
        Moengage.track_event("PurchasedOnline", {
          "Category Name": categoryname,
          "Sub category": subcategoryname,
          "Product name": productname,
          "Original price": productprice,
          "Product ID": productid2,
          Quantity: productquantity,
          "Cart Amount": +result.totalInclTax,
          "Coupon Code Applied": result.voucherCodeAppliedAmount[0]
            ? true
            : false,
          "Coupon Code Applied Name": result.voucherCodeAppliedName,
          "Loyalty Points Redeemed": result.loyalityPointsRedeemed,
          "Gift voucher redeemed": result.giftVoucherRedeemed,
          Currency: result.currency
        });
      }

      AccountServices.setGaStatus(dispatch, formData);
    }
  };
  useEffect(() => {
    fetchData().then(response => {
      const res = response.results?.[0];
      if (res.voucherDiscounts?.length > 0) {
        for (let i = 0; i < res.voucherDiscounts.length; i++) {
          for (let j = 0; j < res.offerDiscounts.length; i++) {
            if (res.voucherDiscounts[i].name == res.offerDiscounts[j].name) {
              res.offerDiscounts.splice(i, 1);
            }
          }
        }
      }
      setConfirmData(res);
      gtmPushOrderConfirmation(response.results?.[0]);
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push(function(this: any) {
        this.reset();
      });
      util.pageViewGTM("OrderConfirmation");
      dataLayer.push({
        event: "OrderConfirmationPageView",
        PageURL: location.pathname,
        Page_Title: "virtual_orderConfirmationPage_view"
      });
    }
    if (userConsent.includes(ANY_ADS)) {
      Moengage.track_event("Page viewed", {
        "Page URL": location.pathname,
        "Page Name": "OrderConfirmationPageView"
      });
    }
  }, []);

  let totalItem = 0;
  for (let i = 0; i < confirmData?.lines?.length; i++) {
    totalItem += confirmData.lines[i].quantity;
  }
  const shippingAddress = confirmData?.shippingAddress?.[0],
    billingAddress = confirmData?.billingAddress?.[0];

  // let giftCardAmount = 0;
  // for (let i = 0; i < confirmData.giftVoucherRedeemed?.length; i++) {
  //   giftCardAmount += confirmData.giftVoucherRedeemed[i];
  // }

  if (!confirmData?.number) {
    return <></>;
  }
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
            <img
              src={logoImage}
              style={{
                width: "111px",
                cursor: "pointer"
              }}
            />
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
                  <label>order # {confirmData?.number}</label>
                  <div className={cs(bootstrapStyles.row, styles.orderBlock)}>
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
                    >
                      <p>
                        {moment(confirmData?.datePlaced).format("MMM D, YYYY")}
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
                        <span className={globalStyles.op3}>Amount Payable</span>
                      </p>

                      <p>
                        {String.fromCharCode(
                          ...currencyCode[confirmData?.currency as Currency]
                        )}
                        &nbsp;{" "}
                        {parseFloat(confirmData?.totalInclTax).toFixed(2)}
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
                            {confirmData?.isBridalOrder ? (
                              <>
                                <p>
                                  {confirmData?.registrantName} &{" "}
                                  {confirmData?.coRegistrantName}&#39;s <br />
                                  {confirmData?.occasion} Registry
                                </p>
                                <p className={styles.light}>
                                  {" "}
                                  Address predefined by registrant
                                </p>
                              </>
                            ) : (
                              <>
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
                              </>
                            )}
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
                  {confirmData?.deliveryInstructions ? (
                    <div
                      className={cs(
                        bootstrapStyles.row,
                        globalStyles.voffset2,
                        styles.borderAdd,
                        styles.deliveryPadding
                      )}
                    >
                      <div className={styles.add}>
                        <p className={styles.delivery}>DELIVERY INSTRUCTIONS</p>
                        <p className={styles.light}>
                          {confirmData?.deliveryInstructions}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {confirmData?.lines?.map((item: any) => {
                    // according bakwas by gaurav
                    const isdisCount =
                      +item.priceInclTax - +item.priceExclTaxExclDiscounts != 0;
                    const price1 =
                      +parseFloat(item.priceInclTax).toFixed(2) /
                      +item.quantity;
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
                            bootstrapStyles.colMd9,
                            {
                              [styles.gc]: item.product?.structure == "GiftCard"
                            }
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
                                    ...currencyCode[
                                      item.priceCurrency as Currency
                                    ]
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
                                    ...currencyCode[
                                      item.priceCurrency as Currency
                                    ]
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
                                    ...currencyCode[
                                      item.priceCurrency as Currency
                                    ]
                                  )}
                                  &nbsp;{" "}
                                  {Number.isSafeInteger(+price3)
                                    ? price3
                                    : price3.toFixed(2) + ""}
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
                                {item.fillerMessage ? (
                                  <div className={styles.filler}>
                                    {`*${item.fillerMessage}`}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </Fragment>
                            )}
                          </div>
                          {item.product?.structure == "GiftCard" && (
                            <div className={globalStyles.textLeft}>
                              <p className={styles.label}>Sent via Email:</p>
                              <p className={styles.email}>
                                {item.egiftCardRecipient}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </address>
              </div>
            </div>
          </div>
          <div className={cs(bootstrapStyles.row, styles.white)}>
            <div className={cs(styles.priceSection)}>
              <div className={cs(styles.subTotalSection)}>
                <p>SUBTOTAL</p>
                <p>
                  {String.fromCharCode(
                    ...currencyCode[confirmData.currency as Currency]
                  )}
                  &nbsp; {parseFloat(confirmData.orderSubTotal).toFixed(2)}
                </p>
              </div>
              {/* Filter this key and remove vouchers */}
              {confirmData?.offerDiscounts?.map(
                (discount: { name: string; amount: string }, index: number) => (
                  <div className={cs(styles.discountSection)} key={index}>
                    <p>{discount.name}</p>
                    <p>
                      (-){" "}
                      {String.fromCharCode(
                        ...currencyCode[confirmData.currency as Currency]
                      )}
                      &nbsp; {parseFloat(discount.amount).toFixed(2)}
                    </p>
                  </div>
                )
              )}

              <div className={cs(styles.discountSection)}>
                <p>Shipping & Handling</p>
                <p>
                  (+){" "}
                  {String.fromCharCode(
                    ...currencyCode[confirmData.currency as Currency]
                  )}
                  &nbsp; {parseFloat(confirmData.shippingInclTax).toFixed(2)}
                </p>
              </div>

              {confirmData.voucherDiscounts.map((vd: any, i: number) => (
                <div
                  className={cs(styles.discountSection)}
                  key={`voucher_${i}`}
                >
                  <p>{vd.name}</p>
                  <p>
                    (-){" "}
                    {String.fromCharCode(
                      ...currencyCode[confirmData.currency as Currency]
                    )}
                    &nbsp; {parseFloat(vd.amount).toFixed(2)}
                  </p>
                </div>
              ))}

              {confirmData.giftVoucherRedeemed.map(
                (gccn: number, i: number) => (
                  <div className={cs(styles.discountSection)} key={`gccn_${i}`}>
                    <p>Gift Card/Credit Note</p>
                    <p>
                      (-){" "}
                      {String.fromCharCode(
                        ...currencyCode[confirmData.currency as Currency]
                      )}
                      &nbsp;{" "}
                      {parseFloat(confirmData.giftVoucherRedeemed).toFixed(2)}
                    </p>
                  </div>
                )
              )}

              {confirmData.loyalityPointsRedeemed.map(
                (gccn: number, i: number) => (
                  <div
                    className={cs(styles.discountSection)}
                    key={`loyalty_${i}`}
                  >
                    <p>Loyalty Points</p>
                    <p>
                      (-){" "}
                      {String.fromCharCode(
                        ...currencyCode[confirmData.currency as Currency]
                      )}
                      &nbsp;{" "}
                      {parseFloat(confirmData.loyalityPointsRedeemed).toFixed(
                        2
                      )}
                    </p>
                  </div>
                )
              )}

              <div className={cs(styles.subTotalSection)}>
                <p>AMOUNT PAYABLE</p>
                <p>
                  {String.fromCharCode(
                    ...currencyCode[confirmData.currency as Currency]
                  )}
                  &nbsp; {parseFloat(confirmData.totalInclTax).toFixed(2)}
                </p>
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
