// import Loader from "components/Loader";
import React, { useContext, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { AppState } from "reducers/typings";
import styles from "../styles.scss";
// import globalStyles from "../../../styles/global.scss";
import iconStyles from "styles/iconFonts.scss";
import cs from "classnames";
// import { Link } from "react-router-dom";
import { Context } from "components/Modal/context";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

const HelloarPopup: React.FC<{ code: string }> = ({ code }) => {
  // const [isLoading, setIsLoading] = useState(true);
  const { closeModal } = useContext(Context);
  const { mobile } = useSelector((state: AppState) => state.device);
  // let player: any = null;
  // const togglePlay = (e: any) => {
  //   player.getPaused().then((isPaused: boolean) => {
  //     if (isPaused) {
  //       player.play();
  //     } else {
  //       player.pause();
  //     }
  //   });
  // };

  // const { mobile } = useSelector((state: AppState) => state.device);
  return (
    <div className={styles.videoPopupContainer}>
      <div
        className={mobile ? styles.crossHellomobile : styles.crossHello}
        onClick={closeModal}
      >
        <i
          className={cs(
            iconStyles.icon,
            iconStyles.iconCrossNarrowBig,
            styles.icon,
            styles.iconCross
          )}
        ></i>
      </div>
      <iframe
        src={`https://viewer.helloar.io?id=${code}`}
        height="100%"
        width="100%"
        allow="xr-spatial-tracking;fullscreen;"
        frameBorder="0"
      ></iframe>
      {/* <div className={cs(globalStyles.ceriseBtn, styles.cta)}>
        <Link to="/cart" onClick={closeModal}>
          Discover Bosporus
        </Link>
      </div> */}
    </div>
  );
};

export default HelloarPopup;
