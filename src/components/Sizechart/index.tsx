import React from "react";
import styles from "./styles.scss";
import globalStyles from "../../styles/global.scss";
import iconStyles from "../../styles/iconFonts.scss";
import cs from "classnames";
import Accordion from "components/Accordion";
import { Section } from "components/Accordion/typings";
import { SizeChartProps } from "./typings";
import FitGuide from "./FitGuide";
import SizeGuide from "./SizeGuide";
import { useDispatch } from "react-redux";
import { updateSizeChartShow } from "actions/header";

const Sizechart: React.FC<SizeChartProps> = ({ active }) => {
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
      body: <SizeGuide />,
      id: "sizeGuide"
    }
  ];
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
          { [styles.smoothOut]: !active }
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
          <Accordion
            sections={sections}
            defaultOpen="sizeGuide"
            className=""
            headerClassName={styles.header}
            bodyClassName={styles.body}
            headerClosedClassName={styles.headerClosed}
            openIconClass={cs(styles.arrow, styles.open)}
            closedIconClass={cs(styles.arrow, styles.close)}
          />
        </div>
      </div>
    </div>
  );
};

export default Sizechart;
