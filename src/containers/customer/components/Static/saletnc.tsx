import React, { useEffect } from "react";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { Props } from "../../typings";
const SaleTnc: React.FC<Props> = props => {
  useEffect(() => {
    props.setCurrentSection();
  }, []);

  return (
    <div className={styles.terms}>
      <h3>TERMS & CONDITIONS ANNUAL APPAREL SALE</h3>
      <h5>SALE PERIOD: August 27th to August 31st, 2020</h5>
      <div className={globalStyles.voffset2}>
        <ul>
          <li> All discounts/special pricing are valid till stock lasts.</li>
          <li>
            This sale is valid on Sustain Apparel and Gumdrop Apparel products
            only.
          </li>
          <li>
            Discounted products sold during the Sale period are not eligible for
            exchanges or returns.
          </li>
          <li>
            No other offer or discount can be clubbed with the running sale
            offers.
          </li>
          <li>
            All Valid gift cards and credit vouchers can be redeemed during the
            sale.
          </li>
          <li>
            Discounts may be changed during the Sale period without prior
            intimation. This is applicable to both domestic as well as
            international online prices. No claims due to this can be
            entertained.
          </li>
          <li>
            Due to increased number of orders,
            <ol>
              <li>
                We will not be providing the services of special packaging or
                gift wrapping during the Annual Sale period.
              </li>
              <li>
                The delivery time of your order may vary. Please check our
                shipping policies for details on the same.
              </li>
              <li>
                We will not be able to process any order cancellation, order
                amendment, and change in shipping or billing address.
              </li>
            </ol>
          </li>
          <li>
            Fulfillment of orders will be subject to product availability and
            within certified product quality parameters.
          </li>
          <li>
            In case a broken/damaged product is received, please reach out to{" "}
            <a href="mailto:customercare@goodearth.in">
              customercare@goodearth.in
            </a>{" "}
            within 48 hours of receipt of your order with order details.
          </li>
          <li>
            In case of any conflict with the standard Terms and Conditions
            mentioned on the website, the sale TnC will apply.
          </li>
          <li>
            For all online orders that cannot be partially/fully delivered, a
            refund will be initiated within 15 Calendar days from the
            confirmation of cancellation.
          </li>
          <li>
            All duties and taxes for international orders will apply as per the
            rules of the shipping destination and will be borne by the customer.
            Please refer to our shipping policies for more details.
          </li>
          <li>
            It’s our endeavor to ensure smooth online operations. However,
            during the Sale period, in case of any technical challenges faced,
            Our Customer Care Team will assist you accordingly.
          </li>
        </ul>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>Terms of Use Cerise</h5>
        <ul>
          <li> Please login with your credentials for Cerise Sales preview.</li>
          <li>
            {" "}
            You will not earn any Cerise points against purchase of discounted
            products.
          </li>
          <li>
            {" "}
            You may redeem your Cerise points during our sale at web boutique
            and in our stores.
          </li>
        </ul>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>ONLINE ANNUAL SALE FAQs</h5>
        <h5>ORDER ENQUIRIES</h5>
        <ul>
          <li>
            {" "}
            If I have received a damaged item during the Sale, would you offer
            to replace this item?
            <br />
            We will offer a replacement of the same item if we have available
            stocks at the time. Otherwise, we will offer you a credit voucher or
            refund of the same value within 15 days of your raising the concern
            with us. The voucher may be redeemed online or at our stores.
          </li>
          <li>
            {" "}
            If I place an order now, can you arrange the delivery after a period
            of time?
            <br />
            As long as the payment is made at the time of placing an order, we
            can ship it at a later time if the request is feasible for us.
          </li>
          <li>
            {" "}
            Can I reserve items and collect them from the shop at a later time?
            <br />
            we are unable to take reservation requests on any products during
            the Sale.
          </li>
          <li>
            Can I place my order online and then collect it from the shop?
            <br />
            You can place the order online with delivery location as the shop.
            The parcel will reach as per your address mentioned and you can
            collect it from our shop, following the delivery timeline.
          </li>
          <li>
            Can I place an order for items which are not in stock?
            <br />
            You can click on the “notify me” options and we will keep you duly
            informed once they are back in stock. you will not be allowed to
            place an order for items which are currently not in stock.
          </li>
          <li>
            Can I cancel my order, or can I change the size/items I have ordered
            for during the Annual Sale?
            <br />
            We do not provide the option of cancelling or modifying any orders
            during sale.
          </li>
        </ul>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>GENERAL ENQUIRIES</h5>
        <ul>
          <li>
            {" "}
            Do you have discounts in your shops too?
            <br />
            We have discounts in all our shops throughout the sale period. The
            merchandise on offer may vary based on location and availability of
            stock.
          </li>
          <li>
            {" "}
            Are the discount percentages the same in the shops too?
            <br />
            Yes, the discount percentages are the same for the same product sold
            online and offline.
          </li>
          <li>
            {" "}
            Will you replenish your stock before the end of Sale?
            <br />
            Replenishing stocks for the Sale is an ongoing process and happens
            as the need may be at a location. We request you to also watch out
            our social media space to be updated on new additions.
          </li>
          <li>
            What are your shop timings?
            <br />
            Due to Covid Guidelines varying at locations, we request you to
            check our shop locator page for shop timings and details, please
            visit https://www.goodearth.in/Store-Locations.
          </li>
          <li>
            Can I redeem E-Gift Cards or vouchers during the Sale?
            <br />
            Yes, you may certainly redeem E-Gift Cards online or at the shop
            during the Sale.
          </li>
          <li>
            Can I return or exchange sale items in your shops or online?
            <br />
            We do not have a return or exchange policy for sale items which have
            been delivered as per the order placed.
          </li>
          <li>
            Will you reduce the prices at the end of the Annual Sale?
            <br />
            We may revise the price of any product at any point of time.
          </li>
          <li>
            Can you arrange the delivery on priority or expedite delivery since
            I am leaving country?
            <br />
            We always try to deliver the order at the earliest, but we would not
            be able to accommodate any special requests during the sale period.
          </li>
        </ul>
      </div>

      <h3>THE JOY STORE</h3>
      {/* <h5>During Sale: February 13th - 16th, 2020</h5> */}
      <p>
        This Page will house Products on Discounted pricing till stock lasts.
        Few products will be sold in our shops also basis the stock
        availability. Please reach out to{" "}
        <a href="mailto:customercare@goodearth.in">customercare@goodearth.in</a>{" "}
        for assistance. Products on this page will keep changing, for more
        details read the specific T&C as mentioned below.
      </p>
      <div className={globalStyles.voffset2}>
        <ol>
          <li> The Joy Store Products pricing are valid till stock lasts.</li>
          <li>
            {" "}
            The Joy Store section is live only for Domestic deliveries (within
            India only).
          </li>
          <li>
            {" "}
            The Joy Store products are not eligible for cancellations, order
            amendments, exchanges or returns.
          </li>
          <li>
            {" "}
            No other offer or discount can be clubbed with The Joy Store
            merchandise.
          </li>
          <li>
            {" "}
            All Valid gift cards and credit vouchers can be redeemed on products
            listed under The Joy Store.
          </li>
          <li>
            {" "}
            The Joy Store Pricing can be changed without prior intimation for
            all currencies. No claims due to this can be entertained.
          </li>
          <li>
            {" "}
            Fulfillment of orders will be subject to product availability and
            within certified product quality parameters.
          </li>
          <li>
            {" "}
            In case a broken/damaged product is received, please reach out to{" "}
            <a href="mailto:customercare@goodearth.in">
              customercare@goodearth.in
            </a>{" "}
            within 48 hours of receipt of your order with order details.
          </li>
          <li>
            {" "}
            In case of any conflict with the standard Terms and Conditions
            mentioned on the website, The Joy store TnC will apply.
          </li>
          <li>
            {" "}
            For all online orders that cannot be partially/fully delivered, a
            refund will be initiated within 15 calendar days from the
            confirmation of cancellation.
          </li>
          <li>
            {" "}
            It’s our endeavor to ensure smooth online operations. However, in
            case of any technical challenges faced, our Customer Care Team will
            assist you accordingly.
          </li>
          <li> Please refer to our detailed TnC below for more clarity.</li>
        </ol>
      </div>

      {/* <div className={globalStyles.voffset4}>
        <h5>Terms of Use Cerise</h5>
        <ol>
          <li> Please login with your credentials for Cerise benefits.</li>
          <li>
            {" "}
            You will not earn any Cerise points against purchase of The Joy
            store products.
          </li>
          <li>
            {" "}
            You may redeem your Cerise points on purchase of the joy store
            products, both at web boutique and at stores.
          </li>
        </ol>
      </div> */}

      {/* <div className={globalStyles.voffset4}>
                <h4> ONLINE ANNUAL SALE FAQs</h4>
                <h5>ORDER ENQUIRIES</h5>
                <ol>
                    <li>
                        <strong> If I have received a damaged item during Annual Sale, would you offer to replace this item?
                        </strong> <br />
                        – We will offer a replacement of the same item if we have available stocks at the time. Otherwise, we will offer you a credit voucher of the same value within 15 days of your raising the concern with us. The voucher may be redeemed online or at our stores.
                    </li>
                    <li>
                        <strong>
                            If I place an order now, can you arrange the delivery after a period of time?
                        </strong>
                        <br />
                        – As long as the payment is made at the time of placing an order, we can ship it at a later time if the request is feasible for us.
                    </li>
                    <li>
                        <strong>
                            Can I reserve items and collect them from the shop at a later time?
                        </strong>
                        <br />
                        – We are unable to take reservation requests on any products during the Annual Sale.
                    </li>
                    <li>
                        <strong>
                            Can I place my order online and then collect it from the shop?
                        </strong>
                        <br />
                        – We request you to complete your transaction online, we will not be able to accommodate this request during the Annual Sale.
                    </li>
                    <li>
                        <strong>
                            Can I place an order for items which are not in stock?
                        </strong>
                        <br />
                        – You can click on the “notify me” options and we will keep you duly informed. You will not be allowed to place an order for items which are currently not in stock.

                    </li>
                    <li>
                        <strong>
                            Can I cancel my order, or can I change the size/items I have ordered for during the Annual Sale?
                        </strong>
                        <br />
                        – We do not provide the option of cancelling or modifying any orders during Annual sale.
                    </li>
                </ol>
            </div>

            <div className={globalStyles.voffset4}>
                <h5>GENERAL ENQUIRIES </h5>
                <ol>
                    <li>
                        <strong> Do you have discounts in your shops too?  </strong> <br />

                        – We have discounts in all our shops throughout our Annual sale period.
                    </li>
                    <li>
                        <strong>
                            Are the discount percentages the same in the shops too?
                        </strong> <br />

                        – Yes, the discount percentages are the same for the same product sold online and offline.
                    </li>
                    <li>
                        <strong> Will you replenish your stock before the end of the Annual Sale?   </strong> <br />

                        – Replenishing stocks for the Annual Sale is an ongoing process and happens as the need may be at a location.
                    </li>
                    <li>
                        <strong> What are your shop timings?   </strong> <br />

                        – Our shops are open from 11am-8pm IST, 7 days a week. To locate a shop near you, please visit &nbsp;
                        <a href="https://www.goodearth.in/Cafe-Shop/Delhi">
                        https://www.goodearth.in/Store-Locations</a>.
                    </li>
                    <li>
                        <strong> Can I redeem E-Gift Cards or vouchers during the Annual Sale?</strong>
                        <br />

                        – Yes, you may certainly redeem E-Gift Cards online during the Annual Sale.
                    </li>
                    <li>
                        <strong> Can I return or exchange sale items in your shops or online?  </strong> <br />

                        – We do not have a return or exchange policy for sale items which have been delivered as per the order placed.
                    </li>
                    <li>
                        <strong> Will you reduce the prices at the end of the Annual Sale?   </strong>
                        <br />

                        – We may revise the price of any product at any point of time.
                    </li>
                    <li>
                        <strong> Can you arrange the delivery on priority or expedite delivery since I am leaving country?  </strong> <br />

                        – We always try to deliver the order at the earliest, but we would not be able to accommodate any special requests during the sale period.
                    </li>
                </ol>
            </div> */}
    </div>
  );
};
export default SaleTnc;
