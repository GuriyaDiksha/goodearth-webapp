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

  const closeMessage = (id: string) => {
    const element = document.getElementById(`growl_${id}`);
    if (element) {
      element.style.transform = "translateX(500px)";
      setTimeout(() => {
        dispatch(hideMessage(id));
      }, 900);
    } else {
      dispatch(hideMessage(id));
    }
  };

  useEffect(() => {
    // if timeout == 0 don't close the growl
    if (timeout) {
      const timeoutId = setTimeout(() => {
        closeMessage(id);
      }, timeout);
      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, []);

  let renderText: any = text;
  if (text in Messages) {
    renderText = Messages[text];
  }
  if (params) {
    renderText = Messages[text](params);
  }

  return (
    <div className={styles.growl} key={`growl_${id}`}>
      <div className={styles.innerContainer} id={`growl_${id}`}>
        <div>{renderText}</div>
        <div className={styles.assetContainer}>
          <div className={cs(styles.separator)}></div>
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
    </div>
  );
};
const GrowlMessage: React.FC = () => {
  const growlMessages: [] = useSelector((state: AppState) => state.message);
  return (
    <div
      className={cs(styles.container, {
        [styles.visible]: growlMessages?.length > 0
      })}
    >
      {growlMessages &&
        growlMessages?.length > 0 &&
        growlMessages?.map((growlMessage: any) => {
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
