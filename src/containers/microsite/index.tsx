import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";

const Microsite: React.FC<{ url: string }> = props => {
  const {
    info: { microUrl }
  } = useSelector((state: AppState) => state);

  return (
    <div className={styles.makerTop}>
      <iframe
        src={`https://goodearthindia.mloyalretail.com/microsite/default.asp?cid=${microUrl}`}
      ></iframe>
    </div>
  );
};

export default Microsite;
