import React from "react";
import cs from "classnames";
// import { connect } from "react-redux";
import globalStyles from "styles/global.scss";
import bootstrapStyles from "../../../../styles/bootstrap/bootstrap-grid.scss";
import styles from "../styles.scss";
import { Props } from "../../typings";
import { Link } from "react-router-dom";

export default class Cookie extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    props.setCurrentSection();
  }

  render() {
    return (
      // <div className={cs(bootstrapStyles.row, styles.hello, styles.terms, globalStyles.hello)} >

      <div className={styles.terms}>
        <h3>cookie policy</h3>
        <div>
          <p>
            At Goodearth, we believe in being clear and open about how we
            collect and use data related to you. In the spirit of transparency,
            this policy provides detailed information about how and when we use
            Cookies. This Cookie policy applies to any Goodearth product or
            service that links to this policy or incorporates it by reference.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Does Goodearth use Cookies?</h5>
          <p>
            Goodearth uses Cookies, web-beacons and other technologies when you
            use any of the Goodearth websites, mobile sites or web pages/forms
            (collectively “the services”). Cookies are used to ensure everyone
            has their best possible experience. Cookies also help us keep your
            account safe. By continuing to visit or use our services, you are
            agreeing to the use of Cookies and similar technologies for the
            purposes we describe in this policy.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>What is a Cookie?</h5>
          <p>
            Cookies are text files containing small amounts of information which
            are automatically downloaded to your computer or device when you
            visit a website. Cookies send data back to the originating website
            on each subsequent visit, or shares data with another website that
            recognizes that Cookie. For example, Cookies enable us to identify
            your device, secure your access to Goodearth and our sites
            generally, and even help us know if someone attempts to access your
            account from a different device.
          </p>
          <p>
            Cookies can do other relevant jobs, like letting you navigate
            between pages efficiently, remembering your preferences and
            generally improving the user experience. They can also help to
            ensure that the advertisements you see online are more relevant to
            you and your interests.
          </p>
          <p>
            For further information on Cookies, including how to see what
            Cookies have been set on your device and how to manage and delete
            them, visit&nbsp;
            <a
              href="http://www.allaboutcookies.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://www.allaboutcookies.org
            </a>
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>What are Cookies used for?</h5>
          <p>
            Cookies can be used to recognize you when you visit Goodearth.in,
            remember your preferences, and give you a personalized experience
            that’s in line with your settings. Cookies also make your
            interactions with Goodearth faster and more secure. Additionally,
            Cookies allow us to bring you advertising both on and off the
            Goodearth sites, and bring customized features to you through
            Goodearth plugins.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Categories of Use:-</h5>
          <ul>
            <li>
              Authentication: If you have registered to Goodearth, Cookies help
              us show you the right information and personalize your experience.
            </li>
            <li>
              Security: We use Cookies to enable and support our security
              features, and to help us detect malicious activity and violations
              of our User Agreement.
            </li>
            <li>
              Preferences, features and services: Cookies can tell us which
              language you prefer and what your communications preferences are.
              They can help you fill out forms on Goodearth more easily. They
              also provide you with features, insights, and customized content
              in conjunction with our plugins. You can learn more about plugins
              in our Privacy Policy.
            </li>
            <li>
              Advertising: We may use Cookies to show you relevant advertising
              both on and off the Goodearth site. We may also use a Cookie to
              learn whether someone who saw an ad later visited and took an
              action (e.g. website account registration etc.) on the
              advertiser’s site. Similarly, our partners may use a Cookie to
              determine whether we’ve shown an ad and how it performed, or
              provide us with information about how you interact with ads. We
              may also work with a partner to show you an ad on or off
              Goodearth, such as after you’ve visited a partner’s site or
              application.
            </li>
            <li>
              Performance, Analytics and Research: Cookies help us learn how
              well our site and plugins perform in different locations. We also
              use Cookies to understand, improve, and research products,
              features, and services, including when you access Goodearth from
              other websites, devices such as your work computer, etc.
            </li>
          </ul>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>When does Goodearth place Cookies?</h5>
          <p>
            We use Cookies on our websites (such as Goodearth.in), mobile sites
            and mobile applications. Any browser visiting these sites will
            receive Cookies from us which helps us identify you more quickly
            when you return. We will not use &#34;Cookies&#34; or other devices
            to follow your click stream on the Internet generally, but will use
            them, and other devices, to determine which pages or information you
            find most useful or interesting at our own Web sites.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>What types of Cookies does Goodearth use?</h5>
          <p>
            We use Cookies of four categories: Session Cookies, Functionality
            Cookies, Analytical/Customization Cookies and Advertising Cookies.
          </p>
          <ul>
            <li>
              Session Cookies: Session Cookies enable the website you are
              visiting to keep track of your movement from page to page so you
              don&#39;t get asked for the same information you&#39;ve already
              given to the site. Cookies allow you to proceed through many pages
              of a site quickly and easily without having to authenticate or
              reprocess each new area you visit. These cookie lasts till the
              session is active, once the session is expired the cookie gets
              purged. (Usually the current visit to a website or a browser
              session).
            </li>
            <li>
              Functionality Cookies. These Cookies allow our Services to
              remember choices you make, such as: remembering your username,
              preferences and settings; remembering if you&#39;ve filled in a
              survey or taken part in a poll or contest or otherwise reacted to
              something on through the Services, so you&#39;re not asked to do
              it again; remembering if you&#39;ve used any of our Services
              before; restricting the number of time you are shown a particular
              advertisement; remembering your location; and enabling social
              media components like Facebook or Twitter. The aim of these
              Cookies is to provide you with a more personal experience so that
              you don&#39;t have to reset your preferences each time you use our
              Services.
            </li>
            <li>
              Analytical/Customization Cookies. These Cookies collect
              information about how visitors use and interact with our Services,
              for instance which pages they go to most often. These Cookies also
              enable us to personalize content and remember your preferences
              (e.g., your choice of language, country, or region). These Cookies
              helps us improve the way our websites work and provide a better,
              personalized user experience.
            </li>
            <li>
              Advertising Cookies. These Cookies record your visit to our
              websites, the pages you have visited, and the links you have
              clicked. They gather information about your browsing habits and
              remember that you have visited a website. We (and third-party
              advertising platforms or networks) may use this information to
              make our websites, content, and advertisements displayed on them
              more relevant to your interests (this is sometimes called
              &#34;behavioural&#34; or &#34;targeted&#34; advertising). These
              types of Cookies are also used to limit the number of times you
              see an advertisement as well as to help measure the effectiveness
              of advertising campaigns.
            </li>
          </ul>
          <p>
            To find out more about interest-based ads and your choices, visit
            these sites:&nbsp;
            <a
              href="http://optout.aboutads.info/?c=2&amp;lang=EN#!%2F"
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Advertising Alliance,
            </a>
            &nbsp;
            <a
              href="http://optout.networkadvertising.org/?c=1#!/"
              target="_blank"
              rel="noopener noreferrer"
            >
              the Network Advertising Initiative,
            </a>
            &nbsp; and&nbsp;
            <a
              href="http://www.youronlinechoices.eu/"
              target="_blank"
              rel="noopener noreferrer"
            >
              the Interactive Advertising Bureau (IAB) Europe.
            </a>
          </p>
          <p>
            Some of the Cookies we commonly use are listed in our Cookies chart
            below. This list is not exhaustive, but it is intended to illustrate
            primary reasons for certain types of Cookies set by Goodearth and
            third parties on our websites. Third parties may also set certain
            Cookies on your device when you use our Services. In some cases, the
            third party has been hired to provide certain services on
            Goodearth’s behalf (e.g., website analytics). In other cases, our
            websites contain content or ads from third parties (e.g., videos,
            news content, or ads delivered by other ad networks). When your
            browser connects to those third parties&#39; web servers to retrieve
            content, those third parties may set and use their own Cookies on
            your device.
          </p>
        </div>
        <div className={cs(globalStyles.voffset4, globalStyles.row)}>
          <div className={cs(globalStyles.colMd12, styles.table, styles.first)}>
            <div>Cookie Name</div>
            <div>Purpose</div>
            <div>Expiration</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>CHATSESS</div>
            <div>To Maintain the chat session</div>
            <div>Till the time the Browser is Open</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>sessionid</div>
            <div>To Maintain the user session</div>
            <div>Till the time the Browser is Open</div>
          </div>
          <div className={cs(bootstrapStyles.col12, styles.table)}>
            <div>_ga</div>
            <div>Google Ad / Analytics related Cookie</div>
            <div>Not Applicable, Manage Settings.</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>_gid</div>
            <div>Google Ad / Analytics related Cookie</div>
            <div>Not Applicable, Manage Settings.</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>csrftoken</div>
            <div>For API Security</div>
            <div>Not Applicable, Manage Settings.</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>goodearth</div>
            <div>Popup Related Data</div>
            <div>Not Applicable, Manage Settings.</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>intro</div>
            <div>For Intro Video Content</div>
            <div>1</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>key</div>
            <div>For LoggedIn User</div>
            <div>1</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>messages</div>
            <div>To Maintain the user session</div>
            <div>Not Applicable, Manage Settings.</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>oscar_open_basket</div>
            <div>To Maintain the user session</div>
            <div>Not Applicable, Manage Settings.</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>pnctest</div>
            <div>To Maintain the user session</div>
            <div>Not Applicable, Manage Settings.</div>
          </div>
          <div className={cs(globalStyles.colMd12, styles.table)}>
            <div>sid</div>
            <div>Chat Freshdesk</div>
            <div>Not Applicable, Manage Settings.</div>
          </div>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>How Cookies are used for online analytics purposes?</h5>
          <p>
            We may use third-party web analytics services, such as those of
            Google Analytics. These service providers use the sort of technology
            described in the Automatically-Collected Information section above
            to help us analyse how users use the Services, including by noting
            the third-party website from which you arrive. The information
            collected by the technology will be disclosed to or collected
            directly by these service providers, who use the information to
            evaluate your use of the Services. We also use Google Analytics for
            certain purposes related to online marketing, as described in the
            following section.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>How are Cookies used for advertising purposes?</h5>
          <p>
            Cookies and other ad technology such as beacons, pixels, and tags
            help us serve relevant ads to you more effectively. They also help
            us provide aggregated auditing, research, and reporting for
            advertisers, understand and improve our service, and know when
            content has been shown to you.
          </p>
          <p>
            We do not serve third party advertisements to you while using
            Goodearth.in. &nbsp;However, we do work with website analytics and
            advertising partners, including Google Display Network, Facebook,
            etc. to deliver Goodearth advertisements on third party publisher
            websites - these partners may set Cookies on your computer&#39;s web
            browser. These Cookies allow our partners to recognize your computer
            so that the ad server can show you Goodearth advertisements
            elsewhere on the Internet, and so that our analytics software can
            measure your engagement and interactions while using Goodearth.com.
            In this way, ad servers may compile anonymous, de-identified
            information about where you, or others who are using your computer,
            saw our advertisements, whether or not you interacted with our
            advertisements, and actions performed on subsequent visits
            toGoodearth.com. This information allows an ad network to deliver
            targeted advertisements that they believe will be of most interest
            to you, and it allows Goodearth to optimize the performance of our
            advertising campaigns and the usability of our website. In other
            words, we use analytics data in concert with data about our online
            ads that have been shown using the Google Display Network, Facebook
            for Advertisers, or other online advertising networks. By doing so,
            we can understand how anonymous users interacted with our website
            after seeing our ads.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>What third-party Cookies does Goodearth use?</h5>
          <p>
            Please note that the third parties (advertising networks and
            providers of external services like web traffic analysis services)
            may also use Cookies on our Services. Cookies on our sites. Also,
            note that the names of Cookies, pixels and other technologies may
            change over time.
          </p>
          <p>
            We used trusted partners like Google Display Network, Facebook Ad
            Network, Google DoubleClick, Twitter and similar platforms to help
            us service advertising by placing Cookies on your device. We also
            pull through content from social networks into our own pages, such
            as embedded Twitter feeds. The social networks, such as Facebook,
            Twitter, Youtube, Instagram, Google, etc. may themselves also put
            Cookies on your machine. For example, our website also utilizes the
            Facebook Like button functionality to share content. If a user
            clicks the Like button and logs into Facebook via our website,
            Facebook will leave a Cookie on the users&#39; computer. This is the
            same process as if the user logs into Facebook directly, or clicks
            Like on any other website.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <p>
            We also use Google Analytics on our Services to help us analyse how
            our Services are used. &nbsp;Google Analytics uses performance
            Cookies to track customer’s interactions. For example, by using
            Cookies, Google can tell us which pages our users view, which are
            most popular, what time of day our websites are visited, whether
            visitors have been to our websites before, what website referred the
            visitor to our websites, and other similar information. &nbsp;All of
            this information is anonymized.
          </p>
          <p>
            We have little control over these &#39;third party&#39; Cookies, so
            we suggest that you check the respective privacy policies for these
            external services to help you understand what data these
            organisations hold about you and what they do with it.
          </p>
          <p>
            Facebook:&nbsp;
            <a
              href="https://www.facebook.com/policy.php"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.facebook.com/policy.php
            </a>
            <br />
            Google AdWords:&nbsp;
            <a
              href="https://support.google.com/adwords/answer/2549116?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://support.google.com/adwords/answer/2549116?hl=en
            </a>
            &nbsp;
            <br />
            Google Analytics:&nbsp;
            <a
              href="http://www.google.com/analytics/learn/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://www.google.com/analytics/learn/privacy.html.
            </a>
            <br />
            Google Tag Manager:&nbsp;
            <a
              href="https://www.google.com/analytics/tag-manager/faq/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.google.com/analytics/tag-manager/faq/
            </a>
            <br />
            Google+:&nbsp;
            <a
              href="https://www.google.com/policies/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.google.com/policies/privacy/
            </a>
            <br />
            Twitter:&nbsp;
            <a
              href="https://twitter.com/privacy?lang=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://twitter.com/privacy?lang=en
            </a>
            <br />
            YouTube:&nbsp;
            <a
              href="https://www.youtube.com/static?template=privacy_guidelines"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.youtube.com/static?template=privacy_guidelines
            </a>
            <br />
            XAXIS:&nbsp;
            <a
              href="https://www.xaxis.com/privacy-notice/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.xaxis.com/privacy-notice/
            </a>
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Our use of Web Beacons</h5>
          <p>
            We may also use electronic images known as Web beacons on our
            Services - sometimes called &#34;clear GIFs &#34;, &#34;single-pixel
            GIFs &#34;, or &#34;Web bugs &#34;. Web beacons are used to deliver
            Cookies on our Services, count clicks/users/visitors, and deliver
            co-branded content or services. We may include Web beacons in our
            promotional e-mail messages or other to determine whether messages
            have been opened and acted upon.
          </p>
          <p>
            Goodearth Services may also contain web beacons from third parties
            to help us compile aggregated statistics regarding the effectiveness
            of our promotional campaigns or other website operations. These Web
            beacons may allow the third parties to set or read Cookies on your
            device.
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>How can you control Cookies?</h5>
          <p>
            Most browsers allow you to control Cookies through their settings
            preferences. However, If you choose to turn off these Cookies you
            will still see advertising on the internet as it may not be tailored
            to your interests. It does not mean that you won&#39;t be served any
            advertisements whilst you are online. &nbsp;Whilst many companies
            involved in using advertising Cookies and serving online behavioral
            advertising appear at the above link, not all do. Therefore, even if
            you choose to turn off Cookies used by all of the companies listed,
            you may still receive some advertising Cookies and some tailored
            advertisements from other companies. &nbsp;&nbsp;
          </p>
          <p>
            There are a number of ways you can manage what Cookies are set on
            your devices. Essential Cookies, however, cannot be disabled. If you
            do not allow certain Cookies to be installed, the website may not be
            accessible to you and/or the performance, features, or services of
            the website may be compromised.
          </p>
          <p>
            You can also manage this type of Cookie in the privacy settings on
            the web browser you are using. &nbsp;Please see below for more
            information.
          </p>
          <p>
            You can disable and/or delete Cookies by using your browser
            settings. &nbsp;Please note that if you use your browser settings to
            block all Cookies you may not be able to access parts of our or
            others&#39; websites. The following links provide information on how
            to modify the Cookies settings on some popular browsers:
          </p>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Apple Safari</h5>
          <ul>
            <li>Step 1: Open Safari if it is not already open. </li>
            <li>
              Step 2: Choose Safari &gt; Preferences, and then click Privacy.
            </li>
            <li>
              Step 3: In the “Block Cookies” section, specify if and when Safari
              should accept Cookies from websites. To see an explanation of the
              options, click the Help button (question mark).
            </li>
            <li>
              Step 4: If you want to see which websites store Cookies on your
              computer, click Details.
            </li>
          </ul>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Google Chrome :</h5>
          <ul>
            <li>Step 1: On your computer, open Chrome.</li>
            <li>Step 2: &nbsp;At the top right, click More Settings.</li>
            <li>Step 3: At the bottom, click Advanced.</li>
            <li>
              Step 4: Under &#34;Privacy and security, &#34; click Content
              settings.
            </li>
            <li>Step 5: Click Cookies.</li>
            <li>
              Step 6: Under &#34;All Cookies and site data, &#34; click Remove
              all.
            </li>
            <li>Step 7: Confirm by clicking Clear all.</li>
          </ul>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Microsoft Internet Explorer (EDGE)</h5>
          <ul>
            <li>
              Step 1: Select the gear in the upper-right corner of the screen,
              then select “Internet Options“. If you have the Menu Bar enabled,
              you can select “Tools“ &gt; “Internet Options“.
            </li>
            <li>Step 2: Click the “Privacy” tab.</li>
            <li>Step 3: Select the “Advanced” button.</li>
            <li>
              Step 4: Under “First-party Cookies” and “Third-party Cookies“,
              choose one of the following:
            </li>
            <li>Step 5: Accept – To automatically accept Cookies.</li>
            <li>Step 6: Block – To automatically block Cookies.</li>
            <li>
              Step 7: Prompt – To prompt with each Cookie request.You can also
              check “Always allow session Cookies” if desired. Select “OK” when
              done.
            </li>
            <li>
              Step 8: Select the “Sites” button if you wish to set options for
              specific websites. Under this section, type the website in the
              “Address of website” field, then select to “Block” or “Allow”
              Cookies on that website. Click “OK” when you are done.
            </li>
            <li>
              Step 9: Click “OK” and you have successfully set your Cookie
              settings in IE11.
            </li>
          </ul>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Mozilla Firefox</h5>
          <ul>
            <li>
              Step 1: Click the menu button and choose Options.Preferences.
            </li>
            <li>
              Step 2: Select the Privacy &amp; Security panel and go to the
              History section.
            </li>
            <li>
              Step 3: In the drop-down menu next to Firefox will:Firefox will,
              choose Use custom settings for history.
            </li>
            <li>
              Step 4: Uncheck Accept Cookies from sitesAccept Cookies from
              websites to disable them.
            </li>
            <li>Step 5: Choose how long Cookies are allowed to be stored:</li>
          </ul>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Keep until:</h5>
          <p>
            they expire: Each Cookie will be removed when it reaches its
            expiration date, which is set by the site that sent the Cookie.I
            close Firefox: The Cookies that are stored on your computer will be
            removed when Firefox is closed.
          </p>
          <ul>
            <li>
              Step 7: Close the about: preferences page. Any changes you&#39;ve
              made will automatically be saved.
            </li>
          </ul>
        </div>
        <div className={globalStyles.voffset4}>
          <h5>Your Choices</h5>
          <p>
            Goodearth provides you with a number of choices with respect to the
            information we collect and use as discussed throughout this Policy.
          </p>
          <p>Some of your choices include:</p>
          <ul>
            <li>
              Marketing Communications. &nbsp;If you purchase a product but do
              not wish to receive any additional marketing material from us, you
              can indicate your preference on our order form by leaving the
              “Opt-In” checkbox blank. If you no longer wish to receive our
              marketing and promotional emails, at all times have the option to
              unsubscribe by sending email at&nbsp;
              <a href="mailto:customercare@goodearth.in">
                customercare@goodearth.in
              </a>
              &nbsp; and to be forgotten and requiring your information to be
              expunged from our records by contacting&nbsp;
              <a href="mailto:customercare@goodearth.in">
                customercare@goodearth.in
              </a>
              .
            </li>
            <li>
              Goodearth Personalization Services: Goodearth may associate the
              information we automatically collect from you with identifiable
              information we have collected from and about you (such as your
              e-mail address or Goodearth user ID, etc.) to personalize your
              Goodearth experience. &nbsp;Such personalization services may
              include providing tailored content, features, in-application
              communications and promotions, and personalized customer support.
              If you do not want Goodearth to associate automatically-collected
              information with you, you may opt out at all times have the option
              to unsubscribe by sending email at&nbsp;
              <a href="mailto:customercare@goodearth.in">
                customercare@goodearth.in
              </a>
              &nbsp; and to be forgotten and requiring your information to be
              expunged from our records by contacting&nbsp;
              <a href="mailto:customercare@goodearth.in">
                customercare@goodearth.in
              </a>
              . If you opt out we will still collect Goodearth device and usage
              information but we will only collect such data in a de-identified
              and aggregate form.
            </li>
            <li>
              Tailored Online Advertising Opt-Out: &nbsp;Goodearth strives to
              provide the public with relevant, value-added content in the form
              of online advertisements. However, we respect the wishes of anyone
              who does not want to be tracked by third party advertising
              companies online. Users may opt out of Cookie-based online
              advertising and analytics programs by following the opt-out
              instructions provided by our advertising and analytics partners
              within our dedicated Cookies Policy as mentioned on this page.
            </li>
          </ul>
        </div>
        <div className={globalStyles.voffset4}>
          <p>
            Click on the link below to learn more about our Privacy policies.
          </p>
          <p>
            <Link to="/customer-assistance/privacy-policy">
              https://www.goodearth.in/customer-assistance/privacy-policy
            </Link>
          </p>
        </div>
      </div>
    );
  }
}
