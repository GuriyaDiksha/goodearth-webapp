import Toggle from "components/Toggle";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";

const SizeGuide: React.FC = () => {
  const {
    data: {
      sizeGuide: { data, measurements, sizes, note, disclaimer }
    }
  } = useSelector((state: AppState) => state.header.sizeChartData);
  const values = ["in", "cms"];
  const [unit, setUnit] = useState("in");
  const roundHalf = useCallback((num: number) => {
    return Math.round((num - 0.25) / 0.5) * 0.5;
  }, []);
  return (
    <>
      <Toggle
        values={values as string[]}
        activeIndex={unit == "in" ? 0 : 1}
        handleClick={index => setUnit(values[index])}
      />
      <div className={styles.smallTxt}>*Tap on size to select</div>
      <div className={styles.tableContainer}>
        <table className={styles.tableContent}>
          <tr>
            <th scope="col">Measurements</th>
          </tr>
          {measurements.map((measurement, i) => (
            <tr key={i}>
              <th scope="row">{measurement}</th>
            </tr>
          ))}
        </table>
        <table className={styles.tableContent}>
          <thead>
            <tr>
              {sizes.map((size, i) => (
                <th key={i} scope="col">
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((dataRow, i) => {
              return (
                <tr key={i}>
                  {dataRow.map((dataItem, j) => (
                    <td key={j}>
                      {unit == "in" ? dataItem : roundHalf(dataItem * 2.54)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.footer}>
        <p>
          Note:{" "}
          {note ? (
            note
          ) : (
            <>
              This is a size guide for basic body measurements.
              <br />
              Measurements may vary from person to person so please refer to the
              product measurements also.
            </>
          )}
        </p>
        <p>
          {disclaimer ? (
            disclaimer
          ) : (
            <>
              Upper measuring tolerance +/- 1/2&quot;
              <br />
              Lower measuring tolerance +/- 1/2&quot;
            </>
          )}
        </p>
      </div>
    </>
  );
};
export default SizeGuide;
