import Toggle from "components/Toggle";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import styles from "./styles.scss";
import sizeStyles from "../SizeSelector/styles.scss";
import cs from "classnames";
import { SizeGuideProps } from "./typings";
import { ChildProductAttributes } from "typings/product";
import { updateSizeChartSelected } from "actions/header";
import ReactHtmlParser from "react-html-parser";
import { SizeChartResponse } from "reducers/header/typings";

const SizeGuide: React.FC<SizeGuideProps> = memo(({ isSingleSection }) => {
  const {
    data: { sizeGuide, disclaimer, note },
    sizes,
    isCorporatePDP
  }: SizeChartResponse | any = useSelector(
    (state: AppState) => state.header.sizeChartData
  );
  const selected = useSelector(
    (state: AppState) => state.header.sizeChartData.selected
  );

  const { mobile } = useSelector((state: AppState) => state.device);
  const values = ["in", "cms"];
  const [unit, setUnit] = useState("in");
  const roundHalf = useCallback((num: number) => {
    return Math.round(num / 0.5) * 0.5;
  }, []);
  const dispatch = useDispatch();
  const sizeClickHandler = (child: ChildProductAttributes) => {
    dispatch(updateSizeChartSelected(child.id));
  };
  useEffect(() => {
    if (selected && mobile) {
      const selectedSize = sizes.filter(
        (size: ChildProductAttributes) => size.id == selected
      )[0];
      const sizeBtn = document.getElementById(
        `size-guide-item-${selectedSize.size}`
      );
      if (sizeBtn) {
        sizeBtn.scrollIntoView(false);
      }
    }
  }, []);
  return (
    <>
      {isSingleSection ? (
        <div className={styles.singleSectionTitle}>SIZE CHART</div>
      ) : null}
      <Toggle
        values={values as string[]}
        activeIndex={unit == "in" ? 0 : 1}
        handleClick={index => setUnit(values[index])}
      />
      <div className={styles.smallTxt}>*Tap on size to select</div>
      <div
        className={cs(styles.tableContainer, {
          [styles.styleGuideSingleSection]: isSingleSection
        })}
      >
        {sizeGuide.map((guide: any, i: number) => {
          return (
            <table key={i}>
              <thead>
                <tr>
                  <th key={0}>
                    {guide.tableTitle == "" ? "Measurements" : guide.tableTitle}
                  </th>
                  {i == 0
                    ? sizes.map((child: ChildProductAttributes) => {
                        const { id, size, stock, sku } = child;
                        return (
                          <th scope="col" key={sku}>
                            <div
                              className={cs(
                                styles.sizeGuideItem,
                                sizeStyles.sizeButton,
                                {
                                  [sizeStyles.selected]: id === selected,
                                  [sizeStyles.unavailable]:
                                    stock === 0 && !isCorporatePDP
                                }
                              )}
                              onClick={() => sizeClickHandler(child)}
                              id={`size-guide-item-${size}`}
                            >
                              {size}
                            </div>
                          </th>
                        );
                      })
                    : guide.sizes.map((s: string, k: number) => {
                        return (
                          <th scope="col" key={`${s}-${k}`}>
                            <div>{s}</div>
                          </th>
                        );
                      })}
                </tr>
              </thead>
              <tbody>
                {guide.data.map((dataRow: number[], i: number) => {
                  return (
                    <tr key={i}>
                      <td>{guide.measurements[i].replace(/\s/g, " ")}</td>
                      {dataRow.map((dataItem: number, j: number) => (
                        <td
                          key={j}
                          className={cs({
                            [styles.disabled]:
                              sizes.length > j && !sizes[j]?.stock
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
          );
        })}
      </div>
      <div className={cs(styles.footer, styles.singleSectionFooter)}>
        <p>
          Note:{" "}
          {note !== "" ? (
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
          Disclaimer:{" "}
          {disclaimer != "" ? (
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
});
export default SizeGuide;
