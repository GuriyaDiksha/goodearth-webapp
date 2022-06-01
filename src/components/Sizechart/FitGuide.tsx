import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";

const FitGuide: React.FC = () => {
  const { image, pointers } = useSelector(
    (state: AppState) => state.header.sizeChartData.data.fitGuide
  );
  return (
    <div className={styles.fitGuide}>
      <img src={image} />
      <ol>
        {pointers.map(
          (
            point:
              | boolean
              | React.ReactChild
              | React.ReactFragment
              | React.ReactPortal
              | null
              | undefined,
            index: React.Key | undefined
          ) => (
            <li key={index}>{point}</li>
          )
        )}
      </ol>
    </div>
  );
};
export default FitGuide;
