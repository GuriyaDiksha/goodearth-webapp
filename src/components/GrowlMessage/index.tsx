import React, { ReactElement, useEffect } from "react";
import cs from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { hideMessage } from "actions/growlMessage";
import iconStyles from "styles/iconFonts.scss";
import styles from "./styles.scss";
import { AppState } from "reducers/typings";

type Props = {
  text: string | (string | JSX.Element)[] | ReactElement;
  id: string;
  timeout: number;
};

const Growl: React.FC<Props> = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(hideMessage(props.id));
    }, props.timeout);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);
  const closeMessage = (id: string) => {
    dispatch(hideMessage(id));
  };
  return (
    <div className={styles.growl} key={props.id}>
      <div className={styles.innerContainer}>
        <div>{props.text}</div>
        <span>
          <i
            className={cs(
              iconStyles.icon,
              iconStyles.iconCrossNarrowBig,
              styles.closeButton
            )}
            onClick={() => closeMessage(props.id)}
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
            />
          );
        })}
    </div>
  );
};

export default GrowlMessage;
