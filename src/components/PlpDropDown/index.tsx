import React, { useState } from "react";
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
  onChange
}: MobileDropdownMenuProps): JSX.Element => {
  const [menuOpen, setOpenState] = useState(open || false);
  const [displayValue, setDisplayValue] = useState(value || "");

  const clickMobilefilter = () => {};

  const onInsideClick = () => {
    setOpenState(!menuOpen);
  };
  const onIClickSelected = (data: any) => {
    setDisplayValue(data.label);
    setOpenState(false);
    onChange(data.value);
  };

  return (
    <div className={styles.cSort}>
      <div
        className={cs(
          { [globalStyles.hidden]: menuOpen },
          bootstrap.col12,
          styles.productNumber
        )}
      >
        <div
          className={
            this.state.mobileFilter
              ? styles.mobileFilterHeader
              : styles.mobileProduct
          }
          onClick={clickMobilefilter("Refine")}
        >
          {this.state.showmobileSort || this.state.showmobileFilterList ? (
            <div className="filter-cross">
              <span>Refine</span>
              <span onClick={this.clickCloseFilter.bind(this)}>X</span>
            </div>
          ) : (
            <span>Refine</span>
          )}
        </div>
        <div
          className={
            this.state.mobileFilter
              ? "hidden"
              : "hidden-md hidden-lg mobile-product"
          }
          onClick={() => {
            clickMobilefilter("Sort");
          }}
          id="sort"
        >
          <span>Sort</span>
        </div>
        <div className={styles.cSortHeader}>
          {showCaret ? (
            <div className={styles.collectionHeader} onClick={onInsideClick}>
              <span>collections</span>
              <span>{displayValue}</span>
            </div>
          ) : (
            <div className={styles.noArrowHeader}>
              <span>collections</span>
              <span>{displayValue}</span>
            </div>
          )}
        </div>
      </div>
      <div
        className={cs(
          { [globalStyles.hidden]: !menuOpen },
          bootstrap.col12,
          styles.productNumber
        )}
      >
        <div>
          <div className={styles.mobileFilterHeader}>
            <span>Sort</span>
            <span onClick={onInsideClick}>X</span>
          </div>
          <div className={cs(bootstrap.row, styles.minimumWidth)}>
            <div className={cs(bootstrap.col12, styles.mobileFilterMenu)}>
              <ul className={styles.sort}>
                {list.map((data: any) => {
                  return (
                    <li
                      value={data}
                      onClick={() => {
                        onIClickSelected(data);
                      }}
                      key={data.name}
                      className={cs({
                        [globalStyles.cerise]: displayValue == data.label
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
