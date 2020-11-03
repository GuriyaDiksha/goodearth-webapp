import React, { useEffect, useState } from "react";
// import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { Props } from "../../typings";
import ReactHtmlParser from "react-html-parser";
import { removeFroala } from "utils/validate";

const SaleTnc: React.FC<Props> = props => {
  const [content, setContent] = useState("");

  useEffect(() => {
    props.setCurrentSection();
    props.fetchTerms().then(res => {
      setContent(res.content);
      removeFroala();
    });
  }, []);

  // return (
  //   <div className={styles.terms}>
  //     <h3>THE JOY STORE</h3>
  //     {/* <h5>During Sale: February 13th - 16th, 2020</h5> */}
  //     <p>
  //       This Page will house Products on Discounted pricing till stock lasts.
  //       Few products will be sold in our shops also basis the stock
  //       availability. Please reach out to{" "}
  //       <a href="mailto:customercare@goodearth.in">customercare@goodearth.in</a>{" "}
  //       for assistance. Products on this page will keep changing, for more
  //       details read the specific T&C as mentioned below.
  //     </p>
  //     <div className={globalStyles.voffset2}>
  //       <ol>
  //         <li> The Joy Store Products pricing are valid till stock lasts.</li>
  //         <li>
  //           {" "}
  //           The Joy Store section is live only for Domestic deliveries (within
  //           India only).
  //         </li>
  //         <li>
  //           {" "}
  //           The Joy Store products are not eligible for cancellations, order
  //           amendments, exchanges or returns.
  //         </li>
  //         <li>
  //           {" "}
  //           No other offer or discount can be clubbed with The Joy Store
  //           merchandise.
  //         </li>
  //         <li>
  //           {" "}
  //           All Valid gift cards and credit vouchers can be redeemed on products
  //           listed under The Joy Store.
  //         </li>
  //         <li>
  //           {" "}
  //           The Joy Store Pricing can be changed without prior intimation for
  //           all currencies. No claims due to this can be entertained.
  //         </li>
  //         <li>
  //           {" "}
  //           Fulfillment of orders will be subject to product availability and
  //           within certified product quality parameters.
  //         </li>
  //         <li>
  //           {" "}
  //           In case a broken/damaged product is received, please reach out to{" "}
  //           <a href="mailto:customercare@goodearth.in">
  //             customercare@goodearth.in
  //           </a>{" "}
  //           within 48 hours of receipt of your order with order details.
  //         </li>
  //         <li>
  //           {" "}
  //           In case of any conflict with the standard Terms and Conditions
  //           mentioned on the website, The Joy store TnC will apply.
  //         </li>
  //         <li>
  //           {" "}
  //           For all online orders that cannot be partially/fully delivered, a
  //           refund will be initiated within 15 calendar days from the
  //           confirmation of cancellation.
  //         </li>
  //         <li>
  //           {" "}
  //           It’s our endeavor to ensure smooth online operations. However, in
  //           case of any technical challenges faced, our Customer Care Team will
  //           assist you accordingly.
  //         </li>
  //         <li> Please refer to our detailed TnC below for more clarity.</li>
  //       </ol>
  //     </div>

  //     <div className={globalStyles.voffset4}>
  //       <h5>Terms of Use Cerise</h5>
  //       <ol>
  //         <li> Please login with your credentials for Cerise benefits.</li>
  //         <li>
  //           {" "}
  //           You will not earn any Cerise points against purchase of The Joy
  //           store products.
  //         </li>
  //         <li>
  //           {" "}
  //           You may redeem your Cerise points on purchase of the joy store
  //           products, both at web boutique and at stores.
  //         </li>
  //       </ol>
  //     </div>
  //   </div>
  // );
  return <div className={styles.terms}>{ReactHtmlParser(content)}</div>;
};
export default SaleTnc;
