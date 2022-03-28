import MakerEnhance from "components/maker";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "../styles.scss";

const Landing: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const {
    currency,
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);
  const {
    facets: { depts }
  } = useSelector((state: AppState) => state.career);
  useLayoutEffect(() => {
    setMounted(false);
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, [currency, isLoggedIn]);
  return (
    <>
      {mounted && (
        <MakerEnhance
          user="goodearth"
          href={`${window.location.origin}${location.pathname}?${location.search}`}
        />
      )}
      <div className={styles.landingContainer}>
        <h1>Opportunities at Good Earth</h1>
      </div>
    </>
  );
};

export default Landing;
