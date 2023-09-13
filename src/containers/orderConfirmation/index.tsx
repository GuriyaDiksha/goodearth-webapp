import React, { useEffect, useState, Fragment } from "react";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import cs from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import { Link } from "react-router-dom";
import logoImage from "images/gelogoCerise.svg";
import BanarasMotifImage from "../../images/banaras-motif.png";
import AccountServices from "services/account";
import moment from "moment";
import * as util from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";
import { displayPriceWithCommasFloat } from "utils/utility";
import { Currency } from "typings/currency";

const orderConfirmation: React.FC<{ oid: string }> = props => {
  const {
    user: { email },
    address: { billingAddressId, shippingAddressId },
    info: { isSale }
  } = useSelector((state: AppState) => state);
  const [confirmData, setConfirmData] = useState<any>({});
  const dispatch = useDispatch();

  const fetchData = async () => {
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
      if (userConsent.includes(GA_CALLS)) {
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

    const productsData = result?.lines?.map((line: any, ind: any) => {
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
      productprice.push(line.product.pricerecords[result.currency as Currency]);
      productquantity.push(+line.quantity);

      return {
        item_id: line.product.sku,
        item_name: line.title,
        affiliation: "Pass the affiliation of the product",
        coupon: result.voucherDiscounts?.[0]?.voucher?.code, //Pass NA if not applicable at the moment
        discount: result?.offerDiscounts?.[0].name,
        index: ind,
        item_brand: "Goodearth",
        item_category: category,
        item_category2: line.product.size || "",
        item_category3: line.product.is3DView ? "3d" : "non3d",
        item_list_id: "NA",
        item_list_name: "NA",
        item_variant: "NA",
        price: line.isEgiftCard
          ? +line.priceExclTax
          : line.product.pricerecords[result.currency as Currency],
        quantity: line.quantity
      };
    });

    const userConsent = CookieService.getCookie("consent").split(",");
    const sameAsShipping = shippingAddressId === billingAddressId;

    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "purchase",
        billing_address: sameAsShipping
          ? "Same as Shipping Address"
          : billingAddressId,
        shipping_address: shippingAddressId,
        // gst_invoice: gstNo ? "Yes" : "No" ,
        // gift_wrap:giftwrap ? "Yes" : "No",
        gift_card_code: result.giftCards?.[0]?.cardId,
        whatsapp_subscribe: "",
        delivery_instruction: result.deliveryInstructions ? "Yes" : "No", //Pass NA if not applicable the moment
        ecommerce: {
          transaction_id: result.transactionId,
          currency: result.currency,
          value: result.totalInclTax,
          tax: 0,
          shipping: result.shippingInclTax,
          coupon: result.offerDisounts?.[0].name, //Pass NA if Not applicable at the moment
          payment_type: result.paymentMethod,
          items: productsData
        }
      });
    }
  };

  useEffect(() => {
    fetchData().then(response => {
      const res = response.results?.[0];
      if (res.voucherDiscounts?.length > 0) {
        for (let i = 0; i < res.voucherDiscounts.length; i++) {
          for (let j = 0; j < res.offerDiscounts.length; j++) {
            if (res.voucherDiscounts[i].name == res.offerDiscounts[j].name) {
              res.offerDiscounts.splice(j, 1);
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
    if (userConsent.includes(GA_CALLS)) {
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
            bootstrapStyles.colLg7,
            bootstrapStyles.offsetMd3,
            globalStyles.textCenter,
            styles.popupFormBg,
            styles.bgOrder
          )}
        >
          <div className={styles.motif}>
            <img src={BanarasMotifImage} width="106px" />
          </div>

          <div
            className={cs(bootstrapStyles.row, globalStyles.flexGutterCenter)}
          >
            <div className={cs(bootstrapStyles.col10, bootstrapStyles.colMd8)}>
              <div className={styles.heading}>Order Confirmation</div>
              <div className={styles.subHeading}>
                Congratulations, Your order has been placed.
              </div>
            </div>
          </div>

          <div className={cs(bootstrapStyles.row, styles.white)}>
            <div
              className={cs(
                bootstrapStyles.col11,
                bootstrapStyles.colMd8,
                styles.orderDetailsWrapper
              )}
            >
              <div className={styles.add}>
                <address>
                  <label>order # {confirmData?.number}</label>
                  <div
                    className={cs(
                      bootstrapStyles.row,
                      styles.orderBlock,
                      globalStyles.gutterBetween
                    )}
                  >
                    <div>
                      <p className={styles.orderDate}>
                        {moment(confirmData?.datePlaced).format("D MMM, YYYY")}
                      </p>

                      <p>
                        <span className={globalStyles.op3}> Items: </span>{" "}
                        {totalItem}
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className={globalStyles.op3}>Amount Paid</span>
                      </p>

                      <p>
                        {`${displayPriceWithCommasFloat(
                          parseFloat(confirmData?.totalInclTax),
                          confirmData.currency
                        )}`}
                        {/* {parseFloat(confirmData?.totalInclTax).toFixed(2)} */}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cs(
                      bootstrapStyles.row,
                      styles.borderAdd,
                      styles.orderAddress,
                      styles.rowGap30
                    )}
                  >
                    <div
                      className={cs(
                        bootstrapStyles.col12,
                        bootstrapStyles.colMd6
                      )}
                    >
                      <div
                        className={cs(styles.add, {
                          [styles.bridal]: confirmData?.isBridalOrder
                        })}
                      >
                        {shippingAddress ? (
                          <address className={styles.shippingAddressWrp}>
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
                                  {shippingAddress.state} <br />
                                  {shippingAddress.postcode} <br />
                                  {shippingAddress.countryName}
                                  <br />
                                </p>
                                <p className={styles.medium}>
                                  {" "}
                                  {shippingAddress.phoneNumber}
                                </p>
                              </>
                            )}
                          </address>
                        ) : (
                          ""
                        )}
                        {/* {confirmData?.isBridalOrder && (
                          <React.Fragment>
                            {" "}
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
                          </React.Fragment>
                        )} */}
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
                          <address className={styles.billingAddressWrp}>
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
                              {billingAddress.state}
                              <br />
                              {billingAddress.postcode} <br />
                              {billingAddress.countryName}
                              <br />
                            </p>
                            <p className={styles.medium}>
                              {" "}
                              {billingAddress.phoneNumber}
                            </p>
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
                        {/* commenting as per requirement */}
                        <p className={styles.light}>
                          {confirmData?.deliveryInstructions}
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div
                    className={cs(
                      bootstrapStyles.row,
                      globalStyles.voffset2,
                      styles.borderAdd,
                      styles.gap20
                    )}
                    // key={item.order}
                  >
                    {confirmData?.lines?.map((item: any) => {
                      // according bakwas by gaurav
                      const isdisCount =
                        +item.priceInclTax - +item.priceExclTaxExclDiscounts !=
                        0;
                      const price1 =
                        +parseFloat(item.priceInclTax).toFixed(2) /
                        +item.quantity;
                      const price2 =
                        +parseFloat(item.priceExclTaxExclDiscounts).toFixed(2) /
                        +item.quantity;
                      const price3 =
                        +parseFloat(item.priceExclTaxExclDiscounts).toFixed(2) /
                        +item.quantity;
                      const isFlat = item?.product?.badgeType === "B_flat";

                      return (
                        <div
                          className={cs(
                            bootstrapStyles.row,
                            styles.gap20,
                            styles.productItem
                          )}
                          key={item.order}
                        >
                          <div
                            className={cs(
                              bootstrapStyles.col4,
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
                              bootstrapStyles.colMd8,
                              {
                                [styles.gc]:
                                  item.product?.structure == "GiftCard"
                              }
                            )}
                          >
                            <div
                              className={cs(
                                bootstrapStyles.imageContent,
                                globalStyles.textLeft
                              )}
                            >
                              {item.title && (
                                <div className={cs(styles.productN)}>
                                  {item.title}
                                </div>
                              )}
                              {item.collection && (
                                <div className={cs(styles.collectionTitle)}>
                                  {item.collection}
                                </div>
                              )}
                              <p
                                className={cs(
                                  styles.productN,
                                  globalStyles.flex,
                                  globalStyles.marginT10,
                                  globalStyles.marginB10
                                )}
                              >
                                {isdisCount || isFlat ? (
                                  <span className={styles.discountprice}>
                                    {`${displayPriceWithCommasFloat(
                                      price1,
                                      confirmData.currency
                                    )}`}
                                    &nbsp;
                                  </span>
                                ) : (
                                  ""
                                )}
                                {isdisCount ? (
                                  <span className={styles.strikeprice}>
                                    {`${displayPriceWithCommasFloat(
                                      price2,
                                      confirmData.currency
                                    )}`}
                                    &nbsp;
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
                                    {`${displayPriceWithCommasFloat(
                                      price3,
                                      confirmData.currency
                                    )}`}
                                  </span>
                                )}
                              </p>

                              {item.product?.structure == "GiftCard" ? (
                                ""
                              ) : (
                                <Fragment>
                                  <div className={cs(styles.productDetails)}>
                                    {item.product.size && (
                                      <>Size:&nbsp; {item.product.size}</>
                                    )}
                                  </div>
                                  <div className={styles.productDetails}>
                                    Qty:&nbsp; {item.quantity}
                                  </div>
                                  <div className={styles.productDetails}>
                                    Item Code: {item.product.sku}
                                  </div>
                                  {!isSale && (
                                    <div className={styles.productDetails}>
                                      Delivery Estimated:{" "}
                                      <span>{item.productDeliveryDate}</span>
                                    </div>
                                  )}
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
                            {item.product.structure == "GiftCard" && (
                              <>
                                <div className={cs(styles.productSize)}>
                                  Recipient&apos;s Name:{" "}
                                  {item?.GcMeta?.recipeint_name}
                                </div>
                                <div className={cs(styles.productSize)}>
                                  Recipient&apos;s Email:{" "}
                                  {item?.GcMeta?.recipient_email}
                                </div>
                                <div className={cs(styles.productSize)}>
                                  Sender&apos;s Name:{" "}
                                  {item?.GcMeta?.sender_name}
                                </div>
                              </>
                            )}
                            {/* {item.product?.structure == "GiftCard" && (
                              <div className={globalStyles.textLeft}>
                                <p className={styles.label}>Sent via Email:</p>
                                <p className={styles.email}>
                                  {item.egiftCardRecipient}
                                </p>
                              </div>
                            )} */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </address>
              </div>
            </div>
          </div>
          <div
            className={cs(
              bootstrapStyles.row,
              styles.white,
              globalStyles.flexGutterCenter
            )}
          >
            <div
              className={cs(
                bootstrapStyles.col11,
                bootstrapStyles.colMd8,
                styles.priceSectionWrapper
              )}
            >
              <div className={cs(styles.priceSection)}>
                <div className={styles.orderSummaryTitle}>Order Summary</div>
                <div className={styles.subTotalSectionWrapper}>
                  <div className={cs(styles.subTotalSection)}>
                    <p>SUBTOTAL</p>
                    <p>
                      {`${displayPriceWithCommasFloat(
                        parseFloat(confirmData.orderSubTotal),
                        confirmData.currency
                      )}`}
                      {/* {parseFloat(confirmData.orderSubTotal).toFixed(2)} */}
                    </p>
                  </div>
                  {/* Filter this key and remove vouchers */}
                  {confirmData?.offerDiscounts?.map(
                    (
                      discount: { name: string; amount: string },
                      index: number
                    ) => (
                      <div className={cs(styles.discountSection)} key={index}>
                        <p>{discount.name}</p>
                        <p>
                          (-){" "}
                          {`${displayPriceWithCommasFloat(
                            parseFloat(discount.amount),
                            confirmData.currency
                          )}`}
                          {/* {parseFloat(discount.amount).toFixed(2)} */}
                        </p>
                      </div>
                    )
                  )}

                  <div
                    className={cs(
                      styles.discountSection,
                      styles.shippingSection
                    )}
                  >
                    <p>Shipping & Handling</p>
                    <p>
                      (+){" "}
                      {`${displayPriceWithCommasFloat(
                        parseFloat(confirmData.shippingInclTax),
                        confirmData.currency
                      )}`}
                      {/* {parseFloat(confirmData.shippingInclTax).toFixed(2)} */}
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
                        {`${displayPriceWithCommasFloat(
                          parseFloat(vd.amount),
                          confirmData.currency
                        )}`}
                        {/* {parseFloat(vd.amount).toFixed(2)} */}
                      </p>
                    </div>
                  ))}

                  {confirmData.giftVoucherRedeemed.map(
                    (gccn: number, i: number) => (
                      <div
                        className={cs(styles.discountSection)}
                        key={`gccn_${i}`}
                      >
                        <p>
                          {Object.keys(gccn)?.[0] === "GIFTCARD"
                            ? "GIFT CARD"
                            : "CREDIT NOTE"}
                        </p>
                        <p>
                          (-){" "}
                          {`${displayPriceWithCommasFloat(
                            parseFloat("" + Object.values(gccn)?.[0]),
                            confirmData.currency
                          )}`}
                          {/* {parseFloat("" + gccn).toFixed(2)} */}
                        </p>
                      </div>
                    )
                  )}

                  {confirmData.loyalityPointsRedeemed.map(
                    (gccn: number, i: number) => (
                      <div
                        className={cs(
                          styles.discountSection,
                          styles.loyaltySection
                        )}
                        key={`loyalty_`}
                      >
                        <p>CERISE POINTS</p>
                        <p>
                          (-){" "}
                          {`${displayPriceWithCommasFloat(
                            parseFloat(confirmData.loyalityPointsRedeemed),
                            confirmData.currency
                          )}`}
                          {/* {parseFloat(
                            confirmData.loyalityPointsRedeemed
                          ).toFixed(2)} */}
                        </p>
                      </div>
                    )
                  )}
                </div>
                <div className={cs(styles.totalSection, styles.totalWrp)}>
                  <p>TOTAL</p>
                  <p>
                    {displayPriceWithCommasFloat(
                      confirmData.subTotalWithShipping,
                      confirmData.currency
                    )}
                  </p>
                </div>
                <div className={cs(styles.totalSection)}>
                  <p>AMOUNT PAID</p>
                  <p>
                    {`${displayPriceWithCommasFloat(
                      parseFloat(confirmData.totalInclTax),
                      confirmData.currency
                    )}`}
                    {/* {parseFloat(confirmData.totalInclTax).toFixed(2)} */}
                  </p>
                </div>
              </div>
              <div
                className={cs(
                  bootstrapStyles.col12,
                  bootstrapStyles.colMd8,
                  styles.cta,
                  globalStyles.ceriseBtn
                )}
              >
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
