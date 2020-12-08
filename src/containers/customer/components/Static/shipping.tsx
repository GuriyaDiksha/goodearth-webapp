import React from "react";
//import cs from "classnames";
// import { connect } from "react-redux";
// import globalStyles from "styles/global.scss";
//import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
// import { Link } from "react-router-dom";
import { Props } from "../../typings";
// import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { removeFroala } from "utils/validate";

export default class Shipping extends React.Component<
  Props,
  { content: string }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      content: ""
    };
    props.setCurrentSection();
  }
  componentDidMount() {
    this.props.fetchTerms().then(res => {
      this.setState({
        content: res.content
      });
      removeFroala();
    });
  }
  render() {
    // return (
    // <div className={styles.terms}>
    //   <h3>shipping &amp; payment</h3>
    //   <div>
    //     <p>
    //       We ship through registered courier companies for orders within India
    //       as well as international orders.
    //     </p>

    //     <p>International orders: delivered within 15-18 business days</p>
    //     <p>
    //       Domestic orders: delivered within 8-10 business days. (You will see
    //       the delivery date for your order at the time of order confirmation.)
    //     </p>
    //     <p>Pre-orders: delivery time will be within 60 days.</p>
    //     <p>
    //       *Please note that Saturdays, Sundays and Public Holidays are not set
    //       as working days for standard deliveries.
    //     </p>
    //     <p className={globalStyles.voffset4}>
    //       <Link
    //         className={globalStyles.linkTextUnderline}
    //         to="/customer-assistance/sales-conditions"
    //       >
    //         Refer for Joy Sale related TnCs
    //       </Link>
    //     </p>
    //   </div>
    //   <div className={globalStyles.voffset4}>
    //     <h5>shipping charges</h5>
    //     <p>
    //       Shipping and handling rates vary based on the product, its size and
    //       volume, the packaging used and the shipping destination. You will
    //       see the final shipping and handling charges at the time of checkout
    //       after you provide the shipping address for your order.
    //     </p>
    //     <p className={globalStyles.cerise}>
    //       Shipping is free for domestic orders above 50,000 INR.
    //     </p>
    //   </div>
    //   <div className={globalStyles.voffset4}>
    //     <h5 id="charges">DUTIES &amp; TAXES FOR INTERNATIONAL ORDERS</h5>
    //     <p>
    //       Duties &amp; Taxes for international orders are not included in your
    //       order, and are over and above any shipping and handling charges paid
    //       at checkout. Most countries charge duties on imported items which
    //       are levied at the time of port entry and they vary based on the
    //       destination country and the products imported. You will need to pay
    //       the applicable duties and taxes directly to the shipping agency
    //       (DHL, FedEx etc.) at the time of your order delivery after you
    //       receive an invoice by the shipping agent.
    //     </p>
    //   </div>
    //   <div className={globalStyles.voffset4}>
    //     <h5>SHIPPING OF PRODUCTS</h5>
    //     <p>
    //       All orders are processed from our own warehouse in Ballabhgarh,
    //       Haryana. Orders will be delivered to the shipping address mentioned
    //       at checkout.
    //     </p>
    //   </div>
    //   <div className={globalStyles.voffset4}>
    //     <h5>TRACKING PACKAGE</h5>
    //     <p>
    //       Orders that have been processed and shipped can be tracked using the
    //       consignment/tracking number on the shipping agency’s website. Once
    //       your order is shipped, we will mail you your tracking number along
    //       with information about the shipping agency. You can also track your
    //       order status on our web boutique, from the “Order Status” link under
    //       “Customer Assistance” in the website footer.
    //     </p>
    //   </div>
    //   <div className={globalStyles.voffset4}>
    //     <h5>NON-AVAILABILITY ON DELIVERY</h5>
    //     <p>
    //       Our delivery partners will attempt to deliver the package three
    //       times before they return it to us. Please provide the complete &amp;
    //       accurate shipping address including zip code and a mobile number.
    //       This will help us in delivering your order faster.
    //     </p>
    //   </div>
    //   <div className={globalStyles.voffset4}>
    //     <h5>MODES OF PAYMENT</h5>
    //     <p>
    //       For shipping to India, we accept all major debit &amp; credit cards
    //       (including Mastercard, Visa &amp; American Express) and also provide
    //       Net Banking options across major banks. For all international
    //       transactions, we accept major Credit Cards (including Mastercard,
    //       Visa &amp; American Express) and also provide the option to pay
    //       using PayPal. PayPal and PayU are our third party payment gateways.
    //     </p>
    //   </div>
    // </div>
    // );
    return (
      <div className={styles.terms}>{ReactHtmlParser(this.state.content)}</div>
    );
  }
}
