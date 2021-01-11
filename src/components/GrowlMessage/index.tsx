import React, { ReactElement } from "react";
import cs from "classnames";
import { useSelector, useStore } from "react-redux";
import { hideMessage } from "actions/growlMessage";
import iconStyles from "styles/iconFonts.scss";
import styles from "./styles.scss";
import { AppState } from "reducers/typings";

const GrowlMessage: React.FC = () => {
  const store = useStore();
  const growlMessages = useSelector((state: AppState) => state.message);
  const closeMessage = (id: string) => {
    store.dispatch(hideMessage(id));
  };

  const Growl = (props: {
    text: string | (string | JSX.Element)[] | ReactElement;
    id: string;
  }) => (
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
            />
          );
        })}
    </div>
  );
};

export default GrowlMessage;
