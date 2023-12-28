import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../components/Modal/context";
import cs from "classnames";
import globalStyles from "../../styles/global.scss";
import styles from "./styles.scss";
import bootstrapStyles from "../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../styles/iconFonts.scss";
import { AppState } from "reducers/typings";
import { useDispatch, useSelector } from "react-redux";
import WishlistService from "services/wishlist";
import iconWhatsApp from "../../images/bridal/icons_whatsapp.svg";
import iconEmail from "../../images/bridal/icons_email.svg";
// import { BridalDetailsType } from './typings';
// import Modal from '../../components/common/popup/Modal';
// import InputField from 'components/common/signin/inputField'
// import Config from "components/config"
import bgOne from "./../../images/left.svg";
import bgTwo from "./../../images/right.svg";
import eye from "./../../images/eye.svg";
import copy from "./../../images/copy.svg";
import wup from "./../../images/wup.svg";
import { showGrowlMessage } from "utils/validate";

type Props = {
  // changeScreen: () => void;
  shareUrl: string;
};

const ShareWishlistLink: React.FC<Props> = props => {
  const [txt, setTxt] = useState("copy");
  const { mobile } = useSelector((state: AppState) => state.device);
  const { firstName, lastName } = useSelector((state: AppState) => state.user);
  const { wishlist_link } = useSelector((state: AppState) => state.wishlist);
  const dispatch = useDispatch();

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
    showGrowlMessage(
      dispatch,
      "The link of this Saved List has been copied to your clipboard!"
    );

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
    whatsappElement?.setAttribute("href", whatsappUrl);
  });

  const createLink = async () => {
    await WishlistService.createSharedWishlistLink(dispatch);
  };

  const deleteLink = async () => {
    await WishlistService.deleteSharedWishlistLink(dispatch);
  };

  return (
    <div
      className={cs(
        styles.sizeBlockBridal,
        { [styles.centerpageDesktop]: !mobile, [styles.ht]: !mobile },
        // { [styles.centerpageMobile]: mobile },
        globalStyles.textCenter
      )}
    >
      <img src={bgOne} className={cs(styles.bgOne)} />

      <div className={styles.cross} onClick={closeModal}>
        <i className={cs(iconStyles.icon, iconStyles.iconCrossNarrowBig)}></i>
      </div>
      <img src={bgTwo} className={cs(styles.bgTwo)} />
      <div className={bootstrapStyles.row}>
        <div className={cs(bootstrapStyles.col8, bootstrapStyles.offset2)}>
          <div className={styles.loginForm}>
            <div>
              <div className={globalStyles.voffset7}>
                <h2>
                  Share {firstName} {lastName}&apos;s
                </h2>
                <h2>Saved List</h2>
              </div>
              {!wishlist_link && (
                <div className={styles.linkWrp}>
                  <p className={styles.link} onClick={createLink}>
                    CREATE SHARE LINK
                  </p>
                </div>
              )}
              {wishlist_link && (
                <>
                  <div className={cs(globalStyles.voffset3, styles.wrapper)}>
                    <div className={cs(styles.shareTxtBoxWishlist)}>
                      <input type="text" value={wishlist_link} id="myInput" />
                    </div>

                    <img src={copy} width="30" onClick={copyLink} />
                    <a
                      id="whatsappShare"
                      data-action="share/whatsapp/share"
                      rel="noopener noreferrer"
                      target="_blank"
                      className={styles.wupLink}
                    >
                      <img src={wup} width="30" />
                    </a>
                  </div>

                  <p className={styles.note}>
                    Please note, this link will be auto-updated whenever the
                    Saved List is updated.
                  </p>
                </>
              )}

              {/* <div className={cs(globalStyles.voffset3, globalStyles.c10LR)}>
                OR
              </div> */}

              {/* <div className={globalStyles.voffset3}>
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
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {wishlist_link && (
        <div className={styles.footer}>
          <p className={styles.footerNote}>
            <img src={eye} className={cs(styles.eye)} width="25" />
            People with this link can view your Saved list
          </p>
          <div className={styles.marginAuto} onClick={deleteLink}>
            <p className={styles.deleteLink}>DELETE LINK</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareWishlistLink;
