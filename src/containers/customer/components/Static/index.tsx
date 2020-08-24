import React from "react";
import cs from "classnames";
// import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
// import { Link } from "react-router-dom";
import { Props } from "../../typings";
import { Link } from "react-router-dom";

export default class Returns extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
  }

  render() {
    return (
      <div
        className={cs(
          bootstrapStyles.row,
          styles.hello,
          styles.terms,
          globalStyles.hello
        )}
      >
        <h3>Returns &amp; Exchanges</h3>
        <div>
          <p>
            Goodearth endeavors to ensure that every transaction at our website
            is seamless. We take great care in delivering our products and
            adhere to the highest quality standards.
          </p>
          <p>
            As a policy, we do not offer returns or exchanges on products which
            are delivered in perfect condition as per the order placed. However,
            if the product is wrongfully delivered (product doesn’t match the
            item in the order confirmation) or has a genuine
            quality/manufacturing defect then we are open to extending full
            refund or re-fulfilling your order.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>GENERAL</h5>
          <p>
            To return or exchange a product or report damage in transit, please
            get in touch with our Customer Care within 48 hours of delivery:
          </p>
          <ul>
            <li>
              by telephone at <span> +91 9582999555/888 </span> between 9.00 AM
              to 5.00 PM IST
            </li>
            <li>
              by email at&nbsp;
              <a href="mailto:customercare@goodearth.in">
                customercare@goodearth.in
              </a>
              &nbsp; with your order number, date of transaction, delivery
              address and image of the wrongfully delivered or defective item.
            </li>
            <li>
              Check the products carefully once you receive them and mention any
              tampering of the package, missing item or damage/ breakage on the
              delivery receipt presented by the courier partner.
            </li>
            <li>
              Retain the packaging of the damaged products received until our
              insurance adjuster visits to survey the breakage.
            </li>
          </ul>
          <p>
            Our customer care team will look into the issue and revert back
            within 48 working hours.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>EXCHANGE &amp; REFUND POLICY</h5>
          <ul>
            <li>
              Given the nature of our products, we reserve the sole discretion
              to provide the resolution to any situation as we deem fit. Each
              return or exchange request is handled on a case by case basis and
              we request you to get in touch with our team for prompt
              resolution.
            </li>
            <li>
              No refunds would be given if the customer has provided wrong or
              incomplete shipping address, there are 3 failed delivery attempts
              by our shipping agency and/or the package is refused by the
              recipient.
            </li>
            <li>
              In case of International Orders if a customer refuses to pay the
              Duty as mandated by the respective country of shipment and doesn’t
              collect his/her order from the Shipping agency (like DHL, Fedex
              etc.) , then Goodearth will not be liable to refund any amount for
              such orders.
            </li>
            <li>
              Products bought online cannot be exchanged or returned in store.
            </li>
            <li>
              Before accepting delivery of any merchandise, please ensure that
              it is in good condition and has not been tampered with. In case
              you receive a package, which you believe was damaged in transit,
              please retain the original packaging (along with price tags,
              invoices, labels etc.) until we send someone from our team to
              review it. Additionally, please mention details about the damaged
              merchandise on the delivery receipt instead of signing it as
              &#39;received&#39;.
            </li>
            <li>
              <Link
                className={globalStyles.linkTextUnderline}
                to="/customer-assistance/sales-conditions"
              >
                Refer for Sale related TnCs
              </Link>
            </li>
          </ul>
        </div>
        <div className={globalStyles.voffset4}>
          <p>
            <span>Disclaimer:</span> All policies are subject to change without
            prior notice. In case of any conflict Terms &amp; Conditions Policy
            would prevail.
          </p>
        </div>
      </div>
    );
  }
}
