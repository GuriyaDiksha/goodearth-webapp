import React, { useLayoutEffect, useState } from "react";
import MakerEnhance from "maker-enhance";
import styles from "./styles.scss";

const Home: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  });
  return (
    <div className={styles.makerTop}>
      {mounted && <MakerEnhance user="goodearth" index="1" />}
    </div>
  );
};

export default Home;
