import React from "react";
import cs from "classnames";
// import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import { Props } from "../../typings";
// import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { scrollToId, removeFroala } from "utils/validate";

export default class Privacy extends React.Component<
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
      // for handling scroll to particular element with id
      scrollToId();
      removeFroala();
    });
  }
  render() {
    // return (
    //   <div
    //     className={cs(
    //       bootstrapStyles.row,
    //       styles.hello,
    //       styles.terms,
    //       globalStyles.hello
    //     )}
    //   >
    //     <h3>privacy policy</h3>
    //     <div>
    //       <h5>USER INFORMATION AND PRIVACY</h5>
    //       <p>
    //         Goodearth Design Studio Pvt. Ltd (hereafter referred to as
    //         Goodearth) and/or its affiliates are committed to protecting all the
    //         information you share with us. We follow stringent procedures to
    //         protect the confidentiality, security, and integrity of data stored
    //         on our systems. Only those employees who need access to your
    //         information in order to perform their duties are allowed such
    //         access. Any employee who violates our privacy and/or security
    //         policies is subject to disciplinary action, including possible
    //         termination and civil and/or criminal prosecution, Goodearth’s top
    //         most priority is in protecting your confidential information and
    //         privacy.
    //       </p>
    //       <p>
    //         This privacy policy tells you how we use your personal information
    //         collected through the&nbsp;
    //         <Link to="/">&#34;www.goodearth.in&#34;</Link>. Please read this
    //         privacy policy before using the
    //         <Link to="/">&nbsp; &#34;www.goodearth.in&#34;</Link>&nbsp; or
    //         submitting any personal information. This policy will be updated
    //         subject to any changes in information collection, activities
    //         performed or any applicable regulations. You are encouraged to
    //         review the privacy policy whenever you visit the&nbsp;
    //         <Link to="/">&#34;www.goodearth.in&#34;</Link>&nbsp; to make sure
    //         that you understand how any personal information you provide will be
    //         used.
    //       </p>
    //       <p>
    //         <strong>Please Note:</strong>
    //       </p>
    //       <p>
    //         The privacy practices set forth in this privacy policy are for&nbsp;
    //         <Link to="/">&#34;www.goodearth.in&#34;</Link>&nbsp; only. If you
    //         link to other web sites, please review those privacy policies, which
    //         may be very different.
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Collection and use of information</h5>
    //       <h5>Collection of your information</h5>
    //       <p>
    //         Goodearth collects, processes, and retains information about you
    //         when you visit our&nbsp;
    //         <Link to="/">&#34;www.goodearth.in&#34;</Link>. You may choose to
    //         provide us with information, such as your name, email address,
    //         company information, street address, telephone number, or other
    //         information, to access protected information on&nbsp;
    //         <Link to="/">&#34;www.goodearth.in&#34;</Link>&nbsp; or so we can
    //         follow up with you after your visit. Personal Information may
    //         include, but is not limited to:
    //       </p>
    //       <ul>
    //         <li>Your name, </li>
    //         <li>Email addresses, </li>
    //         <li>Telephone numbers </li>
    //         <li>Country, City and State</li>
    //       </ul>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5> REGISTRATION</h5>
    //       <p>
    //         Goodearth keeps track of your information to offer you the best
    //         possible experience. A data subject has to provide email address is
    //         the mandatory Personal Information during registration (sign-up).
    //         Post this registration, Goodearth will be able to access your
    //         account every time you visit the Website. The customer also have to
    //         provide other Personal Information (instance - name, phone number,
    //         email, billing and shipping addresses) before completing the first
    //         purchase.
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>How we use your information</h5>
    //       <p>
    //         Any of the information we collect from you may be used in one of the
    //         following ways:
    //       </p>
    //       <ul>
    //         <li>
    //           <strong>To gather details about prospect customers:</strong>
    //           Your information helps us to more effectively respond to your
    //           requests and queries to make the application interface user
    //           friendly.
    //         </li>
    //         <li>
    //           <strong> To send periodic emails: </strong> Subject to your prior
    //           approval, we may use the information you share with us, to
    //           communicate with you through e-mails, text messages and calls, in
    //           order to provide our product or service related information and/or
    //           for promotional and marketing purposes.
    //         </li>
    //         <li>
    //           <strong>
    //             Select Content, Improve Quality and Facilitate Use of the other
    //             interface channels:
    //           </strong>
    //           Goodearth may use your Personal Information to help create and
    //           personalize content on our Channels, facilitate your use of the
    //           Channels (for example, to facilitate navigation and the login
    //           process, avoid duplicate data entry, enhance security, improve
    //           quality, track campaign and survey responsiveness and evaluate
    //           page response rates.
    //         </li>
    //         <li>
    //           <strong> Obtain Third Party Services: </strong> We also share
    //           Personal Information and Other Information with
    //           affiliates/subsidiaries and third parties who provide services to
    //           Goodearth website management, information technology and related
    //           infrastructure provision, customer service, e-mail delivery,
    //           auditing and other similar services. When Goodearth shares
    //           Personal Information with affiliates/subsidiaries, third party,
    //           service providers, we assure that they use your Personal
    //           Information and Other Information only for the purpose of
    //           providing services to us and subject to terms consistent with this
    //           policy.
    //         </li>
    //       </ul>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Fairness and Purpose</h5>
    //       <p>
    //         Goodearth will collect adequate, relevant and necessary Personal
    //         Information and will process such information fairly and lawfully
    //         for the purpose it is collected. The purpose of collection will be
    //         specified not later than at the time of data collection or on each
    //         occasion of change of purpose.
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Distribution of Information</h5>
    //       <h5>Information Disclosure</h5>
    //       <p>
    //         Goodearth does not share, sell, rent, or trade personal information
    //         collected through its&nbsp;
    //         <Link to="/">&#34;www.goodearth.in&#34;</Link>&nbsp; with third
    //         parties for their sole promotional purposes or as otherwise outlined
    //         in this Privacy Policy. Goodearth may share information with third
    //         party service providers contracted to provide services on our behalf
    //         for processing to provide your employment related services and
    //         benefits and other business purposes. These third party service
    //         providers may only use information we provide to them as requested
    //         and instructed by Goodearth.
    //       </p>
    //       <ul>
    //         <li>
    //           Goodearth may disclose your Personal Information as we believe to
    //           be necessary or appropriate:
    //           <ol>
    //             <li>
    //               under applicable law, including laws outside your country of
    //               residence;
    //             </li>
    //             <li>to comply with legal process;</li>
    //             <li>
    //               to respond to requests from public and government authorities,
    //               including public and government authorities outside your
    //               country of residence, for national security and/or law
    //               enforcement purposes;
    //             </li>
    //             <li>to enforce our terms and conditions; and</li>
    //             <li>
    //               to allow us to pursue available remedies or limit the damages
    //               that we may sustain.
    //             </li>
    //           </ol>
    //         </li>
    //         <li>
    //           Additionally, in the event of a reorganization, merger, sale,
    //           joint venture, assignment, transfer or other disposition of all or
    //           any portion of our business, assets or stock (including in
    //           connection with any bankruptcy or similar proceedings), we may
    //           transfer the Personal Information which we have collected to the
    //           affiliates/subsidiaries/ relevant third party.
    //         </li>
    //         <li>
    //           We may share information with governmental agencies or other
    //           companies assisting us in fraud prevention or investigation. We
    //           may do so when:
    //           <ol>
    //             <li>permitted or required by law; or,</li>
    //             <li>
    //               trying to protect against or prevent actual or potential fraud
    //               or unauthorized transactions; or,
    //             </li>
    //             <li>
    //               Investigating fraud which has already taken place. The
    //               information is not provided to these companies for marketing
    //               purposes.
    //             </li>
    //           </ol>
    //         </li>
    //       </ul>
    //       <p>
    //         We use the services of Amazon Web Services (herein referred to as
    //         “AWS”) for providing us the Cloud Services for our website&nbsp;
    //         <Link to="/">{`"www.goodearth.in"`}</Link>. Please read the privacy
    //         policy of AWS for further information&nbsp;
    //         <a
    //           href="https://aws.amazon.com/privacy/"
    //           target="_blank"
    //           rel="noopener noreferrer"
    //         >
    //           https://aws.amazon.com/privacy/
    //         </a>
    //         .
    //       </p>
    //       <p>
    //         If Goodearth goes through a business transition, such as a merger,
    //         acquisition by another company, or sale of all or a portion of its
    //         assets, the personal information collected from the customers (i.e.
    //         collected through our website(s) / retail stores) may be treated as
    //         an assets-transferred. Not having a retrospective effect, a notice
    //         will appear on our website(s) for 30 days after any such change in
    //         ownership or control of your personal information.
    //       </p>
    //       <p>
    //         To improve your Web experience, and to offer you products in which
    //         you might be interested, we provide links to business alliance
    //         companies, Goodearth dealers, and other third-party sites. When you
    //         click on these links, you will be transferred out of our Web site
    //         and connected to the Web site of the organization or company that
    //         you selected. Because Goodearth does not control these sites (even
    //         if an affiliation exists between our Web sites and a third party
    //         site), you are encouraged to review their individual privacy
    //         notices. If you visit a Web site that is linked to our sites, you
    //         should consult that site&#39;s privacy policy before providing any
    //         Customer Identifiable Information. Goodearth does not assume any
    //         responsibility or liability in elation with conduct of such third
    //         parties.
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Cross-Border Data Transfers</h5>
    //       <p>
    //         When conducting business, working on Company projects, or
    //         implementing new processes or systems, an operation may require the
    //         transfer of personal information to other entities or third parties
    //         that are located outside of the Goodearth operation’s country of
    //         business. While permissible data transfer mechanisms are defined by
    //         applicable law or regulation, examples include:
    //       </p>
    //       <ul>
    //         <li>
    //           a data transfer agreement with the party who will access or obtain
    //           the personal information;
    //         </li>
    //         <li>
    //           notice to and/or approval from a country’s local data protection
    //           authority; or
    //         </li>
    //         <li>
    //           notice to and/or consent from the individual whose data is to be
    //           transferred.
    //         </li>
    //       </ul>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Consent and Control</h5>
    //       <h5>Consent</h5>
    //       <p>
    //         Consent is often referred to as an individual’s choice to “opt-in”
    //         or “opt-out” of the Company’s use of personal information and is
    //         usually obtained by a “check box” or signature confirming the
    //         individual understands and agrees to the processing of their
    //         personal information. At times, express written consent from the
    //         individual may be required based on the information processing
    //         activity. Goodearth receives consent from individuals prior to:
    //       </p>
    //       <ul>
    //         <li>
    //           collecting, using, or processing their personal information,
    //           including sensitive personal information, in certain ways or
    //           sharing the individual’s personal information with any third
    //           party;
    //         </li>
    //         <li>
    //           transferring the individual’s personal information outside of the
    //           individual’s country of residence
    //         </li>
    //         <li>
    //           using or placing web cookies on an individual’s computer or other
    //           electronic devices.
    //         </li>
    //       </ul>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Control of your information</h5>
    //       <p>
    //         You may request to review, correct, update, suppress, or otherwise
    //         modify any of your Personal Information that you have previously
    //         provided to us through&nbsp;
    //         <Link to="/">&#34;www.goodearth.in&#34;</Link>, or object to the use
    //         or processing of such Personal Information by us. If you have
    //         concerns regarding access to or the correction of your Personal
    //         Information, please contact us at privacy contact information
    //         mentioned within Section 11 “Privacy Contact Information” of this
    //         policy. In your request, please make clear what Personal Information
    //         you would like to have changed, whether you would like to have your
    //         Personal Information that you have provided to us suppressed from
    //         our database or otherwise let us know what limitations you would
    //         like to put on our use of your Personal Information that you have
    //         provided to us.
    //       </p>
    //       <p>
    //         While the majority of questions and issues related to access can be
    //         handled quickly, complex requests may take more research and time.
    //         In such cases, issues will be addressed, or you will be contacted
    //         regarding the nature of the problem and appropriate next steps,
    //         within thirty days.
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Data Storage</h5>
    //       <p>
    //         Goodearth may transfer your information from&nbsp;
    //         <Link to="/">&#34;www.goodearth.in&#34;</Link>&nbsp; to other
    //         databases and store it on Goodearth or other supplier systems.
    //         Goodearth ensures appropriate security controls while storing data
    //         on its or its suppliers systems.
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Commitment to data security</h5>
    //       <p>
    //         Your personally identifiable information is kept secure. Only
    //         authorized employees, business partners, clients, vendors,
    //         affiliates/subsidiaries and other third party providers (who have
    //         agreed to keep information secure and confidential) have access to
    //         this information.
    //       </p>
    //       <p>
    //         Goodearth ensures that our supplier employs industry standard
    //         security measures to ensure the security of information through
    //         legally binding terms and conditions. However, users of our
    //         <Link to="/">&nbsp; &#34;www.goodearth.in&#34;</Link>&nbsp; are
    //         responsible for maintaining the security of any password, user ID,
    //         or other form of authentication involved in obtaining access to
    //         password protected or secure areas of any Workday websites. Access
    //         to and use of password protected and/or secure area of&nbsp;
    //         <Link to="/">&#34;www.goodearth.in&#34;</Link>&nbsp; is restricted
    //         to authorized users only. Unauthorized access to such areas is
    //         prohibited and may lead to criminal prosecution.
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Use of cookies</h5>
    //       <p>
    //         Like many other transactional websites, we use “cookies” to improve
    //         your shopping experience and to save you time. Cookies are little
    //         tags that we place onto your computer. We assign a cookie to your
    //         computer when you first visit us in order to enable us to recognize
    //         you each time you return. Through cookies we can customize our
    //         Website to your individual preferences in order to create a more
    //         personalized, convenient shopping experience. Please note that the
    //         cookies we use for our Website or email campaigns do not store
    //         personally identifiable information about you or your finances.
    //         Goodearth may offer certain features that are only available through
    //         the use of a “cookie”. Goodearth does not control the use of cookies
    //         by third parties and is not responsible for the same. Goodearth may
    //         in addition also offer certain features that are only available
    //         through the use of a “cookie”. For more information about cookies
    //         and its usage visit our&nbsp;
    //         <Link to="/customer-assistance/cookie-policy"> cookie policy </Link>
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Retention and disposal</h5>
    //       <p>
    //         Goodearth Personal information shall be retained only as long as
    //         necessary for the fulfillment of the stated purposes, and should be
    //         disposed thereafter. We will retain your information for as long as
    //         your account is active or as needed to provide you services. If you
    //         wish that we no longer use your information to provide you services,
    //         contact us via the information provided in section 11 of this
    //         privacy policy. We will respond to your request to within 30 days of
    //         receipt of the request. However, we may also retain and use your
    //         information as necessary to comply with our legal obligations,
    //         resolve disputes, and enforce our agreements.
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Your Consent</h5>
    //       <p>
    //         Your consent to personal data collection and processing may be
    //         revoked by notifying us via&nbsp;our contact page. For users below
    //         the age of 16, the consent should be provided by the holder of
    //         parental responsibility of the child.
    //       </p>
    //       <p>
    //         Please note, in case you (the customer) is not willing to provide
    //         consent or withdraw the consent at any given point of time,
    //         Goodearth shall not be able to provision the services as detailed
    //         above in section 2.2 of this policy.
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Privacy Contact Information</h5>
    //       <p>
    //         If you have any questions regarding our Privacy Statement or if you
    //         need to update, change or remove information, you can do so by
    //         contacting&nbsp;+91 9582 999 555 / +91 9582 999 888&nbsp;or by
    //         regular mail addressed to:&nbsp;
    //         <a href="mailto:customercare@goodearth.in">
    //           customercare@goodearth.in
    //         </a>
    //       </p>
    //     </div>
    //     <div className={globalStyles.voffset4}>
    //       <h5>Changes to the Privacy Policy</h5>
    //       <p>
    //         From time to time we may update this Privacy Policy without any
    //         prior notice. Your continued subscription to our Services
    //         constitutes an acceptance of the current Privacy Policy and Terms
    //         &amp; Conditions. Therefore, we encourage you to visit this page (
    //         <Link
    //           to="/customer-assistance/privacy-policy"
    //           onClick={() => {
    //             window.scroll(0, 0);
    //           }}
    //         >
    //           https://www.goodearth.in/customer-assistance/privacy-policy
    //         </Link>
    //         ) periodically to review any changes.
    //       </p>
    //     </div>
    //   </div>
    // );
    return (
      <div
        className={cs(
          bootstrapStyles.row,
          styles.hello,
          styles.terms,
          globalStyles.hello
        )}
      >
        {ReactHtmlParser(this.state.content)}
      </div>
    );
  }
}
