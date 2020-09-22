import React, { useState, Fragment, useLayoutEffect } from "react";
import cs from "classnames";
import { MobileDropdownMenuProps } from "./typing";
import styles from "./styles.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
// import useOutsideDetection from "../../../hooks/useOutsideDetetion";
import globalStyles from "styles/global.scss";

const PlpDropdownMenu = ({
  open,
  list,
  showCaret,
  value,
  onChange,
  onStateChange
}: MobileDropdownMenuProps): JSX.Element => {
  const [menuOpen, setOpenState] = useState(open || false);
  const [displayValue, setDisplayValue] = useState(value || "");
  const [showmobileSort, setShowmobileSort] = useState(false);
  const [showmobileFilterList, setShowmobileFilterList] = useState(false);
  const [mobileFilter, setMobileFilter] = useState(false);
  const clickMobilefilter = (value: string) => {
    if (value == "Refine") {
      setShowmobileFilterList(true);
      setOpenState(true);
      onStateChange(true);
    } else {
      setShowmobileSort(true);
      setShowmobileFilterList(true);
      setOpenState(true);
    }
  };
  const onInsideClick = () => {
    setOpenState(!menuOpen);
    setShowmobileSort(false);
    setShowmobileFilterList(false);
    setMobileFilter(false);
    onStateChange(false);
  };

  useLayoutEffect(() => {
    if (showCaret) {
      onInsideClick();
    }
  }, [showCaret]);

  const onIClickSelected = (data: any) => {
    setDisplayValue(data.value);
    setOpenState(false);
    setShowmobileSort(false);
    setShowmobileFilterList(false);
    onChange(data.value);
  };
  return (
    <div className={cs(styles.cSort, bootstrap.col12, styles.filterSticky)}>
      <div
        className={cs({ [globalStyles.hidden]: menuOpen }, bootstrap.col12, {
          [styles.productNumber]: !menuOpen
        })}
      >
        {" "}
        <div
          className={
            mobileFilter ? styles.mobileFilterHeader : globalStyles.hidden
          }
        ></div>
        <Fragment>
          <div
            className={styles.mobileProduct}
            onClick={() => {
              clickMobilefilter("Refine");
            }}
          >
            <span>Refine</span>
          </div>
          <div
            className={
              mobileFilter ? globalStyles.hidden : styles.mobileProduct
            }
            onClick={() => {
              clickMobilefilter("Sort");
            }}
            id="sort"
          >
            <span>Sort</span>
          </div>
        </Fragment>
      </div>
      <div
        className={cs({ [globalStyles.hidden]: !menuOpen }, bootstrap.col12, {
          [styles.productNumber]: menuOpen
        })}
      >
        <div>
          <div
            className={
              showmobileFilterList
                ? styles.mobileFilterHeader
                : globalStyles.hidden
            }
          >
            <span>{showmobileSort ? "Sort" : "Refine"}</span>
            <span onClick={onInsideClick}>X</span>
          </div>
          <div className={cs(bootstrap.row, styles.minimumWidth)}>
            <div
              className={cs(bootstrap.col12, styles.mobileFilterMenu, {
                [globalStyles.hidden]: !showmobileSort
              })}
            >
              <ul className={styles.sort}>
                {list.map((data: any) => {
                  return (
                    <li
                      value={data.value}
                      onClick={() => {
                        onIClickSelected(data);
                      }}
                      key={data.name}
                      className={cs({
                        [globalStyles.cerise]: displayValue == data.value
                      })}
                    >
                      {data.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlpDropdownMenu;
