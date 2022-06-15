import MakerEnhance from "components/maker";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "../../styles.scss";
import landing from "./landing.scss";
import globalStyles from "../../../../styles/global.scss";
import cs from "classnames";
import Jaali from "./../../../../images/careers/jaali.png";
import Opportunities from "./opportunities";
import { CareerData } from "reducers/career/typings";

const Landing: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const {
    currency,
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);
  const { data }: CareerData = useSelector((state: AppState) => state.career);
  const { showTimer } = useSelector((state: AppState) => state.info);

  useLayoutEffect(() => {
    setMounted(false);
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, [currency, isLoggedIn]);

  const applyNow = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLScO4bArbyl_YeXZqYZtWSrKfFyOp9UVAejgFvbf5UR60k8nOQ/viewform?_ga=2.91865114.1029825071.1647345387-2106724779.1644984711",
      "_blank"
    );
  };

  return (
    <div
      className={cs(globalStyles.containerStart, {
        [globalStyles.containerStartTimer]: showTimer
      })}
    >
      {mounted && (
        <MakerEnhance
          user="goodearth"
          href={`${window.location.origin}${location.pathname}?${location.search}`}
        />
      )}
      {data?.length ? (
        <div className={styles.landingContainer}>
          <Opportunities
            data={data || []}
            title="Opportunities at Good Earth"
          />
        </div>
      ) : null}

      <img className={landing.jaali} src={Jaali} alt="jaali" />

      <div className={landing.apply_section}>
        <h1>Can&apos;t find a role you are looking for?</h1>
        <p>
          Send us your resume and we will reach out once a suitable opportunity
          arises.
        </p>
        <button
          className={landing.apply_section_btn}
          onClick={() => applyNow()}
        >
          Apply now
        </button>
      </div>
    </div>
  );
};

export default Landing;
