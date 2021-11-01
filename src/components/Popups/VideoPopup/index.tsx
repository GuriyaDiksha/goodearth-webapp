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
  const [isMute, setIsMute] = useState(true);
  const { closeModal } = useContext(Context);
  const [player, setPlayer] = useState<any>(null);
  // const togglePlay = (e: any) => {
  //   if(player) {
  //     player.getPaused().then((isPaused: boolean) => {
  //       if (isPaused) {
  //         player.play();
  //       } else {
  //         player.pause();
  //       }
  //     });
  //   }
  // };

  useEffect(() => {
    if (player) {
      console.log("loaded!!!");
      setIsLoading(false);
      // player.play();
      player.setLoop(true);
    }
  }, [player]);
  const initialize = () => {
    if (Vimeo && !player) {
      //initialize player
      const iframe = document.querySelector("iframe");
      setPlayer(new Vimeo.Player(iframe));
      // hide default vimeo play button

      // if(iframe) {
      //     const iframeDoc = iframe.contentWindow.document;
      //     const btn = iframeDoc.querySelectorAll('.vp-controls-wrapper')[0];
      // btn && btn.classList.add(styles.btn);
      // }
    }
  };

  const toggleMute = () => {
    player.setVolume(isMute ? 1 : 0);
    setIsMute(isMute => !isMute);
  };
  useEffect(() => {
    initialize();
  }, [Vimeo]);

  const { mobile } = useSelector((state: AppState) => state.device);
  return (
    <div className={styles.videoPopupContainer}>
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
          src="https://player.vimeo.com/video/639043234?background=1&badge=0&autoplay=1&loop=1&controls=1"
          width="320"
          height="489"
          frameBorder="0"
          allow="autoplay; picture-in-picture"
        ></iframe>
      ) : (
        <iframe
          id="vimeo"
          onLoad={initialize}
          src="https://player.vimeo.com/video/639040610?background=1&badge=0&autoplay=1&loop=1&controls=1"
          width="850"
          height="523"
          frameBorder="0"
          allow="autoplay; picture-in-picture"
        ></iframe>
      )}
      <div className={cs(globalStyles.ceriseBtn, styles.cta)}>
        <Link to="/" onClick={closeModal}>
          Discover Bosporus
        </Link>
      </div>
      <div className={styles.icon} onClick={toggleMute}>
        <i
          className={cs(
            iconStyles.icon,
            { [iconStyles.iconMute]: !isMute, [iconStyles.iconMute2]: isMute },
            styles.iconMute
          )}
        ></i>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};

export default VideoPopup;
