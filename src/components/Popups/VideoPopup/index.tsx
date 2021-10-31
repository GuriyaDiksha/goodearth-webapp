import Loader from "components/Loader";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "../styles.scss";
import globalStyles from "../../../styles/global.scss";
import iconStyles from "styles/iconFonts.scss";
import cs from "classnames";
import { Link } from "react-router-dom";
import { Context } from "components/Modal/context";

const VideoPopup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { closeModal } = useContext(Context);
  let player: any = null;
  const togglePlay = (e: any) => {
    player.getPaused().then((isPaused: boolean) => {
      if (isPaused) {
        player.play();
      } else {
        player.pause();
      }
    });
  };

  const initialize = () => {
    if (Vimeo && !player) {
      //initialize player
      const iframe = document.querySelector("iframe");
      player = new Vimeo.Player(iframe);
      // hide default vimeo play button
      console.log("loaded!!!");
      setIsLoading(false);
      player.play();
      player.setLoop(true);
      // if(iframe) {
      //     const iframeDoc = iframe.contentWindow.document;
      //     const btn = iframeDoc.querySelectorAll('.vp-controls-wrapper')[0];
      // btn && btn.classList.add(styles.btn);
      // }
    }
  };

  useEffect(() => {
    initialize();
  }, [Vimeo]);

  const { mobile } = useSelector((state: AppState) => state.device);
  return (
    <div className={styles.videoPopupContainer} onClick={togglePlay}>
      <div className={styles.cross} onClick={closeModal}>
        <i
          className={cs(
            iconStyles.icon,
            iconStyles.iconCrossNarrowBig,
            styles.icon,
            styles.iconCross
          )}
        ></i>
      </div>
      {mobile ? (
        <iframe
          id="vimeo"
          onLoad={initialize}
          src="https://player.vimeo.com/video/639043234?h=af1a85222a"
          width="320"
          height="489"
          frameBorder="0"
          allow="autoplay; picture-in-picture"
        ></iframe>
      ) : (
        <iframe
          id="vimeo"
          onLoad={initialize}
          src="https://player.vimeo.com/video/639040610?h=39a8b75668"
          width="850"
          height="523"
          frameBorder="0"
          allow="autoplay; picture-in-picture"
        ></iframe>
      )}
      <div className={cs(globalStyles.ceriseBtn, styles.cta)}>
        <Link to="/cart" onClick={closeModal}>
          Discover Bosporus
        </Link>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default VideoPopup;
