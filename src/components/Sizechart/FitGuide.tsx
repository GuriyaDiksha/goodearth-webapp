import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import { SizeChartResponse } from "reducers/header/typings";

const FitGuide: React.FC = () => {
  const { fitGuide }: SizeChartResponse | any = useSelector(
    (state: AppState) => state.header.sizeChartData.data
  );

  const { image, pointers } = fitGuide;

  return (
    <div className={styles.fitGuide}>
      <img src={image} />
      <ol>
        {pointers.map((point: string, index: number) => (
          <li key={index}>{point}</li>
        ))}
      </ol>
    </div>
  );
};
export default FitGuide;
