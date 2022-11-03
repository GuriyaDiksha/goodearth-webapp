import React, { useState, Fragment, useLayoutEffect, useEffect } from "react";
import cs from "classnames";
import { MobileDropdownMenuProps } from "./typing";
import styles from "./styles.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
import iconStyles from "../../styles/iconFonts.scss";
// import useOutsideDetection from "../../../hooks/useOutsideDetetion";
import globalStyles from "styles/global.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import { useDispatch } from "react-redux";
import { updateScrollDown } from "actions/info";

const PlpDropdownMenu = ({
  filterCount,
  open,
  list,
  showCaret,
  value,
  onChange,
  onStateChange,
  sortedDiscount,
  toggleSort
}: MobileDropdownMenuProps): JSX.Element => {
  const [menuOpen, setOpenState] = useState(open || false);
  const [displayValue, setDisplayValue] = useState(value || "");
  const [showmobileSort, setShowmobileSort] = useState(false);
  const [showmobileFilterList, setShowmobileFilterList] = useState(false);
  const [mobileFilter, setMobileFilter] = useState(false);
  const canUseDOM = !!(
    typeof window !== "undefined" &&
    typeof window.document !== "undefined" &&
    typeof window.document.createElement !== "undefined"
  );

  const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

  const { scrollDown, showTimer } = useSelector(
    (state: AppState) => state.info
  );
  const dispatch = useDispatch();
  const clickMobilefilter = (value: string) => {
    if (value == "Refine") {
      setShowmobileFilterList(true);
      setOpenState(true);
      onStateChange(true);
    } else {
      dispatch(updateScrollDown(true));
      setShowmobileSort(true);
      setShowmobileFilterList(true);
      setOpenState(true);
      toggleSort && toggleSort(false);
    }
  };
  const onInsideClick = () => {
    dispatch(updateScrollDown(false));
    setOpenState(!menuOpen);
    setShowmobileSort(false);
    setShowmobileFilterList(false);
    setMobileFilter(false);
    onStateChange(false);
    toggleSort && toggleSort(true);
  };

  useIsomorphicLayoutEffect(() => {
    if (showCaret) {
      onInsideClick();
    }
  }, [showCaret]);

  useEffect(() => {
    setDisplayValue(value || displayValue);
  }, [value]);

  const onIClickSelected = (data: any) => {
    setDisplayValue(data.value);
    setOpenState(false);
    setShowmobileSort(false);
    setShowmobileFilterList(false);
    onChange(data.value, data.label);
  };
  useEffect(() => {
    if (showmobileSort || menuOpen) {
      document.body.classList.add(globalStyles.noScroll);
    } else {
      document.body.classList.remove(globalStyles.noScroll);
    }
  }, [showmobileSort, menuOpen]);

  return (
    <div
      className={cs(styles.cSort, bootstrap.col12, styles.filterSticky, {
        [styles.hide]: scrollDown
      })}
    >
      <div
        className={cs(
          {
            [globalStyles.hidden]: menuOpen
          },
          bootstrap.col12,
          {
            [styles.productNumber]: !menuOpen
          }
        )}
      >
        {" "}
        <div
          className={
            mobileFilter
              ? cs(
                  styles.mobileFilterHeader,
                  { [styles.mobileFilterHeaderTimer]: showTimer },
                  globalStyles.active,
                  globalStyles.hideLeft
                )
              : globalStyles.hideLeft
          }
        ></div>
        <Fragment>
          <div
            className={styles.mobileProduct}
            onClick={() => {
              clickMobilefilter("Refine");
            }}
          >
            {filterCount ? (
              <span>{`Filter By ( ${filterCount} )`}</span>
            ) : (
              <span>Refine</span>
            )}
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
        className={cs(
          {
            // [globalStyles.hidden]: !menuOpen
          },
          bootstrap.col12,
          styles.productNumber,
          { [styles.noPadding]: !menuOpen }
        )}
      >
        {/* headers when menu is open */}
        <div className={cs({ [styles.mobileFilterSortBg]: showmobileSort })}>
          <div
            className={cs(
              styles.mobileFilterHeader,
              { [styles.mobileFilterHeaderTimer]: showTimer },
              globalStyles.hideLeft,
              {
                [globalStyles.active]: showmobileFilterList && !showmobileSort
              }
            )}
          >
            {filterCount ? (
              <span>
                <pre>
                  {[
                    "FILTER BY  ",
                    <span key="filter-count">{`( ${filterCount} )`}</span>
                  ]}
                </pre>
              </span>
            ) : (
              <span>FILTER BY</span>
            )}
            {/* <span onClick={onInsideClick}>X</span> */}
            <i
              className={cs(
                iconStyles.icon,
                iconStyles.iconCrossNarrowBig,
                styles.iconStyle,
                styles.iconSearchCross,
                styles.crossIcon
              )}
              onClick={onInsideClick}
            ></i>
          </div>
          <div
            className={cs(
              styles.mobileFilterHeader,
              { [styles.mobileFilterHeaderTimer]: showTimer },
              globalStyles.hideBottom,
              sortedDiscount
                ? styles.mobileFilterHeaderSortDiscount
                : styles.mobileFilterHeaderSort,
              {
                [globalStyles.active]: showmobileFilterList && showmobileSort
              }
            )}
          >
            <span>{"Sort By"}</span>

            <span onClick={onInsideClick}>X</span>
          </div>
          <div className={cs(bootstrap.row, styles.minimumWidth)}>
            <div
              className={cs(
                bootstrap.col12,
                styles.mobileFilterMenu,
                { [styles.mobileFilterMenuTimer]: showTimer },
                globalStyles.hideBottom,
                styles.mobileFilterMenuSort,
                {
                  [globalStyles.active]: showmobileSort
                }
              )}
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
                        [styles.goldColor]: displayValue == data.value
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
