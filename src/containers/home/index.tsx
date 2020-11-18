import React, { useEffect, useLayoutEffect, useState } from "react";
import MakerEnhance from "maker-enhance";
import styles from "./styles.scss";
import { useLocation } from "react-router";
import { AppState } from "reducers/typings";
import { useSelector } from "react-redux";

const Home: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { currency } = useSelector((state: AppState) => state);

  useLayoutEffect(() => {
    setMounted(false);
    setTimeout(() => {
      if (!mounted) {
        setMounted(true);
      }
    }, 100);
  }, [currency]);
  useEffect(() => {
    dataLayer.push({
      event: "HomePageView",
      PageURL: location.pathname,
      PageTitle: "virtual_homePage_view"
    });
  }, []);

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
