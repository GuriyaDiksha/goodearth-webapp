import React from "react";
import { useStore } from "react-redux";
import cs from "classnames";
import { Props } from "./typings";
import Whatsapp from "./whatsapp";
import Mail from "./mail";
import CopyLink from "./copyLink";

import productDertailsStyles from "containers/pdp/components/productDetails/styles.scss";
// actions
import { showMessage } from "actions/growlMessage";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";

const Share: React.FC<Props> = ({ link, mailText, mailSubject, mobile }) => {
  const whatsappLink = `${
    mobile ? "whatsapp://send?text=" : "https://web.whatsapp.com/send?text="
  }${link}%3Futm_source=Website-Shared%26utm_medium=Whatsapp`;
  const mailContent = `mailto:?subject=${mailSubject}&body=${mailText}%3Futm_source=Website-Shared%26utm_medium=Email`;

  const store = useStore();
  const copyText = () => {
    store.dispatch(
      showMessage("The link of this product has been copied to clipboard!")
    );
  };

  return (
    <>
      <div className={productDertailsStyles.label}>share</div>
      <div className={globalStyles.voffset1}>
        <Whatsapp link={whatsappLink} className={styles.socialIcon} />
        <Mail link={mailContent} className={styles.socialIcon} />
        <CopyLink
          link={link}
          text={mailText}
          className={cs(styles.socialIcon, styles.copyLink)}
          onClick={copyText}
        />
      </div>
    </>
  );
};

export default Share;
