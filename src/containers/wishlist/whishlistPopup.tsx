import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../components/Modal/context";
import cs from "classnames";
import globalStyles from "../../styles/global.scss";
import styles from "../myAccount/components/Bridal/styles.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../styles/iconFonts.scss";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";
import iconWhatsApp from "../../images/bridal/icons_whatsapp.svg";
import iconEmail from "../../images/bridal/icons_email.svg";
// import { BridalDetailsType } from './typings';
// import Modal from '../../components/common/popup/Modal';
// import InputField from 'components/common/signin/inputField'
// import Config from "components/config"

type Props = {
  // changeScreen: () => void;
  shareUrl: string;
};

const ShareWishlistLink: React.FC<Props> = props => {
  const [txt, setTxt] = useState("copy");
  const { mobile } = useSelector((state: AppState) => state.device);
  const copyLink = (event: React.MouseEvent) => {
    const copyText = document.getElementById("myInput") as HTMLInputElement;
    const isIOSDevice = navigator.userAgent.match(/ipad|iphone/i);
    if (isIOSDevice) {
      copyText.setSelectionRange(0, copyText.value.length);
    } else {
      copyText.select();
    }
    document.execCommand("copy");
    setTxt("copied");
    event.stopPropagation();
  };
  const { closeModal } = useContext(Context);

  useEffect(() => {
    console.log("Inside useEffect");
    const whatsappUrl = mobile
      ? "whatsapp://send?text="
      : "https://web.whatsapp.com/send?text=Some sample text";
    const whatsappElement = document.getElementById(
      "whatsappShare"
    ) as HTMLAnchorElement;
    whatsappElement.setAttribute("href", whatsappUrl);
  });

  return (
    <div
      className={cs(
        styles.sizeBlockBridal,
        styles.ht,
        { [styles.centerpageDesktop]: !mobile },
        { [styles.centerpageMobile]: mobile },
        globalStyles.textCenter
      )}
    >
      <div className={styles.cross} onClick={closeModal}>
        <i className={cs(iconStyles.icon, iconStyles.iconCrossNarrowBig)}></i>
      </div>

      <div className={bootstrapStyles.row}>
        <div className={cs(bootstrapStyles.col8, bootstrapStyles.offset2)}>
          <div className={styles.loginForm}>
            <div className="section cart">
              <div className={globalStyles.voffset7}>
                <h2>Share Registry Link</h2>
              </div>
              <div className={cs(globalStyles.voffset3, styles.shareTxtBox)}>
                <input type="text" value={props.shareUrl} id="myInput" />
                <span className={styles.copylink} onClick={copyLink}>
                  <a>{txt}</a>
                </span>
              </div>

              <div className={cs(globalStyles.voffset3, globalStyles.c10LR)}>
                OR
              </div>

              <div className={globalStyles.voffset3}>
                <a
                  id="whatsappShare"
                  data-action="share/whatsapp/share"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img src={iconWhatsApp} width="50" />
                </a>
                <a
                  id="mailShare"
                  title="Share by Email"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img src={iconEmail} width="50" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareWishlistLink;
