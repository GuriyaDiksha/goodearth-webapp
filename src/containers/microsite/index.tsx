import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import back from "../../images/back.svg";
import cs from "classnames";

const Microsite: React.FC = (props: any) => {
  const history = useHistory();
  const {
    device: { mobile },
    info: { microUrl, showTimer }
  } = useSelector((state: AppState) => state);
  if (!props.id) {
    history.replace(`/microsite/${microUrl}`);
  }
  return (
    <div className={cs(styles.makerTop, { [styles.makerTopTimer]: showTimer })}>
      <div
        className={mobile ? styles.subHeadingMobile : styles.subHeading}
        onClick={() => {
          history.push("/account/cerise");
        }}
      >
        <img src={back} className={styles.backImage}></img>
        {/* {mobile ? "< Back" : "< Back to My Account"} */}
      </div>
      <iframe
        className={styles.iframeBox}
        src={`https://goodearthindia.mloyalretail.com/microsite/default_new.asp?cid=${
          props.id ? props.id : microUrl
        }`}
      ></iframe>
    </div>
  );
};

export default Microsite;
