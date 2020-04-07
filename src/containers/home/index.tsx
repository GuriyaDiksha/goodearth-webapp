import React from "react";
import MakerEnhance from "maker-enhance";
import styles from "./styles.scss";

const Home: React.FC = () => {
  return (
    <div className={styles.makerTop}>
      <MakerEnhance user="goodearth" />
    </div>
  );
};

export default Home;
