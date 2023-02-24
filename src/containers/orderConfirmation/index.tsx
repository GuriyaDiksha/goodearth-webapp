import React, { useEffect, useState } from "react";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import { Link } from "react-router-dom";
import logoImage from "images/gelogoCerise.svg";
import flowerImage from "images/flower-motif.png";
import lockImage from "images/lock.svg";
import callImage from "images/call.svg";
import AccountServices from "services/account";
import { currencyCode, Currency } from "typings/currency";
import moment from "moment";
import { pageViewGTM } from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS, ANY_ADS } from "constants/cookieConsent";
import {
  displayPriceWithCommas,
  displayPriceWithCommasFloat
} from "utils/utility";

const orderConfirmation: React.FC<{ oid: string }> = props => {
  const {
    user: { email },
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const [confirmData, setConfirmData] = useState<any>({});
  const [charCurrency, setCharCurrency] = useState<any>({});
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

    const search = CookieService.getCookie("search") || "";
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
        item_list_name: search,
        item_variant: line.product.size || "",
        item_category4: "",
        price: line.isEgiftCard
          ? +line.priceExclTax
          : line.product.pricerecords[result.currency],
        quantity: line.quantity,
        dimension12: line.product?.color
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
        coupon: result.offerDisounts?.[0].name,
        dimension12: line.product?.color
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
          "Transaction ID": result.number,
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
            transaction_id: result.number,
            affiliation: productname, // Pass the product name
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
        const cookieString =
          "search=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie = cookieString;
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
      setCharCurrency(
        String.fromCharCode(...currencyCode[res.currency as Currency])
      );
      gtmPushOrderConfirmation(response.results?.[0]);
    });
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push(function(this: any) {
        this.reset();
      });
      pageViewGTM("OrderConfirmation");
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

  if (!confirmData?.number) {
    return <></>;
  }
  return (
    <div>
      <div className={cs(styles.subcHeader)}>
        <div className={cs(styles.logoContainer)}>
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
        <div className={styles.checkoutTitle}>
          <img src={lockImage} />
          <div className={styles.title}>{`CHECKOUT`}</div>
        </div>

        {!mobile && (
          <div className={styles.customerCare}>
            <img src={callImage} />
            <div
              className={styles.phoneNumber}
            >{`+91 9582 999 555 / +91 9582 999 888`}</div>
          </div>
        )}
      </div>

      <div className={cs(bootstrapStyles.row, styles.bgProfile, styles.os)}>
        <div
          className={cs(
            bootstrapStyles.col12,
            bootstrapStyles.colLg6,
            bootstrapStyles.offsetLg3,
            bootstrapStyles.colMd8,
            bootstrapStyles.offsetMd2,
            globalStyles.textCenter,
            styles.popupFormBg,
            styles.bgOrder
          )}
        >
          <div className={styles.motif}>
            <img src={flowerImage} width="120px" />
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
                <div className={styles.myOrderBlock}>
                  <label>order # {confirmData?.number}</label>
                  {/* Info */}
                  <div className={cs(styles.orderData, styles.singleOrder)}>
                    <div className={styles.info}>
                      <div className={styles.row}>
                        <div className={cs(styles.data)}>
                          {moment(confirmData?.datePlaced).format(
                            "MMM D, YYYY"
                          )}
                        </div>
                      </div>

                      <div className={styles.row}>
                        <span className={styles.label}> Items: </span>{" "}
                        <span className={styles.data}>{totalItem}</span>
                      </div>
                    </div>
                    <div className={styles.amountPaid}>
                      <span className={styles.label}>Amount Paid</span>
                      <span className={styles.data}>
                        {charCurrency}
                        &nbsp;{" "}
                        {displayPriceWithCommasFloat(
                          confirmData?.totalInclTax,
                          confirmData?.currency
                        )}
                      </span>
                    </div>
                  </div>
                  {/* Address    */}
                  <div className={cs(styles.addressBlock)}>
                    {shippingAddress && (
                      <div className={styles.address}>
                        <div className={styles.title}>shipping address</div>
                        {confirmData?.isBridalOrder && (
                          <div className={styles.row}>
                            <span className={styles.bridalInfo}>
                              {confirmData?.registrantName}
                              &nbsp; & &nbsp;{confirmData?.coRegistrantName}
                              {"'s "}
                              {confirmData?.occasion} Registry
                            </span>
                            <span className={styles.bridalMessage}></span>
                          </div>
                        )}
                        <div className={cs(styles.row, styles.name)}>
                          {shippingAddress.firstName}
                          &nbsp; {shippingAddress.lastName}
                        </div>
                        <div className={styles.row}>
                          {shippingAddress.line1}
                        </div>
                        <div className={styles.row}>
                          {shippingAddress.line2}
                        </div>
                        <div className={styles.row}>
                          {shippingAddress.state},&nbsp;
                          {shippingAddress.postcode}
                        </div>
                        <div className={styles.row}>
                          {shippingAddress.countryName}
                        </div>
                        <div className={cs(styles.row, styles.phoneNumber)}>
                          {shippingAddress.phoneNumber}
                        </div>
                      </div>
                    )}
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
                  {confirmData?.deliveryInstructions ? (
                    <div className={cs(styles.deliveryInstructions)}>
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
                    const amountPaid =
                      +parseFloat(item.priceInclTax).toFixed(2) /
                      +item.quantity;
                    const price =
                      +parseFloat(item.priceExclTaxExclDiscounts).toFixed(2) /
                      +item.quantity;

                    return (
                      <div className={cs(styles.product)} key={item.order}>
                        <div className={cs(styles.imageContainer)}>
                          <img
                            src={item.product.images?.[0]?.productImage}
                            className={globalStyles.imgResponsive}
                          />
                        </div>
                        <div
                          className={cs(styles.productInfo, {
                            [styles.gc]: item.product?.structure == "GiftCard"
                          })}
                        >
                          <p className={cs(styles.title)}>{item.title}</p>
                          <p className={cs(styles.price)}>
                            <span
                              className={cs(styles.amountPaid, {
                                [styles.gold]: isdisCount
                              })}
                            >
                              {`${charCurrency} ${displayPriceWithCommas(
                                amountPaid,
                                confirmData.currency
                              )}`}
                            </span>
                            {isdisCount && (
                              <span className={styles.originalPrice}>
                                {`${charCurrency} ${displayPriceWithCommas(
                                  price,
                                  confirmData.currency
                                )}`}
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
                          {item.product?.structure == "GiftCard" && (
                            <div
                              className={cs(styles.quantity, styles.withData)}
                            >
                              Sent via Email:{" "}
                              <span>{item.egiftCardRecipient}</span>
                            </div>
                          )}
                          {!item.isEgiftCard && (
                            <div className={styles.size}>
                              {`Item Code: ${item.product.sku}`}
                            </div>
                          )}
                          {/* Estimated Delivery Time */}
                          {item.productDeliveryDate && !item.isEgiftCard && (
                            <div
                              className={cs(styles.quantity, styles.withData)}
                            >
                              Estimated Delivery Date:{" "}
                              <span className={styles.edd}>
                                {item.productDeliveryDate}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className={styles.prices}>
                    {/* Title */}
                    <div className={cs(styles.price, styles.title)}>
                      <span className={styles.label}>ORDER SUMMARY</span>
                    </div>
                    {/* Subtotal */}
                    <div className={cs(styles.price, styles.line)}>
                      <span className={styles.label}>SUBTOTAL</span>
                      <span className={styles.value}>
                        {`${charCurrency} ${displayPriceWithCommasFloat(
                          confirmData.orderSubTotal,
                          confirmData.currency
                        )}`}
                      </span>
                    </div>
                    {/* offer discounts */}
                    {confirmData.offerDiscounts?.map(
                      (
                        discount: { name: string; amount: string },
                        index: number
                      ) => {
                        return (
                          <div
                            className={cs(
                              styles.price,
                              styles.line,
                              styles.discount
                            )}
                          >
                            <span className={styles.label}>
                              {discount.name}
                            </span>
                            <span className={styles.value}>
                              {`(-)${charCurrency} ${displayPriceWithCommasFloat(
                                discount.amount,
                                confirmData.currency
                              )}`}
                            </span>
                          </div>
                        );
                      }
                    )}
                    {/* shipping and handling */}
                    <div className={cs(styles.price, styles.line)}>
                      <span className={styles.label}>SHIPPING & HANDLING</span>
                      <span className={styles.value}>
                        {`(+) ${charCurrency} ${displayPriceWithCommasFloat(
                          confirmData.shippingInclTax,
                          confirmData.currency
                        )}`}
                      </span>
                    </div>
                    {/* voucher discounts */}
                    {confirmData.voucherDiscounts?.map((vd: any, i: number) => {
                      return (
                        <div
                          className={cs(
                            styles.price,
                            styles.line,
                            styles.discount
                          )}
                        >
                          <span className={styles.label}>{vd.name}</span>
                          <span className={styles.value}>
                            {`(-)${charCurrency} ${displayPriceWithCommasFloat(
                              vd.amount,
                              confirmData.currency
                            )}`}
                          </span>
                        </div>
                      );
                    })}
                    {/* giftcard and credit note */}
                    {confirmData.giftVoucherRedeemed?.map(
                      (gccn: number, i: number) => {
                        return (
                          <div
                            className={cs(
                              styles.price,
                              styles.line,
                              styles.discount
                            )}
                          >
                            <span className={styles.label}>
                              Gift Card/Credit Note
                            </span>
                            <span className={styles.value}>
                              {`(-)${charCurrency} ${displayPriceWithCommasFloat(
                                gccn,
                                confirmData.currency
                              )}`}
                            </span>
                          </div>
                        );
                      }
                    )}
                    {/* Loyalty Points */}
                    {confirmData.loyalityPointsRedeemed?.map(
                      (point: number, i: number) => {
                        return (
                          <div
                            className={cs(
                              styles.price,
                              styles.line,
                              styles.discount
                            )}
                          >
                            <span className={styles.label}>Loyalty Points</span>
                            <span className={styles.value}>
                              {`(-)${charCurrency} ${displayPriceWithCommasFloat(
                                "" + point,
                                confirmData.currency
                              )}`}
                            </span>
                          </div>
                        );
                      }
                    )}
                    {/* amount paid */}
                    <div className={cs(styles.price, styles.total)}>
                      <span className={styles.label}>
                        AMOUNT PAID
                        {/* <span className={styles.light}>Incl. Tax</span> */}
                      </span>
                      <span className={styles.value}>
                        {`${charCurrency} ${displayPriceWithCommasFloat(
                          confirmData.totalInclTax,
                          confirmData.currency
                        )}`}
                      </span>
                    </div>
                  </div>
                  <Link to={"/"}>
                    <div className={styles.continueShopping}>
                      <div className={styles.charcoalBtn}>
                        continue shopping
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cs(styles.subcFooter)}>
        <div className={styles.checkoutTitle}>
          {!mobile && <span className={styles.title}>CURRENCY: </span>}{" "}
          <div
            className={styles.title}
          >{`${charCurrency} ${confirmData.currency}`}</div>
        </div>
        <div className={styles.customerCare}>
          <img src={callImage} />
          <div
            className={styles.phoneNumber}
          >{`+91 9582 999 555 / +91 9582 999 888`}</div>
        </div>
      </div>
    </div>
  );
};

export default orderConfirmation;
