import React, { useEffect, useState } from "react";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import cs from "classnames";
import NewAccordion from "components/Accordion/newAccordion";
import { Section } from "components/Accordion/typings";
import { SizeChartProps } from "./typings";
import FitGuide from "./FitGuide";
import SizeGuide from "./SizeGuide";
import { useDispatch, useSelector } from "react-redux";
import { updateSizeChartShow } from "actions/header";

const Sizechart: React.FC<SizeChartProps> = ({ active }) => {
  const [hideScroll, setHideScroll] = useState(false);
  const { image } = useSelector(
    (state: AppState) => state.header.sizeChartData.data.fitGuide
  );
  const dispatch = useDispatch();
  const closeSizeChart = () => {
    dispatch(updateSizeChartShow(false));
  };
  const sections: Section[] = [
    {
      header: "FIT GUIDE",
      body: <FitGuide />,
      id: "fitGuide"
    },
    {
      header: "SIZE GUIDE",
      body: <SizeGuide isSingleSection={false} />,
      id: "sizeGuide"
    }
  ];
  useEffect(() => {
    document.body.classList.add(globalStyles.noScroll);
    return () => {
      document.body.classList.remove(globalStyles.noScroll);
    };
  }, []);
  return (
    <div>
      <div
        className={cs(styles.bagBackdrop, active ? styles.active : "")}
        onClick={closeSizeChart}
        id="sizechart"
      ></div>
      <div
        className={cs(
          styles.bag,
          { [styles.active]: active },
          { [styles.smoothOut]: !active },
          { [styles.hideScroll]: hideScroll }
        )}
      >
        <div className={cs(styles.bagHeader, globalStyles.flex)}>
          <div className={globalStyles.pointer} onClick={closeSizeChart}>
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.crossfontSize
              )}
            ></i>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.close}></div>
          {image == "" ? (
            <SizeGuide isSingleSection={true} />
          ) : (
            <NewAccordion
              sections={sections}
              defaultOpen="sizeGuide"
              className="size-guide-accordion"
              headerClassName={styles.header}
              bodyClassName={styles.body}
              headerClosedClassName={styles.headerClosed}
              openIconClass={cs(styles.arrow, styles.open)}
              closedIconClass={cs(styles.arrow, styles.close)}
              setHideScroll={setHideScroll}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sizechart;
