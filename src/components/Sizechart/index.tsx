import React, { useEffect, useState } from "react";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import cs from "classnames";
import Accordion from "components/Accordion";
import { Section } from "components/Accordion/typings";
import { SizeChartProps } from "./typings";
import FitGuide from "./FitGuide";
import SizeGuide from "./SizeGuide";
import { useDispatch, useSelector } from "react-redux";
import { updateSizeChartShow } from "actions/header";
import { SizeChartResponse } from "reducers/header/typings";

const Sizechart: React.FC<SizeChartProps> = ({ active }) => {
  const [hideScroll, setHideScroll] = useState(false);
  const { fitGuide }: SizeChartResponse | any = useSelector(
    (state: AppState) => state.header.sizeChartData.data
  );

  const { image } = fitGuide;
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
      header: "SIZE CHART",
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
          <div>
            <span>SIZE GUIDE</span>
          </div>
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
            <Accordion
              sections={sections}
              defaultOpen="sizeGuide"
              className="size-guide-accordion"
              headerClassName={styles.header}
              bodyClassName={styles.accordionBody}
              sectionClassName={styles.accordionSection}
              openIconClassName={cs(styles.arrow, styles.open)}
              closedIconClassName={cs(styles.arrow, styles.close)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sizechart;
