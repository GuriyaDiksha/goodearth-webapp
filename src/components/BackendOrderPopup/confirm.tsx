import React, { useContext } from "react";
import { useSelector, useStore } from "react-redux";
import cs from "classnames";
import CheckoutService from "services/checkout";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Context } from "components/Modal/context";
import iconStyles from "styles/iconFonts.scss";
import { updateShippingAddressId } from "actions/address";
import { AppState } from "reducers/typings";

type Props = {};

const BackendPopupConfirm: React.FC<Props> = () => {
  const { dispatch } = useStore();

  const { closeModal } = useContext(Context);

  const { shippingData } = useSelector((state: AppState) => state.user);

  const clearBoBasket = async () => {
    CheckoutService.clearBoBasket(dispatch)
      .then(data => {
        closeModal();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const saveOldAddressOnClose = () => {
    dispatch(updateShippingAddressId(shippingData?.id || 0));
    closeModal();
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
        <div className={styles.cross} onClick={saveOldAddressOnClose}>
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
          <div className={globalStyles.c22AI}>Remove Discount</div>
          <div className={globalStyles.c10LR}>
            <p>
              {`Are you sure you want to remove the discount applied on your Bag?`}
            </p>
          </div>
          <div className={cs(globalStyles.ceriseBtn, styles.ceriseBtn70)}>
            <a
              onClick={() => {
                saveOldAddressOnClose();
              }}
            >
              {`NO, DON'T REMOVE`}
            </a>
          </div>
          <div className={cs(styles.ctxLight, globalStyles.pointer)}>
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

export default BackendPopupConfirm;
