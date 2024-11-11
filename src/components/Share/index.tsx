import React from "react";
import { useStore } from "react-redux";
import cs from "classnames";
import { Props } from "./typings";
// import Whatsapp from "./whatsapp";
import Mail from "./mail";
import CopyLink from "./copyLink";

//import productDertailsStyles from "containers/pdp/components/productDetails/styles.scss";
// actions
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { showGrowlMessage } from "../../utils/validate";
import Whatsapp from "./whatsapp";
import { GA_CALLS } from "constants/cookieConsent";
import CookieService from "services/cookie";

const Share: React.FC<Props> = ({
  link,
  mailText,
  mailSubject,
  mobile,
  productName
}) => {
  const whatsappLink = `${
    mobile ? "whatsapp://send?text=" : "https://web.whatsapp.com/send?text="
  }${link}%3Futm_source=Website-Shared%26utm_medium=Whatsapp`;
  const mailContent = `mailto:?subject=${mailSubject}&body=${mailText}%3Futm_source=Website-Shared%26utm_medium=Email`;

  const store = useStore();
  const copyText = () => {
    showGrowlMessage(
      store.dispatch,
      "The link of this product has been copied to clipboard!",
      3000,
      "LINK_COPIED_MESSAGE"
    );
    // trigger event on click of copyText
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "link_copied",
        click_type: productName,
        link_url: link
      });
    }
  };

  const whatsappGaEvent = () => {
    // trigger event on click of whatsapp
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "share_product",
        click_type: productName,
        cta_name: "whatsapp"
      });
    }
  };

  const emailGaEvent = () => {
    // trigger event on click of email
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "share_product",
        click_type: productName,
        cta_name: "email"
      });
    }
  };

  //const [show, setShow] = useState(false);
  return (
    <div className={styles.shareContainer}>
      {/* <div
        className={cs(productDertailsStyles.label, styles.shareLabel)}
      >
     </div> */}
      <div
        className={cs(
          globalStyles.voffset1,
          styles.shareInnerContainer
          // show ? styles.show : styles.hide
        )}
      >
        <div className={cs(styles.shareItem, styles.link)}>
          <CopyLink
            link={link}
            text={mailText}
            className={cs(styles.socialIcon, styles.copyLink)}
            onClick={copyText}
          />
        </div>
        <div className={cs(styles.shareItem, styles.whatsapp)}>
          <Whatsapp
            link={whatsappLink}
            className={cs(styles.socialIcon, styles.whatsappIcon)}
            onClick={whatsappGaEvent}
          />
        </div>
        <div className={cs(styles.shareItem, styles.mail)}>
          <Mail
            link={mailContent}
            className={cs(styles.socialIcon, styles.mailIcon)}
            onClick={emailGaEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default Share;
