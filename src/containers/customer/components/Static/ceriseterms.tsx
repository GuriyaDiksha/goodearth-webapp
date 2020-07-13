import React from "react";
//import cs from "classnames";
// import { connect } from "react-redux";
//import globalStyles from "styles/global.scss";
//import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
// import { Link } from "react-router-dom";
import { Props } from "../../typings";

export default class CeriseTerms extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
  }

  render() {
    return (
      <div className={styles.terms}>
        <h3>Terms And Conditions</h3>
        <div>
          <ul>
            <li>
              The eligibility criteria to become a Cerise Club member is an
              annual spend of INR 1 lac - 4.99 lac. Customers with an annual
              spend of INR 5 lac and above are eligible to be part of Cerise
              Sitara. (exclusion: All GST purchases, purchases other than INR,
              discount, gift card redeemed value, Cerise points redeemed value)
            </li>
            <li>
              Purchases billed under organisation’s name are excluded from the
              Cerise program.
            </li>
            <li>
              You earn 10% Cerise points as a Cerise Club member and 15% as a
              Cerise Sitara member, on every purchase. These Cerise points can
              be redeemed on any purchase made at Good Earth shops or website
              after 24 hours.
            </li>
            <li>
              Cerise membership benefits are accrued only at Good Earth products
              purchased including Gift Cards at any of our shops or web
              boutique. Please contact the store team or Cerise Customer Care to
              check further.
            </li>
            <li>
              You will not earn Cerise points while redeeming a Gift Card and
              Cerise Points.
            </li>
            <li>
              Purchases made by utilizing Credit Notes are not eligible to earn
              points.
            </li>
            <li>
              Redemption of Gift cards and Cerise points shall be excluded from
              your eligible annual spend required for enrolling into the program
              or maintaining/upgrading the membership.
            </li>
            <li>
              No Cerise points will be earned on the purchase of discounted
              products, but points can be redeemed on the same.
            </li>
            <li> You will not earn Cerise points on shipping charges.</li>
            <li>
              Cerise points are earned and accumulated on a rolling basis. That
              means that while you will accumulate Cerise points for every
              purchase, the points earned for every purchase are valid for a
              period of 12 months from the date they are earned or membership
              expiry whichever is earlier.
            </li>
            <li>
              You can redeem as many Cerise points as you want on a single
              transaction out of your total available Cerise points balance.
              There is no minimum threshold limit for redemption. For example,
              if you have 5000 Cerise points in your account, you can choose to
              redeem as many out of these 5000 points on a single purchase.
            </li>
            <li>
              The membership is valid for a period of 12 months from the date of
              entitlement. All accrued benefits will lapse automatically once
              the membership expires.
            </li>
            <li>
              Accumulated Cerise points are non-transferable and cannot be used
              for any other purpose other than purchase at Good earth shops or
              web boutique.
            </li>
            <li>
              Cerise points cannot be redeemed or exchanged for cash or Gift
              Cards.
            </li>
            <li>
              The customer cannot combine rewards points with any other
              promotional coupon.
            </li>
            <li>
              At the time of redemption, please apply Cerise points before
              applying any other payment mode at checkout.
            </li>
            <li>
              Once the accumulated points have been redeemed against a purchase,
              the transaction is final, and the points cannot be rolled back
              into the Cerise account.
            </li>
            <li>
              In case of refund, if all items on the invoice are being returned,
              all Cerise points earned on the invoice shall be rolled back. If
              it’s a partial return, the rollback of Cerise points would also be
              partial. Instead if you take a credit note, you will retain your
              Cerise Points.
            </li>
            <li>
              Good earth reserves the right to amend, add, remove, and modify
              any of the terms &amp; conditions of this program at any time
              without prior notice to the members. Good earth will attempt to
              notify members of any changes but shall not be liable in any way
              for failure to do so.
            </li>
            <li>
              All disputes shall be settled in accordance to the law of India
              and subject to courts in Delhi.
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
