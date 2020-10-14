import React, { useContext } from "react";
import { useStore } from "react-redux";
import cs from "classnames";
import CheckoutService from "services/checkout";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Context } from "components/Modal/context.ts";
import iconStyles from "styles/iconFonts.scss";

type Props = {};

const BackendPopup: React.FC<Props> = () => {
  const { dispatch } = useStore();

  const { closeModal } = useContext(Context);

  const clearBoBasket = async () => {
    CheckoutService.clearBoBasket(dispatch)
      .then(data => {
        closeModal();
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      <div
        className={cs(
          styles.sizeBlockPopup,
          styles.sizeBlockNotFixed,
          styles.centerpageDesktop,
          styles.centerpageMobile,
          globalStyles.textCenter
        )}
      >
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
        <div className={styles.gcTnc}>
          <div className={globalStyles.c22AI}></div>
          <div className={globalStyles.c10LR}>
            <p>
              {`By modifying the contents of this cart, all special promos and
              discounts will be removed.`}
            </p>
            <p>Are you sure want to proceed ? </p>
          </div>
          <div className={cs(globalStyles.ceriseBtn, styles.ceriseBtn70)}>
            <a
              onClick={() => {
                closeModal();
              }}
            >
              {`NO, DON'T REMOVE THE DISCOUNT`}
            </a>
          </div>
          <div className={styles.ctxLight}>
            <p
              onClick={() => {
                clearBoBasket();
              }}
            >
              YES, PROCEED
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendPopup;
