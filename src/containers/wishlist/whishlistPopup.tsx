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
import bgOne from "./../../images/left.svg";
import bgTwo from "./../../images/right.svg";
import eye from "./../../images/eye.svg";
import copy from "./../../images/copy.svg";
import wup from "./../../images/wup.svg";
import { showGrowlMessage } from "utils/validate";

const ShareWishlistLink = () => {
  const { mobile } = useSelector((state: AppState) => state.device);
  const { firstName, lastName } = useSelector((state: AppState) => state.user);
  const { wishlist_link } = useSelector((state: AppState) => state.wishlist);
  const dispatch = useDispatch();

  const copyLink = (event: React.MouseEvent) => {
    event.preventDefault();
    const copyText = document.getElementById("myInput") as HTMLInputElement;
    const isIOSDevice = navigator.userAgent.match(/ipad|iphone/i);
    if (isIOSDevice) {
      copyText.setSelectionRange(0, copyText.value.length);
    } else {
      copyText.select();
    }
    document.execCommand("copy");
    showGrowlMessage(
      dispatch,
      "The link of this Saved List has been copied to your clipboard!"
    );

    event.stopPropagation();
  };
  const { closeModal } = useContext(Context);

  useEffect(() => {
    console.log("Inside useEffect");

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
      <img
        src={bgTwo}
        className={cs(styles.bgTwo, { [styles.bottom]: wishlist_link })}
      />
      <div className={bootstrapStyles.row}>
        <div className={cs(styles.mainWrp)}>
          <div className={styles.loginForm}>
            <div>
              <div className={globalStyles.voffset7}>
                <h2>
                  Share{" "}
                  {`${firstName} ${lastName}`
                    .toLowerCase()
                    .replace(/\b(\w)/g, x => x.toUpperCase())}
                  &apos;s
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
                  <div
                    className={cs(globalStyles.voffset3, styles.wrapper)}
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
                        disabled
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
