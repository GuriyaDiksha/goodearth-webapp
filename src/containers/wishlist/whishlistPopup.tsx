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
import bgOne from "./../../images/left_wishlist.png";
import bgTwo from "./../../images/right_wishlist.png";
import eye from "./../../images/eye.svg";
import copy from "./../../images/copy.svg";
import wup from "./../../images/wup.svg";
import { showGrowlMessage } from "utils/validate";
import CookieService from "services/cookie";
import { GA_CALLS } from "constants/cookieConsent";

export type Props = {
  listName: string;
  sharable_link: string;
  updateWishlistData: any;
};

const ShareWishlistLink: React.FC<Props> = ({
  listName,
  sharable_link,
  updateWishlistData
}) => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const { firstName, lastName } = useSelector((state: AppState) => state.user);
  // const { wishlist_link } = useSelector((state: AppState) => state.wishlist);
  const [wishlist_link, setWishlist_link] = useState(sharable_link);
  const dispatch = useDispatch();

  const gaCall = (click_type: string) => {
    const userConsent = CookieService.getCookie("consent").split(",");
    if (userConsent.includes(GA_CALLS)) {
      dataLayer.push({
        event: "share_wishlist",
        click_type: click_type,
        cta_location: "NA",
        cta_name:
          `${firstName} ${lastName}`
            .toLowerCase()
            .replace(/\b(\w)/g, x => x.toUpperCase()) + "&apos;s Saved List"
      });
    }
  };

  const copyLink = (event: React.MouseEvent) => {
    event.preventDefault();

    gaCall("Copy to Clipboard");

    const isIOSDevice = navigator.userAgent.match(/ipad|iphone/i);

    const dummyInput = document.createElement("input");
    dummyInput.value = wishlist_link;
    document.body.appendChild(dummyInput);
    dummyInput.select();

    if (isIOSDevice) {
      dummyInput.setSelectionRange(0, wishlist_link.length);
    } else {
      dummyInput.select();
    }

    // Execute the "copy" command
    document.execCommand("copy");
    document.body.removeChild(dummyInput);

    event.stopPropagation();

    showGrowlMessage(
      dispatch,
      "The link of this Saved List has been copied to your clipboard!"
    );
  };
  const { closeModal } = useContext(Context);

  useEffect(() => {
    const whatsappUrl =
      (mobile
        ? "whatsapp://send?text="
        : "https://web.whatsapp.com/send?text=") +
      `My Good Earth Saved List %0D%0A%0D%0A Here is a link to my favourite products: %0D%0A%0D%0A ${encodeURIComponent(
        wishlist_link
      )}`;
    const whatsappElement = document.getElementById(
      "whatsappShare"
    ) as HTMLAnchorElement;
    whatsappElement?.setAttribute("href", whatsappUrl);
  });

  const createLink = async () => {
    gaCall("Create Share Link");
    const res = await WishlistService.createSharedWishlistLink(
      dispatch,
      listName
    );
    setWishlist_link(res.wishlist_link);
    updateWishlistData();
  };

  const deleteLink = async () => {
    gaCall("Delete Link");
    await WishlistService.deleteSharedWishlistLink(dispatch, listName);
    setWishlist_link("");
    updateWishlistData();
  };

  return (
    <div
      className={cs(
        styles.sizeBlockBridal,
        { [styles.centerpageDesktop]: !mobile },
        // { [styles.centerpageMobile]: mobile },
        globalStyles.textCenter
      )}
    >
      <img src={bgOne} className={cs(styles.bgOne)} />

      <div className={styles.cross} onClick={closeModal}>
        <i className={cs(iconStyles.icon, iconStyles.iconCrossNarrowBig)}></i>
      </div>
      <img
        src={bgTwo}
        className={cs(styles.bgTwo, { [styles.bottom]: wishlist_link })}
      />
      <div
        className={cs(bootstrapStyles.row, {
          [globalStyles.marginB80]: !mobile
        })}
      >
        <div className={cs(styles.mainWrp)}>
          <div className={styles.loginForm}>
            <div>
              <div className={globalStyles.voffset8}>
                {/* <h2 className={styles.h2Popup}>
                  Share{" "}
                  {`${firstName} ${lastName}`
                    .toLowerCase()
                    .replace(/\b(\w)/g, x => x.toUpperCase())}
                  &apos;s
                </h2> */}
                <h2 className={styles.h2Popup}>
                  Share saved items <br /> &apos;{listName} List&apos;
                </h2>
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
                  <div
                    className={cs(globalStyles.voffset4, styles.wrapper)}
                    onClick={e => e.stopPropagation()}
                  >
                    <div
                      className={cs(styles.shareTxtBoxWishlist)}
                      onClick={e => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={wishlist_link}
                        id="myInput"
                        readOnly
                      />
                      <p className={styles.note}>
                        Please note, this link will be auto-updated whenever the
                        Saved List is updated.
                      </p>
                    </div>

                    <div
                      className={styles.copyIcon}
                      onClick={e => e.stopPropagation()}
                    >
                      <img
                        src={copy}
                        width="25"
                        height={"25"}
                        onClick={copyLink}
                      />
                    </div>

                    <a
                      id="whatsappShare"
                      data-action="share/whatsapp/share"
                      rel="noopener noreferrer"
                      target="_blank"
                      className={styles.wupLink}
                      onClick={() => gaCall("Whatsapp")}
                    >
                      <img src={wup} width="25" height={"25px"} />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {wishlist_link && (
        <div className={styles.footer}>
          <div className={styles.imgTextWrp}>
            <img
              src={eye}
              className={cs(styles.eye)}
              width={mobile ? "20" : "25"}
              height={"25"}
            />

            <p className={styles.footerNote}>
              People with this link can view your Saved list
            </p>
          </div>

          <div className={styles.marginAuto} onClick={deleteLink}>
            <p className={styles.deleteLink}>DELETE LINK</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareWishlistLink;
