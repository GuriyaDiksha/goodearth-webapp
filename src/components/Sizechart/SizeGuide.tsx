import Toggle from "components/Toggle";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import sizeStyles from "../SizeSelector/styles.scss";
import cs from "classnames";
import { ChildProductAttributes } from "typings/product";
import { updateSizeChartSelected } from "actions/header";

const SizeGuide: React.FC = () => {
  const {
    data: {
      sizeGuide: { data, measurements, note, disclaimer }
    },
    sizes,
    isCorporatePDP
  } = useSelector((state: AppState) => state.header.sizeChartData);
  const selected = useSelector(
    (state: AppState) => state.header.sizeChartData.selected
  );
  const values = ["in", "cms"];
  const [unit, setUnit] = useState("in");
  const roundHalf = useCallback((num: number) => {
    return Math.round(num / 0.5) * 0.5;
  }, []);
  const dispatch = useDispatch();
  const sizeClickHandler = (child: ChildProductAttributes) => {
    dispatch(updateSizeChartSelected(child.id));
  };
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
              {sizes.map(child => {
                const { id, size, stock, sku } = child;
                return (
                  <th scope="col" key={sku}>
                    <div
                      className={cs(sizeStyles.sizeButton, {
                        [sizeStyles.selected]: id === selected,
                        [sizeStyles.unavailable]: stock === 0 && !isCorporatePDP
                      })}
                      onClick={() => sizeClickHandler(child)}
                    >
                      {size}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((dataRow, i) => {
              return (
                <tr key={i}>
                  {dataRow.map((dataItem, j) => (
                    <td
                      key={j}
                      className={cs({
                        [styles.disabled]: sizes.length > j && !sizes[j]?.stock
                      })}
                    >
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
