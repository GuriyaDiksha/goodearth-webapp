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
import * as util from "../../utils/validate";

const Share: React.FC<Props> = ({ link, mailText, mailSubject, mobile }) => {
  // const whatsappLink = `${
  //   mobile ? "whatsapp://send?text=" : "https://web.whatsapp.com/send?text="
  // }${link}%3Futm_source=Website-Shared%26utm_medium=Whatsapp`;
  const mailContent = `mailto:?subject=${mailSubject}&body=${mailText}%3Futm_source=Website-Shared%26utm_medium=Email`;

  const store = useStore();
  const copyText = () => {
    util.showGrowlMessage(
      store.dispatch,
      "The link of this product has been copied to clipboard!",
      3000,
      "LINK_COPIED_MESSAGE"
    );
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
        {/* <div>
          <Whatsapp link={whatsappLink} className={styles.socialIcon} />{" "}
        </div> */}
        <div className={cs(styles.mail)}>
          <Mail link={mailContent} className={styles.socialIcon} />{" "}
        </div>
        <div className={cs(styles.link)}>
          {" "}
          <CopyLink
            link={link}
            text={mailText}
            className={cs(styles.socialIcon, styles.copyLink)}
            onClick={copyText}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default Share;
