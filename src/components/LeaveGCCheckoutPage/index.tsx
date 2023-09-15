import React, { useContext } from "react";
import cs from "classnames";
import globalStyles from "styles/global.scss";
import styles from "./styles.scss";
import { Context } from "components/Modal/context";
import { useHistory } from "react-router";

type Props = {
  location: any;
  action: any;
  history: any;
};

const GCCheckoutConfirm: React.FC<Props> = props => {
  const { closeModal } = useContext(Context);
  const history = useHistory();

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
        <div className={styles.gcTnc}>
          <div className={globalStyles.c22AI}>
            Are you sure you want to exit this page?
          </div>
          <div className={globalStyles.c10LR}>
            <p>
              {`Leaving this page will cancel your gift card checkout and remove the gift card from your cart.`}
            </p>
          </div>
          <div className={cs(globalStyles.ceriseBtn, styles.ceriseBtn70)}>
            <a
              onClick={() => {
                closeModal();
                localStorage.setItem("openGCExitModal", "false");
              }}
            >
              {`NO, CONTINUE WITH CHECKOUT`}
            </a>
          </div>
          <div className={cs(styles.ctxLight, globalStyles.pointer)}>
            <p
              onClick={() => {
                closeModal();
                if (props.action == "PUSH") {
                  history.push(props.location.pathname);
                } else if (props.action == "REPLACE") {
                  history.replace(props.location.pathname);
                } else if (props.action == "POP") {
                  console.log("POP time");
                  // history.goBack();
                }
                localStorage.setItem("openGCExitModal", "false");
              }}
            >
              YES, CANCEL GIFT CARD CHECKOUT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCCheckoutConfirm;
