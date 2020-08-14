import React, { useLayoutEffect, useState } from "react";
import MakerEnhance from "../../components/maker";
import styles from "./styles.scss";
import { useLocation } from "react-router";

const Home: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  useLayoutEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  });
  return (
    <div className={styles.makerTop}>
      {mounted && (
        <MakerEnhance
          user="goodearth"
          index="1"
          href={`${window.location.origin}${location.pathname}?${location.search}`}
        />
      )}
    </div>
  );
};

export default Home;
