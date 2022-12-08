import MakerEnhance from "components/maker";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "../../styles.scss";
import landing from "./landing.scss";
import globalStyles from "../../../../styles/global.scss";
import cs from "classnames";
import Jaali from "./../../../../images/careers/jaali.png";
import Opportunities from "./opportunities";
import { CareerData } from "reducers/career/typings";
import CareerService from "services/career";
import { updateDeptList } from "actions/career";

const Landing: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const {
    currency,
    user: { isLoggedIn }
  } = useSelector((state: AppState) => state);
  const { depts }: CareerData = useSelector((state: AppState) => state.career);
  const { showTimer } = useSelector((state: AppState) => state.info);
  const dispatch = useDispatch();
  const canUseDOM = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  useEffect(() => {
    CareerService.fetchDeptListData(dispatch).then(res => {
      dispatch(updateDeptList(res));
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
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
      {depts?.length ? (
        <div className={styles.landingContainer}>
          <Opportunities
            data={depts || []}
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
