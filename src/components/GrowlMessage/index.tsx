import React, { useEffect } from "react";
import cs from "classnames";
import { useStore } from "react-redux";
import { Props } from "./typings";
import { hideMessage } from "actions/growlMessage";
import iconStyles from "styles/iconFonts.scss";
import styles from "./styles.scss";

const GrowlMessage: React.FC<Props> = ({ text, timeout = 3000 }) => {
  const store = useStore();
  let timeoutId: number | undefined;
  const closeMessage = () => {
    window.clearTimeout(timeoutId);
    store.dispatch(hideMessage());
  };

  useEffect(() => {
    if (text) {
      timeoutId = window.setTimeout(closeMessage, timeout);
    }
  }, [text]);

  return (
    <div
      className={cs(styles.container, {
        [styles.visible]: text
      })}
    >
      <div className={styles.innerContainer}>
        <div>{text}</div>
        <span>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.closeButton
            )}
            onClick={closeMessage}
          />
        </span>
      </div>
    </div>
  );
};

export default GrowlMessage;
