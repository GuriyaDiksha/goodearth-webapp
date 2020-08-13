import React from "react";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "reducers/typings";
import LoginService from "services/login";

const Faq: React.FC = () => {
  const { isLoggedIn } = useSelector((state: AppState) => state.user);
  const dispatch = useDispatch();

  return (
    <div className={styles.terms}>
      <h3 id="faq">FAQs - Cerise </h3>
      <div>
        <h5>ABOUT THE PROGRAM</h5>
        <div>
          <h5>What is Cerise?</h5>
          <p>
            {" "}
            Cerise is an omni-channel loyalty program by Good Earth. Customers
            shopping for more than Rs 1 lac in a year are automatically enrolled
            as Cerise members and earn 10% of their purchase value going forward
            as Cerise Points redeemable across Good Earth stores and web
            boutique. Value of one Cerise Point is INR 1/-.{" "}
          </p>
          <p>
            {" "}
            Once a customer reaches the milestone of Rs 5 lac (or above) spent
            in one year, the customer becomes a Cerise Sitara member and starts
            earning 15% of their purchase value as Cerise points along with a
            host of other experiential benefits.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>What does Cerise mean?</h5>
          <p>
            Cerise is the jewel shade of rose-red and has been iconic to Good
            Earth’s brand journey of over two decades. Some of our most admired
            products—and even our brand logo—are in the colour Cerise. Hence, we
            chose to enlist our most valued customers in the ‘Cerise’ .
          </p>
        </div>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>ELIGIBILITY</h5>
        <h5>How do I join the Cerise program? </h5>
        <p>
          Good Earth customers* who make a purchase of INR 1 lac and above in a
          year (in INR only) are automatically enrolled into the Cerise program.
          As the program was launched on August 20<sup>th</sup>, 2019, purchases
          made post August 20<sup>th</sup> only shall be counted.
        </p>
        <p>
          For example, if you shopped for INR 30,000/- on July 1<sup>st</sup>{" "}
          2019 and INR 40,000/- on Aug 20<sup>th</sup>, 2019, only INR 40,000/-
          shall be considered, and you will need to shop for INR 60,000/- or
          more to enter the Cerise program.
        </p>
        <p>
          Your annual purchase value cycle starts the day you enter the program.
          For example, if you enter the program on Sep 1<sup>st</sup>, 2019,
          your membership will be valid till Aug 31<sup>st</sup> 2020. If you
          maintain the purchase value of Rs 1 lac and above between this time
          period, you will continue to be in the program for next year starting
          Sep 1<sup>st</sup>, 2020.
        </p>
      </div>
      <div className={globalStyles.voffset2}>
        <p>
          There are certain categories of purchases that are excluded from the
          Cerise program at present, mentioned below:
        </p>
        <ul>
          <li>All GST purchases</li>
          <li>Purchases made in USD and GBP currencies</li>
          <li>
            Purchases billed under names of organisations instead of individuals
          </li>
        </ul>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>How do I become a Cerise Sitara member? </h5>
        <p>
          To become a Cerise Sitara member, your annual purchase value at Good
          Earth must be INR 5 lacs or above. You can also become a Cerise Sitara
          member directly if your annual purchase value criterion is fulfilled
          by a single transaction
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>How is my annual purchase value being calculated?</h5>
        <p>
          Annual purchase value is the sum total of all your eligible Good Earth
          invoices (both online and in-store) generated post August 20
          <sup>th</sup>, 2019 or your first purchase at Good Earth (whichever
          happens later), excluding the amount paid through Gift Cards and
          Cerise Points redemption.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>ENROLLMENT</h5>
        <h5>
          Is it mandatory to share my email id and mobile number to become a
          Cerise member?
        </h5>
        <p>
          Yes, sharing email id is a mandatory pre-requisite to enter the Cerise
          program. In case you are already registered with us, the same email id
          shall be allocated to your Cerise account. You can use this email id
          to login into your Good Earth account and check your Cerise points’
          balance. If you would like to receive instant updates on your Cerise
          points, redemption OTPs, and other relevant information on the program
          via SMS, sharing your mobile number is recommended.
        </p>
        <p>
          {" "}
          Sharing other personal information like your mailing address, date of
          birth, and gender is not mandatory but recommended, so we can create a
          more personalized shopping experience for you.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>
          My Good Earth profile has more than one email id, mobile number, and
          address. Which one would be used for Cerise related communication?
        </h5>
        <p>
          Your default email id, mobile number, and address shall be
          automatically associated with your Cerise account. Except your email
          id, you can edit your mobile number and address for your Cerise
          account in the{" "}
          <Link
            to={isLoggedIn ? "/account/profile" : ""}
            className={globalStyles.pointer}
            onClick={e => {
              !isLoggedIn && LoginService.showLogin(dispatch);
            }}
          >
            My Profile{" "}
          </Link>
          section at any time.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>YOUR CERISE ACCOUNT AT GOOD EARTH</h5>
        <h5>How do I manage my Cerise account?</h5>
        <p>
          Once you are signed in online with your registered email address, you
          can view and manage the details of your Cerise account through the
          Cerise tab in the{" "}
          <Link
            to={isLoggedIn ? "/account/profile" : ""}
            className={globalStyles.pointer}
            onClick={e => {
              !isLoggedIn && LoginService.showLogin(dispatch);
            }}
          >
            My Profile{" "}
          </Link>{" "}
          section.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>
          How can I keep track of how many points I have earned or redeemed?
        </h5>
        <p>
          We will send you monthly statements on the Cerise points you have
          earned and redeemed to date. You can also check your points balance
          online through the{" "}
          <Link
            to={isLoggedIn ? "/account/profile" : ""}
            className={globalStyles.pointer}
            onClick={e => {
              !isLoggedIn && LoginService.showLogin(dispatch);
            }}
          >
            My Profile{" "}
          </Link>{" "}
          section.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>
          How soon will my Cerise points balance be updated after a purchase?
          Can I redeem the points earned from a purchase on the same day itself?
        </h5>
        <p>
          Cerise points earned or redeemed for a purchase shall reflect in your
          Cerise account within 24 hours after your purchase. So, redemption on
          the same day is not possible.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>
          Can I transfer my points to another person or exchange them for cash?
        </h5>
        <p>
          Points are non-transferable and not exchangeable for cash. The points
          can only be used to make purchases at Good Earth stores and web
          boutique.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>
          Can I earn or redeem Cerise points on an online purchase made using an
          email id different from my registered email id?
        </h5>
        <p>
          Your registered email id is your unique identity for us. And hence,
          the points you accumulate or redeem on one email id cannot be accessed
          by another email id.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>What is the validity of my Cerise points?</h5>
        <p>
          Cerise points earned are valid for 12 months from the date they are
          earned on a rolling basis. This means that while you accumulate points
          each time you shop, the points that you earn on a particular date are
          valid for a period of next 12 months. For example, if you have earned
          50 Cerise points on September 20<sup>th</sup>, 2019, they are valid
          till September 19<sup>th</sup>, 2020. However, if your membership
          expires before the points expiry, all unused Cerise points shall
          expire automatically.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>What is the validity of my Cerise membership?</h5>
        <p>
          Your membership is valid for a period of 12 months from the date you
          acquire the membership. For example, if you enter the program as a
          Cerise member on Aug 20<sup>th</sup>, 2019, you will continue to earn
          and redeem points on all your purchases till Aug 19<sup>th</sup>,
          2020.
        </p>
        <p>Scenario 1</p>
        <p>
          During this one year, if you maintain your annual purchase value
          between Rs 1lac – 4.9lac, your membership will be renewed once again
          on Aug 20<sup>th</sup>, 2020 till Aug 19<sup>th</sup>, 2021. If your
          annual purchase value crosses 5 lac, you will automatically become a
          Cerise Sitara member.
        </p>
        <p>Scenario 2</p>
        <p>
          In case your annual purchase value between Aug 20th, 2019 and Aug
          19th, 2020 is less than Rs 1 lac, your membership shall expire on Aug
          20th, 2020. You will not earn any Cerise points from this date
          onwards. All unused Cerise points in your membership account will
          automatically expire.
        </p>
        <p>
          If your Cerise Sitara membership expires but your annual purchase
          value is between Rs 1lac – 5 lacs, you will continue to be in the
          program as a Cerise member.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>Can I earn or redeem my Cerise points at Good Earth cafes?</h5>
        <p>
          No, the program is valid for Good Earth shops and web boutique only.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>POINTS ACCUMULATION</h5>
        <h5>How do I earn points once I am enrolled in the program?</h5>
        <p>
          Out of your total purchase value, you earn 10% as a Cerise member, and
          15% as a Cerise Sitara member, as Cerise points. This happens every
          time you shop for Good Earth Home, Sustain, or Spa products at any of
          our shops or web boutique.
        </p>
        <p>
          {" "}
          Apart from this, there might be bonus point promotional events where
          you get an opportunity to earn additional points, over and above.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>Do I earn Cerise points if I buy a discounted product?</h5>
        <p>
          No, Cerise points can’t be earned on discounted products or while
          using a discount promo code in case of online purchases.
        </p>
        <p>
          {" "}
          However, you can always redeem your Cerise points on discounted
          products.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>
          Do I earn Cerise points on all non-discounted products available in
          Good Earth shops and web boutique?
        </h5>
        <p>
          Certain brands available at Good Earth stores are excluded from the
          Cerise program. Please contact the store team or Cerise Customer Care
          to check further.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>Do I earn points when I redeem a Good Earth gift card?</h5>
        <p>
          No, Cerise points can’t be earned on the amount paid by using the Good
          Earth gift card. For example, If your total purchase value is INR
          20,000/-, and you choose to pay INR 10,000/- through a Good Earth gift
          card, you will earn Cerise points on INR 10,000/- only.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>Do I earn points when I buy a Good Earth gift card?</h5>
        <p>
          Yes, you will earn Cerise points on the purchase of a Good Earth gift
          card made on or after August 20<sup>th</sup>, 2019.
        </p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>What happens to my Cerise points if I make a return?</h5>
        <p>Once you return an item on which you had earned Cerise points:</p>
        <ul>
          <li>
            If you take a Credit Note of the same amount, your corresponding
            Cerise points remain as is.
          </li>
          <li>
            If you take a cash/bank account Refund, incase all items on the
            invoice are being returned,all Cerise points earned on the invoice
            shall be rolled back. If it’s a partial return, the rollback of
            Cerise points would also be partial.
          </li>
        </ul>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>Do I earn Cerise points on utilizing a Credit Note?</h5>
        <p>No, you will not earn points on utilizing a Credit Note.</p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>
          Do I earn Cerise points if I bill my purchase under my organisation’s
          name?
        </h5>
        <p>No, the Cerise program is valid for individual billing only.</p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>Do I earn Cerise points if I make a purchase in USD or GBP?</h5>
        <p>No, the Cerise program is valid only for purchases made in INR.</p>
      </div>
      <div className={globalStyles.voffset4}>
        <h5>Do I earn Cerise points on shipping charges?</h5>
        <p>No, you will not earn Cerise points on shipping charges.</p>
      </div>
      <div>
        <div className={globalStyles.voffset4}>
          <h5>POINTS REDEMPTION</h5>
          <h5>What is the value of 1 Cerise point?</h5>
          <p>Cerise Point = INR 1/-</p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Can I redeem my Cerise points on discounted products?</h5>
          <p>Yes, you can redeem your Cerise points on discounted products.</p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>
            Can I redeem my Cerise points on all products available in Good
            Earth shops and web boutique?
          </h5>
          <p>
            You can redeem your Cerise points on all products except Good Earth
            Gift Cards.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>
            {" "}
            If I return an item on which I had redeemed my Cerise points, do I
            get back those Cerise points in my account?
          </h5>
          <p>
            No, we will add the monetary value of your redeemed points to the
            Credit Note issued to you by Good Earth for the returned item. For
            example, If the value of the item is INR 10,000/-, and you paid
            INR/- 1000 by redeeming your Cerise points and INR 9000/- by another
            payment mode, at the time of return you will be issued a Credit Note
            worth INR 10,000/-.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>
            Can I redeem my Cerise points while making a purchase in USD or GBP?
          </h5>
          <p>No, the program is valid only for purchases made in INR.</p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Can I redeem Cerise points on shipping charges?</h5>
          <p>No, Cerise points can not be redeemed on shipping charges.</p>
        </div>
      </div>
    </div>
  );
};
export default Faq;
