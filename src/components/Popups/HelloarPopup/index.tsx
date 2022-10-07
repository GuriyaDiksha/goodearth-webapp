// import Loader from "components/Loader";
import React, { useContext } from "react";
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
import header360 from "images/3d/header360.svg";

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
      <div className={cs(styles.header)}>
        <div className={cs(styles.headerContent)}>
          <img src={header360} className={cs(styles.headerIcon)} />
          <div className={cs(styles.headerText)}>
            Spin & Drag to rotate the product
          </div>
        </div>
        <div className={styles.helloArClose} onClick={closeModal}>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.icon,
              styles.iconCross
            )}
          ></i>
        </div>
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
      <div className={cs(styles.footer)}></div>
    </div>
  );
};

export default HelloarPopup;
