import React, { useEffect, useState } from "react";
import cs from "classnames";
import { MobileDropdownMenuProps } from "./typing";
import styles from "./styles.scss";
import bootstrap from "../../styles/bootstrap/bootstrap-grid.scss";
// import useOutsideDetection from "../../../hooks/useOutsideDetetion";
import globalStyles from "styles/global.scss";
import { useSelector } from "react-redux";
import { AppState } from "reducers/typings";

const ShopDropdownMenu = ({
  open,
  list,
  showCaret,
  value,
  onChange
}: MobileDropdownMenuProps): JSX.Element => {
  const [menuOpen, setOpenState] = useState(open || false);
  const [displayValue, setDisplayValue] = useState(value || "");
  const { showTimer } = useSelector((state: AppState) => state.info);
  const onInsideClick = () => {
    setOpenState(!menuOpen);
  };
  const onIClickSelected = (data: any) => {
    setDisplayValue(data.label);
    setOpenState(false);
    onChange(data.value);
  };

  useEffect(() => {
    setDisplayValue(value || "");
  }, [value]);

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
          className={cs(styles.cSortHeader, {
            [styles.cSortHeaderTimer]: showTimer
          })}
          id="shopLocatorDropdown"
        >
          {showCaret ? (
            <div className={styles.collectionHeader} onClick={onInsideClick}>
              <span>shop locator</span>
              <span>{displayValue}</span>
            </div>
          ) : (
            <div className={styles.noArrowHeader}>
              <span>shop locator</span>
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
            <span>shop locator</span>
            <span onClick={onInsideClick}>X</span>
          </div>
          <div className={cs(bootstrap.row, styles.minimumWidth)}>
            <div
              className={cs(bootstrap.col12, styles.mobileFilterMenu, {
                [styles.mobileFilterMenuTimer]: showTimer
              })}
              id="shopLocatorDropdownMenu"
            >
              <ul className={styles.sort}>
                {list.map((data: any, i: number) => {
                  return (
                    <li
                      value={data}
                      onClick={() => {
                        onIClickSelected(data);
                      }}
                      key={i}
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

export default ShopDropdownMenu;
