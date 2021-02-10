import React, { useEffect } from "react";
import styles from "./styles.scss";
import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";

const Home: React.FC = () => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
    dataLayer.push(function(this: any) {
      this.reset();
    });
    dataLayer.push({
      event: "HomePageView",
      PageURL: location.pathname,
      PageTitle: "virtual_homePage_view"
    });
  }, []);

  return (
    <div className={styles.makerTop}>
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  );
};

export default Home;
