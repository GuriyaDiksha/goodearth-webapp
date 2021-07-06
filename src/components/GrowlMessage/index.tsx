import React, { useEffect } from "react";
import cs from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { hideMessage } from "actions/growlMessage";
import iconStyles from "styles/iconFonts.scss";
import styles from "./styles.scss";
import { AppState } from "reducers/typings";
import { Messages } from "constants/messages";

type Props = {
  text: string;
  id: string;
  timeout: number;
  params?: any;
};

const Growl: React.FC<Props> = ({ text, id, timeout, params }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    // if timeout == 0 don't close the growl
    if (timeout) {
      const timeoutId = setTimeout(() => {
        dispatch(hideMessage(id));
      }, timeout);
      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, []);
  const closeMessage = (id: string) => {
    dispatch(hideMessage(id));
  };
  let renderText: any = text;
  if (text in Messages) {
    renderText = Messages[text];
  }
  if (params) {
    renderText = Messages[text](params);
  }

  return (
    <div className={styles.growl} key={id}>
      <div className={styles.innerContainer}>
        <div>{renderText}</div>
        <span>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.closeButton
            )}
            onClick={() => closeMessage(id)}
          />
        </span>
      </div>
    </div>
  );
};
const GrowlMessage: React.FC = () => {
  const growlMessages = useSelector((state: AppState) => state.message);
  return (
    <div
      className={cs(styles.container, {
        [styles.visible]: growlMessages.length > 0
      })}
    >
      {growlMessages &&
        growlMessages.length > 0 &&
        growlMessages.map(growlMessage => {
          return (
            <Growl
              key={growlMessage.id}
              text={growlMessage.text}
              id={growlMessage.id}
              timeout={growlMessage.timeout}
              params={growlMessage.params}
            />
          );
        })}
    </div>
  );
};

export default GrowlMessage;
