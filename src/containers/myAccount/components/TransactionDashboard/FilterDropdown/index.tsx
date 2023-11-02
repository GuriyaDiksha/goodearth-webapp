import React, { useState, useEffect } from "react";
import { SecondaryHeaderDropdownMenuProps } from "./typings";
import cs from "classnames";
import useOutsideDetection from "../../../../../hooks/useOutsideDetetion";
import styles from "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "reducers/typings";
import Close from "./../../../../../icons/CloseButtonCharcoal.svg";
import { updateIsLoyaltyFilterOpen } from "actions/info";
import globalStyles from "../../../../../styles/global.scss";
import Button from "components/Button";

const FilterDropdown = ({
  id,
  value,
  onChange,
  items,
  className,
  isCheckBox,
  handleCheckbox,
  setOldFilterState,
  cancelFilter
}: SecondaryHeaderDropdownMenuProps) => {
  const [menuOpen, setOpenState] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const {
    device: { mobile }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (mobile) {
      if (menuOpen) {
        document.body.classList.add(globalStyles.noScroll);
      } else {
        document.body.classList.remove(globalStyles.noScroll);
      }
      dispatch(updateIsLoyaltyFilterOpen(menuOpen));
    }
  }, [menuOpen]);

  const onInsideClick = () => {
    setOpenState(!menuOpen);
    if (mobile) {
      setOldFilterState();
    }
    const elem = document.getElementById(id) as HTMLDivElement;
    if (elem && !mobile) {
      if (!elem.style.maxHeight) {
        elem.style.maxHeight = elem.scrollHeight + "px";
      } else {
        elem.style.removeProperty("max-height");
      }
    }
  };

  const onOutsideClick = (event: MouseEvent) => {
    setOpenState(false);
    const elem = document.getElementById(id) as HTMLDivElement;
    if (elem) {
      elem.style.removeProperty("max-height");
    }
  };

  const handleItemClick = (item: any) => {
    onInsideClick();
    setOpenState(false);
    onChange(item.value);
  };

  useEffect(() => {
    let val = "";
    items.map(item => {
      if (item.value == value) {
        val = item.label;
      }
    });
    setDisplayValue(val);
  }, [value]);

  const { ref } = useOutsideDetection<HTMLDivElement>(onOutsideClick);

  return (
    <div className={cs(styles.container)} ref={ref}>
      <div
        className={cs(styles.label, { [styles.firstFilter]: className })}
        onClick={onInsideClick}
      >
        <span className={cs(styles.labelText)}>{displayValue}</span>
        <span
          className={cs(styles.labelIcon, styles.caret, {
            [styles.caretUp]: menuOpen
          })}
        ></span>
      </div>
      <div
        id={id}
        className={cs(styles.listContainer, { [styles.open]: menuOpen })}
      >
        <ul>
          {mobile ? (
            <li className={styles.filterWrp}>
              <p className={styles.filterLabel}>
                Filter By
                <img
                  src={Close}
                  onClick={() => {
                    setOpenState(!menuOpen);
                  }}
                />
              </p>
            </li>
          ) : null}
          {items.map(item => {
            return (
              <li
                key={item.id}
                onClick={e => {
                  if (isCheckBox) {
                    e.preventDefault();
                    handleCheckbox && handleCheckbox(item?.value);
                  } else {
                    if (mobile) {
                      e.preventDefault();
                      handleCheckbox && handleCheckbox(item?.value);
                    } else {
                      handleItemClick(item);
                    }
                  }
                }}
              >
                {isCheckBox ? (
                  <input
                    type="checkbox"
                    checked={value === item?.value || value === "ALL"}
                    className={styles.toggleCheckbox}
                    onChange={e => {
                      e.preventDefault();
                      handleCheckbox && handleCheckbox(item?.value);
                    }}
                  />
                ) : null}
                <label
                  className={displayValue === item?.label ? styles.active : ""}
                >
                  {item.label}
                </label>
              </li>
            );
          })}
          {isCheckBox && !mobile ? (
            <li className={styles.applyBtnWrp}>
              <Button
                onClick={e => {
                  handleItemClick(value);
                }}
                label={"Apply Selection"}
                variant="smallAquaCta"
              />
            </li>
          ) : null}
          {mobile ? (
            <li className={styles.btnWrp}>
              <Button
                onClick={() => {
                  cancelFilter();
                  setOpenState(!menuOpen);
                }}
                label={"cancel"}
                variant="outlineSmallMedCharcoalCta"
              />

              <Button
                variant="smallAquaCta"
                onClick={() => {
                  setOpenState(!menuOpen);
                  if (isCheckBox) {
                    handleItemClick(value);
                  } else {
                    handleItemClick({ value });
                  }
                }}
                label={isCheckBox ? "apply selection" : "apply sort by"}
              />
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
};

export default FilterDropdown;
