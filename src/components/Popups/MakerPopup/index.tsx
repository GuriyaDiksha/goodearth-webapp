import React, { useContext, useEffect, useState } from "react";
import cs from "classnames";
// import iconStyles from "../../styles/iconFonts.scss";
// import bootstrapStyles from "../../../styles/bootstrap/bootstrap-grid.scss";
import globalStyles from "styles/global.scss";
import styles from "../styles.scss";
// import { PopupProps } from "./typings";
import iconStyles from "styles/iconFonts.scss";
import { Context } from "components/Modal/context";
import MakerEnhance from "components/maker";
import { useLocation } from "react-router";
// import { currencyCodes } from "constants/currency";
// import { useSelector } from "react-redux";
// import { AppState } from "reducers/typings";

type PopupProps = {
  //   remainingAmount: number;
  // closeModal: (data?: any) => any;
  acceptCondition: (data?: any) => any;
};
const FreeShipping: React.FC<PopupProps> = props => {
  //   const [isLoading, setIsLoading] = useState(false);
  const [showMaker, setShowMaker] = useState(false);
  useEffect(() => {
    setShowMaker(true);
  }, []);
  const { closeModal } = useContext(Context);
  //   const currency = useSelector((state: AppState) => state.currency);
  const location = useLocation();
  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktop,
          styles.centerpageMobile,
          // styles.makerPopupDesktop,
          // styles.makerPopupMobile,
          globalStyles.textCenter
        )}
      >
        <div
          className={styles.cross}
          onClick={() => {
            props.acceptCondition();
            closeModal();
          }}
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
        {showMaker && (
          <div className={styles.makerMargin}>
            <MakerEnhance
              user="goodearth"
              index="2"
              href={`${window.location.origin}${location.pathname}?${location.search}`}
            />
          </div>
        )}
      </div>
    </div>
    // </div>
  );
};

export default FreeShipping;
